import { api } from './api';

export type CalendarStatus = 'Available' | 'Booked' | 'Blocked';

export type CalendarDate = {
  date: string;
  time?: string;
  status: CalendarStatus;
  reason?: string;
  requesterName?: string;
  bookingId?: number;
  bookingTime?: string;
  poojaAddress?: string;
  eventReference?: string;
  eventName?: string;
  eventTime?: string;
  eventAddress?: string;
  rsvpSummary?: {
    attendingGuests?: number;
    attendingAdults?: number;
    attendingKids?: number;
    maybeGuests?: number;
  };
};

export type HomePoojaCalendar = {
  from: string;
  to: string;
  dates: CalendarDate[];
};

export async function fetchHomePoojaCalendar() {
  const data = await api<{ calendar: HomePoojaCalendar }>('/register?resource=home-pooja');
  return data.calendar;
}

export type HomePoojaRequest = {
  id: number;
  poojaDate: string;
  preferredTime: string;
  requesterName: string;
  email: string;
  phoneNumber: string;
  poojaAddress: string;
  requesterNote?: string;
  adminNotes?: string;
  status: string;
  entryType?: string;
};

export type RsvpResponse = {
  attendeeName: string;
  status: string;
  adults: number;
  kids: number;
  email?: string;
  phone?: string;
  notes?: string;
};

export type RsvpGroup = {
  type: string;
  date: string;
  name?: string;
  time?: string;
  responses: RsvpResponse[];
  summary?: {
    attending?: { households?: number; adults?: number; kids?: number };
    maybe?: { households?: number; adults?: number; kids?: number };
  };
};

export async function fetchMemberHomePooja() {
  const data = await api<{ requests: HomePoojaRequest[]; calendar: HomePoojaCalendar }>('/my-volunteers?resource=home-pooja', { auth: true });
  return data;
}

export async function bookHomePooja(body: { requesterName: string; phoneNumber: string; poojaDate: string; poojaAddress: string; requesterNote: string }) {
  return api<{ message?: string }>('/my-volunteers?resource=home-pooja', { method: 'POST', auth: true, body });
}

export async function fetchAdminHomePooja() {
  return api<{ entries: HomePoojaRequest[]; calendar: HomePoojaCalendar }>('/admin-members?resource=home-pooja', { auth: true });
}

export async function fetchHomePoojaRsvps(admin: boolean) {
  const path = admin ? '/admin-members?resource=rsvp' : '/my-volunteers?resource=rsvp';
  const data = await api<{ groups: RsvpGroup[] }>(path, { auth: true });
  return data.groups;
}

export function updateHomePoojaAdmin(method: 'POST' | 'PATCH', body: Record<string, unknown>) {
  return api<{ message?: string }>('/admin-members?resource=home-pooja', { method, auth: true, body });
}
