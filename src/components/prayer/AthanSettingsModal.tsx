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
import {
  athanAudioService,
  ATHAN_OPTIONS,
  AthanToneType,
} from '../../services/athanAudioService';
import { soundHaptics } from '../../services/soundHaptics';
import { Volume2, VolumeX, Play, Square, Mic, Bell, X, Check } from 'lucide-react-native';
import { NeonButton } from '../ui/NeonButton';

interface AthanSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AthanSettingsModal: React.FC<AthanSettingsModalProps> = ({ visible, onClose }) => {
  const [selectedTone, setSelectedTone] = useState<AthanToneType>('makkah');
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayAthan, setAutoPlayAthan] = useState(true);
  const [voiceAlertH15, setVoiceAlertH15] = useState(true);

  const handlePlayPreview = (toneId: AthanToneType) => {
    soundHaptics.lightTap();
    if (isPlaying) {
      athanAudioService.stopAll();
      setIsPlaying(false);
    } else {
      setSelectedTone(toneId);
      setIsPlaying(true);
      athanAudioService.playAthanTone(toneId, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleTestVoice = () => {
    soundHaptics.lightTap();
    athanAudioService.speakBufferReminder('Ashar', 15);
  };

  const handleClose = () => {
    athanAudioService.stopAll();
    setIsPlaying(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Volume2 size={20} color="#00FF66" />
              <View>
                <Text style={styles.title}>Pengaturan Audio & Notifikasi Adzan</Text>
                <Text style={styles.subTitle}>Pilihan lantunan adzan & pengingat wudhu</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* Tone Selection Cards */}
            <Text style={styles.sectionLabel}>PILIH NADA ADZAN</Text>
            {ATHAN_OPTIONS.map((opt) => {
              const isSelected = selectedTone === opt.id;
              const isCurrentPlaying = isPlaying && isSelected;

              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTone(opt.id)}
                  style={[
                    styles.toneCard,
                    isSelected && styles.toneCardSelected,
                  ]}
                >
                  <View style={styles.toneLeft}>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleActive,
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>

                    <View style={styles.toneMeta}>
                      <Text
                        style={[
                          styles.toneTitle,
                          isSelected && { color: '#00FF66' },
                        ]}
                      >
                        {opt.title}
                      </Text>
                      <Text style={styles.toneDesc}>{opt.description}</Text>
                    </View>
                  </View>

                  {/* Play / Stop Button */}
                  <TouchableOpacity
                    onPress={() => handlePlayPreview(opt.id)}
                    style={[
                      styles.playBtn,
                      isCurrentPlaying && styles.playBtnActive,
                    ]}
                  >
                    {isCurrentPlaying ? (
                      <Square size={13} color="#0B0D11" fill="#0B0D11" />
                    ) : (
                      <Play size={13} color="#38BDF8" fill="#38BDF8" />
                    )}
                    <Text
                      style={[
                        styles.playBtnText,
                        isCurrentPlaying && { color: '#0B0D11', fontWeight: '800' },
                      ]}
                    >
                      {isCurrentPlaying ? 'Stop' : 'Putar'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}

            {/* Automation Preferences */}
            <Text style={styles.sectionLabel}>OTOMATISASI PENGINGAT</Text>

            {/* Toggle Auto-Play Athan */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                soundHaptics.lightTap();
                setAutoPlayAthan(!autoPlayAthan);
              }}
              style={styles.toggleRow}
            >
              <View style={styles.toggleTextCol}>
                <Text style={styles.toggleTitle}>Putar Adzan Otomatis</Text>
                <Text style={styles.toggleDesc}>
                  Memutar nada adzan saat waktu sholat 5 waktu tiba
                </Text>
              </View>
              <View style={[styles.switchTrack, autoPlayAthan && styles.switchTrackActive]}>
                <View style={[styles.switchThumb, autoPlayAthan && styles.switchThumbActive]} />
              </View>
            </TouchableOpacity>

            {/* Toggle Voice Alert H-15 */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                soundHaptics.lightTap();
                setVoiceAlertH15(!voiceAlertH15);
              }}
              style={styles.toggleRow}
            >
              <View style={styles.toggleTextCol}>
                <Text style={styles.toggleTitle}>Pengingat Suara Wudhu (H-15 Menit)</Text>
                <Text style={styles.toggleDesc}>
                  Panggilan suara bahasa Indonesia 15 menit sebelum adzan
                </Text>
              </View>
              <View style={[styles.switchTrack, voiceAlertH15 && styles.switchTrackActive]}>
                <View style={[styles.switchThumb, voiceAlertH15 && styles.switchThumbActive]} />
              </View>
            </TouchableOpacity>

            {/* Test Voice Reminder Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleTestVoice}
              style={styles.voiceTestBtn}
            >
              <Mic size={14} color="#38BDF8" />
              <Text style={styles.voiceTestBtnText}>Uji Suara Pengingat Wudhu H-15</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <NeonButton
              title="Simpan Pengaturan Audio"
              variant="primary"
              size="md"
              onPress={handleClose}
              icon={<Check size={15} color="#0B0D11" />}
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 540,
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
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  toneCard: {
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
  toneCardSelected: {
    borderColor: '#00FF66',
    backgroundColor: '#0E1A16',
  },
  toneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#00FF66',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF66',
  },
  toneMeta: {
    flex: 1,
  },
  toneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toneDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  playBtnActive: {
    backgroundColor: '#00FF66',
    borderColor: '#00FF66',
  },
  playBtnText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#11141C',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toggleDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E232E',
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: '#00FF66',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#94A3B8',
  },
  switchThumbActive: {
    backgroundColor: '#0B0D11',
    alignSelf: 'flex-end',
  },
  voiceTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 6,
  },
  voiceTestBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2432',
  },
});
