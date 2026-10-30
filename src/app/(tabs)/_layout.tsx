import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { shouldUseCompactTabs } from '../../lib/appNavigation';
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
  const { width, fontScale } = useWindowDimensions();
  const compact = shouldUseCompactTabs(width, fontScale);
  return (
    <Tabs backBehavior="history" screenOptions={{
      header: () => <Header />,
      tabBarActiveTintColor: '#244D3F',
      tabBarInactiveTintColor: '#70665A',
      tabBarStyle: { backgroundColor: '#FFFDF8', borderTopColor: '#E1D9CB' },
      tabBarLabelStyle: { fontSize: 12 },
      tabBarLabelPosition: 'below-icon',
      tabBarHideOnKeyboard: true,
      sceneStyle: { backgroundColor: '#FBF8F2' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused, size }) => <Ionicons name="home-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ({ focused, size }) => <Ionicons name="calendar-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="resources" options={{ title: 'Resources', tabBarIcon: ({ focused, size }) => <Ionicons name="book-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="gallery" options={{ title: 'Gallery', tabBarIcon: ({ focused, size }) => <Ionicons name="images-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
      <Tabs.Screen name="contact-us" options={{ title: 'Contact Us', tabBarItemStyle: compact ? { display: 'none' } : undefined, tabBarIcon: ({ focused, size }) => <Ionicons name="mail-outline" size={size} color={focused ? '#244D3F' : '#70665A'} /> }} />
    </Tabs>
  );
}
