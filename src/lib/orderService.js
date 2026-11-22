import { STORE_CONFIG } from '../config/store.js';
import { formatOrderIdDisplay } from './orderId.js';
import { formatPKR } from './pricing.js';
import { safeGet, safeSet, STORAGE_KEYS } from './storage.js';

const WEBHOOK_TIMEOUT_MS = 8000;

/**
 * Sends a newly placed order to STORE_CONFIG.ORDER_WEBHOOK_URL if configured.
 * Uses mode: 'no-cors' and Content-Type: text/plain;charset=utf-8 so Google Apps Script
 * receives the JSON body without CORS preflight failures.
 * Never throws or blocks the customer if the network or webhook fails.
 */
export async function submitOrderToWebhook(order) {
  const url = (STORE_CONFIG.ORDER_WEBHOOK_URL || '').trim();
  if (!url) {
    return { synced: false, skipped: true };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller
    ? setTimeout(() => {
        try {
          controller.abort();
        } catch {
          // ignore abort errors
        }
      }, WEBHOOK_TIMEOUT_MS)
    : null;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(order),
      signal: controller ? controller.signal : undefined,
    });
    return { synced: true, skipped: false };
  } catch {
    return { synced: false, skipped: false };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function enqueueOrderRetry(orderId) {
  const queue = safeGet(STORAGE_KEYS.RETRY_QUEUE, []);
  const next = Array.isArray(queue) ? [...queue] : [];
  if (!next.includes(orderId)) {
    next.push(orderId);
    safeSet(STORAGE_KEYS.RETRY_QUEUE, next);
  }
}

export function removeOrderFromRetryQueue(orderId) {
  const queue = safeGet(STORAGE_KEYS.RETRY_QUEUE, []);
  if (!Array.isArray(queue)) return;
  safeSet(
    STORAGE_KEYS.RETRY_QUEUE,
    queue.filter((id) => id !== orderId)
  );
}

/**
 * Retries any unsynced orders stored locally whenever the app loads or Confirmation opens.
 * Returns an array of order IDs that succeeded so state can update `synced: true`.
 */
export async function retryQueuedOrders(orders = []) {
  const url = (STORE_CONFIG.ORDER_WEBHOOK_URL || '').trim();
  if (!url) return [];

  const queue = safeGet(STORAGE_KEYS.RETRY_QUEUE, []);
  if (!Array.isArray(queue) || queue.length === 0) return [];

  const syncedIds = [];
  for (const orderId of queue) {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.synced) {
      removeOrderFromRetryQueue(orderId);
      continue;
    }
    const result = await submitOrderToWebhook(order);
    if (result.synced) {
      removeOrderFromRetryQueue(orderId);
      syncedIds.push(orderId);
    }
  }
  return syncedIds;
}

/**
 * Builds a plain wa.me URL with prefilled order summary so the owner receives every order
 * reliably on WhatsApp even when no webhook is configured.
 */
export function buildWhatsAppOrderUrl(order) {
  const number = (STORE_CONFIG.WHATSAPP_NUMBER || '').replace(/[^\d]/g, '');
  if (!order) {
    return `https://wa.me/${number}`;
  }

  const itemLines = (order.items || [])
    .map((item) => `• ${item.name} (${item.variantLabel}) x${item.qty} — ${formatPKR(item.price * item.qty)}`)
    .join('\n');

  const paymentLabel =
    order.paymentMethod === 'bank'
      ? 'Bank Transfer / Raast / JazzCash / EasyPaisa'
      : 'Cash on Delivery (COD)';

  const lines = [
    `Hello Bare & Bloom by Robaha! I just placed order ${formatOrderIdDisplay(order.id)}.`,
    '',
    '*Items:*',
    itemLines,
    '',
    `*Subtotal:* ${formatPKR(order.totals?.subtotal)}`,
  ];

  if (order.totals?.discount > 0) {
    lines.push(`*Discount (${order.totals.appliedPromo}):* -${formatPKR(order.totals.discount)}`);
  }

  lines.push(
    `*Shipping:* ${order.totals?.shipping === 0 ? 'FREE' : formatPKR(order.totals?.shipping)}`,
    `*Total:* ${formatPKR(order.totals?.total)}`,
    `*Payment:* ${paymentLabel}`,
    '',
    '*Delivery Details:*',
    `Name: ${order.customer?.fullName || ''}`,
    `Phone: ${order.customer?.phone || ''}`,
    `City: ${order.address?.city || ''} (${order.address?.postalCode || ''})`,
    `Address: ${order.address?.streetAddress || ''}`
  );

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildWhatsAppSupportUrl(orderIdQuery = '') {
  const number = (STORE_CONFIG.WHATSAPP_NUMBER || '').replace(/[^\d]/g, '');
  const cleanId = orderIdQuery ? formatOrderIdDisplay(orderIdQuery) : '';
  const message = cleanId
    ? `Hello Bare & Bloom by Robaha, I'd like to check the status of my order ${cleanId}.`
    : `Hello Bare & Bloom by Robaha, I have a question about an order.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const ORDER_TIMELINE_STEPS = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Out for Delivery',
  'Delivered',
];

/**
 * Time-based simulation of order fulfillment progress calculated from `createdAt`.
 * This is an estimate only when no live courier webhook is connected; UI explicitly informs
 * customers that status updates are estimates based on order time.
 */
export function getEstimatedOrderStatus(createdAtIso, nowMs = Date.now()) {
  const createdMs = Date.parse(createdAtIso);
  if (Number.isNaN(createdMs)) {
    return { activeIndex: 0, label: ORDER_TIMELINE_STEPS[0] };
  }
  const elapsedHours = Math.max(0, (nowMs - createdMs) / (1000 * 60 * 60));

  let activeIndex = 0;
  if (elapsedHours >= 72) {
    activeIndex = 4; // Delivered (~3+ days)
  } else if (elapsedHours >= 36) {
    activeIndex = 3; // Out for Delivery (1.5 - 3 days)
  } else if (elapsedHours >= 12) {
    activeIndex = 2; // Packed (12 - 36 hours)
  } else if (elapsedHours >= 2) {
    activeIndex = 1; // Confirmed (2 - 12 hours)
  }

  return {
    activeIndex,
    label: ORDER_TIMELINE_STEPS[activeIndex],
  };
}
