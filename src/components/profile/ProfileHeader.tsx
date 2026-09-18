import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { Cloud, Settings, LogOut, Zap } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';
import { IslamicCalendarService } from '../../services/islamicCalendarService';

interface ProfileHeaderProps {
  onOpenSettings: () => void;
  onOpenCalendarSync?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onOpenSettings }) => {
  const { user } = useAuthStore();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [hijriStr, setHijriStr] = useState('');
  const [isFastingToday, setIsFastingToday] = useState(false);
  const [fastingTitleToday, setFastingTitleToday] = useState('');
  const [greeting, setGreeting] = useState('Selamat Malam,');

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      
      // Hours & greeting
      const hour = now.getHours();
      if (hour >= 3 && hour < 11) {
        setGreeting('Selamat Pagi,');
      } else if (hour >= 11 && hour < 15) {
        setGreeting('Selamat Siang,');
      } else if (hour >= 15 && hour < 18) {
        setGreeting('Selamat Sore,');
      } else {
        setGreeting('Selamat Malam,');
      }

      // Live time formatted with dots like screenshot: 21.35.05 WIB
      const h = hour.toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setTimeStr(`${h}.${m}.${s} WIB`);

      // Date in Indonesian
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      setDateStr(`${dayName}, ${dayNum} ${monthName} ${year}`);

      // Accurate Hijri date & Fasting info
      const hijri = IslamicCalendarService.getHijriDate(now);
      setHijriStr(hijri.formatted);

      const fasting = IslamicCalendarService.getFastingInfo(now);
      setIsFastingToday(fasting.isFastingDay);
      setFastingTitleToday(fasting.badgeLabel);
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Profile Info Row */}
      <View style={styles.topInfoRow}>
        {/* Avatar with active green dot */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user?.photoURL ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.avatarImage}
          />
          <View style={styles.activeDot} />
        </View>

        {/* Greetings and Date */}
        <View style={styles.textContainer}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.nameText}>{user?.displayName || 'Ahmad Ali'}!</Text>
            </View>
            <View style={styles.lightningWrap}>
              <Zap size={22} color="#FBBF24" fill="#FBBF24" />
            </View>
          </View>

          {/* Date & Live Clock Row */}
          <View style={styles.timeRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateText}>{dateStr || 'Kamis, 17 September 2026'}</Text>
              <Text style={styles.hijriDateText}>☪ {hijriStr || "6 Rabi'ul Akhir 1448 H"}</Text>
            </View>
            <View style={styles.liveClockWrap}>
              <View style={styles.cyanDot} />
              <Text style={styles.liveClockText}>{timeStr || '21.35.05 WIB'}</Text>
            </View>
          </View>

          {/* Today Sunnah Fasting Pill if active */}
          {isFastingToday && (
            <View style={styles.fastingPill}>
              <Text style={styles.fastingPillText}>🌙 {fastingTitleToday}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons Row Below */}
      <View style={styles.actionButtonsRow}>
        {/* Weather / Status Pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => soundHaptics.lightTap()}
          style={styles.weatherBtn}
        >
          <Cloud size={16} color={Colors.textSecondary} />
          <View style={styles.weatherDot} />
        </TouchableOpacity>

        {/* Settings / Edit Profile Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenSettings();
          }}
          style={styles.actionBtn}
        >
          <Settings size={17} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Logout / Switch Account Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenSettings();
          }}
          style={styles.actionBtn}
        >
          <LogOut size={16} color="#F87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#11141C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    overflow: 'visible',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#1E232E',
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00FF66',
    borderWidth: 2,
    borderColor: '#11141C',
  },
  textContainer: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A78BFA', // Purple neon accent as in screenshot
    letterSpacing: -0.5,
    marginTop: 1,
  },
  lightningWrap: {
    padding: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  dateCol: {
    gap: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  hijriDateText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  fastingPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
  },
  fastingPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00FF66',
  },
  liveClockWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cyanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveClockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  weatherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  weatherDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00FF66',
  },
  actionBtn: {
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 12,
    padding: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
