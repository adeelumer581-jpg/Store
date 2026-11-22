# Contributing to Bare & Bloom by Robaha Storefront

## Ground rules

- The pricing engine in `src/lib/pricing.js` is the **single source of truth** for money math. Cart, checkout, confirmation, and stored orders must all derive totals from `calcTotals()` — never recompute totals in a component.
- Catalog data lives only in `src/data/products.js`; store policies only in `src/config/store.js`. The AI concierge grounds itself from these files at request time — do not hardcode catalog data elsewhere (including prompts).
- All customer-facing code must tolerate Instagram/Facebook in-app browsers: resilient storage (`src/lib/storage.js`), clipboard fallback, `16px+` form inputs, safe-area insets.

## Workflow

1. Branch from `main`: `git checkout -b feat/<short-name>` (or `fix/`, `chore/`).
2. Keep changes scoped; the PR template's verification checklist must all pass.
3. Open a PR; CI (lint, typecheck, unit tests, production build, server boot) must be green.
4. Squash-merge to `main` after review.

## Local checks

```bash
npm run check   # lint + typecheck + test + build in one go
```

## Environment

Copy `.env.example` to `.env` for local server development (`GEMINI_API_KEY`, `PORT`). Never commit `.env`.

## Placeholder data before launch

Search for `Placeholder` across `src/config/store.js` (payment accounts), WhatsApp number, and `sample: true` reviews in `src/data/products.js`. See the README pre-launch checklist.
