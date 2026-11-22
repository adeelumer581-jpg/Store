import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Copy, MessageCircle, Truck } from 'lucide-react';
import { STORE_CONFIG } from '../config/store.js';
import { useOrders } from '../context/OrdersContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { copyText } from '../lib/clipboard.js';
import { formatOrderIdDisplay } from '../lib/orderId.js';
import { buildWhatsAppOrderUrl } from '../lib/orderService.js';
import { navigate } from '../router/hashRouter.js';
import OrderSummary from '../components/OrderSummary.jsx';
import NotFound from './NotFound.jsx';

export default function Confirmation({ route }) {
  const orderIdParam = route?.params?.orderId || '';
  const { getOrderByQuery, retryUnsynced } = useOrders();
  const { showToast } = useToast();
  const [manualCopyMode, setManualCopyMode] = useState(false);
  const manualInputRef = useRef(null);

  const order = getOrderByQuery(orderIdParam);

  useEffect(() => {
    if (order) {
      retryUnsynced();
    }
    // Retry unsynced queue once when confirmation opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  if (!order) {
    return (
      <NotFound
        title="Order not found on this device"
        message="Order confirmations are saved on the device and browser where you placed the order. If you switched apps or cleared browser storage, please reach out on WhatsApp with your Order ID."
      />
    );
  }

  const displayOrderId = formatOrderIdDisplay(order.id);
  const whatsappUrl = buildWhatsAppOrderUrl(order);

  const handleCopyOrderId = async () => {
    const res = await copyText(displayOrderId);
    if (res.ok) {
      setManualCopyMode(false);
      showToast(`Copied ${displayOrderId} to clipboard.`);
    } else {
      setManualCopyMode(true);
      showToast('Select the highlighted Order ID to copy it manually.', 'error');
      setTimeout(() => {
        manualInputRef.current?.focus();
        manualInputRef.current?.select();
      }, 30);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Hero Banner */}
        <section className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 md:p-9 text-center">
          <div className="w-14 h-14 rounded-full bg-[#DCE4DC] text-[#2D3830] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <p className="font-serif italic text-[18px] text-[#5C665E] mb-1">
            Thank you, {order.customer?.fullName}
          </p>
          <h1 className="font-serif text-[32px] leading-[40px] md:text-[42px] md:leading-[50px] font-normal text-[#232924] mb-3">
            Your order is placed
          </h1>

          {/* Order ID + Copy Fallback */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 mt-1 mb-4">
            {manualCopyMode ? (
              <input
                ref={manualInputRef}
                type="text"
                readOnly
                value={displayOrderId}
                aria-label="Order ID for manual copying"
                onClick={(e) => e.currentTarget.select()}
                className="w-40 text-center rounded-full bg-[#F0EDE6] border border-[#8FA391] px-4 py-2 text-[16px] font-bold text-[#232924] tabular-nums"
              />
            ) : (
              <span
                data-testid="confirmation-order-id"
                className="rounded-full bg-[#DCE4DC] px-5 py-2 text-[16px] font-bold text-[#2D3830] tabular-nums tracking-[0.04em]"
              >
                {displayOrderId}
              </span>
            )}

            <button
              type="button"
              onClick={handleCopyOrderId}
              className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] text-[#232924] text-[13px] font-semibold px-4 py-2 min-h-[44px] transition-colors"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
              <span>Copy ID</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#2D3830] bg-[#FBF9F6] border border-[#8FA391]/20 rounded-full px-4 py-2">
            <Truck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Estimated delivery: {STORE_CONFIG.DELIVERY_DAYS} business days</span>
          </div>

          {/* Primary WhatsApp Confirmation CTA */}
          <div className="mt-6 pt-6 border-t border-[#8FA391]/15">
            <p className="text-[14px] text-[#5C665E] mb-4">
              Tap below to send your order details directly to our WhatsApp desk for priority dispatch.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase px-8 py-4 min-h-[52px] transition-colors"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>Confirm your order on WhatsApp</span>
            </a>
          </div>
        </section>

        {/* Bank Transfer Instructions when chosen */}
        {order.paymentMethod === 'bank' && (
          <section className="bg-[#DCE4DC]/65 rounded-[24px] border border-[#8FA391]/30 p-6 md:p-7 space-y-2.5 text-[14px] text-[#232924]">
            <h2 className="font-serif text-[22px] text-[#232924]">
              Bank Transfer / Raast / Mobile Wallet Details
            </h2>
            <p className="text-[#5C665E]">
              Please transfer the total amount and share your screenshot with Order ID{' '}
              <strong>{displayOrderId}</strong>.
            </p>
            <dl className="space-y-1 pt-1 text-[13px]">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">Account Title:</dt>
                <dd>{STORE_CONFIG.PAYMENT_ACCOUNTS.accountTitle}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">Bank / Raast:</dt>
                <dd>{STORE_CONFIG.PAYMENT_ACCOUNTS.bankName}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">Account / IBAN:</dt>
                <dd className="tabular-nums">{STORE_CONFIG.PAYMENT_ACCOUNTS.ibanOrAccount}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">JazzCash:</dt>
                <dd className="tabular-nums">{STORE_CONFIG.PAYMENT_ACCOUNTS.jazzCash}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">EasyPaisa:</dt>
                <dd className="tabular-nums">{STORE_CONFIG.PAYMENT_ACCOUNTS.easyPaisa}</dd>
              </div>
            </dl>
            <p className="pt-1 font-serif italic text-[15px] text-[#2D3830]">
              {STORE_CONFIG.PAYMENT_ACCOUNTS.screenshotNote}
            </p>
          </section>
        )}

        {/* Delivery & Payment Snapshot */}
        <section className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C665E] mb-2">
              Delivery Address
            </h2>
            <p className="font-semibold text-[15px] text-[#232924]">{order.customer?.fullName}</p>
            <p className="text-[14px] text-[#5C665E] tabular-nums">{order.customer?.phone}</p>
            {order.customer?.email && (
              <p className="text-[14px] text-[#5C665E]">{order.customer.email}</p>
            )}
            <p className="text-[14px] text-[#232924] mt-1">
              {order.address?.streetAddress}, {order.address?.city} {order.address?.postalCode}
            </p>
          </div>

          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C665E] mb-2">
              Payment &amp; Status
            </h2>
            <p className="font-semibold text-[15px] text-[#232924]">
              {order.paymentMethod === 'bank'
                ? 'Bank Transfer / Raast / JazzCash / EasyPaisa'
                : 'Cash on Delivery (COD)'}
            </p>
            <p className="text-[14px] text-[#5C665E] mt-1">
              Order placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </section>

        {/* Order Summary */}
        <OrderSummary items={order.items} totals={order.totals} title="Items Ordered" />

        {/* Secondary Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`#/track/${order.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`#/track/${order.id}`);
            }}
            className="w-full sm:w-auto text-center rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] text-[#232924] text-[14px] font-semibold px-7 py-3.5 min-h-[48px] transition-colors"
          >
            Track Order
          </a>
          <a
            href="#/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/shop');
            }}
            className="w-full sm:w-auto text-center rounded-full border border-[#8FA391]/35 bg-white hover:bg-[#DCE4DC]/50 text-[#232924] text-[14px] font-semibold px-7 py-3.5 min-h-[48px] transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
