import { Text, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { RouteButton, WebsiteButton } from '../../components/ui';
import { styles as s } from '../../theme';

export default function ContactScreen() {
  return (
    <Screen>
      <Text style={s.eyebrow}>WE’RE HERE TO HELP</Text>
      <Text accessibilityRole="header" style={s.pageTitle}>Contact Us</Text>
      <Text style={s.body}>Connect with the organizers about seva, volunteering, membership, or your next visit.</Text>
      <WebsiteButton label="Contact the organizers" path="/contact-us" />
      <Text style={s.small}>Send your message through the official website contact form.</Text>
      <View style={s.location}>
        <Text accessibilityRole="header" style={s.cardTitle}>Visit & connect</Text>
        <Text style={s.body}>Shiloh Road, Cumming, Georgia</Text>
        <Text style={s.small}>Confirm the venue and current schedule with the organizers before traveling.</Text>
        <RouteButton label="View calendar" href="/calendar" secondary />
      </View>
      <RouteButton label="Membership & community" href="/community" secondary />
      <WebsiteButton label="Share feedback" path="/feedback" secondary />
    </Screen>
  );
}
