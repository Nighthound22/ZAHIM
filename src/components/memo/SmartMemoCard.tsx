import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SmartMemo } from '../../types';
import { Colors } from '../../theme/colors';
import { Check, Trash2, Calendar, Award, Sparkles } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface SmartMemoCardProps {
  memo: SmartMemo;
  onToggleMilestone: (memoId: string, milestoneId: string) => void;
  onDeleteMemo: (memoId: string) => void;
}

export const SmartMemoCard: React.FC<SmartMemoCardProps> = ({
  memo,
  onToggleMilestone,
  onDeleteMemo,
}) => {
  const completedMilestones = memo.milestones.filter((m) => m.isCompleted).length;
  const totalMilestones = memo.milestones.length;
  const totalPoints = memo.milestones.reduce((acc, m) => acc + (m.isCompleted ? m.pointValue : 0), 0);
  const maxPoints = memo.milestones.reduce((acc, m) => acc + m.pointValue, 0);

  const handleMilestoneToggle = (milestoneId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      soundHaptics.celebrate();
    } else {
      soundHaptics.mediumTap();
    }
    onToggleMilestone(memo.id, milestoneId);
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.memoTitle}>{memo.title}</Text>
          {memo.dueDate && (
            <View style={styles.dueBadge}>
              <Calendar size={11} color={Colors.textMuted} />
              <Text style={styles.dueText}>Batas: {memo.dueDate}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            soundHaptics.lightTap();
            onDeleteMemo(memo.id);
          }}
          style={styles.deleteBtn}
        >
          <Trash2 size={15} color={Colors.textDim} />
        </TouchableOpacity>
      </View>

      {/* Memo Content */}
      <Text style={styles.memoContent}>{memo.content}</Text>

      {/* Milestones Checklist */}
      <View style={styles.milestonesSection}>
        <View style={styles.milestoneHeader}>
          <Text style={styles.milestoneSectionTitle}>
            Milestones ({completedMilestones}/{totalMilestones})
          </Text>
          <View style={styles.pointsBadge}>
            <Award size={12} color={Colors.primary} />
            <Text style={styles.pointsBadgeText}>
              +{totalPoints}/{maxPoints} Bonus XP
            </Text>
          </View>
        </View>

        {memo.milestones.map((milestone) => (
          <TouchableOpacity
            key={milestone.id}
            activeOpacity={0.7}
            onPress={() => handleMilestoneToggle(milestone.id, milestone.isCompleted)}
            style={[
              styles.milestoneItem,
              milestone.isCompleted && styles.milestoneItemDone,
            ]}
          >
            <View
              style={[
                styles.checkbox,
                milestone.isCompleted && styles.checkboxActive,
              ]}
            >
              {milestone.isCompleted && <Check size={12} color="#0B0D11" strokeWidth={3} />}
            </View>

            <Text
              style={[
                styles.milestoneText,
                milestone.isCompleted && styles.milestoneTextDone,
              ]}
            >
              {milestone.text}
            </Text>

            <View style={styles.pointTag}>
              <Sparkles size={10} color={Colors.secondary} />
              <Text style={styles.pointTagText}>+{milestone.pointValue} XP</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleWrap: {
    flex: 1,
  },
  memoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dueText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  memoContent: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  milestonesSection: {
    backgroundColor: '#0B0D11',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  milestoneSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.25)',
  },
  pointsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  milestoneItemDone: {
    opacity: 0.7,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14171F',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  milestoneText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  milestoneTextDone: {
    color: Colors.textDim,
    textDecorationLine: 'line-through',
  },
  pointTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  pointTagText: {
    fontSize: 9,
    color: Colors.secondary,
    fontWeight: '700',
  },
});
