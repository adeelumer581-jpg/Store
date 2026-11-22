import { useEffect, useRef, useState } from 'react';

import { Menu, ShoppingBag, X } from 'lucide-react';
import BrandLogo from './BrandLogo.jsx';
import { useCart } from '../context/CartContext.jsx';
import { navigate, navigateToHomeSection } from '../router/hashRouter.js';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock.js';

const NAV_ITEMS = [
  { id: 'new-in', label: 'New In', type: 'section', target: 'new-in' },
  { id: 'bestsellers', label: 'Bestsellers', type: 'section', target: 'bestsellers' },
  { id: 'collection', label: 'The Collection', type: 'route', target: '#/shop' },
  { id: 'story', label: 'Our Story', type: 'route', target: '#/story' },
  { id: 'track', label: 'Track Order', type: 'route', target: '#/track' },
];

export default function Header({ currentRoute }) {
  const { itemCount, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartButtonRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => setMobileOpen(false);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    lockBodyScroll();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setTimeout(() => menuButtonRef.current?.focus(), 20);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockBodyScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (item, e) => {
    if (e) e.preventDefault();
    setMobileOpen(false);
    if (item.type === 'section') {
      navigateToHomeSection(item.target);
    } else {
      navigate(item.target);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate('#/');
  };

  const isActive = (item) => {
    if (item.type === 'route') {
      if (item.target === '#/shop') return currentRoute?.name === 'shop';
      if (item.target === '#/story') return currentRoute?.name === 'story';
      if (item.target === '#/track') return currentRoute?.name === 'track';
    }
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 header-sage-bar border-b border-[#232924]/10">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 h-[76px] md:h-[88px] flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 -ml-2 rounded-full text-[#232924] hover:bg-[#232924]/10 active:bg-[#232924]/15 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a
              href="#/"
              onClick={handleHomeClick}
              aria-label="Bare & Bloom by Robaha Home"
              className="inline-flex items-center shrink-0 py-1"
            >
              <BrandLogo />
            </a>
          </div>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const href = item.type === 'route' ? item.target : '#/';
              return (
                <a
                  key={item.id}
                  href={href}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`relative text-[14px] font-semibold tracking-[0.03em] text-[#232924] whitespace-nowrap shrink-0 py-2 transition-opacity hover:opacity-75 ${
                    active ? 'underline underline-offset-8 decoration-[#232924] decoration-2' : ''
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              ref={cartButtonRef}
              type="button"
              onClick={() => openDrawer(cartButtonRef.current)}
              aria-label={`Open shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
              className="relative inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-full text-[#232924] hover:bg-[#232924]/10 active:bg-[#232924]/15 transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              <span className="hidden sm:inline text-[13px] font-semibold tracking-[0.04em] uppercase">
                Bag
              </span>
              <span
                data-testid="cart-badge-count"
                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#2D3830] text-white text-[12px] font-bold tabular-nums"
              >
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 lg:hidden bg-[#8FA391] text-[#232924] h-screen-safe flex flex-col justify-between px-6 py-5 overflow-y-auto"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#232924]/15">
              <a
                href="#/"
                onClick={handleHomeClick}
                aria-label="Bare & Bloom by Robaha Home"
                className="inline-flex items-center"
              >
                <BrandLogo />
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setTimeout(() => menuButtonRef.current?.focus(), 20);
                }}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full text-[#232924] hover:bg-[#232924]/10 active:bg-[#232924]/15 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav aria-label="Mobile menu" className="mt-6 flex flex-col divide-y divide-[#232924]/10">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.type === 'route' ? item.target : '#/'}
                  onClick={(e) => handleNavClick(item, e)}
                  className="py-4 font-serif text-[26px] leading-[34px] text-[#232924] hover:opacity-75 active:opacity-60 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 pb-safe border-t border-[#232924]/15">
            <p className="font-serif italic text-[16px] text-[#232924]/90 mb-3">
              Clean botanical rituals, delivered nationwide with Cash on Delivery.
            </p>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate('#/shop');
              }}
              className="w-full rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold tracking-[0.04em] uppercase py-3.5 px-7 transition-colors"
            >
              Shop The Collection
            </button>
          </div>
        </div>
      )}
    </>
  );
}
