// Outgoing mail configuration.
//
// The site sends payment confirmations through ONE of these (auto-detected,
// first match wins). Secrets NEVER go in this file or git.
//
// 1. RESEND via your own tiny server file (proper path).
//    Upload server/send.php (+ data/.htaccess) to your hosting as
//    https://linkodra.com/mail/send.php, with secrets in
//    server/mail-config.local.php beside it (see the sample file).
// 2. Gmail SMTP via SecureToken (works today, no backend).
//    smtpjs.com > "Encrypt your SMTP credentials" (smtp.gmail.com:587 +
//    Gmail + 16-letter app password), paste ONLY the token below.
//
// Until anything is filled in, sending is skipped silently and the checkout
// keeps working - nothing throws, nothing blocks.

export const MAIL_CONFIG = {
  // --- Resend endpoint ---
  resendEndpoint: "https://linkodra.com/mail/send.php",
  mailToken: "ccb5183db855d2fc733b24778b1842f1ea0e93aac5fcbf05", // must match LINKODRA_MAIL_TOKEN on the server

  // --- Gmail SMTP token ---
  smtpjsToken: "", // e.g. "9b1deb...-....-....-....-............"
  fromEmail: "linkodra.ph@gmail.com",
  fromName: "Linkodra",
};

export function isMailConfigured() {
  return Boolean(
    (MAIL_CONFIG.resendEndpoint && MAIL_CONFIG.mailToken) || MAIL_CONFIG.smtpjsToken
  );
}
