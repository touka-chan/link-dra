# Linkodra PH — Smart NFC Business Cards (React frontend)

Smart NFC business cards for the Philippine market. Black `#050705` with neon green
`#22e948`, logo recreated as SVG. Frontend only — every data flow is simulated in the
browser so the real product can be reviewed before any backend work starts.

## Run

```
npm install
npm run dev     # http://localhost:5173
npm run build   # → dist/ (upload to WordPress)
npm run lint    # oxlint
npm run gen:geo # regenerate the Philippine address dataset
```

## Pages

| Route | What it does |
|---|---|
| `#/` | Home: hero, live card, tap flow, technology, tiers, testimonial |
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

**Philippine addresses.** `src/data/geo.js` is generated, never hand-edited. It holds 83
provinces, 1,617 cities and 40,746 barangays (~540 KB raw), derived from the PSA PSGC via
the `psgc` package. Two things worth knowing:

- The hierarchy is built from the barangay table, not joined against the municipality
  table. The two use different spellings for the same place (`City Of Vigan Capital` vs
  `Vigan City`), and joining drops 352 large cities.
- Provinces carry an island group so shipping zones are derived from the address rather
  than hardcoded per province.

The file is a separate chunk loaded only when checkout reaches step 2, so the landing
page stays at ~101 kB gzipped. Regenerate with `npm run gen:geo` (province codes are
cached in `scripts/psgc-provinces.json`, so regeneration works offline).

**Tier gating.** `src/brand.js` is the single source of truth for pricing, feature
matrices, shipping zones and promo codes, so marketing pages, checkout and dashboard
cannot drift apart. Locked features render as real UI with an upgrade prompt.

**Backend seams.** Six contained points, all frontend for now:
`src/store.js` (localStorage), `placeOrder()` (PayMongo), `signIn()` (auth),
`AddressFields` (geo API), `/c/:code` (profile endpoint), contact form submit.

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

Legal page text is placeholder and needs counsel-approved wording before launch.