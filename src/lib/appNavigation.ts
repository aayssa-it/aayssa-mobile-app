import { sevaDescriptions } from '../data/organization.ts';

/** Only app shortcuts use native routes; source buttons always open live pages. */
export function nativeDestination(path: string) {
  const seva = sevaDescriptions.find(item => item.path === path);
  if (seva) return { pathname: '/seva' as const, params: { id: seva.id } };
  switch (path) {
    case '/calendar': return { pathname: '/calendar' as const };
    case '/gallery': return { pathname: '/gallery' as const };
    case '/contact-us': return { pathname: '/contact-us' as const };
    case '/about-us': return { pathname: '/about' as const };
    default: return null;
  }
}

// Allow at least 80 points per tab at the user's text size.
export function shouldUseCompactTabs(width: number, fontScale: number) {
  return width < 400 * Math.max(1, fontScale);
}
