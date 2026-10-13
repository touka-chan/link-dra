// Public marketing pages: one-page landing plus the section blocks it is
// composed from. The nav scrolls to anchors on the landing instead of
// opening separate pages.

import { useEffect } from "react";
import { TIERS, COMPARE } from "../brand.js";
import { HeroCard } from "../components/brand.jsx";
import { Icon } from "../components/icons.jsx";
import { IconBadge, QuoteMark } from "../components/ui.jsx";
import {
  ANALYTICS_TABS,
  CORE_FEATURES,
  DEVICE_SUPPORT,
  HOW_STEPS,
  TECHNOLOGY,
  TESTIMONIAL,
  TIER_FEATURES,
} from "../data/content.js";
import { FAQS } from "../data/faq.js";
import { DEMO_PROFILE } from "../data/profile.js";
import { Contact, Faq, HelpCenter } from "./support.jsx";

function TierCard({ tier, onSelect, compact = false }) {
  const featured = tier.popular;
  return (
    <div className={featured ? "tier-card is-featured" : "tier-card"}>
      {featured && <span className="tier-flag">Most Popular</span>}
      <div className="tier-name">{tier.name}</div>
      <div className="tier-price">
        <span className="cur">₱</span>
        {tier.price.toLocaleString()}
        {!compact && <span className="per"> / card</span>}
      </div>
      <p className="tier-desc">{tier.pitch}</p>
      <ul className="tier-features">
        {tier.features.map((f) => (
          <li key={f.label} className={f.off ? "off" : ""}>
            <Icon name={f.off ? "close" : f.icon} size={17} />
            {f.label}
          </li>
        ))}
      </ul>
      <button
        className={featured ? "btn primary" : "btn ghost"}
        onClick={() => onSelect(tier.id)}
      >
        Get {tier.name}
      </button>
    </div>
  );
}

export function Home({ go, section }) {
  const p = DEMO_PROFILE;

  // Deep links (for example #/pricing) land on the matching block.
  useEffect(() => {
    if (!section) return;
    document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [section]);

  return (
    <>
      <section className="hero-split">
        <div className="hero-copy">
          <div className="hero-badge">Premium NFC technology</div>

          <h1 className="display">
            <span className="line">Your Business Card.</span>
            <span className="line accent">Smarter.</span>
          </h1>

          <p className="hero-lede">
            Premium <a href="#/how-it-works">NFC business cards</a> made in the Philippines. Tap once and your
            profile, portfolio and contact details are on their phone, with no app and no account to create.
          </p>

          <div className="cta-row">
            <button className="cta-primary" onClick={() => go("order")}>
              Get Your Card
              <Icon name="arrowRight" size={18} />
            </button>
            <button className="cta-ghost" onClick={() => go("how")}>How It Works</button>
          </div>
        </div>

        <HeroCard name={p.name} title={p.title} company={p.company} phone={p.phone} />
      </section>

      <section className="band">
        <div className="band-head">
          <h2>The Technology</h2>
          <p>Engineered for a seamless introduction. The card merges physical presence with digital efficiency.</p>
        </div>
        <div className="cards3">
          {TECHNOLOGY.map((t) => (
            <div className="panel feature-card" key={t.title}>
              <IconBadge name={t.icon} />
              <h3>{t.title}</h3>
              <p className="muted">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="section-how" className="anchor">
        <HowItWorks go={go} />
      </div>

      <div id="section-features" className="anchor">
        <Features go={go} />
      </div>

      <div id="section-pricing" className="anchor">
        <Pricing go={go} />
      </div>

      <section className="band">
        <div className="testimonial">
          <QuoteMark />
          <blockquote>
            “I used to spend a conference weekend handing out cards I knew were{" "}
            <span className="accent">already out of date</span>. Now I hand out one card and edit everything else
            from my phone the night before.”
          </blockquote>
          <div className="person-line">
            <span className="avatar">AV</span>
            <span className="who">
              <strong>{TESTIMONIAL.name}</strong>
              <span>{TESTIMONIAL.role}</span>
            </span>
          </div>
        </div>
      </section>

      <div id="section-help" className="anchor">
        <HelpCenter go={go} />
      </div>

      <div id="section-faq" className="anchor">
        <Faq />
      </div>

      <div id="section-contact" className="anchor">
        <Contact />
      </div>

      <section className="band final-cta">
        <h2>
          Ready to make your
          <br />
          introduction count?
        </h2>
        <p>Join the professionals across the Philippines who replaced the paper handshake.</p>
        <div className="cta-row">
          <button className="cta-primary" onClick={() => go("order")}>
            Get Your Card Today
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
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

      <h2>Standard</h2>
      <p className="lede">Everything the Standard card adds over Basic.</p>
      <div className="cards3">
        {TIER_FEATURES.filter((f) => f.minTier >= 2).map((f) => (
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
              {a.minTier === 1 ? "Every tier" : "Standard"}
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
        Two tiers, one price each, no subscription. Start with what you need now and move up whenever you want.
      </p>

      <div className="tier-set">
        {TIERS.map((t) => (
          <TierCard key={t.id} tier={t} onSelect={(id) => go("order", id)} />
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

