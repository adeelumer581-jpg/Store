import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { buildSystemInstruction } from './catalogContext.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const MAX_MESSAGES = 12;
const MAX_TEXT_LENGTH = 2000;
const GEMINI_TIMEOUT_MS = 30000;

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_WINDOW = 12;

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/** Fixed-window in-memory rate limiter keyed by client IP. */
const hitLog = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const entry = hitLog.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    hitLog.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_PER_WINDOW;
}

function normalizeMessages(rawMessages) {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) return null;
  if (rawMessages.length > MAX_MESSAGES) return null;

  const normalized = [];
  for (const m of rawMessages) {
    const role = m?.role === 'assistant' ? 'model' : m?.role === 'user' ? 'user' : null;
    const text = typeof m?.text === 'string' ? m.text.trim() : '';
    if (!role || !text || text.length > MAX_TEXT_LENGTH) return null;
    normalized.push({ role, parts: [{ text }] });
  }
  if (normalized[normalized.length - 1]?.role !== 'user') return null;
  return normalized;
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));
  app.use(express.static(path.join(__dirname, '..', 'dist')));

  app.post('/api/chat', async (req, res) => {
    const contents = normalizeMessages(req.body?.messages);
    if (!contents) {
      return res.status(400).json({ error: 'invalid_messages', reply: null });
    }

    if (!ai) {
      return res.status(503).json({ error: 'concierge_unavailable', reply: null });
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'rate_limited', reply: null });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
    try {
      const response = await ai.models.generateContent(
        {
          model: MODEL,
          contents,
          config: {
            systemInstruction: buildSystemInstruction(),
            temperature: 0.4,
            maxOutputTokens: 600,
          },
        },
        { signal: controller.signal },
      );

      const reply = response.text?.trim();
      if (!reply) {
        return res.status(502).json({ error: 'empty_model_reply', reply: null });
      }
      return res.json({ reply });
    } catch (err) {
      const aborted = err?.name === 'AbortError';
      console.error('[concierge] Gemini request failed:', aborted ? 'timeout' : err);
      return res.status(502).json({ error: 'model_request_failed', reply: null });
    } finally {
      clearTimeout(timer);
    }
  });

  // Hash-routed SPA: any non-API GET serves the shell.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });

  return app;
}

// Only listen when executed directly (keeps the app importable for tests).
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  createApp().listen(PORT, () => {
    console.log(
      `[server] Bare & Bloom storefront listening on http://localhost:${PORT}` +
        (ai ? '' : ' (concierge disabled: GEMINI_API_KEY not set)'),
    );
  });
}
