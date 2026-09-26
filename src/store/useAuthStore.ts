import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import { neonSyncService } from '../services/neonSyncService';

interface AuthState {
  user: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  loginDemo: () => Promise<void>;
  loginWithEmail: (email: string, displayName?: string) => Promise<void>;
  loginWithWhatsApp: (phone: string, displayName?: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  toggleCalendarSync: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const STORAGE_AUTH_KEY = '@zahim_auth_v2';
const ACCOUNT_CACHE_PREFIX = '@zahim_acc_';

const DEFAULT_USER: UserProfile = {
  uid: 'zahim_demo_user',
  email: 'ahmad.ali@zahim.id',
  phone: '081234567890',
  displayName: 'Ahmad Ali',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80',
  calendarSyncEnabled: true,
  location: {
    city: 'DKI Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEFAULT_USER,
  isAuthenticated: false,
  isLoading: true,

  loadStoredAuth: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ user: parsed, isAuthenticated: true, isLoading: false });
        // Lakukan background sync untuk memastikan data cloud terupdate
        neonSyncService.downloadFromCloud().catch(() => {});
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (updatedData) => {
    const current = get().user;
    const updated: UserProfile = {
      ...current,
      ...updatedData,
    };
    set({ user: updated });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));

    // Simpan ke cache akun lokal agar foto profil tidak hilang saat logout
    if (updated.uid) {
      try {
        await AsyncStorage.setItem(`${ACCOUNT_CACHE_PREFIX}${updated.uid}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    // Auto-sync ke Neon PostgreSQL Cloud seketika
    neonSyncService.triggerAutoSync(500);
  },

  loginDemo: async () => {
    set({ isLoading: true });
    const uid = 'zahim_demo_user';
    let userToSet = { ...DEFAULT_USER, uid };

    // Cek apakah ada foto profil tersimpan di cache lokal sebelumnya
    try {
      const cached = await AsyncStorage.getItem(`${ACCOUNT_CACHE_PREFIX}${uid}`);
      if (cached) {
        userToSet = { ...userToSet, ...JSON.parse(cached) };
      }
    } catch {
      // ignore
    }

    set({ user: userToSet, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(userToSet));

    // Sinkronkan dengan Neon Cloud: Ambil data jika sudah ada di cloud, atau upload data default
    try {
      const result = await neonSyncService.downloadFromCloud();
      if (!result.success) {
        await neonSyncService.uploadToCloud();
      }
    } catch {
      // ignore
    }
  },

  loginWithEmail: async (email: string, displayName?: string) => {
    set({ isLoading: true });
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName?.trim() || cleanEmail.split('@')[0] || 'Hamba Allah';
    const uid = `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    let userToSet: UserProfile = {
      ...DEFAULT_USER,
      uid,
      email: cleanEmail,
      displayName: cleanName,
    };

    // Ambil cache profil lokal jika akun ini pernah ganti foto sebelumnya
    try {
      const cached = await AsyncStorage.getItem(`${ACCOUNT_CACHE_PREFIX}${uid}`);
      if (cached) {
        const parsedCached = JSON.parse(cached);
        userToSet = { ...userToSet, ...parsedCached };
      }
    } catch {
      // ignore
    }

    set({ user: userToSet, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(userToSet));

    // Otomatis tarik data dari Neon Cloud (agar data di HP sinkron ke Laptop)
    try {
      const result = await neonSyncService.downloadFromCloud();
      if (!result.success) {
        await neonSyncService.uploadToCloud();
      }
    } catch {
      // ignore
    }
  },

  loginWithWhatsApp: async (phone: string, displayName?: string) => {
    set({ isLoading: true });
    const cleanPhone = phone.trim();
    const cleanDigits = cleanPhone.replace(/\D/g, '');
    const cleanName = displayName?.trim() || 'Sahabat ZAHIM';
    const uid = `wa_${cleanDigits}`;

    let userToSet: UserProfile = {
      ...DEFAULT_USER,
      uid,
      email: `${cleanDigits}@wa.zahim.id`,
      phone: cleanPhone,
      displayName: cleanName,
    };

    try {
      const cached = await AsyncStorage.getItem(`${ACCOUNT_CACHE_PREFIX}${uid}`);
      if (cached) {
        const parsedCached = JSON.parse(cached);
        userToSet = { ...userToSet, ...parsedCached };
      }
    } catch {
      // ignore
    }

    set({ user: userToSet, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(userToSet));

    // Otomatis tarik data dari Neon Cloud
    try {
      const result = await neonSyncService.downloadFromCloud();
      if (!result.success) {
        await neonSyncService.uploadToCloud();
      }
    } catch {
      // ignore
    }
  },

  logout: async () => {
    const currentUser = get().user;
    if (currentUser && currentUser.uid) {
      try {
        // Simpan cache profil akun agar saat login lagi fotonya tidak hilang
        await AsyncStorage.setItem(
          `${ACCOUNT_CACHE_PREFIX}${currentUser.uid}`,
          JSON.stringify(currentUser)
        );
      } catch {
        // ignore
      }
    }

    try {
      await AsyncStorage.removeItem(STORAGE_AUTH_KEY);
    } catch {
      // ignore
    }
    set({ isAuthenticated: false, user: DEFAULT_USER });
  },

  toggleCalendarSync: async () => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, calendarSyncEnabled: !user.calendarSyncEnabled };
    set({ user: updated });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));
    neonSyncService.triggerAutoSync();
  },
}));
