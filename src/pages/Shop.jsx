import React, { useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { navigate } from '../router/hashRouter.js';
import FilterChips from '../components/FilterChips.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop({ route }) {
  const rawCat = route?.query?.get('cat') || 'all';
  const normalizedParam = rawCat.trim().toLowerCase();

  const matchedCategory =
    CATEGORIES.find((c) => c.toLowerCase() === normalizedParam) ||
    (normalizedParam === 'all' ? 'All' : rawCat);

  const counts = useMemo(() => {
    const map = { All: PRODUCTS.length };
    for (const cat of CATEGORIES) {
      if (cat === 'All') continue;
      map[cat] = PRODUCTS.filter((p) => p.category === cat).length;
    }
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    if (matchedCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(
      (p) => p.category.toLowerCase() === matchedCategory.toLowerCase()
    );
  }, [matchedCategory]);

  const handleSelectCategory = (category) => {
    const slug = category.toLowerCase();
    if (slug === 'all') {
      navigate('#/shop');
    } else {
      navigate(`#/shop?cat=${encodeURIComponent(slug)}`);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
      <div className="max-w-2xl mb-8 md:mb-10">
        <p className="font-serif italic text-[18px] text-[#5C665E] mb-1">
          The Collection
        </p>
        <h1 className="font-serif text-[36px] leading-[44px] md:text-[48px] md:leading-[56px] font-normal text-[#232924] mb-3">
          Clean Botanical Essentials
        </h1>
        <p className="text-[15px] md:text-[16px] leading-[24px] text-[#5C665E]">
          Every formula is 100% Halal, cruelty-free, and tested for comfort across Pakistani summers and winters.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#8FA391]/20 mb-8">
        <FilterChips
          categories={CATEGORIES}
          activeCategory={matchedCategory}
          counts={counts}
          onSelect={handleSelectCategory}
        />
        <p className="text-[13px] font-semibold text-[#5C665E] tabular-nums" aria-live="polite">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-10 text-center max-w-lg mx-auto">
          <h2 className="font-serif text-[24px] text-[#232924] mb-2">
            No products in &ldquo;{matchedCategory}&rdquo;
          </h2>
          <p className="text-[15px] text-[#5C665E] mb-6">
            Try viewing the full Bare &amp; Bloom collection to explore our serums, cleansers, toners, and sets.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory('All')}
            className="rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold px-7 py-3.5 transition-colors"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
