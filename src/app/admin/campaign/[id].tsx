import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdminGate } from '../../../components/donate/AdminGate';
import { ErrorBox, Loading, TopBar } from '../../../components/donate/parts';
import { colors, d } from '../../../components/donate/styles';
import { errorMessage } from '../../../lib/api';
import { fetchAdminCampaigns, updateAdminCampaign, type AdminCampaign } from '../../../lib/campaigns';
import { formatMoney, isIsoDate } from '../../../lib/money';

type Form = {
  showInApp: boolean;
  appTitle: string;
  shortDescription: string;
  showFrom: string;
  showUntil: string;
  donationUrl: string;
};

function toForm(campaign: AdminCampaign): Form {
  return {
    showInApp: campaign.showInApp,
    appTitle: campaign.appTitle || campaign.zeffyTitle,
    shortDescription: campaign.shortDescription,
    showFrom: campaign.showFrom ?? '',
    showUntil: campaign.showUntil ?? '',
    donationUrl: campaign.donationUrl,
  };
}

function validateForm(form: Form) {
  if(!form.appTitle.trim()) return 'Enter an app title.';
  if(form.showFrom && !isIsoDate(form.showFrom)) return 'Show from must be a date like 2026-12-01.';
  if(form.showUntil && !isIsoDate(form.showUntil)) return 'Show until must be a date like 2026-12-31.';
  if(form.showFrom && form.showUntil && form.showFrom > form.showUntil) return 'Show from must be on or before show until.';
  if(form.donationUrl && !/^https:\/\/([a-z0-9-]+\.)*zeffy\.com\//i.test(form.donationUrl.trim())) return 'Donation link must start with https:// and be a zeffy.com address.';
  return '';
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text nativeID={id} style={d.label}>{label}{hint ? <Text style={{ fontWeight: '400', color: colors.muted }}> {hint}</Text> : null}</Text>
      {children}
    </View>
  );
}

function Editor({ id }: { id: number }) {
  const [campaign, setCampaign] = useState<AdminCampaign | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const apply = (campaigns: AdminCampaign[]) => {
    const found = campaigns.find(c => c.id === id);
    if(!found) {
      setError('This campaign was not found. It may have been removed in Baserow.');
      return;
    }
    setCampaign(found);
    setForm(toForm(found));
  };

  useEffect(() => {
    let active = true;
    fetchAdminCampaigns()
      .then(data => { if(active) apply(data.campaigns); })
      .catch(e => { if(active) setError(errorMessage(e)); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setError('');
    try {
      apply((await fetchAdminCampaigns()).campaigns);
    } catch(e) {
      setError(errorMessage(e));
    }
  };

  if(!campaign || !form) {
    return error ? <View style={d.scroll}><ErrorBox message={error} onRetry={load} /></View> : <Loading />;
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm(current => current && { ...current, [key]: value });

  const save = async () => {
    const problem = validateForm(form);
    if(problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateAdminCampaign(campaign.id, {
        showInApp: form.showInApp,
        appTitle: form.appTitle.trim(),
        shortDescription: form.shortDescription.trim(),
        showFrom: form.showFrom,
        showUntil: form.showUntil,
        donationUrl: form.donationUrl.trim(),
      });
      router.back();
    } catch(e) {
      setError(errorMessage(e));
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={d.scroll} keyboardShouldPersistTaps="handled">
        <View style={d.infoBox}>
          <Text style={d.small}>Linked Zeffy campaign</Text>
          <Text style={[d.rowTitle, { fontSize: 15 }]}>{campaign.zeffyTitle || campaign.zeffyId}</Text>
          <Text style={d.small}>
            {campaign.goal !== null ? `Goal ${formatMoney(campaign.goal)} · ` : ''}
            {campaign.raised !== null ? `${formatMoney(campaign.raised)} raised · ` : ''}
            Goal, amount raised and payment form come from Zeffy
          </Text>
        </View>

        <View style={d.switchRow}>
          <Text nativeID="showLabel" style={[d.rowTitle, { fontSize: 15 }]}>Show in app</Text>
          <Switch
            accessibilityLabelledBy="showLabel"
            accessibilityLabel="Show in app"
            value={form.showInApp}
            onValueChange={value => set('showInApp', value)}
            trackColor={{ false: '#C9BCA6', true: colors.green }}
            thumbColor={colors.card}
          />
        </View>

        <Field id="titleLabel" label="App title">
          <TextInput accessibilityLabelledBy="titleLabel" accessibilityLabel="App title" value={form.appTitle} onChangeText={v => set('appTitle', v)} maxLength={80} style={d.input} />
        </Field>

        <Field id="descLabel" label="Short description" hint="(optional)">
          <TextInput
            accessibilityLabelledBy="descLabel"
            accessibilityLabel="Short description"
            value={form.shortDescription}
            onChangeText={v => set('shortDescription', v)}
            maxLength={400}
            multiline
            placeholder="Leave empty to use the Zeffy description"
            placeholderTextColor="#8A8174"
            style={[d.input, { minHeight: 90, paddingTop: 12, textAlignVertical: 'top' }]}
          />
        </Field>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field id="fromLabel" label="Show from">
              <TextInput accessibilityLabelledBy="fromLabel" accessibilityLabel="Show from, year month day" value={form.showFrom} onChangeText={v => set('showFrom', v.trim())} placeholder="YYYY-MM-DD" placeholderTextColor="#8A8174" keyboardType="numbers-and-punctuation" maxLength={10} style={d.input} />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field id="untilLabel" label="Show until">
              <TextInput accessibilityLabelledBy="untilLabel" accessibilityLabel="Show until, year month day" value={form.showUntil} onChangeText={v => set('showUntil', v.trim())} placeholder="YYYY-MM-DD" placeholderTextColor="#8A8174" keyboardType="numbers-and-punctuation" maxLength={10} style={d.input} />
            </Field>
          </View>
        </View>
        <Text style={[d.small, { marginTop: -8 }]}>Leave both empty to always show. Dates are in Eastern time.</Text>

        <Field id="urlLabel" label="Donation link override" hint="(optional)">
          <TextInput
            accessibilityLabelledBy="urlLabel"
            accessibilityLabel="Donation link override"
            value={form.donationUrl}
            onChangeText={v => set('donationUrl', v)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder={campaign.zeffyDonationUrl || 'https://www.zeffy.com/…'}
            placeholderTextColor="#8A8174"
            style={d.input}
          />
        </Field>
        <Text style={[d.small, { marginTop: -8 }]}>Leave empty to use the link Zeffy provides.</Text>

        <View style={{ gap: 6 }}>
          <Text style={d.label}>Banner image</Text>
          {campaign.imageUrl ? (
            <Image source={{ uri: campaign.imageUrl }} style={{ width: '100%', height: 140, borderRadius: 14 }} resizeMode="cover" accessibilityLabel="Current banner image" />
          ) : null}
          <Text style={d.small}>{campaign.imageUrl ? 'To change it, upload a new image in the Baserow “Banner Image” field.' : 'Optional. Upload one in the Baserow “Banner Image” field.'}</Text>
        </View>

        {error ? <ErrorBox message={error} /> : null}
      </ScrollView>

      <View style={d.footer}>
        <Pressable accessibilityRole="button" disabled={saving} onPress={save} style={({ pressed }) => [d.primary, d.primaryGreen, saving && d.disabled, pressed && d.pressed]}>
          <Text style={d.primaryText}>{saving ? 'Saving…' : 'Save changes'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function EditCampaignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="App campaigns" title="Edit campaign" />
      <AdminGate>
        <Editor id={Number(id)} />
      </AdminGate>
    </SafeAreaView>
  );
}
