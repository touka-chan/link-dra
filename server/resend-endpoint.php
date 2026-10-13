<?php
// Linkodra mail endpoint for Resend. Drop this file on any PHP hosting
// (cPanel / Hostinger / VPS) as e.g. https://linkodra.ph/mail/send.php
// and point MAIL_CONFIG.resendEndpoint at it.
//
// Secrets live in server environment variables, NEVER in git or frontend:
//   RESEND_API_KEY       resend.com > API Keys (re_...)
//   LINKODRA_MAIL_TOKEN  any long random string; must match `mailToken`
//                        in src/mail-config.js (stops drive-by POSTs)
//
// Resend also needs a verified sending domain (it cannot send as @gmail.com):
// resend.com > Domains > add linkodra.ph > paste the DNS records they show.
// Use that domain in $FROM below.

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit;

$FROM = "Linkodra <orders@linkodra.ph>"; // must be your verified Resend domain

function fail($reason, $code = 400) {
  http_response_code($code);
  echo json_encode(["sent" => false, "reason" => $reason]);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") fail("method", 405);

$apiKey = getenv("RESEND_API_KEY");
$shared = getenv("LINKODRA_MAIL_TOKEN");
if (!$apiKey || !$shared) fail("not-configured", 500);

$in = json_decode(file_get_contents("php://input"), true) ?: [];
if (!hash_equals($shared, (string)($in["token"] ?? ""))) fail("forbidden", 403);

$to = filter_var($in["to"] ?? "", FILTER_VALIDATE_EMAIL);
$name = substr(trim($in["name"] ?? ""), 0, 80);
$tier = substr(trim($in["tier"] ?? "Linkodra card"), 0, 80);
$amount = substr(trim($in["amount"] ?? ""), 0, 30);
$ref = preg_replace("/\D/", "", $in["ref"] ?? "");
if (!$to) fail("bad-recipient");

// Tiny IP rate limit: 10 sends/hour/IP keeps a leaked token boring.
$ip = $_SERVER["REMOTE_ADDR"] ?? "x";
$bucket = sys_get_temp_dir() . "/lk-mail-" . md5($ip) . ".json";
$hits = [];
if (file_exists($bucket)) {
  $hits = array_filter(json_decode(file_get_contents($bucket), true) ?: [], fn($t) => $t > time() - 3600);
}
if (count($hits) >= 10) fail("rate-limited", 429);
$hits[] = time();
file_put_contents($bucket, json_encode(array_values($hits)));

$subject = "Linkodra PH - payment received" . ($ref ? " (ref $ref)" : "") . " - $tier";
$html = "<p>Hi " . htmlspecialchars($name ?: "there") . ",</p>"
  . "<p>Your subscription is confirmed. Your <strong>" . htmlspecialchars($tier) . "</strong> order is now in our system where you applied.</p>"
  . "<p>Amount paid: <strong>" . htmlspecialchars($amount) . "</strong><br>"
  . "Reference no.: <strong>" . htmlspecialchars($ref ?: "pending verification") . "</strong></p>"
  . "<p>What happens next: we print your card and email your profile link to " . htmlspecialchars($to) . ". Reply to this email if anything looks wrong.</p>"
  . "<p>- Linkodra</p>";

$ch = curl_init("https://api.resend.com/emails");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_HTTPHEADER => ["Authorization: Bearer $apiKey", "Content-Type: application/json"],
  CURLOPT_POSTFIELDS => json_encode(["from" => $FROM, "to" => [$to], "subject" => $subject, "html" => $html]),
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code >= 200 && $code < 300) {
  echo json_encode(["sent" => true]);
} else {
  error_log("resend failed: $resp");
  fail("send-failed", 502);
}
