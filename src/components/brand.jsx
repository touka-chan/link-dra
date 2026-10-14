// Linkodra identity marks and the live card preview.
//
// The card renders the same physical layout the brief calls for: wordmark at the
// top, contactless mark in the middle, and the cardholder's name, title and phone
// anchored at the bottom, in Linkodra's green palette.

import { useState } from "react";
import { DEFAULT_DESIGN, DESIGNS } from "../brand.js";
import { Icon } from "./icons.jsx";

// The mark on its own, for the card artwork where the wordmark is set as text.
// `color` exists because the mark sits on a white QR panel as often as on the
// black card face; a hardcoded white fill vanished against that background.
export function LogoMark({ size = 40, color = "#ffffff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 6 C14 3 17 1 20 2 L28 5 C31 6 33 9 33 12 L33 38 C33 41 35 43 38 43 L52 43 C57 43 60 48 57 52 C55 55 52 56 48 56 L24 56 C16 56 10 50 10 42 L10 12 C10 9 12 7 14 6 Z" fill={color} />
      <path d="M14 22 C18 30 24 36 33 40 L33 38 C33 34 30 31 27 30 C21 28 16 25 14 22Z" fill="rgba(0,0,0,0.22)" />
      <g stroke={color} strokeWidth="4.2" strokeLinecap="round" fill="none">
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

// The flowing light streaks that sweep the card corners.
//
// Drawn as thin stroked paths rather than a gradient fill on purpose: a fill
// would be the one place the artwork breaks from the solid-colour rule the rest
// of the brand follows. Stacked strokes at varying widths and opacities read as
// motion while staying pure line art, so the card still prints cleanly.
function Ribbons({ corner = "top-left" }) {
  // viewBox matches the card's 1.6 ratio. Stretching a square viewBox instead
  // would bow the sweeps into broad arcs across the middle of the face rather
  // than keeping them swept into the corner where they belong.
  // The front sweeps out of the top-left corner and the back out of the
  // top-right, so the two faces mirror each other the way the printed card
  // does. "bottom-right" is kept for the hero, which sits on a dark stage.
  const sweeps = {
    "top-left": [
      "M -40 214 C 30 196, 116 132, 186 -40",
      "M -40 232 C 42 212, 134 142, 206 -40",
      "M -40 250 C 54 228, 152 152, 226 -40",
      "M -40 268 C 66 244, 170 162, 246 -40",
      "M -40 286 C 78 260, 188 172, 266 -40",
      "M -40 304 C 90 276, 206 182, 286 -40",
      "M -40 322 C 102 292, 224 192, 306 -40",
      "M -40 340 C 114 308, 242 202, 326 -40",
    ],
    "top-right": [
      "M 470 108 C 408 98, 340 60, 288 -40",
      "M 470 126 C 400 114, 326 68, 258 -40",
      "M 470 144 C 392 130, 312 76, 228 -40",
      "M 470 162 C 384 146, 298 84, 198 -40",
      "M 470 180 C 376 162, 284 92, 168 -40",
    ],
    "bottom-right": [
      "M 470 56 C 400 74, 314 138, 244 310",
      "M 470 38 C 398 58, 306 128, 224 310",
      "M 470 20 C 392 42, 294 118, 204 310",
      "M 470 2 C 386 26, 282 108, 184 310",
      "M 470 -16 C 380 10, 270 98, 164 310",
      "M 470 -34 C 374 -6, 258 88, 144 310",
    ],
  }[corner] ?? [];

  return (
    <svg
      className={`card-ribbons card-ribbons-${corner}`}
      viewBox="0 0 430 270"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={`card-glow-${corner}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke="#22e948" filter={`url(#card-glow-${corner})`}>
        {sweeps.map((d, i) => (
          <path
            key={d}
            d={d}
            strokeWidth={i < 2 ? 1.5 : 0.9}
            opacity={i < 2 ? 0.8 - i * 0.2 : 0.45 - i * 0.055}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}

// The lockup that opens both faces: mark, wordmark, and the tagline beneath it.
function CardLockup() {
  return (
    <div className="card-lockup">
      <LogoMark size={38} />
      <span className="card-lockup-text">
        <strong>
          Linkodra <b>PH</b>
        </strong>
        <em>TAP CONNECT SHARE</em>
      </span>
    </div>
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
          <div className="nfc-card">
            <Ribbons corner="top-left" />
            <div className="card-face">
              <div className="card-face-top">
                <CardLockup />
                <ContactlessGlyph size={34} />
              </div>
              <div className="card-rule" />
              <div className="card-face-bottom">
                <div className="card-name">{name}</div>
                <div className="card-role">{[title, company].filter(Boolean).join(" · ")}</div>
                {phone && <div className="card-role-dim mono-sm">{phone}</div>}
              </div>
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
  tier = "standard",
  design = DEFAULT_DESIGN,
  finish = "glossy",
}) {
  const [isBack, setIsBack] = useState(false);
  const face = DESIGNS.some((d) => d.id === design) ? design : DEFAULT_DESIGN;
  const subtitle = [title, company].filter(Boolean).join(" · ");

  // The five back-face shortcuts, matching the printed artwork.
  const shortcuts = [
    { icon: "phone", label: "Call Me" },
    { icon: "mail", label: "Email Me" },
    { icon: "instagram", label: "Follow Me" },
    { icon: "globe", label: "Visit My Website" },
    { icon: "network", label: "Connect With Me" },
  ];

  const classes = ["nfc-card", `design-${face}`, finish === "glossy" ? "glossy" : "matte", isBack ? "back" : ""]
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
            <Ribbons corner="top-left" />
            <div className="card-face">
              <div className="card-face-top">
                <CardLockup />
                <ContactlessGlyph size={32} />
              </div>
              <div className="card-rule" />
              <div className="card-face-bottom">
                <div className="card-name">{name || "Your Name"}</div>
                {subtitle && <div className="card-role">{subtitle}</div>}
              </div>
            </div>
          </>
        ) : (
          <>
            <Ribbons corner="top-right" />
            <div className="card-face card-face-back">
              <CardLockup />
              <div className="card-back-body">
                <ul className="card-shortcuts">
                  {shortcuts.map((s) => (
                    <li key={s.label}>
                      <span className="card-shortcut-icon">
                        <Icon name={s.icon} size={13} />
                      </span>
                      {s.label}
                    </li>
                  ))}
                </ul>
                <span className="card-vertical-rule" />
                <div className="card-qr-side">
                  {tier === "basic" ? (
                    <div className="card-qr-none">NO QR ON THIS TIER</div>
                  ) : (
                    <>
                      <div className="card-qr">
                        <LogoMark size={24} color="#0a1208" />
                      </div>
                      <div className="card-url">
                        <Icon name="globe" size={11} />
                        www.linkodra.com
                      </div>
                    </>
                  )}
                  <div className="card-script">Just Tap. Connect. Share.</div>
                </div>
              </div>
            </div>
          </>
        )}
      </button>
      <small>Click the card to flip it. Print finish may vary slightly from screen.</small>
    </div>
  );
}