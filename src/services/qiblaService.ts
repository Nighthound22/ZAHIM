export interface QiblaResult {
  bearingDegrees: number;
  formattedDegrees: string;
  compassDirection: string;
  distanceKm: number;
  formattedDistance: string;
  city: string;
  latitude: number;
  longitude: number;
}

export class QiblaService {
  // Ka'bah, Makkah Al-Mukarramah coordinates
  static readonly KAABA_LAT = 21.422487;
  static readonly KAABA_LNG = 39.826206;

  /**
   * Calculates Qibla bearing angle and distance from given latitude & longitude
   */
  static calculateQibla(latitude: number, longitude: number, city: string = 'Lokasi Pengguna'): QiblaResult {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(latitude);
    const lng1 = toRad(longitude);
    const lat2 = toRad(this.KAABA_LAT);
    const lng2 = toRad(this.KAABA_LNG);

    const deltaLng = lng2 - lng1;

    // Forward Azimuth formula for Great Circle navigation
    const y = Math.sin(deltaLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);
    let qiblaBearing = toDeg(Math.atan2(y, x));

    // Normalize to 0 - 360 degrees
    qiblaBearing = (qiblaBearing + 360) % 360;

    // Distance calculation using Haversine formula
    const earthRadiusKm = 6371;
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(earthRadiusKm * c);

    // Cardinal direction
    const cardinalDirections = [
      'Utara (North)',
      'Timur Laut (NE)',
      'Timur (East)',
      'Tenggara (SE)',
      'Selatan (South)',
      'Barat Daya (SW)',
      'Barat (West)',
      'Barat Laut (NW)',
    ];
    const index = Math.round(qiblaBearing / 45) % 8;
    const compassDirection = cardinalDirections[index];

    return {
      bearingDegrees: Math.round(qiblaBearing * 10) / 10,
      formattedDegrees: `${Math.round(qiblaBearing)}°`,
      compassDirection,
      distanceKm,
      formattedDistance: `${distanceKm.toLocaleString('id-ID')} km`,
      city,
      latitude,
      longitude,
    };
  }
}
