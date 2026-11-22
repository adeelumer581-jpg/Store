/**
 * Safe storage wrapper with an in-memory Map fallback for Instagram/Facebook
 * in-app browsers or privacy modes where localStorage can throw or be disabled.
 */

const memoryFallback = new Map();

export const STORAGE_KEYS = {
  CART: 'bb:v1:cart',
  ORDERS: 'bb:v1:orders',
  RETRY_QUEUE: 'bb:v1:retry_queue',
};

function getLocalStorageSafely() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__bb_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function safeGet(key, defaultValue = null) {
  try {
    const ls = getLocalStorageSafely();
    const raw = ls ? ls.getItem(key) : memoryFallback.get(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    // Discard corrupt JSON cleanly instead of crashing the storefront
    safeRemove(key);
    return defaultValue;
  }
}

export function safeSet(key, value) {
  try {
    const serialized = JSON.stringify(value);
    memoryFallback.set(key, serialized);
    const ls = getLocalStorageSafely();
    if (ls) {
      ls.setItem(key, serialized);
    }
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key) {
  try {
    memoryFallback.delete(key);
    const ls = getLocalStorageSafely();
    if (ls) {
      ls.removeItem(key);
    }
    return true;
  } catch {
    return false;
  }
}
