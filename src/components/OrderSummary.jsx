import React from 'react';
import { formatPKR } from '../lib/pricing.js';
import { getProductById, getVariantOrDefault } from '../data/products.js';
import ProductVisual from './ProductVisual.jsx';
import PromoInput from './PromoInput.jsx';

export default function OrderSummary({
  items = [],
  totals,
  interactivePromo = false,
  title = 'Order Summary',
}) {
  return (
    <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 md:p-6">
      <h2 className="font-serif text-[22px] leading-[28px] font-medium text-[#232924] mb-4">
        {title}
      </h2>

      <ul className="divide-y divide-[#8FA391]/15 mb-4">
        {items.map((item) => {
          const product = getProductById(item.productId);
          const variant = getVariantOrDefault(product, item.variantId);
          const key = item.key || `${item.productId}::${item.variantId}`;
          return (
            <li key={key} className="py-3 first:pt-0 flex items-center gap-3.5">
              <div className="w-14 h-16 rounded-[12px] overflow-hidden bg-[#F0EDE6] shrink-0 border border-[#8FA391]/15">
                {product ? (
                  <ProductVisual product={product} variant={variant} view="front" />
                ) : (
                  <div className="w-full h-full bg-[#F0EDE6]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[16px] leading-[20px] font-medium text-[#232924] truncate">
                  {item.name}
                </p>
                <p className="text-[13px] text-[#5C665E]">
                  {item.variantLabel} &middot; Qty {item.qty}
                </p>
              </div>
              <span className="text-[14px] font-bold text-[#232924] tabular-nums whitespace-nowrap">
                {formatPKR(item.price * item.qty)}
              </span>
            </li>
          );
        })}
      </ul>

      {interactivePromo && (
        <div className="py-4 border-t border-[#8FA391]/15">
          <PromoInput />
        </div>
      )}

      <dl className="pt-4 border-t border-[#8FA391]/15 space-y-2 text-[14px]">
        <div className="flex items-center justify-between text-[#5C665E]">
          <dt>Subtotal</dt>
          <dd className="font-semibold text-[#232924] tabular-nums">
            {formatPKR(totals?.subtotal)}
          </dd>
        </div>

        {totals?.discount > 0 && (
          <div className="flex items-center justify-between text-[#2D3830]">
            <dt>Discount ({totals.appliedPromo})</dt>
            <dd className="font-semibold tabular-nums">-{formatPKR(totals.discount)}</dd>
          </div>
        )}

        <div className="flex items-center justify-between text-[#5C665E]">
          <dt>Shipping</dt>
          <dd className="font-semibold text-[#232924] tabular-nums">
            {totals?.shipping === 0 ? 'FREE' : formatPKR(totals?.shipping)}
          </dd>
        </div>

        <div className="pt-3 border-t border-[#8FA391]/20 flex items-center justify-between text-[17px] font-bold text-[#232924]">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPKR(totals?.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
