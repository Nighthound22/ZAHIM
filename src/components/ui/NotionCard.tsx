import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../theme/colors';

interface NotionCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlight?: 'primary' | 'secondary' | 'none';
  elevated?: boolean;
}

export const NotionCard: React.FC<NotionCardProps> = ({
  children,
  style,
  highlight = 'none',
  elevated = false,
}) => {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        highlight === 'primary' && styles.highlightPrimary,
        highlight === 'secondary' && styles.highlightSecondary,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginVertical: 6,
  },
  elevated: {
    backgroundColor: Colors.bgCardElevated,
  },
  highlightPrimary: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  highlightSecondary: {
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
});
