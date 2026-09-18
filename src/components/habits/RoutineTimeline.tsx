import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit } from '../../types';
import { Colors } from '../../theme/colors';
import { Badge, WeightBadge } from '../ui/Badge';
import { soundHaptics } from '../../services/soundHaptics';
import { Check, Trash2, Clock } from 'lucide-react-native';

interface RoutineTimelineProps {
  habits: Habit[];
  completedMap: Record<string, boolean>;
  onToggle: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
}

export const RoutineTimeline: React.FC<RoutineTimelineProps> = ({
  habits,
  completedMap,
  onToggle,
  onDelete,
}) => {
  // Sort habits chronologically by timeSlot
  const sortedHabits = [...habits].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const handleToggle = (habitId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      soundHaptics.celebrate();
    } else {
      soundHaptics.mediumTap();
    }
    onToggle(habitId);
  };

  return (
    <View style={styles.container}>
      {sortedHabits.map((habit, index) => {
        const isCompleted = !!completedMap[habit.id];

        return (
          <View key={habit.id} style={styles.timelineItem}>
            {/* Left Timeline Bar */}
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.nodeCircle,
                  isCompleted ? styles.nodeCompleted : styles.nodePending,
                ]}
              >
                {isCompleted ? (
                  <Check size={12} color="#0B0D11" strokeWidth={3} />
                ) : (
                  <View style={styles.nodeInnerDot} />
                )}
              </View>
              {index < sortedHabits.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    isCompleted ? styles.timelineLineActive : styles.timelineLineInactive,
                  ]}
                />
              )}
            </View>

            {/* Habit Card Content */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleToggle(habit.id, isCompleted)}
              style={[
                styles.card,
                isCompleted && styles.cardCompleted,
              ]}
            >
              <View style={styles.topRow}>
                <View style={styles.timeTag}>
                  <Clock size={12} color={Colors.textMuted} />
                  <Text style={styles.timeText}>{habit.timeSlot}</Text>
                </View>

                <View style={styles.badgeRow}>
                  <Badge label={habit.category} category={habit.category} />
                  <WeightBadge weight={habit.weight} />
                </View>
              </View>

              <Text
                style={[
                  styles.habitTitle,
                  isCompleted && styles.titleCompleted,
                ]}
              >
                {habit.title}
              </Text>

              <View style={styles.bottomRow}>
                <View style={styles.statusIndicator}>
                  <Text style={[styles.statusText, isCompleted ? styles.statusDone : styles.statusPending]}>
                    {isCompleted ? '✓ Selesai Terpenuhi' : '○ Menunggu Pelaksanaan'}
                  </Text>
                </View>

                {onDelete && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      soundHaptics.lightTap();
                      onDelete(habit.id);
                    }}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={14} color={Colors.textDim} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineLeft: {
    width: 28,
    alignItems: 'center',
    marginRight: 8,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodePending: {
    backgroundColor: '#1E232E',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  nodeCompleted: {
    backgroundColor: Colors.primary,
  },
  nodeInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textDim,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineLineInactive: {
    backgroundColor: Colors.border,
  },
  timelineLineActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.4)',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  cardCompleted: {
    backgroundColor: '#10141B',
    borderColor: 'rgba(0, 255, 102, 0.25)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0B0D11',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  titleCompleted: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  statusIndicator: {},
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusDone: {
    color: Colors.primary,
  },
  statusPending: {
    color: Colors.textDim,
  },
  deleteBtn: {
    padding: 4,
  },
});
