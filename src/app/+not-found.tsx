import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles as s } from '../theme';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.content}>
        <Text accessibilityRole="header" style={s.pageTitle}>Page not found</Text>
        <Text style={s.body}>This link does not match a page in the app.</Text>
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" style={s.button}><Text style={s.buttonText}>Return home</Text></Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
