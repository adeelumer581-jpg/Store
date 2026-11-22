import { createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState, } from 'react';

import { getProductById, getVariantOrDefault } from '../data/products.js';
import { calcTotals, validatePromoCode } from '../lib/pricing.js';
import { safeGet, safeSet, STORAGE_KEYS } from '../lib/storage.js';
import { trackAddToCart } from '../lib/analytics.js';

const CartContext = createContext(null);

function makeLineKey(productId, variantId) {
  return `${productId}::${variantId}`;
}

/**
 * Rehydrates cart lines from storage, re-pricing every item against PRODUCTS
 * and silently dropping any line whose product or variant no longer exists.
 */
function hydrateCartFromStorage() {
  const saved = safeGet(STORAGE_KEYS.CART, null);
  if (!saved || typeof saved !== 'object') {
    return { lines: [], promoCode: '' };
  }

  const rawLines = Array.isArray(saved.lines) ? saved.lines : [];
  const hydratedLines = [];
  const seenKeys = new Set();

  for (const raw of rawLines) {
    const product = getProductById(raw?.productId);
    if (!product || !product.inStock) continue;

    const variant = product.variants.find((v) => v.id === raw?.variantId);
    if (!variant) continue;

    const key = makeLineKey(product.id, variant.id);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    const qty = Math.min(10, Math.max(1, Math.round(Number(raw?.qty) || 1)));
    hydratedLines.push({
      key,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      variantId: variant.id,
      variantLabel: variant.label,
      price: variant.price,
      qty,
    });
  }

  let promoCode = '';
  if (typeof saved.promoCode === 'string' && saved.promoCode.trim()) {
    const check = validatePromoCode(saved.promoCode);
    if (check.valid) promoCode = check.code;
  }

  return { lines: hydratedLines, promoCode };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, qty } = action.payload;
      const key = makeLineKey(product.id, variant.id);
      const existing = state.lines.find((line) => line.key === key);
      const addQty = Math.max(1, Math.min(10, Math.round(Number(qty) || 1)));

      let nextLines;
      if (existing) {
        nextLines = state.lines.map((line) =>
          line.key === key
            ? { ...line, price: variant.price, qty: Math.min(10, line.qty + addQty) }
            : line
        );
      } else {
        nextLines = [
          ...state.lines,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            variantId: variant.id,
            variantLabel: variant.label,
            price: variant.price,
            qty: addQty,
          },
        ];
      }
      return { ...state, lines: nextLines };
    }
    case 'UPDATE_QTY': {
      const { key, qty } = action.payload;
      const clamped = Math.round(Number(qty) || 0);
      if (clamped <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.key !== key) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.key === key ? { ...l, qty: Math.min(10, Math.max(1, clamped)) } : l
        ),
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        lines: state.lines.filter((l) => l.key !== action.key),
      };
    }
    case 'APPLY_PROMO': {
      return { ...state, promoCode: action.code };
    }
    case 'REMOVE_PROMO': {
      return { ...state, promoCode: '' };
    }
    case 'CLEAR_CART': {
      return { lines: [], promoCode: '' };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, hydrateCartFromStorage);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    safeSet(STORAGE_KEYS.CART, {
      lines: state.lines.map((l) => ({
        productId: l.productId,
        variantId: l.variantId,
        qty: l.qty,
      })),
      promoCode: state.promoCode,
    });
  }, [state]);

  const openDrawer = useCallback((triggerEl = null) => {
    if (triggerEl && typeof triggerEl.focus === 'function') {
      triggerRef.current = triggerEl;
    } else if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    const el = triggerRef.current;
    triggerRef.current = null;
    if (el && typeof el.focus === 'function') {
      setTimeout(() => {
        try {
          el.focus();
        } catch {
          // ignore detached element
        }
      }, 20);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setIsDrawerOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addItem = useCallback(
    (product, variantInput = null, qty = 1, options = {}) => {
      if (!product) return;
      const variant = variantInput || getVariantOrDefault(product, null);
      if (!variant) return;

      dispatch({
        type: 'ADD_ITEM',
        payload: { product, variant, qty },
      });
      trackAddToCart(product, variant, qty);

      if (options.openDrawer !== false) {
        openDrawer(options.triggerEl || null);
      }
    },
    [openDrawer]
  );

  const updateQty = useCallback((key, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { key, qty } });
  }, []);

  const removeItem = useCallback((key) => {
    dispatch({ type: 'REMOVE_ITEM', key });
  }, []);

  const applyPromo = useCallback((rawCode) => {
    const result = validatePromoCode(rawCode);
    if (!result.valid) {
      return result;
    }
    dispatch({ type: 'APPLY_PROMO', code: result.code });
    return result;
  }, []);

  const removePromo = useCallback(() => {
    dispatch({ type: 'REMOVE_PROMO' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totals = useMemo(() => calcTotals(state.lines, state.promoCode), [state.lines, state.promoCode]);

  const itemCount = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.qty, 0),
    [state.lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines: state.lines,
        promoCode: state.promoCode,
        totals,
        itemCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateQty,
        removeItem,
        applyPromo,
        removePromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
