import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { usePrayerStore } from '../../store/usePrayerStore';
import { Clock, MapPin, Bell, Moon, ShieldAlert, Compass, Volume2 } from 'lucide-react-native';

interface PrayerBannerProps {
  onOpenCitySelector: () => void;
  onOpenQibla?: () => void;
  onOpenAthanSettings?: () => void;
}

export const PrayerBanner: React.FC<PrayerBannerProps> = ({
  onOpenCitySelector,
  onOpenQibla,
  onOpenAthanSettings,
}) => {
  const { selectedCity, autoDND, isDNDActiveNow, getPrayerCalculation } = usePrayerStore();
  const [countdown, setCountdown] = useState('');
  const [prayerData, setPrayerData] = useState(getPrayerCalculation());

  useEffect(() => {
    const updateCountdown = () => {
      const calc = getPrayerCalculation();
      setPrayerData(calc);

      if (calc.nextPrayer) {
        const diffMs = calc.nextPrayer.dateObj.getTime() - new Date().getTime();
        if (diffMs > 0) {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
          setCountdown(
            `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
              .toString()
              .padStart(2, '0')}`
          );
        } else {
          setCountdown('00:00:00');
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const { nextPrayer, isBufferTime, bufferMinutesRemaining } = prayerData;

  return (
    <View style={styles.container}>
      {/* Top Location & Auto-DND Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenCitySelector}
          style={styles.locationBtn}
        >
          <MapPin size={13} color={Colors.primary} />
          <Text style={styles.cityText}>{selectedCity.name}</Text>
          <Text style={styles.changeCityText}>(Ubah)</Text>
        </TouchableOpacity>

        <View style={styles.rightBadges}>
          {isDNDActiveNow ? (
            <View style={styles.dndActiveBadge}>
              <Moon size={11} color="#0B0D11" />
              <Text style={styles.dndActiveText}>Auto-DND Senyap</Text>
            </View>
          ) : (
            autoDND && (
              <View style={styles.dndBadge}>
                <ShieldAlert size={11} color={Colors.secondary} />
                <Text style={styles.dndText}>Auto-DND Siaga</Text>
              </View>
            )
          )}
        </View>
      </View>

      {/* Main Countdown & Next Prayer Display */}
      <View style={styles.mainInfo}>
        <View>
          <Text style={styles.nextLabel}>MENUJU SHOLAT BERIKUTNYA</Text>
          <Text style={styles.prayerName}>{nextPrayer?.displayName || 'Subuh'}</Text>
          <View style={styles.timeScheduleRow}>
            <Clock size={12} color={Colors.textMuted} />
            <Text style={styles.scheduledTime}>{nextPrayer?.time || '04:45'} WIB</Text>
          </View>
        </View>

        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{countdown || '--:--:--'}</Text>
          <Text style={styles.timerSub}>Waktu Tersisa</Text>
        </View>
      </View>

      {/* Quick Action Shortcuts: Qibla Compass & Athan Audio Settings */}
      <View style={styles.quickActionRow}>
        {onOpenQibla && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenQibla}
            style={styles.quickToolBtn}
          >
            <Compass size={13} color="#00FF66" />
            <Text style={styles.quickToolText}>Arah Kiblat</Text>
          </TouchableOpacity>
        )}

        {onOpenAthanSettings && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenAthanSettings}
            style={styles.quickToolBtn}
          >
            <Volume2 size={13} color="#38BDF8" />
            <Text style={[styles.quickToolText, { color: '#38BDF8' }]}>Suara Adzan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Preparation Buffer Notification Banner (H-15) */}
      {isBufferTime && (
        <View style={styles.bufferAlert}>
          <Bell size={14} color="#0B0D11" />
          <Text style={styles.bufferAlertText}>
            Waktu {nextPrayer?.displayName} {bufferMinutesRemaining} menit lagi. Bersiap wudhu & rapikan pekerjaan!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#14171F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0B0D11',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  changeCityText: {
    fontSize: 10,
    color: Colors.primary,
  },
  rightBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  dndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  dndText: {
    fontSize: 10,
    color: Colors.secondary,
    fontWeight: '600',
  },
  dndActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dndActiveText: {
    fontSize: 10,
    color: '#0B0D11',
    fontWeight: '800',
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  prayerName: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  timeScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduledTime: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  timerBox: {
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  timerSub: {
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  quickToolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quickToolText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00FF66',
  },
  bufferAlert: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bufferAlertText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B0D11',
    flex: 1,
  },
});
