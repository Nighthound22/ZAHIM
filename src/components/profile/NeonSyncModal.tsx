import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { neonSyncService, SyncHealthResponse } from '../../services/neonSyncService';
import { soundHaptics } from '../../services/soundHaptics';
import {
  X,
  Database,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react-native';

interface NeonSyncModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NeonSyncModal: React.FC<NeonSyncModalProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<SyncHealthResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlConfig, setShowUrlConfig] = useState(false);

  useEffect(() => {
    if (visible) {
      loadInitialInfo();
    }
  }, [visible]);

  const loadInitialInfo = async () => {
    const timestamp = await neonSyncService.getLastSyncedAt();
    setLastSync(timestamp);
    const url = await neonSyncService.getApiBaseUrl();
    setCustomUrl(url);
  };

  const handleTestConnection = async () => {
    soundHaptics.lightTap();
    setLoading(true);
    setStatusMessage('Menghubungi Neon PostgreSQL...');
    setStatusType('info');

    const result = await neonSyncService.checkConnection();
    setHealthStatus(result);
    setLoading(false);

    if (result.success) {
      soundHaptics.celebrate();
      setStatusMessage(`Terhubung ke database: ${result.database || 'neondb'} (PostgreSQL)`);
      setStatusType('success');
    } else {
      soundHaptics.warning();
      setStatusMessage(result.message);
      setStatusType('error');
    }
  };

  const handleUpload = async () => {
    soundHaptics.lightTap();
    setLoading(true);
    setStatusMessage('Mengunggah data ke Neon Cloud...');
    setStatusType('info');

    const result = await neonSyncService.uploadToCloud();
    setLoading(false);

    if (result.success) {
      soundHaptics.celebrate();
      setLastSync(result.syncedAt || new Date().toISOString());
      setStatusMessage('Data berhasil disimpan aman di Neon Database!');
      setStatusType('success');
    } else {
      soundHaptics.warning();
      setStatusMessage(result.message);
      setStatusType('error');
    }
  };

  const handleDownload = async () => {
    soundHaptics.lightTap();
    setLoading(true);
    setStatusMessage('Mengunduh & memulihkan data dari Cloud...');
    setStatusType('info');

    const result = await neonSyncService.downloadFromCloud();
    setLoading(false);

    if (result.success) {
      soundHaptics.celebrate();
      setLastSync(result.syncedAt || new Date().toISOString());
      setStatusMessage('Data berhasil dipulihkan dari Neon Database!');
      setStatusType('success');
    } else {
      soundHaptics.warning();
      setStatusMessage(result.message);
      setStatusType('error');
    }
  };

  const handleSaveUrl = async () => {
    soundHaptics.lightTap();
    await neonSyncService.setCustomApiUrl(customUrl);
    setShowUrlConfig(false);
    setStatusMessage('Endpoint URL berhasil diperbarui.');
    setStatusType('info');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Database size={20} color="#00FF66" />
              </View>
              <View>
                <Text style={styles.title}>Neon Cloud Sync ⚡</Text>
                <Text style={styles.subtitle}>Serverless PostgreSQL Backup & Multi-Device</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Project Info Banner */}
            <View style={styles.projectCard}>
              <View style={styles.projectTopRow}>
                <View style={styles.neonBadge}>
                  <View style={styles.neonDot} />
                  <Text style={styles.neonBadgeText}>NEON TECH SERVERLESS</Text>
                </View>
                <Text style={styles.branchText}>br-tiny-violet</Text>
              </View>

              <Text style={styles.projectName}>sparkling-feather-82050623</Text>
              <Text style={styles.projectDesc}>
                PostgreSQL Cloud tersinkronisasi otomatis dengan API Serverless Vercel. Data habit, dzikir, memo & tilawah tersimpan aman.
              </Text>

              <View style={styles.syncMetaRow}>
                <Text style={styles.syncMetaLabel}>Terakhir Sinkron:</Text>
                <Text style={styles.syncMetaValue}>
                  {lastSync ? new Date(lastSync).toLocaleString('id-ID') : 'Belum pernah sinkron'}
                </Text>
              </View>
            </View>

            {/* Status Alert Banner */}
            {statusMessage && (
              <View
                style={[
                  styles.statusBox,
                  statusType === 'success' && styles.statusBoxSuccess,
                  statusType === 'error' && styles.statusBoxError,
                ]}
              >
                {statusType === 'success' ? (
                  <CheckCircle2 size={16} color="#00FF66" />
                ) : statusType === 'error' ? (
                  <AlertCircle size={16} color="#FF4D4D" />
                ) : (
                  <RefreshCw size={16} color={Colors.primary} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    statusType === 'success' && { color: '#00FF66' },
                    statusType === 'error' && { color: '#FF7070' },
                  ]}
                >
                  {statusMessage}
                </Text>
              </View>
            )}

            {/* Action Buttons Grid */}
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.uploadBtn, loading && styles.btnDisabled]}
                onPress={handleUpload}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#0B0D11" />
                ) : (
                  <CloudUpload size={20} color="#0B0D11" />
                )}
                <Text style={styles.uploadBtnText}>Sinkronkan ke Cloud</Text>
                <Text style={styles.btnSubtext}>Upload data lokal ke Neon</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.downloadBtn, loading && styles.btnDisabled]}
                onPress={handleDownload}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#00FF66" />
                ) : (
                  <CloudDownload size={20} color="#00FF66" />
                )}
                <Text style={styles.downloadBtnText}>Pulihkan dari Cloud</Text>
                <Text style={styles.btnSubtext}>Download data dari Neon</Text>
              </TouchableOpacity>
            </View>

            {/* Test Connection Button */}
            <TouchableOpacity
              style={styles.testBtn}
              onPress={handleTestConnection}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Server size={16} color={Colors.textSecondary} />
              <Text style={styles.testBtnText}>Tes Koneksi & Inisialisasi Database</Text>
            </TouchableOpacity>

            {/* Security & Offline-First Note */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <ShieldCheck size={16} color="#00FF66" />
                <Text style={styles.infoTitle}>Aman & Tetap Berfungsi Offline</Text>
              </View>
              <Text style={styles.infoContent}>
                • Password database Neon disimpan aman di Vercel Environment Variables (`DATABASE_URL`).{'\n'}
                • ZAHIM tetap bekerja 100% offline di masjid. Begitu terhubung internet, data otomatis diselaraskan.
              </Text>
            </View>

            {/* Endpoint Configuration Accordion */}
            <TouchableOpacity
              style={styles.configToggle}
              onPress={() => setShowUrlConfig(!showUrlConfig)}
            >
              <Text style={styles.configToggleText}>
                {showUrlConfig ? '▼ Sembunyikan Pengaturan API' : '▶ Pengaturan Server API Sync'}
              </Text>
            </TouchableOpacity>

            {showUrlConfig && (
              <View style={styles.configBox}>
                <Text style={styles.configLabel}>Base API URL (Vercel):</Text>
                <TextInput
                  style={styles.configInput}
                  value={customUrl}
                  onChangeText={setCustomUrl}
                  placeholder="https://zahim-nighthound22.vercel.app"
                  placeholderTextColor={Colors.textDim}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSaveUrl}>
                  <Text style={styles.saveUrlText}>Simpan URL</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#0E1217',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.25)',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#12171E',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  body: {
    padding: 20,
  },
  projectCard: {
    backgroundColor: '#141A22',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  projectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  neonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  neonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF66',
  },
  neonBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00FF66',
    letterSpacing: 0.5,
  },
  branchText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.textDim,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  syncMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  syncMetaLabel: {
    fontSize: 11,
    color: Colors.textDim,
  },
  syncMetaValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  statusBoxSuccess: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  statusBoxError: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.3)',
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadBtn: {
    backgroundColor: '#00FF66',
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B0D11',
  },
  downloadBtn: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.4)',
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00FF66',
  },
  btnSubtext: {
    fontSize: 9,
    color: Colors.textDim,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  testBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 255, 102, 0.04)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.15)',
    marginBottom: 16,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF66',
  },
  infoContent: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  configToggle: {
    paddingVertical: 8,
  },
  configToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textDim,
  },
  configBox: {
    marginTop: 8,
    backgroundColor: '#141A22',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  configLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  configInput: {
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  saveUrlBtn: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveUrlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00FF66',
  },
});
