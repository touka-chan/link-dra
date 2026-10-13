// Linkodra PH - brand tokens, product tiers and checkout rules.
// This module is the single source of truth for pricing, tier gating and
// shipping, so the marketing pages and the order flow never drift.

export const BRAND = {
  name: "Linkodra",
  suffix: "PH",
  tagline: "Your Business Card. Smarter.",
  sub: "Smart NFC Business Cards",
  mantra: ["TAP", "CONNECT", "SHARE"],
  payoff: "One Tap. Endless Connections.",
  url: "linkodra.com",
  email: "hello@linkodra.com",
  phone: "+63 916 682 4068",
  address: "Balagtas, Batangas City, Philippines",
};

// Official profiles. Kept here so the footer, profile page and chat widget all
// link to the same place instead of hardcoding URLs in each component.
const SOCIALS = [
  { id: "facebook", label: "Facebook", handle: "Linkodra PH", url: "https://www.facebook.com/linkodra.ph" },
  { id: "instagram", label: "Instagram", handle: "@linkodra.ph", url: "https://www.instagram.com/linkodra.ph" },
];

export { SOCIALS };

// Each feature carries an icon key and an off flag, because the pricing cards
// show exclusions explicitly ("No QR Code") rather than silently omitting them.
const F = (icon, label, off = false) => ({ icon, label, off });

export const TIERS = [
  {
    id: "basic",
    rank: 1,
    name: "Basic",
    price: 699,
    pitch: "Essential digital presence",
    desc: "Everything you need to replace a paper card.",
    features: [
      F("shield", "Premium PVC card"),
      F("user", "Printed name"),
      F("qr", "No QR code", true),
      F("chart", "Overview analytics"),
      F("network", "Connections"),
    ],
  },
  {
    id: "standard",
    rank: 2,
    name: "Standard",
    price: 1399,
    pitch: "Personalised presentation and analytics",
    desc: "More reach, and a scanner for the cards you still get handed.",
    popular: true,
    features: [
      F("shield", "Premium PVC card"),
      F("user", "Cardholder's name"),
      F("qr", "Profile QR code"),
      F("chart", "Overview analytics"),
      F("users", "Audience analytics"),
      F("network", "Connections"),
      F("scan", "AI business card scanner"),
      F("send", "Send my details instantly"),
    ],
  },
  {
    id: "pro",
    rank: 3,
    name: "Pro",
    price: 1999,
    pitch: "For advanced networking professionals",
    desc: "Your logo, an offline vCard QR, and the full analytics suite.",
    features: [
      F("shield", "Premium PVC card"),
      F("user", "Cardholder's name"),
      F("qr", "Dual QR (profile + vCard)"),
      F("chart", "Overview analytics"),
      F("users", "Audience analytics"),
      F("bolt", "Engagement tracking"),
      F("doc", "Monthly reports"),
      F("network", "Connections"),
      F("scan", "AI business card scanner"),
      F("send", "Send my details instantly"),
    ],
  },
];

// Plain-text lists for places that cannot render icons (compare table, order summary).
export const tierFeatureLabels = (tier) => tier.features.map((f) => f.label);

export const tierById = (id) => TIERS.find((t) => t.id === id) ?? TIERS[1];
export const tierRank = (id) => tierById(id).rank;

// Compare table on the pricing page. 0 = not included, 1 = included,
// 2 = included and called out. Rows are rendered in order.
export const COMPARE = [
  { label: "Card branding", values: ["Linkodra + name", "Custom name", "Custom name + logo"] },
  { label: "NFC tap to profile", values: [1, 1, 1] },
  { label: "Profile QR code", values: [0, 1, 1] },
  { label: "Offline vCard QR", values: [0, 0, 1] },
  { label: "Analytics", values: ["Overview", "Overview + Audience", "Overview + Audience + Engagement + Reports"] },
  { label: "Connections hub", values: [1, 1, 1] },
  { label: "Send my details", values: [0, 1, 1] },
  { label: "AI business card scanner", values: [0, 1, 1] },
  { label: "Priority support", values: [0, 0, 1] },
];

export const DESIGNS = [
  { id: "minimalist", name: "Linkodra Minimalist", bg: "#0b0e0b", ink: "#22e948" },
  { id: "neon", name: "Linkodra Neon", bg: "#071007", ink: "#22e948" },
  { id: "gradient", name: "Linkodra Green Gradient", bg: "linear-gradient(150deg,#16c939 0%,#0b4a1c 46%,#050705 100%)", ink: "#ffffff" },
];

// Shipping is worked out from the island group of the selected province.
export const SHIPPING = [
  { zone: "Metro Manila", fee: 99, days: "2-4 business days" },
  { zone: "Luzon", fee: 149, days: "3-5 business days" },
  { zone: "Visayas", fee: 199, days: "4-6 business days" },
  { zone: "Mindanao", fee: 249, days: "5-7 business days" },
];

const ZONE_BY_ISLAND = { L: 1, V: 2, M: 3 };
// Metro Manila is carved out of Luzon by name.
const METRO_MANILA = new Set([
  "Metro Manila", "Caloocan", "Las Piñas", "Makati", "Malabon", "Manila", "Marikina",
  "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan",
  "Taguig", "Valenzuela",
]);

export function shippingFor(provinceName, islandCode) {
  if (provinceName && METRO_MANILA.has(provinceName)) return SHIPPING[0];
  const idx = ZONE_BY_ISLAND[islandCode] ?? 1;
  return SHIPPING[idx];
}

export const PROMOS = {
  LINKODRA10: { kind: "percent", value: 10, label: "LINKODRA10 - 10% off" },
  FREESHIP: { kind: "shipping", value: 0, label: "FREESHIP - free shipping" },
};

export function applyPromo(code, price) {
  const promo = PROMOS[(code || "").trim().toUpperCase()];
  if (!promo) return { discount: 0, freeShipping: false, promo: null };
  if (promo.kind === "percent") return { discount: Math.round((price * promo.value) / 100), freeShipping: false, promo };
  return { discount: 0, freeShipping: true, promo };
}

export const PAYMENT_METHODS = [
  { id: "qrph", name: "QRPh", note: "Scan with any PH wallet" },
  { id: "bpi", name: "BPI Debit", note: "Direct debit" },
  { id: "ubp", name: "UBP Debit", note: "Direct debit" },
];

export const REFERRAL_RATE = 0.2;