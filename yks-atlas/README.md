# YKS Atlas - Akıllı YKS Takip Sistemi

## 🎯 Özet

YKS Atlas, sınav hazırlığını takip etmek, çalışma planlığını yönetmek ve çok cihazda senkronize çalışmak için tasarlanmış akıllı bir web uygulamasıdır.

**Özellikler:**
- ✅ Gerçek zamanlı çok-cihaz senkronizasyonu (Firebase)
- ☁️ Google Drive otomatik yedekleme
- 📊 Detaylı analitikler ve grafikler
- 🎯 Akıllı koç sistemi (kural-tabanlı öneriler)
- 🎮 Gamification (XP, seviye, rozetler, seri takibi)
- 🍅 Pomodoro zamanlayıcı
- 📱 Tamamen responsive (mobile-first)
- 🌙 Karanlık tema (optimized colors)
- 🔐 Google OAuth ile güvenli giriş
- 🚀 PWA - Install-able, offline-capable

## 🛠 Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom CSS Variables
- **State Management:** Zustand + localStorage persistence
- **Backend:** Firebase Realtime Database + Firestore
- **Authentication:** Firebase Auth + Google OAuth
- **Cloud Storage:** Google Drive API
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date handling:** date-fns

## 📋 Kurulum

### Prerequisites
- Node.js 18+
- npm / yarn
- Firebase Account
- Google Cloud Project

### 1. Repository'i Clone Et

```bash
git clone https://github.com/yourusername/yks-atlas.git
cd yks-atlas
```

### 2. Dependencies'i Kur

```bash
npm install
# or
yarn install
```

### 3. Ortam Değişkenlerini Ayarla

`.env` dosyası oluştur (`.env.example` örnek olarak kullan):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Google Drive API
VITE_GOOGLE_DRIVE_API_KEY=your_drive_api_key
```

### 4. Firebase Konfigürasyonu

1. [Firebase Console](https://console.firebase.google.com/) açık
2. Yeni bir proje oluştur
3. Authentication > Google Sign-in'i aktif et
4. Firestore Database oluştur (production mode)
5. Firestore Rules'u ayarla:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Google OAuth Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/) aç
2. Yeni bir proje oluştur
3. OAuth consent screen'i ayarla
4. OAuth 2.0 credentials (Web application) oluştur
5. Authorized redirect URIs'e `http://localhost:5173` ve production URL'i ekle
6. Drive API'yi enable et

### 6. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcında `http://localhost:5173` adresine git.

## 📁 Proje Yapısı

```
yks-atlas/
├── src/
│   ├── components/           # React components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── Dashboard/        # Dashboard components
│   │   ├── Tasks/            # Task management components
│   │   ├── Subjects/         # Subject tracking components
│   │   ├── Exams/            # Exam/mock test components
│   │   ├── Mistakes/         # Error analysis components
│   │   ├── Books/            # Book library components
│   │   ├── Notes/            # Notes components
│   │   ├── Pomodoro/         # Pomodoro timer components
│   │   ├── Analytics/        # Analytics/charts components
│   │   └── Common/           # Shared components (Button, Card, etc.)
│   │
│   ├── pages/                # Page components
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── SubjectsPage.tsx
│   │   ├── ExamsPage.tsx
│   │   ├── MistakesPage.tsx
│   │   ├── BooksPage.tsx
│   │   ├── NotesPage.tsx
│   │   ├── PomodoroPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── services/             # API integrations
│   │   ├── firebase.ts       # Firebase CRUD operations
│   │   ├── googleDrive.ts    # Google Drive sync
│   │   └── api.ts            # Other API calls
│   │
│   ├── store/                # Zustand store
│   │   └── index.ts
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuthContext.ts
│   │   ├── useSyncData.ts
│   │   ├── useLocalStorage.ts
│   │   └── ...
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── helpers.ts
│   │   ├── calculations.ts
│   │   └── constants.ts
│   │
│   ├── index.css             # Global styles
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
│
├── public/                   # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Deployment

### Vercel'e Deploy Et (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify'e Deploy Et

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Manuel Build

```bash
npm run build
# dist/ klasörünü web sunucusuna yükle
```

## 📱 Features Detaylı

### 1. **Dashboard**
- Günlük özet metrikler
- Son denemeler
- Zayıf konular analizi
- Net trendleri grafiği
- Motivasyon mesajları

### 2. **Task Management**
- Görev oluştur/düzenle/sil
- Öncelik seviyeleri (düşük, normal, yüksek)
- Due dates
- Ders bazlı filtreleme

### 3. **Subject Tracking**
- TYT + AYT konuları (müfredat entegre)
- Konu durumu (yok/devam/bitti)
- Soru sayma (doğru/yanlış/boş)
- Net hesaplaması
- Zayıflık analizi

### 4. **Exam Management**
- Mock test kaydı
- Bölüm bazlı sonuçlar
- Net hesaplama
- Trend analizi
- Simülasyon puanı

### 5. **Mistake Analysis**
- Hata kaydı yapma
- Kategori sınıflandırması (kavram/işlem/dikkatsizlik/bilgi boşluğu)
- Resim/video ekleme
- Konu bazlı hata yüzdeleri
- Tekrar sistemi

### 6. **Book Library**
- ISBN ile otomatik kitap ekleme
- Konu-kitap bağlaması
- İlerleme takibi
- Okuma durumu

### 7. **Pomodoro Timer**
- Özelleştirilebilir süreler
- Otomatik mola
- Seans tarihi
- Toplam odaklanma süresi

### 8. **Gamification**
- **XP System**: Görevler, soru girişi, konu bitirme vs. için puan
- **Levels**: Her 100 XP'de seviye atla
- **Streaks**: Ardışık çalışma günleri
- **Badges**: 11 farklı başarı rozeti
- **Leaderboard**: Kişisel statistikler

### 9. **Analytics**
- Haftalık/aylık çalışma saatleri
- Konu bazlı performans
- Doğru/yanlış oranı
- Net eğilimi
- Heatmap (çalışma paternleri)

### 10. **Senkronizasyon**
- Realtime Firebase sync
- Google Drive auto-backup
- Conflict resolution
- Offline-first architecture

## 🔐 Güvenlik

- Firebase Security Rules ile veri koruması
- Google OAuth ile güvenli giriş
- localStorage + indexed encryption
- HTTPS enforced (production)
- No sensitive data in code

## 🤝 Katkıda Bulun

1. Fork the repository
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Değişiklikleri commit et (`git commit -m 'Add amazing feature'`)
4. Branch'e push et (`git push origin feature/amazing-feature`)
5. Pull Request aç

## 📝 License

MIT License - bkz. [LICENSE](LICENSE) dosyası

## 📧 İletişim

- Email: support@yksatlas.com
- Twitter: [@yksatlas](https://twitter.com/yksatlas)
- Instagram: [@yksatlas](https://instagram.com/yksatlas)

## 🙏 Teşekkürler

- Firebase ve Google Cloud ekiplerine
- Tailwind CSS topluluğuna
- React ekosistemi katkıcılarına

---

**Made with ❤️ for YKS students**
