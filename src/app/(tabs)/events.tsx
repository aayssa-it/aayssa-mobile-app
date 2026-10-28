import { Text, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { ResourceRow, WebsiteButton } from '../../components/ui';
import { services } from '../../data/content';
import { styles as s } from '../../theme';

export default function EventsScreen() {
  return (
    <Screen>
      <Text style={s.eyebrow}>COME TOGETHER</Text>
      <Text accessibilityRole="header" style={s.pageTitle}>Events & seva</Text>
      <Text style={s.body}>Find opportunities to worship, serve, and connect.</Text>
      <View style={s.notice}>
        <Text style={s.tag}>REGISTRATION</Text>
        <Text style={s.cardTitle}>Maaladharan registration</Text>
        <Text style={s.body}>Dates and availability are maintained by the organizers on the official website.</Text>
        <WebsiteButton label="Open registration" path="/maaladharan-registration" />
        <WebsiteButton label="View full calendar" path="/calendar" secondary />
      </View>
      <Text accessibilityRole="header" style={s.section}>Worship & service</Text>
      {services.map(resource => <ResourceRow key={resource.path} resource={resource} />)}
      <View style={s.info}><Text style={s.small}>Use the official calendar for the latest schedule.</Text></View>
    </Screen>
  );
}
