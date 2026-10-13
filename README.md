# Linkodra PH — Smart NFC Business Cards (React frontend)

Smart NFC business cards for the Philippine market. Near-black `#080d0a` with neon
green `#22e948`, logo recreated as SVG. Frontend only — every data flow is simulated in
the browser so the real product can be reviewed before any backend work starts.

## Run

```
npm install
npm run dev     # http://localhost:5173
npm run build   # → dist/ (upload to WordPress)
npm run lint    # oxlint
npm run gen:geo # regenerate the Philippine address dataset
```

## Design system

The visual language is a restyle of the product, not a coat of paint: layout, container
placement, type hierarchy and spacing follow a reference build, while the name, palette,
copy, logo and routes stay Linkodra's own.

**Typography.** Poppins, self-hosted as five latin woff2 weights in `public/fonts`
(38 KB total). It is a geometric sans, which the reference uses; the fallback chain is
`system-ui, Segoe UI, Roboto, Arial`.

**Spacing.** A two-tier scale, and the second tier exists for a reason. The macro scale
`--sp-1…--sp-12` runs 4 → 128px for page and section rhythm. It jumps 4 to 8 and 16 to
24, which leaves no room for the 6, 10, 14, 18 and 22 that padding inside buttons, chips
and cards actually calls for, so those are `--in-1…--in-5`. Every token holds the exact
value it replaced, which makes the scale tokenisation rather than restyling —
`scripts/verify-tokens.mjs` proves it by resolving all 286 spacing declarations and
diffing them against `HEAD`.

**Container.** `--shell: 1280px`, plus `--band` for section rhythm and `--headline`
(`clamp(38px, 3.6vw, 72px)`) so the hero type tracks the viewport.

## Pages

20 routes.

| Route | What it does |
|---|---|
| `#/` | Home: hero, live card, technology, tiers, testimonial |
| `#/how-it-works` | Tap → profile loads → save contact, device support |
| `#/features` | 7 core features, Standard/Pro exclusives, analytics breakdown |
| `#/pricing` | 3 tiers, 10-row compare table, FAQ |
| `#/order` | 3-step wizard: configure → details → review and pay |
| `#/login`, `#/forgot-password` | Sign in, password reset |
| `#/dashboard` | Profile, analytics, connections, AI scan, referrals, organization |
| `#/c/john` | Public profile: actions, vCard download, Connect capture |
| `#/help-center` | 47 articles, 9 categories, search and sorting |
| `#/faq` | 37 questions across 6 groups |
| `#/about`, `#/teams`, `#/contact`, `#/coming-soon` | Company pages |
| `#/legal/*` | privacy, terms, cookies, shipping, dispute |

## Notable implementation details

**Themes.** Every colour resolves through CSS variables on `:root`, so dark and light are
one attribute change on `<html>`. `src/theme.js` is a tiny external store read through
`useSyncExternalStore` — deliberately no Provider component, so files that export
components stay fast-refresh clean.

The palette is scoped to `:root[data-theme]`, which means a bare `<html>` has no `--bg`
and no `--panel` at all. It is not "dark by default", it is undefined. So the attribute is
painted at module load in `theme.js`, before React mounts, not from an effect: effects run
after the browser has already painted, which left the first frame unthemed and any
JS-decided ink out of step with the CSS behind it.

For the same reason, nothing picks a colour in JavaScript. The nav wordmark used to take a
`dark` prop and choose `#ffffff` or `#050705` while `.wordmark` already resolved
`var(--text)` from CSS — two sources of truth that disagreed on exactly that frame.

**Philippine addresses.** `src/data/geo.js` is generated, never hand-edited. It holds 83
provinces, 1,617 cities and 40,746 barangays (~540 KB raw), derived from the PSA PSGC via
the `psgc` package. Two things worth knowing:

- The hierarchy is built from the barangay table, not joined against the municipality
  table. The two use different spellings for the same place (`City Of Vigan Capital` vs
  `Vigan City`), and joining drops 352 large cities.
- Provinces carry an island group so shipping zones are derived from the address rather
  than hardcoded per province.

The file is a separate chunk loaded only when checkout reaches step 2, so the landing
page stays at ~114 kB gzipped (0.4 kB HTML + 9.1 kB CSS + 104.8 kB JS); the geo chunk is
another 188 kB gzipped and never touches the first paint. Regenerate with
`npm run gen:geo` (province codes are cached in `scripts/psgc-provinces.json`, so
regeneration works offline).

**Tier gating.** `src/brand.js` is the single source of truth for pricing, feature
matrices, shipping zones and promo codes, so marketing pages, checkout and dashboard
cannot drift apart. Locked features render as real UI with an upgrade prompt.

**Profile visibility.** The dashboard profile editor has a public/private switch, and
`PublicProfile` gates on it — a private profile renders a notice instead of the name,
contact actions, socials and vCard download. It defaults to public, which is what makes a
tapped card work; the four places in the help centre, FAQ and privacy policy that promise
the control are only true because of it.

**Backend seams.** Six contained points, all frontend for now:
`src/store.js` (localStorage), `placeOrder()` (order record with receipt proof),
`src/receipt.js` + `PayModal` (manual QR + receipt OCR), `AddressFields` (geo API),
`/c/:code` (profile endpoint), contact form submit.

## Verification

Two scripts exist to catch things review-by-eye misses.

`scripts/shots.mjs` captures full-page screenshots through headless Chrome at 1440 / 768
/ 390 in both themes. It pins `prefers-color-scheme` and uses a separate browser profile
per theme, because the sweep was otherwise capturing whatever the OS defaulted to. It
also doubles the window and device scale factor below 520px: Chrome on Windows refuses
narrower windows, lays out wider than requested and still writes the small image, so a
390px capture comes back *cropped* rather than rendered — indistinguishable from a layout
overflow bug, and it sent me chasing CSS that was never broken.

```
node scripts/shots.mjs --theme=dark
node scripts/shots.mjs --theme=light --only=home
```

The in-app browser panel is not a substitute: it renders narrower than the viewport it
reports, so `vw` units and media queries resolve against the wrong width.

## Manual QR payment and receipt scanning

Step 1's Continue shows a spinner, then a modal with the static payment QR from
`public/qr.png` (drop your GCash QR there under exactly that name). The buyer
pays the exact tier amount manually, uploads the e-wallet receipt screenshot,
and a free in-browser OCR pass (tesseract.js, no API key) reads the reference
number and amount. Both fields stay editable, the receipt must show at least 9
reference digits, and the scanned amount must match the tier price to the
centavo before Confirm unlocks. Confirming shows a SweetAlert success dialog
(lazy-loaded, dark themed to match the site), then continues to step 2. The
proof (ref, amount, filename) travels with the order into review and the
confirmation screen.

Scrollbars are hidden site-wide via CSS (`scrollbar-width: none` +
`::-webkit-scrollbar`) while wheel / touch / keyboard scrolling keeps working.

`scripts/test-receipt.mjs` covers the parser against GCash / Maya / noisy
samples: `node scripts/test-receipt.mjs`.

## Confirmation emails (free)

Browsers cannot speak SMTP directly, and your app password must NEVER go into
code or git (public repo + view-source = anyone could send mail as you). Two
free options, auto-detected from `src/mail-config.js`:

**Option B - Gmail SMTP via SecureToken (no password in code).**
1. Google Account > Security > turn on 2-Step Verification.
2. Security > App passwords > create one (e.g. "Linkodra") > copy the
   16-letter password. If it was ever pasted anywhere public, revoke it there
   and make a fresh one.
3. Go to https://smtpjs.com > "Encrypt your SMTP credentials": host
   `smtp.gmail.com`, port `587`, your Gmail + the app password. Optionally
   lock the token to your domain.
4. Paste ONLY the SecureToken into `src/mail-config.js`, rebuild.

**Option A - EmailJS (no password involved at all).**
1. Free account at https://www.emailjs.com
2. Add an Email Service, connect your Gmail (this is the SMTP part).
3. New Email Template using these variables: `{{to_name}}` `{{tier_name}}`
   `{{amount}}` `{{ref_no}}` `{{order_email}}`. Suggested body: greeting,
   "your payment for the {{tier_name}} card ({{amount}}, ref {{ref_no}}) is
   verified", and what happens next (profile link, delivery estimate).
4. Paste the Service ID, Template ID and Public Key into `src/mail-config.js`,
   rebuild. Never put a password or app password in the repo.

## Shipping and promos

Shipping follows the island group of the selected province: Metro Manila ₱99, Luzon ₱149,
Visayas ₱199, Mindanao ₱249. Promo codes `LINKODRA10` (10% off) and `FREESHIP` (free
shipping) apply on the review step. The QR receipt covers the card price; any shipping
balance is shown on review and settled on delivery arrangement.

## Hosting in WordPress

1. `npm run build`
2. Upload `dist/` contents to `/wp-content/linkodra/`, host on a subdomain such as
   `cards.linkodra.ph`, or embed via an iframe/custom HTML block.
3. Hash routing means `dist/index.html` works as a static file without server config.

## Before launch

- Legal page text is placeholder and needs counsel-approved wording.
- The testimonial and the dashboard demo figures are invented.
- There is no product photography; the card is rendered as CSS/SVG artwork.
