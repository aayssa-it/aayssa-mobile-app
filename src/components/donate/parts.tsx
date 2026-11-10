import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, LayoutAnimation, Pressable, Text, View } from 'react-native';

import { formatMoney, progressPercent, shortDate } from '../../lib/money';
import type { Campaign } from '../../lib/campaigns';
import { colors, d } from './styles';

export function ProgressBar({ percent, height = 8, track = colors.track, fill = colors.saffron }: { percent: number; height?: number; track?: string; fill?: string }) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${percent}%`, height, borderRadius: height / 2, backgroundColor: fill }} />
    </View>
  );
}

/** "$1,250 raised of $5,000", or null when Zeffy has no figures for the campaign. */
export function raisedLine(campaign: Pick<Campaign, 'raised' | 'goal' | 'currency'>) {
  const raised = formatMoney(campaign.raised, campaign.currency);
  const goal = formatMoney(campaign.goal, campaign.currency);
  if(raised && goal) return { raised, goal };
  if(raised) return { raised, goal: '' };
  return null;
}

/**
 * Long text shown as a few lines with "More" / "Less" to slide the rest open.
 * The toggle only appears when the text is long enough to be cut off.
 */
 export function ExpandableText({ text, lines = 3, style, linkColor }: { text: string; lines?: number; style?: object; linkColor: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > lines * 45;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(value => !value);
  };

  return (
    <View style={{ gap: 4 }}>
      <Text style={style} numberOfLines={open || !long ? undefined : lines}>{text}</Text>
      {long ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={open ? 'Show less' : 'Show more of the description'}
          hitSlop={8}
          onPress={toggle}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: linkColor }}>{open ? 'Less' : 'More'}</Text>
          <Ionicons accessible={false} name={open ? 'chevron-up' : 'chevron-down'} size={16} color={linkColor} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function FeaturedCampaign({ campaign }: { campaign: Campaign }) {
  const percent = progressPercent(campaign.raised, campaign.goal);
  const line = raisedLine(campaign);
  return (
    <View style={d.featured} accessibilityLabel={`Featured campaign: ${campaign.title}`}>
      <View style={d.featuredTop}>
        <Text style={d.featuredTag}>FEATURED</Text>
        {campaign.showUntil ? <Text style={d.featuredDate}>Ends {shortDate(campaign.showUntil)}</Text> : null}
      </View>
      <Text accessibilityRole="header" style={d.featuredTitle}>{campaign.title}</Text>
      {campaign.description ? <ExpandableText text={campaign.description} style={d.featuredBody} linkColor={colors.peach} /> : null}
      {percent !== null ? <ProgressBar percent={percent} track="#3D6B5A" fill={colors.peach} /> : null}
      {line ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13, color: '#E4EEE8' }}><Text style={{ fontWeight: '700', color: colors.cream }}>{line.raised}</Text> raised</Text>
          {line.goal ? <Text style={{ fontSize: 13, color: '#E4EEE8' }}>of {line.goal}</Text> : null}
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Donate to ${campaign.title}`}
        onPress={() => router.push({ pathname: '/donate/[id]', params: { id: String(campaign.id) } })}
        style={({ pressed }) => [d.featuredButton, pressed && d.pressed]}>
        <Text style={d.featuredButtonText}>Donate to this campaign</Text>
        <Ionicons accessible={false} name="arrow-forward" size={18} color={colors.saffron} />
      </Pressable>
    </View>
  );
}

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const percent = progressPercent(campaign.raised, campaign.goal);
  const line = raisedLine(campaign);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={campaign.title}
      accessibilityHint="Opens the campaign"
      onPress={() => router.push({ pathname: '/donate/[id]', params: { id: String(campaign.id) } })}
      style={({ pressed }) => [d.row, pressed && d.pressed]}>
      <View style={d.rowIcon}><Ionicons accessible={false} name="heart-outline" size={22} color={colors.saffron} /></View>
      <View style={d.rowCopy}>
        <Text style={d.rowTitle}>{campaign.title}</Text>
        {percent !== null ? <ProgressBar percent={percent} height={6} /> : null}
        {line ? (
          <Text style={d.small}>{line.goal ? `${line.raised} of ${line.goal}` : `${line.raised} raised`}</Text>
        ) : campaign.description ? (
          <Text style={d.small} numberOfLines={1}>{campaign.description}</Text>
        ) : null}
      </View>
      <Ionicons accessible={false} name="chevron-forward" size={18} color="#8B7756" />
    </Pressable>
  );
}

export function TopBar({ label = 'Back', title, right, onBack }: { label?: string; title?: string; right?: ReactNode; onBack?: () => void }) {
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/donate')));
  return (
    <View style={d.topBar}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${label}`} onPress={back} style={({ pressed }) => [d.back, pressed && d.pressed]}>
        <Ionicons accessible={false} name="chevron-back" size={20} color={colors.saffron} />
        <Text style={d.backText}>{label}</Text>
      </Pressable>
      {title ? <Text accessibilityRole="header" numberOfLines={1} style={d.topTitle}>{title}</Text> : <View style={{ flex: 1 }} />}
      {right}
    </View>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={d.centered} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.saffron} accessibilityLabel={label} />
      <Text style={d.small}>{label}</Text>
    </View>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={d.errorBox}>
      <Text accessibilityRole="alert" style={d.errorText}>{message}</Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry} style={({ pressed }) => [d.outline, pressed && d.pressed]}>
          <Text style={d.outlineText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}