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
    desc: "The full card, with dual QR, engagement tracking and monthly reports.",
    popular: true,
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
// 2 = included and called out. Rows are rendered in order, one value per tier.
export const COMPARE = [
  { label: "Card branding", values: ["Linkodra + name", "Custom name + logo"] },
  { label: "NFC tap to profile", values: [1, 1] },
  { label: "Profile QR code", values: [0, 1] },
  { label: "Offline vCard QR", values: [0, 1] },
  { label: "Analytics", values: ["Overview", "Overview + Audience + Engagement + Reports"] },
  { label: "Connections hub", values: [1, 1] },
  { label: "Send my details", values: [0, 1] },
  { label: "AI business card scanner", values: [0, 1] },
  { label: "Priority support", values: [0, 1] },
];

// The client sells a single card face and a single orientation, so there is no
// picker to offer: the order form and the preview both use the only entry.
export const DESIGNS = [
  { id: "gradient", name: "Linkodra Green Gradient", bg: "linear-gradient(150deg,#16c939 0%,#0b4a1c 46%,#050705 100%)", ink: "#ffffff" },
];

export const DEFAULT_DESIGN = DESIGNS[0].id;
export const DEFAULT_ORIENTATION = "landscape";

// Links the buyer fills in for their own private landing page, collected after
// delivery details. Every field is optional. `base` lets a buyer type a bare
// handle such as "linkodra.ph" or "@linkodra" and still produce a usable URL.
export const PROFILE_LINK_FIELDS = [
  { id: "facebook", label: "Facebook page", base: "https://www.facebook.com/", placeholder: "linkodra.ph", inputMode: "url" },
  { id: "instagram", label: "Instagram", base: "https://www.instagram.com/", placeholder: "@yourhandle", inputMode: "url" },
  { id: "tiktok", label: "TikTok", base: "https://www.tiktok.com/@", placeholder: "yourhandle", inputMode: "url" },
  { id: "linkedin", label: "LinkedIn", base: "https://www.linkedin.com/in/", placeholder: "yourname", inputMode: "url" },
  { id: "x", label: "X (Twitter)", base: "https://x.com/", placeholder: "yourhandle", inputMode: "url" },
  { id: "youtube", label: "YouTube", base: "https://www.youtube.com/@", placeholder: "yourchannel", inputMode: "url" },
  { id: "email", label: "Email", placeholder: "you@company.ph", type: "email" },
  { id: "website", label: "Website", base: "https://", placeholder: "yourcompany.ph", inputMode: "url" },
  { id: "number", label: "Number", placeholder: "+63 917 000 0000", type: "tel" },
  { id: "gbp", label: "Google Business Profile", base: "https://", placeholder: "Business Profile share link", inputMode: "url" },
];

export const emptyProfileLinks = () =>
  PROFILE_LINK_FIELDS.reduce((acc, f) => ({ ...acc, [f.id]: "" }), {});

// Turns typed input into something clickable. Anything already carrying a
// scheme is left alone, so pasting a full link works exactly as it stands.
// Otherwise the value is read as a handle relative to the field, which is how
// people actually type: "linkodra.ph" in the Facebook box means their page
// there, not the website. A base that already ends in a path is stripped from
// the front first, so "/in/john" does not become ".../in//in/john".
export function normaliseProfileLink(field, value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw; // has http:, mailto:, tel:
  if (!field.base) return raw;

  const handle = raw.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
  const basePath = field.base.replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "");
  const trimmed =
    basePath && handle.toLowerCase().startsWith(`${basePath.toLowerCase()}/`)
      ? handle.slice(basePath.length + 1)
      : handle;
  return trimmed ? field.base + trimmed : "";
}

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