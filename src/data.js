// All content mirroring TLC workflow, rebranded to Linkodra - no emojis
export const FEATURES_CORE = [
  { title: "NFC Tap Technology", text: "Hold your card near any modern smartphone and your profile opens instantly. No app required." },
  { title: "Dynamic Digital Profile", text: "Update your details anytime through the link we email you. Your card always points to your latest info." },
  { title: "Full Link Tree", text: "Showcase your socials, website, portfolio, and more - all from one shareable profile." },
  { title: "Connections", text: "Every contact who connects with you - scanned, received, or added - lives in one searchable list." },
  { title: "Send My Details Instantly", text: "Share your contact back with one tap. If they are on Linkodra, it reaches them instantly. If not, it is emailed." },
  { title: "Overview Analytics", text: "See how often your card is viewed, tapped and saved, from your link." },
  { title: "One-Tap vCard Save", text: "Anyone who taps your card can save your contact straight to their phone in one tap." },
];

export const FEATURES_EXCLUSIVE = [
  { title: "AI Business Card Scanner", text: "Snap a photo of a paper card and Linkodra AI reads name, title, company, phone, email straight into Connections. Standard and Pro only." },
  { title: "Audience Analytics", text: "See where views come from, device, browser, OS and peak hours. Standard and Pro." },
  { title: "Engagement Tracking", text: "Track which links get most clicks. Pro exclusive." },
  { title: "Monthly Reports", text: "Tidy summary delivered to inbox. Pro exclusive." },
  { title: "Offline vCard QR (Pro)", text: "Second QR that saves contact directly with no internet needed." },
];

export const STEPS = [
  { n: "01", title: "Tap to Connect", text: "Hold your Linkodra card near any NFC-enabled smartphone. No app required. Just a tap." },
  { n: "02", title: "Profile Loads", text: "Your digital profile opens instantly at linkodra.com/john with name, links and contact info." },
  { n: "03", title: "Save Contact", text: "One tap saves your full contact into their phone address book via vCard." },
];

export const FAQS = [
  { q: "How long does shipping take?", a: "Standard shipping within the Philippines takes 3-5 business days. For a card with printed name, allow +2-3 business days for printing and QA." },
  { q: "Can I use my own logo on the Standard card?", a: "Logo printing is Pro only. Upload SVG or high-res PNG during checkout. Basic prints name with Linkodra branding. Standard prints name + phone, no logo." },
  { q: "Do I need an app to scan the card?", a: "No. iPhone XR and newer + most Android 2018+ read NFC natively. QR backup works with any camera." },
  { q: "Can I update my profile after I receive the card?", a: "Yes - your physical card points to your live digital profile. Update name, title, photo, links anytime. No reprint." },
  { q: "What happens if I lose my card?", a: "Your profile stays live at your linkodra.com link. Order a replacement anytime, it links to the same profile." },
  { q: "Is there a recurring subscription fee?", a: "No. One-time purchase. Profile + analytics stay active with no monthly fees." },
  { q: "Can I upgrade my tier later?", a: "Yes. Contact us to upgrade Basic to Standard to Pro. We issue a new card and unlock features." },
  { q: "What material are the cards made of?", a: "Premium PVC - same as bank cards. Waterproof, durable, built to last." },
  { q: "Do I need internet to share?", a: "Recipient needs internet to view profile. Pro offline vCard QR saves contact with no internet." },
  { q: "What payment methods are accepted?", a: "Demo frontend: QRPh, BPI / UBP debit via PayMongo in production. This build is frontend-only mock checkout." },
  { q: "How does the Referral Program work?", a: "Opt in from Refer and Earn tab, get unique link, earn commission per order through your link. Payout via GCash/bank transfer." },
  { q: "My card isn't tapping, help!", a: "Enable NFC, remove thick metal case, tap upper-back of phone, hold 1-2s. Try QR backup. If still dead, contact support." },
];

export const HELP_ARTICLES = [
  { cat: "Getting Started", t: "What is Linkodra?", d: "Overview of the digital business card platform and how it replaces paper cards.", body: "Linkodra PH is a premium NFC business card platform. One tap opens your digital profile - Contact Details, Social Links, Digital Profile, Location and Maps, Share Instantly, NFC and QR Enabled. No app required." },
  { cat: "Getting Started", t: "How does NFC tapping actually work?", d: "The technology behind the tap, and what happens on the other person's phone.", body: "NFC chip in your PVC card transmits your linkodra.com profile URL to the phone. Phone opens it in browser instantly. Hold card to upper-back of phone for 1-2 seconds." },
  { cat: "Getting Started", t: "What if the other person's phone doesn't have NFC?", d: "Every card also works with QR code scan as backup.", body: "Standard has Profile QR, Pro has Dual QR (Profile + vCard). Open any camera app and point at QR. Basic uses shareable link." },
  { cat: "Getting Started", t: "What's the difference between Basic, Standard, and Pro?", d: "Breakdown of each tier.", body: "Basic P699: name print, no QR, overview analytics. Standard P1399: name+phone, profile QR, audience analytics, AI scanner. Pro P1999: name+logo, dual QR, full engagement + reports + offline vCard." },
  { cat: "Ordering & Pricing", t: "How do I order a Linkodra card?", d: "Ordering is fully self-service through checkout.", body: "Go to Order: 1 Configure (tier, orientation, design, finish, name/phone), 2 Your Details (shipping + account), 3 Review and Pay (mock PayMongo). Confirmed instantly." },
  { cat: "Ordering & Pricing", t: "What payment methods are accepted?", d: "QRPh and direct debit via BPI/UBP through PayMongo.", body: "Production uses PayMongo. This frontend demo simulates payment success / failure for WordPress handoff." },
  { cat: "Ordering & Pricing", t: "Can I use a promo code?", d: "How discount and free-shipping codes apply.", body: "Enter code in Step 3. Try LINKODRA10 for 10% off (demo). Free-ship codes remove shipping fee." },
  { cat: "Ordering & Pricing", t: "How long does shipping take?", d: "Timelines by zone and fees.", body: "3-5 business days PH nationwide + 2-3 days print QA for Standard/Pro. Shipping fee calculated in Review step." },
  { cat: "Ordering & Pricing", t: "Can I cancel my order?", d: "Cancellation window and refund.", body: "Cancel before printing (within 24h) for full refund. After print, see return policy." },
  { cat: "Ordering & Pricing", t: "Is there a limit to how many cards I can order?", d: "Self, team or bulk.", body: "No limit in demo. For teams 10+, use Teams page for volume branding." },
  { cat: "Your Digital Profile", t: "What information can I add?", d: "Contact, socials and everything displayable.", body: "Name, title, company, bio, photo, cover, email, phones, WhatsApp, website, address, LinkedIn, Facebook, Instagram, TikTok, YouTube, Maps." },
  { cat: "Your Digital Profile", t: "How do I edit my digital profile?", d: "Update anytime, no reprint.", body: "Tell us what to change and we update it for you. Your card only holds a link, so changes are live instantly." },
  { cat: "Your Digital Profile", t: "What is my profile URL?", d: "Permanent shareable link.", body: "linkodra.com/yourname - e.g. linkodra.com/john. Share via text, email, signature even without physical card." },
  { cat: "Analytics & Insights", t: "What analytics do I get?", d: "Overview, Audience, Engagement by tier.", body: "Basic: views, uniques, clicks, saves + trend. Standard plus: device/browser/OS/source/peak hours. Pro plus: per-link engagement + monthly reports." },
  { cat: "Analytics & Insights", t: "How often does analytics update?", d: "Real-time.", body: "Every view, click and save is recorded the moment it happens." },
  { cat: "Contacts", t: "How does Connect button work?", d: "Lead capture into Connections.", body: "Visitor taps Connect on your profile, enters their info, appears in your Connections Hub." },
  { cat: "Contacts", t: "How does AI Business Card Scanner work?", d: "Standard/Pro auto-fill.", body: "Upload a photo of a paper card and Linkodra reads the name, title, company, phone and email for you." },
  { cat: "Contacts", t: "What does Send My Details do?", d: "Return contact info.", body: "Send your contact back in one tap: the recipient gets it instantly if they are a Linkodra user, otherwise by email." },
  { cat: "Referral Program", t: "How does Referral Program work?", d: "Earn commission per order through your link.", body: "Share your unique referral link and we track every order, your commission and your balance." },
  { cat: "Referral Program", t: "How and when do I get paid?", d: "Manual via GCash/bank.", body: "Email us to request a payout once you reach the minimum. Sent manually." },
  { cat: "Account & Security", t: "How do I manage my profile after ordering?", d: "Just email us.", body: "Reply to your order confirmation with the changes you want. We update it for you, and it goes live immediately." },
  { cat: "Troubleshooting", t: "My card isn't tapping", d: "Steps to fix tap.", body: "1 Enable NFC 2 Remove metal case 3 Tap correct spot 4 Hold 1-2s 5 Try QR 6 Test second phone. Still dead? Contact support." },
  { cat: "Troubleshooting", t: "My payment failed", d: "What to do.", body: "Check funds, try QRPh vs card, retry. Demo has Simulate Failure toggle to test error state." },
  { cat: "Teams & Organizations", t: "What is a Team account?", d: "For companies and associations.", body: "Link multiple profiles under one org. Logo + brand colors auto-apply to every profile." },
];

export const DEMO_PROFILE = {
  code: "john",
  name: "John Santos",
  title: "Sales Manager",
  company: "Linkodra PH",
  phone: "+63 917 123 4567",
  email: "john@linkodra.com",
  location: "Batangas City, PH",
  bio: "Helping teams network smarter. One tap. Endless connections.",
  links: [
    { label: "Call", primary: true },
    { label: "Message" },
    { label: "Email" },
    { label: "Location" },
  ],
  socials: ["FB", "IG", "IN", "WA"],
};
