// Linkodra PH - brand tokens (solid, no gradient)
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
  colors: {
    bg: "#050705",
    bgSoft: "#0a0f0b",
    panel: "#0c130d",
    panelBorder: "rgba(34,233,72,0.18)",
    primary: "#22e948", // solid neon green, no gradient
    primaryHover: "#16c939",
    text: "#ffffff",
    muted: "#9db3a3",
  },
};

export const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: 699,
    desc: "Essential digital presence.",
    features: [
      "Premium PVC Card",
      "Printed Name",
      "No QR Code",
      "Overview Analytics",
      "Connections",
      "One-Tap vCard Save",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 1399,
    desc: "More power for professionals.",
    popular: true,
    features: [
      "Premium PVC Card",
      "Cardholder's Name + Phone",
      "Profile QR Code",
      "Overview + Audience Analytics",
      "Connections",
      "AI Business Card Scanner",
      "Send My Details Instantly",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1999,
    desc: "Maximum utility.",
    features: [
      "Premium PVC Card",
      "Custom Name + Logo",
      "Dual QR (Profile + vCard)",
      "Full Analytics + Monthly Reports",
      "Connections",
      "AI Business Card Scanner",
      "Send My Details Instantly",
      "Offline vCard Access",
    ],
  },
];

export const DESIGNS = [
  { id: "minimalist", name: "Linkodra Minimalist", bg: "#0b0e0b", accent: "#22e948" },
  { id: "neon", name: "Linkodra Neon", bg: "#071007", accent: "#22e948" },
  { id: "solid", name: "Linkodra Solid", bg: "#0a1a0e", accent: "#22e948" },
];
