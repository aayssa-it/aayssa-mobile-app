import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MyDonations } from '../../components/donate/MyDonations';
import { TopBar } from '../../components/donate/parts';
import { colors, d } from '../../components/donate/styles';

/** Shown after the Zeffy page is closed. The app cannot see whether a payment was completed. */
export default function ThanksScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  const backToCampaigns = () => router.dismissTo('/donate');

  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="Donate" onBack={backToCampaigns} />
      <ScrollView contentContainerStyle={d.scroll}>
        <View style={d.notice} accessibilityRole="summary">
          <View style={d.noticeIcon}><Ionicons accessible={false} name="heart" size={22} color={colors.cream} /></View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={d.noticeTitle}>Swamiye Saranam Ayyappa</Text>
            <Text style={d.noticeBody}>
               Thank you for visiting {title || 'the Sangam'}. If you donated, we&apos;ll email your tax receipt shortly.
            </Text>
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={d.eyebrow}>YOUR GIVING</Text>
          <Text accessibilityRole="header" style={[d.title, { fontSize: 24 }]}>My donations</Text>
          <Text style={d.small}>New gifts can take a few minutes to appear.</Text>
        </View>

        <MyDonations next="/my-donations" />

        <Pressable accessibilityRole="button" onPress={backToCampaigns} style={({ pressed }) => [d.outline, pressed && d.pressed]}>
          <Text style={d.outlineText}>Back to campaigns</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
