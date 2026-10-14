// Inline SVG icons. Kept local so there is no icon-font or package dependency,
// and so stroke weight and sizing follow the same rules as the type scale.

const paths = {
  bolt: <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />,
  sync: (
    <>
      <path d="M3 12a9 9 0 0 1 15.5-6.2" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2" />
      <path d="M18.5 2.5v3.5H15" />
      <path d="M5.5 21.5V18H9" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-14 16-15 1 11-4 16-12 16H4Z" />
      <path d="M4 20c3-5 7-8 11-9.5" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-3.9 3.4-6.4 7.5-6.4s7.5 2.5 7.5 6.4" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6.5C7 8 5.5 10.4 5.5 13.2c0 2.4 1.4 4 3.4 4 1.8 0 3.1-1.3 3.1-3.1 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.5 1.4-2.8 2.9-3.7l-1.8-1.1Z" />
      <path d="M18 6.5C15.5 8 14 10.4 14 13.2c0 2.4 1.4 4 3.4 4 1.8 0 3.1-1.3 3.1-3.1 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.5 1.4-2.8 2.9-3.7L18 6.5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.7 7.5 10 4.4-1.3 7.5-5.4 7.5-10v-6L12 2.5Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.5 13.8 9l6.5 1.8-6.5 1.8L12 19l-1.8-6.4L3.7 10.8 10.2 9 12 2.5Z" />
      <path d="M18.5 16.5 19.3 19l2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8.8-2.5Z" />
    </>
  ),
  heart: <path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 7.5 3.1c0 5.4-7.5 10-7.5 10Z" />,
  chat: (
    <>
      <path d="M20.5 11.5c0 4.1-3.8 7.4-8.5 7.4-1.2 0-2.4-.2-3.4-.7L3.5 20l1.5-4.3A7 7 0 0 1 3.5 11.5C3.5 7.4 7.3 4 12 4s8.5 3.4 8.5 7.5Z" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="3.2" />
      <path d="M12 4.5V8" />
      <circle cx="12" cy="3.8" r="1.2" />
      <path d="M9 13h.01M15 13h.01" />
      <path d="M2.5 12.5v3M21.5 12.5v3" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  chart: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="5" cy="18" r="2.4" />
      <circle cx="19" cy="18" r="2.4" />
      <path d="M12 7.4 6.2 15.8M12 7.4l5.8 8.4M7.4 18h9.2" />
    </>
  ),
  scan: (
    <>
      <path d="M3.5 8.5v-3a2 2 0 0 1 2-2h3" />
      <path d="M20.5 8.5v-3a2 2 0 0 0-2-2h-3" />
      <path d="M3.5 15.5v3a2 2 0 0 0 2 2h3" />
      <path d="M20.5 15.5v3a2 2 0 0 1-2 2h-3" />
      <path d="M3.5 12h17" />
    </>
  ),
  send: <path d="M4 12 20 4l-6 16-2.6-6.4L4 12Z" />,
  doc: (
    <>
      <path d="M6 3.5h7l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M13 3.5V9h5" />
      <path d="M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.5 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16.5 6.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M18 14c1.8.8 2.8 2.4 2.8 5" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 11.2V4.5a1 1 0 0 1 1-1h6.7a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-6.7 6.7a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7Z" />
      <circle cx="7.8" cy="7.8" r="1.3" />
    </>
  ),
  qr: (
    <>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
      <path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5z" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4l16 16" />
      <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3.2 3.9" />
      <path d="M6.4 7.3A16.6 16.6 0 0 0 2.5 11.2S6 17.4 12 17.4a9.4 9.4 0 0 0 3.6-.7" />
      <path d="M10 10.1a3 3 0 0 0 4 4.1" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2v1" />
      <path d="M3.5 7.5v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-13" />
      <circle cx="16.5" cy="13" r="1.3" />
    </>
  ),
  gift: (
    <>
      <path d="M4 9.5h16V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V9.5Z" />
      <path d="M3 6.5h18v3H3z" />
      <path d="M12 6.5V21" />
      <path d="M12 6.5S10.5 3 8.5 3a2 2 0 0 0 0 4M12 6.5s1.5-3.5 3.5-3.5a2 2 0 0 1 0 4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M6.5 11a5.5 5.5 0 0 1 11 0v3" />
      <path d="M9 11.5a3 3 0 0 1 6 0v5" />
      <path d="M12 12v5.5" />
      <path d="M4 17c.6 1.6 1.7 2.9 3.2 3.8" />
      <path d="M20 17c-.4 1-1 1.9-1.8 2.7" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17 4.5-4.5 3.5 3.5 3-3 5 5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4-4.4 6-7.7 6-10.5A6 6 0 0 0 6 10.5C6 13.3 8 16.6 12 21Z" />
      <circle cx="12" cy="10.3" r="2.3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.6 7 8.4 6 8.4-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </>
  ),
  facebook: (
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63A22 22 0 0 0 14.3 3.5c-2.4 0-4.05 1.47-4.05 4.17v2.23H7.5V13h2.75v8h3.25Z" />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
};

// Stroke-based marks read as line art; fill-based ones are solid glyphs.
const FILLED = new Set(["heart", "facebook"]);

// Icons that read as heavy marks rather than hairline strokes.
const HEAVY = new Set(["plus"]);

// Google's mark, kept as a dedicated component because it is four-colour.
export function GoogleMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.4 6.6-16.1Z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.2H4.3v5.7C7.9 41.1 15.4 46 24 46Z" />
      <path fill="#FBBC05" d="M11.6 28c-.5-1.3-.7-2.7-.7-4s.3-2.7.7-4V14.3H4.3C2.9 17 2 20.4 2 24s.9 7 2.3 9.7l7.3-5.7Z" />
      <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4 30 2 24 2 15.4 2 7.9 6.9 4.3 14.3l7.3 5.7c1.7-5.3 6.6-9.2 12.4-9.2Z" />
    </svg>
  );
}

export function Icon({ name, size = 20, className = "", style, weight }) {
  const solid = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={weight ?? (HEAVY.has(name) ? 2.6 : 1.7)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? null}
    </svg>
  );
}