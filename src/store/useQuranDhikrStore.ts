import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpiritualProgress } from '../types';

interface QuranDhikrState {
  progress: SpiritualProgress;
  dhikrCounts: Record<string, number>; // key: dhikrId -> current count

  // Actions
  updateQuranProgress: (pages: number, surah: number, ayah: number) => void;
  setTargetDaysForKhatam: (days: number) => void;
  toggleDhikrCompleted: (period: 'morning' | 'evening') => void;
  incrementDhikrCount: (dhikrId: string, maxCount: number) => boolean; // returns true if reached max
  resetDhikrCount: (dhikrId: string) => void;
  loadStoredData: () => Promise<void>;
  
  // Smart Planner Helper
  getKhatamEstimate: () => {
    pagesRemaining: number;
    pagesPerDay: number;
    sheetsPerDay: number;
    daysRemaining: number;
    estimatedCompletionDate: string;
  };
}

const STORAGE_SPIRITUAL_KEY = '@zahim_spiritual_v1';
const STORAGE_DHIKR_COUNTS_KEY = '@zahim_dhikr_counts_v1';

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

export const useQuranDhikrStore = create<QuranDhikrState>((set, get) => ({
  progress: {
    date: getTodayDateStr(),
    quranPagesRead: 45, // Demo initial: juz 3
    lastSurah: 2,
    lastAyah: 255,
    dhikrMorningCompleted: false,
    dhikrEveningCompleted: false,
    targetDaysForKhatam: 30
  },
  dhikrCounts: {},

  loadStoredData: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_SPIRITUAL_KEY);
      const counts = await AsyncStorage.getItem(STORAGE_DHIKR_COUNTS_KEY);
      if (stored) {
        set({ progress: JSON.parse(stored) });
      }
      if (counts) {
        set({ dhikrCounts: JSON.parse(counts) });
      }
    } catch {
      // Fallback
    }
  },

  updateQuranProgress: async (pages, surah, ayah) => {
    const updated: SpiritualProgress = {
      ...get().progress,
      quranPagesRead: Math.min(604, Math.max(0, pages)),
      lastSurah: surah,
      lastAyah: ayah,
      date: getTodayDateStr()
    };
    set({ progress: updated });
    await AsyncStorage.setItem(STORAGE_SPIRITUAL_KEY, JSON.stringify(updated));
  },

  setTargetDaysForKhatam: async (days) => {
    const updated: SpiritualProgress = {
      ...get().progress,
      targetDaysForKhatam: Math.max(1, days)
    };
    set({ progress: updated });
    await AsyncStorage.setItem(STORAGE_SPIRITUAL_KEY, JSON.stringify(updated));
  },

  toggleDhikrCompleted: async (period) => {
    const current = get().progress;
    const updated: SpiritualProgress = {
      ...current,
      dhikrMorningCompleted: period === 'morning' ? !current.dhikrMorningCompleted : current.dhikrMorningCompleted,
      dhikrEveningCompleted: period === 'evening' ? !current.dhikrEveningCompleted : current.dhikrEveningCompleted
    };
    set({ progress: updated });
    await AsyncStorage.setItem(STORAGE_SPIRITUAL_KEY, JSON.stringify(updated));
  },

  incrementDhikrCount: (dhikrId, maxCount) => {
    const counts = { ...get().dhikrCounts };
    const current = counts[dhikrId] || 0;
    if (current >= maxCount) {
      return true;
    }
    const nextCount = current + 1;
    counts[dhikrId] = nextCount;
    set({ dhikrCounts: counts });
    AsyncStorage.setItem(STORAGE_DHIKR_COUNTS_KEY, JSON.stringify(counts)).catch(() => {});
    return nextCount >= maxCount;
  },

  resetDhikrCount: (dhikrId) => {
    const counts = { ...get().dhikrCounts };
    counts[dhikrId] = 0;
    set({ dhikrCounts: counts });
    AsyncStorage.setItem(STORAGE_DHIKR_COUNTS_KEY, JSON.stringify(counts)).catch(() => {});
  },

  getKhatamEstimate: () => {
    const { quranPagesRead, targetDaysForKhatam = 30 } = get().progress;
    const totalQuranPages = 604;
    const pagesRemaining = Math.max(0, totalQuranPages - quranPagesRead);
    const pagesPerDay = Math.ceil(pagesRemaining / targetDaysForKhatam);
    const sheetsPerDay = Math.ceil(pagesPerDay / 2); // 1 sheet = 2 pages

    const daysRemaining = pagesPerDay > 0 ? Math.ceil(pagesRemaining / pagesPerDay) : 0;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + daysRemaining);

    return {
      pagesRemaining,
      pagesPerDay,
      sheetsPerDay,
      daysRemaining,
      estimatedCompletionDate: estDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  }
}));
