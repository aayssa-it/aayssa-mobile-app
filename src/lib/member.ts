import { api } from './api';

export type Member = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'Member' | 'Board' | 'Admin' | string;
};

export type DonationSummary = {
  year: number;
  currency: string;
  totalPaidThisYear: number;
  taxReceiptCount: number;
  payments: {
    id: string;
    date: string;
    amount: number;
    eligibleAmount: number;
    currency: string;
    description: string;
    receiptUrl: string;
  }[];
};

/** Sends the one-time passcode. The API answers generically whether or not the email is a member. */
export async function requestLoginCode(email: string) {
  const data = await api<{ message?: string }>('/login', { method: 'POST', body: { email } });
  return data.message ?? 'If this email belongs to an AAYSSA membership, a passcode has been sent.';
}

export function verifyLoginCode(email: string, code: string) {
  return api<{ accessToken: string; refreshToken: string; expiresIn: number }>('/verify-login-code', {
    method: 'POST',
    body: { email, code },
  });
}

export async function fetchMember() {
  const data = await api<{ member: Member }>('/me', { auth: true });
  return data.member;
}

export async function fetchMyDonations() {
  const data = await api<{ donations: DonationSummary }>('/my-donations', { auth: true });
  return data.donations;
}

export function isBoardOrAdmin(member: Member | null) {
  return member?.role === 'Board' || member?.role === 'Admin';
}

/** Any donor (member or not) can verify an email to see that email's donations. */
export async function requestDonorCode(email: string) {
  const data = await api<{ message?: string }>('/register?resource=donations', { method: 'POST', body: { action: 'request-code', email } });
  return data.message ?? 'A verification code has been sent to your email.';
}

export function verifyDonorCode(email: string, code: string) {
  return api<{ email: string; accessToken: string; refreshToken: string; expiresIn: number }>('/register?resource=donations', {
    method: 'POST',
    body: { action: 'verify', email, code },
  });
}

export async function fetchDonorDonations() {
  const data = await api<{ email: string; donations: DonationSummary }>('/register?resource=donations', { auth: true });
  return data.donations;
}

/** Members use the household lookup (/my-donations); donors use their verified email. */
export function fetchDonationSummaryFor(kind: 'member' | 'donor') {
  return kind === 'member' ? fetchMyDonations() : fetchDonorDonations();
}