// Linkodra identity marks and the live card preview.
//
// The card renders the same physical layout the brief calls for: wordmark at the
// top, contactless mark in the middle, and the cardholder's name, title and phone
// anchored at the bottom, in Linkodra's green palette.

import { useState } from "react";
import { DEFAULT_DESIGN, DESIGNS } from "../brand.js";

// The mark on its own, for the card artwork where the wordmark is set as text.
export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 6 C14 3 17 1 20 2 L28 5 C31 6 33 9 33 12 L33 38 C33 41 35 43 38 43 L52 43 C57 43 60 48 57 52 C55 55 52 56 48 56 L24 56 C16 56 10 50 10 42 L10 12 C10 9 12 7 14 6 Z" fill="#ffffff" />
      <path d="M14 22 C18 30 24 36 33 40 L33 38 C33 34 30 31 27 30 C21 28 16 25 14 22Z" fill="rgba(0,0,0,0.22)" />
      <g stroke="#ffffff" strokeWidth="4.2" strokeLinecap="round" fill="none">
        <path d="M40 20 C42 22 43 24 43 27 C43 30 42 32 40 34" />
        <path d="M46 15 C50 18 52 22 52 27 C52 32 50 36 46 39" />
        <path d="M52 10 C58 14 61 20 61 27 C61 34 58 40 52 44" />
      </g>
    </svg>
  );
}

// The wordmark on its own, so surfaces that place the mark in a separate
// badge do not have to render the SVG twice.
//
// Ink comes from .wordmark in CSS, which resolves var(--text). It used to be an
// inline hex chosen by a `dark` prop, which meant the colour was decided in JS
// while the rest of the palette was decided in CSS - two sources of truth that
// disagreed on the first frame after a reload.
export function Wordmark() {
  return (
    <span className="wordmark">
      Link<span className="o-split">o</span>dra
      <sup className="ph">PH</sup>
    </span>
  );
}

export function Logo({ size = 34, wordmark = true }) {
  const green = "#22e948";
  return (
    <span className="logo-wrap" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="Linkodra logo">
        <path d="M14 6 C14 3 17 1 20 2 L28 5 C31 6 33 9 33 12 L33 38 C33 41 35 43 38 43 L52 43 C57 43 60 48 57 52 C55 55 52 56 48 56 L24 56 C16 56 10 50 10 42 L10 12 C10 9 12 7 14 6 Z" fill={green} />
        <path d="M14 22 C18 30 24 36 33 40 L33 38 C33 34 30 31 27 30 C21 28 16 25 14 22Z" fill="rgba(0,0,0,0.28)" />
        <g stroke={green} strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M40 20 C42 22 43 24 43 27 C43 30 42 32 40 34" />
          <path d="M46 15 C50 18 52 22 52 27 C52 32 50 36 46 39" />
          <path d="M52 10 C58 14 61 20 61 27 C61 34 58 40 52 44" />
        </g>
      </svg>
      {wordmark && <Wordmark />}
    </span>
  );
}

export function ContactlessGlyph({ size = 54, color = "#ffffff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M38 22 C40 25 41 28 41 32 C41 36 40 39 38 42" />
        <path d="M46 16 C51 20 53 26 53 32 C53 38 51 44 46 48" />
        <path d="M54 10 C61 16 64 24 64 32 C64 40 61 48 54 54" opacity="0.55" />
      </g>
      <circle cx="20" cy="32" r="6" fill={color} opacity="0.85" />
    </svg>
  );
}

// The hero card is a presentation piece: same artwork as the order preview but
// fixed to the front face, so it can be tilted and floated without being clickable.
// Tilted at rest; hovering straightens it face-on, matching the reference.
export function HeroCard({ name, title, company, phone }) {
  return (
    <div className="card-stage">
      <div className="card-stage-float">
        <div className="card-stage-inner">
          <div className="nfc-card design-gradient glossy">
            <div className="nfc-wordmark">
              <LogoMark size={40} />
              <span>
                LINKODRA
                <em>Tap · Connect · Share</em>
              </span>
            </div>

            <div className="nfc-mid" style={{ justifyContent: "center", flex: 1 }}>
              <ContactlessGlyph size={62} />
            </div>

            <div className="card-holder">
              <div className="card-name">{name}</div>
              <div className="card-sub">{[title, company].filter(Boolean).join(", ")}</div>
              <div className="card-sub mono-sm">{phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardPreview({
  name = "Your Name",
  title = "",
  company = "",
  phone = "",
  tier = "standard",
  design = DEFAULT_DESIGN,
  finish = "glossy",
  code = "yourcode",
}) {
  const [isBack, setIsBack] = useState(false);
  // Orders saved before the single-face redesign can still carry "minimalist",
  // "neon" or "portrait". Those classes are gone, so an unrecognised value
  // falls back to the one face that still exists rather than rendering blank.
  const face = DESIGNS.some((d) => d.id === design) ? design : DEFAULT_DESIGN;
  const subtitle = [title, company].filter(Boolean).join(", ");
  const showPhone = tier !== "basic" && !!phone;

  const classes = [
    "nfc-card",
    `design-${face}`,
    finish === "glossy" ? "glossy" : "matte",
    isBack ? "back" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="card-preview-zone">
      <button
        type="button"
        className={classes}
        aria-label={isBack ? "Card back. Click to see the front." : "Card front. Click to see the back."}
        onClick={() => setIsBack((v) => !v)}
      >
        {!isBack ? (
          <>
            <div className="nfc-row">
              <span className="nfc-badge">LINKODRA PH</span>
              <span>TAP · CONNECT · SHARE</span>
            </div>
            <div className="nfc-mid">
              <ContactlessGlyph />
              <div>
                <div className="card-name">{name || "Your Name"}</div>
                {subtitle && <div className="card-sub">{subtitle}</div>}
                {showPhone && <div className="card-sub">{phone}</div>}
              </div>
            </div>
            <div className="card-foot">
              <strong>Linkodra</strong>
              <span>One Tap. Endless Connections.</span>
            </div>
          </>
        ) : (
          <>
            <div className="nfc-row">
              <span className="nfc-badge">SCAN TO OPEN</span>
              <ContactlessGlyph size={26} />
            </div>
            {tier === "basic" ? (
              <div className="qr-box" style={{ marginTop: 18 }}>NO QR ON THIS TIER</div>
            ) : (
              <>
                <div className="fake-qr" />
                <div className="qr-box" style={{ marginTop: 8 }}>PROFILE + vCard</div>
              </>
            )}
            <div className="card-sub" style={{ textAlign: "center", marginTop: 10 }}>
              linkodra.com/{code}
            </div>
          </>
        )}
      </button>
      <small>Click the card to flip it. Print finish may vary slightly from screen.</small>
    </div>
  );
}