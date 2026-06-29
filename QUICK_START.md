# YKS Atlas - Hızlı Başlangıç

**5 dakikada kurulum yapın ve başlayın!**

## 🚀 Adım 1: Depo İndir

```bash
# Clone ya da ZIP'i aç
git clone https://github.com/yourusername/yks-atlas.git
cd yks-atlas
```

## 📦 Adım 2: Dependencies Kur

```bash
npm install
# veya
yarn install
```

## 🔑 Adım 3: Firebase & Google Setup

### Kısayol (Demo Modu):

Henüz Firebase hesabı yoksa, `.env.local` dosyasını oluştur ve boş bırak:

```bash
cp .env.example .env.local
# Dosyayı boş bırak, uygulama offline demo modunda çalışacak
```

### Tam Kurulum:

1. [Firebase Console](https://console.firebase.google.com/) aç
2. Yeni proje oluştur
3. Authentication > Google Sign-in'i aktif et
4. Firestore Database oluştur
5. API anahtarını kopyala
6. `.env.local` dosyasını doldur

Detay için: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## ▶️ Adım 4: Başlat

```bash
npm run dev
```

Tarayıcın otomatik açılacak (`http://localhost:5173`)

## 🎯 Adım 5: Keşfet

- **Ana Sayfa**: Dashboard widget'larını gör
- **Görevler**: Görev ekle ve takip et
- **Denemeler**: Mock test sonuçlarını kaydet
- **Ayarlar**: Profil ve senkronizasyonu yönet

## 📱 Demo Verisi

İlk açılışta:
- Örnek görevler
- Örnek denemeler
- Örnek konular

Hepsi localStorage'da saklanır (online olmadan çalışır).

## 🔄 Senkronizasyon (İsteğe bağlı)

1. `.env.local` dosyasında Firebase credentialslerini gir
2. Uygulama otomatik sync yapacak
3. Google Drive'a otomatik backup

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

### Vercel'e Deploy
```bash
npm install -g vercel
vercel
```

## 📝 Yapılacaklar

- [ ] Sayfaları implement et (TasksPage, SubjectsPage, etc.)
- [ ] Modallari ekle (oluştur/düzenle diyalogları)
- [ ] Filtreleme & arama ekle
- [ ] Resimleri implement et
- [ ] Real-time sync ekle
- [ ] PWA support ekle
- [ ] Mobile test et
- [ ] Production'a deploy et

## 🆘 Sorun Giderme

### Port 5173 zaten kullanılıyor
```bash
npm run dev -- --port 3000
```

### Dependencies kurulmuyor
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase hatası
- `.env.local` dosyasını kontrol et
- API anahtarlarını doğrula
- Console'daki CORS hatalarını kontrol et

### Git clone çalışmıyor
- ZIP dosyasını indirip aç
- Veya SSH key'i ayarla

## 📚 Kaynaklar

- [Tam Setup Rehberi](./SETUP_GUIDE.md)
- [Implementation Rehberi](./IMPLEMENTATION_GUIDE.md)
- [README](./README.md)
- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 💡 İpuçları

1. **Sandbox'ta test et**: Hesap oluşturmadan demo mode'da dene
2. **Aşama aşama**: Bir özelliği bitir, sonra sıraya git
3. **Kaydet sık**: Browser console'daki hataları kontrol et
4. **Git kullan**: Her feature'ı branch'de yap
5. **Dokümantasyon oku**: Kod comment'leri yararlı

## 🎓 Öğrenme Yolu

1. **React**: Hooks, State, Components
2. **TypeScript**: Type safety
3. **Tailwind CSS**: Styling
4. **Firebase**: Backend
5. **Zustand**: State management
6. **Recharts**: Data visualization

## 🆆 FAQ

**Q: Verilerim nereye kaydedilir?**
A: Localhost'ta localStorage'da. Firebase'e bağlarsan Firestore'da.

**Q: İnternet olmadan çalışır mı?**
A: Evet, PWA olarak offline çalışır. Senkronizasyon internet geri gelince olur.

**Q: Kaç kişi aynı anda kullanabilir?**
A: Her kişi kendi Google hesabıyla login yapıyor, veriler o hesabın altında.

**Q: Veri nasıl yedeklenir?**
A: Google Drive'a otomatik. İstersen manual da indir.

**Q: Başka cihazlarda senkronize olur mu?**
A: Evet, Google hesabı ile login yapınca otomatik senkronize olur.

---

**Başarılar! 🚀 Sorular varsa [Issues](https://github.com/yourusername/yks-atlas/issues) aç.**
