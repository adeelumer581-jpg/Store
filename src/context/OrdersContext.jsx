import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { generateOrderId, findOrderByQuery } from '../lib/orderId.js';
import { calcTotals } from '../lib/pricing.js';
import { safeGet, safeSet, STORAGE_KEYS } from '../lib/storage.js';
import {
  enqueueOrderRetry,
  retryQueuedOrders,
  submitOrderToWebhook,
} from '../lib/orderService.js';
import { trackPurchase } from '../lib/analytics.js';

const OrdersContext = createContext(null);

function loadOrders() {
  const raw = safeGet(STORAGE_KEYS.ORDERS, []);
  return Array.isArray(raw) ? raw : [];
}

function ordersReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER': {
      const next = [action.order, ...state];
      safeSet(STORAGE_KEYS.ORDERS, next);
      return next;
    }
    case 'MARK_SYNCED': {
      const ids = new Set(action.ids);
      const next = state.map((o) => (ids.has(o.id) ? { ...o, synced: true } : o));
      safeSet(STORAGE_KEYS.ORDERS, next);
      return next;
    }
    default:
      return state;
  }
}

export function OrdersProvider({ children }) {
  const [orders, dispatch] = useReducer(ordersReducer, null, loadOrders);

  const runRetry = useCallback(async () => {
    const syncedIds = await retryQueuedOrders(orders);
    if (syncedIds.length > 0) {
      dispatch({ type: 'MARK_SYNCED', ids: syncedIds });
    }
  }, [orders]);

  useEffect(() => {
    runRetry();
    // Only run automatic retry once on mount using initial loaded orders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeOrder = useCallback(
    async (sanitizedCustomer, cartLines, promoCode) => {
      const totals = calcTotals(cartLines, promoCode);
      const id = generateOrderId(orders);
      const order = {
        id,
        createdAt: new Date().toISOString(),
        items: cartLines.map((line) => ({
          productId: line.productId,
          name: line.name,
          variantId: line.variantId,
          variantLabel: line.variantLabel,
          price: line.price,
          qty: line.qty,
        })),
        customer: {
          fullName: sanitizedCustomer.fullName,
          phone: sanitizedCustomer.phone,
          email: sanitizedCustomer.email,
        },
        address: {
          streetAddress: sanitizedCustomer.streetAddress,
          city: sanitizedCustomer.city,
          postalCode: sanitizedCustomer.postalCode,
        },
        paymentMethod: sanitizedCustomer.paymentMethod,
        totals,
        status: 'Order Placed',
        synced: false,
      };

      dispatch({ type: 'ADD_ORDER', order });
      trackPurchase(order);

      // Fire webhook sync without blocking order completion; enqueue retry on failure or unconfigured
      const result = await submitOrderToWebhook(order);
      if (result.synced) {
        dispatch({ type: 'MARK_SYNCED', ids: [order.id] });
        return { ...order, synced: true };
      } else {
        if (!result.skipped) {
          enqueueOrderRetry(order.id);
        }
        return order;
      }
    },
    [orders]
  );

  const getOrderByQuery = useCallback(
    (query) => findOrderByQuery(orders, query),
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderByQuery,
        retryUnsynced: runRetry,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return ctx;
}
