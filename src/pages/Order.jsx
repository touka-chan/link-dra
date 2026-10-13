// Order flow: configure the card, pay the QR, confirm.
//
// One step, then payment, then done. There is no separate details or review
// step - the address is collected on the confirmation screen after payment,
// which keeps the pre-payment form short and matches what was actually paid
// (the tier price; shipping is settled separately).
//
// Everything here is front-end only. placeOrder() and saveDelivery() are the
// two seams where a real backend records the order.

import { useEffect, useState } from "react";
import {
  BRAND,
  DEFAULT_DESIGN,
  DEFAULT_ORIENTATION,
  PROFILE_LINK_FIELDS,
  REFERRAL_RATE,
  emptyProfileLinks,
  normaliseProfileLink,
  tierById,
} from "../brand.js";
import { CardPreview } from "../components/brand.jsx";
import { PayModal } from "../components/PayModal.jsx";
import { Field, Segmented } from "../components/ui.jsx";
import { notifyOwner } from "../mail.js";
import { write } from "../store.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AddressFields({ value, onChange, geo, error }) {
  const province = geo.find((p) => p.p === value.province);
  const city = province?.c.find((c) => c.n === value.city);

  // Changing a parent clears its children so the form never holds a stale
  // value. Both must spread `value`: dropping it silently discards street,
  // zip and notes, which then read as undefined further down.
  const setProvince = (name) => onChange({ ...value, province: name, city: "", barangay: "" });
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
  // tierById resolves an unknown id to Standard, so a stale ?tier=pro link from
// before the Pro tier was retired cannot put the page into a removed tier.
const [tier, setTier] = useState(tierById(initialTier).id);

  // No orientation or design picker: the client offers one card face, landscape
  // only, so these are fixed rather than chosen.
  const [orientation] = useState(DEFAULT_ORIENTATION);
  const [design] = useState(DEFAULT_DESIGN);
  const [finish, setFinish] = useState("glossy");
  const [printName, setPrintName] = useState("");

  const [contact, setContact] = useState({ fullName: "", email: "", phone: "" });
  const [address, setAddress] = useState({ street: "", province: "", city: "", barangay: "", zip: "", notes: "" });
  // The buyer's own landing page links. Collected after delivery details and
  // entirely optional, so it opens as an empty set and stays empty on skip.
  const [profileLinks, setProfileLinks] = useState(emptyProfileLinks());
  const [errors, setErrors] = useState({});

  const [order, setOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  // Manual QR payment: Continue shows a spinner, then the modal collects the
  // receipt. Confirming inside the modal places the order straight away.
  const [preparing, setPreparing] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  // The PSGC dataset is ~540 KB, so it is only pulled in once an order exists
  // and the delivery form is on screen. Vite splits it into its own chunk.
  const [geo, setGeo] = useState([]);
  useEffect(() => {
    if (!order || order.deliverySaved || geo.length) return;
    let live = true;
    import("../data/geo.js")
      .then((m) => live && setGeo(m.PH_GEO))
      .catch(() => live && setGeo([]));
    return () => {
      live = false;
    };
  }, [order, geo.length]);

  const selected = tierById(tier);

  const startPayment = () => {
    const next = {};
    const name = printName || "";
    const mail = contact.email || "";
    const tel = contact.phone || "";
    if (!name.trim()) next.printName = "Enter the name to print on the card.";
    if (!EMAIL_RE.test(mail.trim())) next.email = "Enter a valid email address.";
    if (tel.replace(/\D/g, "").length < 7) next.phone = "Enter a mobile number we can reach you on.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // Brief spinner, then the manual QR payment modal.
    setPreparing(true);
    setTimeout(() => {
      setPreparing(false);
      setPayOpen(true);
    }, 900);
  };

  const placeOrder = (proof) => {
    setPaying(true);
    // Payment was already verified from the uploaded receipt; this records the
    // order and notifies the shop. Brief spinner so it does not snap open.
    setTimeout(() => {
      setPaying(false);
      const code = Math.random().toString(36).slice(2, 8);
      const placed = {
        id: `LK-${Date.now().toString().slice(-6)}`,
        code,
        tier,
        total: proof.amount,
        paid: proof.amount,
        payment: { method: "Manual QR", refNo: proof.refNo, fileName: proof.fileName },
        customer: { ...contact },
        card: { orientation, design, finish, printName },
        deliverySaved: false,
      };
      write("order", placed);
      write("user", { name: contact.fullName || printName, email: contact.email, tier, code });
      notifyOwner({
        order: {
          id: placed.id,
          code,
          tier,
          total: placed.total,
          paid: placed.paid,
          refNo: proof.refNo,
          email: contact.email,
          name: contact.fullName || printName,
          phone: contact.phone,
          address: null,
          card: { orientation, design, finish, printName },
        },
        receipt: proof.receiptData ? { name: proof.fileName, data: proof.receiptData } : null,
      });
      setOrder(placed);
    }, 700);
  };

  const saveDelivery = () => {
    const next = {};
    // Coerce first: a restored or stale order can leave fields undefined, and
    // calling .trim() on that throws instead of showing the field error.
    const a = { street: "", province: "", city: "", barangay: "", zip: "", notes: "", ...address };
    if (!a.street.trim()) next.street = "Enter your street address.";
    if (!a.province) next.province = "Choose a province.";
    if (!a.city) next.city = "Choose a city or municipality.";
    if (!a.barangay) next.barangay = "Choose a barangay.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setAddress(a);
    const updated = { ...order, deliverySaved: true, customer: { ...order.customer, ...a } };
    write("order", updated);
    notifyOwner({
      order: {
        id: updated.id,
        code: updated.code,
        tier: updated.tier,
        total: updated.total,
        paid: updated.paid,
        refNo: updated.payment.refNo,
        email: updated.customer.email,
        name: updated.customer.fullName,
        phone: updated.customer.phone,
        address: { ...a },
        card: updated.card,
        deliveryUpdate: true,
      },
      receipt: null,
    });
    setOrder(updated);
  };

  // Saves the buyer's private landing page links. Nothing is validated and
  // nothing is rejected: whatever was typed is normalised into something
  // clickable and sent on. A buyer should never be told their own link is
  // malformed, and the team can correct anything odd from the notification
  // email. Hygiene below is not validation - it only strips characters that
  // have no business in a link, and caps the length.
  const saveProfileLinks = () => {
    const clean = {};
    for (const f of PROFILE_LINK_FIELDS) {
      const raw = String(profileLinks[f.id] ?? "").replace(/[\p{Cc}<>]/gu, "").trim();
      if (!raw) continue;
      clean[f.id] = (f.type === "tel" ? raw : normaliseProfileLink(f, raw)).slice(0, 300);
    }

    const updated = { ...order, profileLinks, links: clean, linksSaved: true };
    write("order", updated);
    notifyOwner({
      order: {
        id: updated.id,
        code: updated.code,
        tier: updated.tier,
        total: updated.total,
        paid: updated.paid,
        refNo: updated.payment.refNo,
        email: updated.customer.email,
        name: updated.customer.fullName,
        phone: updated.customer.phone,
        address: updated.customer,
        card: updated.card,
        links: clean,
        linksUpdate: true,
      },
      receipt: null,
    });
    setOrder(updated);
  };

  // Skipping still marks the step done, otherwise the links form would keep
  // reappearing on reload. Nothing is sent to the owner on this path.
  const skipProfileLinks = () => {
    const updated = { ...order, linksSaved: true };
    write("order", updated);
    setOrder(updated);
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

          {order.linksSaved ? (
            <>
              <p className="muted small">
                Delivering to {order.customer.street}, {order.customer.barangay}, {order.customer.city},{" "}
                {order.customer.province}. Estimate: 3-5 business days, plus 2-3 days for printing and quality checks.
              </p>
              {Object.keys(order.links || {}).length > 0 && (
                <p className="muted small">
                  Your landing page links are saved. We have emailed them to our team so we can set up{" "}
                  <strong>{BRAND.url}/{order.code}</strong> before the card ships.
                </p>
              )}
              <div className="btn-row">
                <button className="btn primary" onClick={() => go("home")}>Back to home</button>
              </div>
            </>
          ) : order.deliverySaved ? (
            <>
              <p className="muted small">
                Delivering to {order.customer.street}, {order.customer.barangay}, {order.customer.city},{" "}
                {order.customer.province}. Estimate: 3-5 business days, plus 2-3 days for printing and quality checks.
              </p>
              <h3 style={{ marginTop: 24 }}>Your landing page links</h3>
              <p className="muted small">
                These go on your private landing page. All optional, and you can skip it and send them to us later.
              </p>
              <div className="link-grid">
                {PROFILE_LINK_FIELDS.map((f) => (
                  <Field key={f.id} label={f.label} id={`link-${f.id}`}>
                    <input
                      id={`link-${f.id}`}
                      type={f.type ?? "text"}
                      inputMode={f.inputMode}
                      value={profileLinks[f.id] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => setProfileLinks({ ...profileLinks, [f.id]: e.target.value })}
                    />
                  </Field>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn primary" onClick={saveProfileLinks}>Save my links</button>
                <button className="btn ghost" onClick={skipProfileLinks}>Skip for now</button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: 24 }}>Where should we deliver it?</h3>
              <p className="muted small">Shipping is arranged separately and confirmed by email.</p>
              {!geo.length ? (
                <div className="skeleton" style={{ margin: "12px 0" }}>Loading Philippine addresses</div>
              ) : (
                <AddressFields value={address} onChange={(v) => { setAddress(v); setErrors({}); }} geo={geo} error={errors} />
              )}
              <div className="btn-row">
                <button className="btn primary" onClick={saveDelivery} disabled={!geo.length}>
                  Save delivery details
                </button>
                <button className="btn ghost" onClick={() => go("home")}>Skip for now</button>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="hero-badge">Get your card</div>
      <h1>Order your Linkodra card</h1>
      <p className="lede">Customise, pay, done. Your profile goes live as soon as payment clears.</p>

      {paying && (
        <div className="panel narrow center" style={{ marginTop: 18 }}>
          <span className="spinner" /> <span className="muted">Placing your order...</span>
        </div>
      )}

      {!paying && (
        <div className="order-grid">
          <div>
            <h3>1. Choose your tier</h3>
            <div className="tier-pick">
              {["basic", "standard"].map((id) => {
                const t = tierById(id);
                return (
                  <button key={id} className={tier === id ? "sel" : ""} onClick={() => setTier(id)}>
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
            finish={finish}
            code="yourcode"
          />

          <div className="panel">
            <h3>Make it yours</h3>

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

            <Field label="Mobile number" id="step1Phone" error={errors.phone} hint="For delivery updates.">
              <input id="step1Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+63 917 000 0000" autoComplete="tel" />
            </Field>

            <button className="btn primary full" onClick={startPayment} disabled={preparing}>
              {preparing ? <><span className="spinner" /> Preparing payment</> : `Continue - pay ₱${selected.price.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}

      {payOpen && (
        <PayModal
          tierName={selected.name}
          due={selected.price}
          buyerName={contact.fullName || printName}
          buyerEmail={contact.email}
          onClose={() => setPayOpen(false)}
          onConfirm={placeOrder}
        />
      )}

      <p className="small muted center" style={{ marginTop: 20 }}>
        Referral code from a friend? Mention it after checkout and we will attach it - commissions are{" "}
        {Math.round(REFERRAL_RATE * 100)}% of the card price.
      </p>
    </section>
  );
}
