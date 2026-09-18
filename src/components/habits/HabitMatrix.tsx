import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Habit } from '../../types';
import { useHabitStore, WeekDayInfo } from '../../store/useHabitStore';
import { Sparkles, Plus, Search, Flame, Check } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface HabitMatrixProps {
  onOpenAddHabit: () => void;
}

const CATEGORIES = [
  { key: 'all', label: 'Semua' },
  { key: 'ibadah', label: 'Ibadah' },
  { key: 'work', label: 'Kerja' },
  { key: 'personal', label: 'Personal' },
  { key: 'learning', label: 'Belajar' },
];

export const HabitMatrix: React.FC<HabitMatrixProps> = ({ onOpenAddHabit }) => {
  const {
    habits,
    logs,
    toggleHabit,
    getHabitStreak,
    getHabitWeeklyPercentage,
    getCurrentWeekDates,
  } = useHabitStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const weekDays: WeekDayInfo[] = getCurrentWeekDates();
  const weekDateStrings = weekDays.map((w) => w.dateStr);

  // Filter habits by category and search
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      habit.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = habit.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleDay = (habitId: string, dateStr: string) => {
    const key = `${dateStr}_${habitId}`;
    const currentlyDone = !!logs[key]?.isCompleted;
    if (!currentlyDone) {
      soundHaptics.celebrate();
    } else {
      soundHaptics.mediumTap();
    }
    toggleHabit(habitId, dateStr);
  };

  const getCategoryColor = (habit: Habit) => {
    if (habit.color) return habit.color;
    switch (habit.category) {
      case 'ibadah':
        return '#00FF66';
      case 'work':
        return '#A855F7';
      case 'personal':
        return '#EF4444';
      case 'health':
        return '#F59E0B';
      case 'learning':
        return '#38BDF8';
      default:
        return '#00FF66';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Card */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.sparkleWrap}>
            <Sparkles size={18} color="#A78BFA" />
          </View>
          <View>
            <Text style={styles.title}>Pelacak Kebiasaan (Habit Matrix)</Text>
            <Text style={styles.subTitle}>
              Konsistensi mingguan & perhitungan streak beruntun harian.
            </Text>
          </View>
        </View>

        {/* Gradient-styled Add Habit Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenAddHabit();
          }}
          style={styles.gradientAddBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.gradientAddBtnText}>Tambah Kebiasaan</Text>
        </TouchableOpacity>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.7}
                onPress={() => {
                  soundHaptics.lightTap();
                  setSelectedCategory(cat.key);
                }}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={15} color="#64748B" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari kebiasaan..."
            placeholderTextColor="#64748B"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Horizontal Matrix Table View (Scrollable horizontally for mobile) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
        <View style={styles.matrixTable}>
          {/* Table Header Row */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.columnHeader, styles.colHabitTitle]}>
              Kebiasaan & Kategori
            </Text>
            <Text style={[styles.columnHeader, styles.colStreak]}>Streak</Text>

            {weekDays.map((day) => (
              <View
                key={day.dateStr}
                style={[
                  styles.dayColumnHeader,
                  day.isToday && styles.dayColumnHeaderToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayNameText,
                    day.isToday && { color: Colors.primary, fontWeight: '900' },
                  ]}
                >
                  {day.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNumText,
                    day.isToday && { color: Colors.primary, fontWeight: '900' },
                  ]}
                >
                  {day.dayNumber}
                </Text>
              </View>
            ))}
          </View>

          {/* Table Body Rows */}
          {filteredHabits.map((habit) => {
            const streak = getHabitStreak(habit.id);
            const weeklyPercent = getHabitWeeklyPercentage(habit.id, weekDateStrings);
            const dotColor = getCategoryColor(habit);

            return (
              <View key={habit.id} style={styles.tableRow}>
                {/* Habit & Category Info Column */}
                <View style={[styles.rowCell, styles.colHabitTitle]}>
                  <View style={styles.habitTitleRow}>
                    <View style={[styles.categoryDot, { backgroundColor: dotColor }]} />
                    <View>
                      <Text style={styles.habitNameText}>{habit.title}</Text>
                      <View style={styles.habitMetaRow}>
                        <View style={styles.catBadge}>
                          <Text style={styles.catBadgeText}>
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Text>
                        </View>
                        {/* Weekly Percentage Tracker */}
                        <Text
                          style={[
                            styles.weeklyPercentText,
                            weeklyPercent >= 50
                              ? { color: '#00FF66' }
                              : weeklyPercent > 0
                              ? { color: '#FBBF24' }
                              : { color: '#64748B' },
                          ]}
                        >
                          {weeklyPercent}% Minggu Ini
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Streak Badge Column */}
                <View style={[styles.rowCell, styles.colStreak]}>
                  <View style={styles.streakPill}>
                    <Flame size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.streakText}>{streak}d</Text>
                  </View>
                </View>

                {/* 7 Days Columns with Interactive Checkboxes */}
                {weekDays.map((day) => {
                  const key = `${day.dateStr}_${habit.id}`;
                  const isDone = !!logs[key]?.isCompleted;
                  const activeColor =
                    habit.category === 'ibadah' ? '#00FF66' : '#38BDF8';

                  return (
                    <View key={day.dateStr} style={styles.dayCell}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleDay(habit.id, day.dateStr)}
                        style={[
                          styles.checkCircle,
                          isDone && {
                            backgroundColor: activeColor,
                            borderColor: activeColor,
                            shadowColor: activeColor,
                            shadowOpacity: 0.5,
                            shadowRadius: 6,
                          },
                        ]}
                      >
                        {isDone ? (
                          <Check size={14} color="#0B0D11" strokeWidth={3} />
                        ) : (
                          <View style={styles.checkDotHollow} />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#11141C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 18,
    marginBottom: 16,
  },
  header: {
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  sparkleWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  gradientAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 11,
    marginBottom: 14,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  gradientAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryContent: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#242B3D',
  },
  categoryPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#8B5CF6',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  tableScroll: {
    marginTop: 4,
  },
  matrixTable: {
    minWidth: 620,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2432',
  },
  columnHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colHabitTitle: {
    width: 210,
  },
  colStreak: {
    width: 70,
    textAlign: 'center',
  },
  dayColumnHeader: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayColumnHeaderToday: {
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
    borderRadius: 8,
    paddingVertical: 2,
  },
  dayNameText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  dayNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  rowCell: {
    justifyContent: 'center',
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  habitNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  habitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  catBadge: {
    backgroundColor: '#171B26',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },
  weeklyPercentText: {
    fontSize: 10,
    fontWeight: '600',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  dayCell: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#171B26',
    borderWidth: 1.5,
    borderColor: '#242B3D',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  checkDotHollow: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#333D52',
  },
});
