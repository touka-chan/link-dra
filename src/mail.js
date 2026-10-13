// Payment confirmation emails.
//
// Sends through the first configured sender in mail-config.js:
//   1. Resend via your own tiny PHP endpoint (proper path, key stays server-side)
//   2. Gmail SMTP via SecureToken (works today, no backend)
// Fire-and-forget: callers never await a failure, so checkout can never break
// because an email failed.

import { MAIL_CONFIG, isMailConfigured } from "./mail-config.js";
import { formatPeso } from "./receipt.js";

export { isMailConfigured };

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSubject({ tierName, refNo }) {
  return `Linkodra PH - payment received${refNo ? ` (ref ${refNo})` : ""} - ${tierName || "card"}`;
}

function buildBody({ name, tierName, amount, refNo, to }) {
  const hello = escapeHtml(name || "there");
  return [
    `<p>Hi ${hello},</p>`,
    `<p>Your subscription is confirmed. Your <strong>${escapeHtml(tierName || "Linkodra card")}</strong> order is now in our system where you applied.</p>`,
    `<p>Amount paid: <strong>${escapeHtml(formatPeso(amount))}</strong><br>`,
    `Reference no.: <strong>${escapeHtml(refNo || "pending verification")}</strong></p>`,
    `<p>What happens next: we print your card and email your profile link to ${escapeHtml(to)}. Reply to this email if anything looks wrong.</p>`,
    `<p>- ${escapeHtml(MAIL_CONFIG.fromName)}</p>`,
  ].join("");
}

/** Load the SmtpJS script on demand. Resolves window.Email. */
function loadSmtpJs() {
  if (window.Email && typeof window.Email.send === "function") {
    return Promise.resolve(window.Email);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://smtpjs.com/v3/smtp.js";
    script.async = true;
    script.onload = () =>
      window.Email && typeof window.Email.send === "function"
        ? resolve(window.Email)
        : reject(new Error("smtp-blocked"));
    script.onerror = () => reject(new Error("smtp-blocked"));
    document.head.appendChild(script);
  });
}

/**
 * Email the buyer their payment confirmation after the receipt is verified.
 * Resolves { sent: true } or { sent: false, reason } - never rejects.
 */
export async function sendPaymentSuccessEmail({ to, name, tierName, amount, refNo }) {
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { sent: false, reason: "bad-recipient" };
  }
  try {
    if (MAIL_CONFIG.resendEndpoint && MAIL_CONFIG.mailToken) {
      const res = await fetch(MAIL_CONFIG.resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: MAIL_CONFIG.mailToken,
          to,
          name: name || "",
          tier: tierName || "Linkodra card",
          amount: formatPeso(amount),
          ref: refNo || "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      return data && data.sent ? { sent: true } : { sent: false, reason: data.reason || "send-failed" };
    }
    if (!MAIL_CONFIG.smtpjsToken) {
      return { sent: false, reason: "mail-not-configured" };
    }
    const Email = await loadSmtpJs();
    const message = await Email.send({
      SecureToken: MAIL_CONFIG.smtpjsToken,
      To: to,
      From: MAIL_CONFIG.fromEmail,
      Subject: buildSubject({ tierName, refNo }),
      Body: buildBody({ name, tierName, amount, refNo, to }),
    });
    // SmtpJS resolves "OK" on success, anything else is the error text.
    return message === "OK" ? { sent: true } : { sent: false, reason: "send-failed" };
  } catch (err) {
    console.warn("Confirmation email failed:", err);
    return { sent: false, reason: "send-failed" };
  }
}
