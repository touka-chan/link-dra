// Outgoing mail configuration (Google SMTP, frontend-safe).
//
// Browsers must never see your Gmail app password (view-source + public repo
// = anyone could send mail as you), so the password itself NEVER goes in this
// file. Only a SecureToken goes here:
//
//   1. Go to https://smtpjs.com, "Encrypt your SMTP credentials".
//   2. Host: smtp.gmail.com, Port: 587, Username: your Gmail,
//      Password: your 16-letter Google app password.
//   3. Optional but advised: lock the token to your domain in their dashboard.
//   4. Paste ONLY the SecureToken below and rebuild.
//
// Until the token below is filled in, sending is skipped silently and the
// checkout keeps working - nothing throws, nothing blocks.

export const MAIL_CONFIG = {
  smtpjsToken: "", // e.g. "9b1deb...-....-....-....-............"
  fromEmail: "linkodra.ph@gmail.com",
  fromName: "Linkodra",
};

export function isMailConfigured() {
  return Boolean(MAIL_CONFIG.smtpjsToken);
}
