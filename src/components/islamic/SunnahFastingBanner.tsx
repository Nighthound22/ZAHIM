import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { IslamicCalendarService } from '../../services/islamicCalendarService';
import { useHabitStore } from '../../store/useHabitStore';
import { soundHaptics } from '../../services/soundHaptics';
import { Moon, Calendar, BookOpen, CheckCircle, Sparkles } from 'lucide-react-native';

interface SunnahFastingBannerProps {
  onOpenDetailModal: () => void;
  onOpenUpcomingModal: () => void;
}

export const SunnahFastingBanner: React.FC<SunnahFastingBannerProps> = ({
  onOpenDetailModal,
  onOpenUpcomingModal,
}) => {
  const { habits, logs, toggleHabit, addHabit, selectedDate } = useHabitStore();

  const now = new Date();
  const hijri = IslamicCalendarService.getHijriDate(now);
  const fasting = IslamicCalendarService.getFastingInfo(now);
  const upcomingList = IslamicCalendarService.getUpcomingFastingDays(30);
  const nextFasting = upcomingList[0];

  // Check if "Puasa Sunnah" habit exists and is completed today
  const fastingHabit = habits.find((h) =>
    h.title.toLowerCase().includes('puasa')
  );

  const isFastingCompleted = fastingHabit
    ? !!logs[`${selectedDate}_${fastingHabit.id}`]?.isCompleted
    : false;

  const handleToggleFasting = () => {
    soundHaptics.celebrate();
    if (fastingHabit) {
      toggleHabit(fastingHabit.id, selectedDate);
    } else {
      // Add habit if not yet exists
      addHabit({
        title: fasting.title,
        category: 'ibadah',
        timeSlot: '04:30',
        weight: 3,
        frequency: 'custom',
        color: '#00FF66',
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        fasting.isFastingDay ? styles.containerActive : styles.containerNormal,
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.crescentWrap}>
          <Moon size={20} color="#00FF66" fill="rgba(0, 255, 102, 0.2)" />
        </View>

        <View style={styles.titleCol}>
          <View style={styles.badgeRow}>
            <View style={styles.hijriBadge}>
              <Text style={styles.hijriBadgeText}>☪ {hijri.formatted}</Text>
            </View>

            {fasting.isFastingDay && (
              <View style={styles.sunnahBadge}>
                <Sparkles size={10} color="#0B0D11" />
                <Text style={styles.sunnahBadgeText}>{fasting.badgeLabel}</Text>
              </View>
            )}
          </View>

          <Text style={styles.mainTitle}>
            {fasting.isFastingDay
              ? fasting.title
              : nextFasting
              ? `Puasa Berikutnya: ${nextFasting.fastingTitle}`
              : 'Jadwal Puasa Sunnah'}
          </Text>

          <Text style={styles.descText}>
            {fasting.isFastingDay
              ? fasting.hadits
              : nextFasting
              ? `Jadwal terdekat: ${nextFasting.dayName}, ${nextFasting.dateStr} (${nextFasting.daysUntil} hari lagi)`
              : 'Mari jaga konsistensi ibadah sunnah untuk meraih ridha Allah.'}
          </Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        {/* Niat & Doa Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenDetailModal();
          }}
          style={styles.actionBtnOutline}
        >
          <BookOpen size={14} color="#38BDF8" />
          <Text style={styles.actionBtnOutlineText}>Niat & Doa Buka</Text>
        </TouchableOpacity>

        {/* Upcoming Fasting Days Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenUpcomingModal();
          }}
          style={styles.actionBtnOutline}
        >
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.actionBtnTextGray}>Jadwal Sebulan</Text>
        </TouchableOpacity>

        {/* Record/Check Fasting Today Button */}
        {fasting.isFastingDay && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggleFasting}
            style={[
              styles.actionBtnSolid,
              isFastingCompleted && styles.actionBtnDone,
            ]}
          >
            <CheckCircle size={14} color="#0B0D11" />
            <Text style={styles.actionBtnSolidText}>
              {isFastingCompleted ? 'Sudah Berpuasa ✓' : 'Catat Puasa Hari Ini'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  containerActive: {
    backgroundColor: '#0F1A17',
    borderColor: 'rgba(0, 255, 102, 0.35)',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  containerNormal: {
    backgroundColor: '#11141C',
    borderColor: '#1F2432',
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  crescentWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 102, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  hijriBadge: {
    backgroundColor: '#171B26',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#242B3D',
  },
  hijriBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  sunnahBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00FF66',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sunnahBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B0D11',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  descText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  actionBtnOutlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  actionBtnTextGray: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionBtnSolid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00FF66',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginLeft: 'auto',
  },
  actionBtnDone: {
    backgroundColor: 'rgba(0, 255, 102, 0.25)',
    borderWidth: 1,
    borderColor: '#00FF66',
  },
  actionBtnSolidText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B0D11',
  },
});
