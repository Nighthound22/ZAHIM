import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { soundHaptics } from '../../services/soundHaptics';
import { Calendar, Moon, Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react-native';

interface TopNavProps {
  onOpenCalendarSync: () => void;
  onOpenDhikr: () => void;
  onOpenSettings?: () => void;
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  isLargeScreen: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenCalendarSync,
  onOpenDhikr,
  onOpenSettings,
  isMobileSimulator,
  onToggleSimulator,
  isLargeScreen,
}) => {
  const { user } = useAuthStore();
  const [isMuted, setIsMuted] = useState(soundHaptics.getIsMuted());

  useEffect(() => {
    const unsubscribe = soundHaptics.addListener((muted) => setIsMuted(muted));
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={[styles.container, !isLargeScreen && styles.containerMobile]}>
      {/* Brand Identity */}
      <View style={styles.brandCol}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../../assets/logo.png')}
            style={isLargeScreen ? styles.logoImage : styles.logoImageMobile}
            resizeMode="cover"
          />
          <View>
            <View style={styles.titleRow}>
              <Text style={[styles.brandTitle, !isLargeScreen && styles.brandTitleMobile]}>ZAHIM</Text>
              <Text style={[styles.brandArabic, !isLargeScreen && styles.brandArabicMobile]}>زاد الهمة</Text>
            </View>
            {isLargeScreen && (
              <Text style={styles.tagline}>Elevate Your Daily Routine, Master Your Akhirah & Dunya</Text>
            )}
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

        {/* Global Sound Mute / Unmute Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => soundHaptics.toggleMute()}
          style={[
            styles.actionBtn,
            !isLargeScreen && styles.actionBtnCompact,
            isMuted && styles.actionBtnMuted,
          ]}
          accessibilityLabel={isMuted ? 'Nyalakan Suara' : 'Matikan Suara (Mode Senyap)'}
        >
          {!isMuted ? (
            <Volume2 size={15} color="#00FF66" />
          ) : (
            <VolumeX size={15} color="#EF4444" />
          )}
          {isLargeScreen && (
            <Text style={[styles.actionBtnText, isMuted && { color: '#EF4444' }]}>
              {!isMuted ? 'Suara On' : 'Senyap'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Quick Dhikr Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenDhikr();
          }}
          style={[styles.actionBtn, !isLargeScreen && styles.actionBtnCompact]}
          accessibilityLabel="Dzikir"
        >
          <Moon size={15} color={Colors.primary} />
          {isLargeScreen && <Text style={styles.actionBtnText}>Dzikir</Text>}
        </TouchableOpacity>

        {/* Calendar Sync Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenCalendarSync();
          }}
          style={[styles.calendarBtn, !isLargeScreen && styles.calendarBtnCompact]}
          accessibilityLabel="Sync Kalender"
        >
          <Calendar size={15} color="#0B0D11" />
          {isLargeScreen && <Text style={styles.calendarBtnText}>Sync Kalender</Text>}
        </TouchableOpacity>

        {/* User Avatar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenSettings}
          style={[styles.userAvatar, !isLargeScreen && styles.userAvatarMobile]}
        >
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImgSmall} />
          ) : (
            <Text style={styles.avatarInitials}>
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'HA'}
            </Text>
          )}
        </TouchableOpacity>
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
  containerMobile: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  brandCol: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 102, 0.4)',
  },
  logoImageMobile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 102, 0.4)',
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
  brandTitleMobile: {
    fontSize: 16,
    letterSpacing: 1,
  },
  brandArabic: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  brandArabicMobile: {
    fontSize: 13,
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
  actionBtnCompact: {
    paddingHorizontal: 9,
    paddingVertical: 7,
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
  calendarBtnCompact: {
    paddingHorizontal: 8,
    paddingVertical: 7,
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
    overflow: 'hidden',
  },
  userAvatarMobile: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 2,
    overflow: 'hidden',
  },
  avatarInitials: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  avatarImgSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  actionBtnMuted: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
});
