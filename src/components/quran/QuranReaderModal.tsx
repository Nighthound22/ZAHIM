import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { SURAH_LIST, Surah } from '../../data/surahData';
import { useQuranDhikrStore } from '../../store/useQuranDhikrStore';
import { soundHaptics } from '../../services/soundHaptics';
import { X, BookOpen, Bookmark, Sparkles, Check, ChevronRight, Calculator, Calendar } from 'lucide-react-native';

interface QuranReaderModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuranReaderModal: React.FC<QuranReaderModalProps> = ({ visible, onClose }) => {
  const [selectedSurahId, setSelectedSurahId] = useState<number>(SURAH_LIST[0].id);
  const [activeTab, setActiveTab] = useState<'baca' | 'strategi'>('baca');
  const [markedAyah, setMarkedAyah] = useState<number | null>(null);

  const { progress, updateQuranProgress, getKhatamEstimate } = useQuranDhikrStore();
  const estimate = getKhatamEstimate();

  const currentSurah: Surah =
    SURAH_LIST.find((s) => s.id === selectedSurahId) || SURAH_LIST[0];

  const handleBookmarkAyah = (ayahNumber: number) => {
    soundHaptics.celebrate();
    setMarkedAyah(ayahNumber);
    // Approximate page based on juz / surah
    const approxPage = Math.min(604, Math.max(1, currentSurah.juz * 20));
    updateQuranProgress(approxPage, currentSurah.id, ayahNumber);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <BookOpen size={18} color="#00FF66" />
              </View>
              <View>
                <Text style={styles.title}>Mushaf & Tilawah Al-Qur'an</Text>
                <Text style={styles.subtitle}>Teks Arab Utsmani, Latin, Terjemah & Strategi Khatam</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Top Main Tabs: Baca Surah vs Strategi Khatam */}
          <View style={styles.mainTabs}>
            <TouchableOpacity
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('baca');
              }}
              style={[styles.mainTab, activeTab === 'baca' && styles.mainTabActive]}
            >
              <Text style={[styles.mainTabText, activeTab === 'baca' && styles.mainTabTextActive]}>
                📖 Baca Surah Pilihan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('strategi');
              }}
              style={[styles.mainTab, activeTab === 'strategi' && styles.mainTabActive]}
            >
              <Text style={[styles.mainTabText, activeTab === 'strategi' && styles.mainTabTextActive]}>
                📅 Strategi Khatam Sholat
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'baca' ? (
            <>
              {/* Horizontal Surah Selector */}
              <View style={styles.surahSelectorWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.surahScroll}>
                  {SURAH_LIST.map((surah) => {
                    const isSelected = surah.id === currentSurah.id;
                    return (
                      <TouchableOpacity
                        key={surah.id}
                        onPress={() => {
                          soundHaptics.lightTap();
                          setSelectedSurahId(surah.id);
                          setMarkedAyah(null);
                        }}
                        style={[styles.surahPill, isSelected && styles.surahPillActive]}
                      >
                        <Text style={[styles.surahPillNumber, isSelected && styles.surahPillNumberActive]}>
                          {surah.id}
                        </Text>
                        <Text style={[styles.surahPillName, isSelected && styles.surahPillNameActive]}>
                          {surah.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Surah Header Card */}
              <View style={styles.surahInfoCard}>
                <View style={styles.surahInfoLeft}>
                  <Text style={styles.surahInfoName}>{currentSurah.name}</Text>
                  <Text style={styles.surahInfoMeta}>
                    {currentSurah.meaning} • {currentSurah.ayahCount} Ayat • Juz {currentSurah.juz} • {currentSurah.type}
                  </Text>
                  <Text style={styles.surahFadhilahText}>
                    ✨ {currentSurah.fadhilah}
                  </Text>
                </View>
                <Text style={styles.surahArabicTitle}>{currentSurah.nameArabic}</Text>
              </View>

              {/* Ayah List */}
              <ScrollView style={styles.ayahScroll} showsVerticalScrollIndicator={false}>
                {/* Bismillah for all surahs except At-Taubah (id 9) and Al-Fatihah already has it as verse 1 */}
                {currentSurah.id !== 1 && currentSurah.id !== 9 && (
                  <View style={styles.bismillahBox}>
                    <Text style={styles.bismillahArabic}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
                    <Text style={styles.bismillahLatin}>Bismillaahir-rahmaanir-rahiim</Text>
                  </View>
                )}

                {currentSurah.ayahs.map((ayah) => {
                  const isCurrentBookmark =
                    progress.lastSurah === currentSurah.id && progress.lastAyah === ayah.number;

                  return (
                    <View key={ayah.number} style={styles.ayahCard}>
                      {/* Top Row: Ayah Number & Bookmark Action */}
                      <View style={styles.ayahHeaderRow}>
                        <View style={styles.ayahBadge}>
                          <Text style={styles.ayahBadgeText}>{ayah.number}</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => handleBookmarkAyah(ayah.number)}
                          style={[
                            styles.bookmarkBtn,
                            isCurrentBookmark && styles.bookmarkBtnActive,
                          ]}
                        >
                          {isCurrentBookmark ? (
                            <>
                              <Check size={13} color="#00FF66" />
                              <Text style={styles.bookmarkTextActive}>Terakhir Dibaca</Text>
                            </>
                          ) : (
                            <>
                              <Bookmark size={13} color={Colors.textMuted} />
                              <Text style={styles.bookmarkText}>Tandai</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>

                      {/* Arabic Verse */}
                      <Text style={styles.ayahArabic}>{ayah.arab}</Text>

                      {/* Latin Transliteration */}
                      <Text style={styles.ayahLatin}>{ayah.latin}</Text>

                      {/* Indonesian Translation */}
                      <Text style={styles.ayahTranslation}>{ayah.translation}</Text>
                    </View>
                  );
                })}

                <View style={{ height: 24 }} />
              </ScrollView>
            </>
          ) : (
            /* Strategi Khatam Tab */
            <ScrollView style={styles.strategiScroll} showsVerticalScrollIndicator={false}>
              {/* Overview Card */}
              <View style={styles.khatamOverviewCard}>
                <View style={styles.khatamTop}>
                  <Calculator size={18} color="#00FF66" />
                  <Text style={styles.khatamTitle}>Formula Khatam Berbasis Sholat Fardhu</Text>
                </View>
                <Text style={styles.khatamDesc}>
                  Metode termudah mengkhatamkan 30 Juz (604 halaman Al-Qur'an) adalah membagi target membaca tepat setelah sholat 5 waktu:
                </Text>

                <View style={styles.fardhuGrid}>
                  {[
                    { prayer: 'Shubuh', pages: '4 Halaman (2 Lembar)', note: 'Saat pikiran masih jernih & segar' },
                    { prayer: 'Dzuhur', pages: '4 Halaman (2 Lembar)', note: 'Jeda istirahat siang kantor' },
                    { prayer: 'Ashar', pages: '4 Halaman (2 Lembar)', note: 'Penyegar penat sore hari' },
                    { prayer: 'Maghrib', pages: '4 Halaman (2 Lembar)', note: 'Menunggu waktu Isya' },
                    { prayer: 'Isya', pages: '4 Halaman (2 Lembar)', note: 'Penutup hari sebelum tidur' },
                  ].map((item, idx) => (
                    <View key={idx} style={styles.fardhuRow}>
                      <View style={styles.fardhuPill}>
                        <Text style={styles.fardhuName}>{item.prayer}</Text>
                      </View>
                      <View style={styles.fardhuDetail}>
                        <Text style={styles.fardhuPages}>{item.pages}</Text>
                        <Text style={styles.fardhuNote}>{item.note}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Total Daily Formula */}
                <View style={styles.totalFormulaBox}>
                  <Text style={styles.totalFormulaTitle}>Hasil Akumulasi Harian:</Text>
                  <Text style={styles.totalFormulaHighlight}>
                    5 Sholat × 4 Halaman = 20 Halaman / Hari (= 1 Juz)
                  </Text>
                  <Text style={styles.totalFormulaSub}>
                    ✨ InsyaAllah dalam 30 Hari Anda Khatam 30 Juz secara konsisten tanpa terasa berat!
                  </Text>
                </View>
              </View>

              {/* Your Personal Khatam Status */}
              <View style={styles.myKhatamCard}>
                <View style={styles.khatamTop}>
                  <Calendar size={18} color="#38BDF8" />
                  <Text style={[styles.khatamTitle, { color: '#38BDF8' }]}>Progres Tilawah Anda Saat Ini</Text>
                </View>

                <View style={styles.myKhatamMetrics}>
                  <View style={styles.myMetricItem}>
                    <Text style={styles.myMetricNum}>{progress.quranPagesRead}</Text>
                    <Text style={styles.myMetricLabel}>Halaman Dibaca</Text>
                  </View>
                  <View style={styles.myMetricItem}>
                    <Text style={styles.myMetricNum}>{estimate.pagesRemaining}</Text>
                    <Text style={styles.myMetricLabel}>Halaman Sisa</Text>
                  </View>
                  <View style={styles.myMetricItem}>
                    <Text style={[styles.myMetricNum, { color: '#00FF66' }]}>{estimate.daysRemaining} Hari</Text>
                    <Text style={styles.myMetricLabel}>Estimasi Khatam</Text>
                  </View>
                </View>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#0F1117',
    width: '100%',
    maxWidth: 620,
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 18,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBright,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#14171F',
  },
  mainTabs: {
    flexDirection: 'row',
    backgroundColor: '#14171F',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  mainTabActive: {
    backgroundColor: '#1F2432',
  },
  mainTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  mainTabTextActive: {
    color: Colors.textBright,
  },
  surahSelectorWrap: {
    marginBottom: 12,
  },
  surahScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  surahPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  surahPillActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderColor: '#00FF66',
  },
  surahPillNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  surahPillNumberActive: {
    color: '#00FF66',
  },
  surahPillName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  surahPillNameActive: {
    color: Colors.textBright,
  },
  surahInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#14171F',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2432',
    marginBottom: 14,
  },
  surahInfoLeft: {
    flex: 1,
    paddingRight: 10,
  },
  surahInfoName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBright,
  },
  surahInfoMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  surahFadhilahText: {
    fontSize: 11,
    color: '#FBBF24',
    marginTop: 4,
    fontStyle: 'italic',
  },
  surahArabicTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00FF66',
  },
  ayahScroll: {
    flex: 1,
  },
  bismillahBox: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: '#14171F',
    borderRadius: 12,
  },
  bismillahArabic: {
    fontSize: 22,
    color: Colors.textBright,
    fontWeight: '600',
  },
  bismillahLatin: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  ayahCard: {
    backgroundColor: '#14171F',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2432',
    marginBottom: 10,
  },
  ayahHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ayahBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00FF66',
  },
  bookmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1F2432',
  },
  bookmarkBtnActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  bookmarkText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bookmarkTextActive: {
    fontSize: 11,
    color: '#00FF66',
    fontWeight: '600',
  },
  ayahArabic: {
    fontSize: 22,
    color: Colors.textBright,
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: 10,
  },
  ayahLatin: {
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  ayahTranslation: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  strategiScroll: {
    flex: 1,
  },
  khatamOverviewCard: {
    backgroundColor: '#14171F',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2432',
    marginBottom: 14,
  },
  khatamTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  khatamTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00FF66',
  },
  khatamDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  fardhuGrid: {
    gap: 8,
    marginBottom: 16,
  },
  fardhuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1117',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  fardhuPill: {
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  fardhuName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00FF66',
  },
  fardhuDetail: {
    flex: 1,
  },
  fardhuPages: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textBright,
  },
  fardhuNote: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  totalFormulaBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  totalFormulaTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FBBF24',
    marginBottom: 2,
  },
  totalFormulaHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textBright,
    marginBottom: 4,
  },
  totalFormulaSub: {
    fontSize: 11,
    color: '#FBBF24',
    lineHeight: 16,
  },
  myKhatamCard: {
    backgroundColor: '#14171F',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  myKhatamMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  myMetricItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#0F1117',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  myMetricNum: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textBright,
  },
  myMetricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
