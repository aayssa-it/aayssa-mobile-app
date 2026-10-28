export const SITE = 'https://atlantaayyappasevasangam.org';
const ORGANIZATION_HOST = 'atlantaayyappasevasangam.org';

const aliases: Record<string, string> = {
  '/calendar': 'https://portal.atlantaayyappasevasangam.org/home-pooja-calendar.html',
  '/member-login': 'https://portal.atlantaayyappasevasangam.org/',
};

export type Destination =
  | { kind: 'website'; url: string }
  | { kind: 'external'; url: string }
  | { kind: 'blocked' };

/** Accept only organization HTTPS pages in the embedded browser. */
export function classifyUrl(value: string): Destination {
  try {
    const url = new URL(value);
    if(url.username || url.password) return { kind: 'blocked' };

    const organization =
      url.hostname === ORGANIZATION_HOST ||
      url.hostname.endsWith(`.${ORGANIZATION_HOST}`);
    if(url.protocol === 'https:' && organization && !url.port) {
      return { kind: 'website', url: url.href };
    }
    if(['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) {
      return { kind: 'external', url: url.href };
    }
  } catch {
    // Invalid URLs and unsupported schemes never reach a WebView or the OS.
  }
  return { kind: 'blocked' };
}

export function resolveDestination(path: string): Destination {
  try {
    return classifyUrl(aliases[path] ?? new URL(path, SITE).href);
  } catch {
    return { kind: 'blocked' };
  }
}

/** HTTPS subframes may contain embeds; top-level external pages leave the app. */
export function navigationAction(url: string, isTopFrame = true) {
  if(url === 'about:blank') return 'allow';
  const destination = classifyUrl(url);
  if(destination.kind === 'website') return 'allow';
  if(destination.kind === 'external') {
    if(!isTopFrame) return url.startsWith('https://') ? 'allow' : 'block';
    return 'external';
  }
  return 'block';
}
