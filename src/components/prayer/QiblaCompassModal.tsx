import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Path, Polygon } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { usePrayerStore } from '../../store/usePrayerStore';
import { QiblaService, QiblaResult } from '../../services/qiblaService';
import { soundHaptics } from '../../services/soundHaptics';
import { X, Compass, MapPin, CheckCircle, Navigation } from 'lucide-react-native';

interface QiblaCompassModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenCitySelector: () => void;
}

export const QiblaCompassModal: React.FC<QiblaCompassModalProps> = ({
  visible,
  onClose,
  onOpenCitySelector,
}) => {
  const { selectedCity } = usePrayerStore();
  const [qiblaInfo, setQiblaInfo] = useState<QiblaResult>(
    QiblaService.calculateQibla(selectedCity.latitude, selectedCity.longitude, selectedCity.name)
  );
  const [deviceHeading, setDeviceHeading] = useState(0); // 0 = North

  useEffect(() => {
    const qibla = QiblaService.calculateQibla(
      selectedCity.latitude,
      selectedCity.longitude,
      selectedCity.name
    );
    setQiblaInfo(qibla);
  }, [selectedCity]);

  // Listen to device orientation if on mobile browser
  useEffect(() => {
    if (typeof window !== 'undefined' && window.addEventListener) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null && e.alpha !== undefined) {
          // Compass heading
          const heading = e.alpha;
          setDeviceHeading(heading);
        }
      };
      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }
  }, []);

  // Relative needle rotation: qiblaBearing - deviceHeading
  const relativeAngle = (qiblaInfo.bearingDegrees - deviceHeading + 360) % 360;
  const isAligned = Math.abs(relativeAngle) <= 5 || Math.abs(relativeAngle - 360) <= 5;

  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 20;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Compass size={20} color="#00FF66" />
              <View>
                <Text style={styles.title}>Kompas Arah Kiblat Presisi</Text>
                <Text style={styles.subTitle}>Great Circle Azimuth ke Ka'bah</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Current City & Coordinate Pill */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenCitySelector}
            style={styles.locationPill}
          >
            <MapPin size={13} color="#00FF66" />
            <Text style={styles.locationText}>{selectedCity.name}</Text>
            <Text style={styles.changeText}>(Ganti Kota)</Text>
          </TouchableOpacity>

          {/* Alignment Status Banner */}
          {isAligned ? (
            <View style={styles.alignedBanner}>
              <CheckCircle size={14} color="#0B0D11" />
              <Text style={styles.alignedBannerText}>
                Tepat Menghadap Ka'bah ({qiblaInfo.formattedDegrees})
              </Text>
            </View>
          ) : (
            <View style={styles.guideBanner}>
              <Navigation size={13} color="#38BDF8" />
              <Text style={styles.guideBannerText}>
                Arahkan panah hijau tepat ke atas Ka'bah
              </Text>
            </View>
          )}

          {/* Circular SVG Compass */}
          <View style={styles.compassWrapper}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* Outer Glow Ring */}
              <Circle
                cx={center}
                cy={center}
                r={radius + 8}
                fill="none"
                stroke={isAligned ? '#00FF66' : '#1F2432'}
                strokeWidth="2"
                strokeOpacity={isAligned ? 0.6 : 0.4}
              />

              {/* Compass Body */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                fill="#11141C"
                stroke="#242B3D"
                strokeWidth="2"
              />

              {/* Cardinal Ticks & Degree Marks */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = center + (radius - 12) * Math.cos(rad);
                const y1 = center + (radius - 12) * Math.sin(rad);
                const x2 = center + (radius - 4) * Math.cos(rad);
                const y2 = center + (radius - 4) * Math.sin(rad);
                const isMajor = deg % 90 === 0;

                return (
                  <Line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#64748B' : '#333D52'}
                    strokeWidth={isMajor ? 2.5 : 1.5}
                  />
                );
              })}

              {/* Cardinal Labels: U, T, S, B */}
              <SvgText
                x={center}
                y={center - radius + 24}
                fill="#EF4444"
                fontSize="13"
                fontWeight="900"
                textAnchor="middle"
              >
                U
              </SvgText>
              <SvgText
                x={center + radius - 20}
                y={center + 5}
                fill="#94A3B8"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                T
              </SvgText>
              <SvgText
                x={center}
                y={center + radius - 12}
                fill="#94A3B8"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                S
              </SvgText>
              <SvgText
                x={center - radius + 20}
                y={center + 5}
                fill="#94A3B8"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                B
              </SvgText>

              {/* Rotatable Qibla Needle Group */}
              <G transform={`rotate(${relativeAngle} ${center} ${center})`}>
                {/* Pointer Arrow pointing to Qibla */}
                <Polygon
                  points={`${center},${center - radius + 15} ${center - 8},${center} ${center + 8},${center}`}
                  fill="#00FF66"
                />
                <Polygon
                  points={`${center},${center + radius - 30} ${center - 6},${center} ${center + 6},${center}`}
                  fill="#334155"
                />

                {/* Ka'bah Box Icon at the needle tip */}
                <G transform={`translate(${center - 11}, ${center - radius + 18})`}>
                  <Path
                    d="M3,3 H19 V19 H3 Z"
                    fill="#0B0D11"
                    stroke="#FBBF24"
                    strokeWidth="1.5"
                  />
                  <Line x1="3" y1="8" x2="19" y2="8" stroke="#FBBF24" strokeWidth="1.2" />
                  <Line x1="11" y1="12" x2="11" y2="16" stroke="#FBBF24" strokeWidth="1.5" />
                </G>
              </G>

              {/* Center Hub */}
              <Circle cx={center} cy={center} r="6" fill="#00FF66" />
              <Circle cx={center} cy={center} r="2.5" fill="#0B0D11" />
            </Svg>
          </View>

          {/* Metric Details Row */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>SUDUT KIBLAT</Text>
              <Text style={styles.metricValue}>{qiblaInfo.formattedDegrees}</Text>
              <Text style={styles.metricSub}>{qiblaInfo.compassDirection}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>JARAK KE KA'BAH</Text>
              <Text style={[styles.metricValue, { color: '#38BDF8' }]}>
                {qiblaInfo.formattedDistance}
              </Text>
              <Text style={styles.metricSub}>Makkah Al-Mukarramah</Text>
            </View>
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
    maxWidth: 440,
    backgroundColor: '#0B0D11',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#171B26',
    borderWidth: 1,
    borderColor: '#242B3D',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  changeText: {
    fontSize: 10,
    color: '#00FF66',
  },
  alignedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00FF66',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  alignedBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B0D11',
  },
  guideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  guideBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38BDF8',
  },
  compassWrapper: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#11141C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2432',
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00FF66',
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
