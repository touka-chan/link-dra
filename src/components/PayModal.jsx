// Manual QR payment modal.
//
// Step 1's Continue opens this instead of jumping straight to the details
// form: a loading spinner first, then this dialog with the static payment QR,
// an uploader for the GCash / e-wallet receipt, and a free in-browser OCR
// pass (tesseract.js) that reads the reference number and amount off the
// receipt. Both values stay editable so a bad scan can be fixed by hand.

import { useEffect, useRef, useState } from "react";
import { Field } from "./ui.jsx";
import { isMailConfigured } from "../mail-config.js";
import { sendPaymentSuccessEmail } from "../mail.js";
import {
  MIN_REF_DIGITS,
  amountMatches,
  cleanDigits,
  formatPeso,
  parseMoney,
  parseReceiptText,
  preprocessReceipt,
} from "../receipt.js";

const escapeHtml = (s) =>
  String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const readAsDataURL = (f) =>
  new Promise((resolve) => {
    if (!f) return resolve("");
    try {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
      r.onerror = () => resolve("");
      r.readAsDataURL(f);
    } catch {
      resolve("");
    }
  });

const QR_SRC = "/qr.png";

function QrImage() {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className="pm-qr-fallback">
        <strong>Payment QR not found</strong>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Drop your GCash QR image as <code>qr.png</code> inside the <code>public</code> folder and rebuild.
        </p>
      </div>
    );
  }
  return (
    <img
      className="pm-qr"
      src={QR_SRC}
      alt="Linkodra payment QR code"
      onError={() => setMissing(true)}
    />
  );
}

export function PayModal({ tierName, due, buyerName, buyerEmail, onConfirm, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [amountText, setAmountText] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      alive.current = false;
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const pick = (f) => {
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      setError("That file is not an image. Upload a JPG or PNG screenshot of the receipt.");
      return;
    }
    setError("");
    setScanned(false);
    setRefNo("");
    setAmountText("");
    setProgress(0);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const scan = async () => {
    if (!file || scanning) return;
    setError("");
    setScanning(true);
    setProgress(0);
    try {
      const prepared = await preprocessReceipt(file);
      const { recognize } = await import("tesseract.js");
      const { data } = await recognize(prepared, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text" && alive.current) {
            setProgress(Math.round((m.progress || 0) * 100));
          }
        },
      });
      if (!alive.current) return;
      const parsed = parseReceiptText(data.text || "");
      setScanned(true);
      setRefNo(parsed.refNo || "");
      setAmountText(parsed.amount != null ? parsed.amount.toFixed(2) : "");
      if (!parsed.refNo && parsed.amount == null) {
        setError("The scan could not read this receipt. Try a brighter, uncropped screenshot, or type the details in by hand.");
      } else if (!parsed.refNo) {
        setError("Reference number not found. Check the screenshot shows the full receipt, or type it in below.");
      } else if (parsed.amount == null) {
        setError("Amount not found. Type the exact amount from the receipt below.");
      }
    } catch {
      if (alive.current) setError("Scanning failed in this browser. You can still type the reference number and amount by hand.");
      setScanned(true);
    } finally {
      if (alive.current) setScanning(false);
    }
  };

  const confirm = async () => {
    const digits = cleanDigits(refNo);
    const amount = parseMoney(amountText);
    if (digits.length < MIN_REF_DIGITS) {
      setError(`Reference number looks short. GCash and Maya references are at least ${MIN_REF_DIGITS} digits.`);
      return;
    }
    if (!amountMatches(amount, due)) {
      setError(`This receipt shows ${formatPeso(amount)} but this order needs exactly ${formatPeso(due)}. Pay the exact amount, then upload that receipt.`);
      return;
    }
    const proof = {
      refNo: digits,
      amount,
      fileName: file?.name || "receipt",
      dataUrl: preview,
      receiptData: await readAsDataURL(file),
    };
    // SweetAlert loads on demand so its weight never touches the first paint.
    const [{ default: Swal }] = await Promise.all([
      import("sweetalert2"),
      import("sweetalert2/dist/sweetalert2.min.css"),
    ]);
    await Swal.fire({
      icon: "success",
      title: "Payment successful",
      html: `<p style="margin:0">Your ${formatPeso(due)} payment for the <strong>${tierName}</strong> card is verified.</p>${
        isMailConfigured() && buyerEmail
          ? `<p style="margin:8px 0 0">A confirmation email is on its way to <strong>${escapeHtml(buyerEmail)}</strong>.</p>`
          : ""
      }`,
      confirmButtonText: "Continue to details",
      confirmButtonColor: "#16a34a",
      background: "#0c130d",
      color: "#ffffff",
      allowOutsideClick: false,
    });
    // Email runs in the background; checkout never waits on it.
    sendPaymentSuccessEmail({
      to: buyerEmail,
      name: buyerName,
      tierName,
      amount,
      refNo: digits,
    });
    onConfirm(proof);
  };

  return (
    <div className="overlay" onClick={() => !scanning && onClose()} role="presentation">
      <div
        className="pay-modal panel"
        role="dialog"
        aria-modal="true"
        aria-label="Pay with QR"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-head">
          <div>
            <div className="hero-badge" style={{ marginBottom: 8 }}>Manual QR payment</div>
            <h2 style={{ margin: 0 }}>Scan to pay · {tierName}</h2>
          </div>
          <button className="btn ghost sm" onClick={onClose} disabled={scanning} aria-label="Close payment dialog">
            Close
          </button>
        </div>

        <div className="pm-amount">
          <span>Pay exactly</span>
          <strong>{formatPeso(due)}</strong>
        </div>

        <QrImage />
        <div className="btn-row" style={{ margin: "10px 0 0" }}>
          <a className="btn ghost sm" href={QR_SRC} download="linkodra-payment-qr.png">
            Download QR
          </a>
        </div>

        <ol className="pm-steps muted small">
          <li>Scan the QR with GCash or any e-wallet and pay the exact amount above.</li>
          <li>Screenshot or download the receipt showing the reference number.</li>
          <li>Upload it below. We read the reference and amount automatically.</li>
        </ol>

        <div
          className={dragging ? "pm-upload dragging" : "pm-upload"}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            hidden
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }}
          />
          {preview ? (
            <img className="pm-thumb" src={preview} alt="Uploaded receipt preview" />
          ) : (
            <span className="muted">Drop the receipt here, or click to choose a JPG / PNG</span>
          )}
        </div>

        {file && !scanned && (
          <button className="btn primary full" onClick={scan} disabled={scanning}>
            {scanning ? <><span className="spinner" /> Reading receipt {progress}%</> : "Scan receipt"}
          </button>
        )}

        {scanning && (
          <div className="pm-progress" aria-label="Scan progress">
            <i style={{ width: `${progress}%` }} />
          </div>
        )}

        {scanned && (
          <>
            <div className="field-row">
              <Field label="Reference number" id="pm-ref" hint="Digits only. Editable if the scan misread.">
                <input
                  id="pm-ref"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="1234 5678 90123"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Amount on receipt" id="pm-amount">
                <input
                  id="pm-amount"
                  value={amountText}
                  onChange={(e) => setAmountText(e.target.value)}
                  placeholder="1399.00"
                  inputMode="decimal"
                />
              </Field>
            </div>
            <div className="btn-row">
              <button className="btn ghost" onClick={() => { setScanned(false); setError(""); }}>
                Rescan
              </button>
              <button className="btn primary" onClick={confirm}>
                Confirm payment
              </button>
            </div>
          </>
        )}

        {error && <p className="pm-error">{error}</p>}
      </div>
    </div>
  );
}
