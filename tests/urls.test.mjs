import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyUrl, navigationAction, resolveDestination, SITE } from '../src/lib/urls.ts';

test('resource paths and portal aliases resolve to official HTTPS pages', () => {
  assert.deepEqual(resolveDestination('/bhajan-book'), { kind: 'website', url: `${SITE}/bhajan-book` });
  assert.deepEqual(resolveDestination('/calendar'), { kind: 'website', url: 'https://portal.atlantaayyappasevasangam.org/home-pooja-calendar.html' });
  assert.deepEqual(resolveDestination('/member-login'), { kind: 'website', url: 'https://portal.atlantaayyappasevasangam.org/' });
  assert.equal(resolveDestination('/irumudi%2F-kettu-nira').url, `${SITE}/irumudi%2F-kettu-nira`);
});

test('external links cannot impersonate the organization hostname', () => {
  for (const url of [
    'https://atlantaayyappasevasangam.org.evil.example/login',
    'https://fakeatlantaayyappasevasangam.org/',
    'https://www.google.com/maps/',
    'http://atlantaayyappasevasangam.org/',
    'https://atlantaayyappasevasangam.org:8443/',
  ]) assert.equal(classifyUrl(url).kind, 'external', url);
  assert.equal(resolveDestination('//evil.example/login').kind, 'external');
  assert.equal(classifyUrl('https://www.atlantaayyappasevasangam.org/').kind, 'website');
});

test('unsafe protocols, malformed URLs, and embedded credentials are blocked', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///etc/passwd', 'intent://test', 'not a URL', 'https://', `https://user:password@atlantaayyappasevasangam.org/`]) {
    assert.equal(classifyUrl(url).kind, 'blocked', url);
    assert.equal(navigationAction(url), 'block', url);
  }
});

test('new windows and top-level redirects use the same destination policy', () => {
  assert.equal(navigationAction(`${SITE}/gallery`), 'allow');
  assert.equal(navigationAction('https://www.youtube.com/'), 'external');
  assert.equal(navigationAction('mailto:hello@example.com'), 'external');
  assert.equal(navigationAction('tel:+14045550123'), 'external');
  assert.equal(navigationAction('about:blank'), 'allow');
  assert.equal(navigationAction('https://www.youtube.com/embed/video', false), 'allow');
  assert.equal(navigationAction('mailto:hello@example.com', false), 'block');
});
