/**
 * Resilient clipboard helper for Facebook/Instagram in-app browsers.
 * Tries navigator.clipboard.writeText first, falls back to hidden textarea + execCommand('copy').
 * Returns { ok: boolean } so UI can fall back to manual text selection if both fail.
 */
export async function copyText(text) {
  const value = String(text || '');
  if (!value) return { ok: false };

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return { ok: true };
    }
  } catch {
    // Fall through to execCommand fallback
  }

  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, value.length);
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (copied) {
        return { ok: true };
      }
    }
  } catch {
    // Fall through to manual select state
  }

  return { ok: false };
}
