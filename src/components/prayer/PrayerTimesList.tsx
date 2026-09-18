import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrayerTimeItem } from '../../types';
import { Colors } from '../../theme/colors';
import { Check, Clock, Sun, Sunrise, Sunset, Moon } from 'lucide-react-native';

interface PrayerTimesListProps {
  items: PrayerTimeItem[];
}

export const PrayerTimesList: React.FC<PrayerTimesListProps> = ({ items }) => {
  const getIcon = (name: PrayerTimeItem['name']) => {
    switch (name) {
      case 'Fajr':
        return <Sunrise size={16} color={Colors.primary} />;
      case 'Sunrise':
        return <Sun size={16} color={Colors.warning} />;
      case 'Dhuhr':
        return <Sun size={16} color={Colors.secondary} />;
      case 'Asr':
        return <Sunset size={16} color={Colors.warning} />;
      case 'Maghrib':
        return <Sunset size={16} color={Colors.danger} />;
      case 'Isha':
        return <Moon size={16} color={Colors.primary} />;
      default:
        return <Clock size={16} color={Colors.textMuted} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Jadwal Sholat 5 Waktu Hari Ini</Text>
      <View style={styles.grid}>
        {items.map((item) => {
          return (
            <View
              key={item.name}
              style={[
                styles.itemCard,
                item.isNext && styles.itemCardNext,
                item.isPassed && styles.itemCardPassed,
              ]}
            >
              <View style={styles.headerRow}>
                <View style={styles.iconWrap}>{getIcon(item.name)}</View>
                {item.isNext && (
                  <View style={styles.nextTag}>
                    <Text style={styles.nextTagText}>BERIKUTNYA</Text>
                  </View>
                )}
                {item.isPassed && (
                  <View style={styles.passedCheck}>
                    <Check size={12} color={Colors.textDim} />
                  </View>
                )}
              </View>

              <Text style={[styles.nameText, item.isNext && { color: Colors.primary }]}>
                {item.displayName}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  item.isNext && styles.timeTextNext,
                  item.isPassed && styles.timeTextPassed,
                ]}
              >
                {item.time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '31%',
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
  },
  itemCardNext: {
    borderColor: Colors.primary,
    backgroundColor: '#12191F',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  itemCardPassed: {
    opacity: 0.6,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    height: 18,
  },
  iconWrap: {
    padding: 2,
  },
  nextTag: {
    backgroundColor: 'rgba(0, 255, 102, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  nextTagText: {
    fontSize: 7,
    fontWeight: '900',
    color: Colors.primary,
  },
  passedCheck: {
    padding: 2,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  timeTextNext: {
    color: Colors.primary,
    fontSize: 17,
  },
  timeTextPassed: {
    color: Colors.textDim,
  },
});
