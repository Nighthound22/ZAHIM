import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitStore } from '../store/useHabitStore';
import { useMemoStore } from '../store/useMemoStore';
import { useQuranDhikrStore } from '../store/useQuranDhikrStore';
import { useZakatSedekahStore } from '../store/useZakatSedekahStore';
import { Habit, HabitLog, UserProfile } from '../types';

const STORAGE_SYNC_URL_KEY = '@zahim_custom_sync_url_v1';
const STORAGE_LAST_SYNC_KEY = '@zahim_last_synced_at_v1';

// Default Vercel production domain for ZAHIM
const DEFAULT_VERCEL_URL = 'https://zahim.vercel.app';

export interface SyncHealthResponse {
  success: boolean;
  status: 'CONNECTED' | 'DATABASE_URL_MISSING' | 'CONNECTION_FAILED' | 'NETWORK_ERROR';
  message: string;
  database?: string;
  neonProject?: string;
  serverTime?: string;
  postgresVersion?: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncedAt?: string;
  error?: string;
}

class NeonSyncService {
  /**
   * Determine the API base URL.
   * On Web: defaults to current origin (window.location.origin)
   * On Mobile/APK: defaults to Vercel production URL or custom URL saved by user
   */
  async getApiBaseUrl(): Promise<string> {
    try {
      const customUrl = await AsyncStorage.getItem(STORAGE_SYNC_URL_KEY);
      if (customUrl && customUrl.trim().length > 0) {
        return customUrl.trim().replace(/\/$/, '');
      }

      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        // If running in local web dev or on Vercel web
        return window.location.origin;
      }
    } catch {
      // Fallback
    }

    return DEFAULT_VERCEL_URL;
  }

  /**
   * Set a custom backend / Vercel API URL (useful for APK users)
   */
  async setCustomApiUrl(url: string): Promise<void> {
    if (!url || url.trim().length === 0) {
      await AsyncStorage.removeItem(STORAGE_SYNC_URL_KEY);
    } else {
      await AsyncStorage.setItem(STORAGE_SYNC_URL_KEY, url.trim().replace(/\/$/, ''));
    }
  }

  /**
   * Check connection with Neon Database via /api/init-db
   */
  async checkConnection(): Promise<SyncHealthResponse> {
    try {
      const baseUrl = await this.getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/init-db`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        success: false,
        status: 'NETWORK_ERROR',
        message: error.message || 'Tidak dapat menghubungi server API Vercel.',
      };
    }
  }

  /**
   * Upload all local ZAHIM data to Neon PostgreSQL Cloud
   */
  async uploadToCloud(): Promise<SyncResult> {
    try {
      const baseUrl = await this.getApiBaseUrl();

      // Collect data from Zustand stores
      const authState = useAuthStore.getState();
      const habitState = useHabitStore.getState();
      const memoState = useMemoStore.getState();
      const quranState = useQuranDhikrStore.getState();
      const zakatState = useZakatSedekahStore.getState();

      const userId = authState.user?.uid || 'default_user';

      // Format completions list from habit logs
      const completionsList = Object.values(habitState.logs)
        .filter((l: HabitLog) => l.isCompleted)
        .map((l: HabitLog) => ({
          habitId: l.habitId,
          date: l.date,
        }));

      const payload = {
        userId,
        profile: {
          name: authState.user?.displayName || 'Mukmin Mujahid',
          avatar: authState.user?.photoURL || '',
          bio: 'Menjaga Himmah & Disiplin Ibadah',
          email: authState.user?.email || '',
          phone: authState.user?.phone || '',
          city: authState.user?.location?.city || 'DKI Jakarta',
        },
        habits: habitState.habits.map((h) => ({
          id: h.id,
          title: h.title,
          category: h.category,
          period: h.frequency || 'daily',
          targetFrequency: 1,
          points: (h.weight || 1) * 10,
          iconName: h.timeSlot || '05:00',
        })),
        completions: completionsList,
        memos: memoState.memos.map((m) => ({
          id: m.id,
          title: m.title,
          category: 'ibadah',
          priority: 'medium',
          milestones: m.milestones,
          bonusPoints: 10,
        })),
        quranProgress: {
          lastPage: quranState.progress.quranPagesRead,
          lastSurahId: quranState.progress.lastSurah,
          lastAyahNumber: quranState.progress.lastAyah,
          targetKhatamDays: quranState.progress.targetDaysForKhatam,
          dailyPageTarget: Math.ceil(604 / (quranState.progress.targetDaysForKhatam || 30)),
        },
        sedekahRecords: zakatState.sedekahLogs.map((s) => ({
          amount: s.amount,
          date: s.date,
          note: s.note || '',
        })),
      };

      const response = await fetch(`${baseUrl}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        const timestamp = result.syncedAt || new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_LAST_SYNC_KEY, timestamp);
        return {
          success: true,
          message: result.message || 'Sinkronisasi ke Neon Cloud berhasil!',
          syncedAt: timestamp,
        };
      } else {
        return {
          success: false,
          message: result.error || 'Gagal menyinkronkan data.',
          error: result.error,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Gagal terhubung ke endpoint Neon Sync.',
        error: error.message,
      };
    }
  }

  /**
   * Download and restore data from Neon Cloud into local storage
   */
  async downloadFromCloud(): Promise<SyncResult> {
    try {
      const baseUrl = await this.getApiBaseUrl();
      const authState = useAuthStore.getState();
      const userId = authState.user?.uid || 'default_user';

      const response = await fetch(`${baseUrl}/api/sync?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        return {
          success: false,
          message: result.error || 'Data cloud tidak ditemukan.',
          error: result.error,
        };
      }

      const { user, habits, habitCompletions, memos, quranProgress } = result.data;

      // 1. Restore Profile (termasuk photoURL / avatar!)
      if (user) {
        const updateData: Partial<UserProfile> = {
          displayName: user.name || authState.user?.displayName,
        };
        if (user.avatar && user.avatar.trim() !== '') {
          updateData.photoURL = user.avatar;
        }
        if (user.email) updateData.email = user.email;
        if (user.phone) updateData.phone = user.phone;
        if (user.city) {
          updateData.location = {
            ...(authState.user?.location || { latitude: -6.2088, longitude: 106.8456 }),
            city: user.city,
          };
        }
        await useAuthStore.getState().updateProfile(updateData);
      }

      // 2. Restore Habits & Completions
      if (habits && habits.length > 0) {
        const restoredHabits: Habit[] = habits.map((h: any) => ({
          id: h.id,
          title: h.title,
          category: (h.category as any) || 'ibadah',
          timeSlot: h.icon_name || '05:00',
          weight: (Math.max(1, Math.min(3, Math.round((h.points || 10) / 10))) || 1) as 1 | 2 | 3,
          frequency: (h.period as any) || 'daily',
          createdAt: h.created_at || new Date().toISOString(),
        }));

        const restoredLogs: Record<string, HabitLog> = {};
        if (habitCompletions && habitCompletions.length > 0) {
          habitCompletions.forEach((c: any) => {
            const key = `${c.completed_date}_${c.habit_id}`;
            restoredLogs[key] = {
              id: key,
              date: c.completed_date,
              habitId: c.habit_id,
              isCompleted: true,
            };
          });
        }

        // Persist restored habits to AsyncStorage
        await AsyncStorage.setItem('@zahim_habits_v2', JSON.stringify(restoredHabits));
        await AsyncStorage.setItem('@zahim_logs_v2', JSON.stringify(restoredLogs));
        await useHabitStore.getState().loadStoredData();
      }

      // 3. Restore Memos
      if (memos && memos.length > 0) {
        const formattedMemos = memos.map((m: any) => ({
          id: m.id,
          title: m.title,
          content: '',
          dueDate: '',
          isArchived: false,
          createdAt: m.created_at || new Date().toISOString(),
          milestones: Array.isArray(m.milestones) ? m.milestones : [],
        }));
        await AsyncStorage.setItem('@zahim_smart_memos_v1', JSON.stringify(formattedMemos));
        await useMemoStore.getState().loadStoredData();
      }

      // 4. Restore Quran Progress
      if (quranProgress) {
        useQuranDhikrStore.getState().updateQuranProgress(
          quranProgress.last_page || 1,
          quranProgress.last_surah_id || 1,
          quranProgress.last_ayah_number || 1
        );
      }

      const timestamp = result.syncedAt || new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_LAST_SYNC_KEY, timestamp);

      return {
        success: true,
        message: 'Data berhasil diunduh & dipulihkan dari Neon PostgreSQL Cloud!',
        syncedAt: timestamp,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Gagal mengunduh data dari Cloud.',
        error: error.message,
      };
    }
  }

  private autoSyncTimer: any = null;

  /**
   * Automatically debounced sync to Neon Cloud when data changes locally
   */
  triggerAutoSync(delayMs = 1200) {
    if (this.autoSyncTimer) {
      clearTimeout(this.autoSyncTimer);
    }
    this.autoSyncTimer = setTimeout(() => {
      const auth = useAuthStore.getState();
      if (auth.isAuthenticated) {
        this.uploadToCloud().catch((err) => {
          console.log('Background AutoSync notice:', err?.message || err);
        });
      }
    }, delayMs);
  }

  /**
   * Get timestamp of the last successful sync
   */
  async getLastSyncedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_LAST_SYNC_KEY);
    } catch {
      return null;
    }
  }
}

export const neonSyncService = new NeonSyncService();
