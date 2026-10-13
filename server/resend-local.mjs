// Local Resend endpoint for localhost testing. Same JSON contract as
// server/resend-endpoint.php, but runs on plain Node (no PHP needed).
//
// PowerShell:
//   $env:RESEND_API_KEY = "re_..."
//   $env:LINKODRA_MAIL_TOKEN = "<the mailToken in src/mail-config.js>"
//   npm run mail:local
// Then in the site (browser console, one time):
//   localStorage.setItem("lk-mail-endpoint", "http://127.0.0.1:8080/send")
// The checkout prefers that override over the committed config, so the repo
// never carries a localhost URL.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

// Secrets come from a `.env` file in the project root (never committed -
// see .env.example). Shell env vars still win when both are set.
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

const PORT = 8080;
const FROM = "Linkodra <orders@linkodra.ph>"; // must be your verified Resend domain
const hits = new Map(); // ip -> [timestamps]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function send(res, code, obj) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, {});
  if (req.method !== "POST" || !req.url.startsWith("/send")) {
    return send(res, 404, { sent: false, reason: "not-found" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const shared = process.env.LINKODRA_MAIL_TOKEN;
  if (!apiKey || !shared) {
    return send(res, 500, { sent: false, reason: "not-configured" });
  }

  let body = "";
  for await (const chunk of req) body += chunk;
  let input = {};
  try {
    input = JSON.parse(body);
  } catch {
    return send(res, 400, { sent: false, reason: "bad-json" });
  }
  if (input.token !== shared) return send(res, 403, { sent: false, reason: "forbidden" });

  const to = typeof input.to === "string" && EMAIL_RE.test(input.to) ? input.to : "";
  if (!to) return send(res, 400, { sent: false, reason: "bad-recipient" });
  const name = String(input.name || "").slice(0, 80);
  const tier = String(input.tier || "Linkodra card").slice(0, 80);
  const amount = String(input.amount || "").slice(0, 30);
  const ref = String(input.ref || "").replace(/\D/g, "");

  const ip = req.socket.remoteAddress || "x";
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => t > now - 3600_000);
  if (list.length >= 10) return send(res, 429, { sent: false, reason: "rate-limited" });
  list.push(now);
  hits.set(ip, list);

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
    if (r.ok) return send(res, 200, { sent: true });
    console.warn("resend failed:", r.status, await r.text().catch(() => ""));
    return send(res, 502, { sent: false, reason: "send-failed" });
  } catch (err) {
    console.warn("resend failed:", err);
    return send(res, 502, { sent: false, reason: "send-failed" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Mail endpoint on http://127.0.0.1:${PORT}/send`);
});
