import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import BottomTabs from './_components/BottomTabs';

type MoodKey = 'sad' | 'anxious' | 'neutral' | 'good' | 'great';

type JournalEntry = {
  id: string;
  dateISO: string;
  mood: MoodKey;
  text: string;
};

const STORAGE_JOURNAL_KEY = '@ruh_iyi/journal_entries_v1';

const MOODS: Array<{ key: MoodKey; emoji: string }> = [
  { key: 'sad', emoji: '😔' },
  { key: 'anxious', emoji: '😟' },
  { key: 'neutral', emoji: '😐' },
  { key: 'good', emoji: '🙂' },
  { key: 'great', emoji: '😊' },
];

function formatToday() {
  const now = new Date();
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(now);
  } catch {
    return now.toLocaleDateString();
  }
}

export default function JournalScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const [mood, setMood] = useState<MoodKey>('neutral');
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [fade]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_JOURNAL_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as JournalEntry[];
        if (!cancelled && Array.isArray(parsed)) setEntries(parsed);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const last3 = useMemo(() => entries.slice(0, 3), [entries]);

  async function save() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const entry: JournalEntry = {
      id: `${Date.now()}`,
      dateISO: new Date().toISOString(),
      mood,
      text: trimmed,
    };

    const next = [entry, ...entries];
    setEntries(next);
    setText('');

    await AsyncStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(next));
  }

  return (
    <LinearGradient colors={['#090A14', '#1A0B2E', '#0B1E4D']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fade }}>
          <Text style={styles.title}>📝 Günlüğüm</Text>
          <Text style={styles.date}>{formatToday()}</Text>

          <View style={styles.moodCard}>
            <Text style={styles.sectionTitle}>Ruh hali</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => {
                const active = mood === m.key;
                return (
                  <Pressable
                    key={m.key}
                    accessibilityRole="button"
                    onPress={() => setMood(m.key)}
                    style={[styles.moodPill, active && styles.moodPillActive]}>
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.editorCard}>
            <Text style={styles.sectionTitle}>Bugün</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Bugün neler oldu? Nasıl hissediyorsun?"
              placeholderTextColor="rgba(255,255,255,0.45)"
              multiline
              textAlignVertical="top"
              style={styles.textarea}
            />
            <Pressable onPress={save} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Son 3 giriş</Text>
          <View style={styles.entries}>
            {loading ? (
              <Text style={styles.muted}>Yükleniyor...</Text>
            ) : last3.length === 0 ? (
              <Text style={styles.muted}>Henüz kayıt yok. İlk girişini yaz.</Text>
            ) : (
              last3.map((e) => (
                <View key={e.id} style={styles.entryCard}>
                  <Text style={styles.entryHeader}>
                    {MOODS.find((m) => m.key === e.mood)?.emoji ?? '😐'}{' '}
                    {new Date(e.dateISO).toLocaleDateString('tr-TR')}
                  </Text>
                  <Text style={styles.entryText} numberOfLines={4}>
                    {e.text}
                  </Text>
                </View>
              ))
            )}
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
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  date: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  moodCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    gap: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  moodPill: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  moodPillActive: {
    backgroundColor: 'rgba(180, 76, 255, 0.22)',
    borderColor: 'rgba(180, 76, 255, 0.55)',
  },
  moodEmoji: { fontSize: 22 },
  editorCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    gap: 12,
  },
  textarea: {
    minHeight: 160,
    borderRadius: 16,
    padding: 12,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  saveBtn: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(180, 76, 255, 0.30)',
    borderWidth: 1,
    borderColor: 'rgba(180, 76, 255, 0.55)',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  entries: { gap: 10 },
  entryCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    gap: 8,
  },
  entryHeader: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '900',
  },
  entryText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  muted: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '600' },
  spacer: { flex: 1 },
});

