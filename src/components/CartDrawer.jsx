import { useEffect, useRef } from 'react';

import { Trash2, X, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { getProductById, getVariantOrDefault } from '../data/products.js';
import { formatPKR } from '../lib/pricing.js';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock.js';
import { navigate } from '../router/hashRouter.js';
import ProductVisual from './ProductVisual.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import PromoInput from './PromoInput.jsx';

export default function CartDrawer() {
  const {
    lines,
    totals,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    updateQty,
    removeItem,
  } = useCart();

  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    lockBodyScroll();

    // Move keyboard focus inside the drawer on open
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      unlockBodyScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    if (lines.length === 0) return;
    closeDrawer();
    navigate('#/checkout');
  };

  const handleContinueShopping = () => {
    closeDrawer();
    navigate('#/shop');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className="fixed inset-0 bg-[#232924]/40 transition-opacity"
      />

      {/* Slide-over panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
        className="relative z-10 w-full max-w-[440px] bg-white h-screen-safe shadow-drawer flex flex-col"
      >
        {/* Header */}
        <div className="px-5 md:px-6 py-4 border-b border-[#8FA391]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-[24px] leading-[30px] text-[#232924]">
              Your Bag
            </h2>
            <span className="text-[13px] font-semibold text-[#5C665E] tabular-nums">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close shopping bag"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full text-[#232924] hover:bg-[#F0EDE6] active:bg-[#DCE4DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="px-5 md:px-6 py-3.5 bg-[#FBF9F6] border-b border-[#8FA391]/20">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#2D3830] mb-2">
            <Truck className="w-4 h-4 shrink-0" aria-hidden="true" />
            {totals.freeShippingUnlocked ? (
              <span>You&apos;ve unlocked free shipping</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatPKR(totals.freeShippingRemaining)}</strong> more for free shipping
              </span>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-[#DCE4DC] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2D3830] transition-all duration-300"
              style={{ width: `${totals.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto px-5 md:px-6 py-5"
          style={{ overscrollBehavior: 'contain' }}
        >
          {lines.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#F0EDE6] flex items-center justify-center text-[#5C665E] mb-4">
                <ShoppingBag className="w-7 h-7" strokeWidth={1.6} />
              </div>
              <h3 className="font-serif text-[22px] text-[#232924] mb-2">
                Your bag is empty
              </h3>
              <p className="text-[14px] text-[#5C665E] max-w-xs mb-6">
                Explore gentle, barrier-first skincare crafted for Pakistani skin &amp; climate.
              </p>
              <button
                type="button"
                onClick={handleContinueShopping}
                className="rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold px-7 py-3.5 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <ul className="divide-y divide-[#8FA391]/20">
                {lines.map((line) => {
                  const product = getProductById(line.productId);
                  const variant = getVariantOrDefault(product, line.variantId);
                  return (
                    <li key={line.key} className="py-4 first:pt-0 flex gap-4">
                      <a
                        href={`#/product/${line.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          closeDrawer();
                          navigate(`#/product/${line.slug}`);
                        }}
                        className="w-20 h-24 rounded-[12px] overflow-hidden bg-[#F0EDE6] shrink-0 border border-[#8FA391]/15"
                      >
                        <ProductVisual product={product} variant={variant} view="front" />
                      </a>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={`#/product/${line.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                closeDrawer();
                                navigate(`#/product/${line.slug}`);
                              }}
                              className="font-serif text-[17px] leading-[22px] font-medium text-[#232924] hover:underline underline-offset-4"
                            >
                              {line.name}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeItem(line.key)}
                              aria-label={`Remove ${line.name} (${line.variantLabel})`}
                              className="p-2 -mr-2 -mt-1 rounded-full text-[#5C665E] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[13px] text-[#5C665E] mt-0.5">
                            Size: {line.variantLabel}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <QuantityStepper
                            value={line.qty}
                            onChange={(nextQty) => updateQty(line.key, nextQty)}
                            itemLabel={`${line.name} ${line.variantLabel}`}
                          />
                          <span className="text-[15px] font-bold text-[#232924] tabular-nums whitespace-nowrap">
                            {formatPKR(line.price * line.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-2 border-t border-[#8FA391]/20">
                <PromoInput />
              </div>
            </div>
          )}
        </div>

        {/* Footer totals & CTA */}
        <div
          className="px-5 md:px-6 pt-4 border-t border-[#8FA391]/20 bg-[#FBF9F6]"
          style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        >
          <dl className="space-y-1.5 text-[14px] mb-4">
            <div className="flex items-center justify-between text-[#5C665E]">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-[#232924] tabular-nums">
                {formatPKR(totals.subtotal)}
              </dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex items-center justify-between text-[#2D3830]">
                <dt>Promo ({totals.appliedPromo})</dt>
                <dd className="font-semibold tabular-nums">
                  -{formatPKR(totals.discount)}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between text-[#5C665E]">
              <dt>Shipping</dt>
              <dd className="font-semibold text-[#232924] tabular-nums">
                {lines.length === 0
                  ? formatPKR(0)
                  : totals.shipping === 0
                  ? 'FREE'
                  : formatPKR(totals.shipping)}
              </dd>
            </div>
            <div className="pt-2 border-t border-[#8FA391]/20 flex items-center justify-between text-[16px] font-bold text-[#232924]">
              <dt>Estimated Total</dt>
              <dd className="tabular-nums">{formatPKR(totals.total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={lines.length === 0}
            onClick={handleCheckout}
            className="w-full rounded-full bg-[#2D3830] hover:bg-[#3D4C41] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold tracking-[0.04em] uppercase py-3.5 px-7 transition-colors duration-200"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
