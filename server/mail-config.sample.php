<?php
// Copy to mail-config.local.php next to send.php and fill in. This file is
// git-ignored, so secrets never leave your server. (On hosts with real env
// support you can set RESEND_API_KEY / LINKODRA_MAIL_TOKEN there instead.)
return [
  "RESEND_API_KEY" => "re_...",
  "LINKODRA_MAIL_TOKEN" => "same-value-as-mailToken-in-src-mail-config.js",
  "OWNER_EMAIL" => "linkodra.ph@gmail.com", // where new-order emails go
  "FROM" => "Linkodra <orders@linkodra.com>", // must be your verified Resend domain
];
