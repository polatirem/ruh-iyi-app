import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type CategoryKey = 'stress' | 'sleep' | 'physical';

import BottomTabs from '../_components/BottomTabs';

function isCategoryKey(value: unknown): value is CategoryKey {
  return value === 'stress' || value === 'sleep' || value === 'physical';
}

const CONTENT: Record<CategoryKey, { emoji: string; title: string; description: string }> = {
  stress: {
    emoji: '🧘',
    title: 'Stres Yönetimi',
    description:
      'Kısa egzersizler ve pratik önerilerle stresini fark et, düzenle ve gün içinde dengeyi koru.',
  },
  sleep: {
    emoji: '🌙',
    title: 'İyi Uyku',
    description:
      'Uyku hijyeni ve akşam rutinleriyle daha derin, daha kaliteli bir uyku için küçük adımlar at.',
  },
  physical: {
    emoji: '💪',
    title: 'Fiziksel İyi Oluş',
    description:
      'Hareket, nefes ve günlük alışkanlıklarla bedenini destekle; enerjini sürdürülebilir şekilde yükselt.',
  },
};

const OPTION_LABELS = ['Hiç', 'Az', 'Orta', 'Fazla', 'Çok Fazla'] as const;

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export default function DetailScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const key = isCategoryKey(params.category) ? params.category : 'stress';
  const data = CONTENT[key];

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [fade]);

  const stressQuestions = useMemo(
    () => [
      'Son 24 saatte ne kadar gergin hissettin?',
      'Düşüncelerini kontrol etmekte ne kadar zorlandın?',
      'Vücudunda (kalp çarpıntısı/gerginlik) ne kadar belirti hissettin?',
      'Küçük şeylere ne kadar kolay sinirlendin?',
      'Rahatlamak senin için ne kadar zordu?',
    ],
    [],
  );
  const [stressAnswers, setStressAnswers] = useState<Array<0 | 1 | 2 | 3 | 4 | 5>>([
    0, 0, 0, 0, 0,
  ]);

  const stressTotal = useMemo(
    () => stressAnswers.reduce<number>((sum, a) => sum + a, 0),
    [stressAnswers],
  );
  const stressLevel = useMemo(() => {
    if (stressAnswers.some((a) => a === 0)) return null;
    if (stressTotal <= 10) return 'Düşük stres';
    if (stressTotal <= 18) return 'Orta stres';
    return 'Yüksek stres';
  }, [stressAnswers, stressTotal]);

  const breatheSteps = useMemo(
    () => [
      { label: 'Nefes Al', seconds: 4, tint: 'rgba(180, 76, 255, 0.22)' },
      { label: 'Tut', seconds: 7, tint: 'rgba(79, 195, 247, 0.20)' },
      { label: 'Ver', seconds: 8, tint: 'rgba(255, 79, 216, 0.18)' },
    ],
    [],
  );
  const [breatheRunning, setBreatheRunning] = useState(false);
  const [breatheStepIdx, setBreatheStepIdx] = useState(0);
  const [breatheRemaining, setBreatheRemaining] = useState(breatheSteps[0]?.seconds ?? 4);
  const [breatheRound, setBreatheRound] = useState(0);
  const [breatheDone, setBreatheDone] = useState(false);
  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!breatheRunning) {
      circleAnim.stopAnimation();
      circleAnim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(circleAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(circleAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breatheRunning, circleAnim]);

  useEffect(() => {
    if (!breatheRunning) return;
    const t = setInterval(() => {
      setBreatheRemaining((r) => r - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [breatheRunning]);

  useEffect(() => {
    if (!breatheRunning) return;
    if (breatheRemaining > 0) return;

    const nextIdx = (breatheStepIdx + 1) % breatheSteps.length;
    const finishedCycle = nextIdx === 0;
    const nextRound = finishedCycle ? breatheRound + 1 : breatheRound;

    if (finishedCycle && nextRound >= 3) {
      setBreatheRunning(false);
      setBreatheDone(true);
      return;
    }

    setBreatheStepIdx(nextIdx);
    setBreatheRound(nextRound);
    setBreatheRemaining(breatheSteps[nextIdx]?.seconds ?? 4);
  }, [breatheRemaining, breatheRound, breatheRunning, breatheStepIdx, breatheSteps]);

  function startBreathing() {
    setBreatheDone(false);
    setBreatheRound(0);
    setBreatheStepIdx(0);
    setBreatheRemaining(breatheSteps[0]?.seconds ?? 4);
    setBreatheRunning(true);
  }

  const [sleepHours, setSleepHours] = useState<'lt4' | '4-6' | '6-8' | '8+' | null>(null);
  const sleepRecommendation = useMemo(() => {
    if (!sleepHours) return null;
    switch (sleepHours) {
      case 'lt4':
        return 'Bu gece öncelik: erken yat, ekranı 1 saat önce bırak ve kafeini azalt.';
      case '4-6':
        return 'Uyku süren biraz düşük. Yatış saatini 30 dk erkene çekmeyi dene.';
      case '6-8':
        return 'Harika! Bu düzeni korumak için aynı saatlerde yatıp kalkmaya çalış.';
      case '8+':
        return 'Çok iyi. Sabah ışığı ve hafif hareketle günü daha enerjik başlatabilirsin.';
    }
  }, [sleepHours]);

  const [activity, setActivity] = useState({
    walk: false,
    water: false,
    exercise: false,
    break: false,
  });
  const doneCount = useMemo(() => Object.values(activity).filter(Boolean).length, [activity]);
  const progress = useMemo(() => doneCount / 4, [doneCount]);

  return (
    <LinearGradient colors={['#0B1E4D', '#1A0B2E', '#090A14']} style={styles.container}>
      <Stack.Screen options={{ title: data.title }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fade }}>
          <View style={styles.header}>
            <Text style={styles.emoji}>{data.emoji}</Text>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.description}>{data.description}</Text>
          </View>

          {key === 'stress' && (
            <>
              <SectionTitle>Stres Seviyeni Ölç</SectionTitle>
              <Card>
                <View style={styles.survey}>
                  {stressQuestions.map((q, idx) => (
                    <View key={q} style={styles.questionBlock}>
                      <Text style={styles.questionText}>
                        {idx + 1}. {q}
                      </Text>
                      <View style={styles.optionsRow}>
                        {OPTION_LABELS.map((label, i) => {
                          const value = (i + 1) as 1 | 2 | 3 | 4 | 5;
                          const selected = stressAnswers[idx] === value;
                          return (
                            <Pressable
                              key={label}
                              accessibilityRole="button"
                              onPress={() =>
                                setStressAnswers((prev) => {
                                  const next = [...prev] as Array<0 | 1 | 2 | 3 | 4 | 5>;
                                  next[idx] = value;
                                  return next;
                                })
                              }
                              style={[styles.optionPill, selected && styles.optionPillSelected]}>
                              <Text
                                style={[styles.optionText, selected && styles.optionTextSelected]}>
                                {label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ))}

                  <View style={styles.surveyResult}>
                    <Text style={styles.resultLabel}>Toplam skor</Text>
                    <Text style={styles.resultValue}>{stressTotal} / 25</Text>
                    <Text style={styles.resultHint}>
                      {stressLevel ?? 'Tüm soruları cevapla; seviyeni burada göstereceğim.'}
                    </Text>
                  </View>
                </View>
              </Card>

              <SectionTitle>Bugünkü Nefes Egzersizi</SectionTitle>
              <Card>
                <Text style={styles.smallMuted}>
                  4-7-8 tekniği: sakinleşmek için ritimli nefes. 3 tur tamamla.
                </Text>

                <View style={styles.breatheRow}>
                  <View style={[styles.breatheBox, { backgroundColor: breatheSteps[0].tint }]}>
                    <Text style={styles.breatheTitle}>Nefes Al</Text>
                    <Text style={styles.breatheValue}>4 sn</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={[styles.breatheBox, { backgroundColor: breatheSteps[1].tint }]}>
                    <Text style={styles.breatheTitle}>Tut</Text>
                    <Text style={styles.breatheValue}>7 sn</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={[styles.breatheBox, { backgroundColor: breatheSteps[2].tint }]}>
                    <Text style={styles.breatheTitle}>Ver</Text>
                    <Text style={styles.breatheValue}>8 sn</Text>
                  </View>
                </View>

                <View style={styles.breatheLive}>
                  <Animated.View
                    style={[
                      styles.breatheCircle,
                      {
                        backgroundColor: breatheSteps[breatheStepIdx]?.tint ?? breatheSteps[0].tint,
                        transform: [
                          {
                            scale: circleAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.92, 1.06],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <View style={styles.breatheTextWrap}>
                    <Text style={styles.breathePhase}>
                      {breatheDone
                        ? 'Tebrikler! 🎉'
                        : breatheSteps[breatheStepIdx]?.label ?? 'Nefes'}
                    </Text>
                    {!breatheDone && (
                      <Text style={styles.breatheMeta}>
                        {breatheRunning ? `${breatheRemaining} sn` : 'Hazır olduğunda başlat'}
                        {' · '}
                        Tur {Math.min(breatheRound + 1, 3)} / 3
                      </Text>
                    )}
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={startBreathing}
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressedBtn]}>
                  <Text style={styles.primaryBtnText}>
                    {breatheRunning ? 'Yeniden Başlat' : 'Egzersizi Başlat'}
                  </Text>
                </Pressable>
              </Card>
            </>
          )}

        {key === 'sleep' && (
          <>
            <SectionTitle>Uyku Kalitesi</SectionTitle>
            <Card>
              <Text style={styles.questionText}>Kaç saat uyudun?</Text>
              <View style={styles.optionsRowWrap}>
                {[
                  { id: 'lt4' as const, label: "4'ten az" },
                  { id: '4-6' as const, label: '4-6' },
                  { id: '6-8' as const, label: '6-8' },
                  { id: '8+' as const, label: '8+' },
                ].map((o) => {
                  const selected = sleepHours === o.id;
                  return (
                    <Pressable
                      key={o.id}
                      accessibilityRole="button"
                      onPress={() => setSleepHours(o.id)}
                      style={[styles.choiceChip, selected && styles.choiceChipSelected]}>
                      <Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>
                        {o.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.recoText}>
                {sleepRecommendation ?? 'Bir seçenek seç; sana küçük bir öneri göstereyim.'}
              </Text>
            </Card>

            <SectionTitle>Uyku Rutini</SectionTitle>
            <View style={styles.timeline}>
              {[
                { time: '21:00', text: 'Ekranları kapat', tint: 'rgba(79, 195, 247, 0.18)' },
                { time: '21:30', text: 'Kitap oku', tint: 'rgba(180, 76, 255, 0.18)' },
                { time: '22:00', text: 'Işıkları kıs', tint: 'rgba(255, 79, 216, 0.16)' },
                { time: '22:30', text: 'Uyu', tint: 'rgba(142, 123, 255, 0.16)' },
              ].map((s) => (
                <View key={s.time} style={[styles.timelineCard, { backgroundColor: s.tint }]}>
                  <Text style={styles.timelineTime}>{s.time}</Text>
                  <Text style={styles.timelineText}>{s.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {key === 'physical' && (
          <>
            <SectionTitle>Günlük Hareket Takibi</SectionTitle>
            <Card>
              {[
                { key: 'walk' as const, label: 'Yürüyüş', emoji: '🚶' },
                { key: 'water' as const, label: 'Su İç', emoji: '💧' },
                { key: 'exercise' as const, label: 'Egzersiz', emoji: '🏋️' },
                { key: 'break' as const, label: 'Mola Ver', emoji: '🧘‍♂️' },
              ].map((a) => {
                const checked = activity[a.key];
                return (
                  <Pressable
                    key={a.key}
                    accessibilityRole="button"
                    onPress={() => setActivity((p) => ({ ...p, [a.key]: !p[a.key] }))}
                    style={[styles.activityRow, checked && styles.activityRowChecked]}>
                    <Text style={styles.activityEmoji}>{a.emoji}</Text>
                    <Text style={styles.activityLabel}>{a.label}</Text>
                    <Text style={styles.activityCheck}>{checked ? '✅' : '⬜️'}</Text>
                  </Pressable>
                );
              })}

              <View style={styles.progressMeta}>
                <Text style={styles.smallMuted}>Tamamlanan: {doneCount} / 4</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
                </View>
              </View>
            </Card>

            <SectionTitle>Bugünün Egzersizi</SectionTitle>
            <View style={styles.exerciseGrid}>
              {[
                { emoji: '🏃', name: 'Hafif Kardiyo', duration: '8 dk' },
                { emoji: '🧎', name: 'Core', duration: '6 dk' },
                { emoji: '🧘', name: 'Esneme', duration: '5 dk' },
              ].map((e) => (
                <View key={e.name} style={styles.exerciseCard}>
                  <Text style={styles.exerciseEmoji}>{e.emoji}</Text>
                  <Text style={styles.exerciseName}>{e.name}</Text>
                  <Text style={styles.exerciseDuration}>{e.duration}</Text>
                </View>
              ))}
            </View>
          </>
        )}

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
    paddingTop: 104,
    paddingBottom: 16,
    gap: 14,
    flexGrow: 1,
  },
  header: { gap: 10 },
  emoji: { fontSize: 56, lineHeight: 62 },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  description: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  card: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    gap: 12,
  },
  survey: { gap: 14 },
  questionBlock: { gap: 10 },
  questionText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  optionPillSelected: {
    backgroundColor: 'rgba(180, 76, 255, 0.26)',
    borderColor: 'rgba(180, 76, 255, 0.55)',
  },
  optionText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '800',
  },
  optionTextSelected: { color: '#FFFFFF' },
  surveyResult: {
    marginTop: 2,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    gap: 6,
  },
  resultLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '800',
  },
  resultValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  resultHint: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  smallMuted: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  breatheRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  breatheBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 6,
  },
  breatheTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  breatheValue: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 16,
    fontWeight: '900',
  },
  arrow: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 16,
    fontWeight: '900',
    marginTop: -2,
  },
  breatheLive: {
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breatheCircle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  breatheTextWrap: { flex: 1, gap: 6 },
  breathePhase: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  breatheMeta: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '800',
  },
  primaryBtn: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(180, 76, 255, 0.30)',
    borderWidth: 1,
    borderColor: 'rgba(180, 76, 255, 0.55)',
    marginTop: 6,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  pressedBtn: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  optionsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  choiceChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  choiceChipSelected: {
    backgroundColor: 'rgba(180, 76, 255, 0.26)',
    borderColor: 'rgba(180, 76, 255, 0.55)',
  },
  choiceChipText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '800',
  },
  choiceChipTextSelected: { color: '#FFFFFF' },
  recoText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  timeline: { gap: 10 },
  timelineCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 8,
  },
  timelineTime: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  timelineText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    fontWeight: '800',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activityRowChecked: {
    backgroundColor: 'rgba(79, 195, 247, 0.10)',
    borderColor: 'rgba(79, 195, 247, 0.22)',
  },
  activityEmoji: { fontSize: 18 },
  activityLabel: {
    flex: 1,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '800',
  },
  activityCheck: { fontSize: 16 },
  progressMeta: { gap: 10, marginTop: 6 },
  progressBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(180, 76, 255, 0.9)',
  },
  exerciseGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  exerciseCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    gap: 8,
  },
  exerciseEmoji: { fontSize: 22 },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  exerciseDuration: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '800',
  },
  spacer: { flex: 1 },
});
