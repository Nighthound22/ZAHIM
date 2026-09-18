import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useHabitStore } from '../../store/useHabitStore';
import { soundHaptics } from '../../services/soundHaptics';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Clock, CheckCircle } from 'lucide-react-native';

interface FocusPomodoroModalProps {
  visible: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60, // 25 min
  shortBreak: 5 * 60, // 5 min
  longBreak: 15 * 60, // 15 min
};

export const FocusPomodoroModal: React.FC<FocusPomodoroModalProps> = ({ visible, onClose }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [ambienceSound, setAmbienceSound] = useState<'rain' | 'off'>('rain');

  const { addFocusMinutes } = useHabitStore();

  // Audio Context Ref for Rain Ambience Synthesis
  const audioContextRef = useRef<any>(null);
  const noiseNodeRef = useRef<any>(null);
  const gainNodeRef = useRef<any>(null);

  // Stop sound helper
  const stopAmbience = () => {
    try {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
    } catch {
      // Ignore
    }
  };

  // Start sound helper (Rain ambience generator using Web Audio API)
  const startRainAmbience = () => {
    if (Platform.OS !== 'web') return;
    try {
      stopAmbience();
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate 2 seconds of pink/brownish filtered noise for gentle rain
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 1.8;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Lowpass filter to simulate rain acoustics
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noiseNodeRef.current = noise;
      gainNodeRef.current = gain;
    } catch {
      // Audio fallback
    }
  };

  // Manage timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Finished
      setIsActive(false);
      setIsCompleted(true);
      stopAmbience();
      soundHaptics.celebrate();

      if (mode === 'focus') {
        addFocusMinutes(25);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  // Handle Ambience Sound state
  useEffect(() => {
    if (isActive && ambienceSound === 'rain') {
      startRainAmbience();
    } else {
      stopAmbience();
    }
    return () => stopAmbience();
  }, [isActive, ambienceSound]);

  // When switching modes
  const handleSelectMode = (newMode: TimerMode) => {
    soundHaptics.lightTap();
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    setIsActive(false);
    setIsCompleted(false);
  };

  const toggleTimer = () => {
    soundHaptics.lightTap();
    if (isCompleted) {
      setIsCompleted(false);
      setTimeLeft(MODE_DURATIONS[mode]);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    soundHaptics.lightTap();
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(MODE_DURATIONS[mode]);
    stopAmbience();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = MODE_DURATIONS[mode];
  const progressRatio = Math.max(0, Math.min(1, (totalDuration - timeLeft) / totalDuration));
  const strokeDashoffset = 565 - 565 * progressRatio;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Clock size={18} color="#00FF66" />
              </View>
              <View>
                <Text style={styles.title}>Barakah Focus Pomodoro</Text>
                <Text style={styles.subtitle}>Ritme deep work berkah terintegrasi waktu ibadah</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                stopAmbience();
                onClose();
              }}
              style={styles.closeBtn}
            >
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Mode Tabs */}
          <View style={styles.modeTabs}>
            <TouchableOpacity
              onPress={() => handleSelectMode('focus')}
              style={[styles.modeTab, mode === 'focus' && styles.modeTabActive]}
            >
              <Text style={[styles.modeTabText, mode === 'focus' && styles.modeTabTextActive]}>
                Fokus (25m)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectMode('shortBreak')}
              style={[styles.modeTab, mode === 'shortBreak' && styles.modeTabActive]}
            >
              <Text style={[styles.modeTabText, mode === 'shortBreak' && styles.modeTabTextActive]}>
                Istirahat (5m)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectMode('longBreak')}
              style={[styles.modeTab, mode === 'longBreak' && styles.modeTabActive]}
            >
              <Text style={[styles.modeTabText, mode === 'longBreak' && styles.modeTabTextActive]}>
                Jeda Penuh (15m)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Circular Countdown Display */}
          <View style={styles.timerCircleContainer}>
            <Svg width="220" height="220" viewBox="0 0 200 200">
              {/* Background Ring */}
              <Circle
                cx="100"
                cy="100"
                r="90"
                stroke="#1F2432"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress Ring */}
              <Circle
                cx="100"
                cy="100"
                r="90"
                stroke={mode === 'focus' ? '#00FF66' : '#38BDF8'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="565"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </Svg>

            <View style={styles.timerTextWrap}>
              <Text style={styles.timeDigits}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerStatus}>
                {isActive ? (mode === 'focus' ? '⚡ Sedang Fokus' : '☕ Waktu Rehat') : isCompleted ? '✨ Selesai' : 'Siap Mulai'}
              </Text>
            </View>
          </View>

          {/* Completed Notice */}
          {isCompleted && (
            <View style={styles.completedNotice}>
              <CheckCircle size={16} color="#00FF66" />
              <Text style={styles.completedNoticeText}>
                Alhamdulillah! Sesi {mode === 'focus' ? '25 menit fokus' : 'rehat'} selesai. Waktu tercatat di metrik Anda.
              </Text>
            </View>
          )}

          {/* Ambience Audio Selector */}
          <View style={styles.ambienceBar}>
            <View style={styles.ambienceLabelWrap}>
              {ambienceSound === 'rain' ? (
                <Volume2 size={16} color="#38BDF8" />
              ) : (
                <VolumeX size={16} color={Colors.textMuted} />
              )}
              <Text style={styles.ambienceTitle}>Suara Penenang (Ambience):</Text>
            </View>

            <View style={styles.ambienceOptions}>
              <TouchableOpacity
                onPress={() => {
                  soundHaptics.lightTap();
                  setAmbienceSound('rain');
                }}
                style={[styles.ambiencePill, ambienceSound === 'rain' && styles.ambiencePillActive]}
              >
                <Text style={[styles.ambiencePillText, ambienceSound === 'rain' && styles.ambiencePillTextActive]}>
                  🌧️ Gerimis
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  soundHaptics.lightTap();
                  setAmbienceSound('off');
                }}
                style={[styles.ambiencePill, ambienceSound === 'off' && styles.ambiencePillActive]}
              >
                <Text style={[styles.ambiencePillText, ambienceSound === 'off' && styles.ambiencePillTextActive]}>
                  🔇 Hening
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Timer Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={handleReset}
              style={styles.controlSecondaryBtn}
              activeOpacity={0.8}
            >
              <RotateCcw size={18} color={Colors.textMuted} />
              <Text style={styles.controlSecondaryText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleTimer}
              style={[
                styles.controlPrimaryBtn,
                { backgroundColor: isActive ? '#EF4444' : '#00FF66' },
              ]}
              activeOpacity={0.8}
            >
              {isActive ? (
                <>
                  <Pause size={18} color="#0B0D11" />
                  <Text style={styles.controlPrimaryText}>Jeda</Text>
                </>
              ) : (
                <>
                  <Play size={18} color="#0B0D11" />
                  <Text style={styles.controlPrimaryText}>{isCompleted ? 'Ulangi Sesi' : 'Mulai Fokus'}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Hadith Motivation Note */}
          <View style={styles.hadithCard}>
            <Sparkles size={14} color="#FBBF24" />
            <Text style={styles.hadithText}>
              "Dua kenikmatan yang sering dilalaikan manusia: kesehatan dan waktu luang." (HR. Bukhari no. 6412)
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#0F1117',
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBright,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#14171F',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#14171F',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#1F2432',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modeTabTextActive: {
    color: Colors.textBright,
  },
  timerCircleContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerTextWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  timeDigits: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.textBright,
    letterSpacing: 2,
  },
  timerStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 4,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
    width: '100%',
  },
  completedNoticeText: {
    fontSize: 11,
    color: '#00FF66',
    flex: 1,
    fontWeight: '500',
  },
  ambienceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#14171F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  ambienceLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ambienceTitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ambienceOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  ambiencePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1F2432',
  },
  ambiencePillActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  ambiencePillText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ambiencePillTextActive: {
    color: '#38BDF8',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  controlSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  controlSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  controlPrimaryBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  controlPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B0D11',
  },
  hadithCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    width: '100%',
  },
  hadithText: {
    fontSize: 10,
    color: '#FBBF24',
    fontStyle: 'italic',
    flex: 1,
  },
});
