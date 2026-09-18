import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  loginDemo: () => Promise<void>;
  loginWithGoogle: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  toggleCalendarSync: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const STORAGE_AUTH_KEY = '@zahim_auth_v2';

// Matching user's screenshot: "Ahmad Ali", Muslim scholar with peci avatar
const DEFAULT_USER: UserProfile = {
  uid: 'zahim_user_001',
  email: 'ahmad.ali@zahim.id',
  displayName: 'Ahmad Ali',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  calendarSyncEnabled: true,
  location: {
    city: 'DKI Jakarta',
    latitude: -6.2088,
    longitude: 106.8456
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,
  isLoading: false,

  loadStoredAuth: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_AUTH_KEY);
      if (stored) {
        set({ user: JSON.parse(stored), isAuthenticated: true });
      } else {
        set({ user: DEFAULT_USER, isAuthenticated: true });
        await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(DEFAULT_USER));
      }
    } catch {
      // Fallback
    }
  },

  updateProfile: async (updatedData) => {
    const updated = {
      ...get().user,
      ...updatedData
    };
    set({ user: updated });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));
  },

  loginDemo: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 400));
    set({ user: DEFAULT_USER, isAuthenticated: true, isLoading: false });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(DEFAULT_USER));
  },

  loginWithGoogle: async (profile) => {
    const fullUser: UserProfile = {
      ...get().user,
      ...profile,
      uid: profile.uid || `google_${Date.now()}`
    };
    set({ user: fullUser, isAuthenticated: true });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(fullUser));
  },

  logout: async () => {
    set({ user: DEFAULT_USER, isAuthenticated: true });
  },

  toggleCalendarSync: async () => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, calendarSyncEnabled: !user.calendarSyncEnabled };
    set({ user: updated });
    await AsyncStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));
  }
}));
