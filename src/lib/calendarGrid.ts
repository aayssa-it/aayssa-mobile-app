export function monthKey(date: string) {
  return date.slice(0, 7);
}

export function monthKeys(from: string, to: string) {
  const [startYear, startMonth] = from.split('-').map(Number);
  const [endYear, endMonth] = to.split('-').map(Number);
  const result: string[] = [];
  let year = startYear;
  let month = startMonth;
  while(year < endYear || (year === endYear && month <= endMonth)) {
    result.push(`${year}-${String(month).padStart(2, '0')}`);
    month += 1;
    if(month === 13) {
      month = 1;
      year += 1;
    }
  }
  return result;
}

export function calendarCells(key: string) {
  const [year, month] = key.split('-').map(Number);
  const leading = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for(let day = 1; day <= days; day += 1) {
    cells.push(`${key}-${String(day).padStart(2, '0')}`);
  }
  while(cells.length % 7) cells.push(null);
  return cells;
}
