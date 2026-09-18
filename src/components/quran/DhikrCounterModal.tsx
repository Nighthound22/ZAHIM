import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { DHIKR_ITEMS, DhikrItem } from '../../data/dhikrData';
import { useQuranDhikrStore } from '../../store/useQuranDhikrStore';
import { soundHaptics } from '../../services/soundHaptics';
import { X, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react-native';

interface DhikrCounterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DhikrCounterModal: React.FC<DhikrCounterModalProps> = ({ visible, onClose }) => {
  const [activePeriod, setActivePeriod] = useState<'morning' | 'evening'>('morning');
  const [currentIndex, setCurrentIndex] = useState(0);

  const { dhikrCounts, incrementDhikrCount, resetDhikrCount, toggleDhikrCompleted } =
    useQuranDhikrStore();

  const currentDhikr: DhikrItem = DHIKR_ITEMS[currentIndex] || DHIKR_ITEMS[0];
  const count = dhikrCounts[currentDhikr.id] || 0;
  const isFinished = count >= currentDhikr.targetCount;

  const handleTap = () => {
    if (isFinished) {
      soundHaptics.celebrate();
      return;
    }

    const reached = incrementDhikrCount(currentDhikr.id, currentDhikr.targetCount);
    if (reached) {
      soundHaptics.celebrate();
    } else {
      soundHaptics.lightTap();
    }
  };

  const handleReset = () => {
    soundHaptics.lightTap();
    resetDhikrCount(currentDhikr.id);
  };

  const handleNext = () => {
    if (currentIndex < DHIKR_ITEMS.length - 1) {
      soundHaptics.lightTap();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      soundHaptics.lightTap();
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            {/* Period Tabs */}
            <View style={styles.periodTabs}>
              <TouchableOpacity
                onPress={() => setActivePeriod('morning')}
                style={[
                  styles.tabBtn,
                  activePeriod === 'morning' && styles.tabBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    activePeriod === 'morning' && styles.tabBtnTextActive,
                  ]}
                >
                  Dzikir Pagi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActivePeriod('evening')}
                style={[
                  styles.tabBtn,
                  activePeriod === 'evening' && styles.tabBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    activePeriod === 'evening' && styles.tabBtnTextActive,
                  ]}
                >
                  Dzikir Petang
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Dzikir Progress Track */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackText}>
              Bacaan ke-{currentIndex + 1} dari {DHIKR_ITEMS.length}
            </Text>
            <Text style={styles.targetBadge}>
              Target: {currentDhikr.targetCount}x
            </Text>
          </View>

          {/* Dzikir Text Content Scrollable */}
          <ScrollView style={styles.scrollArea}>
            <Text style={styles.dhikrTitle}>{currentDhikr.title}</Text>

            {/* Arabic Text */}
            <View style={styles.arabicBox}>
              <Text style={styles.arabicText}>{currentDhikr.arabic}</Text>
            </View>

            {/* Latin Transliteration */}
            <Text style={styles.latinLabel}>TRANSLITERASI LATIN</Text>
            <Text style={styles.latinText}>{currentDhikr.latin}</Text>

            {/* Indonesian Translation */}
            <Text style={styles.transLabel}>ARTINYA</Text>
            <Text style={styles.transText}>{currentDhikr.translation}</Text>

            {currentDhikr.benefits && (
              <View style={styles.benefitsBox}>
                <Sparkles size={13} color={Colors.primary} />
                <Text style={styles.benefitsText}>{currentDhikr.benefits}</Text>
              </View>
            )}
          </ScrollView>

          {/* Large Interactive Tap Counter Zone */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleTap}
            style={[
              styles.tapZone,
              isFinished ? styles.tapZoneFinished : styles.tapZoneActive,
            ]}
          >
            <View style={styles.counterContent}>
              <Text style={styles.counterLabel}>
                {isFinished ? 'ALHAMDULILLAH TUNTAS' : 'KETUK DI MANA SAJA'}
              </Text>
              <Text style={[styles.countNumber, isFinished && styles.countNumberFinished]}>
                {count} / {currentDhikr.targetCount}
              </Text>
              <Text style={styles.tapTip}>
                {isFinished ? 'Klik tombol selanjutnya ➔' : 'Sentuh layar untuk menghitung tasbih'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={currentIndex === 0}
              style={[styles.navBtn, currentIndex === 0 && styles.btnDisabled]}
            >
              <ChevronLeft size={20} color={Colors.textPrimary} />
              <Text style={styles.navBtnText}>Sebelumnya</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <RotateCcw size={16} color={Colors.textMuted} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={currentIndex === DHIKR_ITEMS.length - 1}
              style={[
                styles.navBtn,
                currentIndex === DHIKR_ITEMS.length - 1 && styles.btnDisabled,
              ]}
            >
              <Text style={styles.navBtnText}>Selanjutnya</Text>
              <ChevronRight size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  content: {
    width: '100%',
    maxWidth: 650,
    height: '92%',
    backgroundColor: '#0B0D11',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: '#14171F',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabBtnTextActive: {
    color: '#0B0D11',
  },
  closeBtn: {
    padding: 6,
  },
  trackInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackText: {
    fontSize: 11,
    color: Colors.textDim,
    fontWeight: '600',
  },
  targetBadge: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#14171F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },
  dhikrTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  arabicBox: {
    backgroundColor: '#0E1118',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 40,
    color: Colors.textPrimary,
    textAlign: 'right',
    fontFamily: 'serif',
  },
  latinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  latinText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  transLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textDim,
    letterSpacing: 1,
    marginBottom: 4,
  },
  transText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  benefitsBox: {
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.25)',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  benefitsText: {
    fontSize: 11,
    color: Colors.textPrimary,
    flex: 1,
  },
  tapZone: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    cursor: 'pointer' as any,
  },
  tapZoneActive: {
    backgroundColor: '#1E2533',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  tapZoneFinished: {
    backgroundColor: '#0D2818',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  counterContent: {
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
  },
  countNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginVertical: 4,
  },
  countNumberFinished: {
    color: Colors.primary,
  },
  tapTip: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  resetText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  btnDisabled: {
    opacity: 0.3,
  },
});
