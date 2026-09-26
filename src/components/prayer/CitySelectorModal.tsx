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
import { CityPreset, INDONESIAN_CITIES, PrayerService } from '../../services/prayerService';
import { X, MapPin, Search } from 'lucide-react-native';
import { soundHaptics } from '../../services/soundHaptics';

interface CitySelectorModalProps {
  visible: boolean;
  selectedCity: CityPreset;
  onClose: () => void;
  onSelectCity: (city: CityPreset) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  visible,
  selectedCity,
  onClose,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const filteredCities = INDONESIAN_CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: CityPreset) => {
    soundHaptics.lightTap();
    onSelectCity(city);
    onClose();
  };

  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setGpsError('');
    soundHaptics.lightTap();
    try {
      const loc = await PrayerService.detectCurrentGPSLocation();
      soundHaptics.celebrate();
      onSelectCity(loc);
      onClose();
    } catch (err: any) {
      soundHaptics.warning();
      setGpsError(err.message || 'Gagal mendeteksi lokasi GPS. Pastikan izin lokasi diaktifkan.');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Pilih Kota / Lokasi Sholat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* GPS Auto-Detect Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDetectGPS}
            disabled={isDetecting}
            style={styles.gpsBtn}
          >
            <MapPin size={16} color="#0B0D11" strokeWidth={2.5} />
            <Text style={styles.gpsBtnText}>
              {isDetecting ? 'Mendeteksi Koordinat GPS...' : 'Deteksi Otomatis Lokasi GPS & Maps'}
            </Text>
          </TouchableOpacity>

          {gpsError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {gpsError}</Text>
            </View>
          ) : null}

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Search size={16} color={Colors.textDim} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cari nama kota / daerah..."
              placeholderTextColor={Colors.textDim}
              style={styles.searchInput}
            />
          </View>

          <ScrollView style={styles.cityList}>
            {filteredCities.map((city) => {
              const isSelected = selectedCity.name === city.name;
              return (
                <TouchableOpacity
                  key={city.name}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(city)}
                  style={[styles.cityItem, isSelected && styles.cityItemSelected]}
                >
                  <View style={styles.cityLeft}>
                    <MapPin
                      size={16}
                      color={isSelected ? Colors.primary : Colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.cityName,
                        isSelected && { color: Colors.primary, fontWeight: '700' },
                      ]}
                    >
                      {city.name}
                    </Text>
                  </View>
                  <Text style={styles.coordText}>
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    maxWidth: 450,
    maxHeight: '80%',
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
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00FF66',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#00FF66',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  gpsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B0D11',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0B0D11',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  cityList: {
    maxHeight: 320,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  cityItemSelected: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cityName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  coordText: {
    fontSize: 11,
    color: Colors.textDim,
  },
});
