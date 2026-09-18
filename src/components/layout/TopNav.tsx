import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { soundHaptics } from '../../services/soundHaptics';
import { Calendar, Moon, Smartphone, Monitor } from 'lucide-react-native';

interface TopNavProps {
  onOpenCalendarSync: () => void;
  onOpenDhikr: () => void;
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  isLargeScreen: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenCalendarSync,
  onOpenDhikr,
  isMobileSimulator,
  onToggleSimulator,
  isLargeScreen,
}) => {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      {/* Brand Identity */}
      <View style={styles.brandCol}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>ز</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>ZAHIM</Text>
              <Text style={styles.brandArabic}>زاد الهمة</Text>
            </View>
            <Text style={styles.tagline}>Elevate Your Daily Routine, Master Your Akhirah & Dunya</Text>
          </View>
        </View>
      </View>

      {/* Right Controls */}
      <View style={styles.rightActions}>
        {/* Toggle Mobile / Laptop View Preview (on Laptop) */}
        {isLargeScreen && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              soundHaptics.lightTap();
              onToggleSimulator();
            }}
            style={[
              styles.previewToggleBtn,
              isMobileSimulator && styles.previewToggleBtnActive,
            ]}
          >
            {isMobileSimulator ? (
              <Monitor size={14} color={Colors.primary} />
            ) : (
              <Smartphone size={14} color={Colors.secondary} />
            )}
            <Text
              style={[
                styles.previewToggleText,
                isMobileSimulator ? { color: Colors.primary } : { color: Colors.secondary },
              ]}
            >
              {isMobileSimulator ? 'Tampilan Laptop (Desktop)' : 'Simulasi HP (Mobile)'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Quick Dhikr Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenDhikr();
          }}
          style={styles.actionBtn}
        >
          <Moon size={15} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Dzikir</Text>
        </TouchableOpacity>

        {/* Calendar Sync Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenCalendarSync();
          }}
          style={styles.calendarBtn}
        >
          <Calendar size={15} color="#0B0D11" />
          <Text style={styles.calendarBtnText}>Sync Kalender</Text>
        </TouchableOpacity>

        {/* User Avatar */}
        <View style={styles.userAvatar}>
          <Text style={styles.avatarInitials}>HA</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0D11',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  brandCol: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
    marginTop: -2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  brandArabic: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  tagline: {
    fontSize: 10,
    color: Colors.textDim,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  previewToggleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
  },
  previewToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  calendarBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B0D11',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E232E',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  avatarInitials: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
});
