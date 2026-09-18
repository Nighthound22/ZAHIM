import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { NeonButton } from '../ui/NeonButton';
import { X } from 'lucide-react-native';
import { Habit } from '../../types';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
}

const CATEGORIES: Habit['category'][] = ['ibadah', 'work', 'health', 'learning', 'personal'];
const WEIGHTS: Habit['weight'][] = [3, 2, 1];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState('06:00');
  const [category, setCategory] = useState<Habit['category']>('ibadah');
  const [weight, setWeight] = useState<Habit['weight']>(3);
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      timeSlot,
      category,
      weight,
      frequency,
      color: Colors.category[category],
    });
    setTitle('');
    setTimeSlot('06:00');
    setCategory('ibadah');
    setWeight(3);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Tambah Rutinitas Baru</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* Title Input */}
            <Text style={styles.inputLabel}>Nama Rutinitas / Target</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Sholat Dhuha 4 Rakaat & Istighfar"
              placeholderTextColor={Colors.textDim}
              style={styles.textInput}
            />

            {/* Time Slot Input */}
            <Text style={styles.inputLabel}>Slot Waktu (HH:mm)</Text>
            <TextInput
              value={timeSlot}
              onChangeText={setTimeSlot}
              placeholder="06:00"
              placeholderTextColor={Colors.textDim}
              style={styles.textInput}
              keyboardType="numbers-and-punctuation"
            />

            {/* Category Selector */}
            <Text style={styles.inputLabel}>Kategori</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.chip,
                      isSelected && {
                        backgroundColor: `${Colors.category[cat]}26`,
                        borderColor: Colors.category[cat],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && { color: Colors.category[cat], fontWeight: '700' },
                      ]}
                    >
                      {cat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Weight / Himmah Priority */}
            <Text style={styles.inputLabel}>Bobot Prioritas (Himmah Index)</Text>
            <View style={styles.chipRow}>
              {WEIGHTS.map((w) => {
                const isSelected = weight === w;
                const label = w === 3 ? 'Bobot 3 (Fardhu/Inti)' : w === 2 ? 'Bobot 2 (Sekunder)' : 'Bobot 1 (Fleksibel)';
                return (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setWeight(w)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelectedPrimary,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && { color: Colors.primary, fontWeight: '700' },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Frequency */}
            <Text style={styles.inputLabel}>Frekuensi</Text>
            <View style={styles.chipRow}>
              {(['daily', 'weekdays', 'custom'] as Habit['frequency'][]).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  style={[
                    styles.chip,
                    frequency === freq && styles.chipSelectedSecondary,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      frequency === freq && { color: Colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {freq === 'daily' ? 'Setiap Hari' : freq === 'weekdays' ? 'Hari Kerja (Sen-Jum)' : 'Kustom'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <NeonButton
              title="Batal"
              variant="outline"
              size="md"
              onPress={onClose}
              style={{ flex: 1, marginRight: 8 }}
            />
            <NeonButton
              title="Simpan Rutinitas"
              variant="primary"
              size="md"
              onPress={handleSubmit}
              style={{ flex: 1, marginLeft: 8 }}
              disabled={!title.trim()}
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
    maxWidth: 500,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipSelectedPrimary: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderColor: Colors.primary,
  },
  chipSelectedSecondary: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: Colors.secondary,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
