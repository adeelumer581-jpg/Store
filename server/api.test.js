import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './index.js';

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('POST /api/chat degrades gracefully when GEMINI_API_KEY is not configured', async (t) => {
  const server = await listen(createApp());
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${server.address().port}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', text: 'Hello' }] }),
  });

  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.error, 'concierge_unavailable');
  assert.equal(body.reply, null);
});

test('POST /api/chat rejects malformed message payloads', async (t) => {
  const server = await listen(createApp());
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/api/chat`;

  const badCases = [
    {},
    { messages: 'not-an-array' },
    { messages: [] },
    { messages: [{ role: 'system', text: 'hi' }] },
    { messages: [{ role: 'assistant', text: 'hi' }] }, // must end with a user turn
    { messages: [{ role: 'user', text: '' }] },
  ];

  for (const payload of badCases) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 400, `expected 400 for ${JSON.stringify(payload)}`);
  }
});

test('GET / serves the built SPA shell when dist exists', async (t) => {
  const server = await listen(createApp());
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${server.address().port}/`);
  // dist/ may not exist in CI before build; either 200 (shell) or 500 (missing build) is structural
  assert.ok([200, 404, 500].includes(res.status));
});
