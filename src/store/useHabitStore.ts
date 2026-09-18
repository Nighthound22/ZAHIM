import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitLog } from '../types';
import { PRESET_HABITS } from '../data/presetHabits';

export interface WeekDayInfo {
  dayName: string;
  dayNumber: number;
  dateStr: string;
  isToday: boolean;
}

interface HabitState {
  habits: Habit[];
  logs: Record<string, HabitLog>; // Key: `${date}_${habitId}`
  selectedDate: string; // YYYY-MM-DD
  
  // Actions
  setSelectedDate: (date: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, date?: string) => void;
  loadStoredData: () => Promise<void>;
  
  // Calculations
  getDailyScore: (dateStr: string, bonusXP?: number) => {
    percentage: number;
    completedPoints: number;
    totalTargetPoints: number;
    completedCount: number;
    totalCount: number;
  };
  getMonthlyScore: (yearMonthStr: string, bonusXP?: number) => {
    percentage: number;
    totalCompletedPoints: number;
    totalTargetPoints: number;
  };
  getMonthlyHeatmapData: (year: number, month: number) => {
    date: string;
    dayOfMonth: number;
    percentage: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];

  // Streak & Matrix Calculations
  getHabitStreak: (habitId: string) => number;
  getHabitWeeklyPercentage: (habitId: string, weekDates: string[]) => number;
  getCurrentWeekDates: () => WeekDayInfo[];

  // Focus Minutes
  focusMinutesToday: number;
  addFocusMinutes: (minutes: number) => void;
}

const STORAGE_HABITS_KEY = '@zahim_habits_v2';
const STORAGE_LOGS_KEY = '@zahim_logs_v2';

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generates sample initial logs for the last few days to produce realistic initial streaks
const generateInitialSampleLogs = (): Record<string, HabitLog> => {
  const sampleLogs: Record<string, HabitLog> = {};
  const today = new Date();

  // Helper to get past date string
  const getPastDateStr = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const d0 = getPastDateStr(0); // Today
  const d1 = getPastDateStr(1); // Yesterday
  const d2 = getPastDateStr(2); // 2 days ago
  const d3 = getPastDateStr(3); // 3 days ago

  // Subuh: 4-day streak (d0, d1, d2, d3)
  ['habit-subuh'].forEach((hId) => {
    [d0, d1, d2, d3].forEach((date) => {
      sampleLogs[`${date}_${hId}`] = { id: `${date}_${hId}`, date, habitId: hId, isCompleted: true };
    });
  });

  // Duha & Dzuhur & Ashar: 2-day streak (d0, d1)
  ['habit-duha', 'habit-dzuhur', 'habit-ashar'].forEach((hId) => {
    [d0, d1].forEach((date) => {
      sampleLogs[`${date}_${hId}`] = { id: `${date}_${hId}`, date, habitId: hId, isCompleted: true };
    });
  });

  // Tadarus Pagi: 1-day streak (d0)
  ['habit-tadarus'].forEach((hId) => {
    sampleLogs[`${d0}_${hId}`] = { id: `${d0}_${hId}`, date: d0, habitId: hId, isCompleted: true };
  });

  return sampleLogs;
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: PRESET_HABITS,
  logs: generateInitialSampleLogs(),
  selectedDate: getTodayDateStr(),
  focusMinutesToday: 45,

  addFocusMinutes: (minutes: number) => {
    set({ focusMinutesToday: Math.max(0, get().focusMinutesToday + minutes) });
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  loadStoredData: async () => {
    try {
      const storedHabits = await AsyncStorage.getItem(STORAGE_HABITS_KEY);
      const storedLogs = await AsyncStorage.getItem(STORAGE_LOGS_KEY);
      
      let habits = PRESET_HABITS;
      let logs = generateInitialSampleLogs();

      if (storedHabits) {
        habits = JSON.parse(storedHabits);
      } else {
        await AsyncStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(PRESET_HABITS));
      }

      if (storedLogs) {
        logs = JSON.parse(storedLogs);
      } else {
        await AsyncStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
      }

      set({ habits, logs });
    } catch {
      // Fallback
    }
  },

  addHabit: async (newHabit) => {
    const habit: Habit = {
      ...newHabit,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...get().habits, habit];
    set({ habits: updated });
    await AsyncStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(updated));
  },

  deleteHabit: async (id) => {
    const updated = get().habits.filter((h) => h.id !== id);
    set({ habits: updated });
    await AsyncStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(updated));
  },

  toggleHabit: async (habitId, customDate) => {
    const date = customDate || get().selectedDate;
    const key = `${date}_${habitId}`;
    const currentLogs = { ...get().logs };
    const currentStatus = !!currentLogs[key]?.isCompleted;

    currentLogs[key] = {
      id: key,
      date,
      habitId,
      isCompleted: !currentStatus,
      completedAt: !currentStatus ? new Date().toISOString() : undefined
    };

    set({ logs: currentLogs });
    await AsyncStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(currentLogs));
  },

  getDailyScore: (dateStr, bonusXP = 0) => {
    const habits = get().habits;
    const logs = get().logs;
    if (habits.length === 0) return { percentage: 0, completedPoints: 0, totalTargetPoints: 0, completedCount: 0, totalCount: 0 };

    let totalTargetPoints = 0;
    let completedPoints = 0;
    let completedCount = 0;

    habits.forEach((h) => {
      totalTargetPoints += h.weight;
      const key = `${dateStr}_${h.id}`;
      if (logs[key]?.isCompleted) {
        completedPoints += h.weight;
        completedCount += 1;
      }
    });

    const rawPercentage = totalTargetPoints > 0 ? (completedPoints / totalTargetPoints) * 100 : 0;
    const totalPercentage = Math.min(100, Math.round(rawPercentage + bonusXP));

    return {
      percentage: totalPercentage,
      completedPoints,
      totalTargetPoints,
      completedCount,
      totalCount: habits.length
    };
  },

  getMonthlyScore: (yearMonthStr, bonusXP = 0) => {
    const habits = get().habits;
    const logs = get().logs;
    if (habits.length === 0) return { percentage: 0, totalCompletedPoints: 0, totalTargetPoints: 0 };

    const dailyTarget = habits.reduce((acc, h) => acc + h.weight, 0);
    const [yearStr, monthStr] = yearMonthStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    let totalCompletedPoints = 0;
    let daysCounted = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${yearStr}-${monthStr.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      daysCounted++;
      habits.forEach((h) => {
        const key = `${dayStr}_${h.id}`;
        if (logs[key]?.isCompleted) {
          totalCompletedPoints += h.weight;
        }
      });
    }

    const totalTargetPoints = dailyTarget * daysCounted;
    const rawPercentage = totalTargetPoints > 0 ? (totalCompletedPoints / totalTargetPoints) * 100 : 0;
    const percentage = Math.min(100, Math.round(rawPercentage + bonusXP));

    return {
      percentage,
      totalCompletedPoints,
      totalTargetPoints
    };
  },

  getMonthlyHeatmapData: (year, month) => {
    const habits = get().habits;
    const logs = get().logs;
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthPadded = month.toString().padStart(2, '0');

    const dailyTarget = habits.reduce((acc, h) => acc + h.weight, 0);

    const result = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${monthPadded}-${day.toString().padStart(2, '0')}`;
      let completedPoints = 0;

      habits.forEach((h) => {
        const key = `${dateStr}_${h.id}`;
        if (logs[key]?.isCompleted) {
          completedPoints += h.weight;
        }
      });

      const percentage = dailyTarget > 0 ? Math.round((completedPoints / dailyTarget) * 100) : 0;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (percentage >= 75) level = 4;
      else if (percentage >= 50) level = 3;
      else if (percentage >= 25) level = 2;
      else if (percentage > 0) level = 1;

      result.push({
        date: dateStr,
        dayOfMonth: day,
        percentage,
        level
      });
    }

    return result;
  },

  // Calculate consecutive streak in days for a habit
  getHabitStreak: (habitId) => {
    const logs = get().logs;
    let streak = 0;
    const today = new Date();

    // Check if today is completed
    const todayStr = getTodayDateStr();
    let checkDate = new Date(today);
    
    // If today is completed, streak includes today
    if (logs[`${todayStr}_${habitId}`]?.isCompleted) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If not yet completed today, check if yesterday was completed to keep streak alive
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count backwards up to 365 days
    for (let i = 0; i < 365; i++) {
      const year = checkDate.getFullYear();
      const month = (checkDate.getMonth() + 1).toString().padStart(2, '0');
      const day = checkDate.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      if (logs[`${dateStr}_${habitId}`]?.isCompleted) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  // Calculate weekly completion percentage (e.g. 57% Minggu Ini)
  getHabitWeeklyPercentage: (habitId, weekDates) => {
    if (!weekDates || weekDates.length === 0) return 0;
    const logs = get().logs;
    let completed = 0;

    weekDates.forEach((dateStr) => {
      if (logs[`${dateStr}_${habitId}`]?.isCompleted) {
        completed++;
      }
    });

    return Math.round((completed / weekDates.length) * 100);
  },

  // Returns array of 7 days for the current week (Monday to Sunday)
  getCurrentWeekDates: () => {
    const dayNames = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'AHD'];
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    
    // Calculate difference to Monday (1 = Mon -> diff 0, 0 = Sun -> diff -6)
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const todayStr = getTodayDateStr();
    const result: WeekDayInfo[] = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);

      const year = dayDate.getFullYear();
      const month = (dayDate.getMonth() + 1).toString().padStart(2, '0');
      const day = dayDate.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      result.push({
        dayName: dayNames[i],
        dayNumber: dayDate.getDate(),
        dateStr,
        isToday: dateStr === todayStr,
      });
    }

    return result;
  }
}));
