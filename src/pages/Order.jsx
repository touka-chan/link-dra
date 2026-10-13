// Three-step order wizard: configure the card, collect details and the delivery
// address, then review and pay.
//
// Everything here is front-end only. placeOrder() is the single seam where a real
// PayMongo checkout session would be created.

import { useEffect, useState } from "react";
import { BRAND, DESIGNS, REFERRAL_RATE, applyPromo, shippingFor, tierById } from "../brand.js";
import { CardPreview } from "../components/brand.jsx";
import { PayModal } from "../components/PayModal.jsx";
import { Field, Segmented, Wizard } from "../components/ui.jsx";
import { write } from "../store.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AddressFields({ value, onChange, geo, error }) {
  const province = geo.find((p) => p.p === value.province);
  const city = province?.c.find((c) => c.n === value.city);

  // Changing a parent clears its children so the form never holds a stale value.
  const setProvince = (name) => onChange({ province: name, city: "", barangay: "" });
  const setCity = (name) => onChange({ ...value, city: name, barangay: "" });

  return (
    <>
      <div className="field-row">
        <Field label="Street address" id="street" error={error.street}>
          <input id="street" value={value.street} onChange={(e) => onChange({ ...value, street: e.target.value })} placeholder="House number, street" />
        </Field>
        <Field label="ZIP code" id="zip">
          <input id="zip" value={value.zip} onChange={(e) => onChange({ ...value, zip: e.target.value })} placeholder="4200" inputMode="numeric" />
        </Field>
      </div>

      <Field label="Province" id="province" error={error.province}>
        <select id="province" value={value.province} onChange={(e) => setProvince(e.target.value)} disabled={!geo.length}>
          <option value="">{geo.length ? "Select province" : "Loading provinces..."}</option>
          {geo.map((p) => (
            <option key={p.p} value={p.p}>{p.p}</option>
          ))}
        </select>
      </Field>

      <div className="field-row">
        <Field label="City / Municipality" id="city" error={error.city}>
          <select id="city" value={value.city} onChange={(e) => setCity(e.target.value)} disabled={!province}>
            <option value="">{province ? "Select city or municipality" : "Select a province first"}</option>
            {province?.c.map((c) => (
              <option key={c.n} value={c.n}>{c.n}{c.t ? "" : " (Mun.)"}</option>
            ))}
          </select>
        </Field>
        <Field label="Barangay" id="barangay" error={error.barangay}>
          <select id="barangay" value={value.barangay} onChange={(e) => onChange({ ...value, barangay: e.target.value })} disabled={!city}>
            <option value="">{city ? "Select barangay" : "Select a city first"}</option>
            {city?.b.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Delivery notes" id="notes" hint="Optional. Handy for landmarks or drop-off instructions.">
        <input id="notes" value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} placeholder="Leave with the front desk" />
      </Field>
    </>
  );
}

export function Order({ initialTier, go }) {
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState(initialTier || "standard");

  const [orientation, setOrientation] = useState("portrait");
  const [design, setDesign] = useState("gradient");
  const [finish, setFinish] = useState("glossy");
  const [printName, setPrintName] = useState("");
  const [logoName, setLogoName] = useState("");

  const [contact, setContact] = useState({ fullName: "", email: "", phone: "" });
  const [address, setAddress] = useState({ street: "", province: "", city: "", barangay: "", zip: "", notes: "" });
  const [errors, setErrors] = useState({});

  const [promo, setPromo] = useState("");
  const [order, setOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  // Manual QR payment: the Continue button shows a spinner, then the modal
  // below collects the receipt. Proof survives steps 2 and 3 with the order.
  const [preparing, setPreparing] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [proof, setProof] = useState(null);

  // The PSGC dataset is ~540 KB, so it is only pulled in once the buyer reaches
  // step 2. Vite splits it into its own chunk.
  const [geo, setGeo] = useState([]);
  useEffect(() => {
    if (step < 2 || geo.length) return;
    let live = true;
    import("../data/geo.js")
      .then((m) => live && setGeo(m.PH_GEO))
      .catch(() => live && setGeo([]));
    return () => {
      live = false;
    };
  }, [step, geo.length]);

  const selected = tierById(tier);
  const showLogo = tier === "pro";

  // Shipping follows the island group of the chosen province.
  const provinceEntry = geo.find((p) => p.p === address.province);
  const zone = address.province ? shippingFor(address.province, provinceEntry?.i) : null;

  const { discount, freeShipping, promo: appliedPromo } = applyPromo(promo, selected.price);
  const shippingFee = zone ? (freeShipping ? 0 : zone.fee) : 0;
  const total = selected.price - discount + shippingFee;

  const validateDetails = () => {
    const next = {};
    if (!contact.fullName.trim()) next.fullName = "We need a name for the delivery.";
    if (!EMAIL_RE.test(contact.email)) next.email = "Enter a valid email address.";
    if (contact.phone.replace(/\D/g, "").length < 7) next.phone = "Enter a contact number we can reach you on.";
    if (!address.street.trim()) next.street = "Enter your street address.";
    if (!address.province) next.province = "Choose a province so we can work out shipping.";
    if (!address.city) next.city = "Choose a city or municipality.";
    if (!address.barangay) next.barangay = "Choose a barangay.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToDetails = () => {
    const next = {};
    if (!printName.trim()) next.printName = "Enter the name to print on the card.";
    if (!EMAIL_RE.test(contact.email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // Brief spinner, then the manual QR payment modal.
    setPreparing(true);
    setTimeout(() => {
      setPreparing(false);
      setPayOpen(true);
    }, 900);
  };

  // A different tier means a different amount due, so a previous receipt
  // cannot carry over.
  const pickTier = (id) => {
    setTier(id);
    setProof(null);
  };

  const goToReview = () => {
    if (!validateDetails()) return;
    setStep(3);
  };

  const placeOrder = () => {
    setPaying(true);
    // Payment was already verified from the uploaded receipt. This only
    // records the order with its proof attached.
    setTimeout(() => {
      setPaying(false);
      const code = Math.random().toString(36).slice(2, 8);
      const placed = {
        id: `LK-${Date.now().toString().slice(-6)}`,
        code,
        tier: tier,
        total,
        paid: proof?.amount ?? 0,
        payment: proof
          ? { method: "Manual QR", refNo: proof.refNo, fileName: proof.fileName }
          : { method: "Manual QR", refNo: "", fileName: "" },
        customer: { ...contact, ...address },
        card: { orientation, design, finish, printName, logoName },
      };
      write("order", placed);
      write("user", { name: contact.fullName || printName, email: contact.email, tier, code });
      setOrder(placed);
    }, 900);
  };

  if (order) {
    return (
      <section className="section narrow">
        <div className="panel success">
          <div className="hero-badge">Order confirmed</div>
          <h1>Your card is in production</h1>
          <p className="muted">
            We have sent a confirmation to <strong>{order.customer.email}</strong>. Your profile is live now, so you
            can start filling it in while we print.
          </p>

          <div className="panel tight" style={{ margin: "16px 0" }}>
            <div className="summary-row"><span>Order</span><strong>{order.id}</strong></div>
            <div className="summary-row"><span>Tier</span><strong>{tierById(order.tier).name}</strong></div>
            <div className="summary-row"><span>Payment</span><strong>Manual QR</strong></div>
            {order.payment.refNo && (
              <div className="summary-row"><span>Reference no.</span><strong>{order.payment.refNo}</strong></div>
            )}
            <div className="summary-row"><span>Total paid</span><strong>₱{order.total.toLocaleString()}</strong></div>
            <div className="summary-row">
              <span>Your profile</span>
              <strong className="green">{BRAND.url}/{order.code}</strong>
            </div>
          </div>

          <p className="muted small">
            Delivery to {order.customer.street}, {order.customer.barangay}, {order.customer.city},{" "}
            {order.customer.province}. Estimate: {zone?.days ?? "3-5 business days"}, plus 2-3 days for printing and
            quality checks.
          </p>

          <div className="btn-row">
            <button className="btn primary" onClick={() => go("dashboard")}>Open dashboard</button>
            <button className="btn ghost" onClick={() => go("profile")}>View a sample profile</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="hero-badge">Get your card</div>
      <h1>Order your Linkodra card</h1>
      <p className="lede">Three quick steps. Your profile goes live as soon as payment clears.</p>

      <Wizard step={step} steps={["Configure", "Your Details", "Review"]} onJump={(n) => n < step && setStep(n)} />

      {step === 1 && (
        <div className="order-grid">
          <div>
            <h3>1. Choose your tier</h3>
            <div className="tier-pick">
              {["basic", "standard", "pro"].map((id) => {
                const t = tierById(id);
                return (
                  <button key={id} className={tier === id ? "sel" : ""} onClick={() => pickTier(id)}>
                    {t.popular && <span className="flag">MOST POPULAR</span>}
                    <b>{t.name}</b>
                    <span>₱{t.price.toLocaleString()}</span>
                    <small>{t.pitch}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <CardPreview
            name={printName}
            tier={tier}
            design={design}
            orientation={orientation}
            finish={finish}
            code="yourcode"
          />

          <div className="panel">
            <h3>Make it yours</h3>

            <label>Orientation</label>
            <Segmented
              value={orientation}
              onChange={setOrientation}
              options={[{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }]}
            />

            <label>Design</label>
            <div className="design-pick">
              {DESIGNS.map((d) => (
                <button key={d.id} className={design === d.id ? "sel" : ""} onClick={() => setDesign(d.id)}>
                  <span
                    className={`design-swatch swatch-${d.id}`}
                    style={{ background: d.id === "gradient" ? d.bg : undefined }}
                  >
                    LK
                  </span>
                  {d.name.replace("Linkodra ", "")}
                </button>
              ))}
            </div>

            <label>Finish</label>
            <Segmented
              value={finish}
              onChange={setFinish}
              options={[{ value: "matte", label: "Matte" }, { value: "glossy", label: "Glossy" }]}
            />

            <Field label="Name to print" id="printName" error={errors.printName}>
              <input id="printName" value={printName} onChange={(e) => setPrintName(e.target.value)} placeholder="Juan Dela Cruz" autoComplete="name" />
            </Field>

            <Field label="Email" id="step1Email" error={errors.email} hint="Order updates and your profile invite go here.">
              <input id="step1Email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@company.ph" autoComplete="email" />
            </Field>

            {showLogo && (
              <Field label="Company logo" id="logo" hint="Pro only. SVG or high-resolution PNG.">
                <input id="logo" type="file" accept="image/svg+xml,image/png" onChange={(e) => setLogoName(e.target.files?.[0]?.name ?? "")} />
              </Field>
            )}

            <button className="btn primary full" onClick={goToDetails} disabled={preparing}>
              {preparing ? <><span className="spinner" /> Preparing payment</> : "Continue"}
            </button>
          </div>
        </div>
      )}

      {payOpen && (
        <PayModal
          tierName={selected.name}
          due={selected.price}
          onClose={() => setPayOpen(false)}
          onConfirm={(p) => {
            setProof(p);
            setPayOpen(false);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <div className="panel narrow">
          <h3>2. Your details</h3>

          <div className="field-row">
            <Field label="Full name" id="fullName" error={errors.fullName}>
              <input id="fullName" value={contact.fullName} onChange={(e) => setContact({ ...contact, fullName: e.target.value })} placeholder="Juan Dela Cruz" />
            </Field>
            <Field label="Email" id="email" error={errors.email}>
              <input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@company.ph" />
            </Field>
          </div>
          <Field label="Mobile number" id="cphone" error={errors.phone} hint="We use this if the courier cannot reach you.">
            <input id="cphone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+63 917 000 0000" />
          </Field>

          <h3 style={{ marginTop: 24 }}>Delivery address</h3>
          {!geo.length ? (
            <div className="skeleton" style={{ margin: "12px 0" }}>Loading Philippine addresses</div>
          ) : (
            <AddressFields value={address} onChange={(v) => { setAddress(v); setErrors({}); }} geo={geo} error={errors} />
          )}

          <div className="btn-row">
            <button className="btn ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn primary" onClick={goToReview} disabled={!geo.length}>Review order</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="panel narrow">
          <h3>3. Review and pay</h3>

          <div className="summary-row"><span>Tier</span><strong>{selected.name} — ₱{selected.price.toLocaleString()}</strong></div>
          <div className="summary-row">
            <span>Card</span>
            <strong>
              {orientation} · {DESIGNS.find((d) => d.id === design)?.name} · {finish}
            </strong>
          </div>
          <div className="summary-row">
            <span>Print</span>
            <strong>
              {printName}
            </strong>
          </div>
          <div className="summary-row">
            <span>Deliver to</span>
            <strong style={{ textAlign: "right" }}>
              {address.street}, {address.barangay}<br />
              {address.city}, {address.province}
            </strong>
          </div>
          <div className="summary-row"><span>Contact</span><strong>{contact.email}</strong></div>

          <Field label="Promo code" id="promo" hint={appliedPromo ? `Applied: ${appliedPromo.label}` : "Try LINKODRA10 or FREESHIP."}>
            <input id="promo" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" />
          </Field>

          <label>Payment</label>
          {proof ? (
            <div className="panel tight pm-proof">
              <div className="summary-row"><span>Method</span><strong>Manual QR</strong></div>
              <div className="summary-row"><span>Reference no.</span><strong>{proof.refNo}</strong></div>
              <div className="summary-row"><span>Amount on receipt</span><strong>₱{proof.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></div>
              <div className="summary-row"><span>Receipt</span><strong>{proof.fileName}</strong></div>
              {proof.dataUrl && (
                <img className="pm-thumb sm" src={proof.dataUrl} alt="Uploaded payment receipt" />
              )}
            </div>
          ) : (
            <p className="field-note">No receipt attached yet. Go back to Configure and press Continue to pay.</p>
          )}

          <div className="totals">
            <div><span>Card</span><span>₱{selected.price.toLocaleString()}</span></div>
            {discount > 0 && <div><span>Discount</span><span>-₱{discount.toLocaleString()}</span></div>}
            <div>
              <span>Shipping{zone ? ` (${zone.zone})` : ""}</span>
              <span>{shippingFee === 0 && address.province ? "Free" : `₱${shippingFee.toLocaleString()}`}</span>
            </div>
            <div className="grand"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
            <div><span>Paid via QR</span><span>₱{(proof?.amount ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            {proof && total - proof.amount > 0.005 && (
              <div><span>Balance (shipping)</span><span>₱{(total - proof.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            )}
          </div>
          {!address.province && <p className="field-note">Shipping is worked out from your delivery province.</p>}
          {proof && total - proof.amount > 0.005 && (
            <p className="field-note">
              Your receipt covers the card. The shipping balance is settled on delivery arrangement — message us after
              checkout and we will confirm it.
            </p>
          )}

          <div className="btn-row">
            <button className="btn ghost" onClick={() => setStep(2)}>Back</button>
            <button className="btn primary big" onClick={placeOrder} disabled={paying || !proof}>
              {paying ? <><span className="spinner" /> Processing</> : "Place order"}
            </button>
          </div>
          <p className="small muted center">
            Manual QR payment. Your receipt is attached to this order for verification.
          </p>
        </div>
      )}

      <p className="small muted center" style={{ marginTop: 20 }}>
        Referral code from a friend? Mention it after checkout and we will attach it — commissions are{" "}
        {Math.round(REFERRAL_RATE * 100)}% of the card price.
      </p>
    </section>
  );
}