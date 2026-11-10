import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { useDonationSummary } from '../../components/donate/MyDonations';
import { CampaignRow, ErrorBox, FeaturedCampaign, Loading } from '../../components/donate/parts';
import { colors, d } from '../../components/donate/styles';
import { errorMessage } from '../../lib/api';
import { campaignsChanged, fetchCampaigns, type Campaign } from '../../lib/campaigns';
import { formatMoney } from '../../lib/money';
import { useAuth } from '../../providers/AuthProvider';

export default function DonateScreen() {
  const { isAdmin } = useAuth();
  const giving = useDonationSummary();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const loadedAt = useRef(0);

  const reloadGiving = giving.reload;
  const load = useCallback(async (pull = false) => {
    if(pull) {
      setRefreshing(true);
      reloadGiving();
    }
    setError('');
    try {
      setCampaigns(await fetchCampaigns());
      loadedAt.current = Date.now();
    } catch(e) {
      setError(errorMessage(e));
    } finally {
      setRefreshing(false);
    }
  }, [reloadGiving]);

  // Reload when the tab is shown again after a few minutes, so admin changes appear.
  useFocusEffect(useCallback(() => {
    if(campaignsChanged() || Date.now() - loadedAt.current > 3 * 60_000) void load();
  }, [load]));

  const featured = campaigns?.find(campaign => campaign.featured) ?? null;
  const others = (campaigns ?? []).filter(campaign => campaign !== featured);

  return (
    <ScrollView
      style={d.screen}
      contentContainerStyle={d.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[colors.saffron]} tintColor={colors.saffron} />}>
      <View style={{ gap: 6 }}>
        <Text style={d.eyebrow}>GIVE WITH DEVOTION</Text>
        <Text accessibilityRole="header" style={d.title}>Donate</Text>
        <Text style={d.body}>Choose a campaign. Every gift supports seva at the Sangam.</Text>
      </View>

      {giving.summary ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Your giving in ${giving.summary.year}: ${formatMoney(giving.summary.totalPaidThisYear, giving.summary.currency) || '$0'}. View receipts`}
          onPress={() => router.push('/my-donations')}
          style={({ pressed }) => [d.row, { paddingVertical: 12 }, pressed && d.pressed]}>
          <View style={[d.noticeIcon, { backgroundColor: colors.greenSoft }]}>
            <Ionicons accessible={false} name="heart" size={20} color={colors.green} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={d.small}>Your giving in {giving.summary.year}</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.green }}>{formatMoney(giving.summary.totalPaidThisYear, giving.summary.currency) || '$0'}</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.green }}>Receipts</Text>
          <Ionicons accessible={false} name="chevron-forward" size={16} color={colors.green} />
        </Pressable>
      ) : null}

      {campaigns === null && !error ? <Loading label="Loading campaigns…" /> : null}
      {error ? <ErrorBox message={error} onRetry={() => load()} /> : null}

      {featured ? <FeaturedCampaign campaign={featured} /> : null}

      {others.length > 0 ? (
        <>
          <Text accessibilityRole="header" style={d.section}>{featured ? 'All campaigns' : 'Campaigns'}</Text>
          <View style={{ gap: 10 }}>
            {others.map(campaign => <CampaignRow key={campaign.id} campaign={campaign} />)}
          </View>
        </>
      ) : null}

      {campaigns !== null && campaigns.length === 0 && !error ? (
        <View style={d.infoBox}>
          <Text style={d.rowTitle}>No campaigns right now</Text>
          <Text style={d.small}>Please check back soon. Pull down to refresh.</Text>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/my-donations')}
        style={({ pressed }) => [d.linkCard, pressed && d.pressed]}>
        <Ionicons accessible={false} name="document-text-outline" size={22} color={colors.green} />
        <View style={{ flex: 1 }}>
          <Text style={[d.rowTitle, { fontSize: 15 }]}>My donations & tax receipts</Text>
          <Text style={d.small}>{giving.signedIn ? 'This year’s giving and receipts' : 'Members and all donors'}</Text>
        </View>
        <Ionicons accessible={false} name="chevron-forward" size={18} color="#8B7756" />
      </Pressable>

      {isAdmin ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/admin/campaigns')}
          style={({ pressed }) => [d.linkCard, { backgroundColor: colors.saffronTint }, pressed && d.pressed]}>
          <Ionicons accessible={false} name="settings-outline" size={22} color={colors.saffronDeep} />
          <View style={{ flex: 1 }}>
            <Text style={[d.rowTitle, { fontSize: 15 }]}>Manage app campaigns</Text>
            <Text style={d.small}>Board / Admin</Text>
          </View>
          <Ionicons accessible={false} name="chevron-forward" size={18} color="#8B7756" />
        </Pressable>
      ) : null}
    </ScrollView>
  );
}