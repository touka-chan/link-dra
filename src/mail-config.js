// Outgoing mail configuration.
//
// Two free options. Pick one by filling its fields; the sender auto-detects:
//
// OPTION B - raw Gmail SMTP, frontend-safe via SecureToken (recommended here).
//   Browsers must never see your app password (view-source + public repo =
//   anyone could send mail as you), so the password itself NEVER goes in this
//   file. Instead:
//   1. Go to https://smtpjs.com, "Encrypt your SMTP credentials".
//   2. Host: smtp.gmail.com, Port: 587, Username: your Gmail,
//      Password: your 16-letter Google app password.
//   3. Optional but advised: lock the token to your domain in their dashboard.
//   4. Paste ONLY the SecureToken below.
//   (If a password was ever pasted anywhere public, revoke it at
//   Google Account > Security > App passwords, and make a fresh one.)
//
// OPTION A - EmailJS (also free, no password involved at all).
//   1. Free account at https://www.emailjs.com
//   2. Email Services > Add Gmail service (OAuth, Google connects it).
//   3. Email Template using: {{to_name}} {{tier_name}} {{amount}} {{ref_no}}
//      {{order_email}}, with To Email set to {{to_email}}.
//   4. Paste the three IDs below.

export const MAIL_CONFIG = {
  // --- Option B ---
  smtpjsToken: "", // e.g. "9b1deb...-....-....-....-............"
  fromEmail: "linkodra.ph@gmail.com",
  fromName: "Linkodra",

  // --- Option A ---
  serviceId: "", // e.g. "service_abc1234"
  templateId: "", // e.g. "template_xyz5678"
  publicKey: "", // e.g. "pUbL1cK3y..."
};

export function isMailConfigured() {
  return (
    Boolean(MAIL_CONFIG.smtpjsToken) ||
    Boolean(MAIL_CONFIG.serviceId && MAIL_CONFIG.templateId && MAIL_CONFIG.publicKey)
  );
}
