import { useCallback, useEffect, useState } from "react";
import { Navbar, Footer, Chat, Cookies } from "./components/Layout.jsx";
import { Home, HowItWorks, Features, Pricing } from "./pages/marketing.jsx";
import { Order } from "./pages/Order.jsx";
import { Login, Forgot, Dashboard, PublicProfile } from "./pages/app.jsx";
import { HelpCenter, Faq, Contact, About, Teams, Legal } from "./pages/support.jsx";
import "./index.css";

function parseHash() {
  const h = window.location.hash.replace(/^#/, "") || "/";
  const [path, query] = h.split("?");
  const params = new URLSearchParams(query || "");
  return { path, tier: params.get("tier") };
}

export default function App() {
  const [hash, setHash] = useState(parseHash());
  useEffect(() => {
    const fn = () => { setHash(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  const go = useCallback((id, tier) => {
    const map = { home: "/", how: "/how-it-works", features: "/features", pricing: "/pricing", order: "/order", login: "/login", forgot: "/forgot", dashboard: "/dashboard", profile: "/c/john", help: "/help-center", faq: "/faq", contact: "/contact", about: "/about", teams: "/teams", privacy: "/legal/privacy", terms: "/legal/terms", cookies: "/legal/cookies", shipping: "/legal/shipping", dispute: "/legal/dispute" };
    let p = map[id] || "/";
    if (id === "order" && tier) p += `?tier=${tier}`;
    window.location.hash = p;
    if (window.location.hash === p) setHash(parseHash());
  }, []);

  const { path, tier } = hash;
  let route = "home", el = <Home go={go} />;
  if (path.startsWith("/how")) { route = "how"; el = <HowItWorks go={go} />; }
  else if (path.startsWith("/feat")) { route = "features"; el = <Features go={go} />; }
  else if (path.startsWith("/pric")) { route = "pricing"; el = <Pricing go={go} />; }
  else if (path.startsWith("/order")) { route = "order"; el = <Order initialTier={tier || "standard"} go={go} />; }
  else if (path.startsWith("/login")) { route = "login"; el = <Login go={go} />; }
  else if (path.startsWith("/forgot")) { route = "login"; el = <Forgot go={go} />; }
  else if (path.startsWith("/dashboard")) { route = "dashboard"; el = <Dashboard go={go} />; }
  else if (path.startsWith("/c/")) { route = "profile"; el = <PublicProfile go={go} />; }
  else if (path.startsWith("/help")) { route = "help"; el = <HelpCenter />; }
  else if (path.startsWith("/faq")) { route = "faq"; el = <Faq />; }
  else if (path.startsWith("/contact")) { route = "contact"; el = <Contact />; }
  else if (path.startsWith("/about")) { route = "about"; el = <About go={go} />; }
  else if (path.startsWith("/teams")) { route = "teams"; el = <Teams go={go} />; }
  else if (path.startsWith("/legal/")) { route = "legal"; el = <Legal doc={path.split("/")[2]} />; }

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
