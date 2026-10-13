// Outgoing mail configuration (EmailJS - free tier, sends through your Gmail).
//
// Browsers cannot speak SMTP directly, so this project uses EmailJS as the
// free frontend-friendly bridge: you connect your Gmail once on their site,
// and this app sends through it with a public key. No password ever lives
// in this codebase.
//
// SETUP (one time, ~5 minutes):
//   1. Create a free account at https://www.emailjs.com
//   2. Add an Email Service and connect your Gmail (this is the SMTP part).
//   3. Create an Email Template with these variables in subject/body:
//        {{to_name}} {{tier_name}} {{amount}} {{ref_no}} {{order_email}}
//   4. Paste the three IDs below, rebuild, done.
//
// Until the IDs below are filled in, sending is skipped silently and the
// checkout keeps working - nothing throws, nothing blocks.

export const MAIL_CONFIG = {
  serviceId: "", // e.g. "service_abc1234"
  templateId: "", // e.g. "template_xyz5678"
  publicKey: "", // e.g. "pUbL1cK3y..."
  fromName: "Linkodra PH",
};

export function isMailConfigured() {
  return Boolean(MAIL_CONFIG.serviceId && MAIL_CONFIG.templateId && MAIL_CONFIG.publicKey);
}
