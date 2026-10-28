import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { ResourceRow } from '../../components/ui';
import { resources } from '../../data/content';
import { styles as s } from '../../theme';

export default function ResourcesScreen() {
  const [query, setQuery] = useState('');
  const search = query.toLowerCase().trim();
  const matches = resources.filter(resource => `${resource.title} ${resource.subtitle}`.toLowerCase().includes(search));

  return (
    <Screen>
      <Text style={s.eyebrow}>FOR YOUR JOURNEY</Text>
      <Text accessibilityRole="header" style={s.pageTitle}>Devotional resources</Text>
      <Text style={s.body}>Keep helpful prayers and preparation guides within reach.</Text>
      <TextInput
        accessibilityLabel="Search devotional resources"
        placeholder="Search resources…"
        placeholderTextColor="#77736B"
        value={query}
        onChangeText={setQuery}
        style={s.search}
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {matches.map(resource => <ResourceRow key={resource.path} resource={resource} />)}
      {matches.length === 0 && <Text accessibilityLiveRegion="polite" style={s.body}>No resources found. Try “bhajan” or “pooja”.</Text>}
      <View style={s.info}><Text style={s.small}>Resources open from the official website. An internet connection is required.</Text></View>
    </Screen>
  );
}
