// User Profile
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  googleRefreshToken?: string;
  calendarSyncEnabled: boolean;
  location: {
    latitude: number;
    longitude: number;
    city: string;
  };
}

// Habit Item
export interface Habit {
  id: string;
  title: string;
  category: 'ibadah' | 'work' | 'health' | 'learning' | 'personal';
  timeSlot: string; // e.g. "05:00"
  weight: 1 | 2 | 3;
  frequency: 'daily' | 'weekdays' | 'custom';
  createdAt: string;
  color?: string;
}

// Daily Habit Log
export interface HabitLog {
  id: string;
  date: string; // YYYY-MM-DD
  habitId: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Milestone Item
export interface Milestone {
  id: string;
  text: string;
  isCompleted: boolean;
  pointValue: number;
}

// Smart Memo & Target
export interface SmartMemo {
  id: string;
  title: string;
  content: string;
  milestones: Milestone[];
  dueDate?: string;
  isArchived: boolean;
  createdAt: string;
}

// Quran & Dhikr Progress
export interface SpiritualProgress {
  date: string; // YYYY-MM-DD
  quranPagesRead: number;
  lastSurah: number;
  lastAyah: number;
  dhikrMorningCompleted: boolean;
  dhikrEveningCompleted: boolean;
  targetDaysForKhatam?: number;
}

// Prayer Times Model
export interface PrayerTimeItem {
  name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  displayName: string;
  time: string; // HH:mm
  dateObj: Date;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

// Navigation Tabs
export type TabType = 'dashboard' | 'habits' | 'prayer' | 'quran' | 'memos' | 'calendar';
