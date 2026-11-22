import { Check, AlertCircle, X } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  const { isDrawerOpen } = useCart();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-32px)] max-w-md"
      style={{
        bottom: isDrawerOpen
          ? 'calc(204px + env(safe-area-inset-bottom, 0px))'
          : 'calc(88px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {toasts.map((toast) => {
        const isError = toast.tone === 'error';
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 shadow-drawer border text-[13px] font-semibold ${
              isError
                ? 'bg-[#FFDAD6] text-[#BA1A1A] border-[#BA1A1A]/25'
                : 'bg-[#2D3830] text-white border-[#2D3830]'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <Check className="w-4 h-4 shrink-0 text-[#DCE4DC]" aria-hidden="true" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-1 p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
