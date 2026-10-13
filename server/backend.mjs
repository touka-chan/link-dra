// Linkodra local backend: mail endpoint + SQLite order database.
//
// Runs on plain Node, no install beyond `npm install` (uses built-in
// node:sqlite). For localhost development only - production mail lives in
// server/send.php on real hosting. Mirrors its JSON contract exactly.
//
//   1. copy .env.example .env  (then fill RESEND_API_KEY)
//   2. npm run backend:local
//
// Endpoints (all JSON):
//   POST /send|/send.php  {token,...} (default: buyer receipt mail)
//                          {action:"order", token, order:{...}, receipt?}
//   POST /api/orders  {id,...} (create, same as action:"order" minus mail)
//   GET  /api/orders?token=... | GET /send.php?action=list&token=...
//   GET  /health

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const PORT = 8080;
const FROM = "Linkodra <orders@linkodra.com>"; // must be your verified Resend domain
const OWNER_EMAIL = "linkodra.ph@gmail.com";
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
const DATA = path.join(process.cwd(), "data");
fs.mkdirSync(path.join(DATA, "receipts"), { recursive: true });
const db = new DatabaseSync(path.join(DATA, "linkodra.db"));
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
      if (body.length > 8_000_000) req.destroy();
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

async function resend(to, subject, html, attachments = []) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const payload = { from: FROM, to: [to], subject, html };
  if (attachments.length) payload.attachments = attachments;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) console.warn("resend failed:", r.status, await r.text().catch(() => ""));
    return r.ok;
  } catch (err) {
    console.warn("resend failed:", err);
    return false;
  }
}

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function saveOrderRow(o) {
  insertOrder.run(
    String(o.id).slice(0, 40),
    String(o.code || "").slice(0, 20),
    String(o.tier || "").slice(0, 20),
    Number(o.total) || 0,
    Number(o.paid) || 0,
    String(o.refNo || "").replace(/\D/g, ""),
    String(o.email || "").slice(0, 120),
    String(o.name || "").slice(0, 120),
    JSON.stringify(o),
    new Date().toISOString()
  );
}

async function handleSend(input, ip) {
  const shared = process.env.LINKODRA_MAIL_TOKEN;
  if (!process.env.RESEND_API_KEY || !shared) {
    return { code: 500, body: { sent: false, reason: "not-configured" } };
  }
  if (input?.token !== shared) return { code: 403, body: { sent: false, reason: "forbidden" } };

  // One endpoint, two jobs: buyer receipt mail (default) or full order.
  if (input?.action === "order") return handleOrder(input, ip);

  const to = typeof input.to === "string" && EMAIL_RE.test(input.to) ? input.to : "";
  if (!to) return { code: 400, body: { sent: false, reason: "bad-recipient" } };
  if (!checkRate(ip)) return { code: 429, body: { sent: false, reason: "rate-limited" } };

  const name = String(input.name || "").slice(0, 80);
  const tier = String(input.tier || "Linkodra card").slice(0, 80);
  const amount = String(input.amount || "").slice(0, 30);
  const ref = String(input.ref || "").replace(/\D/g, "");
  const subject = `Linkodra PH - payment received${ref ? ` (ref ${ref})` : ""} - ${tier}`;
  const html =
    `<p>Hi ${esc(name || "there")},</p>` +
    `<p>Your subscription is confirmed. Your <strong>${esc(tier)}</strong> order is now in our system where you applied.</p>` +
    `<p>Amount paid: <strong>${esc(amount)}</strong><br>` +
    `Reference no.: <strong>${esc(ref || "pending verification")}</strong></p>` +
    `<p>What happens next: we print your card and email your profile link to ${esc(to)}. Reply to this email if anything looks wrong.</p>` +
    `<p>- Linkodra</p>`;

  const ok = await resend(to, subject, html);
  logMail.run(to, subject, ok ? "sent" : "failed", new Date().toISOString());
  return ok
    ? { code: 200, body: { sent: true } }
    : { code: 502, body: { sent: false, reason: "send-failed" } };
}

async function handleOrder(input, ip) {
  const o = input?.order;
  if (!o || typeof o.id !== "string" || !o.id) {
    return { code: 400, body: { ok: false, reason: "bad-order" } };
  }
  if (!checkRate(ip)) return { code: 429, body: { ok: false, reason: "rate-limited" } };
  saveOrderRow(o);

  let savedReceipt = "";
  const attachments = [];
  const r = input?.receipt;
  if (r && typeof r.data === "string" && r.data) {
    const bin = Buffer.from(r.data.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const ext = String(r.name || "receipt.png").split(".").pop().toLowerCase();
    if (bin.length > 0 && bin.length < 5_000_000 && ["png", "jpg", "jpeg", "webp"].includes(ext)) {
      const fname = `${String(o.id).replace(/[^A-Za-z0-9_-]/g, "")}.${ext}`;
      try {
        fs.writeFileSync(path.join(DATA, "receipts", fname), bin);
        savedReceipt = fname;
        attachments.push({ filename: fname, content: bin.toString("base64") });
      } catch (err) {
        console.warn("receipt save failed:", err);
      }
    }
  }

  const a = o.address && typeof o.address === "object" ? o.address : {};
  const addr = [a.street, a.barangay, a.city, a.province].filter(Boolean).join(", ");
  const c = o.card && typeof o.card === "object" ? o.card : {};
  const card = [c.orientation, c.design, c.finish, c.printName ? `Print: ${c.printName}` : ""]
    .filter(Boolean)
    .join(" · ");
  const subject = `New Linkodra order ${o.id} - ${o.tier || "card"}`;
  const html =
    `<p>New order <strong>${esc(o.id)}</strong> (${esc(o.tier || "")}).</p>` +
    `<p>Total: <strong>${esc(o.total ?? "")}</strong><br>` +
    `Paid via QR: <strong>${esc(o.paid ?? "")}</strong><br>` +
    `Ref: <strong>${esc(o.refNo || "")}</strong></p>` +
    `<p>Buyer: <strong>${esc(o.name || "")}</strong><br>` +
    `Email: ${esc(o.email || "")}<br>` +
    `Phone: ${esc(o.phone || "")}<br>` +
    `Address: ${esc(addr)}</p>` +
    `<p>Card: ${esc(card)}</p>` +
    (savedReceipt ? `<p>Receipt attached (${esc(savedReceipt)}).</p>` : `<p>No receipt file attached.</p>`);

  const mailed = await resend(OWNER_EMAIL, subject, html, attachments);
  logMail.run(OWNER_EMAIL, subject, mailed ? "sent-owner" : "failed-owner", new Date().toISOString());
  return { code: 200, body: { ok: true, mailed } };
}

// --- server ------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, {});
  const url = new URL(req.url, "http://x");
  const ip = req.socket.remoteAddress || "x";
  const tokenOk = () => {
    const shared = process.env.LINKODRA_MAIL_TOKEN;
    return shared && url.searchParams.get("token") === shared;
  };

  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, { ok: true });
  }
  if (
    req.method === "GET" &&
    (url.pathname === "/api/orders" || url.searchParams.get("action") === "list")
  ) {
    if (!tokenOk()) return send(res, 403, { ok: false, reason: "forbidden" });
    return send(res, 200, { ok: true, orders: listOrders.all() });
  }
  if (
    req.method === "POST" &&
    (url.pathname === "/send" || url.pathname === "/send.php" || url.pathname === "/api/send")
  ) {
    const out = await handleSend(await readBody(req), ip);
    return send(res, out.code, out.body);
  }
  if (req.method === "POST" && url.pathname === "/api/orders") {
    const input = await readBody(req);
    if (!input || typeof input.id !== "string" || !input.id) {
      return send(res, 400, { ok: false, reason: "bad-order" });
    }
    saveOrderRow(input);
    return send(res, 200, { ok: true, id: input.id });
  }
  return send(res, 404, { ok: false, reason: "not-found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Linkodra backend on http://127.0.0.1:${PORT} (db: data/linkodra.db)`);
});
