import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { RouteButton, WebsiteButton } from '../components/ui';
import { sevaDescriptions } from '../data/organization';
import { styles as s } from '../theme';

export default function SevaScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const seva = sevaDescriptions.find(item => item.id === id);
  return (
    <Screen stack>
      <Text accessibilityRole="header" style={s.pageTitle}>{seva?.title ?? 'Explore seva'}</Text>
      {seva ? <>
        <Text style={s.body}>{seva.description}</Text>
        <View style={s.info}>
          <Text style={s.small}>For current arrangements, fees, dates, and availability, check the official page or contact the organizers.</Text>
        </View>
        <WebsiteButton label="View current seva details" path={seva.path} />
        {seva.id === 'maaladharana' && <WebsiteButton label="Maaladharan registration" path="/maaladharan-registration" />}
        <RouteButton label="View calendar" href="/calendar" secondary />
        <RouteButton label="Contact Us" href="/contact-us" secondary />
      </> : <Text style={s.body}>Choose a seva to learn more about worship and service with AAYSSA.</Text>}
      <RouteButton label="View calendar" href="/calendar" secondary />
    </Screen>
  );
}
