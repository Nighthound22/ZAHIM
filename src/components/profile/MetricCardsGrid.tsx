import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Target, CheckCircle2, Clock, TrendingUp, Play } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useHabitStore } from '../../store/useHabitStore';
import { soundHaptics } from '../../services/soundHaptics';

interface MetricCardsGridProps {
  himmahPercentage: number;
  completedTasks: number;
  totalTasks: number;
  bonusXP: number;
  onOpenFocusTimer?: () => void;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
  himmahPercentage,
  completedTasks,
  totalTasks,
  onOpenFocusTimer,
}) => {
  const { focusMinutesToday } = useHabitStore();
  const hours = Math.floor(focusMinutesToday / 60);
  const mins = focusMinutesToday % 60;
  const focusTimeDisplay = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;

  // Focus score scaled to 10.0
  const focusScore = ((himmahPercentage / 100) * 10).toFixed(1);
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <View style={styles.gridContainer}>
      {/* CARD 1: FOCUS SCORE */}
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardLabel}>FOCUS SCORE</Text>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
            <Target size={16} color="#A78BFA" />
          </View>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.bigNumber}>{focusScore}</Text>
          <Text style={styles.denomNumber}>/ 10.0</Text>
        </View>

        {/* Purple Sparkline Wave */}
        <View style={styles.chartContainer}>
          <Svg height="28" width="100%" viewBox="0 0 160 28">
            <Path
              d="M0,22 Q35,5 70,18 T140,8 T160,20"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <View style={styles.bottomStatusRow}>
          <View style={[styles.statusPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Text style={[styles.statusPillText, { color: '#FBBF24' }]}>
              {parseFloat(focusScore) < 5 ? 'Needs Focus' : 'Consistent'}
            </Text>
          </View>
          <Text style={styles.subtextDim}>MVP Formula</Text>
        </View>
      </View>

      {/* CARD 2: TUGAS SELESAI */}
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardLabel}>TUGAS SELESAI</Text>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <CheckCircle2 size={16} color="#38BDF8" />
          </View>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.bigNumber}>{completedTasks}</Text>
          <Text style={styles.denomNumber}>/ {totalTasks} Total</Text>
        </View>

        {/* Cyan Progress Bar */}
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBarFill, { width: `${taskPercent}%` }]} />
        </View>

        <View style={styles.bottomStatusRow}>
          <Text style={styles.subtextDim}>Matriks Prioritas</Text>
          <Text style={[styles.subtextHighlight, { color: '#38BDF8' }]}>{taskPercent}% Selesai</Text>
        </View>
      </View>

      {/* CARD 3: WAKTU FOKUS */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          soundHaptics.lightTap();
          onOpenFocusTimer?.();
        }}
        style={[styles.card, { borderColor: 'rgba(251, 191, 36, 0.4)' }]}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.cardLabel}>WAKTU FOKUS</Text>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Clock size={16} color="#FBBF24" />
          </View>
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.bigNumber, { color: '#FBBF24' }]}>{focusTimeDisplay}</Text>
        </View>

        {/* Amber Mini Vertical Bar Chart */}
        <View style={styles.barChartWrap}>
          <Svg height="24" width="100%" viewBox="0 0 140 24">
            <Rect x="5" y="16" width="10" height="8" rx="2" fill="#D97706" opacity="0.6" />
            <Rect x="25" y="12" width="10" height="12" rx="2" fill="#D97706" opacity="0.7" />
            <Rect x="45" y="14" width="10" height="10" rx="2" fill="#D97706" opacity="0.6" />
            <Rect x="65" y="8" width="10" height="16" rx="2" fill="#FBBF24" opacity="0.8" />
            <Rect x="85" y="4" width="10" height="20" rx="2" fill="#FBBF24" opacity="0.9" />
            <Rect x="105" y="6" width="10" height="18" rx="2" fill="#FBBF24" opacity="0.9" />
            <Rect x="125" y="2" width="10" height="22" rx="2" fill="#F59E0B" />
          </Svg>
        </View>

        <View style={styles.bottomStatusRow}>
          <Text style={styles.subtextDim}>Sesi Pomodoro</Text>
          <Text style={[styles.subtextHighlight, { color: '#FBBF24' }]}>Mulai Sesi ⚡</Text>
        </View>
      </TouchableOpacity>

      {/* CARD 4: PRODUKTIVITAS */}
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardLabel}>PRODUKTIVITAS</Text>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(0, 255, 102, 0.15)' }]}>
            <TrendingUp size={16} color="#00FF66" />
          </View>
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.bigNumber, { color: '#00FF66' }]}>{himmahPercentage}%</Text>
          <Text style={[styles.denomNumber, { color: Colors.textMuted }]}>Tercapai</Text>
        </View>

        {/* Green Trend Wave */}
        <View style={styles.chartContainer}>
          <Svg height="28" width="100%" viewBox="0 0 160 28">
            <Path
              d="M0,24 Q40,22 80,14 T140,8 T160,4"
              fill="none"
              stroke="#00FF66"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <View style={styles.bottomStatusRow}>
          <Text style={[styles.subtextHighlight, { color: '#00FF66', fontSize: 11 }]}>
            🔥 Ritme harian luar biasa!
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    minWidth: 155,
    backgroundColor: '#11141C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 16,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  iconWrap: {
    padding: 6,
    borderRadius: 10,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 8,
  },
  bigNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  denomNumber: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  chartContainer: {
    marginVertical: 6,
    height: 28,
    justifyContent: 'center',
  },
  progressBarWrap: {
    height: 5,
    backgroundColor: '#1E232E',
    borderRadius: 3,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },
  barChartWrap: {
    marginVertical: 8,
    height: 24,
    justifyContent: 'center',
  },
  bottomStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  subtextDim: {
    fontSize: 10,
    color: '#64748B',
  },
  subtextHighlight: {
    fontSize: 10,
    fontWeight: '700',
  },
});
