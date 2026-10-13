// Payment confirmation emails.
//
// Sends through EmailJS (free), which relays via the Gmail you connected in
// mail-config.js. Fire-and-forget: callers never await a failure, so checkout
// can never break because an email failed.

import { MAIL_CONFIG, isMailConfigured } from "./mail-config.js";
import { formatPeso } from "./receipt.js";

/**
 * Email the buyer their payment confirmation after the receipt is verified.
 * Resolves { sent: true } or { sent: false, reason } - never rejects.
 */
export async function sendPaymentSuccessEmail({ to, name, tierName, amount, refNo }) {
  if (!isMailConfigured()) {
    return { sent: false, reason: "mail-not-configured" };
  }
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { sent: false, reason: "bad-recipient" };
  }
  try {
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
  } catch (err) {
    console.warn("Confirmation email failed:", err);
    return { sent: false, reason: "send-failed" };
  }
}
