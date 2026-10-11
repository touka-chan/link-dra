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
};

// Stroke-based marks read as line art; fill-based ones are solid glyphs.
const FILLED = new Set(["heart"]);

export function Icon({ name, size = 20, className = "", style }) {
  const solid = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth="1.7"
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