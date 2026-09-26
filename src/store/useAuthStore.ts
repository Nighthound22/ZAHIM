import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

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

const DEFAULT_USER: UserProfile = {
  uid: 'zahim_user_001',
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
        set({ user: JSON.parse(stored), isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (updatedData) => {
    const updated = {
      ...get().user,
      ...updatedData,
    };
    set({ user: updated });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));
  },

  loginDemo: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ user: DEFAULT_USER, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(DEFAULT_USER));
  },

  loginWithEmail: async (email: string, displayName?: string) => {
    set({ isLoading: true });
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName?.trim() || cleanEmail.split('@')[0] || 'Hamba Allah';
    const newUser: UserProfile = {
      ...get().user,
      uid: `email_${Date.now()}`,
      email: cleanEmail,
      displayName: cleanName,
    };
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newUser));
  },

  loginWithWhatsApp: async (phone: string, displayName?: string) => {
    set({ isLoading: true });
    const cleanPhone = phone.trim();
    const cleanName = displayName?.trim() || 'Sahabat ZAHIM';
    const newUser: UserProfile = {
      ...get().user,
      uid: `wa_${Date.now()}`,
      email: `${cleanPhone.replace(/\D/g, '')}@wa.zahim.id`,
      phone: cleanPhone,
      displayName: cleanName,
    };
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newUser));
  },

  logout: async () => {
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
  },
}));
