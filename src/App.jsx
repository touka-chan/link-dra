import { useCallback, useEffect, useState } from "react";
import { Navbar, Footer, Chat, Cookies } from "./components/Layout.jsx";
import { Home } from "./pages/marketing.jsx";
import { Order } from "./pages/Order.jsx";
import { Dashboard, PublicProfile, ComingSoon } from "./pages/app.jsx";
import { About, Teams, Legal } from "./pages/support.jsx";
import "./index.css";

const NAV_MAP = {
  home: "/",
  order: "/order",
  dashboard: "/dashboard",
  profile: "/c/john",
  about: "/about",
  teams: "/teams",
  soon: "/coming-soon",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  shipping: "/legal/shipping",
  dispute: "/legal/dispute",
};

// Nav items do not open pages. They scroll to blocks on the single landing
// page, wherever the visitor currently is.
const SECTIONS = new Set(["how", "features", "pricing", "help", "faq", "contact"]);

const LEGAL_DOCS = new Set(["privacy", "terms", "cookies", "shipping", "dispute"]);

function parseHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [path, query] = raw.split("?");
  return { path, tier: new URLSearchParams(query || "").get("tier") };
}

function scrollToSection(id, smooth = true) {
  document
    .getElementById(`section-${id}`)
    ?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

export default function App() {
  const [hash, setHash] = useState(parseHash);
  const [pendingSection, setPendingSection] = useState(null);

  useEffect(() => {
    const onChange = () => {
      setHash(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  // A section requested from another route waits until the landing page has
  // rendered, then glides to it.
  useEffect(() => {
    if (!pendingSection) return;
    const t = setTimeout(() => {
      scrollToSection(pendingSection);
      setPendingSection(null);
    }, 80);
    return () => clearTimeout(t);
  }, [pendingSection, hash]);

  const go = useCallback((id, tier) => {
    if (SECTIONS.has(id)) {
      if (parseHash().path === "/") {
        scrollToSection(id);
      } else {
        setPendingSection(id);
        window.location.hash = "/";
      }
      return;
    }
    const target = NAV_MAP[id] ?? "/";
    const next = id === "order" && tier ? `${target}?tier=${tier}` : target;
    if (window.location.hash === `#${next}`) {
      // Same hash: the hashchange event will not fire, so update directly.
      setHash(parseHash());
      window.scrollTo(0, 0);
      return;
    }
    window.location.hash = next;
  }, []);

  const { path, tier } = hash;
  const legalDoc = path.startsWith("/legal/") ? path.split("/")[2] : null;

  // A table rather than a chain of branches. Each entry matches a path prefix and
  // returns the nav key plus a render function; only the first match is invoked.
  // Old section URLs land on the matching block of the one-page landing.
  const ROUTES = [
    ["/how", "how", () => <Home go={go} section="how" />],
    ["/feat", "features", () => <Home go={go} section="features" />],
    ["/pric", "pricing", () => <Home go={go} section="pricing" />],
    ["/order", "order", () => <Order initialTier={tier} go={go} />],
    ["/dashboard", "dashboard", () => <Dashboard go={go} />],
    ["/c/", "profile", () => <PublicProfile code={path.slice(3)} go={go} />],
    ["/help", "help", () => <Home go={go} section="help" />],
    ["/faq", "faq", () => <Home go={go} section="faq" />],
    ["/contact", "contact", () => <Home go={go} section="contact" />],
    ["/about", "about", () => <About go={go} />],
    ["/teams", "teams", () => <Teams go={go} />],
    ["/coming-soon", "soon", () => <ComingSoon go={go} />],
    [
      "/legal/",
      "legal",
      () => (LEGAL_DOCS.has(legalDoc) ? <Legal doc={legalDoc} /> : <ComingSoon go={go} />),
    ],
  ];

  const hit = ROUTES.find(([prefix]) => path.startsWith(prefix));
  const route = hit ? hit[1] : "home";
  const el = hit ? hit[2]() : <Home go={go} />;

  return (
    <div className="app">
      <Navbar route={route} go={go} />
      <main>{el}</main>
      <Footer go={go} />
      <Chat />
      <Cookies />
    </div>
  );
}
