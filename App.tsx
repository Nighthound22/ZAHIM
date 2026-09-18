import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/theme/colors';
import { TabType } from './src/types';

// Stores
import { useHabitStore } from './src/store/useHabitStore';
import { usePrayerStore } from './src/store/usePrayerStore';
import { useQuranDhikrStore } from './src/store/useQuranDhikrStore';
import { useMemoStore } from './src/store/useMemoStore';
import { useAuthStore } from './src/store/useAuthStore';

// UI Components
import { NotionCard } from './src/components/ui/NotionCard';
import { NeonButton } from './src/components/ui/NeonButton';
import { CircularGauge } from './src/components/habits/CircularGauge';
import { MonthlyHeatmap } from './src/components/habits/MonthlyHeatmap';
import { HabitMatrix } from './src/components/habits/HabitMatrix';
import { PrayerBanner } from './src/components/prayer/PrayerBanner';
import { PrayerTimesList } from './src/components/prayer/PrayerTimesList';
import { QuranProgressCard } from './src/components/quran/QuranProgressCard';
import { SmartMemoCard } from './src/components/memo/SmartMemoCard';
import { ResponsiveShell } from './src/components/layout/ResponsiveShell';

// Profile & Metrics Components (Matching user reference)
import { ProfileHeader } from './src/components/profile/ProfileHeader';
import { MetricCardsGrid } from './src/components/profile/MetricCardsGrid';
import { EditProfileModal } from './src/components/profile/EditProfileModal';

// Islamic Calendar & Sunnah Fasting
import { SunnahFastingBanner } from './src/components/islamic/SunnahFastingBanner';
import { FastingDetailModal } from './src/components/islamic/FastingDetailModal';

// Modals
import { AddHabitModal } from './src/components/habits/AddHabitModal';
import { AddMemoModal } from './src/components/memo/AddMemoModal';
import { CitySelectorModal } from './src/components/prayer/CitySelectorModal';
import { DhikrCounterModal } from './src/components/quran/DhikrCounterModal';
import { GoogleCalendarSyncModal } from './src/components/calendar/GoogleCalendarSyncModal';
import { QiblaCompassModal } from './src/components/prayer/QiblaCompassModal';
import { AthanSettingsModal } from './src/components/prayer/AthanSettingsModal';
import { FocusPomodoroModal } from './src/components/focus/FocusPomodoroModal';
import { QuranReaderModal } from './src/components/quran/QuranReaderModal';
import { AsmaulHusnaModal } from './src/components/islamic/AsmaulHusnaModal';
import { DailyDuaModal } from './src/components/islamic/DailyDuaModal';
import { ZakatSedekahModal } from './src/components/islamic/ZakatSedekahModal';
import { NeonSyncModal } from './src/components/profile/NeonSyncModal';
import { useZakatSedekahStore } from './src/store/useZakatSedekahStore';

// Icons
import { Plus, Moon, Sparkles, Coins, Clock, BookOpen, Heart } from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modals state
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddMemoOpen, setIsAddMemoOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isDhikrOpen, setIsDhikrOpen] = useState(false);
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFastingModalOpen, setIsFastingModalOpen] = useState(false);
  const [fastingModalTab, setFastingModalTab] = useState<'niat' | 'jadwal'>('niat');
  const [isQiblaOpen, setIsQiblaOpen] = useState(false);
  const [isAthanOpen, setIsAthanOpen] = useState(false);
  const [isFocusPomodoroOpen, setIsFocusPomodoroOpen] = useState(false);
  const [isQuranReaderOpen, setIsQuranReaderOpen] = useState(false);
  const [isAsmaulHusnaOpen, setIsAsmaulHusnaOpen] = useState(false);
  const [isDailyDuaOpen, setIsDailyDuaOpen] = useState(false);
  const [isZakatSedekahOpen, setIsZakatSedekahOpen] = useState(false);
  const [zakatModalTab, setZakatModalTab] = useState<'zakat' | 'sedekah'>('zakat');
  const [isNeonSyncOpen, setIsNeonSyncOpen] = useState(false);

  // Stores
  const {
    habits,
    selectedDate,
    setSelectedDate,
    addHabit,
    getDailyScore,
    getMonthlyHeatmapData,
    loadStoredData: loadHabitData,
  } = useHabitStore();

  const {
    selectedCity,
    setCity,
    getPrayerCalculation,
    loadSettings: loadPrayerSettings,
  } = usePrayerStore();

  const { loadStoredData: loadQuranData } = useQuranDhikrStore();
  const {
    memos,
    addMemo,
    toggleMilestone,
    deleteMemo,
    getTotalBonusPointsEarned,
    loadStoredData: loadMemoData,
  } = useMemoStore();

  const { loadStoredAuth } = useAuthStore();
  const { loadStoredData: loadZakatData } = useZakatSedekahStore();

  useEffect(() => {
    loadHabitData();
    loadPrayerSettings();
    loadQuranData();
    loadMemoData();
    loadStoredAuth();
    loadZakatData();
  }, []);

  const bonusXP = getTotalBonusPointsEarned();
  const dailyScore = getDailyScore(selectedDate, bonusXP);
  const prayerData = getPrayerCalculation();

  const now = new Date();
  const heatmapDays = getMonthlyHeatmapData(now.getFullYear(), now.getMonth() + 1);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ResponsiveShell
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
        onOpenDhikr={() => setIsDhikrOpen(true)}
      >
        {(isDesktop) => {
          if (isDesktop) {
            // DESKTOP NOTION-STYLE DASHBOARD (LAPTOP)
            return (
              <View style={styles.desktopLayout}>
                {/* 1. TOP PROFILE HEADER (With live WIB clock, dynamic greeting, settings) */}
                <ProfileHeader
                  onOpenSettings={() => setIsEditProfileOpen(true)}
                  onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
                  onOpenNeonSync={() => setIsNeonSyncOpen(true)}
                />

                {/* 2. 4 SMART METRIC CARDS (Focus Score, Tasks, Focus Time, Productivity) */}
                <MetricCardsGrid
                  himmahPercentage={dailyScore.percentage}
                  completedTasks={dailyScore.completedCount}
                  totalTasks={dailyScore.totalCount}
                  bonusXP={bonusXP}
                  onOpenFocusTimer={() => setIsFocusPomodoroOpen(true)}
                />

                {/* 3. ISLAMIC CALENDAR & SUNNAH FASTING BANNER */}
                <SunnahFastingBanner
                  onOpenDetailModal={() => {
                    setFastingModalTab('niat');
                    setIsFastingModalOpen(true);
                  }}
                  onOpenUpcomingModal={() => {
                    setFastingModalTab('jadwal');
                    setIsFastingModalOpen(true);
                  }}
                />

                {/* 4. MIDDLE SECTION: Circular Gauge, Prayer Banner & Heatmap */}
                <View style={styles.desktopTopRow}>
                  {/* Himmah Index Gauge Card */}
                  <NotionCard style={styles.topMetricCard} highlight="primary">
                    <Text style={styles.cardHeaderSmall}>HIMMAH SCORE HARIAN</Text>
                    <CircularGauge
                      score={dailyScore.percentage}
                      completedPoints={dailyScore.completedPoints}
                      targetPoints={dailyScore.totalTargetPoints}
                      bonusXP={bonusXP}
                      size={160}
                    />
                    <View style={styles.metricFooter}>
                      <Text style={styles.metricFooterText}>
                        {dailyScore.completedCount} dari {dailyScore.totalCount} Rutinitas Terpenuhi
                      </Text>
                    </View>
                  </NotionCard>

                  {/* Prayer Times Live Banner */}
                  <View style={styles.topPrayerCardWrap}>
                    <PrayerBanner
                      onOpenCitySelector={() => setIsCitySelectorOpen(true)}
                      onOpenQibla={() => setIsQiblaOpen(true)}
                      onOpenAthanSettings={() => setIsAthanOpen(true)}
                    />
                    <PrayerTimesList items={prayerData.items} />
                  </View>

                  {/* Monthly Heatmap Matrix */}
                  <NotionCard style={styles.topHeatmapCard}>
                    <MonthlyHeatmap
                      days={heatmapDays}
                      monthName={monthNames[now.getMonth()]}
                      year={now.getFullYear()}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                  </NotionCard>
                </View>

                {/* 4. MAIN 2-COLUMN GRID: Habit Matrix & Spiritual Modules */}
                <View style={styles.desktopColumnsGrid}>
                  {/* Left Column (62%): Pelacak Kebiasaan (Habit Matrix dengan Streak & % Mingguan) */}
                  <View style={styles.desktopLeftCol}>
                    <HabitMatrix onOpenAddHabit={() => setIsAddHabitOpen(true)} />

                    {/* Quran Tracker */}
                    <QuranProgressCard
                      onOpenQuranReader={() => setIsQuranReaderOpen(true)}
                      onOpenAsmaulHusna={() => setIsAsmaulHusnaOpen(true)}
                      onOpenDailyDua={() => setIsDailyDuaOpen(true)}
                    />
                  </View>

                  {/* Right Column (38%): Smart Memos & Islamic Shortcuts */}
                  <View style={styles.desktopRightCol}>
                    {/* Zakat & Sedekah Quick Banner */}
                    <NotionCard style={styles.dhikrQuickBanner} highlight="primary">
                      <View style={styles.dhikrQuickContent}>
                        <View>
                          <Text style={styles.dhikrQuickTitle}>Sedekah Subuh & Zakat</Text>
                          <Text style={styles.dhikrQuickSub}>
                            Nisab emas 2.5%, streak sedekah & bersihkan rezeki
                          </Text>
                        </View>
                        <NeonButton
                          title="Buka Zakat"
                          variant="primary"
                          size="sm"
                          onPress={() => {
                            setZakatModalTab('zakat');
                            setIsZakatSedekahOpen(true);
                          }}
                          icon={<Coins size={14} color="#0B0D11" />}
                        />
                      </View>
                    </NotionCard>

                    {/* Quick Dzikir Action Banner */}
                    <NotionCard style={styles.dhikrQuickBanner} highlight="secondary">
                      <View style={styles.dhikrQuickContent}>
                        <View>
                          <Text style={styles.dhikrQuickTitle}>Wirid Dzikir Pagi & Petang</Text>
                          <Text style={styles.dhikrQuickSub}>
                            Lafadz Arab, terjemahan, counter tasbih & haptic getaran
                          </Text>
                        </View>
                        <NeonButton
                          title="Buka Dzikir"
                          variant="secondary"
                          size="sm"
                          onPress={() => setIsDhikrOpen(true)}
                          icon={<Moon size={14} color="#0B0D11" />}
                        />
                      </View>
                    </NotionCard>

                    {/* Smart Memos & Target Milestones */}
                    <NotionCard>
                      <View style={styles.sectionHeaderRow}>
                        <View>
                          <Text style={styles.sectionTitle}>Smart Memos & Targets</Text>
                          <Text style={styles.sectionSub}>
                            Checklist milestone menyumbang Bonus XP ke Himmah Index
                          </Text>
                        </View>
                        <NeonButton
                          title="Buat Memo"
                          variant="outline"
                          size="sm"
                          onPress={() => setIsAddMemoOpen(true)}
                          icon={<Plus size={14} color={Colors.textPrimary} />}
                        />
                      </View>

                      {memos.length === 0 ? (
                        <Text style={styles.emptyText}>Belum ada memo target aktif.</Text>
                      ) : (
                        memos.map((memo) => (
                          <SmartMemoCard
                            key={memo.id}
                            memo={memo}
                            onToggleMilestone={toggleMilestone}
                            onDeleteMemo={deleteMemo}
                          />
                        ))
                      )}
                    </NotionCard>
                  </View>
                </View>
              </View>
            );
          }

          // MOBILE VIEW
          return (
            <View style={styles.mobileLayout}>
              {/* TAB 1: DASHBOARD (HOME) */}
              {activeTab === 'dashboard' && (
                <View>
                  {/* Profile Header */}
                  <ProfileHeader
                    onOpenSettings={() => setIsEditProfileOpen(true)}
                    onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
                    onOpenNeonSync={() => setIsNeonSyncOpen(true)}
                  />

                  {/* 4 Metric Cards */}
                  <MetricCardsGrid
                    himmahPercentage={dailyScore.percentage}
                    completedTasks={dailyScore.completedCount}
                    totalTasks={dailyScore.totalCount}
                    bonusXP={bonusXP}
                    onOpenFocusTimer={() => setIsFocusPomodoroOpen(true)}
                  />

                  {/* Sunnah Fasting Banner */}
                  <SunnahFastingBanner
                    onOpenDetailModal={() => {
                      setFastingModalTab('niat');
                      setIsFastingModalOpen(true);
                    }}
                    onOpenUpcomingModal={() => {
                      setFastingModalTab('jadwal');
                      setIsFastingModalOpen(true);
                    }}
                  />

                  {/* Pelacak Kebiasaan (Habit Matrix dengan Streak & Persentase Mingguan) */}
                  <HabitMatrix onOpenAddHabit={() => setIsAddHabitOpen(true)} />

                  {/* Himmah Index Circular Gauge Card */}
                  <NotionCard highlight="primary" style={{ marginBottom: 12 }}>
                    <Text style={styles.cardHeaderSmall}>HIMMAH SCORE HARI INI</Text>
                    <CircularGauge
                      score={dailyScore.percentage}
                      completedPoints={dailyScore.completedPoints}
                      targetPoints={dailyScore.totalTargetPoints}
                      bonusXP={bonusXP}
                      size={170}
                    />
                    <View style={styles.metricFooter}>
                      <Text style={styles.metricFooterText}>
                        {dailyScore.completedCount} dari {dailyScore.totalCount} Rutinitas Selesai
                      </Text>
                    </View>
                  </NotionCard>

                  {/* Prayer Banner */}
                  <PrayerBanner
                    onOpenCitySelector={() => setIsCitySelectorOpen(true)}
                    onOpenQibla={() => setIsQiblaOpen(true)}
                    onOpenAthanSettings={() => setIsAthanOpen(true)}
                  />

                  {/* Heatmap */}
                  <NotionCard style={{ marginBottom: 12 }}>
                    <MonthlyHeatmap
                      days={heatmapDays}
                      monthName={monthNames[now.getMonth()]}
                      year={now.getFullYear()}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                  </NotionCard>

                  {/* Zakat & Sedekah Subuh Quick Banner */}
                  <NotionCard style={[styles.dhikrQuickBanner, { marginBottom: 12 }]} highlight="primary">
                    <View style={styles.dhikrQuickContent}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.dhikrQuickTitle}>Sedekah Subuh & Zakat</Text>
                        <Text style={styles.dhikrQuickSub}>
                          Nisab emas 2.5%, streak sedekah & bersihkan rezeki
                        </Text>
                      </View>
                      <NeonButton
                        title="Buka Zakat"
                        variant="primary"
                        size="sm"
                        onPress={() => {
                          setZakatModalTab('zakat');
                          setIsZakatSedekahOpen(true);
                        }}
                        icon={<Coins size={14} color="#0B0D11" />}
                      />
                    </View>
                  </NotionCard>

                  {/* Quran Snapshot */}
                  <QuranProgressCard
                    onOpenQuranReader={() => setIsQuranReaderOpen(true)}
                    onOpenAsmaulHusna={() => setIsAsmaulHusnaOpen(true)}
                    onOpenDailyDua={() => setIsDailyDuaOpen(true)}
                  />
                </View>
              )}

              {/* TAB 2: HABITS */}
              {activeTab === 'habits' && (
                <View>
                  <HabitMatrix onOpenAddHabit={() => setIsAddHabitOpen(true)} />
                </View>
              )}

              {/* TAB 3: PRAYER & ISLAMIC */}
              {activeTab === 'prayer' && (
                <View>
                  <PrayerBanner
                    onOpenCitySelector={() => setIsCitySelectorOpen(true)}
                    onOpenQibla={() => setIsQiblaOpen(true)}
                    onOpenAthanSettings={() => setIsAthanOpen(true)}
                  />
                  <PrayerTimesList items={prayerData.items} />

                  <NotionCard highlight="secondary" style={{ marginTop: 12 }}>
                    <Text style={styles.sectionTitle}>Wirid Dzikir Pagi-Petang</Text>
                    <Text style={styles.sectionSub}>
                      Kumpulan dzikir shahih dengan counter tasbih interaktif dan transliterasi lengkap.
                    </Text>
                    <NeonButton
                      title="Mulai Dzikir Sekarang"
                      variant="secondary"
                      size="md"
                      onPress={() => setIsDhikrOpen(true)}
                      icon={<Moon size={16} color="#0B0D11" />}
                      style={{ marginTop: 12 }}
                    />
                  </NotionCard>
                </View>
              )}

              {/* TAB 4: QURAN */}
              {activeTab === 'quran' && (
                <View>
                  <QuranProgressCard
                    onOpenQuranReader={() => setIsQuranReaderOpen(true)}
                    onOpenAsmaulHusna={() => setIsAsmaulHusnaOpen(true)}
                    onOpenDailyDua={() => setIsDailyDuaOpen(true)}
                  />
                  <NotionCard style={{ marginTop: 10 }}>
                    <View style={styles.quranQuoteBox}>
                      <Sparkles size={16} color={Colors.primary} />
                      <Text style={styles.quranQuoteText}>
                        "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya." (HR. Bukhari)
                      </Text>
                    </View>
                  </NotionCard>
                </View>
              )}

              {/* TAB 5: MEMOS */}
              {activeTab === 'memos' && (
                <View>
                  <View style={styles.mobileSectionTop}>
                    <View>
                      <Text style={styles.mobilePageTitle}>Smart Memos</Text>
                      <Text style={styles.sectionSub}>Bonus XP: +{bonusXP}% ke Himmah Index</Text>
                    </View>
                    <NeonButton
                      title="Buat Memo"
                      variant="primary"
                      size="sm"
                      onPress={() => setIsAddMemoOpen(true)}
                      icon={<Plus size={14} color="#0B0D11" />}
                    />
                  </View>

                  {memos.map((memo) => (
                    <SmartMemoCard
                      key={memo.id}
                      memo={memo}
                      onToggleMilestone={toggleMilestone}
                      onDeleteMemo={deleteMemo}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        }}
      </ResponsiveShell>

      {/* MODALS */}
      <AddHabitModal
        visible={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        onAdd={addHabit}
      />

      <AddMemoModal
        visible={isAddMemoOpen}
        onClose={() => setIsAddMemoOpen(false)}
        onAdd={addMemo}
      />

      <CitySelectorModal
        visible={isCitySelectorOpen}
        selectedCity={selectedCity}
        onClose={() => setIsCitySelectorOpen(false)}
        onSelectCity={setCity}
      />

      <DhikrCounterModal
        visible={isDhikrOpen}
        onClose={() => setIsDhikrOpen(false)}
      />

      <GoogleCalendarSyncModal
        visible={isCalendarSyncOpen}
        onClose={() => setIsCalendarSyncOpen(false)}
      />

      <EditProfileModal
        visible={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <FastingDetailModal
        visible={isFastingModalOpen}
        initialTab={fastingModalTab}
        onClose={() => setIsFastingModalOpen(false)}
      />

      <QiblaCompassModal
        visible={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        onOpenCitySelector={() => setIsCitySelectorOpen(true)}
      />

      <AthanSettingsModal
        visible={isAthanOpen}
        onClose={() => setIsAthanOpen(false)}
      />

      <FocusPomodoroModal
        visible={isFocusPomodoroOpen}
        onClose={() => setIsFocusPomodoroOpen(false)}
      />

      <QuranReaderModal
        visible={isQuranReaderOpen}
        onClose={() => setIsQuranReaderOpen(false)}
      />

      <AsmaulHusnaModal
        visible={isAsmaulHusnaOpen}
        onClose={() => setIsAsmaulHusnaOpen(false)}
      />

      <DailyDuaModal
        visible={isDailyDuaOpen}
        onClose={() => setIsDailyDuaOpen(false)}
      />

      <ZakatSedekahModal
        visible={isZakatSedekahOpen}
        initialTab={zakatModalTab}
        onClose={() => setIsZakatSedekahOpen(false)}
      />

      <NeonSyncModal
        visible={isNeonSyncOpen}
        onClose={() => setIsNeonSyncOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  desktopLayout: {
    gap: 20,
  },
  desktopTopRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  topMetricCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  cardHeaderSmall: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textDim,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  metricFooter: {
    marginTop: 12,
    backgroundColor: '#0B0D11',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  topPrayerCardWrap: {
    flex: 1.5,
  },
  topHeatmapCard: {
    flex: 1.4,
    justifyContent: 'center',
  },
  desktopColumnsGrid: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  desktopLeftCol: {
    flex: 1.4,
    gap: 16,
  },
  desktopRightCol: {
    flex: 1,
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 2,
  },
  dhikrQuickBanner: {
    backgroundColor: '#101724',
    padding: 16,
  },
  dhikrQuickContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dhikrQuickTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dhikrQuickSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    maxWidth: 300,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textDim,
    textAlign: 'center',
    paddingVertical: 20,
  },
  mobileLayout: {
    paddingBottom: 24,
  },
  mobileSectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mobilePageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  quranQuoteBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 8,
  },
  quranQuoteText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
});
