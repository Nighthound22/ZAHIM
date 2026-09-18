import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityPreset, INDONESIAN_CITIES, PrayerService } from '../services/prayerService';
import { PrayerTimeItem } from '../types';

interface PrayerState {
  selectedCity: CityPreset;
  autoDND: boolean;
  notificationBuffer: boolean;
  isDNDActiveNow: boolean;
  
  // Actions
  setCity: (city: CityPreset) => void;
  toggleAutoDND: () => void;
  toggleNotificationBuffer: () => void;
  getPrayerCalculation: () => {
    items: PrayerTimeItem[];
    nextPrayer: PrayerTimeItem | null;
    currentPrayer: PrayerTimeItem | null;
    isBufferTime: boolean;
    bufferMinutesRemaining: number;
  };
  loadSettings: () => Promise<void>;
}

const STORAGE_PRAYER_SETTINGS_KEY = '@zahim_prayer_settings_v1';

export const usePrayerStore = create<PrayerState>((set, get) => ({
  selectedCity: INDONESIAN_CITIES[0], // DKI Jakarta default
  autoDND: true,
  notificationBuffer: true,
  isDNDActiveNow: false,

  loadSettings: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_PRAYER_SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          selectedCity: parsed.selectedCity || INDONESIAN_CITIES[0],
          autoDND: parsed.autoDND ?? true,
          notificationBuffer: parsed.notificationBuffer ?? true
        });
      }
    } catch {
      // Fallback
    }
  },

  setCity: async (city) => {
    set({ selectedCity: city });
    const { autoDND, notificationBuffer } = get();
    await AsyncStorage.setItem(
      STORAGE_PRAYER_SETTINGS_KEY,
      JSON.stringify({ selectedCity: city, autoDND, notificationBuffer })
    );
  },

  toggleAutoDND: async () => {
    const newVal = !get().autoDND;
    set({ autoDND: newVal });
    const { selectedCity, notificationBuffer } = get();
    await AsyncStorage.setItem(
      STORAGE_PRAYER_SETTINGS_KEY,
      JSON.stringify({ selectedCity, autoDND: newVal, notificationBuffer })
    );
  },

  toggleNotificationBuffer: async () => {
    const newVal = !get().notificationBuffer;
    set({ notificationBuffer: newVal });
    const { selectedCity, autoDND } = get();
    await AsyncStorage.setItem(
      STORAGE_PRAYER_SETTINGS_KEY,
      JSON.stringify({ selectedCity, autoDND, notificationBuffer: newVal })
    );
  },

  getPrayerCalculation: () => {
    const { selectedCity } = get();
    const result = PrayerService.calculatePrayerTimes(
      selectedCity.latitude,
      selectedCity.longitude,
      new Date()
    );

    // If current prayer time is within 15 mins and autoDND is enabled, simulate DND Active
    let isDND = false;
    if (get().autoDND && result.currentPrayer) {
      const diffMs = Math.abs(new Date().getTime() - result.currentPrayer.dateObj.getTime());
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes <= 20) {
        isDND = true;
      }
    }

    if (get().isDNDActiveNow !== isDND) {
      set({ isDNDActiveNow: isDND });
    }

    return result;
  }
}));
