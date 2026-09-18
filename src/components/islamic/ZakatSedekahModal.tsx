import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useZakatSedekahStore } from '../../store/useZakatSedekahStore';
import { soundHaptics } from '../../services/soundHaptics';
import { X, Coins, HeartHandshake, Flame, Calculator, Sparkles, Check, ArrowRight } from 'lucide-react-native';

interface ZakatSedekahModalProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: 'zakat' | 'sedekah';
}

export const ZakatSedekahModal: React.FC<ZakatSedekahModalProps> = ({
  visible,
  onClose,
  initialTab = 'zakat',
}) => {
  const [activeTab, setActiveTab] = useState<'zakat' | 'sedekah'>(initialTab);
  const [zakatType, setZakatType] = useState<'profesi' | 'maal'>('profesi');

  // Zakat inputs
  const {
    goldPricePerGram,
    monthlySalary,
    monthlySideIncome,
    monthlyEssentialNeeds,
    savingsBalance,
    goldInvestedGrams,
    propertyInvestments,
    setZakatProfesiInputs,
    setZakatMaalInputs,
    calculateZakatProfesi,
    calculateZakatMaal,
    sedekahLogs,
    addSedekah,
    getMonthlyTotalSedekah,
    getSedekahStreak,
  } = useZakatSedekahStore();

  const [salaryInput, setSalaryInput] = useState(monthlySalary.toString());
  const [sideInput, setSideInput] = useState(monthlySideIncome.toString());
  const [needsInput, setNeedsInput] = useState(monthlyEssentialNeeds.toString());

  const [savingsInput, setSavingsInput] = useState(savingsBalance.toString());
  const [goldInput, setGoldInput] = useState(goldInvestedGrams.toString());

  // Sedekah custom amount
  const [customSedekah, setCustomSedekah] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'subuh' | 'jumat' | 'harian'>('subuh');
  const [justLogged, setJustLogged] = useState(false);

  const formatIDR = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  const handleUpdateProfesi = () => {
    const s = parseInt(salaryInput, 10) || 0;
    const side = parseInt(sideInput, 10) || 0;
    const n = parseInt(needsInput, 10) || 0;
    setZakatProfesiInputs(s, side, n);
    soundHaptics.lightTap();
  };

  const handleUpdateMaal = () => {
    const sav = parseInt(savingsInput, 10) || 0;
    const gold = parseInt(goldInput, 10) || 0;
    setZakatMaalInputs(sav, gold, propertyInvestments);
    soundHaptics.lightTap();
  };

  const handleLogSedekah = (amount: number) => {
    if (amount <= 0) return;
    soundHaptics.celebrate();
    addSedekah(amount, selectedCategory);
    setJustLogged(true);
    setCustomSedekah('');
    setTimeout(() => setJustLogged(false), 2500);
  };

  const profesiCalc = calculateZakatProfesi();
  const maalCalc = calculateZakatMaal();
  const monthlyTotal = getMonthlyTotalSedekah();
  const streak = getSedekahStreak();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Coins size={18} color="#00FF66" />
              </View>
              <View>
                <Text style={styles.title}>Zakat & Sedekah Subuh</Text>
                <Text style={styles.subtitle}>Bersihkan Harta & Lipatgandakan Keberkahan Rezeki</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Main Tabs */}
          <View style={styles.mainTabs}>
            <TouchableOpacity
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('zakat');
              }}
              style={[styles.mainTab, activeTab === 'zakat' && styles.mainTabActive]}
            >
              <Text style={[styles.mainTabText, activeTab === 'zakat' && styles.mainTabTextActive]}>
                💰 Kalkulator Zakat (2.5%)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                soundHaptics.lightTap();
                setActiveTab('sedekah');
              }}
              style={[styles.mainTab, activeTab === 'sedekah' && styles.mainTabActive]}
            >
              <Text style={[styles.mainTabText, activeTab === 'sedekah' && styles.mainTabTextActive]}>
                🌅 Sedekah Subuh Tracker
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'zakat' ? (
            /* Zakat Tab */
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Subtabs: Profesi vs Maal */}
              <View style={styles.subTabs}>
                <TouchableOpacity
                  onPress={() => {
                    soundHaptics.lightTap();
                    setZakatType('profesi');
                  }}
                  style={[styles.subTab, zakatType === 'profesi' && styles.subTabActive]}
                >
                  <Text style={[styles.subTabText, zakatType === 'profesi' && styles.subTabTextActive]}>
                    Zakat Penghasilan / Profesi
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    soundHaptics.lightTap();
                    setZakatType('maal');
                  }}
                  style={[styles.subTab, zakatType === 'maal' && styles.subTabActive]}
                >
                  <Text style={[styles.subTabText, zakatType === 'maal' && styles.subTabTextActive]}>
                    Zakat Maal (Tabungan/Emas)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reference Info */}
              <View style={styles.infoBanner}>
                <Sparkles size={14} color="#FBBF24" />
                <Text style={styles.infoBannerText}>
                  Nisab Zakat = 85 gram Emas (Harga acuan BAZNAS: {formatIDR(goldPricePerGram)}/gram = {formatIDR(85 * goldPricePerGram)}/tahun atau {formatIDR((85 * goldPricePerGram) / 12)}/bulan).
                </Text>
              </View>

              {zakatType === 'profesi' ? (
                /* Zakat Profesi Form */
                <View style={styles.formCard}>
                  <Text style={styles.formSectionTitle}>Pemasukan Bulanan</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Gaji Pokok / Penghasilan Bulanan (Rp)</Text>
                    <TextInput
                      value={salaryInput}
                      onChangeText={(val) => {
                        setSalaryInput(val);
                        const s = parseInt(val, 10) || 0;
                        setZakatProfesiInputs(s, parseInt(sideInput, 10) || 0, parseInt(needsInput, 10) || 0);
                      }}
                      keyboardType="numeric"
                      style={styles.textInput}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Penghasilan Tambahan / Bonus (Rp)</Text>
                    <TextInput
                      value={sideInput}
                      onChangeText={(val) => {
                        setSideInput(val);
                        const side = parseInt(val, 10) || 0;
                        setZakatProfesiInputs(parseInt(salaryInput, 10) || 0, side, parseInt(needsInput, 10) || 0);
                      }}
                      keyboardType="numeric"
                      style={styles.textInput}
                    />
                  </View>

                  {/* Calculation Result Box */}
                  <View style={[styles.resultCard, profesiCalc.isWajib ? styles.resultWajib : styles.resultSunnah]}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultLabel}>Status Kewajiban Zakat Profesi</Text>
                      <View style={[styles.statusBadge, { backgroundColor: profesiCalc.isWajib ? 'rgba(0, 255, 102, 0.2)' : 'rgba(251, 191, 36, 0.2)' }]}>
                        <Text style={[styles.statusBadgeText, { color: profesiCalc.isWajib ? '#00FF66' : '#FBBF24' }]}>
                          {profesiCalc.isWajib ? 'WAJIB ZAKAT ✓' : 'BELUM MENCAPAI NISAB'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.resultRow}>
                      <Text style={styles.resultItemLabel}>Total Penghasilan:</Text>
                      <Text style={styles.resultItemVal}>{formatIDR(profesiCalc.grossIncome)}</Text>
                    </View>

                    <View style={styles.resultRow}>
                      <Text style={styles.resultItemLabel}>Nisab Bulanan Acuan:</Text>
                      <Text style={styles.resultItemVal}>{formatIDR(profesiCalc.monthlyNisab)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.highlightRow}>
                      <Text style={styles.highlightLabel}>Zakat Wajib Dikeluarkan (2.5%):</Text>
                      <Text style={styles.highlightVal}>
                        {profesiCalc.isWajib ? formatIDR(profesiCalc.zakatAmount) + ' / bulan' : 'Rp 0 (Disunnahkan Infaq)'}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                /* Zakat Maal Form */
                <View style={styles.formCard}>
                  <Text style={styles.formSectionTitle}>Total Harta Simpanan (Haul 1 Tahun)</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Saldo Tabungan / Deposito / Giro (Rp)</Text>
                    <TextInput
                      value={savingsInput}
                      onChangeText={(val) => {
                        setSavingsInput(val);
                        const s = parseInt(val, 10) || 0;
                        setZakatMaalInputs(s, parseInt(goldInput, 10) || 0, propertyInvestments);
                      }}
                      keyboardType="numeric"
                      style={styles.textInput}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Emas Batangan / Simpanan (Gram)</Text>
                    <TextInput
                      value={goldInput}
                      onChangeText={(val) => {
                        setGoldInput(val);
                        const g = parseInt(val, 10) || 0;
                        setZakatMaalInputs(parseInt(savingsInput, 10) || 0, g, propertyInvestments);
                      }}
                      keyboardType="numeric"
                      style={styles.textInput}
                    />
                  </View>

                  {/* Result Box */}
                  <View style={[styles.resultCard, maalCalc.isWajib ? styles.resultWajib : styles.resultSunnah]}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultLabel}>Status Zakat Maal</Text>
                      <View style={[styles.statusBadge, { backgroundColor: maalCalc.isWajib ? 'rgba(0, 255, 102, 0.2)' : 'rgba(251, 191, 36, 0.2)' }]}>
                        <Text style={[styles.statusBadgeText, { color: maalCalc.isWajib ? '#00FF66' : '#FBBF24' }]}>
                          {maalCalc.isWajib ? 'WAJIB ZAKAT MAAL ✓' : 'BELUM MENCAPAI NISAB'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.resultRow}>
                      <Text style={styles.resultItemLabel}>Total Harta Simpanan:</Text>
                      <Text style={styles.resultItemVal}>{formatIDR(maalCalc.totalWealth)}</Text>
                    </View>

                    <View style={styles.resultRow}>
                      <Text style={styles.resultItemLabel}>Nisab Tahunan (85g Emas):</Text>
                      <Text style={styles.resultItemVal}>{formatIDR(maalCalc.annualNisab)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.highlightRow}>
                      <Text style={styles.highlightLabel}>Zakat Maal Dibayar (2.5%):</Text>
                      <Text style={styles.highlightVal}>
                        {maalCalc.isWajib ? formatIDR(maalCalc.zakatAmount) + ' / tahun' : 'Rp 0'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={{ height: 24 }} />
            </ScrollView>
          ) : (
            /* Sedekah Subuh Tab */
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Stat Highlight Row */}
              <View style={styles.statGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>TOTAL SEDEKAH BULAN INI</Text>
                  <Text style={[styles.statValue, { color: '#00FF66' }]}>{formatIDR(monthlyTotal)}</Text>
                  <Text style={styles.statSub}>Tercatat di Mutaba'ah</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Flame size={14} color="#FBBF24" />
                    <Text style={styles.statLabel}>STREAK SEDEKAH</Text>
                  </View>
                  <Text style={[styles.statValue, { color: '#FBBF24' }]}>{streak} Hari</Text>
                  <Text style={styles.statSub}>Konsisten Tiap Hari</Text>
                </View>
              </View>

              {/* Hadith Quote */}
              <View style={styles.hadithBar}>
                <Text style={styles.hadithText}>
                  "Tidak ada satu subuh pun yang dialami hamba-hamba Allah kecuali turun kepada mereka dua malaikat. Salah satu berkata: 'Ya Allah berikanlah ganti bagi orang yang berinfak'..." (HR. Bukhari no. 1442)
                </Text>
              </View>

              {justLogged && (
                <View style={styles.successBanner}>
                  <Check size={16} color="#00FF66" />
                  <Text style={styles.successText}>Alhamdulillah! Sedekah Subuh berhasil dicatat. Semoga Allah membalas berlipat ganda.</Text>
                </View>
              )}

              {/* Category selector */}
              <View style={styles.sedekahCatRow}>
                {[
                  { key: 'subuh', label: '🌅 Sedekah Subuh' },
                  { key: 'jumat', label: '🕌 Sedekah Jumat' },
                  { key: 'harian', label: '🤲 Sedekah Harian' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setSelectedCategory(item.key as any)}
                    style={[
                      styles.sedekahCatBtn,
                      selectedCategory === item.key && styles.sedekahCatBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sedekahCatText,
                        selectedCategory === item.key && styles.sedekahCatTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Quick Amount Buttons */}
              <Text style={styles.sectionTitle}>Pilih Nominal Cepat:</Text>
              <View style={styles.quickButtonsGrid}>
                {[5000, 10000, 20000, 50000, 100000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    activeOpacity={0.7}
                    onPress={() => handleLogSedekah(amt)}
                    style={styles.quickBtn}
                  >
                    <Text style={styles.quickBtnText}>{formatIDR(amt)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Input */}
              <View style={styles.customInputRow}>
                <TextInput
                  value={customSedekah}
                  onChangeText={setCustomSedekah}
                  placeholder="Nominal custom (misal: 150000)"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="numeric"
                  style={styles.customTextInput}
                />
                <TouchableOpacity
                  onPress={() => {
                    const parsed = parseInt(customSedekah, 10);
                    if (parsed > 0) handleLogSedekah(parsed);
                  }}
                  style={styles.submitCustomBtn}
                >
                  <Text style={styles.submitCustomText}>Catat</Text>
                </TouchableOpacity>
              </View>

              {/* Sedekah History */}
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Riwayat Sedekah Terakhir:</Text>
              <View style={styles.historyList}>
                {sedekahLogs.slice(0, 5).map((log) => (
                  <View key={log.id} style={styles.historyItem}>
                    <View>
                      <Text style={styles.historyNote}>{log.note || 'Sedekah Subuh'}</Text>
                      <Text style={styles.historyDate}>{log.date}</Text>
                    </View>
                    <Text style={styles.historyAmount}>+{formatIDR(log.amount)}</Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>
          )}
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
    backgroundColor: '#0F1117',
    width: '100%',
    maxWidth: 620,
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 18,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBright,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#14171F',
  },
  mainTabs: {
    flexDirection: 'row',
    backgroundColor: '#14171F',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  mainTabActive: {
    backgroundColor: '#1F2432',
  },
  mainTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  mainTabTextActive: {
    color: Colors.textBright,
  },
  subTabs: {
    flexDirection: 'row',
    backgroundColor: '#14171F',
    borderRadius: 8,
    padding: 3,
    marginBottom: 10,
  },
  subTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  subTabActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  subTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  subTabTextActive: {
    color: '#00FF66',
  },
  scrollContent: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
  },
  infoBannerText: {
    fontSize: 10.5,
    color: '#FBBF24',
    flex: 1,
    lineHeight: 15,
  },
  formCard: {
    backgroundColor: '#14171F',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2432',
    marginBottom: 12,
  },
  formSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textBright,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#0F1117',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.textBright,
    fontSize: 13,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultWajib: {
    backgroundColor: 'rgba(0, 255, 102, 0.06)',
    borderColor: '#00FF66',
  },
  resultSunnah: {
    backgroundColor: 'rgba(251, 191, 36, 0.06)',
    borderColor: '#FBBF24',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textBright,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultItemLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  resultItemVal: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textBright,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2432',
    marginVertical: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textBright,
  },
  highlightVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#00FF66',
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#14171F',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 2,
  },
  statSub: {
    fontSize: 9,
    color: Colors.textDim,
  },
  hadithBar: {
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#00FF66',
  },
  hadithText: {
    fontSize: 10,
    color: '#00FF66',
    fontStyle: 'italic',
    lineHeight: 14,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  successText: {
    fontSize: 11,
    color: '#00FF66',
    fontWeight: '600',
    flex: 1,
  },
  sedekahCatRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  sedekahCatBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
    alignItems: 'center',
  },
  sedekahCatBtnActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderColor: '#00FF66',
  },
  sedekahCatText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  sedekahCatTextActive: {
    color: '#00FF66',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textBright,
    marginBottom: 8,
  },
  quickButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  quickBtn: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textBright,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  customTextInput: {
    flex: 1,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: Colors.textBright,
    fontSize: 12,
  },
  submitCustomBtn: {
    backgroundColor: '#00FF66',
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitCustomText: {
    color: '#0B0D11',
    fontWeight: '700',
    fontSize: 12,
  },
  historyList: {
    gap: 6,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#14171F',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  historyNote: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textBright,
  },
  historyDate: {
    fontSize: 10,
    color: Colors.textDim,
  },
  historyAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF66',
  },
});
