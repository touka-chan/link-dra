// Site chrome: navigation, footer, assistant widget and cookie notice.
// The nav label list lives here and is also used to mark the active route.

import { useEffect, useState } from "react";
import { BRAND } from "../brand.js";
import { LogoMark, Wordmark } from "./brand.jsx";
import { Icon } from "./icons.jsx";
import { useTheme } from "../theme.js";
import { CHAT_PROMPTS } from "../data/profile.js";

const NAV_ITEMS = [
  { id: "how", label: "How It Works" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "help", label: "Help Center" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const MOBILE_ITEMS = [
  ...NAV_ITEMS,
  { id: "about", label: "About Us" },
  { id: "teams", label: "Teams and Organizations" },
];

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} title={`Switch to ${isDark ? "light" : "dark"} mode`}>
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.2A8.2 8.2 0 019.8 4a8.2 8.2 0 1010.2 10.2z" />
        </svg>
      )}
    </button>
  );
}

export function Navbar({ route, go }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // The bar stays fully transparent at the top of the page so the background
  // gradient runs through it unbroken, and only takes a surface once content
  // is passing underneath.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "nav is-scrolled" : "nav"}>
      <button className="nav-logo" onClick={() => go("home")} aria-label="Linkodra home">
        <span className="nav-mark">
          <LogoMark size={24} />
        </span>
        <Wordmark />
      </button>

      <nav className="nav-links desktop" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={route === item.id ? "active" : ""} onClick={() => go(item.id)} aria-current={route === item.id ? "page" : undefined}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="nav-cta desktop">
        <ThemeToggle />
        <button className="btn primary nav-cta-btn" onClick={() => go("order")}>Get Your Card</button>
      </div>

      <div className="nav-tools">
        <ThemeToggle />
      </div>

      <button className="menu-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div className="mobile-menu">
          {MOBILE_ITEMS.map((item) => (
            <button key={item.id} onClick={() => { go(item.id); setOpen(false); }}>
              {item.label}
            </button>
          ))}
          <button className="btn primary mm-cta" onClick={() => { go("order"); setOpen(false); }}>Get Your Card</button>
        </div>
      )}
    </header>
  );
}

const FOOTER_GROUPS = [
  { title: "Product", links: [["how", "How It Works"], ["pricing", "Pricing"], ["order", "Order Your Card"], ["help", "Help Center"], ["faq", "FAQ"]] },
  { title: "Company", links: [["about", "About Us"], ["contact", "Contact"], ["teams", "Teams and Organizations"], ["soon", "Careers"], ["soon", "Request a Feature"]] },
  {
    title: "Legal",
    links: [["privacy", "Privacy Policy"], ["terms", "Terms of Service"], ["cookies", "Cookie Policy"], ["shipping", "Shipping and Refund"], ["dispute", "Dispute Resolution"]],
  },
];

export function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="foot-grid">
        <div className="foot-brand">
          <div className="foot-lockup">
            <span className="foot-mark"><LogoMark size={24} /></span>
            <Wordmark />
          </div>
          <p className="foot-tag">Tap · Connect · Share</p>
          <p>
            Your professional identity, always up to date. One NFC tap replaces the paper business card: share
            everything about yourself instantly, and change any of it whenever you like.
          </p>
          <div className="pill-row">
            <span><Icon name="bolt" size={13} /> Instant Share</span>
            <span><Icon name="leaf" size={13} /> Paperless</span>
          </div>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <h4>{group.title}</h4>
            {group.links.map(([id, label]) => (
              <button key={`${id}-${label}`} onClick={() => go(id)}>{label}</button>
            ))}
          </div>
        ))}

        <div>
          <h4>Get in touch</h4>
          <p>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            <br />
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>{BRAND.phone}</a>
            <br />
            {BRAND.address}
          </p>
        </div>
      </div>
      <div className="foot-base">
        <span>
          © 2026 <strong>Linkodra PH</strong> — TAP · CONNECT · SHARE. All rights reserved.
        </span>
        <span className="foot-made">
          Made with <Icon name="heart" size={13} /> in Batangas, PH
        </span>
      </div>
    </footer>
  );
}

const ANSWERS = [
  { k: ["order", "buy", "purchase"], a: "Open Get Your Card, pick a tier, personalise the print details, then enter your delivery address and pay. It takes about two minutes, and your profile is ready to edit as soon as payment clears." },
  { k: ["tier", "difference", "basic", "pro"], a: "Basic covers tap-to-open with overview analytics. Standard adds a profile QR, audience analytics and the AI card scanner. Pro adds your logo, an offline vCard QR, engagement tracking and monthly reports." },
  { k: ["referral", "commission", "earn"], a: "Share your personal referral link and you earn a commission on each card ordered through it. Payouts go out by GCash or bank transfer." },
  { k: ["tap", "nfc", "not working", "isn't tapping"], a: "Check NFC is switched on, take off any metal case, and hold the card flat against the top back of the phone for two full seconds. If it still will not fire, scan the QR code instead and tell us so we can check the chip." },
  { k: ["shipping", "delivery", "arrive"], a: "Metro Manila is two to four business days, Luzon three to five, Visayas four to six, Mindanao five to seven. Standard and Pro cards add two to three days for production." },
];

export function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi, I am the Linkodra Assistant. Ask me about ordering, tiers, referrals or a card that will not tap." },
  ]);
  const [value, setValue] = useState("");

  const send = (preset) => {
    const text = (preset ?? value).trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "you", text }]);
    setValue("");
    const lower = text.toLowerCase();
    const hit = ANSWERS.find((a) => a.k.some((k) => lower.includes(k)));
    const reply = hit
      ? hit.a
      : "I can help with ordering, tiers, referrals, shipping and tap problems. Try one of the quick questions above, or the Help Center has a full answer.";
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: reply }]), 400);
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with the Linkodra Assistant"}
      >
        <Icon name={open ? "close" : "chat"} size={22} />
      </button>

      {open && (
        <div className="chat-box" role="dialog" aria-label="Linkodra Assistant">
          <div className="chat-head">
            <span className="chat-avatar"><Icon name="bot" size={20} /></span>
            <span className="chat-id">
              <strong>Linkodra Assistant</strong>
              <small><i /> Usually replies instantly</small>
            </span>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <Icon name="close" size={15} />
            </button>
          </div>

          <div className="chat-msgs">
            {msgs.map((m, i) => (
              <div className={`chat-line ${m.from}`} key={i}>
                {m.from === "bot" && <span className="chat-avatar sm"><Icon name="bot" size={15} /></span>}
                <div className={`msg ${m.from}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-quick">
            {CHAT_PROMPTS.map((q) => (
              <button key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about Linkodra..."
              aria-label="Message"
            />
            <button onClick={() => send()} aria-label="Send message" disabled={!value.trim()}>
              <Icon name="arrowUp" size={17} />
            </button>
          </div>
          <small className="chat-note">Powered by Linkodra AI. Replies are generated in this browser and may be inaccurate.</small>
        </div>
      )}
    </>
  );
}

export function Cookies() {
  const [show, setShow] = useState(() => !localStorage.getItem("lk-cookies"));
  if (!show) return null;

  const close = (choice) => {
    localStorage.setItem("lk-cookies", choice);
    setShow(false);
  };

  return (
    <div className="cookies">
      <span>
        We use essential cookies to keep you signed in and your session secure. No advertising or tracking.{" "}
        <a href="#/legal/cookies" style={{ color: "var(--green)" }}>Learn more</a>
      </span>
      <span>
        <button onClick={() => close("0")}>Decline</button>
        <button className="btn primary sm" onClick={() => close("1")}>Got it</button>
      </span>
    </div>
  );
}