import { useState } from "react";
import { HELP_ARTICLES, FAQS } from "../data.js";
import { BRAND } from "../brand.js";

export function HelpCenter() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(HELP_ARTICLES.map((a) => a.cat))];
  const list = HELP_ARTICLES.filter((a) => (cat === "All" || a.cat === cat) && (a.t + a.d + a.body).toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="section">
      <div className="hero-badge">HELP CENTER</div>
      <h1>How can we help?</h1>
      <input className="search" placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="seg wrap">{cats.map((c) => <button key={c} className={cat === c ? "sel" : ""} onClick={() => setCat(c)}>{c}</button>)}</div>
      <p className="muted">{list.length} articles</p>
      <div className="faq">{list.map((a) => <details key={a.t}><summary><b>{a.t}</b><br /><small>{a.d} - {a.cat}</small></summary><p>{a.body}</p></details>)}</div>
    </section>
  );
}

export function Faq() {
  return <section className="section"><div className="hero-badge">FAQ</div><h1>Frequently Asked Questions</h1><div className="faq">{FAQS.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>;
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section narrow">
      <h1>Let's Connect</h1>
      <div className="panel"><p>Phone: {BRAND.phone}<br />Email: {BRAND.email}<br />Address: {BRAND.address}</p></div>
      {sent ? <div className="panel success">Message sent (demo, stored locally).</div> : (
        <div className="panel"><label>Name</label><input /><label>Email</label><input /><label>Message</label><textarea rows="4" /><button className="btn primary" onClick={() => setSent(true)}>Send Message</button></div>
      )}
    </section>
  );
}

export function About({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">Our Roots</div>
      <h1>Our Story</h1>
      <p className="lede">Born in Batangas. Built to replace paper cards. One durable NFC card is a permanent digital bridge.</p>
      <div className="cards3">
        {[["Sustainability", "Eliminate paper waste. Build for long term."], ["Innovation", "High-performance NFC + live profiles."], ["Community", "Rooted in Batangas, connecting the world."]].map(([t, d]) => <div key={t} className="panel"><h3>{t}</h3><p>{d}</p></div>)}
      </div>
      <div className="btn-row"><button className="btn primary" onClick={() => go("order")}>Get Your Card</button></div>
    </section>
  );
}

export function Teams({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">TEAMS AND ORGANIZATIONS</div>
      <h1>One brand. Every handshake.</h1>
      <div className="cards3">
        <div className="panel"><h3>Unified branding</h3><p>Logo + colors auto-apply to every linked profile.</p></div>
        <div className="panel"><h3>Admin dashboard</h3><p>Add/remove members, positions, badges - no support ticket needed.</p></div>
        <div className="panel"><h3>Clean offboarding</h3><p>Remove member: unlink and clear wallpaper instantly.</p></div>
      </div>
      <div className="btn-row"><button className="btn primary" onClick={() => go("contact")}>Contact for bulk pricing</button></div>
    </section>
  );
}

const LEGAL = {
  privacy: ["Privacy Policy", "Demo frontend. We store demo data in your browser localStorage only. No sale of data, essential cookies only. Production needs PayMongo + backend DPA."],
  terms: ["Terms of Service", "One-time card purchase. Digital profile stays active. Do not reprogram NFC chip. Replacement cards link to same profile."],
  cookies: ["Cookie Policy", "Essential cookies only for login/session. No advertising or behavioral tracking."],
  shipping: ["Shipping and Refund Policy", "3-5 business days PH + 2-3 print QA. Cancel within 24h pre-print for full refund. Defective on arrival: replacement."],
  dispute: ["Dispute Resolution", "Contact us first. Unresolved disputes under PH law, venue Batangas City."],
};
export function Legal({ doc }) {
  const [t, b] = LEGAL[doc] || LEGAL.privacy;
  return <section className="section narrow"><div className="panel"><h1>{t}</h1><p>{b}</p><p className="muted">Frontend placeholder - replace with counsel-approved text before WordPress launch.</p></div></section>;
}
