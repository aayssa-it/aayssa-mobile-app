import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { ApiError } from '../lib/api';
import {
  fetchDonationSummaryFor,
  fetchMember,
  isBoardOrAdmin,
  requestDonorCode,
  requestLoginCode,
  verifyDonorCode,
  verifyLoginCode,
  type DonationSummary,
  type Member,
} from '../lib/member';
import { clearSession, loadSession, saveTokens } from '../lib/session';

/**
 * signedOut: nobody signed in.
 * member:    signed in with the membership passcode (portal account).
 * donor:     verified a donation email only; can see that email's donations, nothing else.
 */
type Status = 'loading' | 'signedOut' | 'member' | 'donor';

type AuthState = {
  status: Status;
  member: Member | null;
  donorEmail: string;
  isAdmin: boolean;
  requestCode: (email: string) => Promise<string>;
  signIn: (email: string, code: string) => Promise<Member>;
  requestDonorCode: (email: string) => Promise<string>;
  verifyDonor: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** This year's donations for whoever is signed in (member or donor). */
  loadDonations: () => Promise<DonationSummary>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<Status>('loading');
  const [member, setMember] = useState<Member | null>(null);
  const [donorEmail, setDonorEmail] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const session = await loadSession();
      if(!session) {
        if(active) setStatus('signedOut');
        return;
      }
      if(session.kind === 'donor') {
        if(active) {
          setDonorEmail(session.email);
          setStatus('donor');
        }
        return;
      }
      try {
        const profile = await fetchMember();
        if(!active) return;
        setMember(profile);
        setStatus('member');
      } catch(error) {
        if(error instanceof ApiError && (error.status === 401 || error.status === 403)) await clearSession();
        if(active) setStatus('signedOut');
      }
    })();
    return () => { active = false; };
  }, []);

  const requestCode = useCallback((email: string) => requestLoginCode(email.trim().toLowerCase()), []);

  const signIn = useCallback(async (email: string, code: string) => {
    const normalized = email.trim().toLowerCase();
    const tokens = await verifyLoginCode(normalized, code.replace(/\D/g, ''));
    await saveTokens(tokens, { kind: 'member', email: normalized });
    try {
      const profile = await fetchMember();
      setMember(profile);
      setDonorEmail('');
      setStatus('member');
      return profile;
    } catch(error) {
      await clearSession();
      setStatus('signedOut');
      throw error;
    }
  }, []);

  const sendDonorCode = useCallback((email: string) => requestDonorCode(email.trim().toLowerCase()), []);

  const verifyDonor = useCallback(async (email: string, code: string) => {
    const result = await verifyDonorCode(email.trim().toLowerCase(), code.replace(/\D/g, ''));
    await saveTokens(result, { kind: 'donor', email: result.email });
    setMember(null);
    setDonorEmail(result.email);
    setStatus('donor');
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setMember(null);
    setDonorEmail('');
    setStatus('signedOut');
  }, []);

  const loadDonations = useCallback(() => {
    if(status !== 'member' && status !== 'donor') return Promise.reject(new ApiError('Please sign in.', 401));
    return fetchDonationSummaryFor(status);
  }, [status]);

  const value = useMemo(() => ({
    status,
    member,
    donorEmail,
    isAdmin: status === 'member' && isBoardOrAdmin(member),
    requestCode,
    signIn,
    requestDonorCode: sendDonorCode,
    verifyDonor,
    signOut,
    loadDonations,
  }), [status, member, donorEmail, requestCode, signIn, sendDonorCode, verifyDonor, signOut, loadDonations]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if(!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}