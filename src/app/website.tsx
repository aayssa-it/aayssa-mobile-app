import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import WebsitePage from '../components/WebsitePage';
import { classifyUrl } from '../lib/urls';
import { styles as s } from '../theme';

export default function WebsiteScreen() {
  const { url, title } = useLocalSearchParams<{ url?: string | string[]; title?: string | string[] }>();
  const close = useCallback(() => {
    if(router.canGoBack()) router.back();
    else router.replace('/');
  }, []);
  const destination = typeof url === 'string' ? classifyUrl(url) : { kind: 'blocked' as const };

  if(destination.kind !== 'website') {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.content}>
          <Text accessibilityRole="alert" style={s.cardTitle}>This page is unavailable.</Text>
          <Pressable accessibilityRole="button" onPress={close} style={s.button}><Text style={s.buttonText}>Return to app</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return <WebsitePage key={destination.url} url={destination.url} title={typeof title === 'string' ? title : 'AAYSSA'} close={close} />;
}
