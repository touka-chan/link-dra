// E-wallet receipt reading: image preprocessing plus text parsing.
//
// Everything here is free and runs fully in the browser. OCR itself is done
// by tesseract.js (open source, WASM, no API key). This module only shapes the
// image for the OCR engine and pulls the reference number and amount out of
// the recognised text, so it is also importable in Node for unit tests.

export const MIN_REF_DIGITS = 9;

/** Load any image file into an <img>. Browser only. */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image file."));
    };
    img.src = url;
  });
}

/**
 * Prepare a receipt photo for OCR: upscale small shots, flatten to grayscale
 * and stretch the contrast so faint screenshots still read. Returns a PNG
 * data URL ready for Tesseract.
 */
export async function preprocessReceipt(file) {
  const img = await loadImage(file);
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  const scale = Math.min(3, Math.max(1, 2000 / Math.max(srcW, srcH)));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(srcW * scale);
  canvas.height = Math.round(srcH * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;
  // Two passes: first find the spread, then stretch it.
  let lo = 255;
  let hi = 0;
  for (let i = 0; i < px.length; i += 4) {
    const lum = (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) / 1000;
    if (lum < lo) lo = lum;
    if (lum > hi) hi = lum;
  }
  const span = Math.max(1, hi - lo);
  for (let i = 0; i < px.length; i += 4) {
    const lum = (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) / 1000;
    let v = ((lum - lo) / span) * 255;
    // Gentle threshold: push clearly dark / light pixels apart, keep the rest.
    v = v < 110 ? v * 0.82 : v > 150 ? 255 - (255 - v) * 0.82 : v;
    px[i] = px[i + 1] = px[i + 2] = Math.max(0, Math.min(255, Math.round(v)));
  }
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png");
}

/** "1, 399.00" -> 1399. Also tolerates stray OCR spaces inside numbers. */
export function parseMoney(raw) {
  if (!raw) return NaN;
  const cleaned = String(raw).replace(/[\s,]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** Keep digits, mapping the usual OCR lookalikes (O -> 0, l/I -> 1). */
export function cleanDigits(raw) {
  return String(raw || "")
    .replace(/[Oo]/g, "0")
    .replace(/[lI|]/g, "1")
    .replace(/\D/g, "");
}

const REF_LABEL =
  /ref(?:erence)?[ \t.]*(?:no|number|#)?\.?[ \t]*[:\-.]?[ \t]*([\d \tOoIl|]{9,})/i;
const AMOUNT_LABEL =
  /(?:total\s*amount|amount\s*(?:paid|due|sent|transferred|received)?|total)\s*[:-]?\s*(?:₱|php|p)?\s*([\d][\d,\s]*\.\d{2})/i;
const PESO_AMOUNT = /(?:₱|php)\s*([\d][\d,\s]*\.\d{2})/gi;
const BARE_AMOUNT = /(?<![\d.])(\d{1,3}(?:,\d{3})+\.\d{2}|\d+\.\d{2})(?![\d.])/g;

/**
 * Pull { refNo, amount } out of OCR text from a GCash / Maya / bank receipt.
 * refNo is digits only. Either field is null when nothing reliable is found.
 */
export function parseReceiptText(text = "") {
  const src = String(text || "");

  let refNo = null;
  const labelHit = src.match(REF_LABEL);
  if (labelHit) {
    const digits = cleanDigits(labelHit[1]);
    if (digits.length >= MIN_REF_DIGITS) refNo = digits;
  }
  if (!refNo) {
    // Fallback: the longest run of digits on one line of the receipt. GCash
    // references are 13 digits, Maya 10+, so length is a dependable signal.
    const runs = src.match(/[\d][\d \t]*\d/g) || [];
    let best = "";
    for (const run of runs) {
      const digits = cleanDigits(run);
      if (digits.length > best.length) best = digits;
    }
    if (best.length >= MIN_REF_DIGITS) refNo = best;
  }

  let amount = null;
  const labelAmount = src.match(AMOUNT_LABEL);
  if (labelAmount) {
    const n = parseMoney(labelAmount[1]);
    if (Number.isFinite(n)) amount = n;
  }
  if (amount == null) {
    let best = NaN;
    for (const m of src.matchAll(PESO_AMOUNT)) {
      const n = parseMoney(m[1]);
      if (Number.isFinite(n) && (!Number.isFinite(best) || n > best)) best = n;
    }
    if (Number.isFinite(best)) {
      amount = best;
    } else {
      // Last resort: any money-shaped number that is not inside a long digit
      // run (so a reference number can never be mistaken for an amount).
      const digitsOnly = src.replace(/[\d][\d \t]{8,}\d/g, " ");
      for (const m of digitsOnly.matchAll(BARE_AMOUNT)) {
        const n = parseMoney(m[1]);
        if (Number.isFinite(n) && (amount == null || n > amount)) amount = n;
      }
    }
  }

  return { refNo, amount };
}

/** True when the scanned amount covers the exact peso total due. */
export function amountMatches(scanned, due) {
  if (!Number.isFinite(scanned) || !Number.isFinite(due)) return false;
  return Math.abs(scanned - due) < 0.01;
}

export function formatPeso(n) {
  if (!Number.isFinite(n)) return "—";
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
