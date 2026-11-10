import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/providers/AuthProvider';
import { LinkProvider } from './src/providers/LinkProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LinkProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="website" />
            <Stack.Screen name="events" options={{ headerShown: true, title: 'Events & seva', headerBackTitle: 'Back' }} />
            <Stack.Screen name="community" options={{ headerShown: true, title: 'Membership & community', headerBackTitle: 'Back' }} />
            <Stack.Screen name="about" options={{ headerShown: true, title: 'About AAYSSA', headerBackTitle: 'Back' }} />
            <Stack.Screen name="seva" options={{ headerShown: true, title: 'Worship & service', headerBackTitle: 'Back' }} />
            <Stack.Screen name="donate/[id]" />
            <Stack.Screen name="donate/thanks" />
            <Stack.Screen name="my-donations" />
            <Stack.Screen name="login" />
            <Stack.Screen name="admin/campaigns" />
            <Stack.Screen name="admin/campaign/[id]" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </LinkProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
