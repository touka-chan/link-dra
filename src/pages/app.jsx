// The public profile a card tap opens, plus the coming-soon page.

import { useMemo, useState } from "react";
import { BRAND } from "../brand.js";
import { Icon } from "../components/icons.jsx";
import { Field } from "../components/ui.jsx";
import { read } from "../store.js";
import { DEMO_PROFILE } from "../data/profile.js";

const LS_PROFILE = "profile";

function vcardFor(p) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.name}`,
    `TITLE:${p.title}`,
    `ORG:${p.company}`,
    `TEL;TYPE=CELL:${p.phone.replace(/\s/g, "")}`,
    `EMAIL;TYPE=INTERNET:${p.email}`,
    p.website ? `URL:${p.website.startsWith("http") ? p.website : `https://${p.website}`}` : null,
    `NOTE:${BRAND.tagline}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

export function PublicProfile({ code, go }) {
  const [connected, setConnected] = useState(false);
  const [visitor, setVisitor] = useState({ name: "", email: "" });
  const [sent, setSent] = useState(false);
  const profile = useMemo(() => read(LS_PROFILE, DEMO_PROFILE), []);
  const p = profile;

  const saveContact = () => {
    const blob = new Blob([vcardFor(p)], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.name.replace(/\s+/g, "-").toLowerCase()}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/c/${code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: p.name, text: `${p.name} — ${p.title} at ${p.company}`, url });
        return;
      } catch {
        /* dismissed, fall through to clipboard */
      }
    }
    navigator.clipboard?.writeText(url);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  // A private profile shows a notice instead of the cardholder's details, which
  // is what the help centre and privacy policy promise.
  if (profile.visibility === "private") {
    return (
      <section className="section narrow">
        <div className="profile-card">
          <span className="icon-badge" style={{ margin: "0 auto 20px" }}>
            <Icon name="shield" size={26} />
          </span>
          <h1>This profile is private</h1>
          <p className="muted">
            The cardholder has chosen not to publish their details. Nothing is shown to visitors, but the card
            itself is still working.
          </p>
          <button className="btn primary full" onClick={() => go("order")}>
            Get your own Linkodra card
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section narrow">
      <div className="profile-card">
        <div className="avatar big">{p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
        <h1>{p.name}</h1>
        <p className="role">{p.title} · {p.company}</p>
        <p className="muted">{p.bio}</p>

        {p.links.map((l) => (
          <a key={l.label} className={`btn full ${l.primary ? "primary" : "ghost"}`} href={l.action}>
            {l.label}
          </a>
        ))}

        <div className="socials">
          {p.socials.map((s) => (
            <span key={s.label} title={s.handle}>{s.short}</span>
          ))}
        </div>

        <button className="btn primary full" onClick={saveContact}>Save contact</button>
        <button className="btn ghost full" onClick={share}>{sent ? "Link copied" : "Share this profile"}</button>

        <div className="panel tight" style={{ marginTop: 18, textAlign: "left" }}>
          <strong>Connect with {p.name.split(" ")[0]}</strong>
          <p className="small muted">Leave your details and they will show up in this cardholder's connections.</p>
          {connected ? (
            <p className="ok small">Thanks. {p.name.split(" ")[0]} has your details now.</p>
          ) : (
            <>
              <Field label="Your name" id="v-name">
                <input id="v-name" value={visitor.name} onChange={(e) => setVisitor({ ...visitor, name: e.target.value })} placeholder="Maria Santos" />
              </Field>
              <Field label="Your email" id="v-email">
                <input id="v-email" type="email" value={visitor.email} onChange={(e) => setVisitor({ ...visitor, email: e.target.value })} placeholder="maria@company.ph" />
              </Field>
              <button className="btn primary full" onClick={() => setConnected(true)}>Connect</button>
            </>
          )}
        </div>

        <p className="small muted" style={{ marginTop: 16 }}>
          <span className="green">NFC</span> · Opened from {BRAND.url}/{code}
        </p>
        <button className="link full" onClick={() => go("order")}>Get your own Linkodra card</button>
      </div>
    </section>
  );
}

export function ComingSoon({ go }) {
  return (
    <section className="section narrow center">
      <div className="hero-badge">Coming soon</div>
      <h1>We are still building this</h1>
      <p className="lede">
        Careers and feature requests are not open yet. If either matters to you, tell us and we will keep you in
        the loop when it is.
      </p>
      <div className="btn-row">
        <button className="btn primary" onClick={() => go("contact")}>Get in touch</button>
        <button className="btn ghost" onClick={() => go("home")}>Back home</button>
      </div>
    </section>
  );
}