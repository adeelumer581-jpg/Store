/**
 * Order ID generation, display formatting, and resilient query matching.
 * Format: "BB-XXXXX" (5 numeric digits), displayed to users as "#BB-XXXXX".
 */

export function generateOrderId(existingOrders = []) {
  const existingSet = new Set(
    (Array.isArray(existingOrders) ? existingOrders : []).map((o) =>
      String(o?.id || '').toUpperCase()
    )
  );

  let candidate = '';
  let attempts = 0;
  do {
    const num = Math.floor(10000 + Math.random() * 90000);
    candidate = `BB-${num}`;
    attempts += 1;
  } while (existingSet.has(candidate) && attempts < 200);

  return candidate;
}

/**
 * Normalizes inputs like "#bb-20264", "BB-20264", "bb 20264", or " 20264 "
 * into canonical "BB-20264". Returns empty string if input has no 5-digit core.
 */
export function normalizeOrderIdQuery(rawInput) {
  if (typeof rawInput !== 'string') return '';
  const cleaned = rawInput.trim().toUpperCase().replace(/^#+/, '').replace(/\s+/g, '');
  if (!cleaned) return '';

  const fiveDigitsMatch = cleaned.match(/^(?:BB-?)?(\d{5})$/);
  if (fiveDigitsMatch) {
    return `BB-${fiveDigitsMatch[1]}`;
  }
  return cleaned;
}

export function formatOrderIdDisplay(orderId) {
  const normalized = normalizeOrderIdQuery(String(orderId || ''));
  return normalized ? `#${normalized}` : '';
}

export function findOrderByQuery(orders = [], rawInput = '') {
  const normalized = normalizeOrderIdQuery(rawInput);
  if (!normalized || !Array.isArray(orders)) return null;
  return (
    orders.find((order) => String(order?.id || '').toUpperCase() === normalized) || null
  );
}
