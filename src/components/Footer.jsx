import BrandLogo from './BrandLogo.jsx';
import { STORE_CONFIG } from '../config/store.js';
import { navigate, navigateToHomeSection } from '../router/hashRouter.js';
import { buildWhatsAppSupportUrl } from '../lib/orderService.js';

export default function Footer() {
  const whatsappUrl = buildWhatsAppSupportUrl('');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#DCE4DC]/70 border-t border-[#8FA391]/25 text-[#232924] mt-16 md:mt-24">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#8FA391]/25">
          <div className="md:col-span-5">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/');
              }}
              className="inline-flex items-center mb-4"
              aria-label="Bare & Bloom by Robaha Home"
            >
              <BrandLogo sizeClass="h-24" />
            </a>
            <p className="text-[15px] leading-[24px] text-[#5C665E] max-w-sm">
              {STORE_CONFIG.tagline}
            </p>
            <p className="mt-3 font-serif italic text-[16px] text-[#232924]">
              Nationwide Cash on Delivery across Pakistan in {STORE_CONFIG.DELIVERY_DAYS} business days.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C665E] mb-4">
              Explore
            </h2>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <a
                  href="#/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('#/shop');
                  }}
                  className="hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  The Collection
                </a>
              </li>
              <li>
                <a
                  href="#/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToHomeSection('new-in');
                  }}
                  className="hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  New In
                </a>
              </li>
              <li>
                <a
                  href="#/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToHomeSection('bestsellers');
                  }}
                  className="hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  Bestsellers
                </a>
              </li>
              <li>
                <a
                  href="#/story"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('#/story');
                  }}
                  className="hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#/track"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('#/track');
                  }}
                  className="hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C665E] mb-4">
              Customer Care &amp; Social
            </h2>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-[#2D3830] hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  WhatsApp Concierge
                </a>
                <p className="text-[13px] text-[#5C665E]">
                  For routine advice, payment screenshots &amp; order updates
                </p>
              </li>
              <li>
                <a
                  href={STORE_CONFIG.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-[#2D3830] hover:underline underline-offset-4 decoration-[#8FA391]"
                >
                  Instagram ({STORE_CONFIG.INSTAGRAM_HANDLE})
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[#5C665E]">
          <p>
            &copy; {year} {STORE_CONFIG.storeName} {STORE_CONFIG.storeSubtitle}. All rights reserved.
          </p>
          <p>Free shipping over PKR 3,000 &middot; Flat PKR 200 nationwide</p>
        </div>
      </div>
    </footer>
  );
}
