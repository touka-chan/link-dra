// Payment confirmation emails.
//
// Two free senders, auto-detected from mail-config.js:
//   - SecureToken (raw Gmail SMTP via smtpjs, no password in the codebase)
//   - EmailJS (Gmail OAuth relay)
// Fire-and-forget: callers never await a failure, so checkout can never break
// because an email failed.

import { MAIL_CONFIG, isMailConfigured } from "./mail-config.js";
import { formatPeso } from "./receipt.js";

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

async function sendViaSmtpToken({ to, subject, body }) {
  const Email = await loadSmtpJs();
  const message = await Email.send({
    SecureToken: MAIL_CONFIG.smtpjsToken,
    To: to,
    From: MAIL_CONFIG.fromEmail,
    Subject: subject,
    Body: body,
  });
  // SmtpJS resolves "OK" on success, anything else is the error text.
  return message === "OK" ? { sent: true } : { sent: false, reason: "send-failed" };
}

async function sendViaEmailJs({ to, name, tierName, amount, refNo }) {
  const { default: emailjs } = await import("@emailjs/browser");
  await emailjs.send(
    MAIL_CONFIG.serviceId,
    MAIL_CONFIG.templateId,
    {
      to_email: to,
      to_name: name || "there",
      order_email: to,
      tier_name: tierName || "Linkodra card",
      amount: formatPeso(amount),
      ref_no: refNo || "—",
      from_name: MAIL_CONFIG.fromName,
    },
    { publicKey: MAIL_CONFIG.publicKey }
  );
  return { sent: true };
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
    if (MAIL_CONFIG.smtpjsToken) {
      return await sendViaSmtpToken({
        to,
        subject: buildSubject({ tierName, refNo }),
        body: buildBody({ name, tierName, amount, refNo, to }),
      });
    }
    if (isMailConfigured()) {
      return await sendViaEmailJs({ to, name, tierName, amount, refNo });
    }
    return { sent: false, reason: "mail-not-configured" };
  } catch (err) {
    console.warn("Confirmation email failed:", err);
    return { sent: false, reason: "send-failed" };
  }
}
