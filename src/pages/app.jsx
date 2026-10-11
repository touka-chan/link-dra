// Account surfaces: sign-in, password reset, the dashboard, and the public
// profile that a card tap opens.

import { useMemo, useState } from "react";
import { BRAND, REFERRAL_RATE, TIERS, tierById } from "../brand.js";
import { LogoMark, Wordmark } from "../components/brand.jsx";
import { GoogleMark, Icon } from "../components/icons.jsx";
import { BarChart, Empty, Field, Locked, Segmented, Stat } from "../components/ui.jsx";
import { read, remove, write } from "../store.js";
import {
  DEMO_ANALYTICS,
  DEMO_CONNECTIONS,
  DEMO_MEMBERS,
  DEMO_PROFILE,
  SCAN_SAMPLES,
} from "../data/profile.js";

const LS_USER = "user";
const LS_PROFILE = "profile";
const LS_CONNECTIONS = "connections";
const LS_SENT = "sent";

export function Login({ go }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [reveal, setReveal] = useState(false);

  const signIn = (method) => {
    write(LS_USER, {
      name: email.split("@")[0] || "Linkodra User",
      email: email || "you@linkodra.ph",
      method,
      remember,
    });
    go("dashboard");
  };

  return (
    <section className="section narrow auth-wrap">
      <div className="panel auth">
        <div className="auth-lockup">
          <span className="auth-mark"><LogoMark size={30} /></span>
          <div>
            <Wordmark />
            <em>TAP · CONNECT · SHARE</em>
          </div>
        </div>

        <h1>Welcome back</h1>

        <button className="btn-google" onClick={() => signIn("google")}>
          <GoogleMark />
          Sign in with Google
        </button>

        <div className="or"><span>OR</span></div>

        <Field label="Email or username" id="email">
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
          />
        </Field>

        <Field label="Password" id="password">
          <div className="password-wrap">
            <input
              id="password"
              type={reveal ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="reveal"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
            >
              <Icon name={reveal ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>
        </Field>

        <div className="check">
          <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <label htmlFor="remember">Remember me</label>
        </div>

        <button className="btn primary full auth-submit" onClick={() => signIn("password")}>
          Sign in
        </button>

        <button className="link full auth-forgot" onClick={() => go("forgot")}>
          Forgot your password?
        </button>

        <p className="small muted center auth-demo">Demo sign-in. Any details work and nothing leaves this browser.</p>
      </div>
    </section>
  );
}

export function Forgot({ go }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="section narrow">
      <div className="panel">
        <h1>Reset your password</h1>
        {!sent ? (
          <>
            <p className="muted">Enter the email on your account and we will send you a reset link.</p>
            <Field label="Email" id="reset-email">
              <input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.ph" />
            </Field>
            <div className="btn-row">
              <button className="btn primary" onClick={() => setSent(true)}>Send reset link</button>
              <button className="btn ghost" onClick={() => go("login")}>Back to sign in</button>
            </div>
          </>
        ) : (
          <div className="panel success">
            <p>If an account exists for <strong>{email || "that address"}</strong>, a reset link is on its way. The link expires in an hour.</p>
            <button className="btn ghost" onClick={() => go("login")}>Back to sign in</button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileTab({ profile, setProfile, user, go }) {
  const [saved, setSaved] = useState(false);
  const isPublic = profile.visibility !== "private";
  const set = (key) => (e) => {
    setProfile({ ...profile, [key]: e.target.value });
    setSaved(false);
  };

  const save = () => {
    write(LS_PROFILE, profile);
    setSaved(true);
  };

  const setVisibility = (visibility) => {
    const next = { ...profile, visibility };
    setProfile(next);
    write(LS_PROFILE, next);
    setSaved(true);
  };

  return (
    <div className="dash-grid">
      <div className="panel">
        <h3>Edit profile</h3>
        <p className="muted small">Changes go live the moment you save. Your card never needs reprinting.</p>

        <div className="field-row">
          <Field label="Full name" id="p-name"><input id="p-name" value={profile.name} onChange={set("name")} /></Field>
          <Field label="Job title" id="p-title"><input id="p-title" value={profile.title} onChange={set("title")} /></Field>
        </div>
        <Field label="Company" id="p-company"><input id="p-company" value={profile.company} onChange={set("company")} /></Field>
        <div className="field-row">
          <Field label="Primary phone" id="p-phone"><input id="p-phone" value={profile.phone} onChange={set("phone")} /></Field>
          <Field label="WhatsApp" id="p-wa"><input id="p-wa" value={profile.whatsapp} onChange={set("whatsapp")} /></Field>
        </div>
        <Field label="Email" id="p-email"><input id="p-email" type="email" value={profile.email} onChange={set("email")} /></Field>
        <Field label="Location" id="p-loc"><input id="p-loc" value={profile.location} onChange={set("location")} /></Field>
        <Field label="Website" id="p-web"><input id="p-web" value={profile.website} onChange={set("website")} /></Field>
        <Field label="Short bio" id="p-bio" hint="One or two lines. This is what people read first.">
          <textarea id="p-bio" rows="3" value={profile.bio} onChange={set("bio")} />
        </Field>

        <div className="btn-row left">
          <button className="btn primary" onClick={save}>Save changes</button>
          {saved && <span className="ok small">Saved to this browser</span>}
        </div>
      </div>

      <div className="panel">
        <h3>Live preview</h3>
        <div className="avatar big" style={{ margin: "12px auto" }}>
          {profile.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
        <p className="center">
          <strong>{profile.name}</strong><br />
          <span className="muted">{profile.title} · {profile.company}</span>
        </p>
        <p className="muted small">{profile.bio}</p>
        <div className="summary-row"><span>Profile link</span><strong className="green">{BRAND.url}/{user.code ?? "yourcode"}</strong></div>

        <label className="field-label">Profile visibility</label>
        <Segmented
          value={profile.visibility ?? "public"}
          onChange={setVisibility}
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
        />
        <p className="field-note">
          {isPublic
            ? "Anyone who taps your card can open this profile. That is what makes the card work."
            : "Your profile is hidden. Visitors tapping your card will see a private notice. Your card and analytics keep working."}
        </p>

        <button className="btn ghost full" onClick={() => go("profile")}>Open public profile</button>
      </div>
    </div>
  );
}

function AnalyticsTab({ tier }) {
  const rank = tierById(tier).rank;
  const { overview, audience, engagement } = DEMO_ANALYTICS;

  return (
    <>
      <div className="cards4">
        <Stat label="Views" value={overview.views.toLocaleString()} bar={100} />
        <Stat label="Unique visitors" value={overview.unique.toLocaleString()} bar={(overview.unique / overview.views) * 100} />
        <Stat label="Contact saves" value={overview.saves.toLocaleString()} bar={(overview.saves / overview.views) * 100} />
        <Stat label="Link clicks" value={overview.clicks.toLocaleString()} bar={(overview.clicks / overview.views) * 100} />
      </div>

      <div className="cards2" style={{ marginTop: 16 }}>
        <div className="panel">
          <BarChart title="Views over the last 12 months" values={overview.trend} labels={overview.trendLabels} />
        </div>
        <div className="panel">
          <h3>Busiest window</h3>
          <div className="amount" style={{ fontSize: 20 }}>{audience.peak}</div>
          <p className="muted small">When your network is most likely to tap.</p>
        </div>
      </div>

      {rank >= 2 ? (
        <div className="cards2" style={{ marginTop: 16 }}>
          <div className="panel">
            <h3>Audience</h3>
            {[...audience.devices, ...audience.sources].map((row) => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div className="summary-row" style={{ padding: "4px 0", borderBottom: 0 }}>
                  <span>{row.label}</span>
                  <strong>{row.value}%</strong>
                </div>
                <div className="bar"><i style={{ width: `${row.value}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>Engagement by link</h3>
            {rank >= 3 ? (
              engagement.links.map((row) => (
                <div key={row.label} style={{ marginBottom: 10 }}>
                  <div className="summary-row" style={{ padding: "4px 0", borderBottom: 0 }}>
                    <span>{row.label}</span>
                    <strong>{row.value}%</strong>
                  </div>
                  <div className="bar"><i style={{ width: `${row.value * 2.2}%` }} /></div>
                </div>
              ))
            ) : (
              <Locked
                title="Engagement tracking"
                note="See which buttons on your profile people actually press."
                tierName="Pro"
                go={() => {}}
              />
            )}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <Locked
            title="Audience and engagement analytics"
            note="Device breakdown, traffic sources and per-link click data."
            tierName="Standard and Pro"
          />
        </div>
      )}
    </>
  );
}

function ConnectionsTab({ connections, setConnections }) {
  const [filter, setFilter] = useState("");
  const sent = read(LS_SENT, []);
  const list = connections.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));

  const sendDetails = (id) => {
    write(LS_SENT, [...new Set([...sent, id])]);
  };

  return (
    <div className="panel">
      <div className="cards4" style={{ margin: "0 0 14px" }}>
        <Stat label="Total connections" value={connections.length} />
        <Stat label="From taps" value={connections.filter((c) => c.via === "Connect button").length} />
        <Stat label="From scans" value={connections.filter((c) => c.via === "AI scan").length} />
        <Stat label="Details sent" value={sent.length} />
      </div>

      <Field label="Search" id="conn-search">
        <input id="conn-search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name" />
      </Field>

      {list.length === 0 ? (
        <Empty title="No one here yet" note="Connections appear when someone uses your Connect button or you scan a card." />
      ) : (
        list.map((c) => (
          <div className="conn" key={c.id}>
            <div className="who">
              <strong>{c.name}</strong>
              <small>{c.title}{c.company ? ` · ${c.company}` : ""} — {c.via}, {c.at}</small>
            </div>
            <button
              disabled={c.sent || sent.includes(c.id)}
              onClick={() => {
                sendDetails(c.id);
                setConnections(connections.map((x) => (x.id === c.id ? { ...x, sent: true } : x)));
              }}
            >
              {c.sent || sent.includes(c.id) ? "Details sent" : "Send my details"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function ScanTab({ tier, onScanned }) {
  const rank = tierById(tier).rank;
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  if (rank < 2) {
    return (
      <Locked
        title="AI business card scanner"
        note="Photograph a paper card and the details land straight in your connections."
        tierName="Standard and Pro"
      />
    );
  }

  const scan = (file) => {
    if (!file) return;
    setStatus("reading");
    setResult(null);
    // Stands in for the server-side OCR call.
    setTimeout(() => {
      const sample = SCAN_SAMPLES[Math.floor(Math.random() * SCAN_SAMPLES.length)];
      setResult({ ...sample, file: file.name });
      setStatus("done");
    }, 1200);
  };

  return (
    <div className="panel narrow">
      <h3>AI business card scanner</h3>
      <p className="muted small">
        Upload a photo of a paper card. Linkodra reads the name, title, company, phone and email for you to review
        before it saves.
      </p>

      <Field label="Card photo" id="scan-file">
        <input id="scan-file" type="file" accept="image/*" onChange={(e) => scan(e.target.files?.[0])} />
      </Field>

      {status === "reading" && (
        <div className="banner">
          <span className="spinner" />
          <span>Reading the card…</span>
        </div>
      )}

      {status === "done" && result && (
        <>
          <div className="panel tight" style={{ marginTop: 12 }}>
            <div className="summary-row"><span>Name</span><strong>{result.name}</strong></div>
            <div className="summary-row"><span>Title</span><strong>{result.title}</strong></div>
            <div className="summary-row"><span>Company</span><strong>{result.company}</strong></div>
            <div className="summary-row"><span>Phone</span><strong>{result.phone}</strong></div>
            <div className="summary-row"><span>Email</span><strong>{result.email}</strong></div>
          </div>
          <div className="btn-row">
            <button className="btn primary" onClick={() => { onScanned(result); setStatus("idle"); setResult(null); }}>
              Save to connections
            </button>
            <button className="btn ghost" onClick={() => setStatus("idle")}>Discard</button>
          </div>
          <p className="small muted">Demo scanner. In production the OCR runs server-side and returns real values.</p>
        </>
      )}
    </div>
  );
}

function ReferTab({ user }) {
  const [balance] = useState(1399);
  const [requested, setRequested] = useState(false);
  const link = `https://${BRAND.url}/r/${user.code ?? "yourcode"}`;
  const converted = Math.round(balance / (TIERS[1].price * REFERRAL_RATE));

  const copy = () => {
    navigator.clipboard?.writeText(link);
  };

  return (
    <div className="cards2">
      <div className="panel">
        <h3>Refer and earn</h3>
        <p className="muted small">
          Every card you refer earns {Math.round(REFERRAL_RATE * 100)}% commission. No minimum, and no cap.
        </p>
        <label>Your referral link</label>
        <code>{link}</code>
        <div className="cards3" style={{ marginBottom: 0 }}>
          <Stat label="Orders referred" value={converted} />
          <Stat label="Commission earned" value={`₱${balance.toLocaleString()}`} />
          <Stat label="Available balance" value={`₱${balance.toLocaleString()}`} />
        </div>
        <button className="btn ghost full" onClick={copy}>Copy link</button>
      </div>

      <div className="panel">
        <h3>Request a payout</h3>
        <p className="muted small">
          {requested
            ? "Payout requested. We send it by GCash or bank transfer within a few business days."
            : "Add your GCash or bank details when you request, and we will transfer what you have earned."}
        </p>
        <button className="btn primary full" disabled={requested} onClick={() => setRequested(true)}>
          {requested ? "Payout requested" : `Request ₱${balance.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

function OrgTab({ user }) {
  const [members, setMembers] = useState(DEMO_MEMBERS);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const remove = (who) => setMembers(members.filter((m) => m.name !== who));
  const add = () => {
    if (!name.trim()) return;
    setMembers([...members, { name: name.trim(), title: "New member", badge: "Member" }]);
    setName("");
    setAdding(false);
  };

  return (
    <div className="dash-grid">
      <div className="panel">
        <h3>Organization members</h3>
        <p className="muted small">
          You are the admin for this organization. Add or remove people, and their profiles unlink immediately.
        </p>
        {members.map((m) => (
          <div className="member-row" key={m.name}>
            <div>
              <strong>{m.name}</strong>
              <br />
              <small className="muted">{m.title} · {m.badge}</small>
            </div>
            {m.badge !== "Owner" && (
              <button className="btn ghost sm" onClick={() => remove(m.name)}>Remove</button>
            )}
          </div>
        ))}

        {adding ? (
          <div className="banner">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" style={{ maxWidth: 220 }} />
            <button className="btn primary sm" onClick={add}>Add</button>
            <button className="btn ghost sm" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn ghost full" onClick={() => setAdding(true)}>Add a member</button>
        )}
      </div>

      <div className="panel">
        <h3>Branding</h3>
        <p className="muted small">
          Your logo and colours are applied to every linked profile and take precedence over individual choices, so
          the team always looks like one brand.
        </p>
        <div className="summary-row"><span>Organization</span><strong>Linkodra PH</strong></div>
        <div className="summary-row"><span>Admin</span><strong>{user.name}</strong></div>
        <div className="summary-row"><span>Plan</span><strong>Organization</strong></div>
        <p className="small muted">
          Day-to-day changes like these are yours to make. Card Manager is our internal tool and is only needed for
          account-level changes such as reassigning an admin.
        </p>
      </div>
    </div>
  );
}

export function Dashboard({ go }) {
  const [user, setUser] = useState(() => read(LS_USER, null));
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(() => read(LS_PROFILE, DEMO_PROFILE));
  const [connections, setConnections] = useState(() => read(LS_CONNECTIONS, DEMO_CONNECTIONS));

  const persistConnections = (next) => {
    setConnections(next);
    write(LS_CONNECTIONS, next);
  };

  const tier = user?.tier ?? "standard";

  if (!user) {
    return (
      <section className="section narrow">
        <div className="panel">
          <h1>Sign in to continue</h1>
          <p className="muted">Your dashboard holds your profile, analytics and connections.</p>
          <div className="btn-row">
            <button className="btn primary" onClick={() => go("login")}>Go to sign in</button>
          </div>
        </div>
      </section>
    );
  }

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "analytics", label: "Analytics" },
    { id: "connections", label: "Connections", badge: connections.length },
    { id: "scan", label: "Scan" },
    { id: "refer", label: "Refer" },
    { id: "org", label: "Organization" },
  ];

  return (
    <section className="section wide">
      <div className="dash-head">
        <div>
          <h1>Hello, {profile.name.split(" ")[0]}</h1>
          <span className="muted small">
            {tierById(tier).name} · {BRAND.url}/{user.code ?? "yourcode"}
          </span>
        </div>
        <div className="btn-row" style={{ margin: 0 }}>
          <button className="btn ghost sm" onClick={() => go("profile")}>View profile</button>
          <button className="btn ghost sm" onClick={() => { remove(LS_USER); setUser(null); go("home"); }}>
            Sign out
          </button>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "sel" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.badge != null && <span className="badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} user={user} go={go} />}
      {tab === "analytics" && <AnalyticsTab tier={tier} />}
      {tab === "connections" && <ConnectionsTab connections={connections} setConnections={persistConnections} />}
      {tab === "scan" && (
        <ScanTab
          tier={tier}
          onScanned={(r) =>
            persistConnections([
              {
                id: `s${Date.now()}`,
                name: r.name,
                title: r.title,
                company: r.company,
                via: "AI scan",
                at: "just now",
                sent: false,
              },
              ...connections,
            ])
          }
        />
      )}
      {tab === "refer" && <ReferTab user={user} />}
      {tab === "org" && <OrgTab user={user} />}
    </section>
  );
}

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
          <button className="btn primary full" onClick={() => go("login")}>
            Sign in to manage your profile
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
            <p className="ok small">Thanks. {p.name.split(" ")[0]} can now see you in their dashboard.</p>
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