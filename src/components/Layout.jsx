import { useState } from "react";
import { BRAND } from "../brand.js";
import { Logo } from "./brand.jsx";

export const ROUTES = [
  { id: "home", label: "Home", path: "#/" },
  { id: "how", label: "How It Works", path: "#/how-it-works" },
  { id: "features", label: "Features", path: "#/features" },
  { id: "pricing", label: "Pricing", path: "#/pricing" },
  { id: "help", label: "Help Center", path: "#/help-center" },
  { id: "faq", label: "FAQ", path: "#/faq" },
  { id: "contact", label: "Contact", path: "#/contact" },
];

export function Navbar({ route, go }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <button className="nav-logo" onClick={() => go("home")} aria-label="Linkodra home">
        <Logo />
      </button>
      <nav className="nav-links desktop">
        {ROUTES.slice(1, 6).map((r) => (
          <button key={r.id} className={route === r.id ? "active" : ""} onClick={() => go(r.id)}>{r.label}</button>
        ))}
      </nav>
      <div className="nav-cta desktop">
        <button className="btn ghost" onClick={() => go("login")}>Login</button>
        <button className="btn primary" onClick={() => go("order")}>Get Your Card</button>
      </div>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="menu">Menu</button>
      {open && (
        <div className="mobile-menu">
          {[...ROUTES, { id: "login", label: "Login" }, { id: "order", label: "Get Your Card" }, { id: "dashboard", label: "Dashboard (demo)" }].map((r) => (
            <button key={r.id} onClick={() => { go(r.id); setOpen(false); }}>{r.label}</button>
          ))}
        </div>
      )}
    </header>
  );
}

export function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="foot-grid">
        <div>
          <Logo />
          <p>Your professional identity, always up to date. One NFC tap replaces the paper business card.</p>
          <div className="pill-row"><span>Instant Share</span><span>Paperless</span></div>
        </div>
        <div>
          <h4>PRODUCT</h4>
          {["how|How It Works", "pricing|Pricing", "order|Order Your Card", "help|Help Center", "faq|FAQ"].map((s) => {
            const [id, l] = s.split("|");
            return <button key={id} onClick={() => go(id)}>{l}</button>;
          })}
        </div>
        <div>
          <h4>COMPANY</h4>
          {[["about", "About Us"], ["contact", "Contact"], ["teams", "Teams and Organizations"], ["profile", "Demo Profile"]].map(([id, l]) => (
            <button key={id} onClick={() => go(id)}>{l}</button>
          ))}
        </div>
        <div>
          <h4>LEGAL</h4>
          {[["privacy", "Privacy Policy"], ["terms", "Terms of Service"], ["cookies", "Cookie Policy"], ["shipping", "Shipping and Refund"]].map(([id, l]) => (
            <button key={id} onClick={() => go(id)}>{l}</button>
          ))}
        </div>
        <div>
          <h4>GET IN TOUCH</h4>
          <p>Email: {BRAND.email}<br />Phone: {BRAND.phone}<br />Address: {BRAND.address}</p>
        </div>
      </div>
      <div className="foot-base">© 2026 <strong>Linkodra PH</strong> - TAP - CONNECT - SHARE - Made in Batangas, PH</div>
    </footer>
  );
}

const ANSWERS = [
  { k: "order", a: "Go to Order: 1 Configure tier/design, 2 Your Details, 3 Review and Pay. Demo checkout, no real charge. Try code LINKODRA10." },
  { k: "tier", a: "Basic P699 (name, tap only), Standard P1399 (name+phone, QR, audience analytics, AI scanner), Pro P1999 (logo, dual QR, full analytics, offline vCard)." },
  { k: "referral", a: "Dashboard to Refer and Earn, share your link, earn commission per order. Payout via GCash/bank in production." },
  { k: "tap", a: "Enable NFC, remove metal case, hold card to upper-back of phone 1-2s. If no NFC, scan QR. Still dead? Contact us." },
];

export function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Hi! I am Linkodra Assistant. Ask about ordering, tiers, referrals or tapping." }]);
  const [val, setVal] = useState("");
  const send = (t) => {
    const text = (t ?? val).trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "you", text }]);
    setVal("");
    const low = text.toLowerCase();
    const hit = ANSWERS.find((x) => low.includes(x.k)) || (low.includes("difference") ? ANSWERS[1] : low.includes("commission") || low.includes("earn") ? ANSWERS[2] : null);
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: hit ? hit.a : "For that, see Help Center, or try: How do I order? / tiers / referral / tapping." }]), 400);
  };
  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="chat">Chat</button>
      {open && (
        <div className="chat-box">
          <div className="chat-head"><strong>Linkodra Assistant</strong><span>Usually replies instantly</span><button onClick={() => setOpen(false)}>Close</button></div>
          <div className="chat-msgs">{msgs.map((m, i) => <div key={i} className={`msg ${m.from}`}>{m.text}</div>)}</div>
          <div className="chat-quick">
            {["How do I order?", "What's the tier difference?", "How does referral work?", "My card isn't tapping!"].map((q) => (
              <button key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>
          <div className="chat-input">
            <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about Linkodra..." />
            <button onClick={() => send()}>Send</button>
          </div>
          <small>Powered by Linkodra - Demo frontend</small>
        </div>
      )}
    </>
  );
}

export function Cookies() {
  const [show, setShow] = useState(() => !localStorage.getItem("lk-cookies"));
  if (!show) return null;
  return (
    <div className="cookies">
      <span>We use essential cookies only. No ads/tracking.</span>
      <span><button onClick={() => { localStorage.setItem("lk-cookies", "0"); setShow(false); }}>Decline</button><button className="btn primary sm" onClick={() => { localStorage.setItem("lk-cookies", "1"); setShow(false); }}>Got it</button></span>
    </div>
  );
}
