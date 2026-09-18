import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { NeonButton } from '../ui/NeonButton';
import { X, User, Camera, Check } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.displayName || 'Ahmad Ali');
  const [photoURL, setPhotoURL] = useState(
    user?.photoURL ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  );
  const [city, setCity] = useState(user?.location?.city || 'DKI Jakarta');

  const handleSave = () => {
    soundHaptics.celebrate();
    updateProfile({
      displayName: name.trim() || 'Ahmad Ali',
      photoURL: photoURL.trim(),
      location: {
        ...(user?.location || { latitude: -6.2088, longitude: 106.8456 }),
        city: city.trim() || 'DKI Jakarta',
      },
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <User size={18} color={Colors.primary} />
              <Text style={styles.title}>Pengaturan Profil Akun</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Avatar Preview */}
          <View style={styles.avatarPreviewWrap}>
            <Image source={{ uri: photoURL }} style={styles.avatarImg} />
            <View style={styles.cameraIconWrap}>
              <Camera size={13} color="#0B0D11" />
            </View>
          </View>

          {/* Name Input */}
          <Text style={styles.inputLabel}>Nama Lengkap Pengguna</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ahmad Ali"
            placeholderTextColor="#64748B"
            style={styles.textInput}
          />

          {/* Avatar URL Input */}
          <Text style={styles.inputLabel}>URL Foto Profil / Avatar</Text>
          <TextInput
            value={photoURL}
            onChangeText={setPhotoURL}
            placeholder="https://..."
            placeholderTextColor="#64748B"
            style={styles.textInput}
          />

          {/* City */}
          <Text style={styles.inputLabel}>Kota Domisili</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="DKI Jakarta"
            placeholderTextColor="#64748B"
            style={styles.textInput}
          />

          <View style={styles.footer}>
            <NeonButton
              title="Batal"
              variant="outline"
              size="md"
              onPress={onClose}
              style={{ flex: 1, marginRight: 8 }}
            />
            <NeonButton
              title="Simpan Perubahan"
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 450,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  avatarPreviewWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#1E232E',
  },
  cameraIconWrap: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2432',
  },
});
