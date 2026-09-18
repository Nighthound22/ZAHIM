import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { CalendarService } from '../../services/calendarService';
import { useHabitStore } from '../../store/useHabitStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useAuthStore } from '../../store/useAuthStore';
import { soundHaptics } from '../../services/soundHaptics';
import { NeonButton } from '../ui/NeonButton';
import { X, Calendar, Download, CheckCircle, ShieldCheck } from 'lucide-react-native';

interface GoogleCalendarSyncModalProps {
  visible: boolean;
  onClose: () => void;
}

export const GoogleCalendarSyncModal: React.FC<GoogleCalendarSyncModalProps> = ({
  visible,
  onClose,
}) => {
  const { habits } = useHabitStore();
  const { getPrayerCalculation } = usePrayerStore();
  const { user, toggleCalendarSync } = useAuthStore();
  const [isExported, setIsExported] = useState(false);

  const prayerCalc = getPrayerCalculation();

  const handleExportICS = () => {
    soundHaptics.celebrate();
    const prayerEvents = CalendarService.createPrayerBusyEvents(prayerCalc.items);
    const habitEvents = CalendarService.createHabitEvents(habits);
    const allEvents = [...prayerEvents, ...habitEvents];

    const icsString = CalendarService.generateICS(allEvents);
    CalendarService.exportCalendarFile(icsString, 'zahim-workplace-schedule.ics');
    setIsExported(true);
    setTimeout(() => setIsExported(false), 5000);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.title}>Google Calendar & Workplace Sync</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* Account Status */}
            <View style={styles.accountBox}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{user?.displayName || 'Muslim Professional'}</Text>
                <Text style={styles.accountEmail}>{user?.email || 'mujahid.urban@zahim.id'}</Text>
              </View>
              <View style={styles.syncStatusBadge}>
                <ShieldCheck size={13} color={Colors.primary} />
                <Text style={styles.syncStatusText}>OAuth 2.0 Connected</Text>
              </View>
            </View>

            {/* Feature Description Cards */}
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🕌 Sholat Mini Out-of-Office (Busy Status)</Text>
              <Text style={styles.featureDesc}>
                Otomatis mengunci 20 menit saat waktu sholat masuk (Subuh, Dzuhur, Ashar, Maghrib, Isya) sebagai status "Busy / Sibuk" di kalender kantor agar rekan kerja tidak menjadwalkan rapat.
              </Text>
              <View style={styles.slotPreviewRow}>
                {prayerCalc.items
                  .filter((p) => p.name !== 'Sunrise')
                  .map((p) => (
                    <View key={p.name} style={styles.prayerSlotBadge}>
                      <Text style={styles.slotName}>{p.displayName}</Text>
                      <Text style={styles.slotTime}>{p.time}</Text>
                    </View>
                  ))}
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>⚡ Habit & Deep Work Timeblocking</Text>
              <Text style={styles.featureDesc}>
                Mengekspor jadwal kebiasaan harian (misal: Deep Work, Olahraga, Tilawah) sebagai agenda terstruktur ke Google Calendar antum.
              </Text>
              <Text style={styles.habitsCountText}>
                {habits.length} blok kebiasaan harian siap disinkronisasi.
              </Text>
            </View>

            {isExported && (
              <View style={styles.successBanner}>
                <CheckCircle size={16} color="#0B0D11" />
                <Text style={styles.successText}>
                  File .ics berhasil diunduh! Buka file tersebut untuk memasukkan jadwal ke Google Calendar / Outlook secara instan.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <NeonButton
              title="Ekspor File Kalender (.ICS)"
              variant="primary"
              size="md"
              onPress={handleExportICS}
              icon={<Download size={16} color="#0B0D11" />}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 550,
    maxHeight: '90%',
    backgroundColor: Colors.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    marginBottom: 16,
  },
  accountBox: {
    backgroundColor: '#0B0D11',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  accountInfo: {},
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  accountEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  syncStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  syncStatusText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  featureCard: {
    backgroundColor: '#0B0D11',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  slotPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  prayerSlotBadge: {
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  slotName: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
  },
  slotTime: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  habitsCountText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  successText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B0D11',
    flex: 1,
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
