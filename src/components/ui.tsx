import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { Resource } from '../data/content';
import { useOpenLink } from '../providers/LinkProvider';
import { styles as s } from '../theme';

export function WebsiteButton({ label, path, secondary = false }: { label: string; path: string; secondary?: boolean }) {
  const { openWebsite } = useOpenLink();
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={() => openWebsite(path)} style={({ pressed }) => [s.button, secondary && s.secondary, pressed && s.pressed]}>
      <Text style={[s.buttonText, secondary && s.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

export function ResourceRow({ resource }: { resource: Resource }) {
  const { open } = useOpenLink();
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={`${resource.title}. ${resource.subtitle}`} onPress={() => open(resource.path)} style={({ pressed }) => [s.row, pressed && s.pressed]}>
      <View style={s.symbol}><Ionicons accessible={false} name={resource.icon} size={24} color="#96743C" /></View>
      <View style={s.rowCopy}><Text style={s.rowTitle}>{resource.title}</Text><Text style={s.small}>{resource.subtitle}</Text></View>
      <Ionicons accessible={false} name="chevron-forward" size={21} color="#8B7756" />
    </Pressable>
  );
}

export function RouteButton({ label, href, secondary = false }: { label: string; href: Href; secondary?: boolean }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={label} style={({ pressed }) => [s.button, secondary && s.secondary, pressed && s.pressed]}>
        <Text style={[s.buttonText, secondary && s.secondaryText]}>{label}</Text>
      </Pressable>
    </Link>
  );
}
