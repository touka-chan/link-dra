<?php
// Linkodra backend (production, shared hosting friendly).
//
// Upload THIS FILE to your hosting as  https://linkodra.com/mail/send.php
// Upload data/.htaccess next to it as https://linkodra.com/mail/data/.htaccess
// Then create mail-config.local.php next to this file (see
// mail-config.sample.php) with your Resend key. Secrets NEVER go in git.
//
// Needs stock Hostinger PHP: curl + pdo_sqlite. If SQLite is unavailable the
// order is still emailed - only the on-disk history is skipped.
//
// Actions (all JSON):
//   POST {action:"send"|undefined, token,to,name,tier,amount,ref}
//       -> buyer payment confirmation {sent:true|false}
//   POST {action:"order", token, order:{...}, receipt:{name,data}|null}
//       -> saves the order, stores the receipt, emails YOU {ok:true}
//   GET  ?action=list&token=... -> newest orders (for verification)

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit;

$DEFAULTS = [
  "RESEND_API_KEY" => "",
  "LINKODRA_MAIL_TOKEN" => "",
  "OWNER_EMAIL" => "linkodra.ph@gmail.com",
  "FROM" => "Linkodra <orders@linkodra.com>", // must be your verified Resend domain
  // Sends allowed per hour, per IP. Each order uses one buyer send plus one or
  // two owner notices, so keep these comfortably above real traffic.
  "MAIL_RATE_BUYER" => "60",
  "MAIL_RATE_OWNER" => "60",
];
$localFile = __DIR__ . "/mail-config.local.php";
$local = file_exists($localFile) ? require $localFile : [];
if (!is_array($local)) $local = [];
$cfg = function ($k) use ($DEFAULTS, $local) {
  $env = getenv($k);
  if ($env !== false && $env !== "") return $env;
  return isset($local[$k]) ? $local[$k] : $DEFAULTS[$k];
};

$DATA = __DIR__ . "/data";
@mkdir($DATA . "/receipts", 0755, true);

function out($code, $obj) {
  http_response_code($code);
  echo json_encode($obj);
  exit;
}

// --- database (best-effort; mail never depends on it) ------------------------
$db = null;
try {
  if (in_array("sqlite", PDO::getAvailableDrivers())) {
    $db = new PDO("sqlite:" . $GLOBALS["DATA"] . "/orders.db");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, code TEXT, tier TEXT, total REAL, paid REAL, ref_no TEXT, email TEXT, name TEXT, payload TEXT, created_at TEXT)");
    $db->exec("CREATE TABLE IF NOT EXISTS mail_log (id INTEGER PRIMARY KEY AUTOINCREMENT, to_email TEXT, subject TEXT, status TEXT, created_at TEXT)");
  }
} catch (Exception $e) {
  $db = null;
}

// --- rate limit -------------------------------------------------------------
// Guarded per IP per bucket, because a mobile carrier puts thousands of
// subscribers behind one address: a tight cap there locks out real customers.
// Each order fires three sends (buyer receipt, owner notice, delivery update),
// so the caps are set well above that and are overridable in
// mail-config.local.php via MAIL_RATE_BUYER / MAIL_RATE_OWNER.
function rateOk($bucket = "buyer") {
  global $cfg;
  $ip = $_SERVER["REMOTE_ADDR"] ?? "x";
  $limit = (int) $cfg($bucket === "owner" ? "MAIL_RATE_OWNER" : "MAIL_RATE_BUYER");
  if ($limit <= 0) return true; // 0 disables the limit
  $file = sys_get_temp_dir() . "/lk-mail-" . md5($ip . $bucket) . ".json";
  $hits = [];
  if (file_exists($file)) {
    $hits = array_values(array_filter(
      json_decode(file_get_contents($file), true) ?: [],
      fn($t) => $t > time() - 3600
    ));
  }
  if (count($hits) >= $limit) return false;
  $hits[] = time();
  @file_put_contents($file, json_encode($hits));
  return true;
}

function logMail($to, $subject, $status) {
  global $db;
  if (!$db) return;
  try {
    $st = $db->prepare("INSERT INTO mail_log (to_email, subject, status, created_at) VALUES (?,?,?,?)");
    $st->execute([$to, $subject, $status, gmdate("c")]);
  } catch (Exception $e) {
  }
}

// --- Resend -------------------------------------------------------------------
// $debug, when set, carries Resend's own status and body back to the caller so
// a misconfigured key or unverified domain is visible instead of a bare 502.
function resendSend($to, $subject, $html, $attachments = [], &$debug = null) {
  global $cfg;
  $payload = ["from" => $cfg("FROM"), "to" => [$to], "subject" => $subject, "html" => $html];
  if ($attachments) $payload["attachments"] = $attachments;
  $ch = curl_init("https://api.resend.com/emails");
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $cfg("RESEND_API_KEY"), "Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode($payload),
  ]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $debug = ["status" => $code, "body" => substr((string)$resp, 0, 500), "key_prefix" => substr($cfg("RESEND_API_KEY"), 0, 6), "from" => $cfg("FROM")];
  curl_close($ch);
  if ($code < 200 || $code >= 300) error_log("resend failed ($code): $resp");
  return $code >= 200 && $code < 300;
}

function esc($s) {
  return htmlspecialchars((string)$s, ENT_QUOTES, "UTF-8");
}

// --- list (GET) ----------------------------------------------------------------
if ($_SERVER["REQUEST_METHOD"] === "GET") {
  if (($_GET["action"] ?? "") === "list" && hash_equals((string)$cfg("LINKODRA_MAIL_TOKEN"), (string)($_GET["token"] ?? "x"))) {
    $orders = [];
    if ($db) {
      try {
        $orders = $db->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100")->fetchAll(PDO::FETCH_ASSOC);
      } catch (Exception $e) {
      }
    }
    out(200, ["ok" => true, "orders" => $orders]);
  }
  out(404, ["ok" => false, "reason" => "not-found"]);
}

// --- writes (POST) ---------------------------------------------------------------
$in = json_decode(file_get_contents("php://input"), true) ?: [];
if (!hash_equals((string)$cfg("LINKODRA_MAIL_TOKEN"), (string)($in["token"] ?? "x"))) {
  out(403, ["sent" => false, "ok" => false, "reason" => "forbidden"]);
}
if (!rateOk(($in["action"] ?? "") === "order" ? "owner" : "buyer")) {
  out(429, ["sent" => false, "ok" => false, "reason" => "rate-limited"]);
}
if (!$cfg("RESEND_API_KEY")) {
  out(500, ["sent" => false, "ok" => false, "reason" => "not-configured"]);
}

// --- action: order (save + notify owner) ------------------------------------------
if (($in["action"] ?? "") === "order") {
  $o = $in["order"] ?? [];
  if (!is_array($o) || empty($o["id"])) out(400, ["ok" => false, "reason" => "bad-order"]);

  $id = substr((string)$o["id"], 0, 40);
  $ref = preg_replace("/\D/", "", (string)($o["refNo"] ?? ""));
  if ($db) {
    try {
      $st = $db->prepare("INSERT OR REPLACE INTO orders (id, code, tier, total, paid, ref_no, email, name, payload, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)");
      $st->execute([
        $id, substr((string)($o["code"] ?? ""), 0, 20), substr((string)($o["tier"] ?? ""), 0, 20),
        (float)($o["total"] ?? 0), (float)($o["paid"] ?? 0), $ref,
        substr((string)($o["email"] ?? ""), 0, 120), substr((string)($o["name"] ?? ""), 0, 120),
        json_encode($o), gmdate("c"),
      ]);
    } catch (Exception $e) {
    }
  }

  // Store the receipt image (max ~5 MB) for your own verification.
  $savedReceipt = "";
  $attachments = [];
  $r = $in["receipt"] ?? null;
  if (is_array($r) && !empty($r["data"])) {
    $raw = preg_replace("/^data:image\/\w+;base64,/", "", (string)$r["data"]);
    $bin = base64_decode($raw, true);
    $ext = strtolower(pathinfo((string)($r["name"] ?? "receipt.png"), PATHINFO_EXTENSION));
    if ($bin !== false && strlen($bin) > 0 && strlen($bin) < 5_000_000 && in_array($ext, ["png", "jpg", "jpeg", "webp"])) {
      $fname = preg_replace("/[^A-Za-z0-9_-]/", "", $id) . "." . $ext;
      if (@file_put_contents($GLOBALS["DATA"] . "/receipts/" . $fname, $bin) !== false) {
        $savedReceipt = $fname;
        $attachments[] = ["filename" => $fname, "content" => base64_encode($bin)];
      }
    }
  }

  $a = $o["address"] ?? [];
  $addr = is_array($a)
    ? implode(", ", array_filter([$a["street"] ?? "", $a["barangay"] ?? "", $a["city"] ?? "", $a["province"] ?? ""]))
    : "";
  $c = $o["card"] ?? [];
  $card = is_array($c)
    ? implode(" · ", array_filter([$c["orientation"] ?? "", $c["design"] ?? "", $c["finish"] ?? "", isset($c["printName"]) ? "Print: " . $c["printName"] : ""]))
    : "";

  // The buyer's private landing page links, sent after delivery details.
  // Each is already normalised to a full URL on the client, so it is rendered
  // as a clickable link rather than bare text.
  $linksHtml = "";
  $lk = $o["links"] ?? [];
  if (is_array($lk) && $lk) {
    $rows = "";
    foreach ($lk as $name => $value) {
      $url = esc((string)$value);
      $rows .= "<li><strong>" . esc(ucwords(str_replace("_", " ", (string)$name))) . "</strong>: "
        . "<a href=\"" . $url . "\">" . $url . "</a></li>";
    }
    $linksHtml = "<p><strong>Landing page links</strong></p><ul>" . $rows . "</ul>";
  }

  $isLinksUpdate = !empty($o["linksUpdate"]);
  $isDeliveryUpdate = !empty($o["deliveryUpdate"]);
  $subject = $isLinksUpdate
    ? "Linkodra profile links " . $id
    : ($isDeliveryUpdate ? "Linkodra delivery " . $id . " - " . ($o["tier"] ?? "card") : "New Linkodra order " . $id . " - " . ($o["tier"] ?? "card"));
  $html = "<p>New order <strong>" . esc($id) . "</strong> (" . esc($o["tier"] ?? "") . ").</p>"
    . "<p>Total: <strong>" . esc($o["total"] ?? "") . "</strong><br>"
    . "Paid via QR: <strong>" . esc($o["paid"] ?? "") . "</strong><br>"
    . "Ref: <strong>" . esc($ref) . "</strong></p>"
    . "<p>Buyer: <strong>" . esc($o["name"] ?? "") . "</strong><br>"
    . "Email: " . esc($o["email"] ?? "") . "<br>"
    . "Phone: " . esc($o["phone"] ?? "") . "<br>"
    . "Address: " . esc($addr) . "</p>"
    . "<p>Card: " . esc($card) . "</p>"
    . $linksHtml
    . ($savedReceipt ? "<p>Receipt attached (" . esc($savedReceipt) . ").</p>" : "<p>No receipt file attached.</p>");

  $owner = $cfg("OWNER_EMAIL");
  $mailed = $owner && filter_var($owner, FILTER_VALIDATE_EMAIL)
    ? resendSend($owner, $subject, $html, $attachments)
    : false;
  logMail($owner, $subject, $mailed ? "sent-owner" : "failed-owner");
  out(200, ["ok" => true, "mailed" => $mailed]);
}

// --- action: send (buyer receipt confirmation, default) ------------------------------
$to = filter_var($in["to"] ?? "", FILTER_VALIDATE_EMAIL);
if (!$to) out(400, ["sent" => false, "reason" => "bad-recipient"]);

$name = substr(trim($in["name"] ?? ""), 0, 80);
$tier = substr(trim($in["tier"] ?? "Linkodra card"), 0, 80);
$amount = substr(trim($in["amount"] ?? ""), 0, 30);
$ref = preg_replace("/\D/", "", $in["ref"] ?? "");
$subject = "Linkodra PH - payment received" . ($ref ? " (ref $ref)" : "") . " - $tier";
$html = "<p>Hi " . esc($name ?: "there") . ",</p>"
  . "<p>Your subscription is confirmed. Your <strong>" . esc($tier) . "</strong> order is now in our system where you applied.</p>"
  . "<p>Amount paid: <strong>" . esc($amount) . "</strong><br>"
  . "Reference no.: <strong>" . esc($ref ?: "pending verification") . "</strong></p>"
  . "<p>What happens next: we print your card and email your profile link to " . esc($to) . ". Reply to this email if anything looks wrong.</p>"
  . "<p>- Linkodra</p>";

$debug = null;
$ok = resendSend($to, $subject, $html, [], $debug);
logMail($to, $subject, $ok ? "sent" : "failed");
if ($ok) out(200, ["sent" => true]);
// Surface Resend's own complaint; a bare 502 makes every failure look identical.
out(502, ["sent" => false, "reason" => "send-failed", "debug" => $debug]);
