import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import BottomTabs from './_components/BottomTabs';

type CategoryKey = 'stress' | 'sleep' | 'physical';

const CATEGORIES: Array<{
  key: CategoryKey;
  emoji: string;
  title: string;
  subtitle: string;
  accent: string;
}> = [
  {
    key: 'stress',
    emoji: '🧘',
    title: 'Stres Yönetimi',
    subtitle: 'Daha sakin, daha dengeli hisset.',
    accent: '#7C4DFF',
  },
  {
    key: 'sleep',
    emoji: '🌙',
    title: 'İyi Uyku',
    subtitle: 'Uyku rutininin kontrolünü ele al.',
    accent: '#4FC3F7',
  },
  {
    key: 'physical',
    emoji: '💪',
    title: 'Fiziksel İyi Oluş',
    subtitle: 'Bedenini destekle, enerjini artır.',
    accent: '#8E7BFF',
  },
];

const QUOTES = [
  'Küçük adımlar, büyük değişimlerin başlangıcıdır.',
  'Bugün kendine nazik davran. Buna ihtiyacın var.',
  'Nefes al. Geçmiş bitti, gelecek henüz gelmedi.',
  'İyileşmek doğrusal değildir; yine de ilerliyorsun.',
  'Kendini seçmek, bencillik değil; gerekliliktir.',
] as const;

const MOODS = [
  { emoji: '😔', label: 'Üzgün', message: 'Bugün yavaşlamak da bir ilerlemedir.' },
  { emoji: '😟', label: 'Kaygılı', message: 'Bir nefes. Şu an güvendesin.' },
  { emoji: '😐', label: 'Nötr', message: 'Dengeyi korumak da bir başarı.' },
  { emoji: '🙂', label: 'İyi', message: 'Güzel. Bu enerjiyi küçük bir rutinle destekle.' },
  { emoji: '😊', label: 'Harika', message: 'Muhteşem! Bu anı fark et ve tadını çıkar.' },
] as const;

function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function HomeScreen() {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);
  const quote = useMemo(() => QUOTES[dayOfYear(now) % QUOTES.length], [now]);
  const formattedDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('tr-TR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      }).format(now);
    } catch {
      return now.toLocaleDateString();
    }
  }, [now]);

  const [moodIdx, setMoodIdx] = useState<number | null>(null);
  const fade = useRef(new Animated.Value(0)).current;

  const anims = useMemo(
    () =>
      CATEGORIES.map(() => ({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(18),
      })),
    [],
  );

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    Animated.stagger(
      90,
      anims.flatMap((a) => [
        Animated.timing(a.opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(a.translateY, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    ).start();
  }, [anims, fade]);

  return (
    <LinearGradient colors={['#090A14', '#1A0B2E', '#0B1E4D']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fade }}>
          <View style={styles.header}>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Merhaba 👋</Text>
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
            <Text style={styles.motivation}>{quote}</Text>
          </View>

          <View style={styles.moodCard}>
            <Text style={styles.sectionTitle}>Bugün nasıl hissediyorsun?</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m, idx) => {
                const active = moodIdx === idx;
                return (
                  <Pressable
                    key={m.label}
                    accessibilityRole="button"
                    onPress={() => setMoodIdx(idx)}
                    style={[styles.moodPill, active && styles.moodPillActive]}>
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.moodMessage}>
              {moodIdx === null ? 'Bir emoji seç; sana küçük bir mesaj göstereyim.' : MOODS[moodIdx].message}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/journal')}
            style={({ pressed }) => [styles.journalCard, pressed && styles.cardPressed]}>
            <Text style={styles.journalEmoji}>📝</Text>
            <View style={styles.journalBody}>
              <Text style={styles.journalTitle}>Günlüğüm</Text>
              <Text style={styles.journalSubtitle}>Duygularını yaz, geriye dönüp gözlemle.</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.cards}>
          {CATEGORIES.map((c, idx) => (
            <Animated.View
              key={c.key}
              style={{
                opacity: anims[idx]?.opacity,
                transform: [{ translateY: anims[idx]?.translateY }],
              }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/detail/${c.key}`)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)']}
                  style={styles.cardBg}>
                  <Text style={styles.cardEmoji}>{c.emoji}</Text>
                  <View style={[styles.cardAccent, { backgroundColor: c.accent }]} />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{c.title}</Text>
                    <Text style={styles.cardSubtitle}>{c.subtitle}</Text>
                  </View>
                  <Text style={styles.cardCta}>Aç</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ))}
        </View>

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
    gap: 18,
    flexGrow: 1,
  },
  header: {
    gap: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  date: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  motivation: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
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
  moodEmoji: {
    fontSize: 22,
  },
  moodMessage: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  journalCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  journalEmoji: { fontSize: 26 },
  journalBody: { flex: 1, gap: 6 },
  journalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  journalSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  chevron: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 26,
    fontWeight: '900',
    marginTop: -2,
  },
  cards: {
    gap: 14,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  cardBg: {
    padding: 18,
    paddingTop: 44,
    minHeight: 110,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  cardEmoji: {
    position: 'absolute',
    top: 12,
    left: 14,
    fontSize: 30,
    lineHeight: 32,
  },
  cardAccent: {
    width: 12,
    height: 54,
    borderRadius: 999,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  cardCta: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(180, 76, 255, 0.30)',
    borderWidth: 1,
    borderColor: 'rgba(180, 76, 255, 0.45)',
    overflow: 'hidden',
  },
  spacer: { flex: 1 },
});
