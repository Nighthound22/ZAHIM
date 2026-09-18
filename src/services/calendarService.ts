import { Habit, PrayerTimeItem } from '../types';
import { Platform } from 'react-native';

export class CalendarService {
  /**
   * Generates standard RFC 5545 iCalendar (.ics) format data
   * Compatible with Google Calendar, Microsoft Outlook, Apple Calendar
   */
  static generateICS(events: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    isBusy: boolean;
  }[]): string {
    const formatDate = (date: Date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ZAHIM//Zad Al-Himmah Calendar Engine//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:ZAHIM Rutinitas & Jadwal Ibadah'
    ];

    events.forEach((event, index) => {
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:zahim-${Date.now()}-${index}@zahim.id`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(event.startTime)}`,
        `DTEND:${formatDate(event.endTime)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `STATUS:CONFIRMED`,
        event.isBusy ? 'TRANSP:OPAQUE' : 'TRANSP:TRANSPARENT', // OPAQUE = Busy / Out of Office
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  }

  /**
   * Create Busy events for 5 Prayer Times today (15-20 min buffer)
   */
  static createPrayerBusyEvents(prayerItems: PrayerTimeItem[]): {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    isBusy: boolean;
  }[] {
    return prayerItems
      .filter((p) => p.name !== 'Sunrise') // Sunrise isn't a fardhu prayer
      .map((p) => {
        const start = new Date(p.dateObj);
        const end = new Date(p.dateObj.getTime() + 20 * 60 * 1000); // 20 minutes Out of Office
        return {
          title: `🕌 Sholat ${p.displayName} (ZAHIM Out-of-Office)`,
          description: `Blok waktu ibadah sholat ${p.displayName}. Status: Busy / Tidak dapat menerima panggilan rapat kerja.`,
          startTime: start,
          endTime: end,
          isBusy: true
        };
      });
  }

  /**
   * Create Habit time block events
   */
  static createHabitEvents(habits: Habit[], targetDate: Date = new Date()): {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    isBusy: boolean;
  }[] {
    return habits.map((h) => {
      const [hours, minutes] = h.timeSlot.split(':').map(Number);
      const start = new Date(targetDate);
      start.setHours(hours || 8, minutes || 0, 0, 0);
      const end = new Date(start.getTime() + 45 * 60 * 1000); // 45 min duration default

      return {
        title: `⚡ [ZAHIM] ${h.title}`,
        description: `Kategori: ${h.category.toUpperCase()} | Bobot Himmah: ${h.weight} Poin. Terjadwal dari aplikasi Zad Al-Himmah.`,
        startTime: start,
        endTime: end,
        isBusy: h.category === 'work' || h.category === 'ibadah'
      };
    });
  }

  /**
   * Downloads .ics file in Web/Laptop or triggers share in Mobile
   */
  static exportCalendarFile(icsData: string, filename: string = 'zahim-schedule.ics') {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // In native, could save to file system or clipboard
      return icsData;
    }
  }
}
