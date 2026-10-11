# Linkodra PH — Smart NFC Business Cards (React frontend only)

Exact workflow clone of taplinkconnect.com, rebranded to **Linkodra PH** with your logo/colors:
- Black `#050705` + neon green `#22e948` / lime `#7cff00` gradient. No mistakes on palette.
- Logo recreated as SVG (L + NFC waves + Linkodra PH wordmark).

## Run
```
npm install
npm run dev     # http://localhost:5173
npm run build   # → dist/ (upload to WordPress)
```

## What’s included (all frontend mock, no backend)
- Home: hero “Your Business Card. Smarter.”, TAP CONNECT SHARE, live card + phone mock, tech, lineup, testimonial
- How It Works: Tap → Profile Loads → Save, iOS/Android/QR
- Features: 7 core + AI Scanner, Audience/Engagement, Offline vCard
- Pricing: Basic ₱699 / Standard ₱1399 / Pro ₱1999 + compare table + FAQ
- Order: 3-step wizard — 1 Configure (tier, live flip preview, landscape/portrait, 3 designs, matte/glossy, name/phone/logo) → 2 Your Details → 3 Review & Pay (QRPh/BPI/UBP mock, promo LINKODRA10, FREESHIP, simulate failure) → confirmation with linkodra.ph/CODE
- Login/Forgot (any input works, localStorage session) + Google button mock
- Dashboard: Profile editor, Analytics, Connections Hub + Send My Details, AI Scan upload, Refer & Earn with link, Org/Teams
- Public profile `/c/john`: Call/Message/Email/Location, socials, real .vcf Save Contact download, Connect button
- Help Center (24 articles, search + category), FAQ (12), Contact, About, Teams, 5 Legal pages
- Chat widget (Linkodra Assistant, 4 quick prompts), Cookie banner, responsive nav/footer

Hash routing (`#/order`, `#/c/john`…) so `dist/index.html` works as static file inside WordPress.

## Host in WordPress later
1. `npm run build`
2. Upload `dist/` contents via FTP to e.g. `/wp-content/linkodra/` or use “Custom HTML / iframe” / Redirection plugin pointing to hosted build.
3. Or: WP Dashboard → Pages → Add static block → upload `dist/assets/*`, paste `dist/index.html` body. Easiest: host dist on subdomain `cards.linkodra.ph` and link from WP menu.
4. Replace mocks: Order → PayMongo, Login → WP users / Firebase, Dashboard → REST API, `localStorage lk-*` keys are your integration points.

Promo codes in demo: `LINKODRA10` = 10% off, `FREESHIP` = free shipping.
