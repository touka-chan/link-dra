// Shared building blocks. Everything here is presentational and stateless so the
// pages stay focused on flow and the look stays consistent across the site.

import { TIERS, tierRank } from "../brand.js";
import { Icon } from "./icons.jsx";

export function IconBadge({ name, size = 26, small = false }) {
  return (
    <span className={small ? "icon-badge sm" : "icon-badge"}>
      <Icon name={name} size={small ? 17 : size} />
    </span>
  );
}

export function QuoteMark({ size = 44 }) {
  return (
    <span className="quote-mark" style={{ display: "block" }}>
      <Icon name="quote" size={size} />
    </span>
  );
}

export function Field({ label, hint, error, children, id }) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-note">{hint}</p> : null}
    </div>
  );
}

export function Segmented({ value, onChange, options, wrap = false }) {
  return (
    <div className={wrap ? "seg wrap" : "seg"} role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value === o.value ? "sel" : ""}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          title={o.title}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function TierPicker({ value, onChange, columns = true }) {
  return (
    <div className={columns ? "tier-pick" : "cards3"}>
      {TIERS.map((t) => (
        <button key={t.id} type="button" className={value === t.id ? "sel" : ""} onClick={() => onChange(t.id)}>
          {t.popular && <span className="flag">MOST POPULAR</span>}
          <b>{t.name}</b>
          <span>₱{t.price.toLocaleString()}</span>
          <small>{t.pitch}</small>
        </button>
      ))}
    </div>
  );
}

export function Wizard({ step, steps, onJump }) {
  return (
    <ol className="wizard">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = step === n ? "active" : step > n ? "done" : "";
        return (
          <li key={label} className={state}>
            <button type="button" disabled={n > step} onClick={() => onJump?.(n)}>
              {step > n ? "✓ " : ""}
              {n} {label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}


// Renders a feature list, showing which items are outside the viewer's tier.
export function FeatureList({ items, tierId }) {
  const rank = tierRank(tierId);
  return (
    <ul className="ticks">
      {items.map((it) => {
        const locked = typeof it === "object" && it.minTier > rank;
        const label = typeof it === "string" ? it : it.label;
        return (
          <li key={label} className={locked ? "is-locked" : ""}>
            {label}
            {locked && <span className="small"> — {it.tierLabel}</span>}
          </li>
        );
      })}
    </ul>
  );
}


export function Empty({ title, note, action }) {
  return (
    <div className="empty">
      <p>
        <strong>{title}</strong>
      </p>
      {note && <p className="small">{note}</p>}
      {action}
    </div>
  );
}

export function SectionHead({ eyebrow, title, lede }) {
  return (
    <>
      {eyebrow && <div className="hero-badge">{eyebrow}</div>}
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </>
  );
}
