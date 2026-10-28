import assert from 'node:assert/strict';
import test from 'node:test';

import { browserReducer, initialBrowserState } from '../src/lib/browserState.ts';

const start = 'https://atlantaayyappasevasangam.org/';
const next = 'https://portal.atlantaayyappasevasangam.org/registration';

test('retry loads the failing page after navigation instead of the initial page', () => {
  let state = initialBrowserState(start);
  state = browserReducer(state, { type: 'navigate', url: next, canGoBack: true });
  state = browserReducer(state, { type: 'fail', url: next });
  assert.equal(state.canGoBack, false);
  assert.equal(state.loading, false);
  state = browserReducer(state, { type: 'retry' });
  assert.equal(state.sourceUrl, next);
  assert.equal(state.currentUrl, next);
  assert.equal(state.failedUrl, null);
  assert.equal(state.canGoBack, false);
  assert.equal(state.loading, true);
  assert.equal(state.attempt, 1);
});

test('late navigation and load-end callbacks cannot restore stale history after failure', () => {
  let state = browserReducer(initialBrowserState(start), { type: 'fail', url: next });
  state = browserReducer(state, { type: 'navigate', url: start, canGoBack: true });
  state = browserReducer(state, { type: 'finish' });
  assert.equal(state.failedUrl, next);
  assert.equal(state.canGoBack, false);
  assert.equal(browserReducer(state, { type: 'retry' }).sourceUrl, next);
});

test('a WebView process failure retries the last official page', () => {
  let state = browserReducer(initialBrowserState(start), { type: 'start', url: next });
  state = browserReducer(state, { type: 'fail' });
  assert.equal(state.failedUrl, next);
  assert.equal(browserReducer(state, { type: 'retry' }).sourceUrl, next);
});

test('external and malformed URLs never become embedded sources or retry targets', () => {
  for (const url of ['https://evil.example/', 'javascript:alert(1)', 'invalid']) {
    const state = initialBrowserState(start);
    assert.equal(browserReducer(state, { type: 'open', url }).sourceUrl, start);
    assert.equal(browserReducer(state, { type: 'navigate', url, canGoBack: false }).currentUrl, start);
    const failure = browserReducer(state, { type: 'fail', url });
    assert.equal(browserReducer(failure, { type: 'retry' }).sourceUrl, start);
  }
});
