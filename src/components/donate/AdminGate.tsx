import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '../../providers/AuthProvider';
import { Loading } from './parts';
import { d } from './styles';

/** Shows children only to signed-in Board/Admin members. The API enforces the same rule. */
export function AdminGate({ children }: PropsWithChildren) {
  const { status, isAdmin } = useAuth();

  if(status === 'loading') return <Loading />;

  if(status === 'signedOut' || status === 'donor') {
    return (
      <View style={[d.scroll, { gap: 12 }]}>
        <Text style={d.body}>Sign in with a Board or Admin membership email to manage app campaigns.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/login', params: { next: '/admin/campaigns' } })} style={({ pressed }) => [d.outline, pressed && d.pressed]}>
          <Text style={d.outlineText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  if(!isAdmin) {
    return (
      <View style={d.scroll}>
        <Text style={d.body}>Campaign management is available to Board and Admin members only.</Text>
      </View>
    );
  }

  return <>{children}</>;
}