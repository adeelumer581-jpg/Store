import { STORE_CONFIG } from '../config/store.js';

/**
 * Formats integer rupees consistently across the entire storefront:
 * e.g. 1850 -> "PKR 1,850" (no decimals).
 */
export function formatPKR(amount) {
  const safeInt = Math.round(Number(amount) || 0);
  return `PKR ${safeInt.toLocaleString('en-PK')}`;
}

export function normalizePromoCode(rawCode) {
  if (typeof rawCode !== 'string') return '';
  return rawCode.trim().toUpperCase();
}

export function validatePromoCode(rawCode) {
  const normalized = normalizePromoCode(rawCode);
  if (!normalized) {
    return { valid: false, code: '', promo: null, error: 'Please enter a promo code.' };
  }
  const promo = STORE_CONFIG.PROMO_CODES[normalized] || null;
  if (!promo) {
    return { valid: false, code: '', promo: null, error: 'That promo code is not valid.' };
  }
  return { valid: true, code: promo.code, promo, error: '' };
}

/**
 * Single authoritative pricing engine used by CartDrawer, Checkout, Confirmation,
 * and stored Orders so totals can never disagree.
 *
 * Rules:
 * - subtotal = sum(price * qty) in integer rupees
 * - discount = Math.round(subtotal * 0.10) when GLOW10 is applied, else 0
 * - afterDiscount = subtotal - discount
 * - shipping = 0 if cart is empty or afterDiscount >= 3000, else 200
 * - total = afterDiscount + shipping
 */
export function calcTotals(lines = [], promoCode = '') {
  const safeLines = Array.isArray(lines) ? lines : [];
  const subtotal = safeLines.reduce((sum, line) => {
    const price = Math.round(Number(line?.price) || 0);
    const qty = Math.max(0, Math.round(Number(line?.qty) || 0));
    return sum + price * qty;
  }, 0);

  const normalizedPromo = normalizePromoCode(promoCode);
  const promoObj = normalizedPromo ? STORE_CONFIG.PROMO_CODES[normalizedPromo] : null;

  let discount = 0;
  let appliedPromo = '';
  if (subtotal > 0 && promoObj && promoObj.type === 'percent') {
    discount = Math.round(subtotal * (promoObj.value / 100));
    appliedPromo = promoObj.code;
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const threshold = STORE_CONFIG.FREE_SHIPPING_THRESHOLD;
  const isEmpty = subtotal === 0;
  const freeShippingUnlocked = !isEmpty && afterDiscount >= threshold;
  const shipping = isEmpty || freeShippingUnlocked ? 0 : STORE_CONFIG.FLAT_SHIPPING_RATE;
  const freeShippingRemaining = isEmpty ? threshold : Math.max(0, threshold - afterDiscount);
  const total = afterDiscount + shipping;
  const progressPercent = isEmpty
    ? 0
    : Math.min(100, Math.round((afterDiscount / threshold) * 100));

  return {
    subtotal,
    discount,
    appliedPromo,
    afterDiscount,
    shipping,
    total,
    freeShippingThreshold: threshold,
    freeShippingUnlocked,
    freeShippingRemaining,
    progressPercent,
  };
}
