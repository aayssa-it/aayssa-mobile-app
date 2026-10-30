import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LinkProvider } from './src/providers/LinkProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LinkProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="website" />
          <Stack.Screen name="events" options={{ headerShown: true, title: 'Events & seva', headerBackTitle: 'Back' }} />
          <Stack.Screen name="community" options={{ headerShown: true, title: 'Membership & community', headerBackTitle: 'Back' }} />
          <Stack.Screen name="about" options={{ headerShown: true, title: 'About AAYSSA', headerBackTitle: 'Back' }} />
          <Stack.Screen name="seva" options={{ headerShown: true, title: 'Worship & service', headerBackTitle: 'Back' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </LinkProvider>
    </SafeAreaProvider>
  );
}
