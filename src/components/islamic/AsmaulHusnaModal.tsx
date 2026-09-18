import React, { useState, useMemo } from 'react';
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
import { ASMAUL_HUSNA, AsmaulHusnaItem } from '../../data/duaAsmaulData';
import { soundHaptics } from '../../services/soundHaptics';
import { X, Search, Sparkles, Heart } from 'lucide-react-native';

interface AsmaulHusnaModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AsmaulHusnaModal: React.FC<AsmaulHusnaModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return ASMAUL_HUSNA;
    const q = searchQuery.toLowerCase();
    return ASMAUL_HUSNA.filter(
      (item) =>
        item.latin.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.arabic.includes(q) ||
        item.id.toString() === q
    );
  }, [searchQuery]);

  const handleSelect = (id: number) => {
    soundHaptics.lightTap();
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Sparkles size={18} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.title}>99 Asmaul Husna</Text>
                <Text style={styles.subtitle}>Nama-nama Allah yang Maha Indah & Mulia beserta Hikmahnya</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Search size={16} color={Colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari nama Allah... (misal: Rahman, Malik, 1)"
              placeholderTextColor={Colors.textDim}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Hadith Quote */}
          <View style={styles.hadithBar}>
            <Text style={styles.hadithText}>
              "Sesungguhnya Allah memiliki 99 nama, seratus kurang satu, barangsiapa menjaganya (menghafal, memahami & mengamalkannya) niscaya ia masuk surga." (HR. Bukhari no. 2736 & Muslim no. 2677)
            </Text>
          </View>

          {/* Cards Grid / List */}
          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {filteredList.map((item: AsmaulHusnaItem) => {
                const isSelected = selectedId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelect(item.id)}
                    style={[styles.card, isSelected && styles.cardSelected]}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberBadgeText}>{item.id}</Text>
                      </View>
                      <Text style={styles.arabicText}>{item.arabic}</Text>
                    </View>

                    <Text style={styles.latinText}>{item.latin}</Text>
                    <Text style={styles.translationText}>{item.translation}</Text>

                    <View style={styles.fadhilahBox}>
                      <Text style={styles.fadhilahText}>
                        💡 {item.fadhilah}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {filteredList.length === 0 && (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Tidak ditemukan nama Allah yang cocok dengan "{searchQuery}"</Text>
              </View>
            )}

            <View style={{ height: 24 }} />
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
    backgroundColor: '#0F1117',
    width: '100%',
    maxWidth: 680,
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
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textBright,
    fontSize: 13,
  },
  hadithBar: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
  },
  hadithText: {
    fontSize: 10,
    color: '#FBBF24',
    fontStyle: 'italic',
    lineHeight: 15,
  },
  scrollList: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '48.5%',
    backgroundColor: '#14171F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 12,
  },
  cardSelected: {
    borderColor: '#00FF66',
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1F2432',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  arabicText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00FF66',
  },
  latinText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textBright,
    marginBottom: 2,
  },
  translationText: {
    fontSize: 11,
    color: '#38BDF8',
    marginBottom: 8,
  },
  fadhilahBox: {
    backgroundColor: '#0F1117',
    padding: 8,
    borderRadius: 8,
  },
  fadhilahText: {
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 14,
  },
  emptyWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
