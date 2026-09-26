import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { soundHaptics } from '../../services/soundHaptics';
import { Mail, Phone, Sparkles, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { loginWithEmail, loginWithWhatsApp, loginDemo, isLoading } = useAuthStore();
  const [authMethod, setAuthMethod] = useState<'gmail' | 'whatsapp'>('gmail');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    if (authMethod === 'gmail') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Silakan masukkan alamat email yang valid.');
        soundHaptics.warning();
        return;
      }
      soundHaptics.celebrate();
      await loginWithEmail(email, displayName);
    } else {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 9) {
        setErrorMessage('Silakan masukkan nomor WhatsApp yang valid (min. 9 digit).');
        soundHaptics.warning();
        return;
      }
      soundHaptics.celebrate();
      await loginWithWhatsApp(phone, displayName);
    }
  };

  const handleDemo = async () => {
    soundHaptics.celebrate();
    await loginDemo();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Text style={styles.appTitle}>ZAHIM</Text>
          <Text style={styles.appArabic}>زاد الهمّة</Text>
          <Text style={styles.appSub}>
            The Next-Gen Islamic Productivity & Spiritual Habit Matrix
          </Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>MASUK KE AKUN ANDA</Text>
          <Text style={styles.cardSub}>
            Silakan login terlebih dahulu untuk mulai mencatat dan mentrack rutinitas ibadah harian.
          </Text>

          {/* Method Selector Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                soundHaptics.lightTap();
                setAuthMethod('gmail');
                setErrorMessage('');
              }}
              style={[
                styles.tabBtn,
                authMethod === 'gmail' && styles.tabBtnActive,
              ]}
            >
              <Mail
                size={16}
                color={authMethod === 'gmail' ? '#00FF66' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  authMethod === 'gmail' && styles.tabBtnTextActive,
                ]}
              >
                Akun Gmail
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                soundHaptics.lightTap();
                setAuthMethod('whatsapp');
                setErrorMessage('');
              }}
              style={[
                styles.tabBtn,
                authMethod === 'whatsapp' && styles.tabBtnActive,
              ]}
            >
              <Phone
                size={16}
                color={authMethod === 'whatsapp' ? '#25D366' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  authMethod === 'whatsapp' && styles.tabBtnTextActive,
                ]}
              >
                WhatsApp
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          {authMethod === 'gmail' ? (
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>ALAMAT EMAIL GOOGLE / GMAIL</Text>
              <TextInput
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  setErrorMessage('');
                }}
                placeholder="namaanda@gmail.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />

              <Text style={styles.inputLabel}>NAMA LENGKAP PENGGUNA (OPSIONAL)</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Contoh: Ahmad Ali"
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
            </View>
          ) : (
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>NOMOR WHATSAPP AKTIF</Text>
              <TextInput
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  setErrorMessage('');
                }}
                placeholder="0812-3456-7890"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                style={styles.textInput}
              />

              <Text style={styles.inputLabel}>NAMA PANGGILAN (OPSIONAL)</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Contoh: Ahmad"
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
            </View>
          )}

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>
              {authMethod === 'gmail' ? 'Masuk dengan Gmail' : 'Masuk via WhatsApp'}
            </Text>
            <ArrowRight size={16} color="#0B0D11" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Privacy Guarantee */}
          <View style={styles.securityNote}>
            <ShieldCheck size={14} color="#00FF66" />
            <Text style={styles.securityText}>
              Data disimpan aman secara privat di perangkat antum.
            </Text>
          </View>
        </View>

        {/* Guest Demo Login Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDemo}
          style={styles.demoBtn}
        >
          <UserCheck size={16} color="#38BDF8" />
          <Text style={styles.demoBtnText}>
            Eksplor Cepat Mode Tamu (Ahmad Ali)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D11',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 102, 0.4)',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appArabic: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00FF66',
    marginTop: 2,
  },
  appSub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 320,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#11141C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00FF66',
    letterSpacing: 1.5,
  },
  cardSub: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 18,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0B0D11',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1F2432',
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#2A303C',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  textInput: {
    backgroundColor: '#07080B',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00FF66',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 18,
    shadowColor: '#00FF66',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0D11',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  securityText: {
    fontSize: 11,
    color: '#64748B',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  demoBtnText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '700',
  },
});
