import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import BottomTabs from './_components/BottomTabs';

const STORAGE_NAME_KEY = '@ruh_iyi/profile_name';

function getInitial(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed[0]?.toUpperCase() ?? '?';
}

export default function ProfileScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState<string>('');
  const [draftName, setDraftName] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [fade]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_NAME_KEY);
        if (!cancelled && stored) {
          setName(stored);
          setDraftName(stored);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const streakText = '7 günlük seri 🔥';

  const stats = useMemo(
    () => [
      { label: 'Tamamlanan Anket', value: '3' },
      { label: 'Aktif Gün', value: '7' },
      { label: 'Egzersiz', value: '5' },
    ],
    [],
  );

  const badges = useMemo(
    () => [
      { emoji: '🌟', title: 'İlk Adım' },
      { emoji: '🔥', title: '7 Gün Serisi' },
      { emoji: '🧘', title: 'Stres Ustası' },
    ],
    [],
  );

  async function saveName() {
    const next = draftName.trim();
    if (!next) return;
    setName(next);
    await AsyncStorage.setItem(STORAGE_NAME_KEY, next);
  }

  return (
    <LinearGradient colors={['#090A14', '#1A0B2E', '#0B1E4D']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fade }}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial(name || draftName)}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.name}>{name || (loaded ? 'İsmini ekle' : 'Yükleniyor...')}</Text>
              <Text style={styles.streak}>{streakText}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profil</Text>
            <Text style={styles.cardText}>
              {name
                ? 'İsmini güncelleyebilirsin.'
                : 'İlk girişte ismini kaydedelim. Bu cihazda saklanır.'}
            </Text>
            <View style={styles.row}>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Adın"
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.input}
              />
              <Pressable onPress={saveName} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
                <Text style={styles.saveBtnText}>Kaydet</Text>
              </Pressable>
            </View>
            {!name && loaded && (
              <Text style={styles.hint}>İpucu: “Polat” gibi kısa yazabilirsin.</Text>
            )}
          </View>

          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Başarımlar</Text>
          <View style={styles.badgesRow}>
            {badges.map((b) => (
              <View key={b.title} style={styles.badge}>
                <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                <Text style={styles.badgeTitle}>{b.title}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.spacer} />
        <BottomTabs />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
    gap: 14,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(180, 76, 255, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(180, 76, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  headerText: { flex: 1, gap: 6 },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  streak: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
    marginTop: 8,
  },
  card: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  cardText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    fontWeight: '700',
  },
  saveBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(180, 76, 255, 0.30)',
    borderWidth: 1,
    borderColor: 'rgba(180, 76, 255, 0.55)',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  hint: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  statLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
  },
  badgeEmoji: { fontSize: 22 },
  badgeTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  spacer: { flex: 1 },
});

