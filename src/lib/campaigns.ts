import { api } from './api';

/** A campaign as shown on the Donate tab. Comes from GET /register?resource=campaigns. */
export type Campaign = {
  id: number;
  title: string;
  description: string;
  goal: number | null;
  raised: number | null;
  currency: string;
  featured: boolean;
  showUntil: string | null;
  suggestedAmounts: number[];
  allowMonthly: boolean;
  imageUrl: string | null;
  donateUrl: string;
};

/** A row of the AAYSSA_App_Campaigns table merged with Zeffy data (admin only). */
export type AdminCampaign = {
  id: number;
  zeffyId: string;
  showInApp: boolean;
  featured: boolean;
  sortOrder: number | null;
  showFrom: string | null;
  showUntil: string | null;
  appTitle: string;
  shortDescription: string;
  suggestedAmounts: number[];
  allowMonthly: boolean;
  imageUrl: string;
  donationUrl: string;
  zeffyTitle: string;
  goal: number | null;
  raised: number | null;
  zeffyFound: boolean;
  zeffyDonationUrl: string | null;
  liveInApp: boolean;
};

export type AvailableZeffyCampaign = {
  zeffyId: string;
  title: string;
  goal: number | null;
  raised: number | null;
  hasDonationUrl: boolean;
};

export type CampaignUpdate = Partial<{
  showInApp: boolean;
  featured: boolean;
  appTitle: string;
  shortDescription: string;
  showFrom: string;
  showUntil: string;
  suggestedAmounts: number[];
  allowMonthly: boolean;
  donationUrl: string;
}>;

let cached: Campaign[] = [];
let stale = false;

export async function fetchCampaigns() {
  const data = await api<{ campaigns: Campaign[] }>('/register?resource=campaigns');
  cached = data.campaigns;
  stale = false;
  return cached;
}

/** True after a Board change, so the Donate tab reloads when it is shown again. */
export function campaignsChanged() {
  return stale;
}
/** The campaign from the last list load, so the detail screen opens instantly. */
export function cachedCampaign(id: number) {
  return cached.find(campaign => campaign.id === id) ?? null;
}

export async function fetchCampaign(id: number) {
  return cachedCampaign(id) ?? (await fetchCampaigns()).find(campaign => campaign.id === id) ?? null;
}

const ADMIN = '/admin-members?resource=app-campaigns';

export function fetchAdminCampaigns() {
  return api<{ campaigns: AdminCampaign[]; availableInZeffy: AvailableZeffyCampaign[]; syncedAt: string }>(ADMIN, { auth: true });
}

export async function updateAdminCampaign(id: number, update: CampaignUpdate) {
  stale = true;
  const data = await api<{ campaign: AdminCampaign }>(ADMIN, { method: 'PATCH', auth: true, body: { id, ...update } });
  return data.campaign;
}

export function reorderAdminCampaigns(ids: number[]) {
  stale = true;
  return api<{ success: true }>(ADMIN, { method: 'PATCH', auth: true, body: { action: 'reorder', ids } });
}

export async function addCampaignToApp(zeffyCampaignId: string) {
  stale = true;
  const data = await api<{ campaign: AdminCampaign }>(ADMIN, { method: 'POST', auth: true, body: { zeffyCampaignId } });
  return data.campaign;
}