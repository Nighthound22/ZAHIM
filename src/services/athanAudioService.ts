import { Platform } from 'react-native';
import { soundHaptics } from './soundHaptics';

export type AthanToneType = 'makkah' | 'madinah' | 'fajr' | 'mishary' | 'chime';

export interface AthanOption {
  id: AthanToneType;
  title: string;
  description: string;
  durationSec: number;
  audioUrl?: string;
}

export const ATHAN_OPTIONS: AthanOption[] = [
  {
    id: 'makkah',
    title: 'Adzan Asli Makkah (Masjidil Haram)',
    description: 'Rekaman suara asli adzan Masjidil Haram Makkah Al-Mukarramah yang agung dan menggetarkan kalbu.',
    durationSec: 180,
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
  },
  {
    id: 'madinah',
    title: 'Adzan Asli Madinah (Masjid Nabawi)',
    description: 'Rekaman suara asli adzan Masjid Nabawi Madinah Al-Munawwarah yang lembut, tenang, dan syahdu.',
    durationSec: 160,
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
  },
  {
    id: 'fajr',
    title: 'Adzan Asli Subuh (Ash-Shalatu Khair)',
    description: 'Rekaman suara asli khusus sholat Subuh dengan lafadz "Ash-Shalatu khairun minan-naum".',
    durationSec: 210,
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan8.mp3',
  },
  {
    id: 'mishary',
    title: 'Adzan Asli Syaikh Mishary Rashid',
    description: 'Lantunan suara asli merdu dan fasih dari Qari dunia Syaikh Mishary Rashid Alafasy.',
    durationSec: 200,
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
  },
  {
    id: 'chime',
    title: 'Nada Lembut & Gemerincing Wudhu',
    description: 'Chime kristal halus sintetis untuk pengingat adzan dalam mode kerja profesional.',
    durationSec: 5,
  },
];

class AthanAudioService {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: any = null;
  private isPlaying: boolean = false;
  private activeToneId: AthanToneType | null = null;
  private volume: number = 0.85;

  private getAudioContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && !this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    return this.audioCtx;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  stopAll() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
      } catch {
        // ignore
      }
      this.audioElement = null;
    }
    this.isPlaying = false;
    this.activeToneId = null;
  }

  /**
   * Plays authentic recorded Adzan MP3 or synthesized chime
   */
  playAthanTone(toneType: AthanToneType = 'makkah', onComplete?: () => void) {
    if (soundHaptics.getIsMuted()) {
      return;
    }

    this.stopAll();
    this.isPlaying = true;
    this.activeToneId = toneType;

    const option = ATHAN_OPTIONS.find((o) => o.id === toneType) || ATHAN_OPTIONS[0];

    // If Chime synthetic mode
    if (toneType === 'chime' || !option.audioUrl) {
      this.playSyntheticChime(onComplete);
      return;
    }

    // Play Authentic MP3 Audio
    if (Platform.OS === 'web' && typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(option.audioUrl);
        audio.volume = this.volume;
        this.audioElement = audio;

        audio.onended = () => {
          this.isPlaying = false;
          this.activeToneId = null;
          if (onComplete) onComplete();
        };

        audio.onerror = () => {
          // If network error, fallback to synthetic chime
          this.playSyntheticChime(onComplete);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy fallback
            this.playSyntheticChime(onComplete);
          });
        }
      } catch {
        this.playSyntheticChime(onComplete);
      }
    } else {
      this.playSyntheticChime(onComplete);
    }
  }

  private playSyntheticChime(onComplete?: () => void) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) {
        this.isPlaying = false;
        if (onComplete) onComplete();
        return;
      }

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, dur: 0.8, delay: 0.0 }, // C5
        { freq: 659.25, dur: 0.9, delay: 0.4 }, // E5
        { freq: 783.99, dur: 1.0, delay: 0.8 }, // G5
        { freq: 1046.5, dur: 1.8, delay: 1.3 }, // C6
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        const startTime = now + note.delay;
        const endTime = startTime + note.dur;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18 * this.volume, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(endTime);
      });

      const totalMs = (notes[notes.length - 1].delay + notes[notes.length - 1].dur) * 1000;
      setTimeout(() => {
        this.isPlaying = false;
        this.activeToneId = null;
        if (onComplete) onComplete();
      }, totalMs);
    } catch {
      this.isPlaying = false;
      if (onComplete) onComplete();
    }
  }

  /**
   * Spoken Indonesian voice reminder for H-15 prayer buffer
   */
  speakBufferReminder(prayerName: string = 'Sholat', minutesRemaining: number = 15) {
    if (soundHaptics.getIsMuted()) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const text = `Waktu ${prayerName} ${minutesRemaining} menit lagi. Mari bersiap wudhu dan merapikan pekerjaan.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.volume = this.volume;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getActiveToneId(): AthanToneType | null {
    return this.activeToneId;
  }
}

export const athanAudioService = new AthanAudioService();
