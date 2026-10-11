// Demo account data. In production these come from the profile and analytics APIs;
// until then the dashboard reads and writes them through localStorage.

export const DEMO_PROFILE = {
  name: "John Santos",
  title: "Sales Manager",
  company: "Linkodra PH",
  phone: "+63 917 123 4567",
  phone2: "",
  whatsapp: "+63 917 123 4567",
  email: "john@linkodra.ph",
  location: "Balagtas, Batangas City",
  bio: "I help teams in Batangas and beyond replace their paper cards with something that never goes out of date.",
  website: "linkodra.ph/john",
  links: [
    { label: "Call", icon: "phone", primary: true, action: "tel:+639171234567" },
    { label: "Message", icon: "chat", action: "sms:+639171234567" },
    { label: "Email", icon: "mail", action: "mailto:john@linkodra.ph" },
    { label: "Location", icon: "pin", action: "https://maps.google.com/?q=Balagtas+Batangas+City" },
  ],
  socials: [
    { label: "Facebook", short: "FB", handle: "fb.com/johnsantos" },
    { label: "Instagram", short: "IG", handle: "@johnsantos" },
    { label: "LinkedIn", short: "IN", handle: "linkedin.com/in/johnsantos" },
    { label: "WhatsApp", short: "WA", handle: "+639171234567" },
  ],
};

// Seeded so the analytics tabs have something coherent to show on a fresh install.
export const DEMO_ANALYTICS = {
  overview: {
    views: 1284,
    unique: 863,
    saves: 212,
    clicks: 540,
    trend: [42, 58, 47, 71, 66, 88, 74, 96, 81, 103, 92, 118],
    trendLabels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  },
  audience: {
    devices: [
      { label: "iOS", value: 54 },
      { label: "Android", value: 41 },
      { label: "Other", value: 5 },
    ],
    sources: [
      { label: "In person", value: 62 },
      { label: "Link shared", value: 21 },
      { label: "Direct", value: 17 },
    ],
    peak: "Tuesday, 10:00-12:00",
  },
  engagement: {
    links: [
      { label: "Call", value: 38 },
      { label: "Save contact", value: 24 },
      { label: "Email", value: 16 },
      { label: "WhatsApp", value: 11 },
      { label: "Social links", value: 7 },
      { label: "Share", value: 4 },
    ],
  },
};

export const DEMO_CONNECTIONS = [
  { id: "c1", name: "Ann Villabas", title: "Operations Manager", company: "Peak Creatives", via: "Connect button", at: "2 days ago", sent: false },
  { id: "c2", name: "Ella Rivero", title: "CEO", company: "Peak Creatives", via: "AI scan", at: "5 days ago", sent: true },
  { id: "c3", name: "Marco Delos Reyes", title: "Founder", company: "Balagtas Foods", via: "In person", at: "1 week ago", sent: false },
];

// What the AI scanner returns for a photo upload. Production swaps this for a
// server-side OCR call, which is why the component shows a "reading" state.
export const SCAN_SAMPLES = [
  { name: "Priña Ramos", title: "Head of Operations", company: "Harbor Freight PH", phone: "+63 917 888 2211", email: "pr@harborfreight.ph" },
  { name: "Daniel Sun", title: "Creative Director", company: "Studio Anino", phone: "+63 998 221 4477", email: "daniel@studioanino.ph" },
];

export const DEMO_MEMBERS = [
  { name: "John Santos", title: "Sales Manager", badge: "Owner" },
  { name: "Ann Villabas", title: "Operations Manager", badge: "Member" },
  { name: "Ella Rivero", title: "CEO", badge: "Member" },
  { name: "Marco Delgado", title: "Account Executive", badge: "Member" },
];

export const CHAT_PROMPTS = [
  "How do I order a card?",
  "What is the tier difference?",
  "How does the referral program work?",
  "My card is not tapping, help!",
];