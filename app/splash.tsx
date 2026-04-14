import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const dotAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    const loop = Animated.loop(
      Animated.timing(dotAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
    );
    loop.start();

    const t = setTimeout(() => {
      router.replace('/index');
    }, 2000);

    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [dotAnim, fadeAnim, router]);

  const dots = useMemo(() => [0, 1, 2], []);

  return (
    <LinearGradient colors={['#090A14', '#1A0B2E', '#0B1E4D']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} scrollEnabled={false}>
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.logo}>Ruh İyi</Text>
          <View style={styles.dotsRow}>
            {dots.map((i) => {
              const opacity = dotAnim.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: i === 0 ? [0.25, 1, 0.25, 0.25] : i === 1 ? [0.25, 0.25, 1, 0.25] : [0.25, 0.25, 0.25, 1],
              });
              const translateY = dotAnim.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: i === 0 ? [0, -4, 0, 0] : i === 1 ? [0, 0, -4, 0] : [0, 0, 0, -4],
              });
              return (
                <Animated.View key={i} style={[styles.dot, { opacity, transform: [{ translateY }] }]} />
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#C9A7FF',
  },
});

