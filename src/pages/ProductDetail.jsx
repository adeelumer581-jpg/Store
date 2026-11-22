import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import {
  PRODUCTS,
  getBundleSavings,
  getProductBySlug,
  getVariantOrDefault,
} from '../data/products.js';
import { formatPKR } from '../lib/pricing.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { navigate } from '../router/hashRouter.js';
import { trackViewContent } from '../lib/analytics.js';
import ProductVisual from '../components/ProductVisual.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import Accordion from '../components/Accordion.jsx';
import ProductCard from '../components/ProductCard.jsx';
import NotFound from './NotFound.jsx';

export default function ProductDetail({ route }) {
  const slug = route?.params?.slug || '';
  const product = getProductBySlug(slug);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants?.[0]?.id || ''
  );
  const [selectedView, setSelectedView] = useState('front');
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('ingredients');
  const addButtonRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    const defaultVar = getVariantOrDefault(product, null);
    setSelectedVariantId(defaultVar?.id || '');
    setSelectedView('front');
    setQty(1);
    setOpenAccordion('ingredients');
    trackViewContent(product, defaultVar?.price || product.price);
  }, [product]);

  const activeVariant = useMemo(
    () => getVariantOrDefault(product, selectedVariantId),
    [product, selectedVariantId]
  );

  if (!product) {
    return (
      <NotFound
        title="Product not found"
        message="We couldn't find the skincare product you were looking for. It may have been renamed or moved."
      />
    );
  }

  const bundleSavings = getBundleSavings(product);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  const activePrice = activeVariant ? activeVariant.price : product.price;

  const handleAddToCart = (triggerEl = addButtonRef.current) => {
    addItem(product, activeVariant, qty, {
      openDrawer: true,
      triggerEl,
    });
    showToast(`Added ${qty} x ${product.name} (${activeVariant.label}) to your bag.`);
  };

  const handleBuyNow = () => {
    addItem(product, activeVariant, qty, { openDrawer: false });
    navigate('#/checkout');
  };

  const accordionItems = [
    {
      id: 'ingredients',
      title: 'Key Ingredients',
      content: (
        <ul className="space-y-3">
          {product.keyIngredients.map((ing) => (
            <li key={ing.name}>
              <p className="font-semibold text-[#232924]">{ing.name}</p>
              <p className="text-[14px] text-[#5C665E]">{ing.benefit}</p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'how-to-use',
      title: 'How to Use',
      content: (
        <ol className="list-decimal pl-5 space-y-2 text-[14px] text-[#232924]">
          {product.howToUse.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      ),
    },
    {
      id: 'skin-type',
      title: 'Skin Type',
      content: <p className="text-[14px] text-[#232924]">{product.skinType}</p>,
    },
    {
      id: 'shipping',
      title: 'Shipping & COD',
      content: <p className="text-[14px] text-[#232924]">{product.shippingCodNote}</p>,
    },
  ];

  const reviews = product.reviews || [];
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : product.rating.toFixed(1);

  return (
    <div className="pb-24 md:pb-10">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 pt-6 pb-12 md:pt-10 md:pb-20">
        {/* Back Breadcrumb */}
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
            <span>Back to The Collection</span>
          </a>
        </div>

        {/* Main 2-Column PDP Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-3 md:p-4">
              <div className="aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-[#F0EDE6]">
                <ProductVisual
                  product={product}
                  variant={activeVariant}
                  view={selectedView}
                />
              </div>

              <div
                role="group"
                aria-label="Product gallery views"
                className="mt-3 grid grid-cols-4 gap-2.5"
              >
                {product.images.map((img) => {
                  const isActive = selectedView === img.view;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedView(img.view)}
                      aria-label={`View ${img.label}`}
                      aria-pressed={isActive}
                      className={`aspect-[4/5] rounded-[12px] overflow-hidden bg-[#F0EDE6] border-2 transition-colors ${
                        isActive ? 'border-[#2D3830]' : 'border-transparent hover:border-[#8FA391]/50'
                      }`}
                    >
                      <ProductVisual product={product} variant={activeVariant} view={img.view} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Purchase & Specification Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C665E] mb-2">
                <span>{product.category}</span>
                {product.badges?.map((badge) => (
                  <span key={badge}>&middot; {badge}</span>
                ))}
              </div>

              <h1 className="font-serif text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] font-normal text-[#232924] mb-2">
                {product.name}
              </h1>

              <p className="font-serif italic text-[18px] leading-[24px] tracking-[0.02em] text-[#5C665E] mb-4">
                {product.tagline}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-[#2D3830]" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < Math.round(Number(averageRating)) ? '#2D3830' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-[13px] font-semibold text-[#232924] tabular-nums">
                  {averageRating} ({reviews.length} sample reviews)
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span
                  data-testid="pdp-live-price"
                  className="text-[24px] font-bold text-[#232924] tabular-nums"
                >
                  {formatPKR(activePrice)}
                </span>
                {bundleSavings > 0 && (
                  <span className="inline-flex items-center rounded-full bg-[#DCE4DC] px-3 py-1 text-[12px] font-semibold text-[#2D3830]">
                    You save {formatPKR(bundleSavings)}
                  </span>
                )}
              </div>
            </div>

            {product.bundleIncludesText && (
              <div className="rounded-[18px] bg-[#DCE4DC]/55 border border-[#8FA391]/25 p-4 text-[14px] leading-[22px] text-[#232924]">
                {product.bundleIncludesText}
              </div>
            )}

            {/* Variant Selector */}
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-2">
                Size
              </p>
              <div className="flex flex-wrap gap-2.5" role="group" aria-label="Select size">
                {product.variants.map((variant) => {
                  const isSelected = activeVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`rounded-full px-5 py-2.5 min-h-[44px] text-[14px] font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#2D3830] text-white border border-[#2D3830]'
                          : 'bg-white text-[#232924] border border-[#8FA391]/35 hover:bg-[#DCE4DC]/50'
                      }`}
                    >
                      {variant.label} &mdash; {formatPKR(variant.price)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Primary Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="sr-only">Quantity</span>
                  <QuantityStepper
                    value={qty}
                    onChange={setQty}
                    itemLabel={product.name}
                  />
                </div>
                <button
                  ref={addButtonRef}
                  type="button"
                  onClick={() => handleAddToCart(addButtonRef.current)}
                  className="flex-1 min-w-[190px] rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase py-3.5 px-7 min-h-[48px] transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] active:bg-[#DCE4DC] text-[#232924] text-[14px] font-semibold tracking-[0.03em] py-3.5 px-7 min-h-[48px] transition-colors duration-200"
              >
                Buy Now (Cash on Delivery)
              </button>
            </div>

            {/* 4 Specification Accordions (first open by default, one open at a time) */}
            <div className="pt-2">
              <Accordion
                items={accordionItems}
                openId={openAccordion}
                onToggle={setOpenAccordion}
              />
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <section className="mt-14 md:mt-20 pt-10 border-t border-[#8FA391]/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <p className="font-serif italic text-[17px] text-[#5C665E] mb-1">
                Sample customer notes
              </p>
              <h2 className="font-serif text-[28px] leading-[36px] font-normal text-[#232924]">
                Reviews ({averageRating} / 5)
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[#2D3830]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < Math.round(Number(averageRating)) ? '#2D3830' : 'none'}
                />
              ))}
              <span className="ml-1 text-[14px] font-semibold tabular-nums">
                {averageRating} average
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#2D3830] mb-2.5" aria-label={`${rev.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3.5 h-3.5"
                        fill={idx < rev.rating ? '#2D3830' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-[14px] leading-[22px] text-[#232924] mb-4">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <p className="text-[13px] text-[#5C665E]">
                  <strong className="text-[#232924]">{rev.author}</strong> &middot; {rev.city}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Complete the ritual related row */}
        <section className="mt-14 md:mt-20">
          <h2 className="font-serif text-[28px] leading-[36px] font-normal text-[#232924] mb-6">
            Complete the ritual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 mobile-action-bar border-t border-[#8FA391]/25 px-5 pt-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5C665E]">
            {activeVariant?.label}
          </p>
          <p className="text-[18px] font-bold text-[#232924] tabular-nums">
            {formatPKR(activePrice)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddToCart(null)}
          className="flex-1 max-w-[220px] rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[13px] font-semibold tracking-[0.04em] uppercase py-3 px-5 min-h-[46px] transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
