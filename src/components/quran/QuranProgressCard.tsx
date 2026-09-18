import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { useQuranDhikrStore } from '../../store/useQuranDhikrStore';
import { BookOpen, Target, Bookmark, Sparkles, Check, Heart } from 'lucide-react-native';
import { NeonButton } from '../ui/NeonButton';
import { soundHaptics } from '../../services/soundHaptics';

interface QuranProgressCardProps {
  onOpenQuranReader?: () => void;
  onOpenAsmaulHusna?: () => void;
  onOpenDailyDua?: () => void;
}

export const QuranProgressCard: React.FC<QuranProgressCardProps> = ({
  onOpenQuranReader,
  onOpenAsmaulHusna,
  onOpenDailyDua,
}) => {
  const { progress, updateQuranProgress, setTargetDaysForKhatam, getKhatamEstimate } =
    useQuranDhikrStore();

  const [isEditing, setIsEditing] = useState(false);
  const [pagesInput, setPagesInput] = useState(progress.quranPagesRead.toString());
  const [surahInput, setSurahInput] = useState(progress.lastSurah.toString());
  const [ayahInput, setAyahInput] = useState(progress.lastAyah.toString());
  const [targetDaysInput, setTargetDaysInput] = useState(
    (progress.targetDaysForKhatam || 30).toString()
  );

  const estimate = getKhatamEstimate();
  const percentage = Math.round((progress.quranPagesRead / 604) * 100);

  const handleSave = () => {
    soundHaptics.celebrate();
    updateQuranProgress(
      parseInt(pagesInput, 10) || 0,
      parseInt(surahInput, 10) || 1,
      parseInt(ayahInput, 10) || 1
    );
    setTargetDaysForKhatam(parseInt(targetDaysInput, 10) || 30);
    setIsEditing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <BookOpen size={18} color={Colors.primary} />
          <Text style={styles.cardTitle}>Tadarus Al-Qur'an & Smart Khatam Planner</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            soundHaptics.lightTap();
            setIsEditing(!isEditing);
          }}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>{isEditing ? 'Batal' : 'Update Progres'}</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar & Percentage */}
      <View style={styles.progressRow}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.percentText}>{percentage}% Khatam</Text>
      </View>

      {/* Metric Highlights */}
      <View style={styles.metricGrid}>
        <View style={styles.metricBox}>
          <Bookmark size={14} color={Colors.secondary} />
          <Text style={styles.metricLabel}>TERAKHIR DIBACA</Text>
          <Text style={styles.metricValue}>
            Hal. {progress.quranPagesRead} / 604
          </Text>
          <Text style={styles.metricSub}>Surat {progress.lastSurah} : Ayat {progress.lastAyah}</Text>
        </View>

        <View style={styles.metricBox}>
          <Target size={14} color={Colors.primary} />
          <Text style={styles.metricLabel}>TARGET HARIAN</Text>
          <Text style={styles.metricValue}>{estimate.pagesPerDay} Lembar/Hari</Text>
          <Text style={styles.metricSub}>{estimate.sheetsPerDay} Lembar Fisik</Text>
        </View>

        <View style={styles.metricBox}>
          <Sparkles size={14} color={Colors.warning} />
          <Text style={styles.metricLabel}>ESTIMASI SELESAI</Text>
          <Text style={styles.metricValue}>{estimate.daysRemaining} Hari Lagi</Text>
          <Text style={styles.metricSub}>{estimate.estimatedCompletionDate}</Text>
        </View>
      </View>

      {/* Quick Islamic Actions */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenQuranReader?.();
          }}
          style={styles.quickActionBtnPrimary}
        >
          <BookOpen size={14} color="#0B0D11" />
          <Text style={styles.quickActionBtnTextPrimary}>Buka Mushaf & Tilawah</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenAsmaulHusna?.();
          }}
          style={styles.quickActionBtnSecondary}
        >
          <Sparkles size={14} color="#FBBF24" />
          <Text style={styles.quickActionBtnTextSecondary}>99 Asmaul Husna</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            soundHaptics.lightTap();
            onOpenDailyDua?.();
          }}
          style={styles.quickActionBtnSecondary}
        >
          <Heart size={14} color="#38BDF8" />
          <Text style={styles.quickActionBtnTextSecondary}>Doa Shahih</Text>
        </TouchableOpacity>
      </View>

      {/* Inline Quick Editor */}
      {isEditing && (
        <View style={styles.editorBox}>
          <Text style={styles.editorTitle}>Input Capaian Tilawah Hari Ini</Text>
          <View style={styles.inputGroupRow}>
            <View style={styles.inputCol}>
              <Text style={styles.inputMiniLabel}>Halaman Terakhir</Text>
              <TextInput
                value={pagesInput}
                onChangeText={setPagesInput}
                keyboardType="numeric"
                style={styles.miniInput}
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.inputMiniLabel}>Nomor Surat</Text>
              <TextInput
                value={surahInput}
                onChangeText={setSurahInput}
                keyboardType="numeric"
                style={styles.miniInput}
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.inputMiniLabel}>Nomor Ayat</Text>
              <TextInput
                value={ayahInput}
                onChangeText={setAyahInput}
                keyboardType="numeric"
                style={styles.miniInput}
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.inputMiniLabel}>Target (Hari)</Text>
              <TextInput
                value={targetDaysInput}
                onChangeText={setTargetDaysInput}
                keyboardType="numeric"
                style={styles.miniInput}
              />
            </View>
          </View>

          <NeonButton
            title="Simpan Progres Tilawah"
            variant="primary"
            size="sm"
            onPress={handleSave}
            icon={<Check size={14} color="#0B0D11" />}
            style={{ marginTop: 10 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  editBtn: {
    backgroundColor: '#0B0D11',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtnText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#0B0D11',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    minWidth: 70,
    textAlign: 'right',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#0B0D11',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textDim,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  editorBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  editorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: 8,
  },
  inputGroupRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputCol: {
    flex: 1,
  },
  inputMiniLabel: {
    fontSize: 9,
    color: Colors.textDim,
    marginBottom: 4,
  },
  miniInput: {
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 8,
    color: Colors.textPrimary,
    fontSize: 13,
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickActionBtnPrimary: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00FF66',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  quickActionBtnTextPrimary: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B0D11',
  },
  quickActionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  quickActionBtnTextSecondary: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textBright,
  },
});
