import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles as s } from '../../theme';

function Header() {
  return (
    <SafeAreaView style={s.safeHeader} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Image accessibilityLabel="AAYSSA logo" source={require('../../../assets/aayssa-logo.png')} style={s.logo} resizeMode="contain" />
        <View style={s.brand}><Text style={s.brandName}>AAYSSA</Text><Text style={s.brandSub}>ATLANTA AYYAPPA SEVA SANGAM</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open community and membership" onPress={() => router.navigate('/community')} style={({ pressed }) => [s.member, pressed && s.pressed]}>
          <Ionicons accessible={false} name="person-outline" size={23} color="#785124" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <Tabs backBehavior="history" screenOptions={{
      header: () => <Header />,
      tabBarActiveTintColor: '#244D3F',
      tabBarInactiveTintColor: '#70665A',
      tabBarStyle: { backgroundColor: '#FFFDF8', borderTopColor: '#E1D9CB' },
      tabBarLabelStyle: { fontSize: 12 },
      tabBarHideOnKeyboard: true,
      sceneStyle: { backgroundColor: '#FBF8F2' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused, size }) => <Ionicons name="home-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: ({ focused, size }) => <Ionicons name="calendar-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="resources" options={{ title: 'Resources', tabBarIcon: ({ focused, size }) => <Ionicons name="musical-notes-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ focused, size }) => <Ionicons name="people-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
    </Tabs>
  );
}
