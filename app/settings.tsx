import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import BottomTabs from './_components/BottomTabs';

export default function SettingsScreen() {
  return (
    <LinearGradient colors={['#090A14', '#1A0B2E', '#0B1E4D']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ayarlar</Text>
          <Text style={styles.subtitle}>Şimdilik sadece tasarım yerleşimi.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tema</Text>
          <Text style={styles.cardText}>Koyu mor-mavi tema aktif.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bildirimler</Text>
          <Text style={styles.cardText}>Yakında: hatırlatıcılar ve rutin bildirimleri.</Text>
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
    gap: 14,
    flexGrow: 1,
  },
  header: { gap: 8 },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  cardText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  spacer: { flex: 1 },
});

