import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogContext, buildSystemInstruction } from './catalogContext.js';
import { PRODUCTS } from '../src/data/products.js';
import { STORE_CONFIG } from '../src/config/store.js';

test('catalog context lists every product with its real variant prices', () => {
  const context = buildCatalogContext();
  for (const product of PRODUCTS) {
    assert.ok(context.includes(product.name), `missing product ${product.name}`);
    for (const variant of product.variants) {
      assert.ok(
        context.includes(`PKR ${variant.price}`),
        `missing price ${variant.price} for ${product.name}`,
      );
    }
  }
});

test('system instruction embeds store policies and stays within a sane token budget', () => {
  const instruction = buildSystemInstruction();
  assert.ok(instruction.includes(`PKR ${STORE_CONFIG.FLAT_SHIPPING_RATE}`));
  assert.ok(instruction.includes(`PKR ${STORE_CONFIG.FREE_SHIPPING_THRESHOLD}`));
  assert.ok(instruction.includes(STORE_CONFIG.DELIVERY_DAYS));
  // Rough budget guard: ~4 chars per token; catalog of 5 products must stay well under 4k tokens.
  assert.ok(instruction.length < 16000, `instruction too long: ${instruction.length} chars`);
});
