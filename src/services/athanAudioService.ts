import { Platform } from 'react-native';

export type AthanToneType = 'makkah' | 'madinah' | 'takbir' | 'chime';

export interface AthanOption {
  id: AthanToneType;
  title: string;
  description: string;
  durationSec: number;
}

export const ATHAN_OPTIONS: AthanOption[] = [
  {
    id: 'makkah',
    title: 'Adzan Makkah Al-Mukarramah',
    description: 'Melodi agung dan syahdu, lantang menggetarkan kalbu.',
    durationSec: 12,
  },
  {
    id: 'madinah',
    title: 'Adzan Madinah Al-Munawwarah',
    description: 'Melodi lembut dan tenang, menyejukkan hati pendengar.',
    durationSec: 10,
  },
  {
    id: 'takbir',
    title: 'Takbir & Panggilan Sholat Singkat',
    description: 'Dua kali lafadz takbir, cocok untuk suasana kantor/kerja.',
    durationSec: 6,
  },
  {
    id: 'chime',
    title: 'Nada Lembut & Gemerincing Wudhu',
    description: 'Chime kristal halus untuk mode senyap profesional.',
    durationSec: 4,
  },
];

class AthanAudioService {
  private audioCtx: any = null;
  private isPlaying: boolean = false;
  private activeNodes: any[] = [];
  private volume: number = 0.8;

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
  }

  stopAll() {
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {}
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  /**
   * Synthesizes authentic melodic Adzan phrasing
   */
  playAthanTone(toneType: AthanToneType = 'makkah', onComplete?: () => void) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      this.stopAll();
      this.isPlaying = true;

      const now = ctx.currentTime;

      // Define note sequences (Frequencies in Hz)
      let notes: { freq: number; dur: number; delay: number }[] = [];

      if (toneType === 'makkah') {
        // Melodic Rast motif for Allahu Akbar
        notes = [
          { freq: 261.63, dur: 0.8, delay: 0.0 }, // C4 (Al-)
          { freq: 329.63, dur: 1.2, delay: 0.7 }, // E4 (-laa-)
          { freq: 392.00, dur: 1.6, delay: 1.8 }, // G4 (-hu)
          { freq: 349.23, dur: 0.9, delay: 3.3 }, // F4 (Ak-)
          { freq: 329.63, dur: 2.2, delay: 4.1 }, // E4 (-bar)
          // Second takbir
          { freq: 261.63, dur: 0.8, delay: 6.5 },
          { freq: 329.63, dur: 1.2, delay: 7.2 },
          { freq: 392.00, dur: 1.6, delay: 8.3 },
          { freq: 349.23, dur: 0.9, delay: 9.8 },
          { freq: 261.63, dur: 2.5, delay: 10.6 },
        ];
      } else if (toneType === 'madinah') {
        // Softer Bayati mode
        notes = [
          { freq: 293.66, dur: 0.9, delay: 0.0 }, // D4
          { freq: 329.63, dur: 1.1, delay: 0.8 }, // E4
          { freq: 349.23, dur: 1.4, delay: 1.8 }, // F4
          { freq: 329.63, dur: 0.8, delay: 3.1 }, // E4
          { freq: 293.66, dur: 2.0, delay: 3.8 }, // D4
          // Second line
          { freq: 293.66, dur: 0.9, delay: 6.0 },
          { freq: 349.23, dur: 1.3, delay: 6.8 },
          { freq: 329.63, dur: 1.0, delay: 8.0 },
          { freq: 293.66, dur: 2.4, delay: 8.9 },
        ];
      } else if (toneType === 'takbir') {
        notes = [
          { freq: 329.63, dur: 0.7, delay: 0.0 }, // E4
          { freq: 392.00, dur: 1.2, delay: 0.6 }, // G4
          { freq: 349.23, dur: 0.8, delay: 1.7 }, // F4
          { freq: 329.63, dur: 1.8, delay: 2.4 }, // E4
          // Second takbir
          { freq: 329.63, dur: 0.7, delay: 4.4 },
          { freq: 392.00, dur: 1.2, delay: 5.0 },
          { freq: 329.63, dur: 2.0, delay: 6.1 },
        ];
      } else {
        // Chime for H-15 buffer
        notes = [
          { freq: 523.25, dur: 0.8, delay: 0.0 }, // C5
          { freq: 659.25, dur: 0.9, delay: 0.4 }, // E5
          { freq: 783.99, dur: 1.0, delay: 0.8 }, // G5
          { freq: 1046.50, dur: 1.8, delay: 1.3 }, // C6
        ];
      }

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm harmonic tone
        osc.type = toneType === 'chime' ? 'sine' : 'triangle';
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
        this.activeNodes.push(osc);
      });

      const totalDurationMs = (notes[notes.length - 1].delay + notes[notes.length - 1].dur) * 1000;
      setTimeout(() => {
        this.isPlaying = false;
        if (onComplete) onComplete();
      }, totalDurationMs);
    } catch {
      // Audio autoplay fail-safe
    }
  }

  /**
   * Spoken Indonesian voice reminder for H-15 prayer buffer
   */
  speakBufferReminder(prayerName: string = 'Sholat', minutesRemaining: number = 15) {
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

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const athanAudioService = new AthanAudioService();
