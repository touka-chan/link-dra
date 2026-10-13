// Linkodra local backend: mail endpoint + SQLite order database.
//
// Runs on plain Node, no install beyond `npm install` (uses built-in
// node:sqlite). For localhost development only - production mail lives in
// server/resend-endpoint.php on real hosting.
//
//   1. copy .env.example .env  (then fill RESEND_API_KEY)
//   2. npm run backend:local
//
// Endpoints (all JSON):
//   POST /send        {token,to,name,tier,amount,ref} -> {sent:true|false}
//   POST /api/orders  {id,code,tier,total,paid,refNo,email,name,payload}
//   GET  /api/orders?token=...  (newest first, for verification)
//   GET  /health

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const PORT = 8080;
const FROM = "Linkodra <orders@linkodra.ph>"; // must be your verified Resend domain
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- .env (git-ignored) ------------------------------------------------------
function loadEnv() {
  let text;
  try {
    text = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  } catch {
    return;
  }
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    let v = m[2];
    if (
      (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
      (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
    ) {
      v = v.slice(1, -1);
    }
    if (v === "" || v.startsWith("#")) continue;
    process.env[m[1]] = v;
  }
}
loadEnv();

// --- database ----------------------------------------------------------------
fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
const db = new DatabaseSync(path.join(process.cwd(), "data", "linkodra.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    code TEXT,
    tier TEXT,
    total REAL,
    paid REAL,
    ref_no TEXT,
    email TEXT,
    name TEXT,
    payload TEXT,
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS mail_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    to_email TEXT,
    subject TEXT,
    status TEXT,
    created_at TEXT
  );
`);

const insertOrder = db.prepare(
  "INSERT OR REPLACE INTO orders (id, code, tier, total, paid, ref_no, email, name, payload, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
const listOrders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");
const logMail = db.prepare(
  "INSERT INTO mail_log (to_email, subject, status, created_at) VALUES (?, ?, ?, ?)"
);

// --- helpers -----------------------------------------------------------------
const hits = new Map(); // ip -> [timestamps], 10 sends/hour/IP

function send(res, code, obj) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 200_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
  });
}

function checkRate(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => t > now - 3600_000);
  if (list.length >= 10) return false;
  list.push(now);
  hits.set(ip, list);
  return true;
}

async function handleSend(input, ip) {
  const shared = process.env.LINKODRA_MAIL_TOKEN;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !shared) return { code: 500, body: { sent: false, reason: "not-configured" } };
  if (input?.token !== shared) return { code: 403, body: { sent: false, reason: "forbidden" } };

  const to = typeof input.to === "string" && EMAIL_RE.test(input.to) ? input.to : "";
  if (!to) return { code: 400, body: { sent: false, reason: "bad-recipient" } };
  if (!checkRate(ip)) return { code: 429, body: { sent: false, reason: "rate-limited" } };

  const name = String(input.name || "").slice(0, 80);
  const tier = String(input.tier || "Linkodra card").slice(0, 80);
  const amount = String(input.amount || "").slice(0, 30);
  const ref = String(input.ref || "").replace(/\D/g, "");
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const subject = `Linkodra PH - payment received${ref ? ` (ref ${ref})` : ""} - ${tier}`;
  const html =
    `<p>Hi ${esc(name || "there")},</p>` +
    `<p>Your subscription is confirmed. Your <strong>${esc(tier)}</strong> order is now in our system where you applied.</p>` +
    `<p>Amount paid: <strong>${esc(amount)}</strong><br>` +
    `Reference no.: <strong>${esc(ref || "pending verification")}</strong></p>` +
    `<p>What happens next: we print your card and email your profile link to ${esc(to)}. Reply to this email if anything looks wrong.</p>` +
    `<p>- Linkodra</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    const ok = r.ok;
    logMail.run(to, subject, ok ? "sent" : `failed-${r.status}`, new Date().toISOString());
    if (!ok) console.warn("resend failed:", r.status, await r.text().catch(() => ""));
    return ok
      ? { code: 200, body: { sent: true } }
      : { code: 502, body: { sent: false, reason: "send-failed" } };
  } catch (err) {
    console.warn("resend failed:", err);
    logMail.run(to, subject, "error", new Date().toISOString());
    return { code: 502, body: { sent: false, reason: "send-failed" } };
  }
}

function handleCreateOrder(input) {
  if (!input || typeof input.id !== "string" || !input.id) {
    return { code: 400, body: { ok: false, reason: "bad-order" } };
  }
  insertOrder.run(
    input.id,
    String(input.code || ""),
    String(input.tier || ""),
    Number(input.total) || 0,
    Number(input.paid) || 0,
    String(input.refNo || "").replace(/\D/g, ""),
    String(input.email || ""),
    String(input.name || ""),
    JSON.stringify(input.payload ?? input),
    new Date().toISOString()
  );
  return { code: 200, body: { ok: true, id: input.id } };
}

// --- server ------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, {});
  const url = new URL(req.url, "http://x");
  const ip = req.socket.remoteAddress || "x";

  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, { ok: true });
  }
  if (req.method === "GET" && url.pathname === "/api/orders") {
    const shared = process.env.LINKODRA_MAIL_TOKEN;
    if (!shared || url.searchParams.get("token") !== shared) {
      return send(res, 403, { ok: false, reason: "forbidden" });
    }
    return send(res, 200, { ok: true, orders: listOrders.all() });
  }
  if (req.method === "POST" && (url.pathname === "/send" || url.pathname === "/api/send")) {
    const out = await handleSend(await readBody(req), ip);
    return send(res, out.code, out.body);
  }
  if (req.method === "POST" && url.pathname === "/api/orders") {
    const out = handleCreateOrder(await readBody(req));
    return send(res, out.code, out.body);
  }
  return send(res, 404, { ok: false, reason: "not-found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Linkodra backend on http://127.0.0.1:${PORT} (db: data/linkodra.db)`);
});
