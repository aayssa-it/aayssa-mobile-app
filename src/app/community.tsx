import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { MemberOverview } from '../components/member/MemberOverview';
import { ResourceRow, WebsiteButton } from '../components/ui';
import { communityLinks } from '../data/content';
import { useAuth } from '../providers/AuthProvider';
import { styles as s } from '../theme';

export default function CommunityScreen() {
  const { status } = useAuth();

  if(status === 'member') {
    return <Screen stack><MemberOverview /></Screen>;
  }

  return (
    <Screen stack>
      <Text style={s.eyebrow}>BELONG & PARTICIPATE</Text>
      <Text accessibilityRole="header" style={s.pageTitle}>Our Sangam</Text>
      <View style={s.notice}>
        <Text style={s.cardTitle}>Welcome to the community</Text>
        <Text style={s.body}>Join the Sangam or access your existing membership through the official member pages.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/login', params: { next: '/community' } })} style={({ pressed }) => [s.button, pressed && s.pressed]}><Text style={s.buttonText}>Member login</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/member-registration')} style={({ pressed }) => [s.button, s.secondary, pressed && s.pressed]}><Text style={[s.buttonText, s.secondaryText]}>Become a member</Text></Pressable>
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
      <WebsiteButton label="Facebook Page" path="https://www.facebook.com/ATLANTAAYYAPPASEVASANGAM" secondary />
      <WebsiteButton label="Threads" path="https://www.threads.net/@atlanta_ayyappa_seva_sangam" secondary />
      <WebsiteButton label="X" path="https://x.com/atl_ayyappaseva" secondary />
      <WebsiteButton label="Pinterest" path="https://www.pinterest.com/aayssamedia/" secondary />
      <WebsiteButton label="WhatsApp Channel" path="https://whatsapp.com/channel/0029VaylC6n2v1Iof6BA6k0t" secondary />
      <WebsiteButton label="WhatsApp Groups" path="https://chat.whatsapp.com/CDH3nm4UUslCpLUxeoBVab?mode=gi_t" secondary />
    </Screen>
  );
}
