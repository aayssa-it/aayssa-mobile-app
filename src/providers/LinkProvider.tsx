import { router } from 'expo-router';
import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { nativeDestination } from '../lib/appNavigation';
import { pageTitle } from '../data/content';
import { classifyUrl, resolveDestination } from '../lib/urls';

type LinkActions = {
  open: (path: string) => void;
  openExternal: (url: string) => Promise<void>;
  openWebsite: (path: string) => void;
};
const LinkContext = createContext<LinkActions | null>(null);

export function LinkProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  const openExternal = useCallback(async (url: string) => {
    setError('');
    try {
      if(classifyUrl(url).kind === 'blocked') throw new Error('Unsupported link');
      await Linking.openURL(url);
    } catch {
      setError('This link could not be opened. Please try again.');
    }
  }, []);

  const openWebsite = useCallback((path: string) => {
    setError('');
    const destination = resolveDestination(path);
    if(destination.kind === 'website') {
      router.push({ pathname: '/website', params: { url: destination.url, title: pageTitle(path) } });
    } else if(destination.kind === 'external') {
      void openExternal(destination.url);
    } else {
      setError('This link is unavailable. Please contact the organizers.');
    }
  }, [openExternal]);

  const open = useCallback((path: string) => {
    const native = nativeDestination(path);
    if (native) {
      setError('');
      router.navigate(native);
    } else openWebsite(path);
  }, [openWebsite]);

  return (
    <LinkContext.Provider value={{ open, openWebsite, openExternal }}>
      {children}
      {error ? (
        <View style={[styles.banner, { top: insets.top + 8 }]}>
          <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.message}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => setError('')} style={styles.dismiss}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </Pressable>
        </View>
      ) : null}
    </LinkContext.Provider>
  );
}

export function useOpenLink() {
  const context = useContext(LinkContext);
  if(!context) throw new Error('useOpenLink must be used inside LinkProvider');
  return context;
}

const styles = StyleSheet.create({
  banner: { position: 'absolute', left: 16, right: 16, borderRadius: 12, backgroundColor: '#FFE7D9', padding: 16, elevation: 8 },
  message: { color: '#3B3125', fontSize: 15, lineHeight: 22 },
  dismiss: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, marginTop: 4 },
  dismissText: { color: '#244D3F', fontWeight: '700' },
});
