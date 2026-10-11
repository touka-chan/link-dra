// Public marketing pages: home, how it works, features and pricing.

import { BRAND, TIERS, COMPARE } from "../brand.js";
import { CardPreview } from "../components/brand.jsx";
import {
  ANALYTICS_TABS,
  CORE_FEATURES,
  DEVICE_SUPPORT,
  HOW_STEPS,
  PROFILE_ACTIONS,
  TECHNOLOGY,
  TESTIMONIAL,
  TIER_FEATURES,
} from "../data/content.js";
import { FAQS } from "../data/faq.js";
import { DEMO_PROFILE } from "../data/profile.js";

function CtaRow({ go, label = "Get Your Card", tier }) {
  return (
    <div className="btn-row">
      <button className="btn primary big" onClick={() => go("order", tier)}>{label}</button>
      <button className="btn ghost big" onClick={() => go("how")}>How It Works</button>
    </div>
  );
}

export function Home({ go }) {
  const p = DEMO_PROFILE;
  return (
    <>
      <section className="hero">
        <div className="hero-badge">Premium NFC technology</div>
        <h1>
          Your Business Card. <span className="green">Smarter.</span>
        </h1>
        <p className="lede">
          Premium NFC business cards made in the Philippines. Tap once and your profile, portfolio and contact
          details are on their phone, with no app and no account to create.
        </p>
        <div className="mantra">
          {BRAND.mantra.map((word, i) => (
            <span key={word}>
              {word}
              {i < BRAND.mantra.length - 1 && <span className="green"> · </span>}
            </span>
          ))}
        </div>
        <CtaRow go={go} />
      </section>

      <div className="icon-strip">
        {PROFILE_ACTIONS.map((label) => (
          <div key={label}>
            <span className="green">●</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Live card next to the profile it opens, so the tap is legible without scrolling. */}
      <div className="hero-grid">
        <div className="hero-visual" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
          <div className="dash-grid">
            <CardPreview name={p.name} title={p.title} company={p.company} phone={p.phone} tier="pro" design="gradient" orientation="portrait" finish="glossy" code="john" />
            <div className="phone-mock">
              <div className="phone-url">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{ verticalAlign: "-1px", marginRight: 5 }} aria-hidden="true">
                  <path d="M2 4.5V3a3 3 0 0 1 6 0v1.5" stroke="currentColor" strokeWidth="1.2" />
                  <rect x="1" y="4.5" width="8" height="6" rx="1.4" fill="currentColor" />
                </svg>
                linkodra.ph/john
              </div>
              <div className="avatar big">JS</div>
              <span className="phone-name">{p.name}</span>
              <span className="phone-sub">{p.title} · {p.company}</span>
              <button className="btn primary full">Call</button>
              <button className="btn ghost full">Message</button>
              <button className="btn ghost full">Email</button>
              <button className="btn ghost full">Location</button>
              <div className="socials">
                {p.socials.map((s) => (
                  <span key={s.label}>{s.short}</span>
                ))}
              </div>
              <button className="btn primary full">Save Contact</button>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="eyebrow" style={{ textAlign: "center" }}>The technology</div>
        <h2 className="center">Physical presence, digital efficiency</h2>
        <p className="lede">
          The card stays simple. Everything clever happens in the second after someone touches it to their phone.
        </p>
        <div className="cards3">
          {TECHNOLOGY.map((t) => (
            <div className="panel" key={t.title}>
              <h3>{t.title}</h3>
              <p className="muted">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="eyebrow" style={{ textAlign: "center" }}>The lineup</div>
        <h2 className="center">Pick the tier that fits how you network</h2>
        <p className="lede">Every tier is premium PVC with reliable NFC. The difference is what gets printed and what the dashboard can tell you.</p>
        <div className="cards3">
          {TIERS.map((t) => (
            <div className="panel price" key={t.id}>
              {t.popular && <span className="flag">MOST POPULAR</span>}
              <h3>{t.name}</h3>
              <p className="muted small">{t.pitch}</p>
              <div className="amount">
                ₱{t.price.toLocaleString()} <small>/ card</small>
              </div>
              <ul className="ticks">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className="btn primary full" onClick={() => go("order", t.id)}>
                Get {t.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section quote">
        <blockquote>“{TESTIMONIAL.quote}”</blockquote>
        <p>
          <strong>{TESTIMONIAL.name}</strong>
          <br />
          <span className="muted">{TESTIMONIAL.role}</span>
        </p>
      </section>

      <section className="section center">
        <h2>Ready to make your introduction count?</h2>
        <p className="lede">Join the professionals across the Philippines who replaced the paper handshake.</p>
        <CtaRow go={go} label="Get Your Card Today" />
      </section>
    </>
  );
}

export function HowItWorks({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">Seamless connection</div>
      <h1>
        The future of networking <span className="green">is a tap away</span>
      </h1>
      <p className="lede">
        No more lost cards or typing phone numbers into a notes app. A Linkodra card puts your whole digital
        identity on someone's phone in about a second.
      </p>

      <h2>The digital handshake</h2>
      <div className="steps">
        {HOW_STEPS.map((s) => (
          <div className="panel step" key={s.n}>
            <div className="step-n">{s.n}</div>
            <h3>{s.title}</h3>
            <p className="muted">{s.body}</p>
          </div>
        ))}
      </div>

      <h2>Works on the phone they already own</h2>
      <p className="lede">
        Almost every smartphone made in the last decade can read the card without installing anything.
      </p>
      <div className="cards3">
        {DEVICE_SUPPORT.map((d) => (
          <div className="panel" key={d.title}>
            <h3>{d.title}</h3>
            <p className="muted">{d.body}</p>
          </div>
        ))}
      </div>

      <div className="banner">
        <span className="green">●</span>
        <span>There is no app. Nothing to download, no account for the person receiving the card to create.</span>
        <button className="btn primary sm" onClick={() => go("order")}>Get Your Card</button>
      </div>
    </section>
  );
}

export function Features({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">Everything Linkodra can do</div>
      <h1>
        One card. <span className="green">Endless ways to connect.</span>
      </h1>
      <p className="lede">
        From a single tap to AI-assisted networking, a Linkodra card gives you the tools to make every
        introduction land.
      </p>

      <h2>Core features</h2>
      <p className="lede">Included on every card, whichever tier you choose.</p>
      <div className="cards3">
        {CORE_FEATURES.map((f) => (
          <div className="panel" key={f.title}>
            <h3>{f.title}</h3>
            <p className="muted">{f.body}</p>
          </div>
        ))}
      </div>

      <h2>Standard and Pro</h2>
      <div className="cards3">
        {TIER_FEATURES.filter((f) => f.minTier === 2).map((f) => (
          <div className="panel" key={f.title}>
            <span className="eyebrow">{f.tierLabel}</span>
            <h3>{f.title}</h3>
            <p className="muted">{f.body}</p>
          </div>
        ))}
      </div>

      <h2>Pro only</h2>
      <div className="cards2">
        {TIER_FEATURES.filter((f) => f.minTier === 3).map((f) => (
          <div className="panel" key={f.title}>
            <span className="eyebrow">{f.tierLabel}</span>
            <h3>{f.title}</h3>
            <p className="muted">{f.body}</p>
          </div>
        ))}
      </div>

      <h2>Analytics and insights</h2>
      <p className="lede">Understand exactly how your networking is working, tier by tier.</p>
      <div className="cards3">
        {ANALYTICS_TABS.map((a) => (
          <div className="panel" key={a.title}>
            <h3>{a.title}</h3>
            <p className="muted">{a.body}</p>
            <p className="small green" style={{ marginBottom: 0 }}>
              {a.minTier === 1 ? "Every tier" : a.minTier === 2 ? "Standard and Pro" : "Pro only"}
            </p>
          </div>
        ))}
      </div>

      <div className="banner">
        <span>Ready to see what your tier unlocks?</span>
        <button className="btn primary sm" onClick={() => go("pricing")}>Compare tiers</button>
        <button className="btn ghost sm" onClick={() => go("order")}>Get Your Card</button>
      </div>
    </section>
  );
}

function Cell({ value }) {
  if (value === 1) return <span className="green">Included</span>;
  if (value === 0) return <span className="muted">—</span>;
  return value;
}

export function Pricing({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">One tap. One card.</div>
      <h1>
        Pick your card. <span className="green">Elevate your presence.</span>
      </h1>
      <p className="lede">
        Three tiers, one price each, no subscription. Start with what you need now and move up whenever you want.
      </p>

      <div className="cards3">
        {TIERS.map((t) => (
          <div className="panel price" key={t.id}>
            {t.popular && <span className="flag">MOST POPULAR</span>}
            <h3>{t.name}</h3>
            <p className="muted small">{t.pitch}</p>
            <div className="amount">
              ₱{t.price.toLocaleString()} <small>/ card</small>
            </div>
            <ul className="ticks">
              {t.features.map((f) => (
                  <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="btn primary full" onClick={() => go("order", t.id)}>
              Choose {t.name}
            </button>
          </div>
        ))}
      </div>

      <h2>Compare features</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {TIERS.map((t) => (
                <th scope="col" key={t.id}>{t.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={i}>
                    <Cell value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Frequently asked questions</h2>
      <div className="faq">
        {FAQS.filter((f) => f.g === "Ordering & Delivery" || f.g === "The NFC Card").slice(0, 9).map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <p className="small muted center">
        More answers on the <button className="link" onClick={() => go("faq")}>FAQ page</button> or in the{" "}
        <button className="link" onClick={() => go("help")}>Help Center</button>.
      </p>
    </section>
  );
}

