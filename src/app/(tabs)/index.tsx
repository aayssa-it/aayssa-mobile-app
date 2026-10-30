import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { RouteButton } from '../../components/ui';
import { organization } from '../../data/organization';
import { shortcuts } from '../../data/content';
import { useOpenLink } from '../../providers/LinkProvider';
import { styles as s } from '../../theme';

export default function HomeScreen() {
  const { open } = useOpenLink();
  return (
    <Screen>
      <View style={s.homeGreeting}>
        <Ionicons accessible={false} name="sunny-outline" size={16} color="#B84A0A" />
        <Text style={s.homeEyebrow}>SWAMIYE SARANAM AYYAPPA</Text>
      </View>
      <View style={s.hero}>
        <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={s.halo}>
          <View style={s.haloInner}><Ionicons name="sparkles-outline" size={52} color="#F4BB8E" /></View>
        </View>
        <View style={s.heroBadge}>
          <View style={s.heroBadgeDot} />
          <Text style={s.heroKicker}>DEVOTION · UNITY · SEVA</Text>
        </View>
        <Text accessibilityRole="header" style={s.heroTitle}>A community.{'\n'}A shared devotion.</Text>
        <Text style={s.heroBody}>Connect with Ayyappa devotees across Atlanta through worship, fellowship, and service.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Explore events" onPress={() => router.navigate('/events')} style={({ pressed }) => [s.heroButton, pressed && s.homePressed]}>
          <Text style={s.heroButtonText}>Explore events</Text>
          <Ionicons accessible={false} name="arrow-forward" size={20} color="#B84A0A" />
        </Pressable>
        <View style={s.heroFooter}>
          <View style={s.heroFooterLine} />
          <Text style={s.heroFoot}>THATHVAMASI</Text>
          <View style={s.heroFooterLine} />
        </View>
      </View>
      <RouteButton label="Contact Us" href="/contact-us" secondary />
      <View style={s.homeSection}>
        <Text accessibilityRole="header" style={s.homeSectionTitle}>Welcome to AAYSSA</Text>
        <Text style={s.body}>{organization.introduction}</Text>
        <RouteButton label="About our Sangam" href="/about" secondary />
        <RouteButton label="Events & seva" href="/events" secondary />
        <RouteButton label="Membership & community" href="/community" secondary />
      </View>
      <View style={s.homeSection}>
        <Text accessibilityRole="header" style={s.homeSectionTitle}>From the Sangam</Text>
        <View style={s.homeNotice}>
          <View style={s.homeNoticeHeader}>
            <View style={s.homeNoticeIcon}><Ionicons accessible={false} name="flower-outline" size={23} color="#B84A0A" /></View>
            <Text style={s.homeNoticeTag}>REGISTRATION</Text>
          </View>
          <Text accessibilityRole="header" style={s.homeNoticeTitle}>Maaladharan registration</Text>
          <Text style={s.homeNoticeBody}>View the official page for current availability and registration details.</Text>
          <Pressable accessibilityRole="link" accessibilityLabel="View registration" onPress={() => open('/maaladharan-registration')} style={({ pressed }) => [s.homeNoticeButton, pressed && s.homePressed]}>
            <Text style={s.homeNoticeButtonText}>View registration</Text>
            <Ionicons accessible={false} name="arrow-forward" size={20} color="#FFF9E9" />
          </Pressable>
        </View>
      </View>
      <View style={s.homeSection}>
        <Text accessibilityRole="header" style={s.homeSectionTitle}>Your community, closer</Text>
        <View style={s.grid}>
          {shortcuts.map(item => (
            <Pressable key={item.path} accessibilityRole="link" accessibilityLabel={item.title} accessibilityHint={item.subtitle} onPress={() => open(item.path)} style={({ pressed }) => [s.tile, pressed && s.homePressed]}>
              <View style={s.tileHeader}>
                <View style={s.tileMark}><Ionicons accessible={false} name={item.icon} size={24} color="#B84A0A" /></View>
                <Ionicons accessible={false} name="chevron-forward" size={18} color="#A67455" />
              </View>
              <Text style={s.tileTitle}>{item.title}</Text>
              <Text style={s.tileSubtitle}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={s.quote}>
        <Ionicons accessible={false} name="heart-outline" size={22} color="#B84A0A" />
        <Text style={s.quoteText}>Rooted in devotion.{'\n'}Brought together by service.</Text>
        <Text style={s.quoteAttribution}>Atlanta Ayyappa Seva Sangam</Text>
      </View>
    </Screen>
  );
}
