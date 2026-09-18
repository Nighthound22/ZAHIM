import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';

interface HeatmapDay {
  date: string;
  dayOfMonth: number;
  percentage: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface MonthlyHeatmapProps {
  days: HeatmapDay[];
  monthName: string;
  year: number;
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
}

const WEEKDAYS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Ah'];

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({
  days,
  monthName,
  year,
  onSelectDate,
  selectedDate,
}) => {
  const getCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 4:
        return Colors.primary;
      case 3:
        return 'rgba(0, 255, 102, 0.7)';
      case 2:
        return 'rgba(0, 255, 102, 0.4)';
      case 1:
        return 'rgba(0, 255, 102, 0.2)';
      case 0:
      default:
        return '#14171F';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.monthTitle}>
          Matriks Konsistensi • {monthName} {year}
        </Text>
        <Text style={styles.subtext}>30 Hari Terakhir</Text>
      </View>

      {/* Weekday Labels */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((w, idx) => (
          <Text key={idx} style={styles.weekdayLabel}>
            {w}
          </Text>
        ))}
      </View>

      {/* Heatmap Grid */}
      <View style={styles.grid}>
        {days.map((item) => {
          const isSelected = selectedDate === item.date;
          const bg = getCellColor(item.level);

          return (
            <TouchableOpacity
              key={item.date}
              activeOpacity={0.7}
              onPress={() => onSelectDate && onSelectDate(item.date)}
              style={[
                styles.cell,
                { backgroundColor: bg },
                isSelected && styles.selectedCell,
              ]}
            >
              <Text
                style={[
                  styles.dayNum,
                  item.level >= 3 ? { color: '#0B0D11', fontWeight: '800' } : { color: Colors.textMuted },
                ]}
              >
                {item.dayOfMonth}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Kurang (0%)</Text>
        <View style={styles.legendScale}>
          <View style={[styles.legendBox, { backgroundColor: '#14171F' }]} />
          <View style={[styles.legendBox, { backgroundColor: 'rgba(0, 255, 102, 0.2)' }]} />
          <View style={[styles.legendBox, { backgroundColor: 'rgba(0, 255, 102, 0.4)' }]} />
          <View style={[styles.legendBox, { backgroundColor: 'rgba(0, 255, 102, 0.7)' }]} />
          <View style={[styles.legendBox, { backgroundColor: Colors.primary }]} />
        </View>
        <Text style={styles.legendText}>Optimal (100%)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtext: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  weekdayLabel: {
    width: '12%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textDim,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  cell: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCell: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  dayNum: {
    fontSize: 11,
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendScale: {
    flexDirection: 'row',
    gap: 4,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendText: {
    fontSize: 10,
    color: Colors.textDim,
  },
});
