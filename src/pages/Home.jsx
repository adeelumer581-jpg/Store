import React from 'react';
import { ShieldCheck, Sparkles, Truck, Star } from 'lucide-react';
import { STORE_CONFIG } from '../config/store.js';
import { PRODUCTS, getBundleSavings, getProductById } from '../data/products.js';
import { formatPKR } from '../lib/pricing.js';
import { navigate } from '../router/hashRouter.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductVisual from '../components/ProductVisual.jsx';

export default function Home() {
  const newInProducts = PRODUCTS.filter((p) => p.badges.includes('New'));
  const bestsellerProducts = PRODUCTS.filter((p) => p.badges.includes('Bestseller'));
  const ritualBundle = getProductById('bb-ritual-bundle');
  const bundleSavings = getBundleSavings(ritualBundle);
  const featuredReviews = PRODUCTS.slice(0, 3).map((p) => ({
    ...p.reviews[0],
    productName: p.name,
  }));

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 pt-8 pb-12 md:pt-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="font-serif italic text-[18px] leading-[24px] tracking-[0.02em] text-[#5C665E]">
              By Robaha &middot; Botanical Skincare Pakistan
            </p>
            <h1 className="font-serif text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] tracking-[-0.02em] font-normal text-[#232924] [text-wrap:balance]">
              Calm, luminous skin crafted for our climate.
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-[#5C665E] max-w-xl">
              Thoughtfully balanced serums, oat barrier cleansers, and fermented rice toners that absorb effortlessly in humid summers and dry winters — delivered across Pakistan with Cash on Delivery.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('#/shop');
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase px-7 py-3.5 min-h-[48px] transition-colors duration-200"
              >
                Shop Now
              </a>
              <a
                href="#/story"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('#/story');
                }}
                className="inline-flex items-center justify-center rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] active:bg-[#DCE4DC] text-[#232924] text-[14px] font-semibold tracking-[0.03em] px-7 py-3.5 min-h-[48px] transition-colors duration-200"
              >
                Our Story
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-4 md:p-5">
              <div className="aspect-[4/5] max-h-[520px] w-full rounded-[16px] overflow-hidden bg-[#F0EDE6]">
                <ProductVisual product={ritualBundle} view="front" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-[#DCE4DC]/65 border-y border-[#8FA391]/20">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-5">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {STORE_CONFIG.TRUST_BADGES.map((badge) => (
              <li
                key={badge}
                className="flex items-center justify-center gap-2 text-[13px] md:text-[14px] font-semibold tracking-[0.03em] text-[#2D3830]"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{badge}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* New In Section */}
      <section
        id="new-in"
        className="section-anchor max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="font-serif italic text-[18px] text-[#5C665E] mb-1">
              Freshly formulated
            </p>
            <h2 className="font-serif text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-normal text-[#232924]">
              New In
            </h2>
          </div>
          <a
            href="#/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/shop');
            }}
            className="text-[14px] font-semibold text-[#232924] underline underline-offset-4 decoration-[#8FA391] hover:opacity-75 self-start sm:self-auto"
          >
            View full collection
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {newInProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bestsellers Grid */}
      <section
        id="bestsellers"
        className="section-anchor max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 pb-12 md:pb-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="font-serif italic text-[18px] text-[#5C665E] mb-1">
              Daily staples across Pakistan
            </p>
            <h2 className="font-serif text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-normal text-[#232924]">
              Bestsellers
            </h2>
          </div>
          <a
            href="#/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/shop');
            }}
            className="text-[14px] font-semibold text-[#232924] underline underline-offset-4 decoration-[#8FA391] hover:opacity-75 self-start sm:self-auto"
          >
            Explore all 5 essentials
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {bestsellerProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Story Band (#DCE4DC) */}
      <section className="bg-[#DCE4DC] py-12 md:py-20">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <p className="font-serif italic text-[18px] text-[#2D3830]">
              Our Philosophy &mdash; By Robaha
            </p>
            <h2 className="font-serif text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-normal text-[#232924] [text-wrap:balance]">
              Gentle, barrier-respecting formulas without heavy layers or harsh fragrance.
            </h2>
            <p className="text-[15px] md:text-[16px] leading-[26px] text-[#232924]/85">
              Bare &amp; Bloom was founded in Pakistan with a simple conviction: effective skincare does not need ten steps or sting your barrier. Every bottle pairs clinically proven actives like stabilized Vitamin C, Ceramides, and Niacinamide with calming botanicals that stay breathable through warm afternoons.
            </p>
            <div className="pt-2">
              <a
                href="#/story"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('#/story');
                }}
                className="inline-flex items-center justify-center rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-white/60 active:bg-white/80 text-[#232924] text-[14px] font-semibold px-7 py-3.5 min-h-[48px] transition-colors duration-200"
              >
                Read Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ritual Set Promo */}
      {ritualBundle && (
        <section className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-24">
          <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-[#F0EDE6]">
                <ProductVisual product={ritualBundle} view="front" />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#2D3830]">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>3-Piece Routine &middot; Save {formatPKR(bundleSavings)}</span>
              </div>
              <h2 className="font-serif text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-normal text-[#232924]">
                {ritualBundle.name}
              </h2>
              <p className="text-[15px] leading-[24px] text-[#5C665E]">
                {ritualBundle.bundleIncludesText}. Qualifies automatically for free nationwide shipping across Pakistan.
              </p>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-[22px] font-bold text-[#232924] tabular-nums">
                  {formatPKR(ritualBundle.price)}
                </span>
                <span className="text-[14px] font-semibold text-[#2D3830]">
                  You save {formatPKR(bundleSavings)}
                </span>
              </div>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`#/product/${ritualBundle.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`#/product/${ritualBundle.slug}`);
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase px-7 py-3.5 min-h-[48px] transition-colors"
                >
                  Shop the Ritual Set
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sample Customer Reviews */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 pb-12 md:pb-24">
        <div className="mb-8">
          <p className="font-serif italic text-[18px] text-[#5C665E] mb-1">
            Community notes (Sample feedback)
          </p>
          <h2 className="font-serif text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-normal text-[#232924]">
            Why routines stick
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {featuredReviews.map((review) => (
            <article
              key={review.id}
              className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#2D3830] mb-3" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4"
                      fill={idx < review.rating ? '#2D3830' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-[15px] leading-[24px] text-[#232924] mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-[#8FA391]/15 text-[13px] text-[#5C665E]">
                <strong className="text-[#232924] font-semibold">{review.author}</strong> &middot; {review.city} &middot; {review.productName}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Shipping / COD Blurb */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12">
        <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#DCE4DC] flex items-center justify-center text-[#2D3830] shrink-0">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-[22px] leading-[28px] font-medium text-[#232924]">
                Cash on Delivery &amp; Free Shipping over PKR 3,000
              </h2>
              <p className="text-[15px] text-[#5C665E] mt-1">
                Flat PKR 200 nationwide shipping across Lahore, Karachi, Islamabad, Rawalpindi, and all major Pakistani cities in {STORE_CONFIG.DELIVERY_DAYS} business days. Use code <strong className="text-[#232924]">GLOW10</strong> for 10% off your first ritual.
              </p>
            </div>
          </div>
          <a
            href="#/track"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/track');
            }}
            className="rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] text-[#232924] text-[13px] font-semibold px-6 py-3 min-h-[44px] whitespace-nowrap shrink-0 transition-colors"
          >
            Track an Order
          </a>
        </div>
      </section>
    </div>
  );
}
