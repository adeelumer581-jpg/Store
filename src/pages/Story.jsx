import { STORE_CONFIG } from '../config/store.js';
import { navigate } from '../router/hashRouter.js';

export default function Story() {
  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
      <article className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-4">
          <p className="font-serif italic text-[18px] text-[#5C665E]">
            Bare &amp; Bloom &mdash; By Robaha
          </p>
          <h1 className="font-serif text-[36px] leading-[44px] md:text-[52px] md:leading-[60px] font-normal text-[#232924] [text-wrap:balance]">
            Botanical care written for Pakistani skin and climate.
          </h1>
        </header>

        <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-6 md:p-10 space-y-6 text-[16px] leading-[28px] text-[#232924]">
          <p>
            Across Lahore, Karachi, Islamabad, and beyond, skin endures extremes: intense afternoon sun, humid monsoons, hard tap water, and winter dryness. Heavy imported creams often sit on top of skin, while harsh brightening washes strip away the moisture barrier.
          </p>
          <p>
            Bare &amp; Bloom by Robaha began with a quieter ritual — combining clinically respected actives like stabilized Vitamin C, Ceramides, Fermented Rice Water, and Niacinamide in breathable textures that feel weightless from morning commute to late evening.
          </p>
          <p>
            Every bottle is thoughtfully formulated without synthetic fragrance, parabens, or harsh bleaching agents, focusing instead on steady barrier support and natural daily luminosity.
          </p>
        </div>

        <section className="bg-[#DCE4DC] rounded-[24px] p-6 md:p-8">
          <h2 className="font-serif text-[24px] leading-[32px] text-[#232924] mb-4">
            Our Standards
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[15px] font-medium text-[#2D3830]">
            {STORE_CONFIG.TRUST_BADGES.map((badge) => (
              <li key={badge} className="rounded-full bg-white/80 px-4 py-2.5">
                {badge}
              </li>
            ))}
          </ul>
        </section>

        <div className="pt-2">
          <a
            href="#/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/shop');
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase px-7 py-3.5 min-h-[48px] transition-colors"
          >
            Explore The Collection
          </a>
        </div>
      </article>
    </div>
  );
}
