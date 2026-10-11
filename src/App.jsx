import { useCallback, useEffect, useState } from "react";
import { Navbar, Footer, Chat, Cookies } from "./components/Layout.jsx";
import { Home, HowItWorks, Features, Pricing } from "./pages/marketing.jsx";
import { Order } from "./pages/Order.jsx";
import { Login, Forgot, Dashboard, PublicProfile, ComingSoon } from "./pages/app.jsx";
import { HelpCenter, Faq, Contact, About, Teams, Legal } from "./pages/support.jsx";
import "./index.css";

const NAV_MAP = {
  home: "/",
  how: "/how-it-works",
  features: "/features",
  pricing: "/pricing",
  order: "/order",
  login: "/login",
  forgot: "/forgot-password",
  dashboard: "/dashboard",
  profile: "/c/john",
  help: "/help-center",
  faq: "/faq",
  contact: "/contact",
  about: "/about",
  teams: "/teams",
  soon: "/coming-soon",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  shipping: "/legal/shipping",
  dispute: "/legal/dispute",
};

const LEGAL_DOCS = new Set(["privacy", "terms", "cookies", "shipping", "dispute"]);

function parseHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [path, query] = raw.split("?");
  return { path, tier: new URLSearchParams(query || "").get("tier") };
}

export default function App() {
  const [hash, setHash] = useState(parseHash);

  useEffect(() => {
    const onChange = () => {
      setHash(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const go = useCallback((id, tier) => {
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
  const ROUTES = [
    ["/how", "how", () => <HowItWorks go={go} />],
    ["/feat", "features", () => <Features go={go} />],
    ["/pric", "pricing", () => <Pricing go={go} />],
    ["/order", "order", () => <Order initialTier={tier} go={go} />],
    ["/login", "login", () => <Login go={go} />],
    ["/forgot", "login", () => <Forgot go={go} />],
    ["/dashboard", "dashboard", () => <Dashboard go={go} />],
    ["/c/", "profile", () => <PublicProfile code={path.slice(3)} go={go} />],
    ["/help", "help", () => <HelpCenter go={go} />],
    ["/faq", "faq", () => <Faq />],
    ["/contact", "contact", () => <Contact />],
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