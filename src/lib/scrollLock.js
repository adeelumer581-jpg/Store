/**
 * iOS & Android WebView-safe body scroll lock.
 * Locks body using position: fixed with saved scrollY offset and restores it on unlock.
 * Reference-counted so overlapping drawers/menus never prematurely unlock scrolling.
 */

let lockCount = 0;
let savedScrollY = 0;

export function lockBodyScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  lockCount += 1;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY || window.pageYOffset || 0;
  const body = document.body;
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
}

export function unlockBodyScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  const body = document.body;
  const restoreY = savedScrollY;
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  window.scrollTo(0, restoreY);
}
