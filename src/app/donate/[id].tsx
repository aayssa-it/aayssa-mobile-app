import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBox, Loading, ProgressBar, raisedLine, TopBar } from '../../components/donate/parts';
import { colors, d } from '../../components/donate/styles';
import { errorMessage } from '../../lib/api';
import { fetchCampaign, type Campaign } from '../../lib/campaigns';
import { progressPercent } from '../../lib/money';

export default function CampaignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);

  const apply = (found: Campaign | null) => {
    if(!found) {
      setError('This campaign is no longer available.');
      return;
    }
    setCampaign(found);
  };

  useEffect(() => {
    let active = true;
    fetchCampaign(Number(id))
      .then(found => { if(active) apply(found); })
      .catch(e => { if(active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [id]);

  const load = async () => {
    setError('');
    try {
      apply(await fetchCampaign(Number(id)));
    } catch(e) {
      setError(errorMessage(e));
    }
  };

  const donate = async () => {
    if(!campaign || opening) return;
    setOpening(true);
    try {
      // Payment happens on AAYSSA's Zeffy form in a Chrome Custom Tab over the app
      // (Google Play requires donations to be collected outside the app's own UI).
      // The donor chooses the amount (one-time or monthly) on the form itself,
      // so the app does not ask for an amount first.
      await WebBrowser.openBrowserAsync(campaign.donateUrl, {
        toolbarColor: colors.green,
        controlsColor: colors.cream,
        secondaryToolbarColor: colors.green,
        showTitle: true,
        enableBarCollapsing: true,
        createTask: false,
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
      router.push({ pathname: '/donate/thanks', params: { title: campaign.title } });
    } catch {
      setError('The donation page could not be opened. Please try again.');
    } finally {
      setOpening(false);
    }
  };

  if(!campaign) {
    return (
      <SafeAreaView style={d.screen} edges={['top', 'left', 'right']}>
        <TopBar label="Campaigns" />
        {error ? <View style={{ padding: 20 }}><ErrorBox message={error} onRetry={load} /></View> : <Loading />}
      </SafeAreaView>
    );
  }

  const percent = progressPercent(campaign.raised, campaign.goal);
  const line = raisedLine(campaign);

  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="Campaigns" />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {campaign.imageUrl ? (
            <View style={d.heroImageWrap}>
              <Image source={{ uri: campaign.imageUrl }} style={d.heroImage} resizeMode="contain" accessibilityIgnoresInvertColors accessible={false} />
            </View>
          ) : null}
          <View style={[d.hero, campaign.imageUrl ? d.heroCompact : null]}>
            <Text style={d.heroKicker}>CAMPAIGN</Text>
            <Text accessibilityRole="header" style={d.heroTitle}>{campaign.title}</Text>
          </View>

          <View style={[d.scroll, { paddingTop: 18 }]}>
            {percent !== null || line ? (
              <View style={{ gap: 8 }}>
                {percent !== null ? <ProgressBar percent={percent} height={10} /> : null}
                {line ? (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={d.body}><Text style={{ fontWeight: '700', color: colors.ink }}>{line.raised}</Text> raised</Text>
                    {line.goal ? <Text style={d.body}>Goal {line.goal}</Text> : null}
                  </View>
                ) : null}
              </View>
            ) : null}

            {campaign.description ? <Text style={d.body}>{campaign.description}</Text> : null}

            {error ? <ErrorBox message={error} /> : null}
          </View>
        </ScrollView>

        <View style={d.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Opens AAYSSA's secure Zeffy donation page"
            disabled={opening}
            onPress={donate}
            style={({ pressed }) => [d.primary, opening && d.disabled, pressed && d.pressed]}>
            <Text style={d.primaryText}>{opening ? 'Opening…' : 'Donate'}</Text>
            <Ionicons accessible={false} name="arrow-forward" size={18} color={colors.cream} />
          </Pressable>
          <View style={d.secure}>
            <Ionicons accessible={false} name="lock-closed-outline" size={14} color={colors.muted} />
            <Text style={d.small}>Choose your amount on AAYSSA&apos;s secure Zeffy page</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}