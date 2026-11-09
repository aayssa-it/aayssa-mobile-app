import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdminGate } from '../../components/donate/AdminGate';
import { ErrorBox, Loading, TopBar } from '../../components/donate/parts';
import { colors, d } from '../../components/donate/styles';
import { errorMessage } from '../../lib/api';
import { ZEFFY_DASHBOARD_URL } from '../../lib/config';
import {
  addCampaignToApp,
  fetchAdminCampaigns,
  reorderAdminCampaigns,
  updateAdminCampaign,
  type AdminCampaign,
  type AvailableZeffyCampaign,
} from '../../lib/campaigns';
import { moveItem, shortDate } from '../../lib/money';

function minutesAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  return minutes < 1 ? 'just now' : `${minutes} min ago`;
}

function windowLabel(campaign: AdminCampaign) {
  if(!campaign.showFrom && !campaign.showUntil) return 'Always on';
  if(campaign.showFrom && campaign.showUntil) return `Shows ${shortDate(campaign.showFrom)} – ${shortDate(campaign.showUntil)}`;
  return campaign.showFrom ? `Shows from ${shortDate(campaign.showFrom)}` : `Shows until ${shortDate(campaign.showUntil)}`;
}

function warning(campaign: AdminCampaign) {
  if(!campaign.zeffyFound) return 'Not found in Zeffy (deleted or archived).';
  if(!campaign.donationUrl && !campaign.zeffyDonationUrl) return 'No donation link. Add one in Edit.';
  if(campaign.showInApp && !campaign.liveInApp) return 'Outside its show dates, so hidden for now.';
  return '';
}

function CampaignsManager() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[] | null>(null);
  const [available, setAvailable] = useState<AvailableZeffyCampaign[]>([]);
  const [syncedAt, setSyncedAt] = useState('');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (pull = false) => {
    if(pull) setRefreshing(true);
    setError('');
    try {
      const data = await fetchAdminCampaigns();
      setCampaigns(data.campaigns);
      setAvailable(data.availableInZeffy);
      setSyncedAt(data.syncedAt);
    } catch(e) {
      setError(errorMessage(e));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  /** Applies a change on screen at once and rolls back if the server refuses it. */
  const run = async (key: string, optimistic: AdminCampaign[], action: () => Promise<unknown>) => {
    if(!campaigns || busy) return;
    const previous = campaigns;
    setBusy(key);
    setError('');
    setCampaigns(optimistic);
    try {
      await action();
       // Re-read from the server so "showing" counts and date warnings are exact.
       void load();
    } catch(e) {
      setCampaigns(previous);
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const toggleShow = (campaign: AdminCampaign) => run(
    `show-${campaign.id}`,
    campaigns!.map(c => c.id === campaign.id ? { ...c, showInApp: !c.showInApp } : c),
    () => updateAdminCampaign(campaign.id, { showInApp: !campaign.showInApp }),
  );

  const makeFeatured = (campaign: AdminCampaign) => {
    if(campaign.featured) return;
    void run(
      `feat-${campaign.id}`,
      campaigns!.map(c => ({ ...c, featured: c.id === campaign.id })),
      () => updateAdminCampaign(campaign.id, { featured: true }),
    );
  };

  const move = (index: number, delta: number) => {
    const next = moveItem(campaigns!, index, delta);
    if(next === campaigns) return;
    void run('order', next, () => reorderAdminCampaigns(next.map(c => c.id)));
  };

  const add = async (item: AvailableZeffyCampaign) => {
    if(busy) return;
    setBusy(`add-${item.zeffyId}`);
    setError('');
    try {
      const created = await addCampaignToApp(item.zeffyId);
      router.push({ pathname: '/admin/campaign/[id]', params: { id: String(created.id) } });
    } catch(e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  // Zeffy's API cannot create campaigns, so Board members build them on Zeffy's website.
  // When the browser closes, refresh so the new campaign shows under "New in Zeffy".
  const createInZeffy = async () => {
    try {
      await WebBrowser.openBrowserAsync(ZEFFY_DASHBOARD_URL, { toolbarColor: colors.green, controlsColor: colors.cream, createTask: false });
    } finally {
      void load();
    }
  };

  if(!campaigns) {
    return error ? <View style={d.scroll}><ErrorBox message={error} onRetry={() => load()} /></View> : <Loading label="Loading campaigns…" />;
  }

  const liveCount = campaigns.filter(c => c.liveInApp).length;

  return (
    <ScrollView
      contentContainerStyle={[d.scroll, { gap: 14 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[colors.saffron]} tintColor={colors.saffron} />}>
      <View style={d.syncNote}>
        <Ionicons accessible={false} name="refresh" size={16} color={colors.green} />
        <Text style={[d.small, { color: colors.body }]}>Synced from Zeffy · {syncedAt ? minutesAgo(syncedAt) : '—'} · pull to refresh</Text>
      </View>

      {error ? <ErrorBox message={error} /> : null}

      <Text accessibilityRole="header" style={[d.section, { fontSize: 16 }]}>In the app · {liveCount} showing</Text>

      {campaigns.length === 0 ? <Text style={d.body}>No campaigns added yet. Add one from Zeffy below.</Text> : null}

      {campaigns.map((campaign, index) => {
        const note = warning(campaign);
        const title = campaign.appTitle || campaign.zeffyTitle || 'Untitled campaign';
        return (
          <View key={campaign.id} style={d.adminCard}>
            <View style={d.adminHead}>
              <View style={d.order}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Move ${title} up`} disabled={index === 0 || !!busy} onPress={() => move(index, -1)} style={[d.orderButton, index === 0 && d.disabled]}>
                  <Ionicons accessible={false} name="chevron-up" size={16} color={colors.muted} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Move ${title} down`} disabled={index === campaigns.length - 1 || !!busy} onPress={() => move(index, 1)} style={[d.orderButton, index === campaigns.length - 1 && d.disabled]}>
                  <Ionicons accessible={false} name="chevron-down" size={16} color={colors.muted} />
                </Pressable>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Text style={d.rowTitle} numberOfLines={2}>{title}</Text>
                <Text style={d.small}>{windowLabel(campaign)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Edit ${title}`}
                onPress={() => router.push({ pathname: '/admin/campaign/[id]', params: { id: String(campaign.id) } })}
                style={({ pressed }) => [d.edit, pressed && d.pressed]}>
                <Text style={d.editText}>Edit</Text>
              </Pressable>
            </View>

            <View style={d.pills}>
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: campaign.showInApp, busy: busy === `show-${campaign.id}` }}
                accessibilityLabel={`Show ${title} in app`}
                onPress={() => toggleShow(campaign)}
                style={[d.pill, campaign.showInApp
                  ? { backgroundColor: colors.greenSoft, borderColor: '#9DBFAE' }
                  : { backgroundColor: colors.sand, borderColor: colors.line }]}>
                <Ionicons accessible={false} name={campaign.showInApp ? 'eye-outline' : 'eye-off-outline'} size={16} color={campaign.showInApp ? colors.greenInk : colors.body} />
                <Text style={[d.pillText, { color: campaign.showInApp ? colors.greenInk : colors.body }]}>{campaign.showInApp ? 'Showing in app' : 'Hidden'}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: campaign.featured }}
                accessibilityLabel={campaign.featured ? `${title} is featured` : `Make ${title} featured`}
                onPress={() => makeFeatured(campaign)}
                style={[d.pill, campaign.featured
                  ? { backgroundColor: colors.saffronTint, borderColor: colors.peach }
                  : { backgroundColor: colors.card, borderColor: colors.line }]}>
                <Ionicons accessible={false} name={campaign.featured ? 'star' : 'star-outline'} size={16} color={campaign.featured ? colors.saffronDeep : colors.body} />
                <Text style={[d.pillText, { color: campaign.featured ? colors.saffronDeep : colors.body }]}>{campaign.featured ? 'Featured' : 'Make featured'}</Text>
              </Pressable>
            </View>

            {note ? <Text style={[d.small, { color: colors.saffronDeep }]}>{note}</Text> : null}
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
        <Text accessibilityRole="header" style={[d.section, { fontSize: 16, marginTop: 0 }]}>New in Zeffy</Text>
        <Pressable
          accessibilityRole="link"
          accessibilityHint="Opens Zeffy's website to create a new campaign"
          onPress={createInZeffy}
          style={({ pressed }) => [d.outline, { minHeight: 44, borderRadius: 10, flexDirection: 'row', gap: 6, paddingHorizontal: 12 }, pressed && d.pressed]}>
          <Ionicons accessible={false} name="add" size={16} color={colors.green} />
          <Text style={[d.outlineText, { fontSize: 13 }]}>Create in Zeffy</Text>
        </Pressable>
      </View>
      <Text style={[d.small, { marginTop: -6, lineHeight: 18 }]}>Not in the app yet. New campaigns made on Zeffy’s website appear here, ready to add.</Text>
      {available.length === 0 ? <Text style={d.small}>Every Zeffy campaign is already in the list above.</Text> : null}
      {available.map(item => (
        <View key={item.zeffyId} style={d.dashed}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={d.rowTitle}>{item.title || 'Untitled Zeffy campaign'}</Text>
            <Text style={d.small}>{item.hasDonationUrl ? 'Ready to add' : 'Needs a donation link after adding'}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Add ${item.title} to app`} disabled={!!busy} onPress={() => add(item)} style={({ pressed }) => [d.addButton, !!busy && d.disabled, pressed && d.pressed]}>
            <Text style={d.addText}>{busy === `add-${item.zeffyId}` ? 'Adding…' : 'Add to app'}</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

export default function AdminCampaignsScreen() {
  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="Donate" title="App campaigns" right={<Text style={d.adminTag}>ADMIN</Text>} />
      <AdminGate>
        <CampaignsManager />
      </AdminGate>
    </SafeAreaView>
  );
}
