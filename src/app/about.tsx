import { Text } from 'react-native';

import { Screen } from '../components/Screen';
import { RouteButton, WebsiteButton } from '../components/ui';
import { organization } from '../data/organization';
import { styles as s } from '../theme';

export default function AboutScreen() {
  return (
    <Screen stack>
      <Text accessibilityRole="header" style={s.pageTitle}>Our Sangam</Text>
      <Text style={s.body}>{organization.introduction}</Text>
      <Text style={s.body}>{organization.description}</Text>
      <Text accessibilityRole="header" style={s.section}>Seva at home</Text>
      <Text style={s.body}>{organization.homeSeva}</Text>
      <RouteButton label="View calendar" href="/calendar" />
      <RouteButton label="Membership & community" href="/community" secondary />
      <WebsiteButton label="Read the official introduction" path={organization.source} secondary />
    </Screen>
  );
}
