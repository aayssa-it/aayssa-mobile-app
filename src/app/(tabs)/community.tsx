import { Text, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { ResourceRow, WebsiteButton } from '../../components/ui';
import { communityLinks } from '../../data/content';
import { styles as s } from '../../theme';

export default function CommunityScreen() {
  return (
    <Screen>
      <Text style={s.eyebrow}>BELONG & PARTICIPATE</Text>
      <Text accessibilityRole="header" style={s.pageTitle}>Our Sangam</Text>
      <View style={s.notice}>
        <Text style={s.cardTitle}>Welcome to the community</Text>
        <Text style={s.body}>Join the Sangam or access your existing membership through the official member pages.</Text>
        <WebsiteButton label="Member login" path="/member-login" />
        <WebsiteButton label="Become a member" path="/member-registration" secondary />
        <Text style={s.small}>Use your existing organization account to sign in on the member portal.</Text>
      </View>
      <Text accessibilityRole="header" style={s.section}>Stay connected</Text>
      {communityLinks.map(resource => <ResourceRow key={resource.path} resource={resource} />)}
      <View style={s.location}>
        <Text accessibilityRole="header" style={s.cardTitle}>Visit & connect</Text>
        <Text style={s.body}>Shiloh Road, Cumming, Georgia</Text>
        <Text style={s.small}>Confirm the venue with organizers before traveling.</Text>
        <WebsiteButton label="Open map" path="https://www.google.com/maps/search/?api=1&query=Atlanta+Ayyappa+Seva+Sangam+Shiloh+Road+Cumming+GA" secondary />
      </View>
      <Text accessibilityRole="header" style={s.section}>Follow AAYSSA</Text>
      <WebsiteButton label="YouTube" path="https://www.youtube.com/@AAYSSA" secondary />
      <WebsiteButton label="Instagram" path="https://www.instagram.com/atlanta_ayyappa_seva_sangam/" secondary />
    </Screen>
  );
}
