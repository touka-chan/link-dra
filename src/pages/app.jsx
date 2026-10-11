import { useState } from "react";
import { DEMO_PROFILE } from "../data.js";

export function Login({ go }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const login = (asGoogle = false) => {
    localStorage.setItem("lk-user", JSON.stringify({ name: email.split("@")[0] || "Linkodra User", email: email || "user@linkodra.ph", tier: "standard", code: "demo123", google: asGoogle }));
    go("dashboard");
  };
  return (
    <section className="section narrow">
      <div className="panel auth">
        <h1>Welcome back</h1>
        <button className="btn ghost full" onClick={() => login(true)}>Sign in with Google</button>
        <div className="or">OR</div>
        <label>Email or Username</label><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@linkodra.ph" />
        <label>Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" />
        <button className="btn primary full" onClick={() => login()}>SIGN IN</button>
        <button className="link" onClick={() => go("forgot")}>Forgot your password?</button>
        <p className="muted">Demo frontend - any credentials work and stay in localStorage only.</p>
      </div>
    </section>
  );
}

export function Forgot({ go }) {
  const [sent, setSent] = useState(false);
  return (
    <section className="section narrow"><div className="panel">
      <h1>Reset password</h1>
      {!sent ? <><input placeholder="Email" /><div className="btn-row"><button className="btn primary" onClick={() => setSent(true)}>Send reset link</button><button className="btn ghost" onClick={() => go("login")}>Back</button></div></> : <p>Reset link sent (demo). <button className="link" onClick={() => go("login")}>Back to login</button></p>}
    </div></section>
  );
}

export function Dashboard({ go }) {
  const user = JSON.parse(localStorage.getItem("lk-user") || "null");
  const [tab, setTab] = useState("profile");
  const [p, setP] = useState({ ...DEMO_PROFILE, name: user?.name || DEMO_PROFILE.name });
  const [conns, setConns] = useState([
    { n: "Ann Villabas", t: "Ops Manager", via: "Connect button" },
    { n: "Ella Rivero", t: "CEO, Peak Creatives", via: "AI Scan" },
  ]);
  const [ref] = useState({ link: "https://linkodra.ph/r/" + (user?.code || "demo123"), count: 7, earned: 1399, balance: 699 });

  if (!user) return <section className="section narrow"><div className="panel"><h1>Login required (demo)</h1><button className="btn primary" onClick={() => go("login")}>Go to Login</button></div></section>;

  return (
    <section className="section wide">
      <h1>Hi, {p.name} <small className="muted">{user.tier} - linkodra.ph/{user.code}</small></h1>
      <div className="tabs">{["profile", "analytics", "connections", "scan", "refer", "org"].map((t) => <button key={t} className={tab === t ? "sel" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>

      {tab === "profile" && (
        <div className="dash-grid"><div className="panel">
          <h3>Edit Profile - live, no reprint</h3>
          {[["name", "Full name"], ["title", "Title"], ["company", "Company"], ["phone", "Phone"], ["email", "Email"], ["location", "Location"], ["bio", "Bio"]].map(([k, l]) => (
            <div key={k}><label>{l}</label><input value={p[k]} onChange={(e) => setP({ ...p, [k]: e.target.value })} /></div>
          ))}
          <button className="btn primary" onClick={() => alert("Saved locally (demo). In production this updates linkodra.ph/" + user.code)}>Save changes</button>
        </div>
          <div className="panel"><h3>Public preview</h3><p><b>{p.name}</b><br />{p.title} - {p.company}<br />{p.phone} - {p.email}<br />{p.location}</p><p>{p.bio}</p><button className="btn ghost" onClick={() => go("profile")}>Open public page</button></div>
        </div>
      )}
      {tab === "analytics" && (
        <div className="cards3">
          {[["Views", "1,284"], ["Unique", "863"], ["Saves", "212"], ["Clicks", "540"], ["Top link", "Call (38%)"], ["Peak", "Tue 10am"]].map(([k, v]) => <div key={k} className="panel stat"><small>{k}</small><b>{v}</b><div className="bar"><i style={{ width: "64%" }} /></div></div>)}
          <p className="muted">Basic: Overview. Standard+: Audience. Pro: Engagement + Reports. Demo numbers are static.</p>
        </div>
      )}
      {tab === "connections" && (
        <div className="panel"><h3>Connections Hub ({conns.length})</h3>
          {conns.map((c, i) => <div key={i} className="conn"><b>{c.n}</b><small>{c.t} - {c.via}</small><button onClick={() => alert("Send My Details to " + c.n + " (demo: emailed)")}>Send My Details</button></div>)}
          <button className="btn ghost" onClick={() => setConns([...conns, { n: "New Lead " + (conns.length + 1), t: "Walk-in", via: "Manual" }])}>Add manually</button>
        </div>
      )}
      {tab === "scan" && (
        <div className="panel narrow"><h3>AI Business Card Scanner (Standard/Pro)</h3><p>Upload a paper card photo - demo fills sample data.</p><input type="file" accept="image/*" onChange={() => setConns((c) => [...c, { n: "Scanned Card", t: "AI extracted", via: "AI Scan" }])} /><p className="muted">Production OCR runs server-side.</p></div>
      )}
      {tab === "refer" && (
        <div className="cards3"><div className="panel"><h3>Refer and Earn</h3><code>{ref.link}</code><p>Referrals: {ref.count} - Earned: P{ref.earned} - Balance: P{ref.balance}</p><button className="btn primary" onClick={() => navigator.clipboard?.writeText(ref.link)}>Copy link</button></div>
          <div className="panel"><h3>Payout</h3><p>Via GCash / bank transfer (manual in production).</p><button className="btn ghost" onClick={() => alert("Payout requested (demo)")}>Request payout</button></div></div>
      )}
      {tab === "org" && (
        <div className="panel"><h3>Organization (Teams)</h3><p>Admin manages members from here. Logo + colors auto-apply to all profiles.</p><ul><li>Add/remove members</li><li>Unified branding</li><li>Offboarding auto-unlinks</li></ul></div>
      )}
      <div className="btn-row"><button className="btn ghost" onClick={() => { localStorage.removeItem("lk-user"); go("home"); }}>Log out</button></div>
    </section>
  );
}

export function PublicProfile({ go }) {
  const p = DEMO_PROFILE;
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${p.name}\nTITLE:${p.title}\nORG:${p.company}\nTEL:${p.phone}\nEMAIL:${p.email}\nEND:VCARD`;
  const save = () => {
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "linkodra-contact.vcf"; a.click();
  };
  const [connected, setConnected] = useState(false);
  return (
    <section className="section narrow">
      <div className="profile-card">
        <div className="avatar big">JS</div>
        <h1>{p.name}</h1><p>{p.title}<br />{p.company}</p>
        <p className="muted">{p.bio}<br />{p.phone} - {p.email}<br />{p.location}</p>
        {p.links.map((l) => <button key={l.label} className={`btn full ${l.primary ? "primary" : "ghost"}`}>{l.label}</button>)}
        <div className="socials"><span>FB</span><span>IG</span><span>IN</span><span>WA</span></div>
        <button className="btn primary full" onClick={save}>Save Contact (vCard)</button>
        {!connected ? <button className="btn ghost full" onClick={() => setConnected(true)}>Connect with John</button> : <p className="ok">Connected. Owner sees you in Connections Hub (demo).</p>}
        <button className="link" onClick={() => go("order")}>Get your own Linkodra card</button>
      </div>
    </section>
  );
}
