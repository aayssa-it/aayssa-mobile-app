/**
 * Sample-data mode for trying the Donate screens without the API.
 * Turn on with EXPO_PUBLIC_DEMO_MODE=1 in .env.local. Nothing here is saved
 * anywhere: changes last until the app reloads. Never enable in a release build.
 */
 import type { AdminCampaign, AvailableZeffyCampaign, Campaign } from './campaigns';
 import type { DonationSummary, Member } from './member';
 
 type Request = { method: string; body?: unknown };
 
 const SAMPLE_PAGE = 'https://atlantaayyappasevasangam.org/';
 
 let rows: AdminCampaign[] = [
   row(1, 'z1', 'Sastha Preethi', 'Help sponsor pooja, annadhanam and bhajan for the annual celebration.', 5000, 3100, true, true, 1, '2026-11-01', '2026-12-12', [51, 101, 251, 501]),
   row(2, 'z2', 'Annadhanam Seva', 'Service through sharing food with devotees.', 2000, 800, true, false, 2, null, null, [21, 51, 101]),
   row(3, 'z3', 'Mandala Pooja', 'Daily pooja through the Mandala season.', 3000, 2250, true, false, 3, null, null, [51, 101, 251]),
   row(4, 'z4', 'General Fund', 'Supports all Sangam activities.', null, null, false, false, 4, null, null, [51, 101]),
 ];
 
 let available: AvailableZeffyCampaign[] = [
   { zeffyId: 'z9', title: 'Temple Utilities', goal: 1500, raised: 0, hasDonationUrl: true },
 ];
 
 const member: Member = { firstName: 'Demo', lastName: 'Board', email: 'demo@example.org', role: 'Board' };
 
 const donations: DonationSummary = {
   year: new Date().getFullYear(),
   currency: 'USD',
   totalPaidThisYear: 352,
   taxReceiptCount: 1,
   payments: [
     { id: 'p1', date: `${new Date().getFullYear()}-10-20T12:00:00Z`, amount: 251, eligibleAmount: 251, currency: 'USD', description: 'Sastha Preethi', receiptUrl: SAMPLE_PAGE },
     { id: 'p2', date: `${new Date().getFullYear()}-08-01T12:00:00Z`, amount: 101, eligibleAmount: 101, currency: 'USD', description: 'Annadhanam Seva', receiptUrl: '' },
   ],
 };
 
 function row(
   id: number, zeffyId: string, title: string, description: string,
   goal: number | null, raised: number | null, showInApp: boolean, featured: boolean,
   sortOrder: number, showFrom: string | null, showUntil: string | null, suggestedAmounts: number[],
 ): AdminCampaign {
   return {
     id, zeffyId, showInApp, featured, sortOrder, showFrom, showUntil,
     appTitle: title, shortDescription: description, suggestedAmounts, allowMonthly: true,
     imageUrl: '', donationUrl: '', zeffyTitle: title, goal, raised,
     zeffyFound: true, zeffyDonationUrl: SAMPLE_PAGE, liveInApp: showInApp,
   };
 }
 
 function sorted() {
   return rows.slice().sort((a, b) => (a.featured === b.featured ? (a.sortOrder ?? 0) - (b.sortOrder ?? 0) : a.featured ? -1 : 1));
 }
 
 function publicCampaigns(): Campaign[] {
   return sorted()
     .filter(r => r.showInApp)
     .map(r => ({
       id: r.id,
       title: r.appTitle || r.zeffyTitle,
       description: r.shortDescription,
       goal: r.goal,
       raised: r.raised,
       currency: 'USD',
       featured: r.featured,
       showUntil: r.showUntil,
       suggestedAmounts: r.suggestedAmounts,
       allowMonthly: r.allowMonthly,
       imageUrl: r.imageUrl || null,
       donateUrl: r.donationUrl || SAMPLE_PAGE,
     }));
 }
 
 function adminView() {
   return { campaigns: sorted().map(r => ({ ...r, liveInApp: r.showInApp })), availableInZeffy: available, syncedAt: new Date().toISOString() };
 }
 
 /** Answers the same paths as the real API, with sample data. */
 export async function demoApi(path: string, { method, body }: Request): Promise<unknown> {
   await new Promise(resolve => setTimeout(resolve, 350));
   const data = (body ?? {}) as Record<string, unknown>;
 
   if(path === '/register?resource=campaigns') return { success: true, campaigns: publicCampaigns() };
 
   if(path === '/login') return { success: true, message: 'Demo mode: enter any 6-digit code.' };
   if(path === '/verify-login-code') return { success: true, accessToken: 'demo', refreshToken: 'demo', expiresIn: 3600 };
   if(path === '/me') return { success: true, member };
   if(path === '/my-donations') return { success: true, donations };
 
   if(path === '/register?resource=donations') {
     if(method === 'GET') return { success: true, email: 'donor@example.org', donations: { ...donations, totalPaidThisYear: 101, payments: donations.payments.slice(1) } };
     if(data.action === 'request-code') return { success: true, message: 'Demo mode: enter any 6-digit code.' };
     return { success: true, email: String(data.email || 'donor@example.org'), accessToken: 'demo', refreshToken: 'demo', expiresIn: 3600 };
   }
 
   if(path === '/admin-members?resource=app-campaigns') {
     if(method === 'GET') return { success: true, ...adminView() };
     if(method === 'POST') {
       const item = available.find(a => a.zeffyId === data.zeffyCampaignId);
       if(!item) return { success: false, message: 'That campaign was not found in Zeffy.' };
       const created = row(Math.max(...rows.map(r => r.id)) + 1, item.zeffyId, item.title, '', item.goal, item.raised, false, false, rows.length + 1, null, null, [51, 101, 251, 501]);
       rows = [...rows, created];
       available = available.filter(a => a.zeffyId !== item.zeffyId);
       return { success: true, campaign: created };
     }
     if(data.action === 'reorder') {
       const ids = data.ids as number[];
       rows = rows.map(r => ({ ...r, sortOrder: ids.indexOf(r.id) + 1 }));
       return { success: true };
     }
     const id = Number(data.id);
     const { id: _ignored, ...changes } = data;
     if(changes.featured === true) rows = rows.map(r => ({ ...r, featured: false }));
     rows = rows.map(r => (r.id === id ? { ...r, ...(changes as Partial<AdminCampaign>) } : r));
     return { success: true, campaign: rows.find(r => r.id === id) };
   }
 
   if(path === '/session') return { success: true, accessToken: 'demo', refreshToken: 'demo', expiresIn: 3600 };
 
   return { success: false, message: `Demo mode has no sample data for ${path}.` };
 }