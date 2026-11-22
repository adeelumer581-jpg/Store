import React, { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { useOrders } from '../context/OrdersContext.jsx';
import { formatOrderIdDisplay, normalizeOrderIdQuery } from '../lib/orderId.js';
import { buildWhatsAppSupportUrl } from '../lib/orderService.js';
import { navigate } from '../router/hashRouter.js';
import OrderSummary from '../components/OrderSummary.jsx';
import Timeline from '../components/Timeline.jsx';

export default function TrackOrder({ route }) {
  const urlOrderId = route?.params?.orderId || '';
  const { getOrderByQuery } = useOrders();

  const [inputQuery, setInputQuery] = useState(urlOrderId);
  const [searchedQuery, setSearchedQuery] = useState(urlOrderId);

  useEffect(() => {
    setInputQuery(urlOrderId);
    setSearchedQuery(urlOrderId);
  }, [urlOrderId]);

  const normalized = normalizeOrderIdQuery(searchedQuery);
  const matchedOrder = normalized ? getOrderByQuery(normalized) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = normalizeOrderIdQuery(inputQuery);
    setSearchedQuery(inputQuery);
    if (clean) {
      navigate(`#/track/${encodeURIComponent(clean)}`);
    } else {
      navigate('#/track');
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-serif italic text-[18px] text-[#5C665E] mb-1">
            Order Lookup
          </p>
          <h1 className="font-serif text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] font-normal text-[#232924] mb-3">
            Track Your Order
          </h1>
          <p className="text-[15px] text-[#5C665E]">
            Enter your Order ID (for example <strong className="text-[#232924]">#BB-20264</strong> or <strong className="text-[#232924]">20264</strong>) to view your estimated parcel progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <label
            htmlFor="track-order-input"
            className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
          >
            Order ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="track-order-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. BB-20264"
              enterKeyHint="search"
              className="flex-1 min-h-[48px] rounded-full bg-white px-5 py-3 text-[16px] text-[#232924] placeholder:text-[#5C665E]/70 border border-[#8FA391]/35"
            />
            <button
              type="submit"
              className="rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase px-7 py-3.5 min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Track</span>
            </button>
          </div>
        </form>

        {searchedQuery && matchedOrder && (
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 md:p-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C665E]">
                  Order Reference
                </p>
                <p className="text-[20px] font-bold text-[#232924] tabular-nums">
                  {formatOrderIdDisplay(matchedOrder.id)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[13px] text-[#5C665E]">Delivering to</p>
                <p className="text-[14px] font-semibold text-[#232924]">
                  {matchedOrder.customer?.fullName} &middot; {matchedOrder.address?.city}
                </p>
              </div>
            </div>

            <Timeline createdAt={matchedOrder.createdAt} />

            <OrderSummary
              items={matchedOrder.items}
              totals={matchedOrder.totals}
              title="Order Summary"
            />
          </div>
        )}

        {searchedQuery && !matchedOrder && (
          <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 md:p-8 text-center space-y-4">
            <h2 className="font-serif text-[24px] text-[#232924]">
              Order not found
            </h2>
            <p className="text-[15px] leading-[24px] text-[#5C665E]">
              We couldn&apos;t find <strong className="text-[#232924]">{searchedQuery.trim()}</strong> in this browser. Orders are looked up on the device where they were placed. If you ordered on another device or browser, message us on WhatsApp and our team will share your live courier update right away.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppSupportUrl(searchedQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold px-7 py-3.5 min-h-[48px] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
