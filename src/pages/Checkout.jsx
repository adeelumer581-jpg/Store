import React, { useEffect, useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { STORE_CONFIG } from '../config/store.js';
import { useCart } from '../context/CartContext.jsx';
import { useOrders } from '../context/OrdersContext.jsx';
import { formatPKR } from '../lib/pricing.js';
import { trackInitiateCheckout } from '../lib/analytics.js';
import { navigate } from '../router/hashRouter.js';
import CheckoutForm from '../components/CheckoutForm.jsx';
import OrderSummary from '../components/OrderSummary.jsx';

export default function Checkout() {
  const { lines, totals, promoCode, itemCount, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [summaryOpenMobile, setSummaryOpenMobile] = useState(false);
  const [formValues, setFormValues] = useState({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: STORE_CONFIG.CITIES[0],
    postalCode: '',
    paymentMethod: 'cod',
  });

  const orderSubmittedRef = React.useRef(false);

  useEffect(() => {
    if (lines.length === 0 && !orderSubmittedRef.current) {
      navigate('#/shop');
    }
  }, [lines.length]);

  useEffect(() => {
    if (lines.length > 0) {
      trackInitiateCheckout(totals, itemCount);
    }
    // Fire once when entering checkout with items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (lines.length === 0) {
    return null;
  }

  const handleSubmitOrder = async (sanitizedCustomer) => {
    const order = await placeOrder(sanitizedCustomer, lines, promoCode);
    orderSubmittedRef.current = true;
    clearCart();
    navigate(`#/confirmation/${order.id}`);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-14">
      <div className="mb-6">
        <a
          href="#/shop"
          onClick={(e) => {
            e.preventDefault();
            navigate('#/shop');
          }}
          className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-[#5C665E] hover:text-[#232924] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Continue Shopping</span>
        </a>
      </div>

      <h1 className="font-serif text-[32px] leading-[40px] md:text-[42px] md:leading-[50px] font-normal text-[#232924] mb-6 md:mb-8">
        Checkout
      </h1>

      {/* Collapsible mobile order summary */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          aria-expanded={summaryOpenMobile}
          aria-controls="mobile-checkout-summary"
          onClick={() => setSummaryOpenMobile((prev) => !prev)}
          className="w-full rounded-[20px] bg-white border border-[#8FA391]/25 px-5 py-4 flex items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2 text-[14px] font-semibold text-[#2D3830]">
            <span>{summaryOpenMobile ? 'Hide order summary' : 'Show order summary'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                summaryOpenMobile ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </span>
          <span className="text-[16px] font-bold text-[#232924] tabular-nums">
            {formatPKR(totals.total)}
          </span>
        </button>

        {summaryOpenMobile && (
          <div id="mobile-checkout-summary" className="mt-3">
            <OrderSummary items={lines} totals={totals} interactivePromo />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <CheckoutForm
            values={formValues}
            onChange={setFormValues}
            totals={totals}
            onSubmitOrder={handleSubmitOrder}
          />
        </div>

        <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
          <OrderSummary items={lines} totals={totals} interactivePromo />
        </aside>
      </div>
    </div>
  );
}
