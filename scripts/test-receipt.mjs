// Quick checks for the receipt parser. Run: node scripts/test-receipt.mjs
import { amountMatches, cleanDigits, formatPeso, parseMoney, parseReceiptText } from "../src/receipt.js";

let failures = 0;
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures += 1;
    console.error(`FAIL ${name}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  } else {
    console.log(`ok   ${name}`);
  }
}

const GCASH = `
GCash
Send Money
You sent
₱1,399.00
to LINKODRA PH
09XX XXX XXXX
Ref. No. 1234 5678 90123
29 Sep 2026 10:15 PM
`;

const GCASH_ALT = `
Transaction Details
Reference No.: 9876543210987
Amount: PHP 699.00
Status: Completed
`;

const MAYA = `
Maya
Payment Successful
Total Amount
P 1,999.00
Reference Number 555566667777888
`;

const NOISY = `
Gcash
Amt347.50
Ref No: 1122 3344 55
`;

check("gcash ref", parseReceiptText(GCASH).refNo, "1234567890123");
check("gcash amount", parseReceiptText(GCASH).amount, 1399);
check("gcash-alt ref", parseReceiptText(GCASH_ALT).refNo, "9876543210987");
check("gcash-alt amount", parseReceiptText(GCASH_ALT).amount, 699);
check("maya ref", parseReceiptText(MAYA).refNo, "555566667777888");
check("maya amount", parseReceiptText(MAYA).amount, 1999);
check("noisy ref", parseReceiptText(NOISY).refNo, "1122334455");
check("noisy amount", parseReceiptText(NOISY).amount, 347.5);
check("empty", parseReceiptText("hello world"), { refNo: null, amount: null });
check("money spaces", parseMoney("1, 399.00"), 1399);
check("ocr digits", cleanDigits("12O4 l567"), "12041567");
check("match exact", amountMatches(1399, 1399), true);
check("match float", amountMatches(1398.999, 1399), true);
check("mismatch", amountMatches(1300, 1399), false);
check("peso format", formatPeso(1399), "₱1,399.00");

if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("All receipt parser checks passed.");
