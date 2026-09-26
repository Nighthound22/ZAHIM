import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { NeonButton } from '../ui/NeonButton';
import { X, User, Camera, Check, Volume2, VolumeX, Upload, LogOut, Sparkles, Download, ExternalLink } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenInstall?: () => void;
}

const AVATAR_PRESETS = [
  {
    id: 'p1',
    title: 'Ahmad Ali',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'p2',
    title: 'Pemuda Muslim',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'p3',
    title: 'Santri',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'p4',
    title: 'Cendekia',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'p5',
    title: 'Kaligrafi Seni',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'p6',
    title: 'Kubah Nabawi',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=400&auto=format&fit=crop&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onOpenInstall }) => {
  const { user, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState(user?.displayName || 'Ahmad Ali');
  const [photoURL, setPhotoURL] = useState(
    user?.photoURL || AVATAR_PRESETS[0].url
  );
  const [city, setCity] = useState(user?.location?.city || 'DKI Jakarta');
  const [isMuted, setIsMuted] = useState(soundHaptics.getIsMuted());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setName(user.displayName || 'Ahmad Ali');
      setPhotoURL(user.photoURL || AVATAR_PRESETS[0].url);
      setCity(user.location?.city || 'DKI Jakarta');
      setIsMuted(soundHaptics.getIsMuted());
    }
  }, [visible, user]);

  const handleUploadPhoto = () => {
    soundHaptics.lightTap();
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (readerEvent: any) => {
          const img = new (window as any).Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Center square crop to exactly 400x400
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;

            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 400, 400);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setPhotoURL(dataUrl);
            soundHaptics.celebrate();
          };
          img.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  };

  const handleToggleSound = async () => {
    const next = await soundHaptics.toggleMute();
    setIsMuted(next);
  };

  const handleSave = async () => {
    soundHaptics.celebrate();
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: name.trim() || 'Ahmad Ali',
        photoURL: photoURL.trim(),
        location: {
          ...(user?.location || { latitude: -6.2088, longitude: 106.8456 }),
          city: city.trim() || 'DKI Jakarta',
        },
      });
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleLogout = async () => {
    soundHaptics.lightTap();
    onClose();
    await logout();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <User size={18} color={Colors.primary} />
              <Text style={styles.title}>Pengaturan Profil & Sistem</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Avatar Preview Section with 400x400 badge */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarPreviewWrap}>
                <Image source={{ uri: photoURL }} style={styles.avatarImg} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleUploadPhoto}
                  style={styles.cameraIconWrap}
                >
                  <Camera size={14} color="#0B0D11" />
                </TouchableOpacity>
              </View>

              <View style={styles.avatarInfoCol}>
                <View style={styles.resBadge}>
                  <Sparkles size={11} color="#00FF66" />
                  <Text style={styles.resBadgeText}>Format 400 × 400 px Square</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleUploadPhoto}
                  style={styles.uploadBtn}
                >
                  <Upload size={14} color="#00FF66" />
                  <Text style={styles.uploadBtnText}>Unggah dari Galeri</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Curated 400x400 Presets */}
            <Text style={styles.inputLabel}>PILIHAN AVATAR PRESET (400×400)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsScroll}
            >
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = photoURL === preset.url;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => {
                      soundHaptics.lightTap();
                      setPhotoURL(preset.url);
                    }}
                    style={[
                      styles.presetCard,
                      isSelected && styles.presetCardActive,
                    ]}
                  >
                    <Image source={{ uri: preset.url }} style={styles.presetImg} />
                    {isSelected && (
                      <View style={styles.selectedCheck}>
                        <Check size={10} color="#0B0D11" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Name Input */}
            <Text style={styles.inputLabel}>NAMA LENGKAP PENGGUNA</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ahmad Ali"
              placeholderTextColor="#64748B"
              style={styles.textInput}
            />

            {/* Avatar URL Input */}
            <Text style={styles.inputLabel}>ATAU INPUT URL FOTO CUSTOM</Text>
            <TextInput
              value={photoURL}
              onChangeText={setPhotoURL}
              placeholder="https://..."
              placeholderTextColor="#64748B"
              style={styles.textInput}
            />

            {/* City */}
            <Text style={styles.inputLabel}>KOTA DOMISILI</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="DKI Jakarta"
              placeholderTextColor="#64748B"
              style={styles.textInput}
            />

            {/* Global Audio Toggle (Mute / Unmute) */}
            <Text style={styles.inputLabel}>PENGATURAN SUARA SISTEM (EFEK & ADZAN)</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleSound}
              style={[
                styles.soundToggleBox,
                !isMuted ? styles.soundActive : styles.soundMuted,
              ]}
            >
              <View style={styles.soundLeft}>
                {!isMuted ? (
                  <Volume2 size={18} color="#00FF66" />
                ) : (
                  <VolumeX size={18} color="#EF4444" />
                )}
                <View>
                  <Text style={styles.soundTitle}>
                    {!isMuted ? 'Suara Sistem Aktif' : 'Mode Senyap (Muted)'}
                  </Text>
                  <Text style={styles.soundSub}>
                    {!isMuted
                      ? 'Lantunan adzan asli dan efek haptic klik berbunyi.'
                      : 'Semua audio dan adzan dimatikan (hanya getaran).'}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.togglePill,
                  !isMuted && styles.togglePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.togglePillText,
                    !isMuted && styles.togglePillTextActive,
                  ]}
                >
                  {!isMuted ? 'AKTIF' : 'SENYAP'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Install App on Device Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                soundHaptics.lightTap();
                onClose();
                onOpenInstall?.();
              }}
              style={styles.soundToggleBox}
            >
              <View style={styles.soundLeft}>
                <Download size={18} color="#00FF66" />
                <View>
                  <Text style={styles.soundTitle}>Download & Install ZAHIM</Text>
                  <Text style={styles.soundSub}>Pasang di Layar Utama HP / Desktop Laptop</Text>
                </View>
              </View>
              <ExternalLink size={16} color="#00FF66" />
            </TouchableOpacity>

            {/* Logout Account Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogout}
              style={styles.logoutBtn}
            >
              <LogOut size={16} color="#EF4444" />
              <Text style={styles.logoutText}>Keluar dari Akun (Logout)</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <NeonButton
              title="Batal"
              variant="outline"
              size="md"
              onPress={onClose}
              style={{ flex: 1, marginRight: 8 }}
            />
            <NeonButton
              title={isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              variant="primary"
              size="md"
              onPress={handleSave}
              icon={<Check size={16} color="#0B0D11" />}
              style={{ flex: 1, marginLeft: 8 }}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#11141C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 20,
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
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    marginBottom: 14,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#07080B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 14,
    marginBottom: 14,
  },
  avatarPreviewWrap: {
    position: 'relative',
    width: 76,
    height: 76,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00FF66',
    backgroundColor: '#1E232E',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  cameraIconWrap: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#00FF66',
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#07080B',
  },
  avatarInfoCol: {
    flex: 1,
    gap: 8,
  },
  resBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  resBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00FF66',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.4)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF66',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
  },
  presetsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  presetCard: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1F2432',
    overflow: 'hidden',
  },
  presetCardActive: {
    borderColor: '#00FF66',
  },
  presetImg: {
    width: '100%',
    height: '100%',
  },
  selectedCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#00FF66',
    borderRadius: 6,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#07080B',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  soundToggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 4,
  },
  soundActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.06)',
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  soundMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  soundLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  soundTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  soundSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  togglePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1E232E',
  },
  togglePillActive: {
    backgroundColor: '#00FF66',
  },
  togglePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  togglePillTextActive: {
    color: '#0B0D11',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1F2432',
  },
});
