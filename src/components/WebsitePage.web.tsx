import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOpenLink } from '../providers/LinkProvider';
import { styles as s } from '../theme';
import { WebsiteHeader, type WebsitePageProps } from './WebsiteHeader';

export default function WebsitePage({ url, title, close }: WebsitePageProps) {
  const { openExternal } = useOpenLink();
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.shell}>
        <WebsiteHeader title={title} hostname={new URL(url).hostname} back={close} close={close} />
        <View style={styles.message}>
          <Text accessibilityRole="header" style={s.cardTitle}>{title}</Text>
          <Text style={[s.body, styles.centered]}>Open the official website in a new browser tab to view this page. You can return here at any time.</Text>
          <Pressable accessibilityRole="link" onPress={() => void openExternal(url)} style={s.button}><Text style={s.buttonText}>Open website</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  message: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  centered: { textAlign: 'center', maxWidth: 420 },
});
