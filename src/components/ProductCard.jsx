import { useRef } from 'react';

import ProductVisual from './ProductVisual.jsx';
import { formatPKR } from '../lib/pricing.js';
import { getVariantOrDefault, getBundleSavings } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { navigate } from '../router/hashRouter.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const quickAddRef = useRef(null);

  if (!product) return null;

  const defaultVariant = getVariantOrDefault(product, null);
  const savings = getBundleSavings(product);
  const productHref = `#/product/${product.slug}`;

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(productHref);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product, defaultVariant, 1, {
      openDrawer: true,
      triggerEl: quickAddRef.current,
    });
    showToast(`Added ${product.name} (${defaultVariant.label}) to your bag.`);
  };

  const badgeText = product.badges && product.badges.length > 0 ? product.badges[0] : '';

  return (
    <article
      onClick={() => navigate(productHref)}
      className="group cursor-pointer bg-white rounded-[24px] border border-[#8FA391]/20 p-4 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div>
        <div className="aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-[#F0EDE6] mb-4">
          <ProductVisual product={product} variant={defaultVariant} view="front" />
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5C665E] mb-1.5">
          <span>
            {product.category}
            {defaultVariant ? ` \u00B7 ${defaultVariant.label}` : ''}
          </span>
          {badgeText && (
            <span className="text-[#2D3830]">{badgeText}</span>
          )}
        </div>

        <h3 className="font-serif text-[22px] leading-[28px] font-medium text-[#232924] mb-1.5">
          <a
            href={productHref}
            onClick={handleNavigate}
            className="hover:underline underline-offset-4 decoration-[#8FA391] focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </a>
        </h3>

        <p className="font-serif italic text-[15px] leading-[22px] text-[#5C665E] mb-4">
          {product.tagline}
        </p>

        {savings > 0 && (
          <p className="text-[12px] font-semibold text-[#2D3830] mb-2">
            You save {formatPKR(savings)}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-[#8FA391]/15 flex items-center justify-between gap-3">
        <span className="text-[18px] font-bold text-[#232924] tabular-nums whitespace-nowrap">
          {formatPKR(defaultVariant ? defaultVariant.price : product.price)}
        </span>

        <button
          ref={quickAddRef}
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name}`}
          className="rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] active:bg-[#DCE4DC] text-[#232924] text-[13px] font-semibold tracking-[0.03em] px-4 py-2.5 min-h-[44px] whitespace-nowrap shrink-0 transition-colors duration-200"
        >
          Quick Add
        </button>
      </div>
    </article>
  );
}
