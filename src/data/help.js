// Help Center content.
//
// Nine categories, written for Linkodra. Bodies are deliberately short and
// action-first; long-form policy text belongs in /legal, not here.

export const HELP_CATEGORIES = [
  "Getting Started",
  "Ordering & Pricing",
  "Your Digital Profile",
  "Analytics & Insights",
  "Connections",
  "Referral Program",
  "Account & Security",
  "Troubleshooting",
  "Teams & Organizations",
];

export const HELP_ARTICLES = [
  // Getting Started
  {
    t: "What is Linkodra?",
    d: "A quick tour of the platform and what replaces about it.",
    cat: "Getting Started",
    body: "Linkodra is an NFC business card: a durable PVC card with a chip inside that opens a live digital profile when someone taps it to their phone. The physical card never goes out of date, because it only ever points at your profile, which you can edit whenever you like. No app is required on either side of the tap.",
  },
  {
    t: "How does tapping actually work?",
    d: "What happens in the second between touching the card and the page loading.",
    cat: "Getting Started",
    body: "The chip inside your card is pre-programmed with your profile link. Hold the card near the top back of an NFC phone for one to two seconds and the phone opens that link in its browser. If the tap does not register, the QR code printed on the back does exactly the same job.",
  },
  {
    t: "What if their phone has no NFC?",
    d: "Every card also works as a plain QR code.",
    cat: "Getting Started",
    body: "Standard and Pro cards print a QR code on the back that opens the same profile. Point any camera app at it and the page loads. Basic cards are tap-only by design, so if you expect a lot of older hardware in your network, Standard is the safer choice.",
  },
  {
    t: "Which phones are compatible?",
    d: "iOS and Android coverage, and what to do below that.",
    cat: "Getting Started",
    body: "Any iPhone from the XR onward taps straight out of the box, and most Android phones from around 2018 onward work with NFC enabled in settings. Older or budget devices without NFC are covered by the QR code on Standard and Pro cards.",
  },
  {
    t: "What is the difference between the tiers?",
    d: "Basic, Standard and Pro side by side.",
    cat: "Getting Started",
    body: "Basic covers the essentials: a printed name, tap-to-open, and overview analytics. Standard adds a profile QR code, audience analytics and the AI card scanner. Pro adds your logo, a dual QR including an offline vCard, engagement tracking and monthly reports. The pricing section below has the full matrix.",
  },

  // Ordering & Pricing
  {
    t: "How do I order a card?",
    d: "Checkout is self-service and takes about two minutes.",
    cat: "Ordering & Pricing",
    body: "Open the Order page, pick a tier, customise the print details, then enter your delivery address and pay. Your profile is created the moment payment clears, so you can start editing it while your card is still being produced.",
  },
  {
    t: "What do I choose on the Configure step?",
    d: "Orientation, design, finish and what gets printed.",
    cat: "Ordering & Pricing",
    body: "Every card ships in the same landscape format with the Linkodra Green Gradient face, so what you see in the preview is what gets printed. Matte or glossy changes the coating only. The name field is what gets printed.",
  },
  {
    t: "Can I use my own logo?",
    d: "Logo printing is a Pro feature.",
    cat: "Ordering & Pricing",
    body: "Upload an SVG or a high-resolution PNG during checkout and it is printed on the card. Basic prints Linkodra branding with your name. Standard prints your name, but no logo.",
  },
  {
    t: "How long does delivery take?",
    d: "Timelines by zone, plus the extra time for printing.",
    cat: "Ordering & Pricing",
    body: "Metro Manila is two to four business days, Luzon three to five, Visayas four to six, and Mindanao five to seven. Standard and Pro cards with printed names need an extra two to three business days for production and quality checks.",
  },
  {
    t: "How is shipping calculated?",
    d: "The rate follows the province you enter at checkout.",
    cat: "Ordering & Pricing",
    body: "We group provinces into zones by island group, so the fee updates as soon as you pick your province. Shipping is added after your address is entered, on the review step. The FREESHIP promo code waives it entirely.",
  },
  {
    t: "Is there a limit on how many cards I can order?",
    d: "Single cards, team batches, or company-wide runs.",
    cat: "Ordering & Pricing",
    body: "Order as many as you like at checkout. For a whole team, a chamber, or a company, contact us for volume pricing and shared branding instead of placing many separate orders.",
  },
  {
    t: "Can I use a promo code?",
    d: "Discount and free-shipping codes.",
    cat: "Ordering & Pricing",
    body: "Enter the code on the review step, before you pay. LINKODRA10 takes ten percent off the card price. FREESHIP removes the shipping fee. Only one code applies per order.",
  },
  {
    t: "What payment methods do you accept?",
    d: "QRPh and direct debit, processed by PayMongo.",
    cat: "Ordering & Pricing",
    body: "Pay with QRPh from any Philippine wallet, or by direct debit through BPI or UBP. Payments run through PayMongo, which handles the card and bank details. Linkodra never sees your banking credentials.",
  },
  {
    t: "Can I cancel an order?",
    d: "The cancellation window and how refunds work.",
    cat: "Ordering & Pricing",
    body: "You can cancel free of charge any time before the card enters production, which is within twenty-four hours of ordering. After that the files are already at the printer. Contact us as soon as possible and we will tell you where your order sits.",
  },
  {
    t: "Can I return a card after delivery?",
    d: "What is covered, and how to start.",
    cat: "Ordering & Pricing",
    body: "If a card arrives damaged or has a printing fault, we replace it free. Change of mind after delivery is not covered, because the card is personalised. Message us with your order number and a photo and we will sort it out.",
  },

  // Your Digital Profile
  {
    t: "What can I put on my profile?",
    d: "Every field the public page supports.",
    cat: "Your Digital Profile",
    body: "Name, job title, company, a short bio, profile photo, cover image, email, primary and secondary phone, WhatsApp, website, address, and links to LinkedIn, Facebook, Instagram, TikTok and YouTube. Anything you leave blank is simply hidden.",
  },
  {
    t: "How do I edit my profile?",
    d: "Changes go live immediately, with no reprint.",
    cat: "Your Digital Profile",
    body: "Open the Profile tab in your dashboard. Every field saves as you go and the public page picks up the change straight away. Your physical card never needs reprinting, because it only holds a link.",
  },
  {
    t: "What is my profile link?",
    d: "Where your profile lives and how to share it.",
    cat: "Your Digital Profile",
    body: "Your profile sits at linkodra.ph followed by your public code, for example linkodra.ph/k7m2qx9p. It works as an ordinary web link, so you can put it in an email signature or post it anywhere, card or no card.",
  },
  {
    t: "Can people save my details to their phone?",
    d: "The one-tap vCard save button.",
    cat: "Your Digital Profile",
    body: "Yes. Every profile has a Save Contact button that downloads a vCard file straight to the visitor's phone. Pro cards also print a second QR code that does the same job with no internet connection.",
  },
  {
    t: "Can I hide my profile?",
    d: "Switching a profile between public and private.",
    cat: "Your Digital Profile",
    body: "Profiles are public by default, because that is what makes the card work for anyone who taps it. You can set one to private from your dashboard, which hides the page while leaving your card and analytics intact.",
  },
  {
    t: "Is there an app to install?",
    d: "No, and there is not going to be.",
    cat: "Your Digital Profile",
    body: "Neither you nor the person you hand the card to needs to install anything. Tapping uses the NFC reader already built into iOS and Android, and the profile opens in the browser they already have open.",
  },

  // Analytics & Insights
  {
    t: "What analytics do I get?",
    d: "Overview, Audience, Engagement and Reports.",
    cat: "Analytics & Insights",
    body: "Every tier includes Overview: views, unique visitors, saves and clicks, with a trend chart. Standard adds Audience, covering device, browser, operating system, source and peak hours. Pro adds Engagement, which ranks your links, and a monthly report in your inbox.",
  },
  {
    t: "How current is the data?",
    d: "Recording and display timing.",
    cat: "Analytics & Insights",
    body: "Views, clicks and saves are recorded as they happen and appear the next time you load your dashboard. There is no batch delay.",
  },
  {
    t: "Can I see who viewed my profile?",
    d: "Anonymous counts, and the one exception.",
    cat: "Analytics & Insights",
    body: "We record device type, browser and traffic source, not names, so most viewers stay anonymous. The exception is another Linkodra cardholder who is logged in when they open your profile, which shows up as an identified viewer unless they are browsing privately.",
  },
  {
    t: "Which of my links get the most clicks?",
    d: "Engagement tracking, Pro only.",
    cat: "Analytics & Insights",
    body: "The Engagement tab breaks clicks down by link type: email, phone, WhatsApp, website, each social icon, and the share button. It tells you which of your calls to action actually works.",
  },
  {
    t: "Where do monthly reports arrive?",
    d: "What is in the Pro report.",
    cat: "Analytics & Insights",
    body: "A tidy summary of the month lands in your inbox: views, saves, clicks, your top link and how it compares with the previous month. It is a Pro feature.",
  },

  // Connections
  {
    t: "Where do I see people who connected with me?",
    d: "Your Connections Hub.",
    cat: "Connections",
    body: "Everyone who used your Connect button, or whose card you scanned, appears in the Connections tab, newest first. Each entry shows how you met, so you can tell a tap apart from a scan.",
  },
  {
    t: "How does the Connect button work?",
    d: "The capture step that turns a visitor into a lead.",
    cat: "Connections",
    body: "Your profile has a Connect with button. When someone taps it, they enter their name and number, and they land in your Connections Hub immediately. If they already hold a Linkodra card, you also see that they did.",
  },
  {
    t: "How does the AI business card scanner work?",
    d: "Turning a paper card into a saved contact.",
    cat: "Connections",
    body: "Take a photo of a paper business card and the scanner reads the name, title, company, phone and email straight into your Connections list. You review it before it saves. Available on Standard and Pro.",
  },
  {
    t: "What does Send My Details do?",
    d: "Sharing your own contact back with a connection.",
    cat: "Connections",
    body: "It sends your contact details to someone already in your Connections list in one tap. If they are a Linkodra cardholder it lands in their dashboard; if not, it goes to them by email.",
  },
  {
    t: "What is the offline vCard QR code?",
    d: "The second QR code printed on Pro cards.",
    cat: "Connections",
    body: "It encodes your contact details directly rather than a web link, so someone can save you to their phone with no internet connection at all. Useful at events with patchy signal.",
  },

  // Referral Program
  {
    t: "How does the referral program work?",
    d: "Your link, their order, your commission.",
    cat: "Referral Program",
    body: "Every active cardholder can join. You get a personal referral link from the Refer tab in your dashboard. Anyone who orders through it is attributed to you, and you earn a commission on each card they buy.",
  },
  {
    t: "Who can join?",
    d: "No minimum order, no application.",
    cat: "Referral Program",
    body: "Any cardholder with an active profile can opt in from the dashboard. There is no minimum spend and nothing to apply for.",
  },
  {
    t: "How and when am I paid?",
    d: "Payout method and timing.",
    cat: "Referral Program",
    body: "Commissions accumulate in your dashboard balance. When you request a payout we send it by GCash or bank transfer, usually within a few business days of the order clearing its return window.",
  },

  // Account & Security
  {
    t: "How do I open my dashboard?",
    d: "It is created when you order.",
    cat: "Account & Security",
    body: "Your dashboard is created automatically when your order payment clears, using the email you entered at checkout. Open it anytime to edit your profile, check analytics and manage connections.",
  },
  {
    t: "I lost access to my dashboard.",
    d: "Getting back in.",
    cat: "Account & Security",
    body: "Use the same email you ordered with and contact us so we can restore your access. If it still does not work, check spam for our reply before asking us to resend.",
  },
  {
    t: "Is my data safe?",
    d: "What we do and do not do with your information.",
    cat: "Account & Security",
    body: "Your data is encrypted in transit and at rest. We do not sell it, and there are no advertising or tracking cookies anywhere on your profile. Analytics are collected anonymously. The Privacy Policy has the detail.",
  },
  {
    t: "Can I delete my account?",
    d: "Full deletion on request.",
    cat: "Account & Security",
    body: "Yes. Contact us and we will remove your account and all associated data. Note that your card will stop working once the profile behind it is gone.",
  },
  {
    t: "Do you use cookies?",
    d: "Essential only.",
    cat: "Account & Security",
    body: "Only the cookies needed to keep you signed in and your session secure. No advertising cookies, no behavioural tracking, no third-party pixels. See the Cookie Policy for the full list.",
  },

  // Troubleshooting
  {
    t: "My card does not tap.",
    d: "The usual causes, in order of likelihood.",
    cat: "Troubleshooting",
    body: "Check NFC is on in settings, take the case off if it is metal or has a card holder in it, and hold the card flat against the top back of the phone for two full seconds rather than brushing it past. Android sometimes needs the screen unlocked. If it still will not fire, scan the QR code and tell us, because the chip may need reprogramming.",
  },
  {
    t: "My payment failed at checkout.",
    d: "What to try before ordering again.",
    cat: "Troubleshooting",
    body: "Bank debits sometimes fail when the app banking session has timed out. Close and reopen your banking app, then retry. If you were charged but the order did not go through, contact us with the reference number and we will either re-run it or refund you.",
  },
  {
    t: "My profile page will not load.",
    d: "Quick checks before reporting a problem.",
    cat: "Troubleshooting",
    body: "Try the link in a private window, and confirm you copied the whole link including the code at the end. If the profile is set to private, visitors will see nothing, which is expected. Still stuck? Send us the exact link and we will look at it.",
  },
  {
    t: "My card arrived damaged.",
    d: "Replacement process.",
    cat: "Troubleshooting",
    body: "Send us a photo of the card and your order number. Damaged or faulty cards are replaced free of charge, and the new one links to the same profile, so nothing needs reconfiguring.",
  },

  // Teams & Organizations
  {
    t: "What is a Team or Organization account?",
    d: "One brand across many profiles.",
    cat: "Teams & Organizations",
    body: "An organization links several people's profiles under a single company account. Your logo, colours and badge are applied automatically to every linked profile, so the whole team presents one consistent identity. It also covers associations such as chambers of commerce.",
  },
  {
    t: "How do I manage our team's profiles?",
    d: "Day-to-day admin, from your own dashboard.",
    cat: "Teams & Organizations",
    body: "Your assigned admin adds and removes members, updates job titles and approves badges directly from the Organization tab in their own dashboard. Everyday changes never need a support ticket.",
  },
  {
    t: "What happens when someone leaves?",
    d: "Offboarding and the profile link.",
    cat: "Teams & Organizations",
    body: "Removing a member unlinks their profile from your organization immediately. Any company-branded wallpaper applied to their profile is cleared at the same time, so there is no manual cleanup.",
  },
  {
    t: "Do all team profiles share our branding?",
    d: "How organisation styling applies.",
    cat: "Teams & Organizations",
    body: "Yes. Your organization logo and colours are applied across every linked profile and take precedence over an individual's own colour choices, so the team always looks like one brand.",
  },
];