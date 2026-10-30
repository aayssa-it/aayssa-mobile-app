import type { PropsWithChildren } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles as s } from '../theme';

export function Screen({ children, stack = false }: PropsWithChildren<{ stack?: boolean }>) {
  return (
    <SafeAreaView style={s.safe} edges={stack ? ['left', 'right', 'bottom'] : ['left', 'right']}>
      <View style={s.shell}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {children}
          <Text style={s.footer}>AAYSSA • Development preview{'\n'}Website pages require an internet connection</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
