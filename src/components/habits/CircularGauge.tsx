import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';

interface CircularGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  completedPoints?: number;
  targetPoints?: number;
  bonusXP?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  size = 170,
  strokeWidth = 14,
  completedPoints = 0,
  targetPoints = 0,
  bonusXP = 0,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.primary} />
            <Stop offset="100%" stopColor={Colors.secondary} />
          </LinearGradient>
        </Defs>

        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
          strokeOpacity={0.6}
        />

        {/* Active Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#neonGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center Metrics Content */}
      <View style={styles.contentOverlay}>
        <Text style={styles.scoreText}>{clampedScore}%</Text>
        <Text style={styles.labelText}>HIMMAH INDEX</Text>
        <Text style={styles.pointsText}>
          {completedPoints}/{targetPoints} Poin
        </Text>
        {bonusXP > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>+{bonusXP}% Memo XP</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
  contentOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  pointsText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bonusBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  bonusText: {
    fontSize: 9,
    color: Colors.secondary,
    fontWeight: '700',
  },
});
