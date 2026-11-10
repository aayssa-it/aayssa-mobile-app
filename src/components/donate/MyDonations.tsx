import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { errorMessage } from '../../lib/api';
import type { DonationSummary } from '../../lib/member';
import { formatMoney } from '../../lib/money';
import { useAuth } from '../../providers/AuthProvider';
import { useOpenLink } from '../../providers/LinkProvider';
import { ErrorBox, Loading } from './parts';
import { colors, d } from './styles';

function dateLabel(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Loads this year's donations for the signed-in member or verified donor. */
export function useDonationSummary() {
  const { status, loadDonations } = useAuth();
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const signedIn = status === 'member' || status === 'donor';

  useEffect(() => {
    if(!signedIn) return;
    let active = true;
    loadDonations()
      .then(data => { if(active) { setSummary(data); setError(''); } })
      .catch(e => { if(active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [signedIn, loadDonations, attempt]);

  return {
    signedIn,
    summary: signedIn ? summary : null,
    error: signedIn ? error : '',
    reload: () => setAttempt(n => n + 1),
  };
}

/** Member sign-in, or email verification for donors who are not members. */
function SignInChoices({ next }: { next: string }) {
  const { open } = useOpenLink();

  return (
    <View style={{ gap: 14 }}>
      <View style={[d.row, { gap: 12 }]}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[d.rowTitle, { fontSize: 15 }]}>AAYSSA member?</Text>
          <Text style={d.small}>Sign in with your membership email</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/login', params: { next } })} style={({ pressed }) => [d.addButton, pressed && d.pressed]}>
          <Text style={d.addText}>Sign in</Text>
        </Pressable>
      </View>

      <View style={{ backgroundColor: colors.saffronTint, borderRadius: 16, padding: 16, gap: 10 }}>
        <Text style={[d.rowTitle, { fontSize: 15 }]}>Become an AAYSSA member</Text>
        <Text style={[d.small, { color: colors.body, lineHeight: 19 }]}>Members sign in once to see donations, Maaladharan and Home Pooja bookings in one place.</Text>
        <Pressable accessibilityRole="button" onPress={() => open('/member-registration')} style={({ pressed }) => [d.outline, { borderColor: colors.saffron, minHeight: 46 }, pressed && d.pressed]}>
          <Text style={[d.outlineText, { color: colors.saffronDeep, fontSize: 15 }]}>Become a member</Text>
        </Pressable>
      </View>

      <Text style={[d.small, { textAlign: 'center' }]}>We also email a tax receipt for every gift.</Text>
    </View>
  );
}
/** This year's donations and receipts, or the ways to see them. */
export function MyDonations({ next = '/my-donations' }: { next?: string }) {
  const { status } = useAuth();
  const { summary, error, reload } = useDonationSummary();

  if(status === 'loading') return <Loading />;
  if(status === 'signedOut') return <SignInChoices next={next} />;
  if(error) return <ErrorBox message={error} onRetry={reload} />;
  if(!summary) return <Loading label="Loading your donations…" />;

  return (
    <View style={{ gap: 12 }}>
      <View style={d.stat}>
        <Text style={d.small}>Given in {summary.year}</Text>
        <Text style={d.statValue}>{formatMoney(summary.totalPaidThisYear, summary.currency) || '$0'}</Text>
        <Text style={d.small}>{summary.payments.length} {summary.payments.length === 1 ? 'donation' : 'donations'} · from Zeffy records</Text>
      </View>
      {summary.payments.length === 0 ? (
        <Text style={d.body}>No donations recorded under this email this year.</Text>
      ) : null}
      {summary.payments.map(payment => (
        <View key={payment.id} style={d.row}>
          <View style={d.rowCopy}>
            <Text style={[d.rowTitle, { fontSize: 15 }]} numberOfLines={2}>{payment.description}</Text>
            <Text style={d.small}>{dateLabel(payment.date)} · {formatMoney(payment.amount, payment.currency)}</Text>
          </View>
          {payment.receiptUrl ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Tax receipt for ${payment.description}`}
              onPress={() => void WebBrowser.openBrowserAsync(payment.receiptUrl, { toolbarColor: colors.green, controlsColor: colors.cream, createTask: false })}
              style={({ pressed }) => [d.receipt, pressed && d.pressed]}>
              <Ionicons accessible={false} name="download-outline" size={16} color={colors.green} />
              <Text style={d.receiptText}>Receipt</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}