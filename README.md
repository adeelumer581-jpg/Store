# Bare & Bloom by Robaha | Skincare Storefront

A mobile-first, Instagram and Facebook in-app browser optimized e-commerce storefront for **Bare & Bloom by Robaha**, built with React, Vite, Tailwind CSS, and self-hosted `@fontsource` typography.

## Features

- **In-App Browser Ready**: Hash routing (`#/`), safe-area insets, `100dvh` with `100vh` fallback, iOS body scroll lock, `16px+` form inputs, clipboard fallback (`navigator.clipboard` + `execCommand('copy')` + selectable text), resilient storage wrapper with in-memory fallback, and inline SVG product packaging visuals.
- **Authoritative PKR Pricing Engine**: Unified `calcTotals()` in `src/lib/pricing.js` powering the Cart Drawer, Checkout, Order Confirmation, and saved orders. Supports `GLOW10` (10% off merchandise subtotal) and free nationwide shipping at `PKR 3,000` (computed after discount), otherwise flat `PKR 200`.
- **Pakistani Checkout & Order Receiving**: Validates and normalizes `+92 3XX XXXXXXX` mobile numbers, 5-digit postal codes, optional email, Cash on Delivery (default), and Bank Transfer / Raast / JazzCash / EasyPaisa placeholder instructions. Generates unique `#BB-XXXXX` order IDs, sends orders to an optional Google Apps Script webhook with offline retry queue, and provides a one-tap **Confirm your order on WhatsApp** link.
- **Order Tracking**: Local lookup by `#BB-XXXXX`, `BB-XXXXX`, or `XXXXX` with estimated fulfillment timeline (`Order Placed` -> `Confirmed` -> `Packed` -> `Out for Delivery` -> `Delivered`).
- **AI Skincare Concierge**: Floating chat widget (`src/components/Concierge.jsx`) backed by a server-side Gemini endpoint (`server/index.js`, `POST /api/chat`). The concierge grounds itself in the live product catalog and store policies at request time — prices and shipping rules in its answers always match the storefront. When the app is hosted as static files (no server) or the API key is missing, the widget degrades gracefully and points customers to the WhatsApp concierge.

## Repository Quality Automation

- **CI (GitHub Actions)**: every push and PR runs `lint` (ESLint 9 flat config), `typecheck` (TypeScript), unit tests (node:test via tsx, including server contract tests), a production build, and a server boot smoke test.
- **One-shot local gate**: `npm run check` runs lint + typecheck + test + build exactly as CI does.
- **Formatting**: Prettier (`npm run format`); React 19 automatic JSX runtime — no `import React` needed.

## Pre-Launch Owner Checklist

Before sharing your store link on Instagram or Facebook, review and update:

1. **`src/config/store.js`**:
   - Set `WHATSAPP_NUMBER` (`923XXXXXXXXX` format) and confirm `INSTAGRAM_URL`.
   - Replace placeholder `PAYMENT_ACCOUNTS` (Account Title, Bank/Raast IBAN, JazzCash, EasyPaisa) if accepting prepaid transfers.
   - Confirm `TRUST_BADGES` (`100% Halal`, `Dermatologist Tested`, `Cruelty-Free`, `Made for Pakistani Climate`).
   - Add your deployed Google Apps Script URL to `ORDER_WEBHOOK_URL` (see `docs/order-webhook-setup.md`).
   - Optionally add your `META_PIXEL_ID` and update `SITE_URL`.
2. **`src/data/products.js`**:
   - Confirm the 50ml Vitamin C Serum placeholder price (`PKR 2,650`).
   - Replace the `sample: true` reviews with verified customer reviews.
   - Optionally drop real product photo URLs into each product's `images[].src` array.
3. **`/public` & `/src/assets`**:
   - Replace `/public/favicon.png` and `/public/og-image.jpg` (1200x630) with your final brand assets, and update `index.html` canonical `og:url` / `og:image` URLs.
   - Update `/src/assets/logo.png` if you wish to swap the botanical logo image.

## Local Development & Build

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Run unit tests (pricing/validation logic + server contracts)
npm test

# Build production bundle into /dist
npm run build

# Serve the built storefront + AI concierge locally
cp .env.example .env   # add your GEMINI_API_KEY
npm start              # Express server on :3000 (serves dist/ + POST /api/chat)
```

## Static Hosting Deployment (`/dist`)

Because this storefront uses hash routing (`#/`), **no server-side URL rewrites are required**:

- **Netlify**: Drag and drop the `dist/` folder into Netlify Drop, or set build command `npm run build` and publish directory `dist`.
- **Vercel**: Import repository, framework preset `Vite`, build command `npm run build`, output directory `dist`.
- **Cloudflare Pages**: Build command `npm run build`, build output directory `dist`.

## Testing in Instagram & Facebook In-App Browsers

1. Deploy `dist/` to an HTTPS URL (Netlify, Vercel, or Cloudflare Pages).
2. Send the deployed `https://` link to your own account via Instagram Direct Message and Facebook Messenger.
3. Open the link directly from inside the Instagram and Facebook mobile apps on Android and iPhone to verify:
   - Smooth drawer and mobile menu scrolling without background page bounce.
   - Zero zoom when tapping checkout fields.
   - Clipboard copy fallback and WhatsApp deep link handoff.
