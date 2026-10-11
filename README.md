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
`src/store.js` (localStorage), `placeOrder()` (PayMongo), `signIn()` (auth),
`AddressFields` (geo API), `/c/:code` (profile endpoint), contact form submit.

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

## Shipping and promos

Shipping follows the island group of the selected province: Metro Manila ₱99, Luzon ₱149,
Visayas ₱199, Mindanao ₱249. Promo codes `LINKODRA10` (10% off) and `FREESHIP` (free
shipping) apply on the review step. The checkout has a "simulate declined payment"
checkbox to exercise the failure path.

## Hosting in WordPress

1. `npm run build`
2. Upload `dist/` contents to `/wp-content/linkodra/`, host on a subdomain such as
   `cards.linkodra.ph`, or embed via an iframe/custom HTML block.
3. Hash routing means `dist/index.html` works as a static file without server config.

## Before launch

- Legal page text is placeholder and needs counsel-approved wording.
- The testimonial and the dashboard demo figures are invented.
- There is no product photography; the card is rendered as CSS/SVG artwork.
