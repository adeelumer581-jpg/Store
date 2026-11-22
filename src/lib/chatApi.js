/**
 * Thin client for the concierge endpoint. The storefront is frequently hosted as
 * purely static files (Netlify/Vercel/Cloudflare), where /api/chat does not exist —
 * every failure path resolves to a graceful "unavailable" state so the UI can
 * fall back to the WhatsApp concierge instead of crashing.
 */

const CHAT_TIMEOUT_MS = 25000;

export class ConciergeUnavailableError extends Error {
  constructor(message = 'Concierge is unavailable right now.') {
    super(message);
    this.name = 'ConciergeUnavailableError';
  }
}

/**
 * @param {{role: 'user'|'assistant', text: string}[]} messages full conversation history
 * @returns {Promise<string>} the assistant's reply text
 */
export async function sendConciergeMessage(messages) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    let res;
    try {
      res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
    } catch {
      throw new ConciergeUnavailableError();
    }

    if (!res.ok) {
      throw new ConciergeUnavailableError();
    }

    const data = await res.json().catch(() => null);
    if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new ConciergeUnavailableError();
    }
    return data.reply.trim();
  } finally {
    clearTimeout(timer);
  }
}
