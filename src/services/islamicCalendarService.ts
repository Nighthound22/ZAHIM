export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  formatted: string;
  formattedWithDay: string;
}

export interface FastingInfo {
  isFastingDay: boolean;
  isForbidden: boolean;
  forbiddenReason?: string;
  fastingType: 'senin-kamis' | 'ayyamul-bidh' | 'asyura' | 'arafah' | 'dzulhijjah' | 'syawwal' | 'ramadhan' | 'none';
  title: string;
  badgeLabel: string;
  description: string;
  niatArabic: string;
  niatLatin: string;
  niatTranslation: string;
  hadits: string;
}

export interface UpcomingFastingItem {
  date: Date;
  dateStr: string;
  dayName: string;
  hijriFormatted: string;
  fastingTitle: string;
  fastingType: string;
  daysUntil: number;
}

const HIJRI_MONTHS = [
  { name: "Muharram", arabic: "محرّم" },
  { name: "Safar", arabic: "صفر" },
  { name: "Rabi'ul Awwal", arabic: "ربيع الأوّل" },
  { name: "Rabi'ul Akhir", arabic: "ربيع الآخر" },
  { name: "Jumadil Ula", arabic: "جمادى الأولى" },
  { name: "Jumadil Akhir", arabic: "جمادى الآخرة" },
  { name: "Rajab", arabic: "رجب" },
  { name: "Sya'ban", arabic: "شعبان" },
  { name: "Ramadhan", arabic: "رمضان" },
  { name: "Syawwal", arabic: "شوّال" },
  { name: "Dzulqa'dah", arabic: "ذو القعدة" },
  { name: "Dzulhijjah", arabic: "ذو الحجّة" },
];

export class IslamicCalendarService {
  /**
   * Calculates accurate Hijri date using Intl Umm al-Qura standard
   */
  static getHijriDate(date: Date = new Date()): HijriDateInfo {
    try {
      const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
      const parts = formatter.formatToParts(date);
      
      let day = 1;
      let month = 1;
      let year = 1448;

      parts.forEach((p) => {
        if (p.type === 'day') day = parseInt(p.value, 10);
        if (p.type === 'month') month = parseInt(p.value, 10);
        if (p.type === 'year') year = parseInt(p.value, 10);
      });

      const monthMeta = HIJRI_MONTHS[(month - 1) % 12] || HIJRI_MONTHS[0];

      const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayOfWeekName = daysOfWeek[date.getDay()];

      return {
        day,
        month,
        monthName: monthMeta.name,
        monthNameArabic: monthMeta.arabic,
        year,
        formatted: `${day} ${monthMeta.name} ${year} H`,
        formattedWithDay: `${dayOfWeekName}, ${day} ${monthMeta.name} ${year} H`,
      };
    } catch {
      // Fallback
      return {
        day: 6,
        month: 4,
        monthName: "Rabi'ul Akhir",
        monthNameArabic: 'ربيع الآخر',
        year: 1448,
        formatted: "6 Rabi'ul Akhir 1448 H",
        formattedWithDay: "Kamis, 6 Rabi'ul Akhir 1448 H",
      };
    }
  }

  /**
   * Checks if a given date is a Sunnah or obligatory fasting day, or forbidden day
   */
  static getFastingInfo(date: Date = new Date()): FastingInfo {
    const hijri = this.getHijriDate(date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday

    // 1. Check for Forbidden Days (Hari Diharamkan Berpuasa)
    // 1 Syawwal (Idul Fitri)
    if (hijri.month === 10 && hijri.day === 1) {
      return {
        isFastingDay: false,
        isForbidden: true,
        forbiddenReason: 'Hari Raya Idul Fitri (Diharamkan berpuasa)',
        fastingType: 'none',
        title: 'Hari Raya Idul Fitri',
        badgeLabel: 'Haram Berpuasa',
        description: 'Hari raya makan dan minum bagi kaum muslimin.',
        niatArabic: '',
        niatLatin: '',
        niatTranslation: '',
        hadits: 'Rasulullah melarang berpuasa pada dua hari raya: Idul Fitri dan Idul Adha. (HR. Bukhari & Muslim)',
      };
    }

    // 10 Dzulhijjah (Idul Adha) & 11, 12, 13 Dzulhijjah (Hari Tasyrik)
    if (hijri.month === 12 && [10, 11, 12, 13].includes(hijri.day)) {
      const isAdha = hijri.day === 10;
      return {
        isFastingDay: false,
        isForbidden: true,
        forbiddenReason: isAdha ? 'Hari Raya Idul Adha' : 'Hari Tasyrik (Diharamkan berpuasa)',
        fastingType: 'none',
        title: isAdha ? 'Hari Raya Idul Adha' : `Hari Tasyrik ke-${hijri.day - 10}`,
        badgeLabel: 'Haram Berpuasa',
        description: 'Hari tasyrik adalah hari makan, minum, dan mengingat Allah ta\'ala.',
        niatArabic: '',
        niatLatin: '',
        niatTranslation: '',
        hadits: 'Hari Tasyrik adalah hari makan, minum, dan mengingat Allah. (HR. Muslim)',
      };
    }

    // 2. Check for Obligatory Fasting (Bulan Ramadhan)
    if (hijri.month === 9) {
      return {
        isFastingDay: true,
        isForbidden: false,
        fastingType: 'ramadhan',
        title: `Puasa Wajib Ramadhan Hari ke-${hijri.day}`,
        badgeLabel: 'Puasa Wajib',
        description: 'Bulan suci diturunkannya Al-Qur\'an dan kewajiban puasa sebulan penuh.',
        niatArabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
        niatLatin: "Nawaitu shauma ghadin 'an adaa-i fardhi syahri ramadhaana hadzihis-sanati lillaahi ta'aalaa.",
        niatTranslation: 'Aku berniat puasa esok hari untuk menunaikan fardhu bulan Ramadhan tahun ini karena Allah Ta\'ala.',
        hadits: 'Barangsiapa berpuasa Ramadhan atas dasar iman dan mengharap pahala, diampuni dosa-dosanya yang telah lalu. (HR. Bukhari & Muslim)',
      };
    }

    // 3. Check for Ayyamul Bidh (13, 14, 15 setiap bulan Hijriah)
    if ([13, 14, 15].includes(hijri.day) && hijri.month !== 12) {
      return {
        isFastingDay: true,
        isForbidden: false,
        fastingType: 'ayyamul-bidh',
        title: `Puasa Sunnah Ayyamul Bidh (Hari ke-${hijri.day - 12})`,
        badgeLabel: 'Ayyamul Bidh',
        description: 'Puasa sunnah pertengahan bulan saat bulan purnama bersinar terang.',
        niatArabic: 'نَوَيْتُ صَوْمَ أَيَّامِ الْبِيضِ سُنَّةً لِلَّهِ تَعَالَى',
        niatLatin: "Nawaitu shauma ayyaamil biidhi sunnatan lillaahi ta'aalaa.",
        niatTranslation: 'Aku berniat puasa sunnah hari-hari putih (Ayyamul Bidh) karena Allah Ta\'ala.',
        hadits: 'Kekasihku (Rasulullah) mewasiatkan kepadaku tiga hal: puasa tiga hari setiap bulan, shalat dhuha dua rakaat, dan witir sebelum tidur. (HR. Bukhari)',
      };
    }

    // 4. Check for Puasa Arafah (9 Dzulhijjah)
    if (hijri.month === 12 && hijri.day === 9) {
      return {
        isFastingDay: true,
        isForbidden: false,
        fastingType: 'arafah',
        title: 'Puasa Sunnah Hari Arafah (9 Dzulhijjah)',
        badgeLabel: 'Puasa Arafah',
        description: 'Puasa sunnah yang paling utama di luar bulan Ramadhan.',
        niatArabic: 'نَوَيْتُ صَوْمَ عَرَفَةَ سُنَّةً لِلَّهِ تَعَالَى',
        niatLatin: "Nawaitu shauma 'arafata sunnatan lillaahi ta'aalaa.",
        niatTranslation: 'Aku berniat puasa sunnah Arafah karena Allah Ta\'ala.',
        hadits: 'Puasa hari Arafah menghapuskan dosa dua tahun: tahun yang lalu dan tahun yang akan datang. (HR. Muslim)',
      };
    }

    // 5. Check for Puasa Asyura (10 Muharram) & Tasu'a (9 Muharram)
    if (hijri.month === 1 && [9, 10].includes(hijri.day)) {
      const isAsyura = hijri.day === 10;
      return {
        isFastingDay: true,
        isForbidden: false,
        fastingType: 'asyura',
        title: isAsyura ? 'Puasa Sunnah Asyura (10 Muharram)' : 'Puasa Sunnah Tasu\'a (9 Muharram)',
        badgeLabel: isAsyura ? 'Puasa Asyura' : 'Puasa Tasu\'a',
        description: 'Puasa memperingati hari kemenangan Nabi Musa atas Fir\'aun.',
        niatArabic: isAsyura
          ? 'نَوَيْتُ صَوْمَ عَاشُورَاءَ سُنَّةً لِلَّهِ تَعَالَى'
          : 'نَوَيْتُ صَوْمَ تَاسُوعَاءَ سُنَّةً لِلَّهِ تَعَالَى',
        niatLatin: isAsyura
          ? "Nawaitu shauma 'aasyuuraa-a sunnatan lillaahi ta'aalaa."
          : "Nawaitu shauma taasu'aa-a sunnatan lillaahi ta'aalaa.",
        niatTranslation: `Aku berniat puasa sunnah ${isAsyura ? 'Asyura' : 'Tasu\'a'} karena Allah Ta'ala.`,
        hadits: 'Puasa hari Asyura, aku berharap kepada Allah agar menghapuskan dosa setahun yang lalu. (HR. Muslim)',
      };
    }

    // 6. Check for Puasa Senin & Kamis
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      const isSenin = dayOfWeek === 1;
      return {
        isFastingDay: true,
        isForbidden: false,
        fastingType: 'senin-kamis',
        title: `Puasa Sunnah Hari ${isSenin ? 'Senin' : 'Kamis'}`,
        badgeLabel: isSenin ? 'Puasa Senin' : 'Puasa Kamis',
        description: 'Hari diangkat dan dilaporkannya amal ibadah manusia kepada Allah Rabbul \'Alamin.',
        niatArabic: isSenin
          ? 'نَوَيْتُ صَوْمَ يَوْمِ الِاثْنَيْنِ سُنَّةً لِلَّهِ تَعَالَى'
          : 'نَوَيْتُ صَوْمَ يَوْمِ الْخَمِيسِ سُنَّةً لِلَّهِ تَعَالَى',
        niatLatin: isSenin
          ? "Nawaitu shauma yaumil itsnaini sunnatan lillaahi ta'aalaa."
          : "Nawaitu shauma yaumil khamiisi sunnatan lillaahi ta'aalaa.",
        niatTranslation: `Aku berniat puasa sunnah hari ${isSenin ? 'Senin' : 'Kamis'} karena Allah Ta'ala.`,
        hadits: 'Amal-amal manusia diperiksa di hadapan Allah pada hari Senin dan Kamis, maka aku menyukai agar amalku diperiksa saat aku sedang berpuasa. (HR. Tirmidzi)',
      };
    }

    // 7. Regular day (no specific sunnah fasting)
    return {
      isFastingDay: false,
      isForbidden: false,
      fastingType: 'none',
      title: 'Hari Biasa (Tidak Ada Puasa Khusus)',
      badgeLabel: 'Bukan Hari Puasa',
      description: 'Dianjurkan menjaga amalan shaleh dan mempersiapkan diri untuk puasa sunnah berikutnya.',
      niatArabic: '',
      niatLatin: '',
      niatTranslation: '',
      hadits: 'Barangsiapa berpuasa satu hari di jalan Allah, maka Allah akan menjauhkan wajahnya dari api neraka sejauh tujuh puluh tahun. (HR. Bukhari)',
    };
  }

  /**
   * Generates upcoming fasting schedule for the next 30 days
   */
  static getUpcomingFastingDays(daysAhead: number = 30): UpcomingFastingItem[] {
    const list: UpcomingFastingItem[] = [];
    const today = new Date();

    for (let i = 1; i <= daysAhead; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      const fasting = this.getFastingInfo(targetDate);
      if (fasting.isFastingDay) {
        const hijri = this.getHijriDate(targetDate);
        const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = daysOfWeek[targetDate.getDay()];

        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        const dateStr = `${targetDate.getDate()} ${months[targetDate.getMonth()]}`;

        list.push({
          date: targetDate,
          dateStr,
          dayName,
          hijriFormatted: hijri.formatted,
          fastingTitle: fasting.title,
          fastingType: fasting.badgeLabel,
          daysUntil: i,
        });
      }
    }

    return list;
  }
}
