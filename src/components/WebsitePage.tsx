import { useFocusEffect } from 'expo-router';
import { useCallback, useReducer, useRef } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewProps } from 'react-native-webview';

import { browserReducer, initialBrowserState } from '../lib/browserState';
import { navigationAction } from '../lib/urls';
import { useOpenLink } from '../providers/LinkProvider';
import { styles as s } from '../theme';
import { WebsiteHeader, type WebsitePageProps } from './WebsiteHeader';

export default function WebsitePage({ url, title, close, embedded = false }: WebsitePageProps) {
  // WebView 14 defaults its generic to undefined, which makes strict props `never`.
  const web = useRef<WebView<WebViewProps>>(null);
  const [state, dispatch] = useReducer(browserReducer, url, initialBrowserState);
  const { openExternal } = useOpenLink();

  const back = useCallback(() => {
    if(!state.failedUrl && state.canGoBack && web.current) web.current.goBack();
    else close();
  }, [close, state.canGoBack, state.failedUrl]);

  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => subscription.remove();
  }, [back]));

  return (
    <SafeAreaView style={s.safe} edges={embedded ? ['left', 'right'] : undefined}>
      <View style={s.shell}>
        <WebsiteHeader title={title} hostname={new URL(state.currentUrl).hostname} back={back} close={close} />
        {state.failedUrl ? (
          <View style={styles.message}>
            <Text accessibilityRole="alert" style={s.cardTitle}>This page could not load.</Text>
            <Text style={[s.body, styles.centered]}>Check your internet connection and try again, or open this page in your browser.</Text>
            <Pressable accessibilityRole="button" onPress={() => dispatch({ type: 'retry' })} style={s.button}><Text style={s.buttonText}>Try again</Text></Pressable>
            <Pressable accessibilityRole="link" onPress={() => void openExternal(state.failedUrl ?? state.currentUrl)} style={[s.button, s.secondary]}><Text style={[s.buttonText, s.secondaryText]}>Open in browser</Text></Pressable>
          </View>
        ) : (
          <WebView<WebViewProps>
            key={state.attempt}
            ref={web}
            source={{ uri: state.sourceUrl }}
            style={styles.web}
            originWhitelist={['*']}
            onLoadStart={event => dispatch({ type: 'start', url: event.nativeEvent.url })}
            onLoadEnd={() => dispatch({ type: 'finish' })}
            onError={event => dispatch({ type: 'fail', url: event.nativeEvent.url })}
            onHttpError={event => dispatch({ type: 'fail', url: event.nativeEvent.url })}
            onNavigationStateChange={navigation => dispatch({ type: 'navigate', url: navigation.url, canGoBack: navigation.canGoBack })}
            onOpenWindow={event => {
              const target = event.nativeEvent.targetUrl;
              const action = navigationAction(target);
              if(action === 'allow' && target !== 'about:blank') dispatch({ type: 'open', url: target });
              else if(action === 'external') void openExternal(target);
            }}
            onShouldStartLoadWithRequest={request => {
              const action = navigationAction(request.url, request.isTopFrame !== false);
              if(action === 'external') void openExternal(request.url);
              return action === 'allow';
            }}
            onRenderProcessGone={() => dispatch({ type: 'fail' })}
            onContentProcessDidTerminate={() => dispatch({ type: 'fail' })}
            allowsBackForwardNavigationGestures
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
          />
        )}
        {state.loading && !state.failedUrl && (
          <View pointerEvents="none" style={styles.loading} accessibilityLiveRegion="polite">
            <ActivityIndicator size="small" color="#B84A0A" accessibilityLabel="Loading page" />
            <Text style={s.small}>Loading…</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: '#FBF8F2' },
  message: { padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center' },
  centered: { textAlign: 'center' },
  loading: { position: 'absolute', top: 88, alignSelf: 'center', alignItems: 'center', backgroundColor: '#FBF8F2', padding: 10, borderRadius: 12, gap: 4 },
});
