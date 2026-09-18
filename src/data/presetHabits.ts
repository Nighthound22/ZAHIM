import { Habit } from '../types';

export const PRESET_HABITS: Habit[] = [
  {
    id: 'habit-tahajud',
    title: 'Shalat Tahajud',
    category: 'ibadah',
    timeSlot: '03:30',
    weight: 3,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#EF4444' // Red dot as shown in screenshot
  },
  {
    id: 'habit-subuh',
    title: 'Shalat Subuh Berjamaah',
    category: 'ibadah',
    timeSlot: '04:45',
    weight: 3,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#00FF66' // Green dot
  },
  {
    id: 'habit-tadarus',
    title: 'Tadarus Pagi',
    category: 'ibadah',
    timeSlot: '05:30',
    weight: 3,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#00FF66'
  },
  {
    id: 'habit-duha',
    title: 'Shalat Duha',
    category: 'ibadah',
    timeSlot: '08:00',
    weight: 2,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#00FF66'
  },
  {
    id: 'habit-toko',
    title: 'Jaga Toko & Kelola Bisnis',
    category: 'work',
    timeSlot: '09:00',
    weight: 2,
    frequency: 'weekdays',
    createdAt: new Date().toISOString(),
    color: '#A855F7' // Purple dot
  },
  {
    id: 'habit-dzuhur',
    title: 'Shalat Dzuhur',
    category: 'ibadah',
    timeSlot: '12:05',
    weight: 3,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#38BDF8' // Cyan dot
  },
  {
    id: 'habit-sidang',
    title: 'Kejar Sidang & Belajar Materi',
    category: 'personal',
    timeSlot: '13:30',
    weight: 2,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#EF4444' // Red dot
  },
  {
    id: 'habit-ashar',
    title: 'Shalat Ashar',
    category: 'ibadah',
    timeSlot: '15:20',
    weight: 3,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#38BDF8'
  },
  {
    id: 'habit-maghrib-isha',
    title: 'Shalat Maghrib & Isya Berjamaah',
    category: 'ibadah',
    timeSlot: '18:10',
    weight: 3,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    color: '#00FF66'
  }
];
