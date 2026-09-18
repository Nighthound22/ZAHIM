export interface DhikrItem {
  id: string;
  title: string;
  period: 'morning' | 'evening' | 'both';
  arabic: string;
  latin: string;
  translation: string;
  targetCount: number;
  benefits?: string;
}

export const DHIKR_ITEMS: DhikrItem[] = [
  {
    id: 'ayat-kursi',
    title: 'Ayat Kursi',
    period: 'both',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: "Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khudzuhuu sinatuw-walaa nawm, lahuu maa fis-samaawaati wa maa fil ardh, man dzalladzii yasyfa'u 'indahuu illaa bi-idznih, ya'lamu maa bayna aydiihim wa maa khalfahum, wa laa yuhiithuuna bi syay-im min 'ilmihii illaa bimaa syaa-a, wasi'a kursiyyuhus-samaawaati wal ardh, wa laa ya-uuduhuu hifzhuhumaa, wa huwal 'aliyyul 'azhiim.",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi...',
    targetCount: 1,
    benefits: 'Siapa yang membacanya di pagi hari akan dilindungi dari godaan jin hingga sore hari.'
  },
  {
    id: 'sayyidul-istighfar',
    title: 'Sayyidul Istighfar (Penghulu Istighfar)',
    period: 'both',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: "Allahumma anta rabbii laa ilaaha illaa anta khalaqtanii wa anaa 'abduka wa anaa 'alaa 'ahdika wa wa'dika mastatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u laka bidzanbii faghfir lii fa-innahuu laa yaghfirudz-dzunuuba illaa anta.",
    translation: 'Ya Allah, Engkau adalah Rabb-ku, tiada tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku memegang janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku, sesungguhnya tiada yang mengampuni dosa selain Engkau.',
    targetCount: 1,
    benefits: 'Siapa yang membacanya dengan yakin di pagi hari lalu wafat sebelum sore, ia termasuk penghuni surga (HR. Bukhari).'
  },
  {
    id: 'muawwidzatain',
    title: 'Surat Al-Ikhlas, Al-Falaq, & An-Naas',
    period: 'both',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ ...',
    latin: 'Membaca Surat Al-Ikhlas, Al-Falaq, dan An-Naas masing-masing sebanyak 3 kali.',
    translation: 'Membaca 3 surat perlindungan utama secara berurutan masing-masing 3 kali.',
    targetCount: 3,
    benefits: 'Cukuplah bagimu dari segala kejahatan (HR. Abu Dawud).'
  },
  {
    id: 'bismillahilladzi',
    title: 'Doa Perlindungan Pagi & Petang',
    period: 'both',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: "Bismillaahilladzii laa yadhurru ma'asmihii syai-un fil ardhi wa laa fis-samaa-i wa huwas-samii'ul 'aliim.",
    translation: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat mendatangkan bahaya, dan Dia Maha Mendengar lagi Maha Mengetahui.',
    targetCount: 3,
    benefits: 'Tidak akan ada bahaya yang mencelakainya pada hari/malam tersebut (HR. Tirmidzi).'
  },
  {
    id: 'radhitu-billah',
    title: 'Keridhaan kepada Allah & Islam',
    period: 'both',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    latin: "Radhiitu billaahi rabbaa, wa bil islaami diinaa, wa bi Muhammadin shallallaahu 'alayhi wa sallama nabiyyaa.",
    translation: 'Aku ridha Allah sebagai Rabb-ku, Islam sebagai agamaku, dan Muhammad shallallahu alaihi wa sallam sebagai Nabiku.',
    targetCount: 3,
    benefits: 'Wajib bagi Allah untuk meridhainya di hari kiamat (HR. Ahmad).'
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    title: 'Tasbih & Tahmid',
    period: 'both',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: "Subhaanallaahi wa bihamdih.",
    translation: 'Maha Suci Allah dan segala puji bagi-Nya.',
    targetCount: 100,
    benefits: 'Dihapuskan dosa-dosanya walaupun sebanyak buih di lautan (HR. Muslim).'
  },
  {
    id: 'tahlil-100',
    title: 'Tahlil Lengkap',
    period: 'both',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: "Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syay-in qadiir.",
    translation: 'Tidak ada tuhan selain Allah yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu.',
    targetCount: 10,
    benefits: 'Pahala seperti memerdekakan sepuluh budak dan dicatat 100 kebaikan (HR. Bukhari).'
  },
  {
    id: 'istighfar-100',
    title: 'Istighfar Harian',
    period: 'both',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    latin: "Astaghfirullaaha wa atuubu ilayh.",
    translation: 'Aku memohon ampunan kepada Allah dan bertobat kepada-Nya.',
    targetCount: 100,
    benefits: 'Nabi shallallahu alaihi wa sallam beristighfar 100 kali dalam sehari.'
  }
];
