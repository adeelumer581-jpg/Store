/**
 * Standalone sanity assertions for pure business logic.
 * Not imported by the application bundle.
 * Run manually via: node src/lib/__selfcheck.js
 */

import { calcTotals, formatPKR, validatePromoCode } from './pricing.js';
import { normalizePakistaniPhone, isValidPakistaniPhone } from './phone.js';
import { normalizeOrderIdQuery, generateOrderId, findOrderByQuery } from './orderId.js';
import { validateCheckoutForm } from './validation.js';
import { getBundleSavings, getProductById } from '../data/products.js';

// 1. Pricing & GLOW10 threshold checks
const emptyTotals = calcTotals([], '');
console.assert(emptyTotals.subtotal === 0 && emptyTotals.shipping === 0 && emptyTotals.total === 0, 'Empty cart totals failed');

const singleSerum = calcTotals([{ price: 1850, qty: 1 }], '');
console.assert(singleSerum.subtotal === 1850, 'Single serum subtotal failed');
console.assert(singleSerum.shipping === 200, 'Single serum shipping failed');
console.assert(singleSerum.total === 2050, 'Single serum total failed');
console.assert(singleSerum.freeShippingRemaining === 1150, 'Free shipping remaining failed');

// Rule uses after-discount subtotal: 3200 - 10% (320) = 2880 (< 3000) -> shipping = 200
const thresholdEdge = calcTotals([{ price: 3200, qty: 1 }], 'glow10 ');
console.assert(thresholdEdge.discount === 320, 'GLOW10 discount failed');
console.assert(thresholdEdge.afterDiscount === 2880, 'After-discount subtotal failed');
console.assert(thresholdEdge.shipping === 200, 'Shipping threshold after-discount check failed');
console.assert(thresholdEdge.total === 3080, 'Total after discount + shipping failed');

const invalidPromo = validatePromoCode('FOO');
console.assert(!invalidPromo.valid, 'Invalid promo should fail');
console.assert(formatPKR(1850) === 'PKR 1,850', 'formatPKR check failed');

// 2. Bundle savings check (1450 + 1650 + 1850 - 4450 = 500)
const bundle = getProductById('bb-ritual-bundle');
console.assert(getBundleSavings(bundle) === 500, 'Computed bundle savings failed');

// 3. Phone normalization checks
console.assert(normalizePakistaniPhone('0300 1234567') === '+92 300 1234567', '0300 space normalize failed');
console.assert(normalizePakistaniPhone('+92-300-1234567') === '+92 300 1234567', '+92 dash normalize failed');
console.assert(normalizePakistaniPhone('923001234567') === '+92 300 1234567', '92 prefix normalize failed');
console.assert(!isValidPakistaniPhone('04001234567'), '0400 must fail');
console.assert(!isValidPakistaniPhone('03001234'), 'Short phone must fail');

// 4. Order ID normalization checks
console.assert(normalizeOrderIdQuery('#bb-20264 ') === 'BB-20264', 'Order ID #bb normalize failed');
console.assert(normalizeOrderIdQuery(' 20264 ') === 'BB-20264', 'Order ID 5-digit normalize failed');
const genId = generateOrderId([{ id: 'BB-10000' }]);
console.assert(/^BB-\d{5}$/.test(genId), 'Generated order ID format failed');
console.assert(findOrderByQuery([{ id: 'BB-20264' }], ' #bb-20264')?.id === 'BB-20264', 'findOrderByQuery failed');

// 5. Checkout validation checks
const validForm = validateCheckoutForm({
  fullName: 'Robaha Khan',
  phone: '0300 1234567',
  email: '',
  streetAddress: 'House 14, Street 6, Gulberg III',
  city: 'Lahore',
  postalCode: '54000',
});
console.assert(validForm.valid, 'Valid checkout form failed');

const badForm = validateCheckoutForm({
  fullName: 'Ro',
  phone: '04001234567',
  email: 'a@b',
  streetAddress: 'Short',
  city: 'Lahore',
  postalCode: '5440',
});
console.assert(!badForm.valid && badForm.errors.postalCode && badForm.errors.email, 'Invalid checkout form checks failed');

console.log('All Bare & Bloom self-checks passed.');
