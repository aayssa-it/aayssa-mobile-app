import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { ConnectSections } from '../components/ConnectSections';
import { Screen } from '../components/Screen';
import { MemberOverview } from '../components/member/MemberOverview';
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
      <ConnectSections />
    </Screen>
  );
}
