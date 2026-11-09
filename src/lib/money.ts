/** Pure helpers shared by the donation screens. Tested in tests/money.test.mjs. */

export function formatMoney(amount: number | null | undefined, currency = 'USD') {
    if(amount === null || amount === undefined || !Number.isFinite(amount)) return '';
    const whole = Math.round(amount * 100) % 100 === 0;
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `$${whole ? Math.round(amount) : amount.toFixed(2)}`;
    }
  }
  
  /** 0–100, or null when the campaign has no goal. */
  export function progressPercent(raised: number | null | undefined, goal: number | null | undefined) {
    if(!goal || goal <= 0 || raised === null || raised === undefined || !Number.isFinite(raised)) return null;
    return Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));
  }
  
  /** Parses "51, 101 251" into [51, 101, 251]; ignores anything that is not a positive amount. */
  export function parseAmountList(text: string) {
    const amounts = text
      .split(/[,\s]+/)
      .map(part => Number(part.replace(/\$/g, '')))
      .filter(value => Number.isFinite(value) && value > 0 && value <= 100000)
      .map(value => Math.round(value * 100) / 100);
    return Array.from(new Set(amounts)).slice(0, 6);
  }
  
  /** A custom amount typed by the donor, or null if it is not a valid amount. */
  export function parseCustomAmount(text: string) {
    const cleaned = text.replace(/[$,\s]/g, '');
    if(!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
    const value = Number(cleaned);
    return value > 0 && value <= 100000 ? value : null;
  }
  
  export function isIsoDate(text: string) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
    const date = new Date(`${text}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text;
  }
  
  /** "2026-12-12" → "Dec 12". */
  export function shortDate(iso: string | null | undefined) {
    if(!iso || !isIsoDate(iso)) return '';
    const [, month, day] = iso.split('-').map(Number);
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${names[month - 1]} ${day}`;
  }
  
  /** Moves one item up or down; returns the same array when the move is out of range. */
  export function moveItem<T>(items: T[], index: number, delta: number) {
    const target = index + delta;
    if(index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }