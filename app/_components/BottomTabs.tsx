import { usePathname, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TabKey = 'home' | 'wellbeing' | 'profile';

const TAB_ACTIVE = '#B44CFF';
const TAB_INACTIVE = 'rgba(255,255,255,0.55)';

function getActiveTab(pathname: string): TabKey {
  if (pathname === '/home') return 'home';
  if (pathname === '/profile') return 'profile';
  if (pathname.startsWith('/detail/')) return 'wellbeing';
  if (pathname === '/journal') return 'wellbeing';
  return 'home';
}

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const active = useMemo(() => getActiveTab(pathname), [pathname]);

  return (
    <View style={styles.tabBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ana Sayfa"
        onPress={() => router.push('/home')}
        style={styles.tabItem}>
        <Text style={[styles.tabIcon, { color: active === 'home' ? TAB_ACTIVE : TAB_INACTIVE }]}>
          🏠
        </Text>
        <Text style={[styles.tabLabel, { color: active === 'home' ? TAB_ACTIVE : TAB_INACTIVE }]}>
          Ana Sayfa
        </Text>
      </Pressable>

      <View style={styles.tabItem}>
        <Text
          style={[styles.tabIcon, { color: active === 'wellbeing' ? TAB_ACTIVE : TAB_INACTIVE }]}>
          🧘
        </Text>
        <Text
          style={[
            styles.tabLabel,
            { color: active === 'wellbeing' ? TAB_ACTIVE : TAB_INACTIVE },
          ]}>
          İyi Oluş
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profil"
        onPress={() => router.push('/profile')}
        style={styles.tabItem}>
        <Text
          style={[styles.tabIcon, { color: active === 'profile' ? TAB_ACTIVE : TAB_INACTIVE }]}>
          👤
        </Text>
        <Text
          style={[
            styles.tabLabel,
            { color: active === 'profile' ? TAB_ACTIVE : TAB_INACTIVE },
          ]}>
          Profil
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 66,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 80,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});

