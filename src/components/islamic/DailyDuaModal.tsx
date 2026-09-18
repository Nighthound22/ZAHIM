import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { DAILY_DUAS, DailyDuaItem } from '../../data/duaAsmaulData';
import { soundHaptics } from '../../services/soundHaptics';
import { X, Search, Copy, Check, Heart, BookMarked, Sparkles } from 'lucide-react-native';

interface DailyDuaModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DailyDuaModal: React.FC<DailyDuaModalProps> = ({ visible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recitedIds, setRecitedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { key: 'all', label: 'Semua' },
    { key: 'tidur', label: 'Tidur' },
    { key: 'sholat', label: 'Masjid & Sholat' },
    { key: 'aktivitas', label: 'Aktivitas' },
    { key: 'rezeki', label: 'Rezeki' },
    { key: 'perlindungan', label: 'Perlindungan' },
  ];

  const filteredDuas = useMemo(() => {
    return DAILY_DUAS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (item: DailyDuaItem) => {
    soundHaptics.lightTap();
    const textToCopy = `${item.title}\n\n${item.arabic}\n\n${item.latin}\n\nArtinya:\n"${item.translation}"\n\n(${item.reference})`;

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleRecited = (id: string) => {
    soundHaptics.celebrate();
    setRecitedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <BookMarked size={18} color="#00FF66" />
              </View>
              <View>
                <Text style={styles.title}>Kumpulan Doa Harian Shahih</Text>
                <Text style={styles.subtitle}>Doa Pilihan dari Kitab Hisnul Muslim & Hadits Shahih</Text>
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
              placeholder="Cari doa harian... (misal: tidur, hutang, masjid)"
              placeholderTextColor={Colors.textDim}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Tabs */}
          <View style={styles.categoryScrollWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => {
                      soundHaptics.lightTap();
                      setSelectedCategory(cat.key);
                    }}
                    style={[styles.catPill, isActive && styles.catPillActive]}
                  >
                    <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Dua Cards List */}
          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {filteredDuas.map((item) => {
              const isCopied = copiedId === item.id;
              const isRecited = !!recitedIds[item.id];

              return (
                <View key={item.id} style={styles.duaCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.titleBadgeWrap}>
                      <Text style={styles.duaTitle}>{item.title}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{item.categoryLabel}</Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        onPress={() => handleCopy(item)}
                        style={[styles.actionBtn, isCopied && styles.actionBtnActive]}
                      >
                        {isCopied ? (
                          <>
                            <Check size={13} color="#00FF66" />
                            <Text style={styles.actionBtnTextActive}>Tersalin</Text>
                          </>
                        ) : (
                          <>
                            <Copy size={13} color={Colors.textMuted} />
                            <Text style={styles.actionBtnText}>Salin</Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleToggleRecited(item.id)}
                        style={[styles.actionBtn, isRecited && styles.actionBtnRecited]}
                      >
                        <Heart size={13} color={isRecited ? '#EF4444' : Colors.textMuted} fill={isRecited ? '#EF4444' : 'transparent'} />
                        <Text style={[styles.actionBtnText, isRecited && { color: '#EF4444' }]}>
                          {isRecited ? 'Diamalkan' : 'Amalkan'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Arabic Text */}
                  <Text style={styles.arabicText}>{item.arabic}</Text>

                  {/* Latin Text */}
                  <Text style={styles.latinText}>{item.latin}</Text>

                  {/* Translation */}
                  <Text style={styles.translationText}>{item.translation}</Text>

                  {/* Reference */}
                  <View style={styles.referenceRow}>
                    <Sparkles size={12} color="#FBBF24" />
                    <Text style={styles.referenceText}>{item.reference}</Text>
                  </View>
                </View>
              );
            })}

            {filteredDuas.length === 0 && (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Tidak ada doa yang cocok dengan pencarian "{searchQuery}"</Text>
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
    maxWidth: 640,
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
  categoryScrollWrap: {
    marginBottom: 12,
  },
  categoryScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#14171F',
    borderWidth: 1,
    borderColor: '#1F2432',
  },
  catPillActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderColor: '#00FF66',
  },
  catPillText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  catPillTextActive: {
    color: '#00FF66',
    fontWeight: '600',
  },
  scrollList: {
    flex: 1,
  },
  duaCard: {
    backgroundColor: '#14171F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleBadgeWrap: {
    flex: 1,
    paddingRight: 8,
  },
  duaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textBright,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1F2432',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  actionBtnRecited: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  actionBtnText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  actionBtnTextActive: {
    fontSize: 11,
    color: '#00FF66',
    fontWeight: '600',
  },
  arabicText: {
    fontSize: 20,
    color: Colors.textBright,
    textAlign: 'right',
    lineHeight: 36,
    marginBottom: 10,
  },
  latinText: {
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#1F2432',
    paddingTop: 8,
  },
  referenceText: {
    fontSize: 10,
    color: '#FBBF24',
    fontStyle: 'italic',
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
