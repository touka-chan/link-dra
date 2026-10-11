// Copy for the marketing pages. Kept apart from the components so the wording can
// be reviewed without touching layout code.

export const CORE_FEATURES = [
  {
    title: "NFC tap technology",
    body: "Hold the card near any modern phone and the profile opens. No app, no account, no setup.",
  },
  {
    title: "A profile that keeps up",
    body: "Edit your details from the dashboard and they are live immediately. Your card never needs reprinting.",
  },
  {
    title: "Your links in one place",
    body: "Website, portfolio and socials gathered behind a single link you can drop into any signature.",
  },
  {
    title: "Connections hub",
    body: "Everyone who connects with you lives in one searchable list, whether they tapped, scanned, or were added.",
  },
  {
    title: "Send my details",
    body: "Share your own contact back in a tap. Linkodra cardholders get it in their dashboard, everyone else by email.",
  },
  {
    title: "Overview analytics",
    body: "See how many views, saves and clicks your card is getting, without guessing.",
  },
  {
    title: "One-tap vCard save",
    body: "Visitors can add you to their phone's address book straight from the profile.",
  },
];

export const TIER_FEATURES = [
  {
    title: "AI business card scanner",
    body: "Photograph a paper business card and Linkodra reads the name, title, company, phone and email straight into your connections. No typing.",
    minTier: 2,
    tierLabel: "Standard and Pro",
  },
  {
    title: "Audience analytics",
    body: "Understand who is tapping and when, so you know which events and follow-ups are actually working.",
    minTier: 2,
    tierLabel: "Standard and Pro",
  },
  {
    title: "Engagement tracking",
    body: "See which buttons on your profile get pressed, and which ones nobody touches.",
    minTier: 3,
    tierLabel: "Pro only",
  },
  {
    title: "Offline vCard QR",
    body: "A second QR code that saves your contact with no internet connection at all. Built for venues with patchy signal.",
    minTier: 3,
    tierLabel: "Pro only",
  },
];

export const ANALYTICS_TABS = [
  {
    title: "Overview",
    body: "Views, unique visitors, saves and clicks at a glance, with a twelve-month trend. Included on every tier.",
    minTier: 1,
  },
  {
    title: "Audience",
    body: "Device, browser, operating system and traffic source, plus the hours your network is most active.",
    minTier: 2,
  },
  {
    title: "Engagement",
    body: "A full breakdown of clicks per link type: email, phone, WhatsApp, website, social icons and share.",
    minTier: 3,
  },
  {
    title: "Reports",
    body: "A tidy monthly summary of your networking activity, delivered to your inbox.",
    minTier: 3,
  },
];

export const HOW_STEPS = [
  {
    n: "01",
    title: "Tap to connect",
    body: "Hold the card near any NFC phone. There is no app to install and no account to create.",
  },
  {
    n: "02",
    title: "Profile loads",
    body: "Your page opens instantly in their browser with everything you chose to show, exactly as you set it up.",
  },
  {
    n: "03",
    title: "Save the contact",
    body: "One tap adds you to their address book. They keep your details, you keep the connection.",
  },
];

export const DEVICE_SUPPORT = [
  {
    title: "iOS",
    body: "iPhone XR and newer. Background tag reading is on by default, so the profile opens without unlocking.",
  },
  {
    title: "Android",
    body: "Most phones from 2018 onward, with NFC switched on in settings.",
  },
  {
    title: "No NFC?",
    body: "Standard and Pro cards print a QR code on the back that any camera app can read.",
  },
];

export const TECHNOLOGY = [
  {
    title: "Instant networking",
    body: "A single tap transfers your complete professional profile to any modern phone, with nothing to download.",
  },
  {
    title: "Profiles that stay current",
    body: "Update from the dashboard and the card follows along. Your physical card always points at your latest information.",
  },
  {
    title: "Less waste",
    body: "One durable PVC card replaces thousands of paper ones, and outlives most of what it replaces.",
  },
];

export const ABOUT = {
  spark: {
    title: "The spark",
    body: "It started with a stack of paper cards on a desk in Batangas. Same job title on all of them, three of them already out of date, two in a coat pocket that was never going to be worn again. The realisation was simple: introductions had not moved on since the nineteen-eighties.",
    idea: "One durable card pointing at one address you can change whenever you want.",
  },
  bridge: {
    title: "Bridging the gap",
    body: "A Linkodra card is not a gimmick layered on a paper card. It is the replacement for it. The chip holds nothing but a link, and that link leads to a profile you own and can rewrite at any time. Print is permanent; the information behind it is not.",
    badges: ["NFC enabled", "Cloud synced", "Always current"],
  },
  roots: {
    title: "Local roots, wide reach",
    body: "Built in Batangas, by people who grew up handing out paper cards at family events. The build is deliberately tough, because local life is dusty, humid and hard on anything delicate. It just happens to work equally well in a boardroom overseas.",
  },
  values: [
    { title: "Built to last", body: "The long game. One card should outlast the job it was bought for." },
    { title: "Useful, not clever", body: "Technology earns its place here by removing a step, not by being noticed." },
    { title: "Rooted here", body: "Made in Batangas for everyone who exchanges details for a living." },
  ],
  roadmap: [
    { title: "A wider identity toolkit", body: "Expanding past the card into a small set of tools that travel together." },
    { title: "Beyond the Philippines", body: "Taking a locally made card to professionals further afield." },
  ],
};

export const TESTIMONIAL = {
  quote:
    "I used to spend a conference weekend handing out cards I knew were already out of date. Now I hand out one card and edit everything else from my phone the night before.",
  name: "Ann Villabas",
  role: "Operations Manager, Batangas",
};

export const PROFILE_ACTIONS = [
  "Contact details",
  "Social links",
  "Digital profile",
  "Location and maps",
  "Share instantly",
  "NFC and QR enabled",
];