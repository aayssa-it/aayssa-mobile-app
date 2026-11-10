import assert from 'node:assert/strict';
import test from 'node:test';

import { calendarCells, monthKey, monthKeys } from '../src/lib/calendarGrid.ts';

test('calendar month range includes every month across a year boundary', () => {
  assert.deepEqual(monthKeys('2026-11-09', '2027-03-09'), [
    '2026-11', '2026-12', '2027-01', '2027-02', '2027-03',
  ]);
  assert.equal(monthKey('2026-11-15'), '2026-11');
});

test('calendar cells align dates to Sunday and complete the final week', () => {
  const cells = calendarCells('2026-11');
  assert.equal(cells.length % 7, 0);
  assert.equal(cells[0], '2026-11-01');
  assert.equal(cells[29], '2026-11-30');
  assert.equal(cells.at(-1), null);

  const december = calendarCells('2026-12');
  assert.equal(december[0], null);
  assert.equal(december[2], '2026-12-01');
  assert.equal(december.length, 35);
});
