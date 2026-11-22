import test from 'node:test';
import assert from 'node:assert/strict';
import { calcTotals, formatPKR, validatePromoCode } from './pricing.js';
import { normalizePakistaniPhone, isValidPakistaniPhone } from './phone.js';
import { normalizeOrderIdQuery, generateOrderId, findOrderByQuery } from './orderId.js';
import { validateCheckoutForm, sanitizeCheckoutValues } from './validation.js';
import { getBundleSavings, getProductById, PRODUCTS } from '../data/products.js';
import { getEstimatedOrderStatus } from './orderService.js';

test('catalog contains all 5 products and computes Ritual Set savings dynamically', () => {
  assert.equal(PRODUCTS.length, 5);
  const bundle = getProductById('bb-ritual-bundle');
  assert.equal(getBundleSavings(bundle), 500);
});

test('pricing engine handles empty cart, threshold, and GLOW10 after-discount shipping rule', () => {
  const empty = calcTotals([], '');
  assert.deepEqual(
    { subtotal: empty.subtotal, discount: empty.discount, shipping: empty.shipping, total: empty.total },
    { subtotal: 0, discount: 0, shipping: 0, total: 0 }
  );

  const single = calcTotals([{ price: 1850, qty: 1 }], '');
  assert.equal(single.subtotal, 1850);
  assert.equal(single.shipping, 200);
  assert.equal(single.total, 2050);
  assert.equal(single.freeShippingRemaining, 1150);

  // PKR 3,200 subtotal with GLOW10 -> discount 320 -> afterDiscount 2,880 (< 3,000) -> shipping 200
  const edge = calcTotals([{ price: 3200, qty: 1 }], 'glow10 ');
  assert.equal(edge.discount, 320);
  assert.equal(edge.afterDiscount, 2880);
  assert.equal(edge.shipping, 200);
  assert.equal(edge.total, 3080);
  assert.equal(edge.appliedPromo, 'GLOW10');

  const overThreshold = calcTotals([{ price: 4450, qty: 1 }], 'GLOW10');
  assert.equal(overThreshold.discount, 445);
  assert.equal(overThreshold.afterDiscount, 4005);
  assert.equal(overThreshold.shipping, 0);
  assert.equal(overThreshold.total, 4005);
});

test('promo validation and PKR currency formatting', () => {
  assert.equal(validatePromoCode('glow10 ').valid, true);
  assert.equal(validatePromoCode('FOO').valid, false);
  assert.equal(formatPKR(1850), 'PKR 1,850');
  assert.equal(formatPKR(4450), 'PKR 4,450');
});

test('Pakistani phone validation and +92 normalization', () => {
  assert.equal(normalizePakistaniPhone('0300 1234567'), '+92 300 1234567');
  assert.equal(normalizePakistaniPhone('+92-300-1234567'), '+92 300 1234567');
  assert.equal(normalizePakistaniPhone('923001234567'), '+92 300 1234567');
  assert.equal(isValidPakistaniPhone('04001234567'), false);
  assert.equal(isValidPakistaniPhone('03001234'), false);
});

test('checkout validation enforces required fields, optional email, and 5-digit postal code', () => {
  const ok = validateCheckoutForm({
    fullName: 'Ayesha Khan',
    phone: '+92-300-1234567',
    email: '',
    streetAddress: 'House 22, Street 4, Phase 5 DHA',
    city: 'Lahore',
    postalCode: '54000',
  });
  assert.equal(ok.valid, true);

  const sanitized = sanitizeCheckoutValues({
    fullName: '  Ayesha Khan ',
    phone: '0300 1234567',
    email: ' ',
    streetAddress: ' House 22, Street 4, Phase 5 DHA ',
    city: 'Lahore',
    postalCode: '54000',
    paymentMethod: 'cod',
  });
  assert.equal(sanitized.phone, '+92 300 1234567');
  assert.equal(sanitized.fullName, 'Ayesha Khan');

  const bad = validateCheckoutForm({
    fullName: 'Al',
    phone: '04001234567',
    email: 'a@b',
    streetAddress: 'Street 1',
    city: 'Lahore',
    postalCode: '5440',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.fullName);
  assert.ok(bad.errors.phone);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.streetAddress);
  assert.ok(bad.errors.postalCode);
});

test('order ID generation, query normalization, and time-based status estimate', () => {
  const id = generateOrderId([{ id: 'BB-10000' }]);
  assert.match(id, /^BB-\d{5}$/);
  assert.equal(normalizeOrderIdQuery('#bb-20264 '), 'BB-20264');
  assert.equal(normalizeOrderIdQuery('20264'), 'BB-20264');
  assert.equal(findOrderByQuery([{ id: 'BB-20264' }], 'bb-20264')?.id, 'BB-20264');

  const base = Date.UTC(2026, 10, 21, 12, 0, 0);
  assert.equal(getEstimatedOrderStatus(new Date(base).toISOString(), base).label, 'Order Placed');
  assert.equal(
    getEstimatedOrderStatus(new Date(base - 3 * 3600 * 1000).toISOString(), base).label,
    'Confirmed'
  );
  assert.equal(
    getEstimatedOrderStatus(new Date(base - 80 * 3600 * 1000).toISOString(), base).label,
    'Delivered'
  );
});
