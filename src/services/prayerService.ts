import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { PrayerTimeItem } from '../types';

export interface CityPreset {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const INDONESIAN_CITIES: CityPreset[] = [
  { name: 'DKI Jakarta', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { name: 'Surabaya', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
  { name: 'Bandung', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
  { name: 'Medan', latitude: 3.5952, longitude: 98.6722, timezone: 'Asia/Jakarta' },
  { name: 'Semarang', latitude: -6.9667, longitude: 110.4167, timezone: 'Asia/Jakarta' },
  { name: 'Makassar', latitude: -5.1477, longitude: 119.4327, timezone: 'Asia/Makassar' },
  { name: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
  { name: 'Palembang', latitude: -2.9761, longitude: 104.7754, timezone: 'Asia/Jakarta' },
  { name: 'Balikpapan', latitude: -1.2379, longitude: 116.8289, timezone: 'Asia/Makassar' },
  { name: 'Banda Aceh', latitude: 5.5483, longitude: 95.3238, timezone: 'Asia/Jakarta' },
  { name: 'Denpasar (Bali)', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  { name: 'Jayapura', latitude: -2.5916, longitude: 140.6690, timezone: 'Asia/Jayapura' }
];

export class PrayerService {
  static getCalculationParameters() {
    // Singapore method closely aligns with Kemenag RI (Fajr: 20°, Isha: 18°)
    const params = CalculationMethod.Singapore();
    params.madhab = Madhab.Shafi;
    return params;
  }

  static calculatePrayerTimes(lat: number, lng: number, date: Date = new Date()): {
    items: PrayerTimeItem[];
    nextPrayer: PrayerTimeItem | null;
    currentPrayer: PrayerTimeItem | null;
    isBufferTime: boolean; // H-15 minutes before next prayer
    bufferMinutesRemaining: number;
  } {
    const coordinates = new Coordinates(lat, lng);
    const params = this.getCalculationParameters();
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const formatTime = (d: Date) => {
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const now = new Date();

    const rawList: { name: PrayerTimeItem['name']; displayName: string; dateObj: Date }[] = [
      { name: 'Fajr', displayName: 'Subuh', dateObj: prayerTimes.fajr },
      { name: 'Sunrise', displayName: 'Syuruq', dateObj: prayerTimes.sunrise },
      { name: 'Dhuhr', displayName: 'Dzuhur', dateObj: prayerTimes.dhuhr },
      { name: 'Asr', displayName: 'Ashar', dateObj: prayerTimes.asr },
      { name: 'Maghrib', displayName: 'Maghrib', dateObj: prayerTimes.maghrib },
      { name: 'Isha', displayName: 'Isya', dateObj: prayerTimes.isha },
    ];

    // Identify next and current
    let nextIndex = rawList.findIndex(item => item.dateObj > now);
    let nextPrayerObj: PrayerTimeItem | null = null;
    let currentPrayerObj: PrayerTimeItem | null = null;

    if (nextIndex === -1) {
      // All prayers today have passed, next is Fajr tomorrow
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);
      nextPrayerObj = {
        name: 'Fajr',
        displayName: 'Subuh (Besok)',
        time: formatTime(tomorrowTimes.fajr),
        dateObj: tomorrowTimes.fajr,
        isPassed: false,
        isCurrent: false,
        isNext: true
      };
      currentPrayerObj = {
        name: 'Isha',
        displayName: 'Isya',
        time: formatTime(prayerTimes.isha),
        dateObj: prayerTimes.isha,
        isPassed: true,
        isCurrent: true,
        isNext: false
      };
    } else {
      const nextRaw = rawList[nextIndex];
      nextPrayerObj = {
        name: nextRaw.name,
        displayName: nextRaw.displayName,
        time: formatTime(nextRaw.dateObj),
        dateObj: nextRaw.dateObj,
        isPassed: false,
        isCurrent: false,
        isNext: true
      };
      
      const curIndex = nextIndex > 0 ? nextIndex - 1 : 0;
      currentPrayerObj = {
        name: rawList[curIndex].name,
        displayName: rawList[curIndex].displayName,
        time: formatTime(rawList[curIndex].dateObj),
        dateObj: rawList[curIndex].dateObj,
        isPassed: rawList[curIndex].dateObj < now,
        isCurrent: true,
        isNext: false
      };
    }

    const items: PrayerTimeItem[] = rawList.map(item => ({
      name: item.name,
      displayName: item.displayName,
      time: formatTime(item.dateObj),
      dateObj: item.dateObj,
      isPassed: item.dateObj < now,
      isCurrent: currentPrayerObj?.name === item.name,
      isNext: nextPrayerObj?.name === item.name
    }));

    // Buffer calculation: H-15 minutes
    let isBufferTime = false;
    let bufferMinutesRemaining = 0;
    if (nextPrayerObj) {
      const diffMs = nextPrayerObj.dateObj.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes > 0 && diffMinutes <= 15) {
        isBufferTime = true;
        bufferMinutesRemaining = diffMinutes;
      }
    }

    return {
      items,
      nextPrayer: nextPrayerObj,
      currentPrayer: currentPrayerObj,
      isBufferTime,
      bufferMinutesRemaining
    };
  }
}
