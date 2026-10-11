import { useMemo, useState } from "react";
import { TIERS, DESIGNS } from "../brand.js";
import { CardPreview } from "../components/brand.jsx";

const SHIP = 99;
export function Order({ initialTier, go }) {
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState(initialTier || "standard");
  const [orientation, setOrientation] = useState("landscape");
  const [design, setDesign] = useState("minimalist");
  const [finish, setFinish] = useState("glossy");
  const [printName, setPrintName] = useState("John Santos");
  const [printPhone, setPrintPhone] = useState("+63 917 123 4567");
  const [logo, setLogo] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "Batangas City", promo: "", ref: "" });
  const [pay, setPay] = useState("qrph");
  const [fail, setFail] = useState(false);
  const [placed, setPlaced] = useState(null);

  const selected = useMemo(() => TIERS.find((t) => t.id === tier), [tier]);
  const discount = form.promo.trim().toUpperCase() === "LINKODRA10" ? Math.round(selected.price * 0.1) : 0;
  const freeShip = form.promo.trim().toUpperCase() === "FREESHIP";
  const total = selected.price - discount + (freeShip ? 0 : SHIP);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const placeOrder = () => {
    if (fail) { setPlaced({ error: true }); return; }
    const code = Math.random().toString(36).slice(2, 8);
    const order = { id: "LK-" + Date.now().toString().slice(-6), tier, total, code, ...form, printName };
    localStorage.setItem("lk-last-order", JSON.stringify(order));
    localStorage.setItem("lk-user", JSON.stringify({ name: form.name || printName, email: form.email, tier, code }));
    setPlaced(order);
  };

  if (placed && !placed.error) {
    return (
      <section className="section narrow">
        <div className="panel success">
          <h1>Order confirmed</h1>
          <p>Order <b>{placed.id}</b> - {selected.name} - P{placed.total.toLocaleString()} via {pay.toUpperCase()}</p>
          <p>Your profile link: <b>linkodra.ph/{placed.code}</b> (demo). Card ships in 3-5 days + 2-3 print QA.</p>
          <div className="btn-row">
            <button className="btn primary" onClick={() => go("dashboard")}>Open Dashboard</button>
            <button className="btn ghost" onClick={() => go("profile")}>View Demo Profile</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="hero-badge">GET YOUR CARD</div>
      <h1>Order Your Linkodra Card</h1>
      <p className="muted">Choose your tier and customize your card.</p>
      <ol className="wizard">
        {["1 Configure", "2 Your Details", "3 Review"].map((l, i) => (
          <li key={l} className={step === i + 1 ? "active" : ""}><button disabled={i + 1 > step} onClick={() => setStep(i + 1)}>{l}</button></li>
        ))}
      </ol>

      {step === 1 && (
        <div className="order-grid">
          <div>
            <h3>1. Choose Your Tier</h3>
            <div className="tier-pick">
              {TIERS.map((t) => (
                <button key={t.id} className={tier === t.id ? "sel" : ""} onClick={() => setTier(t.id)}>
                  <b>{t.name}</b><span>P{t.price.toLocaleString()}</span><small>{t.desc}</small>
                </button>
              ))}
            </div>
          </div>
          <CardPreview name={printName} phone={printPhone} tier={tier} design={design} orientation={orientation} />
          <div className="panel">
            <h3>Make it yours</h3>
            <label>ORIENTATION</label>
            <div className="seg">{["landscape", "portrait"].map((o) => <button key={o} className={orientation === o ? "sel" : ""} onClick={() => setOrientation(o)}>{o}</button>)}</div>
            <label>DESIGN</label>
            <div className="seg">{DESIGNS.map((d) => <button key={d.id} className={design === d.id ? "sel" : ""} onClick={() => setDesign(d.id)}>{d.name}</button>)}</div>
            <label>FINISH</label>
            <div className="seg">{["matte", "glossy"].map((f) => <button key={f} className={finish === f ? "sel" : ""} onClick={() => setFinish(f)}>{f}</button>)}</div>
            <label>Name to print</label>
            <input value={printName} onChange={(e) => setPrintName(e.target.value)} placeholder="John Santos" />
            <label>Phone to print {tier === "basic" ? "(not printed on Basic)" : ""}</label>
            <input value={printPhone} onChange={(e) => setPrintPhone(e.target.value)} placeholder="+63 ..." />
            {tier === "pro" && (<><label>Logo URL (SVG/PNG)</label><input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." /></>)}
            <button className="btn primary full" onClick={() => setStep(2)}>Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="panel narrow">
          <h3>2. Your Details</h3>
          {[["name", "Full name"], ["email", "Email"], ["phone", "Mobile"], ["address", "Street / Brgy"], ["city", "City"], ["ref", "Referral code (optional)"], ["promo", "Promo code (try LINKODRA10)"]].map(([k, l]) => (
            <div key={k}><label>{l}</label><input value={form[k]} onChange={set(k)} /></div>
          ))}
          <div className="btn-row"><button className="btn ghost" onClick={() => setStep(1)}>Back</button><button className="btn primary" onClick={() => setStep(3)}>Review</button></div>
        </div>
      )}

      {step === 3 && (
        <div className="panel narrow">
          <h3>3. Review and Pay</h3>
          <p>{selected.name} - {orientation} - {design} - {finish}<br />Print: <b>{printName}</b> {tier !== "basic" && <span>- {printPhone}</span>}</p>
          <p>Ship to: {form.name}, {form.address}, {form.city}<br />Contact: {form.email} - {form.phone}</p>
          <label>Payment (PayMongo in production - mock here)</label>
          <div className="seg">{[["qrph", "QRPh"], ["bpi", "BPI Debit"], ["ubp", "UBP Debit"]].map(([id, l]) => <button key={id} className={pay === id ? "sel" : ""} onClick={() => setPay(id)}>{l}</button>)}</div>
          <label className="check"><input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> Simulate payment failure</label>
          {placed?.error && <p className="err">Payment failed. Check funds and retry, or try another method.</p>}
          <div className="totals">
            <div><span>Card</span><span>P{selected.price.toLocaleString()}</span></div>
            {discount > 0 && <div><span>Discount LINKODRA10</span><span>-P{discount}</span></div>}
            <div><span>Shipping</span><span>{freeShip ? "FREE" : "P" + SHIP}</span></div>
            <div className="grand"><span>Total</span><span>P{total.toLocaleString()}</span></div>
          </div>
          <div className="btn-row"><button className="btn ghost" onClick={() => setStep(2)}>Back</button><button className="btn primary" onClick={placeOrder}>Pay P{total.toLocaleString()}</button></div>
        </div>
      )}
    </section>
  );
}
