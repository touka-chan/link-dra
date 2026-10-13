// FAQ content, grouped by topic. Rendered on /faq with collapsible answers.

export const FAQ_GROUPS = [
  "About Linkodra",
  "The NFC Card",
  "Your Digital Profile",
  "Analytics",
  "Ordering & Delivery",
  "Privacy & Security",
];

export const FAQS = [
  // About Linkodra
  { g: "About Linkodra", q: "What is Linkodra?", a: "Linkodra is an NFC business card made in Batangas. It is a PVC card with a chip inside that opens a live digital profile when someone taps it to their phone, so you stop reprinting cards every time a job title changes." },
  { g: "About Linkodra", q: "How is this different from a normal business card?", a: "A paper card gets lost, runs out, and is wrong the moment anything changes. A Linkodra card is bought once and points at a profile you can edit forever, and you can see how often it is used." },
  { g: "About Linkodra", q: "Is there a monthly subscription?", a: "No. You pay once for your tier. Your profile and analytics stay active with no recurring fees and no hidden charges." },
  { g: "About Linkodra", q: "Who is it for?", a: "Professionals, freelancers, entrepreneurs, creatives and sales teams who exchange contact details constantly. If you hand out more than a few cards a month, it pays for itself on the first lost wallet." },
  { g: "About Linkodra", q: "Do you ship outside the Philippines?", a: "We ship nationwide across the Philippines. International shipping is something we look at case by case, so talk to us if you need it." },
  { g: "About Linkodra", q: "Where are the cards made?", a: "In Batangas. The whole operation is local, from the NFC chips to the printing and quality checks." },

  // The NFC Card
  { g: "The NFC Card", q: "What is NFC?", a: "Near Field Communication. It is the short-range wireless already built into modern phones. The chip in your card hands your profile link to the phone on contact, which then opens it in the browser." },
  { g: "The NFC Card", q: "Do I need an app?", a: "No, and neither does the person you hand the card to. Tapping uses the reader already inside iOS and Android." },
  { g: "The NFC Card", q: "Will it work on every phone?", a: "With any NFC-enabled phone, which covers virtually every modern handset. For devices without NFC, Standard and Pro cards also carry a QR code that any camera app can read." },
  { g: "The NFC Card", q: "What is the card made of?", a: "Premium PVC, the same material banks use for payment cards. It resists water and is built to survive a wallet for years." },
  { g: "The NFC Card", q: "Can I print my own logo?", a: "Yes on Pro. You upload an SVG or high-resolution PNG during checkout. Basic prints Linkodra branding with your name, Standard prints your name." },
  { g: "The NFC Card", q: "What if I lose it?", a: "Your profile stays live and keeps working. You can order a replacement whenever you want and it links to the same profile with no setup." },
  { g: "The NFC Card", q: "Can the chip be reprogrammed?", a: "The chip ships pre-programmed with your permanent profile link. We advise against changing it, since it would break the link to your live profile." },
  { g: "The NFC Card", q: "Do I need internet for someone to use it?", a: "The profile itself needs a connection, but Pro cards print an offline vCard QR code, so your contact details can still be saved with no internet at all." },

  // Your Digital Profile
  { g: "Your Digital Profile", q: "What can I put on my profile?", a: "Name, title, company, bio, photo, cover image, email, two phone numbers, WhatsApp, website, address, and links to LinkedIn, Facebook, Instagram, TikTok and YouTube." },
  { g: "Your Digital Profile", q: "Can I update it after delivery?", a: "Yes, and freely. The card only holds a link, so edits appear immediately and never require a reprint." },
  { g: "Your Digital Profile", q: "Can visitors save my number?", a: "Yes. Every profile has a Save Contact button that downloads a vCard straight to their phone. Pro adds a printed QR that does the same offline." },
  { g: "Your Digital Profile", q: "Is my profile public?", a: "By default it is, which is what makes the card work. You can switch it to private from your dashboard if you need to." },
  { g: "Your Digital Profile", q: "What is my profile URL?", a: "It is linkodra.ph followed by your code, for example linkodra.ph/k7m2qx9p. It works as an ordinary link, so it is fine in an email signature." },

  // Analytics
  { g: "Analytics", q: "What analytics do I get?", a: "All tiers get Overview. Standard adds Audience, covering device, browser, operating system, source and peak hours. Pro adds Engagement, which ranks your links, plus monthly reports." },
  { g: "Analytics", q: "Do you track who viewed my profile?", a: "We record anonymous data like device and browser, never names. The exception is another cardholder who is signed in when they visit, which shows as an identified viewer unless they are browsing privately." },
  { g: "Analytics", q: "How often does it update?", a: "Every view, click and save is recorded as it happens and appears the next time you open your dashboard." },
  { g: "Analytics", q: "Can I see which links get clicked?", a: "On Pro. The Engagement tab breaks clicks down by type: email, phone, WhatsApp, website, each social icon, and the share button." },
  { g: "Analytics", q: "What is the difference between views and unique visitors?", a: "Views counts every time your profile opens, including repeat visits. Unique visitors counts each person once, so the gap between the two tells you how often people come back." },
  { g: "Analytics", q: "Can I get a report by email?", a: "Monthly reports land in your inbox on Pro. Every tier can pull the current numbers from the dashboard at any time." },

  // Ordering & Delivery
  { g: "Ordering & Delivery", q: "How do I order?", a: "Go to Order, pick a tier, personalise the print details, enter your delivery address, and pay. Your profile is ready to edit as soon as payment clears." },
  { g: "Ordering & Delivery", q: "How long does shipping take?", a: "Metro Manila two to four business days, Luzon three to five, Visayas four to six, Mindanao five to seven. Standard and Pro cards add two to three days for production and quality checks." },
  { g: "Ordering & Delivery", q: "What do the cards cost?", a: "Basic is ₱699, Standard is ₱1,399, and Pro is ₱1,999, per card. The pricing page has the full comparison." },
  { g: "Ordering & Delivery", q: "How is shipping calculated?", a: "By the province you enter at checkout, grouped into zones by island group. The fee appears on the review step before you pay." },
  { g: "Ordering & Delivery", q: "Can I order in bulk?", a: "Yes. Order as many cards as you need at checkout, or contact us for volume pricing and shared branding for an organisation." },
  { g: "Ordering & Delivery", q: "Can I upgrade later?", a: "Yes. Contact us and we will issue the higher-tier card and switch on the extra features against your existing profile." },
  { g: "Ordering & Delivery", q: "How does the AI card scanner handle a bad photo?", a: "It reads what it can and marks the rest for you to fill in, so a shadow across the phone number does not lose the entry. You always review a scan before it saves." },
  { g: "Ordering & Delivery", q: "Do you offer custom designs?", a: "Every card uses the same Linkodra Green Gradient face in landscape format, which is what the preview shows. For organisation branding across a whole team, contact us and we will talk through what is possible at volume." },

  // Privacy & Security
  { g: "Privacy & Security", q: "Is my data safe?", a: "It is encrypted in transit and at rest. We do not sell your data and run no advertising or tracking cookies on your profile." },
  { g: "Privacy & Security", q: "Can I delete my account?", a: "Yes, any time. Contact us and we will remove your account and all associated data." },
  { g: "Privacy & Security", q: "Do you use cookies?", a: "Only essential ones, to keep you signed in and your session secure. No advertising and no behavioural tracking." },
  { g: "Privacy & Security", q: "Who can see my contact details?", a: "Anyone who opens your profile, which is the point of a business card. That is why we collect analytics anonymously rather than building a dossier of who looked." },
];

export const faqCount = FAQS.length;