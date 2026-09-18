import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SmartMemo, Milestone } from '../types';

interface MemoState {
  memos: SmartMemo[];

  // Actions
  addMemo: (title: string, content: string, milestones: { text: string; pointValue: number }[], dueDate?: string) => void;
  toggleMilestone: (memoId: string, milestoneId: string) => void;
  deleteMemo: (memoId: string) => void;
  archiveMemo: (memoId: string) => void;
  loadStoredData: () => Promise<void>;

  // Score Integration Pipeline
  getTotalBonusPointsEarned: () => number;
}

const STORAGE_MEMOS_KEY = '@zahim_smart_memos_v1';

const INITIAL_MEMOS: SmartMemo[] = [
  {
    id: 'memo-1',
    title: 'Khatam Tadabbur Surat Al-Kahf',
    content: 'Membaca tafsir Ibnu Katsir untuk ayat 1-50 dan merangkum 4 fitnah besar (fitnah aqidah, harta, ilmu, kekuasaan).',
    dueDate: '2026-09-25',
    isArchived: false,
    createdAt: new Date().toISOString(),
    milestones: [
      { id: 'ms-1-1', text: 'Bahas Kisah Ashabul Kahfi (Ayat 1-31)', isCompleted: true, pointValue: 5 },
      { id: 'ms-1-2', text: 'Bahas Kisah Pemilik Dua Kebun (Ayat 32-44)', isCompleted: false, pointValue: 5 },
      { id: 'ms-1-3', text: 'Bahas Kisah Nabi Musa & Khidhr (Ayat 60-82)', isCompleted: false, pointValue: 5 },
      { id: 'ms-1-4', text: 'Bahas Kisah Dzulqarnain & Ya\'juj Ma\'juj (Ayat 83-110)', isCompleted: false, pointValue: 5 }
    ]
  },
  {
    id: 'memo-2',
    title: 'Peluncuran Proyek ZAHIM v1.0',
    content: 'Penyusunan arsitektur multi-platform mobile & laptop dengan integrasi jadwal sholat dan scoring habit.',
    dueDate: '2026-09-30',
    isArchived: false,
    createdAt: new Date().toISOString(),
    milestones: [
      { id: 'ms-2-1', text: 'Desain Dark Slate & Neon Accent UI', isCompleted: true, pointValue: 5 },
      { id: 'ms-2-2', text: 'Implementasi Algoritma Himmah Index & Heatmap', isCompleted: true, pointValue: 10 },
      { id: 'ms-2-3', text: 'Integrasi Adhan.js & Auto DND Alert', isCompleted: false, pointValue: 5 },
      { id: 'ms-2-4', text: 'Sinkronisasi Google Calendar Event Bridge', isCompleted: false, pointValue: 10 }
    ]
  }
];

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: INITIAL_MEMOS,

  loadStoredData: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_MEMOS_KEY);
      if (stored) {
        set({ memos: JSON.parse(stored) });
      } else {
        await AsyncStorage.setItem(STORAGE_MEMOS_KEY, JSON.stringify(INITIAL_MEMOS));
      }
    } catch {
      // Fallback
    }
  },

  addMemo: async (title, content, rawMilestones, dueDate) => {
    const milestones: Milestone[] = rawMilestones.map((m, idx) => ({
      id: `ms_${Date.now()}_${idx}`,
      text: m.text,
      isCompleted: false,
      pointValue: m.pointValue || 5
    }));

    const newMemo: SmartMemo = {
      id: `memo_${Date.now()}`,
      title,
      content,
      milestones,
      dueDate,
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newMemo, ...get().memos];
    set({ memos: updated });
    await AsyncStorage.setItem(STORAGE_MEMOS_KEY, JSON.stringify(updated));
  },

  toggleMilestone: async (memoId, milestoneId) => {
    const memos = get().memos.map((memo) => {
      if (memo.id !== memoId) return memo;
      const updatedMilestones = memo.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        return { ...m, isCompleted: !m.isCompleted };
      });
      return { ...memo, milestones: updatedMilestones };
    });

    set({ memos });
    await AsyncStorage.setItem(STORAGE_MEMOS_KEY, JSON.stringify(memos));
  },

  deleteMemo: async (memoId) => {
    const updated = get().memos.filter((m) => m.id !== memoId);
    set({ memos: updated });
    await AsyncStorage.setItem(STORAGE_MEMOS_KEY, JSON.stringify(updated));
  },

  archiveMemo: async (memoId) => {
    const memos = get().memos.map((m) => (m.id === memoId ? { ...m, isArchived: !m.isArchived } : m));
    set({ memos });
    await AsyncStorage.setItem(STORAGE_MEMOS_KEY, JSON.stringify(memos));
  },

  // Pipeline Bonus XP: Menghitung total XP dari milestone yang selesai
  getTotalBonusPointsEarned: () => {
    let bonusXP = 0;
    get().memos.forEach((memo) => {
      memo.milestones.forEach((m) => {
        if (m.isCompleted) {
          bonusXP += m.pointValue;
        }
      });
    });
    // Scaled as bonus percentage increment (e.g. 5 XP = +5% bonus, up to +15% max boost)
    return Math.min(15, Math.floor(bonusXP / 2));
  }
}));
