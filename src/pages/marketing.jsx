import { BRAND, TIERS } from "../brand.js";
import { FEATURES_CORE, STEPS, FAQS, DEMO_PROFILE } from "../data.js";
import { CardPreview } from "../components/brand.jsx";

export function Home({ go }) {
  return (
    <>
      <section className="hero">
        <div className="hero-badge">{BRAND.name} - tap.connect.share - {BRAND.sub}</div>
        <h1>Your Business Card. <span className="green">Smarter.</span></h1>
        <p className="lede">Premium NFC technology - made in the Philippines. Instantly share your profile, portfolio and contact details with a single tap.</p>
        <div className="mantra">{BRAND.mantra.map((m) => <span key={m}>{m}</span>)}</div>
        <div className="btn-row">
          <button className="btn primary big" onClick={() => go("order")}>Get Your Card</button>
          <button className="btn ghost big" onClick={() => go("how")}>How it Works</button>
        </div>
        <div className="hero-visual">
          <div className="hv-col">
            <div className="hv-label">YOUR CARD</div>
            <CardPreview name="Ella Rivero" phone="CEO, Peak Creatives" />
          </div>
          <div className="tap-connector" aria-hidden="true">
            <span>TAP</span>
            <small>1-2 sec</small>
          </div>
          <div className="hv-col">
            <div className="hv-label">THEIR PHONE</div>
            <div className="phone-mock">
              <div className="phone-url">linkodra.ph/john</div>
              <div className="avatar">JS</div>
              <strong className="phone-name">{DEMO_PROFILE.name}</strong>
              <small className="phone-sub">{DEMO_PROFILE.title}<br />{DEMO_PROFILE.company}</small>
              <button className="btn primary full">Call</button>
              <button className="btn ghost full">Message</button>
              <button className="btn ghost full">Email</button>
              <button className="btn ghost full">Location</button>
              <div className="socials"><span>FB</span><span>IG</span><span>IN</span><span>WA</span></div>
              <button className="btn primary full" onClick={() => go("profile")}>Save Contact</button>
              <em className="script">One Tap. Endless Connections.</em>
            </div>
          </div>
        </div>
        <div className="icon-strip">
          {["Contact Details", "Social Links", "Digital Profile", "Location and Maps", "Share Instantly", "NFC and QR Enabled"].map((l) => (
            <div key={l}><span>{l}</span></div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>The Technology</h2>
        <p className="muted">Physical presence meets digital efficiency.</p>
        <div className="cards3">
          {[{ t: "Instant Networking", d: "No apps. One tap transfers your full profile to any modern smartphone." }, { t: "Dynamic Profiles", d: "Update anytime via dashboard. Physical card always shows latest info." }, { t: "Sustainable Impact", d: "Replace thousands of paper cards with one durable PVC card." }].map((c) => (
            <div key={c.t} className="panel"><h3>{c.t}</h3><p>{c.d}</p></div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>The Lineup</h2>
        <div className="cards3">
          {TIERS.map((t) => (
            <div key={t.id} className={`panel price ${t.popular ? "pop" : ""}`}>
              {t.popular && <span className="flag">MOST POPULAR</span>}
              <h3>{t.name}</h3><div className="amount">P{t.price.toLocaleString()}</div>
              <small>{t.desc}</small>
              <ul>{t.features.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul>
              <button className="btn primary full" onClick={() => go("order", t.id)}>Get {t.name}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="section quote">
        <blockquote>"Switching to Linkodra changed how I network at conferences. Faster, professional, never run out of cards."</blockquote>
        <b>Ann Villabas - Operations Manager, Batangas</b>
        <div className="btn-row center"><button className="btn primary big" onClick={() => go("order")}>Get Your Card Today</button></div>
      </section>
    </>
  );
}

export function HowItWorks({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">Seamless Connection</div>
      <h1>The Future of Networking is a Tap Away.</h1>
      <p className="lede">No lost cards. No manual typing. NFC instantly shares your digital identity.</p>
      <div className="steps">
        {STEPS.map((s) => <div key={s.n} className="panel"><span className="step-n">{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
      <div className="cards3">
        <div className="panel"><h3>iOS</h3><p>iPhone XR and newer, Background Tag Reading on by default.</p></div>
        <div className="panel"><h3>Android</h3><p>Most devices 2018+ with NFC enabled in settings.</p></div>
        <div className="panel"><h3>No NFC? No problem</h3><p>QR on back of Standard/Pro does the job with any camera.</p></div>
      </div>
      <div className="btn-row"><button className="btn primary" onClick={() => go("order")}>Get Your Card</button><button className="btn ghost" onClick={() => go("features")}>See Features</button></div>
    </section>
  );
}

export function Features({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">Everything Linkodra Can Do</div>
      <h1>One Card. Endless Ways to Connect.</h1>
      <h2>Core Features - included with every card</h2>
      <div className="cards3">{FEATURES_CORE.map((f) => <div key={f.title} className="panel"><h3>{f.title}</h3><p>{f.text}</p></div>)}</div>
      <h2>Standard and Pro Exclusive</h2>
      <div className="cards3">
        <div className="panel"><h3>AI Business Card Scanner</h3><p>Snap a paper card: name, title, company, phone, email straight into Connections.</p></div>
        <div className="panel"><h3>Analytics and Insights</h3><p>Overview on all tiers. Audience on Standard+. Engagement + Reports on Pro.</p></div>
        <div className="panel"><h3>Offline vCard QR</h3><p>Pro second QR saves contact with no internet.</p></div>
      </div>
      <div className="btn-row"><button className="btn primary" onClick={() => go("pricing")}>See Pricing and Tiers</button></div>
    </section>
  );
}

export function Pricing({ go }) {
  return (
    <section className="section">
      <div className="hero-badge">One Tap. One Card.</div>
      <h1>Pick your card. Elevate your presence.</h1>
      <div className="cards3">
        {TIERS.map((t) => (
          <div key={t.id} className={`panel price ${t.popular ? "pop" : ""}`}>
            {t.popular && <span className="flag">MOST POPULAR</span>}
            <h3>{t.name}</h3><div className="amount">P{t.price.toLocaleString()}<small>/card</small></div>
            <small>{t.desc}</small>
            <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <button className="btn primary full" onClick={() => go("order", t.id)}>Choose {t.name}</button>
          </div>
        ))}
      </div>
      <h2>Compare</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Feature</th><th>Basic</th><th>Standard</th><th>Pro</th></tr></thead>
        <tbody>
          {[["Card Branding", "Linkodra + Name", "Custom Name", "Name + Logo"], ["QR Code", "None", "Profile Link", "Profile + vCard"], ["Analytics", "Overview", "Overview + Audience", "All + Engagement + Reports"], ["AI Scanner", "No", "Yes", "Yes"], ["Send My Details", "Yes", "Yes", "Yes"], ["Offline Access", "No", "No", "vCard Embedded"]].map((r) => (
            <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
          ))}
        </tbody>
      </table></div>
      <h2>FAQ</h2>
      <div className="faq">{FAQS.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
    </section>
  );
}
