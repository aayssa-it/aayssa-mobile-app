import { api } from './api';

export type Member = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'Member' | 'Board' | 'Admin' | string;
  mobileNumber?: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseEmail?: string;
  address?: string;
  noOfAdults?: number | string;
  noOfKids?: number | string;
  emailOptIn?: boolean;
  textOptIn?: boolean;
};

export type Volunteer = {
  id?: number | string;
  memberType: 'primary' | 'spouse' | 'additional' | string;
  memberTypeLabel?: string;
  name?: string;
  relationship?: string;
  interested: boolean;
  areas: string[];
  active?: boolean;
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

export async function updateMemberProfile(profile: Member) {
  const data = await api<{ member: Member }>('/update-profile', { method: 'POST', auth: true, body: { profile } });
  return data.member;
}

export async function fetchMyVolunteers() {
  const data = await api<{ volunteers: Volunteer[] }>('/my-volunteers', { auth: true });
  return data.volunteers ?? [];
}

export async function updateMyVolunteers(volunteers: Volunteer[]) {
  const data = await api<{ volunteers: Volunteer[] }>('/update-volunteers', { method: 'POST', auth: true, body: { volunteers } });
  return data.volunteers ?? [];
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

export type MembershipRegistration = {
  firstName: string;
  lastName: string;
  spouseFirstName: string;
  spouseLastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  noOfKids: string;
  noOfAdults: string;
  primaryVolunteer: { interested: boolean; areas: string[] };
  spouseVolunteer: { interested: boolean; areas: string[] };
  additionalVolunteers: never[];
  emailOptIn: boolean;
  textOptIn: boolean;
};

export async function registerMembership(registration: MembershipRegistration) {
  const data = await api<{ message?: string }>('/register', { method: 'POST', body: registration });
  return data.message ?? 'Your AAYSSA membership registration was submitted. Please check your email for a welcome message.';
}

export type MaaladharanRegistration = {
  id: number;
  participantType: 'primary' | 'spouse' | 'additional' | string;
  participantName: string;
  age: number;
  phoneNumber: string;
  maaladharanDate: string;
  firstDeeksha: boolean;
  padiStatus: string;
  irumudiOffering: string;
  memberNotes?: string;
  status: string;
};

export type MaaladharanData = {
  season: string;
  seasonStart: string;
  seasonEnd: string;
  registrations: MaaladharanRegistration[];
};

export function fetchMaaladharanRegistrations() {
  return api<MaaladharanData>('/my-volunteers?resource=maaladharan', { auth: true });
}

export function registerMaaladharan(registration: Omit<MaaladharanRegistration, 'id' | 'status'>) {
  return api<MaaladharanData>('/my-volunteers?resource=maaladharan', { method: 'POST', auth: true, body: registration });
}

export function updateMaaladharanRegistration(update: { id: number; action: 'update' | 'withdraw'; maaladharanDate?: string; padiStatus?: string; irumudiOffering?: string; memberNotes?: string }) {
  return api<MaaladharanData>('/my-volunteers?resource=maaladharan', { method: 'PATCH', auth: true, body: update });
}
