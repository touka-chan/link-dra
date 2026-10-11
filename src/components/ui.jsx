// Shared building blocks. Everything here is presentational and stateless so the
// pages stay focused on flow and the look stays consistent across the site.

import { TIERS, tierRank } from "../brand.js";

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

export function Stat({ label, value, sub, bar }) {
  return (
    <div className="panel stat">
      <small>{label}</small>
      <b>{value}</b>
      {sub && <small>{sub}</small>}
      {typeof bar === "number" && (
        <div className="bar">
          <i style={{ width: `${Math.max(3, Math.min(100, bar))}%` }} />
        </div>
      )}
    </div>
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

// Upgrade prompt used wherever a higher tier unlocks something.
export function Locked({ title, note, tierName, onUpgrade, go }) {
  return (
    <div className="locked">
      <div className="panel" aria-hidden="true">
        <h3>{title}</h3>
        <div className="mini-chart">
          {[38, 62, 45, 80, 54, 70].map((h, i) => (
            <i key={i} style={{ height: "100%" }}>
              <b style={{ height: `${h}%` }} />
            </i>
          ))}
        </div>
        <p className="muted small">Sample data</p>
      </div>
      <div className="locked-note">
        <strong>{tierName} tier feature</strong>
        <span>{note}</span>
        <button className="btn primary sm" onClick={() => (onUpgrade ? onUpgrade() : go?.("pricing"))}>
          Upgrade
        </button>
      </div>
    </div>
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

// Simple bar chart used by the dashboard analytics tabs.
export function BarChart({ values, labels, title }) {
  const max = Math.max(...values, 1);
  return (
    <div>
      {title && <h3>{title}</h3>}
      <div className="mini-chart">
        {values.map((v, i) => (
          <i key={i} style={{ height: "100%" }}>
            <b style={{ height: `${(v / max) * 100}%` }} />
          </i>
        ))}
      </div>
      <div className="spark-labels">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}