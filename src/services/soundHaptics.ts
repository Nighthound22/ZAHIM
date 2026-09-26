import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_SOUND_MUTE_KEY = '@zahim_sound_mute_v1';

class SoundHapticsService {
  private audioCtx: any = null;
  private isMuted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_SOUND_MUTE_KEY);
      if (stored !== null) {
        this.isMuted = JSON.parse(stored);
        this.notifyListeners();
      }
    } catch {
      // Fallback
    }
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  async setMuted(muted: boolean) {
    this.isMuted = muted;
    this.notifyListeners();
    try {
      await AsyncStorage.setItem(STORAGE_SOUND_MUTE_KEY, JSON.stringify(muted));
    } catch {
      // Fallback
    }
  }

  async toggleMute(): Promise<boolean> {
    const next = !this.isMuted;
    await this.setMuted(next);
    if (!next) {
      this.playTickSound();
    }
    return next;
  }

  addListener(listener: (muted: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  private getAudioContext() {
    if (this.isMuted) return null;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && !this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    return this.audioCtx;
  }

  // Soft click sound for dhikr counter or button taps
  playTickSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {
      // Audio autoplay may be prevented before user interaction
    }
  }

  // Celebration chime when finishing a target / habit
  playSuccessChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.15, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      }
    } catch {
      // Audio autoplay fail-safe
    }
  }

  // Light tap haptic
  lightTap() {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      this.playTickSound();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }

  // Medium feedback (e.g. checkbox toggled)
  mediumTap() {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
      this.playTickSound();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }

  // Warning vibration feedback
  warning() {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
  }

  // Success milestone reached (Dhikr 33/100 completed, Habit done)
  celebrate() {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 80]);
      }
      this.playSuccessChime();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }
}

export const soundHaptics = new SoundHapticsService();
