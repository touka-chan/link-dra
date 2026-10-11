import { useState } from "react";

// Solid-color logo, no gradient
export function Logo({ size = 34, wordmark = true }) {
  const solid = "#22e948";
  return (
    <span className="logo-wrap" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Linkodra logo">
        <path d="M14 6 C14 3 17 1 20 2 L28 5 C31 6 33 9 33 12 L33 38 C33 41 35 43 38 43 L52 43 C57 43 60 48 57 52 C55 55 52 56 48 56 L24 56 C16 56 10 50 10 42 L10 12 C10 9 12 7 14 6 Z" fill={solid} />
        <path d="M14 22 C18 30 24 36 33 40 L33 38 C33 34 30 31 27 30 C21 28 16 25 14 22Z" fill="rgba(0,0,0,0.28)" />
        <g stroke={solid} strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M40 20 C42 22 43 24 43 27 C43 30 42 32 40 34" />
          <path d="M46 15 C50 18 52 22 52 27 C52 32 50 36 46 39" />
          <path d="M52 10 C58 14 61 20 61 27 C61 34 58 40 52 44" />
        </g>
      </svg>
      {wordmark && (
        <span className="wordmark">
          Link<span className="o-split">o</span>dra
          <sup className="ph">PH</sup>
        </span>
      )}
    </span>
  );
}

export function CardPreview({ name = "Your Name", phone = "", tier = "standard", design = "minimalist", orientation = "landscape", flip = false }) {
  const [isBack, setIsBack] = useState(flip);
  const isPortrait = orientation === "portrait";
  return (
    <div className="card-preview-zone">
      <button
        type="button"
        aria-label="Card preview, click to flip"
        onClick={() => setIsBack(!isBack)}
        className={`nfc-card ${isPortrait ? "portrait" : ""} design-${design} ${isBack ? "back" : ""}`}
      >
        {!isBack ? (
          <>
            <div className="nfc-row">
              <span className="nfc-badge">TAP CONNECT SHARE</span>
              <span className="nfc-icon">NFC</span>
            </div>
            <div className="nfc-mid">
              <svg width="54" height="54" viewBox="0 0 64 64"><path d="M14 6 L28 5 L33 12 L33 38 L52 43 L48 56 L24 56 L10 42 L10 12 Z" fill="#22E948" /><g stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M40 20 C42 22 43 24 43 27 C43 30 42 32 40 34" /><path d="M46 15 C50 18 52 22 52 27 C52 32 50 36 46 39" /></g></svg>
              <div><div className="card-name">{name || "Your Name"}</div><div className="card-sub">{tier === "pro" ? phone || "Linkodra Pro" : phone || "linkodra.ph"}</div></div>
            </div>
            <div className="card-foot"><strong>Linkodra</strong><span>One Tap. Endless Connections.</span></div>
          </>
        ) : (
          <>
            <div className="qr-box">{tier === "basic" ? "NO QR - TAP ONLY" : tier === "pro" ? "DUAL QR" : "QR"}</div>
            <div className="fake-qr" />
            <div className="card-sub">{tier === "pro" ? "Profile + vCard offline" : "linkodra.ph/yourname"}</div>
          </>
        )}
      </button>
      <small>Live preview - click card to flip. Actual print finish may vary.</small>
    </div>
  );
}
