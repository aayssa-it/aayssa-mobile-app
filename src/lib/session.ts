import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { API_URL } from './config';

/** member: signed in with the membership passcode. donor: verified a donation email only. */
export type SessionKind = 'member' | 'donor';
export type Session = { accessToken: string; refreshToken: string; expiresAt: number; kind: SessionKind; email: string };

const KEY = 'aayssa.session';

// Secure storage is native-only. The browser preview keeps the session in memory.
let memory: string | null = null;
let current: Session | null = null;
let loaded = false;
let refreshing: Promise<Session | null> | null = null;

async function read(): Promise<string | null> {
  if(Platform.OS === 'web') return memory;
  return SecureStore.getItemAsync(KEY);
}

async function write(value: string | null) {
  if(Platform.OS === 'web') {
    memory = value;
    return;
  }
  if(value === null) await SecureStore.deleteItemAsync(KEY);
  else await SecureStore.setItemAsync(KEY, value);
}

export function parseSession(value: string | null): Session | null {
  if(!value) return null;
  try {
    const data = JSON.parse(value) as Partial<Session>;
    if(typeof data.accessToken === 'string' && typeof data.refreshToken === 'string' && typeof data.expiresAt === 'number') {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        kind: data.kind === 'donor' ? 'donor' : 'member',
        email: typeof data.email === 'string' ? data.email : '',
      };
    }
  } catch {
    // Corrupt value: treat as signed out.
  }
  return null;
}

export async function loadSession() {
  if(!loaded) {
    current = parseSession(await read().catch(() => null));
    loaded = true;
  }
  return current;
}

export async function saveTokens(
  tokens: { accessToken: string; refreshToken: string; expiresIn: number },
  identity: { kind: SessionKind; email: string } = { kind: current?.kind ?? 'member', email: current?.email ?? '' },
) {
  current = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: Date.now() + Math.max(60, tokens.expiresIn) * 1000,
    kind: identity.kind,
    email: identity.email,
  };
  loaded = true;
  await write(JSON.stringify(current));
  return current;
}

export async function clearSession() {
  current = null;
  loaded = true;
  await write(null).catch(() => undefined);
}

/** True when the access token expires within the next minute. */
export function isExpiring(session: Session, now = Date.now()) {
  return session.expiresAt - now < 60_000;
}

/** Exchanges the refresh token once, even if several requests ask at the same time. */
export function refreshSession(): Promise<Session | null> {
  if(!refreshing) {
    refreshing = (async () => {
      const session = await loadSession();
      if(!session) return null;
      try {
        const res = await fetch(`${API_URL}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Client': 'mobile' },
          body: JSON.stringify({ action: 'refresh', refreshToken: session.refreshToken }),
        });
        const data = await res.json().catch(() => ({}));
        if(res.ok && data.success && data.accessToken && data.refreshToken) {
          return saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, expiresIn: Number(data.expiresIn) || 3600 });
        }
        if(res.status === 401) await clearSession();
        return null;
      } catch {
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

/** A usable access token, refreshed if it is about to expire. */
export async function getAccessToken() {
  const session = await loadSession();
  if(!session) return null;
  if(!isExpiring(session)) return session.accessToken;
  return (await refreshSession())?.accessToken ?? null;
}