import assert from 'node:assert/strict';
import test from 'node:test';

import { formatMoney, isIsoDate, moveItem, parseAmountList, parseCustomAmount, progressPercent, shortDate } from '../src/lib/money.ts';

test('formats whole and fractional dollar amounts', () => {
  assert.equal(formatMoney(1250), '$1,250');
  assert.equal(formatMoney(75.5), '$75.50');
  assert.equal(formatMoney(null), '');
  assert.equal(formatMoney(Number.NaN), '');
});

test('progress is clamped and needs a goal', () => {
  assert.equal(progressPercent(25, 100), 25);
  assert.equal(progressPercent(250, 100), 100);
  assert.equal(progressPercent(10, 0), null);
  assert.equal(progressPercent(null, 100), null);
});

test('suggested amount list parsing', () => {
  assert.deepEqual(parseAmountList('51, 101 251,$501'), [51, 101, 251, 501]);
  assert.deepEqual(parseAmountList('abc, -5, 0'), []);
  assert.deepEqual(parseAmountList('10,10,20'), [10, 20]);
});

test('custom donation amount', () => {
  assert.equal(parseCustomAmount('75'), 75);
  assert.equal(parseCustomAmount('$1,000.50'), 1000.5);
  assert.equal(parseCustomAmount('7.555'), null);
  assert.equal(parseCustomAmount('0'), null);
  assert.equal(parseCustomAmount('abc'), null);
});

test('ISO dates', () => {
  assert.equal(isIsoDate('2026-12-12'), true);
  assert.equal(isIsoDate('2026-02-30'), false);
  assert.equal(isIsoDate('12/12/2026'), false);
  assert.equal(shortDate('2026-12-12'), 'Dec 12');
  assert.equal(shortDate(null), '');
});

test('moving campaigns up and down', () => {
  assert.deepEqual(moveItem(['a', 'b', 'c'], 1, -1), ['b', 'a', 'c']);
  assert.deepEqual(moveItem(['a', 'b', 'c'], 1, 1), ['a', 'c', 'b']);
  const same = ['a', 'b'];
  assert.equal(moveItem(same, 0, -1), same);
});
