import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { soundHaptics } from '../../services/soundHaptics';
import { pwaInstallService } from '../../services/pwaInstallService';
import { NeonButton } from '../ui/NeonButton';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Apple,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';

interface InstallAppModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'android' | 'desktop' | 'ios';

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('android');
  const [canPrompt, setCanPrompt] = useState(pwaInstallService.getCanPrompt());
  const [isInstalled, setIsInstalled] = useState(pwaInstallService.getIsInstalled());
  const [copied, setCopied] = useState(false);
  const platformInfo = pwaInstallService.getPlatformInfo();

  useEffect(() => {
    if (platformInfo.isIOS) {
      setActiveTab('ios');
    } else if (platformInfo.isDesktop) {
      setActiveTab('desktop');
    } else {
      setActiveTab('android');
    }
  }, [visible]);

  useEffect(() => {
    const unsub = pwaInstallService.addListener(() => {
      setCanPrompt(pwaInstallService.getCanPrompt());
      setIsInstalled(pwaInstallService.getIsInstalled());
    });
    return () => {
      unsub();
    };
  }, []);

  const handleNativeInstall = async () => {
    soundHaptics.celebrate();
    const result = await pwaInstallService.promptInstall();
    if (result === 'accepted') {
      onClose();
    }
  };

  const handleCopyLink = () => {
    soundHaptics.lightTap();
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://zahim.vercel.app');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconWrap}>
                <Download size={18} color="#00FF66" />
              </View>
              <View>
                <Text style={styles.title}>Download & Install ZAHIM</Text>
                <Text style={styles.subtitle}>Gunakan sebagai aplikasi di HP & Laptop</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Quick 1-Click Install Button if browser supports native prompt */}
          {canPrompt && !isInstalled && (
            <View style={styles.quickPromptBox}>
              <View style={styles.quickPromptLeft}>
                <Zap size={18} color="#00FF66" />
                <View>
                  <Text style={styles.quickPromptTitle}>Instal Langsung Sekarang</Text>
                  <Text style={styles.quickPromptSub}>Perangkat antum mendukung instalasi 1-klik</Text>
                </View>
              </View>
              <NeonButton
                title="Instal Sekarang"
                variant="primary"
                size="sm"
                onPress={handleNativeInstall}
                icon={<Download size={14} color="#0B0D11" />}
              />
            </View>
          )}

          {isInstalled && (
            <View style={styles.installedBadge}>
              <CheckCircle2 size={16} color="#00FF66" />
              <Text style={styles.installedBadgeText}>
                Aplikasi ZAHIM sudah terpasang di perangkat ini!
              </Text>
            </View>
          )}

          {/* Device Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'android' && styles.tabBtnActive]}
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('android');
              }}
            >
              <Smartphone size={15} color={activeTab === 'android' ? '#00FF66' : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'android' && styles.tabBtnTextActive]}>
                HP Android
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'desktop' && styles.tabBtnActive]}
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('desktop');
              }}
            >
              <Laptop size={15} color={activeTab === 'desktop' ? '#00FF66' : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'desktop' && styles.tabBtnTextActive]}>
                Laptop (PC)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'ios' && styles.tabBtnActive]}
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('ios');
              }}
            >
              <Apple size={15} color={activeTab === 'ios' ? '#00FF66' : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'ios' && styles.tabBtnTextActive]}>
                iPhone (iOS)
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* ANDROID INSTRUCTIONS */}
            {activeTab === 'android' && (
              <View style={styles.tabContent}>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Buka di Chrome / Samsung Internet</Text>
                    <Text style={styles.stepDesc}>
                      Buka tautan <Text style={styles.linkHighlight}>zahim.vercel.app</Text> di browser HP Android antum.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Pilih "Tambahkan ke Layar Utama"</Text>
                    <Text style={styles.stepDesc}>
                      Ketuk menu titik tiga (⋮) di pojok kanan atas browser, lalu pilih opsi <Text style={styles.boldText}>"Instal aplikasi"</Text> atau <Text style={styles.boldText}>"Tambahkan ke Layar Utama"</Text>.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Ikon ZAHIM Siap Digunakan</Text>
                    <Text style={styles.stepDesc}>
                      Aplikasi ZAHIM akan muncul di daftar aplikasi HP antum. Membuka tanpa tab browser, responsif, dan hemat memori seperti APK native.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* DESKTOP (LAPTOP) INSTRUCTIONS */}
            {activeTab === 'desktop' && (
              <View style={styles.tabContent}>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Buka di Google Chrome atau Microsoft Edge</Text>
                    <Text style={styles.stepDesc}>
                      Buka web <Text style={styles.linkHighlight}>zahim.vercel.app</Text> pada laptop atau PC antum.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Klik Ikon Install di Address Bar atau Menu Browser</Text>
                    <Text style={styles.stepDesc}>
                      • <Text style={styles.boldText}>Cara 1:</Text> Di sebelah kanan address bar browser (dekat bintang), klik ikon komputer/unduh <Text style={styles.boldText}>"Instal ZAHIM"</Text>.{'\n'}
                      • <Text style={styles.boldText}>Cara 2:</Text> Klik menu titik tiga (⋮) di pojok kanan atas browser &gt; pilih <Text style={styles.boldText}>"Simpan dan Bagikan"</Text> (atau langsung <Text style={styles.boldText}>"Instal ZAHIM..."</Text>) &gt; klik <Text style={styles.boldText}>Instal</Text>.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Bekerja Sebagai Software Mandiri</Text>
                    <Text style={styles.stepDesc}>
                      ZAHIM akan otomatis terdaftar di Start Menu Windows / Mac dan Taskbar, dapat dibuka kapan pun dalam jendela aplikasi tersendiri!
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* IPHONE (IOS) INSTRUCTIONS */}
            {activeTab === 'ios' && (
              <View style={styles.tabContent}>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Buka di Safari iPhone</Text>
                    <Text style={styles.stepDesc}>
                      Buka alamat <Text style={styles.linkHighlight}>zahim.vercel.app</Text> menggunakan Safari di iPhone antum.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Tekan Tombol "Share" (Bagikan)</Text>
                    <Text style={styles.stepDesc}>
                      Ketuk ikon kotak berpanah ke atas di bagian bawah layar Safari.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Pilih "Tambah ke Layar Utama"</Text>
                    <Text style={styles.stepDesc}>
                      Geser ke bawah dan pilih <Text style={styles.boldText}>"Add to Home Screen (Tambah ke Layar Utama)"</Text>, lalu ketuk Tambah.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Keuntungan Memasang Aplikasi */}
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <Sparkles size={16} color="#00FF66" />
                <Text style={styles.benefitTitle}>Keunggulan Mode Terpasang (PWA):</Text>
              </View>
              <Text style={styles.benefitItem}>• Membuka aplikasi 3x lebih cepat tanpa perlu ketik alamat browser.</Text>
              <Text style={styles.benefitItem}>• Tampilan bersih fullscreen tanpa address bar pengganggu.</Text>
              <Text style={styles.benefitItem}>• Data tersinkron otomatis ke Neon Cloud antara HP dan Laptop.</Text>
              <Text style={styles.benefitItem}>• Ukuran sangat ringan (&lt; 2 MB) dan tidak membebani memori HP.</Text>
            </View>

            {/* Bagikan Link */}
            <View style={styles.shareBox}>
              <View style={styles.shareLeft}>
                <Text style={styles.shareUrlText}>https://zahim.vercel.app</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCopyLink}
                style={[styles.copyBtn, copied && styles.copyBtnDone]}
              >
                {copied ? <CheckCircle2 size={14} color="#0B0D11" /> : <Copy size={14} color="#00FF66" />}
                <Text style={[styles.copyBtnText, copied && { color: '#0B0D11' }]}>
                  {copied ? 'Tersalin!' : 'Salin Link'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Close */}
          <View style={styles.footer}>
            <NeonButton
              title="Tutup"
              variant="outline"
              size="md"
              onPress={onClose}
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
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#0E1118',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.25)',
    padding: 20,
    shadowColor: '#00FF66',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    display: 'flex',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  quickPromptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.35)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  quickPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  quickPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00FF66',
  },
  quickPromptSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  installedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  installedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF66',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#141822',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    borderColor: '#00FF66',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabBtnTextActive: {
    color: '#00FF66',
  },
  scroll: {
    flex: 1,
  },
  tabContent: {
    gap: 10,
    marginBottom: 14,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#12151E',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderWidth: 1,
    borderColor: '#00FF66',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00FF66',
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  boldText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  linkHighlight: {
    color: '#00FF66',
    fontWeight: '700',
  },
  benefitCard: {
    backgroundColor: '#0F131C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00FF66',
  },
  benefitItem: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  shareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131722',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 8,
    paddingLeft: 12,
    marginBottom: 10,
  },
  shareLeft: {
    flex: 1,
  },
  shareUrlText: {
    fontSize: 12,
    color: Colors.textDim,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  copyBtnDone: {
    backgroundColor: '#00FF66',
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00FF66',
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
