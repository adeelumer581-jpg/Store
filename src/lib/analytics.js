import { STORE_CONFIG } from '../config/store.js';

/**
 * Optional Meta Pixel integration.
 * Remains strictly a no-op and loads zero external scripts when STORE_CONFIG.META_PIXEL_ID is empty.
 */

let pixelInitialized = false;

function ensurePixelLoaded() {
  const pixelId = (STORE_CONFIG.META_PIXEL_ID || '').trim();
  if (!pixelId || typeof window === 'undefined') return false;

  try {
    if (!window.fbq) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(t, s);
        }
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    if (!pixelInitialized) {
      window.fbq('init', pixelId);
      pixelInitialized = true;
    }
    return true;
  } catch {
    return false;
  }
}

function safeFbq(eventType, eventName, params) {
  try {
    if (!ensurePixelLoaded() || typeof window.fbq !== 'function') return;
    if (params) {
      window.fbq(eventType, eventName, params);
    } else {
      window.fbq(eventType, eventName);
    }
  } catch {
    // Analytics must never interrupt storefront behavior
  }
}

export function trackPageView() {
  safeFbq('track', 'PageView');
}

export function trackViewContent(product, price) {
  if (!product) return;
  safeFbq('track', 'ViewContent', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: price,
    currency: 'PKR',
  });
}

export function trackAddToCart(product, variant, qty = 1) {
  if (!product || !variant) return;
  safeFbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids: [`${product.id}:${variant.id}`],
    content_type: 'product',
    value: variant.price * qty,
    currency: 'PKR',
  });
}

export function trackInitiateCheckout(totals, itemCount) {
  safeFbq('track', 'InitiateCheckout', {
    num_items: itemCount,
    value: totals?.total || 0,
    currency: 'PKR',
  });
}

export function trackPurchase(order) {
  if (!order) return;
  safeFbq('track', 'Purchase', {
    value: order.totals?.total || 0,
    currency: 'PKR',
    order_id: order.id,
  });
}
