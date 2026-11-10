import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { useOpenLink } from '../providers/LinkProvider';
import { styles as s } from '../theme';

const socialLinks = [
  { label: 'YouTube', icon: 'logo-youtube' as const, url: 'https://www.youtube.com/@AAYSSA' },
  { label: 'Instagram', icon: 'logo-instagram' as const, url: 'https://www.instagram.com/atlanta_ayyappa_seva_sangam/' },
  { label: 'Facebook', icon: 'logo-facebook' as const, url: 'https://www.facebook.com/ATLANTAAYYAPPASEVASANGAM' },
  { label: 'Threads', icon: 'at-outline' as const, url: 'https://www.threads.net/@atlanta_ayyappa_seva_sangam' },
  { label: 'X', icon: 'logo-x' as const, url: 'https://x.com/atl_ayyappaseva' },
  { label: 'Pinterest', icon: 'logo-pinterest' as const, url: 'https://www.pinterest.com/aayssamedia/' },
  { label: 'WhatsApp Channel', icon: 'logo-whatsapp' as const, url: 'https://whatsapp.com/channel/0029VaylC6n2v1Iof6BA6k0t' },
  { label: 'WhatsApp Groups', icon: 'people-outline' as const, url: 'https://chat.whatsapp.com/CDH3nm4UUslCpLUxeoBVab?mode=gi_t' },
];

const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Atlanta+Ayyappa+Seva+Sangam+Shiloh+Road+Cumming+GA';

export function ConnectSections() {
  const { open } = useOpenLink();

  return <>
    <View style={s.homeSection}>
      <Text accessibilityRole="header" style={s.homeSectionTitle}>Visit & connect</Text>
      <Pressable accessibilityRole="link" accessibilityLabel="Open AAYSSA location in Maps" onPress={() => open(mapUrl)} style={({ pressed }) => [s.homeMapCard, pressed && s.homePressed]}>
        <View pointerEvents="none" accessible={false} style={s.homeMapPreview}>
          <View style={[s.homeMapRoad, { width: '120%', transform: [{ rotate: '-12deg' }] }]} />
          <View style={[s.homeMapRoad, { width: '95%', transform: [{ rotate: '54deg' }] }]} />
          <View style={s.homeMapPin}><Ionicons name="location" size={25} color="#FFF9E9" /></View>
        </View>
        <View style={s.homeMapCopy}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={s.cardTitle}>Atlanta Ayyappa Seva Sangam</Text>
            <Text style={s.body}>Shiloh Road, Cumming, Georgia</Text>
          </View>
          <Ionicons name="open-outline" size={21} color="#B84A0A" />
        </View>
        <Text style={[s.small, { paddingHorizontal: 16, marginTop: 8 }]}>Tap to open directions. Confirm the event venue before traveling.</Text>
      </Pressable>
    </View>
    <View style={s.homeSection}>
      <Text accessibilityRole="header" style={s.homeSectionTitle}>Follow AAYSSA</Text>
      <View style={s.homeSocialGrid}>
        {socialLinks.map(item => (
          <Pressable key={item.label} accessibilityRole="link" accessibilityLabel={`Open AAYSSA on ${item.label}`} onPress={() => open(item.url)} style={({ pressed }) => [s.homeSocialButton, pressed && s.homePressed]}>
            <Ionicons accessible={false} name={item.icon} size={20} color="#B84A0A" />
            <Text style={s.homeSocialText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  </>;
}
