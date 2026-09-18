import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  category?: 'ibadah' | 'work' | 'health' | 'learning' | 'personal';
  color?: string;
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  category,
  color,
  variant = 'subtle',
  size = 'sm',
}) => {
  const badgeColor = category ? Colors.category[category] : color || Colors.primary;

  const bgStyle =
    variant === 'solid'
      ? { backgroundColor: badgeColor }
      : { backgroundColor: `${badgeColor}1A`, borderWidth: 1, borderColor: `${badgeColor}4D` };

  const textColor = variant === 'solid' ? '#0B0D11' : badgeColor;

  return (
    <View style={[styles.badge, bgStyle, size === 'md' ? styles.badgeMd : styles.badgeSm]}>
      <Text style={[styles.label, { color: textColor }, size === 'md' ? styles.labelMd : styles.labelSm]}>
        {label}
      </Text>
    </View>
  );
};

export const WeightBadge: React.FC<{ weight: 1 | 2 | 3 }> = ({ weight }) => {
  const config = {
    3: { label: 'Bobot 3 (Fardhu)', color: Colors.primary },
    2: { label: 'Bobot 2 (Sekunder)', color: Colors.secondary },
    1: { label: 'Bobot 1 (Opsional)', color: Colors.textMuted },
  }[weight];

  return <Badge label={config.label} color={config.color} size="sm" />;
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelSm: {
    fontSize: 10,
  },
  labelMd: {
    fontSize: 12,
  },
});
