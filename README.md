# Ruh İyi 🧘

React Native & Expo ile geliştirilmiş ruh sağlığı ve iyi oluş uygulaması.

## Özellikler
- **Ana ekran**: Günlük motivasyon + ruh hali takibi
- **Stres Yönetimi**: Anket + 4-7-8 nefes egzersizi timer
- **İyi Uyku**: Uyku kalitesi anketi + rutin zaman çizelgesi
- **Fiziksel İyi Oluş**: Aktivite takibi + egzersiz kartları
- **Günlük tutma**: Ruh hali seçimi + kayıt + son 3 giriş
- **Profil**: İsim kaydı (AsyncStorage) + streak + başarımlar

## Ekranlar / Router Yapısı
Expo Router file-based routing kullanır (`app/` klasörü):
- `app/splash.tsx` – Splash (2 sn)
- `app/index.tsx` – Giriş
- `app/home.tsx` – Ana ekran
- `app/detail/[category].tsx` – Detay (stress / sleep / physical)
- `app/journal.tsx` – Günlük
- `app/profile.tsx` – Profil
- `app/settings.tsx` – Ayarlar (placeholder)

## Kurulum
1. Repoyu klonla

```bash
git clone https://github.com/polatirem/ruh-iyi-app.git
cd ruh-iyi-app
```

2. Bağımlılıkları yükle

```bash
npm install
```

3. Uygulamayı başlat

```bash
npx expo start
```

## Kullanım (Kısayollar)
- **Android**:

```bash
npm run android
```

- **iOS**: Expo Go uygulamasını kullan (iOS Simulator için macOS gerekir).

## Kullanılan Teknolojiler
- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **@react-native-async-storage/async-storage**
- **expo-linear-gradient**

## Video
[YouTube linki eklenecek]

## APK
[APK linki eklenecek]
