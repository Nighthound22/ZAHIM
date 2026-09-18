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
import { X, Plus, Trash2 } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface AddMemoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    content: string,
    milestones: { text: string; pointValue: number }[],
    dueDate?: string
  ) => void;
}

export const AddMemoModal: React.FC<AddMemoModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [milestones, setMilestones] = useState<{ text: string; pointValue: number }[]>([
    { text: 'Target Milestone 1', pointValue: 5 },
    { text: 'Target Milestone 2', pointValue: 5 },
  ]);

  const handleAddMilestone = () => {
    soundHaptics.lightTap();
    setMilestones([...milestones, { text: '', pointValue: 5 }]);
  };

  const handleRemoveMilestone = (index: number) => {
    soundHaptics.lightTap();
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleUpdateMilestoneText = (index: number, text: string) => {
    const updated = [...milestones];
    updated[index].text = text;
    setMilestones(updated);
  };

  const handleUpdateMilestonePoints = (index: number, points: number) => {
    const updated = [...milestones];
    updated[index].pointValue = points;
    setMilestones(updated);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const validMilestones = milestones.filter((m) => m.text.trim().length > 0);
    soundHaptics.celebrate();
    onAdd(title.trim(), content.trim(), validMilestones, dueDate.trim() || undefined);
    setTitle('');
    setContent('');
    setDueDate('');
    setMilestones([
      { text: 'Target Milestone 1', pointValue: 5 },
      { text: 'Target Milestone 2', pointValue: 5 },
    ]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Buat Smart Memo & Target</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* Title */}
            <Text style={styles.label}>Judul Memo</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Khatam Kitab Ushul Tsalatsah"
              placeholderTextColor={Colors.textDim}
              style={styles.textInput}
            />

            {/* Content */}
            <Text style={styles.label}>Deskripsi / Catatan Penting</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Catatan detail mengenai target..."
              placeholderTextColor={Colors.textDim}
              style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
              multiline
            />

            {/* Due Date */}
            <Text style={styles.label}>Tenggat Waktu / Due Date (YYYY-MM-DD)</Text>
            <TextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="2026-09-30"
              placeholderTextColor={Colors.textDim}
              style={styles.textInput}
            />

            {/* Milestone List */}
            <View style={styles.milestoneHeader}>
              <Text style={styles.label}>Checklist Milestones & Bobot XP</Text>
              <TouchableOpacity onPress={handleAddMilestone} style={styles.addMilestoneBtn}>
                <Plus size={14} color={Colors.primary} />
                <Text style={styles.addMilestoneText}>Tambah</Text>
              </TouchableOpacity>
            </View>

            {milestones.map((m, idx) => (
              <View key={idx} style={styles.milestoneRow}>
                <TextInput
                  value={m.text}
                  onChangeText={(val) => handleUpdateMilestoneText(idx, val)}
                  placeholder={`Milestone #${idx + 1}...`}
                  placeholderTextColor={Colors.textDim}
                  style={styles.milestoneInput}
                />
                <TouchableOpacity
                  onPress={() => handleUpdateMilestonePoints(idx, m.pointValue === 5 ? 10 : 5)}
                  style={styles.pointsToggle}
                >
                  <Text style={styles.pointsToggleText}>+{m.pointValue} XP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveMilestone(idx)}
                  style={styles.removeMilestoneBtn}
                >
                  <Trash2 size={15} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
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
              title="Simpan Memo"
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
    marginBottom: 14,
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
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 10,
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
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  addMilestoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMilestoneText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  milestoneInput: {
    flex: 1,
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  pointsToggle: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  pointsToggleText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '700',
  },
  removeMilestoneBtn: {
    padding: 6,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
