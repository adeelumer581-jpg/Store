import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';

const ToastContext = createContext(null);

function toastReducer(state, action) {
  switch (action.type) {
    case 'SHOW':
      return [...state.slice(-2), action.payload];
    case 'DISMISS':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    dispatch({ type: 'DISMISS', id });
  }, []);

  const showToast = useCallback(
    (message, tone = 'success') => {
      if (!message) return;
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      dispatch({ type: 'SHOW', payload: { id, message, tone } });
      const timer = setTimeout(() => {
        dismissToast(id);
      }, 2500);
      timersRef.current.set(id, timer);
    },
    [dismissToast]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
