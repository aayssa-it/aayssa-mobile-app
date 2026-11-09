import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MyDonations } from '../components/donate/MyDonations';
import { TopBar } from '../components/donate/parts';
import { d } from '../components/donate/styles';
import { useAuth } from '../providers/AuthProvider';

export default function MyDonationsScreen() {
  const { status, member, donorEmail, signOut } = useAuth();
  const [key, setKey] = useState(0);

  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="Donate" />
      <ScrollView contentContainerStyle={d.scroll}>
        <View style={{ gap: 4 }}>
          <Text style={d.eyebrow}>YOUR GIVING</Text>
          <Text accessibilityRole="header" style={[d.title, { fontSize: 24 }]}>My donations</Text>
          {status === 'member' && member ? <Text style={d.small}>Signed in as {member.email || `${member.firstName} ${member.lastName}`.trim()}</Text> : null}
          {status === 'donor' ? <Text style={d.small}>Verified as {donorEmail}</Text> : null}
          {status === 'signedOut' ? <Text style={d.body}>See this year’s donations and download tax receipts.</Text> : null}
        </View>

        <MyDonations key={key} />

        {status === 'member' || status === 'donor' ? (
          <Pressable
            accessibilityRole="button"
            onPress={async () => { await signOut(); setKey(k => k + 1); }}
            style={({ pressed }) => [d.outline, pressed && d.pressed]}>
            <Text style={d.outlineText}>{status === 'donor' ? 'Use a different email' : 'Sign out'}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
