import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { ConnectSections } from '../../components/ConnectSections';
import { FeedbackCard } from '../../components/FeedbackCard';
import { Screen } from '../../components/Screen';
import { styles as s } from '../../theme';

export default function HomeScreen() {
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
        <Text accessibilityRole="header" style={s.heroTitle}>Welcome to AAYSSA</Text>
        <Text style={s.heroBody}>Atlanta Ayyappa Seva Sangam (AAYSSA) is an organization dedicated to promoting unity, spiritual growth, and community service within the Ayyappa devotee community. Our group emphasizes the values of devotion, compassion, and selfless service. Through various community service activities and events, we aim to foster a sense of belonging and camaraderie among Ayyappa devotees, all united by their faith in Lord Ayyappa.{`\n\n`}Our Seva Sangam is a gathering of like-minded devotees who share a common reverence for Lord Ayyappa and a dedication to spiritual growth. We come together to organize and participate in various seva activities, spiritual events, and pilgrimages that strengthen our bond with each other and deepen our connection with Lord Ayyappa. Through service, devotion, and unity, we strive to embody the values and principles that Lord Ayyappa represents.</Text>
        <View style={s.heroFooter}>
          <View style={s.heroFooterLine} />
          <Text style={s.heroFoot}>THATHVAMASI</Text>
          <View style={s.heroFooterLine} />
        </View>
      </View>
      <ConnectSections />
      <View style={s.quote}>
        <Ionicons accessible={false} name="heart-outline" size={22} color="#B84A0A" />
        <Text style={s.quoteText}>Rooted in devotion.{'\n'}Brought together by service.</Text>
        <Text style={s.quoteAttribution}>Atlanta Ayyappa Seva Sangam</Text>
      </View>
      <FeedbackCard />
    </Screen>
  );
}
