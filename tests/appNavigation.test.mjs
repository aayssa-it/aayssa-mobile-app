import assert from 'node:assert/strict';
import test from 'node:test';

import { nativeDestination } from '../src/lib/appNavigation.ts';
import { resolveDestination } from '../src/lib/urls.ts';

test('app shortcuts open native screens while source URLs remain live', () => {
  for (const [path, pathname] of [
    ['/calendar', '/calendar'], ['/gallery', '/gallery'],
    ['/contact-us', '/contact-us'], ['/about-us', '/about'],
  ]) {
    assert.deepEqual(nativeDestination(path), { pathname });
    assert.equal(resolveDestination(path).kind, 'website');
  }
  for (const [path, id] of [
    ['/maaladharana', 'maaladharana'], ['/padi-pooja', 'padi-pooja'],
    ['/irumudi%2F-kettu-nira', 'irumudi'], ['/annadhanam', 'annadhanam'],
  ]) {
    assert.deepEqual(nativeDestination(path), { pathname: '/seva', params: { id } });
    assert.equal(resolveDestination(path).kind, 'website');
  }
});

test('registration, membership, and devotional documents bypass native shortcuts', () => {
  for (const path of ['/maaladharan-registration', '/member-login', '/member-registration', '/bhajan-book', '/vratham-guidelines']) {
    assert.equal(nativeDestination(path), null);
    assert.equal(resolveDestination(path).kind, 'website');
  }
  assert.equal(nativeDestination('https://evil.example/calendar'), null);
  assert.equal(nativeDestination('javascript:alert(1)'), null);
});
