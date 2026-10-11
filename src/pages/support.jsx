// Support and company pages: help center, FAQ, contact, about, teams and legal.

import { useMemo, useState } from "react";
import { BRAND, TIERS } from "../brand.js";
import { Empty, Field, SectionHead } from "../components/ui.jsx";
import { ABOUT } from "../data/content.js";
import { FAQS, FAQ_GROUPS } from "../data/faq.js";
import { HELP_ARTICLES, HELP_CATEGORIES } from "../data/help.js";
import { Icon } from "../components/icons.jsx";

const SORTS = [
  { id: "category", label: "By Category" },
  { id: "az", label: "Title A-Z" },
  { id: "za", label: "Title Z-A" },
];

// Each category gets its own mark so the filter chips read at a glance.
const CATEGORY_ICON = {
  "Getting Started": "sparkle",
  "Ordering & Pricing": "wallet",
  "Your Digital Profile": "user",
  "Analytics & Insights": "chart",
  Connections: "users",
  "Referral Program": "gift",
  "Account & Security": "shield",
  Troubleshooting: "fingerprint",
  "Teams & Organizations": "layers",
};

export function HelpCenter({ go }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [sort, setSort] = useState("category");
  const [open, setOpen] = useState(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = HELP_ARTICLES.filter(
      (a) =>
        (category === "All topics" || a.cat === category) &&
        (!needle || `${a.t} ${a.d} ${a.body}`.toLowerCase().includes(needle))
    );

    if (sort === "az") list = [...list].sort((a, b) => a.t.localeCompare(b.t));
    else if (sort === "za") list = [...list].sort((a, b) => b.t.localeCompare(a.t));
    else list = [...list].sort((a, b) => a.cat.localeCompare(b.cat) || a.t.localeCompare(b.t));

    return list;
  }, [query, category, sort]);

  const counts = useMemo(() => {
    const map = { "All topics": HELP_ARTICLES.length };
    for (const a of HELP_ARTICLES) map[a.cat] = (map[a.cat] ?? 0) + 1;
    return map;
  }, []);

  return (
    <section className="section">
      <SectionHead
        eyebrow="Help center"
        title="How can we help?"
        lede={`Everything about your Linkodra card: ordering, your profile, analytics, connections and more. ${HELP_ARTICLES.length} articles and counting.`}
      />

      <Field label="Search articles" id="help-search">
        <input
          id="help-search"
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by question, topic or keyword"
        />
      </Field>

      <div className="chips">
        {["All topics", ...HELP_CATEGORIES].map((c) => (
          <button
            key={c}
            className={category === c ? "chip sel" : "chip"}
            onClick={() => setCategory(c)}
          >
            <Icon name={c === "All topics" ? "layers" : CATEGORY_ICON[c] ?? "tag"} size={15} />
            {c}
            <small>{counts[c] ?? 0}</small>
          </button>
        ))}
      </div>

      <div className="sort-row">
        <label htmlFor="help-sort" style={{ margin: 0 }}>Sort</label>
        <select
          id="help-sort"
          style={{ width: "auto" }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <span className="muted small">{results.length} {results.length === 1 ? "article" : "articles"}</span>
      </div>

      {results.length === 0 ? (
        <Empty
          title="Nothing matched that search"
          note="Try a shorter phrase, or clear the category filter."
          action={
            <button className="btn ghost" onClick={() => { setQuery(""); setCategory("All topics"); }}>
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="article-list">
          {results.map((a) => {
            const isOpen = open === a.t;
            return (
              <div className={isOpen ? "article is-open" : "article"} key={a.t}>
                <button className="article-head" onClick={() => setOpen(isOpen ? null : a.t)} aria-expanded={isOpen}>
                  <span className="icon-badge sm"><Icon name={CATEGORY_ICON[a.cat] ?? "tag"} size={16} /></span>
                  <span className="article-text">
                    <strong>{a.t}</strong>
                    <small>{a.d}</small>
                    <em>{a.cat}</em>
                  </span>
                  <Icon name="chevronDown" size={17} className={isOpen ? "chev open" : "chev"} />
                </button>
                {isOpen && <p className="article-body muted">{a.body}</p>}
              </div>
            );
          })}
        </div>
      )}

      <div className="banner" style={{ marginTop: 26 }}>
        <span>Still stuck? Send us a message and a human will answer.</span>
        <button className="btn primary sm" onClick={() => go("contact")}>Contact us</button>
      </div>
    </section>
  );
}

// A plus that rotates into a minus when the row opens, matching the reference.
function FaqRow({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? "faq-row is-open" : "faq-row"}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <strong>{q}</strong>
        <span className="faq-sign" aria-hidden="true" />
      </button>
      {open && <p className="muted">{a}</p>}
    </div>
  );
}

export function Faq() {
  const [group, setGroup] = useState(FAQ_GROUPS[0]);

  return (
    <section className="section">
      <SectionHead
        eyebrow="FAQ"
        title="Frequently asked questions"
        lede={`${FAQS.length} questions answered, from how tapping works to how your data is handled.`}
      />

      <div className="seg wrap">
        {FAQ_GROUPS.map((g) => (
          <button key={g} className={group === g ? "sel" : ""} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>

      {FAQS.filter((f) => f.g === group).map((f) => (
        <FaqRow key={f.q} q={f.q} a={f.a} />
      ))}
    </section>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSent(true);
  };

  return (
    <section className="section narrow">
      <SectionHead eyebrow="Let's talk" title="Let's Connect" lede="Have questions about our smart NFC business cards? Drop us a message." />

      <div className="contact-split">
        <div className="contact-info">
          <h2>Connect with us</h2>
          {[
            ["phone", "Phone", BRAND.phone, `tel:${BRAND.phone.replace(/\s/g, "")}`],
            ["mail", "Email", BRAND.email, `mailto:${BRAND.email}`],
            ["pin", "Address", BRAND.address, null],
          ].map(([icon, label, value, href]) => (
            <div className="contact-row" key={label}>
              <span className="icon-badge sm"><Icon name={icon} size={16} /></span>
              <div>
                <em>{label}</em>
                {href ? <a href={href}>{value}</a> : <p>{value}</p>}
              </div>
            </div>
          ))}
        </div>

        {sent ? (
          <div className="panel success">
            <h3>Message sent</h3>
            <p className="muted">
              Thanks {form.name.split(" ")[0]}, we have your message and will reply to {form.email} shortly.
            </p>
            <button className="btn ghost" onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}>
              Send another
            </button>
          </div>
        ) : (
          <form className="panel" onSubmit={submit}>
            <Field label="Name" id="c-name"><input id="c-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Email" id="c-email"><input id="c-email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Message" id="c-msg"><textarea id="c-msg" rows="6" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
            <button className="btn primary full" type="submit">Send message</button>
          </form>
        )}
      </div>
    </section>
  );
}

export function About({ go }) {
  return (
    <section className="section">
      <SectionHead
        eyebrow="Our roots"
        title="Our story"
        lede="Built in Batangas to take the friction out of the professional introduction, and to stop printing things we immediately regret."
      />

      <h2>{ABOUT.spark.title}</h2>
      <div className="grid-side">
        <p className="muted">{ABOUT.spark.body}</p>
        <div className="panel">
          <span className="eyebrow">The idea</span>
          <p style={{ marginBottom: 0 }}>{ABOUT.spark.idea}</p>
        </div>
      </div>

      <h2>{ABOUT.bridge.title}</h2>
      <div className="cards2">
        <div className="panel"><p className="muted">{ABOUT.bridge.body}</p></div>
        <div className="panel">
          {ABOUT.bridge.badges.map((b) => (
            <div className="summary-row" key={b}>
              <span className="green">●</span>
              <strong>{b}</strong>
            </div>
          ))}
        </div>
      </div>

      <h2>{ABOUT.roots.title}</h2>
      <p className="lede">{ABOUT.roots.body}</p>

      <h2>What we build by</h2>
      <div className="cards3">
        {ABOUT.values.map((v) => (
          <div className="panel" key={v.title}>
            <h3>{v.title}</h3>
            <p className="muted">{v.body}</p>
          </div>
        ))}
      </div>

      <h2>Where this is going</h2>
      <div className="cards2">
        {ABOUT.roadmap.map((r) => (
          <div className="panel" key={r.title}>
            <h3>{r.title}</h3>
            <p className="muted">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn primary big" onClick={() => go("order")}>Get your card</button>
        <button className="btn ghost big" onClick={() => go("teams")}>For teams</button>
      </div>
    </section>
  );
}

export function Teams({ go }) {
  return (
    <section className="section">
      <SectionHead
        eyebrow="Teams and organizations"
        title="One brand. Every handshake."
        lede="Link every profile under one organization so the whole team presents the same identity, and onboarding someone takes about a minute."
      />

      <div className="cards3">
        <div className="panel">
          <h3>Unified branding</h3>
          <p className="muted">Your logo and colours apply automatically across every linked profile, overriding individual choices.</p>
        </div>
        <div className="panel">
          <h3>Admin you control</h3>
          <p className="muted">Your own admin adds people, updates titles and approves badges from the Organization tab. No support ticket needed.</p>
        </div>
        <div className="panel">
          <h3>Clean offboarding</h3>
          <p className="muted">Remove someone and their profile unlinks instantly, with any company wallpaper cleared automatically.</p>
        </div>
      </div>

      <h2>What each tier gives your team</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Tier</th>
              <th scope="col">Price per card</th>
              <th scope="col">Best for</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td>₱{t.price.toLocaleString()}</td>
                <td className="muted">{t.pitch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted center">
        Ordering in volume? Talk to us about pricing and shared branding for your whole organisation.
      </p>
      <div className="btn-row">
        <button className="btn primary" onClick={() => go("contact")}>Talk to us about bulk orders</button>
        <button className="btn ghost" onClick={() => go("pricing")}>Compare tiers</button>
      </div>
    </section>
  );
}

const LEGAL = {
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated 1 October 2026",
    body: [
      "We collect the information you give us when you order a card or fill in a form: your name, email, contact number, delivery address, and the contents of the profile you build.",
      "Your profile is public by default, because that is what makes your card work. Anyone who taps it can see what you have chosen to publish. You can set a profile to private from your dashboard at any time.",
      "Analytics are anonymous. We record how often a profile is viewed and which buttons are pressed, along with broad device and source information. We do not build a list of who looked at your profile by name, and we do not sell your data to anyone.",
      "Payments are processed by PayMongo. Your card and bank details are handled entirely by them and never reach our servers.",
      "You can ask us to delete your account and all associated data at any time by contacting us. Note that your card stops working once the profile behind it is removed.",
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "Last updated 1 October 2026",
    body: [
      "A Linkodra card is a one-time purchase. There is no recurring fee, and your profile stays active for as long as your account exists.",
      "The NFC chip ships pre-programmed with your permanent profile link. Reprogramming it will break the connection between your card and your live profile, and we cannot support a card that has been altered.",
      "You are responsible for the content you publish on your profile, including anything that infringes someone else's rights.",
      "Replacement cards, where a card is damaged or faulty, link to your existing profile. No reconfiguration is required.",
      "These terms are governed by Philippine law. Any dispute is subject to the courts of Batangas City.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    updated: "Last updated 1 October 2026",
    body: [
      "We use essential cookies only. These keep you signed in and make sure your session is secure. Without them the dashboard and checkout cannot work.",
      "We do not use advertising cookies, behavioural tracking, or third-party trackers anywhere on the site or on your public profile.",
      "Analytics are collected without cookies being attached to you, and no data is sold to third parties.",
      "You can clear or block cookies in your browser at any time. Doing so will sign you out and require you to sign in again.",
    ],
  },
  shipping: {
    title: "Shipping and Refund Policy",
    updated: "Last updated 1 October 2026",
    body: [
      "Standard delivery within the Philippines is two to four business days in Metro Manila, three to five in Luzon, four to six in Visayas, and five to seven in Mindanao.",
      "Standard and Pro cards carry a printed name, so they need an extra two to three business days for production and quality checks before dispatch.",
      "You may cancel free of charge before your card enters production, which is within twenty-four hours of ordering. After that the files are already with the printer.",
      "Cards that arrive damaged, or with a printing fault, are replaced free of charge. Send us a photo and your order number.",
      "Change of mind after delivery is not covered, because every card is personalised to you.",
    ],
  },
  dispute: {
    title: "Dispute Resolution Policy",
    updated: "Last updated 1 October 2026",
    body: [
      "If something has gone wrong, contact us first. Most disputes, from a delayed delivery to a printing fault, are resolved without needing a formal process.",
      "If we cannot settle it between us, we will put it in writing with our position and the evidence behind it, and we will give you a reasonable window to respond.",
      "If it still cannot be resolved, the matter falls under Philippine law, with the courts of Batangas City having jurisdiction.",
      "We would much rather fix a problem than win an argument.",
    ],
  },
};

export function Legal({ doc }) {
  const legal = LEGAL[doc] ?? LEGAL.privacy;

  return (
    <section className="section narrow">
      <SectionHead eyebrow="Legal" title={legal.title} />
      <p className="small muted">{legal.updated}</p>
      <div className="panel">
        {legal.body.map((para, i) => (
          <p className="muted" key={i}>{para}</p>
        ))}
      </div>
      <p className="small muted center">
        This is a frontend demonstration. Replace this text with counsel-approved wording before launch.
      </p>
    </section>
  );
}