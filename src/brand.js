// Linkodra PH - brand tokens, product tiers and checkout rules.
// This module is the single source of truth for pricing, tier gating and
// shipping, so marketing pages, the order wizard and the dashboard never drift.

export const BRAND = {
  name: "Linkodra",
  suffix: "PH",
  tagline: "Your Business Card. Smarter.",
  sub: "Smart NFC Business Cards",
  mantra: ["TAP", "CONNECT", "SHARE"],
  payoff: "One Tap. Endless Connections.",
  url: "linkodra.ph",
  email: "hello@linkodra.ph",
  phone: "+63 916 682 4068",
  address: "Balagtas, Batangas City, Philippines",
};

export const BRAND_COLORS = {
  bg: "#050705",
  bgSoft: "#0a0f0b",
  panel: "#0c130d",
  panelBorder: "rgba(34,233,72,0.18)",
  primary: "#22e948",
  primaryHover: "#16c939",
  text: "#ffffff",
  muted: "#9db3a3",
};

export const TIERS = [
  {
    id: "basic",
    rank: 1,
    name: "Basic",
    price: 699,
    pitch: "Essential digital presence",
    desc: "Everything you need to replace a paper card.",
    features: [
      "Premium PVC card",
      "Printed name",
      "NFC tap to open profile",
      "Overview analytics",
      "Connections hub",
      "One-tap vCard save",
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
      "Premium PVC card",
      "Printed name and phone",
      "Profile QR code",
      "Overview and audience analytics",
      "Connections hub",
      "AI business card scanner",
      "Send my details instantly",
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
      "Premium PVC card",
      "Printed name and phone",
      "Custom name and logo",
      "Dual QR (profile and vCard)",
      "Full analytics with monthly reports",
      "Connections hub",
      "AI business card scanner",
      "Send my details instantly",
      "Offline vCard access",
    ],
  },
];

export const tierById = (id) => TIERS.find((t) => t.id === id) ?? TIERS[1];
export const tierRank = (id) => tierById(id).rank;

// Compare table on the pricing page. 0 = not included, 1 = included,
// 2 = included and called out. Rows are rendered in order.
export const COMPARE = [
  { label: "Card branding", values: ["Linkodra + name", "Custom name", "Custom name + logo"] },
  { label: "Printed phone number", values: [0, 1, 1] },
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