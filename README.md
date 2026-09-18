# ZAHIM (Zad Al-Himmah) 🌙⚡
> **The Next-Gen Islamic Productivity & Spiritual Habit Matrix**  
> *Meningkatkan Himmah, Mendisiplinkan Ibadah, & Menjaga Keseimbangan Ruhani.*

---

## 📌 Tentang ZAHIM
**ZAHIM (Zad Al-Himmah)** adalah aplikasi produktivitas dan pelacak kebiasaan Islami modern yang menggabungkan estetika **Cyberpunk Neon Dark & Notion-Style Cleanliness** dengan prinsip-prinsip ketakwaan dan disiplin ruhani harian.

Dibangun menggunakan **Expo SDK 57**, **React Native 0.86**, dan **Zustand**, ZAHIM dirancang ringan, responsif (mendukung perangkat Android, iOS, Tablet, maupun Web Desktop), dan dapat dioperasikan secara offline.

---

## ✨ Fitur-Fitur Utama

### 1. 📊 Himmah Index & Circular Score
- Perhitungan skor pencapaian ibadah & rutinitas harian secara dinamis.
- Bonus XP dari pencapaian milestone target dan checklist harian.
- Heatmap kalender bulanan interaktif bergaya kontribusi GitHub.

### 2. 🕌 Jadwal Sholat & Kompas Arah Kiblat
- Perhitungan waktu sholat astronomis presisi tinggi (*metode Kemenag RI / MWL*) menggunakan library `adhan`.
- Live countdown waktu sholat berikutnya secara real-time.
- Kompas penunjuk arah kiblat interaktif berdasarkan azimuth kota dan sensor orientasi perangkat.
- Pengaturan kota-kota besar di seluruh Indonesia.

### 3. 📖 Mushaf Al-Qur'an & Kalkulator Khatam
- Daftar surah Al-Qur'an lengkap dengan teks Arab Utsmani, transliterasi Latin, dan terjemahan bahasa Indonesia.
- **Kalkulator Target Khatam**: Perkirakan tanggal khatam berdasarkan target lembar per hari.
- Fitur penanda terakhir dibaca (bookmark) yang tersimpan otomatis di penyimpanan lokal.

### 4. 📿 Counter Dzikir & Tasbih Interaktif
- Dzikir Pagi & Petang sesuai sunnah lengkap dengan keutamaan & dalil shahih.
- Counter tasbih sentuh interaktif dengan respon **Haptic Feedback (getaran)** setiap ketukan dan saat mencapai target (33x / 100x).

### 5. 💰 Kalkulator Zakat & Sedekah Subuh
- Kalkulator Zakat Maal otomatis berdasarkan nisab harga emas 85 gram terkini (2.5%).
- Pencatat streak sedekah subuh harian untuk memicu konsistensi bersedekah.

### 6. 🌙 Kalender Puasa Sunnah
- Deteksi otomatis jadwal puasa sunnah terdekat: **Senin-Kamis**, **Ayyamul Bidh**, **Puasa Daud**, dan puasa sunnah lainnya.
- Teks bacaan niat puasa Arab, Latin, dan terjemahan.

### 7. ⏱️ Focus Pomodoro Timer
- Timer fokus kerja / tilawah terintegrasi untuk menjaga konsentrasi tanpa distraksi.
- Memberikan kontribusi poin produktivitas ke skor Himmah harian.

### 8. 📝 Smart Memos & Target Milestones
- Manajemen target dan proyek penting dengan sistem sub-milestone checklist.
- Setiap milestone yang terselesaikan memberikan bonus XP ke total Himmah Index.

### 9. 🤲 99 Asmaul Husna & Kumpulan Doa Sehari-hari
- Eksplorasi 99 Nama Allah beserta makna, keagungan, dan dalilnya.
- Kumpulan doa-doa harian mustajab bersumber dari Al-Qur'an & As-Sunnah.

---

## 🛠️ Tech Stack
- **Framework**: [Expo](https://expo.dev/) (SDK 57)
- **Engine**: [React Native](https://reactnative.dev/) 0.86.3
- **Core Library**: [React 19](https://react.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Astronomical Math**: `adhan`
- **Sensors & Haptics**: `expo-haptics`, `expo-status-bar`
- **Icons**: `lucide-react-native`
- **Graphics**: `react-native-svg`
- **Web Support**: `react-native-web`

---

## 🚀 Menjalankan Project Secara Lokal

### Prasyarat
- Node.js versi 18+ atau LTS
- npm atau yarn

### Instalasi
```bash
# Clone repository
git clone https://github.com/Nighthound22/ZAHIM.git
cd ZAHIM

# Install dependensi
npm install
```

### Menjalankan Development Server
```bash
# Buka menu Expo
npm start

# Jalankan di Android (via Expo Go atau Emulator)
npm run android

# Jalankan di browser (Web)
npm run web
```

---

## 📱 Build APK Android (Standalone Preview)
Project ini telah dikonfigurasi dengan EAS Build profile `preview` untuk menghasilkan file `.apk` mandiri:

```bash
# 1. Login ke akun Expo
npx eas-cli login

# 2. Jalankan build APK
npm run build:apk
```

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail lengkap.
