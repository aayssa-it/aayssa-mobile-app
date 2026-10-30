import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type WebsitePageProps = { url: string; title: string; close: () => void; embedded?: boolean };

export function WebsiteHeader({ title, hostname, back, close }: { title: string; hostname: string; back: () => void; close: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={back} style={styles.control}>
        <Ionicons accessible={false} name="chevron-back" size={20} color="#B84A0A" />
        <Text style={styles.action}>Back</Text>
      </Pressable>
      <View style={styles.copy}>
        <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.hostname}>{hostname}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Close page and return to app" onPress={close} style={styles.control}>
        <Text style={styles.action}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E9E1D5', gap: 4 },
  control: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, minHeight: 48, minWidth: 48 },
  action: { color: '#B84A0A', fontWeight: '700', fontSize: 15 },
  copy: { flex: 1, minWidth: 0 },
  title: { fontSize: 17, fontWeight: '600', color: '#3B3125' },
  hostname: { fontSize: 11, color: '#70665A', marginTop: 3 },
});
