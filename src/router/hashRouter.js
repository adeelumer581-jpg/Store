import { useEffect, useState } from 'react';
import { trackPageView } from '../lib/analytics.js';

/**
 * Lightweight hash router compatible with static hosting and Instagram/Facebook
 * in-app browsers (no history API rewrites required).
 *
 * Supported routes:
 * - #/ (home)
 * - #/shop (?cat=serums|cleansers|toners|bundles)
 * - #/product/:slug
 * - #/checkout
 * - #/confirmation/:orderId
 * - #/track or #/track/:orderId
 * - #/story
 * - anything else -> not-found
 */

export function parseHashUrl(rawHash = '') {
  const cleaned = (rawHash || '#/').replace(/^#/, '') || '/';
  const [rawPath, rawQuery = ''] = cleaned.split('?');
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const query = new URLSearchParams(rawQuery);
  const segments = normalizedPath.split('/').filter(Boolean);

  if (normalizedPath === '/' || normalizedPath === '') {
    return { name: 'home', path: '/', params: {}, query };
  }
  if (normalizedPath === '/shop') {
    return { name: 'shop', path: '/shop', params: {}, query };
  }
  if (segments[0] === 'product' && segments[1] && segments.length === 2) {
    return {
      name: 'product',
      path: normalizedPath,
      params: { slug: decodeURIComponent(segments[1]) },
      query,
    };
  }
  if (normalizedPath === '/checkout') {
    return { name: 'checkout', path: '/checkout', params: {}, query };
  }
  if (segments[0] === 'confirmation' && segments[1] && segments.length === 2) {
    return {
      name: 'confirmation',
      path: normalizedPath,
      params: { orderId: decodeURIComponent(segments[1]) },
      query,
    };
  }
  if (normalizedPath === '/track') {
    return { name: 'track', path: '/track', params: { orderId: '' }, query };
  }
  if (segments[0] === 'track' && segments[1] && segments.length === 2) {
    return {
      name: 'track',
      path: normalizedPath,
      params: { orderId: decodeURIComponent(segments[1]) },
      query,
    };
  }
  if (normalizedPath === '/story') {
    return { name: 'story', path: '/story', params: {}, query };
  }

  return { name: 'not-found', path: normalizedPath, params: {}, query };
}

let pendingAnchorScroll = null;

export function navigate(to, options = {}) {
  if (typeof window === 'undefined') return;
  const targetHash = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`;
  if (options.anchor) {
    pendingAnchorScroll = options.anchor;
  } else {
    pendingAnchorScroll = null;
  }

  if (window.location.hash === targetHash) {
    if (options.anchor) {
      scrollToAnchorNow(options.anchor);
      pendingAnchorScroll = null;
    } else if (options.replace) {
      window.scrollTo(0, 0);
    }
    return;
  }

  window.location.hash = targetHash;
}

export function scrollToAnchorNow(sectionId) {
  if (typeof document === 'undefined' || !sectionId) return;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function navigateToHomeSection(sectionId) {
  const current = parseHashUrl(typeof window !== 'undefined' ? window.location.hash : '#/');
  if (current.name === 'home') {
    scrollToAnchorNow(sectionId);
    return;
  }
  navigate('#/', { anchor: sectionId });
}

export function useHashRoute() {
  const [route, setRoute] = useState(() =>
    parseHashUrl(typeof window !== 'undefined' ? window.location.hash : '#/')
  );

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseHashUrl(window.location.hash);
      setRoute(nextRoute);
      trackPageView();

      if (pendingAnchorScroll && nextRoute.name === 'home') {
        const anchor = pendingAnchorScroll;
        pendingAnchorScroll = null;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToAnchorNow(anchor);
          });
        });
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial page view
    trackPageView();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}
