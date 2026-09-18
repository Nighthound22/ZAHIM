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
import { IslamicCalendarService } from '../../services/islamicCalendarService';
import { X, Moon, BookOpen, Calendar, Sparkles } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface FastingDetailModalProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: 'niat' | 'jadwal';
}

export const FastingDetailModal: React.FC<FastingDetailModalProps> = ({
  visible,
  onClose,
  initialTab = 'niat',
}) => {
  const [activeTab, setActiveTab] = useState<'niat' | 'jadwal'>(initialTab);

  const now = new Date();
  const hijri = IslamicCalendarService.getHijriDate(now);
  const fasting = IslamicCalendarService.getFastingInfo(now);
  const upcomingList = IslamicCalendarService.getUpcomingFastingDays(30);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Moon size={20} color="#00FF66" />
              <View>
                <Text style={styles.title}>Panduan & Jadwal Puasa Sunnah</Text>
                <Text style={styles.subTitle}>☪ {hijri.formatted}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Segment Tabs */}
          <View style={styles.segmentRow}>
            <TouchableOpacity
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('niat');
              }}
              style={[styles.segmentBtn, activeTab === 'niat' && styles.segmentBtnActive]}
            >
              <BookOpen size={14} color={activeTab === 'niat' ? '#0B0D11' : '#94A3B8'} />
              <Text style={[styles.segmentText, activeTab === 'niat' && styles.segmentTextActive]}>
                Niat & Doa Berbuka
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('jadwal');
              }}
              style={[styles.segmentBtn, activeTab === 'jadwal' && styles.segmentBtnActive]}
            >
              <Calendar size={14} color={activeTab === 'jadwal' ? '#0B0D11' : '#94A3B8'} />
              <Text style={[styles.segmentText, activeTab === 'jadwal' && styles.segmentTextActive]}>
                Jadwal 30 Hari
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {activeTab === 'niat' ? (
              <View style={styles.tabSection}>
                {/* Current / Sunnah Niat Card */}
                <View style={styles.niatCard}>
                  <View style={styles.cardBadgeRow}>
                    <Sparkles size={13} color="#00FF66" />
                    <Text style={styles.cardBadgeText}>Niat Puasa Sunnah Senin - Kamis</Text>
                  </View>
                  <View style={styles.arabicBox}>
                    <Text style={styles.arabicText}>
                      نَوَيْتُ صَوْمَ يَوْمِ الِاثْنَيْنِ / الْخَمِيسِ سُنَّةً لِلَّهِ تَعَالَى
                    </Text>
                  </View>
                  <Text style={styles.latinText}>
                    "Nawaitu shauma yaumil itsnaini / khamiisi sunnatan lillaahi ta'aalaa."
                  </Text>
                  <Text style={styles.transText}>
                    Artinya: "Aku berniat puasa sunnah hari Senin / Kamis karena Allah Ta'ala."
                  </Text>
                </View>

                {/* Niat Ayyamul Bidh Card */}
                <View style={styles.niatCard}>
                  <View style={styles.cardBadgeRow}>
                    <Sparkles size={13} color="#38BDF8" />
                    <Text style={[styles.cardBadgeText, { color: '#38BDF8' }]}>
                      Niat Puasa Ayyamul Bidh (13, 14, 15 Hijriah)
                    </Text>
                  </View>
                  <View style={styles.arabicBox}>
                    <Text style={styles.arabicText}>
                      نَوَيْتُ صَوْمَ أَيَّامِ الْبِيضِ سُنَّةً لِلَّهِ تَعَالَى
                    </Text>
                  </View>
                  <Text style={styles.latinText}>
                    "Nawaitu shauma ayyaamil biidhi sunnatan lillaahi ta'aalaa."
                  </Text>
                  <Text style={styles.transText}>
                    Artinya: "Aku berniat puasa sunnah hari-hari putih (Ayyamul Bidh) karena Allah Ta'ala."
                  </Text>
                </View>

                {/* Doa Berbuka Puasa Shahih */}
                <View style={[styles.niatCard, { borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
                  <View style={styles.cardBadgeRow}>
                    <Sparkles size={13} color="#FBBF24" />
                    <Text style={[styles.cardBadgeText, { color: '#FBBF24' }]}>
                      Doa Berbuka Puasa (Shahih HR. Abu Dawud)
                    </Text>
                  </View>
                  <View style={styles.arabicBox}>
                    <Text style={styles.arabicText}>
                      ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
                    </Text>
                  </View>
                  <Text style={styles.latinText}>
                    "Dzahabadh-dhama'u wabtallatil 'uruuqu wa tsabatal ajru insyaa Allah."
                  </Text>
                  <Text style={styles.transText}>
                    Artinya: "Telah hilang dahaga, telah basah urat-urat, dan telah tetap pahala insya Allah."
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.tabSection}>
                <Text style={styles.scheduleNotice}>
                  Jadwal puasa sunnah (Senin, Kamis, dan Ayyamul Bidh) selama 30 hari ke depan:
                </Text>

                {upcomingList.map((item, idx) => (
                  <View key={idx} style={styles.scheduleItem}>
                    <View style={styles.scheduleLeft}>
                      <View style={styles.dayBubble}>
                        <Text style={styles.dayBubbleText}>{item.dayName.slice(0, 3)}</Text>
                        <Text style={styles.dateBubbleText}>{item.dateStr}</Text>
                      </View>
                      <View>
                        <Text style={styles.itemTitle}>{item.fastingTitle}</Text>
                        <Text style={styles.itemHijri}>{item.hijriFormatted}</Text>
                      </View>
                    </View>

                    <View style={styles.daysUntilBadge}>
                      <Text style={styles.daysUntilText}>{item.daysUntil} hari lagi</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 580,
    maxHeight: '90%',
    backgroundColor: '#0B0D11',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#14171F',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#00FF66',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  segmentTextActive: {
    color: '#0B0D11',
    fontWeight: '800',
  },
  scrollContent: {
    flex: 1,
  },
  tabSection: {
    gap: 12,
    paddingBottom: 16,
  },
  niatCard: {
    backgroundColor: '#11141C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 16,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00FF66',
  },
  arabicBox: {
    backgroundColor: '#0E1118',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  arabicText: {
    fontSize: 18,
    lineHeight: 32,
    color: Colors.textPrimary,
    textAlign: 'right',
    fontFamily: 'serif',
  },
  latinText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#38BDF8',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  transText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#94A3B8',
  },
  scheduleNotice: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#11141C',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dayBubble: {
    backgroundColor: '#171B26',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 54,
    borderWidth: 1,
    borderColor: '#242B3D',
  },
  dayBubbleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00FF66',
  },
  dateBubbleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemHijri: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  daysUntilBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  daysUntilText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
});
