export interface Ayah {
  number: number;
  arab: string;
  latin: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  meaning: string;
  ayahCount: number;
  juz: number;
  type: 'Makkiyah' | 'Madaniyah';
  fadhilah: string;
  ayahs: Ayah[];
}

export const SURAH_LIST: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatihah',
    nameArabic: 'الفاتحة',
    meaning: 'Pembukaan',
    ayahCount: 7,
    juz: 1,
    type: 'Makkiyah',
    fadhilah: 'Ummul Kitab, penyembuh (Asy-Syifa), dan rukun utama dalam setiap rakaat sholat.',
    ayahs: [
      {
        number: 1,
        arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        latin: 'Bismillaahir-rahmaanir-rahiim',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.'
      },
      {
        number: 2,
        arab: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        latin: 'Al-hamdu lillaahi rabbil-\'aalamiin',
        translation: 'Segala puji bagi Allah, Tuhan seluruh alam.'
      },
      {
        number: 3,
        arab: 'الرَّحْمَٰنِ الرَّحِيمِ',
        latin: 'Ar-rahmaanir-rahiim',
        translation: 'Yang Maha Pengasih, Maha Penyayang.'
      },
      {
        number: 4,
        arab: 'مَالِكِ يَوْمِ الدِّينِ',
        latin: 'Maaliki yaumid-diin',
        translation: 'Pemilik hari pembalasan.'
      },
      {
        number: 5,
        arab: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        latin: 'Iyyaaka na\'budu wa iyyaaka nasta\'iin',
        translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.'
      },
      {
        number: 6,
        arab: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        latin: 'Ihdinas-siraatal-mustaqiim',
        translation: 'Tunjukilah kami jalan yang lurus,'
      },
      {
        number: 7,
        arab: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        latin: 'Siraatal-ladziina an\'amta \'alaihim gairil-magduubi \'alaihim wa lad-daalliin',
        translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.'
      }
    ]
  },
  {
    id: 67,
    name: 'Al-Mulk',
    nameArabic: 'الملك',
    meaning: 'Kerajaan',
    ayahCount: 30,
    juz: 29,
    type: 'Makkiyah',
    fadhilah: 'Penyelamat dari siksa kubur bila dibaca rutin setiap malam sebelum tidur (HR. Tirmidzi).',
    ayahs: [
      {
        number: 1,
        arab: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Tabaarakalladzii biyadihil-mulku wa huwa \'alaa kulli syai\'in qadiir',
        translation: 'Mahasuci Allah yang di tangan-Nyalah segala kerajaan, dan Dia Mahakuasa atas segala sesuatu.'
      },
      {
        number: 2,
        arab: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
        latin: 'Alladzii khalaqal-mauta wal-hayaata liyabluwakum ayyukum ahsanu \'amalaa, wa huwal-\'aziizul-gafuur',
        translation: 'Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Mahaperkasa, Maha Pengampun.'
      },
      {
        number: 3,
        arab: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
        latin: 'Alladzii khalaqa sab\'a samaawaatin tibaatan, maa taraa fii khalqir-rahmaani min tafaawutin farji\'il-basara hal taraa min futuur',
        translation: 'Yang menciptakan tujuh langit berlapis-lapis. Tidak akan kamu lihat sesuatu yang tidak seimbang pada ciptaan Tuhan Yang Maha Pengasih. Maka lihatlah sekali lagi, adakah kamu lihat sesuatu yang cacat?'
      },
      {
        number: 4,
        arab: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
        latin: 'Tsummarji\'il-basara karrataini yanqalib ilaikal-basaru khaasi\'an wa huwa hasiir',
        translation: 'Kemudian pandanglah sekali lagi dan sekali lagi niscaya penglihatanmu akan kembali kepadamu tanpa menemukan cacat dan ia (pandanganmu) dalam keadaan payah.'
      },
      {
        number: 5,
        arab: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
        latin: 'Wa laqad zayyannas-samaa\'ad-dunyaa bimasaabiiha wa ja\'alnaahaa rujuumal-lisy-syayaatiini wa a\'tadnaa lahum \'adzaabas-sa\'iir',
        translation: 'Dan sesungguhnya telah Kami hiasi langit yang dekat ini dengan bintang-bintang dan Kami jadikannya sebagai alat-alat pelempar setan, dan Kami sediakan bagi mereka siksa neraka yang menyala-nyala.'
      }
    ]
  },
  {
    id: 18,
    name: 'Al-Kahf',
    nameArabic: 'الكهف',
    meaning: 'Gua',
    ayahCount: 110,
    juz: 15,
    type: 'Makkiyah',
    fadhilah: 'Penerang cahaya di antara dua Jumat dan penjaga dari fitnah Dajjal (HR. Al-Hakim & Muslim).',
    ayahs: [
      {
        number: 1,
        arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا',
        latin: 'Al-hamdu lillaahilladzii anzala \'alaa \'abdihil-kitaaba wa lam yaj\'al lahuu \'iwajaa',
        translation: 'Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur\'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok;'
      },
      {
        number: 2,
        arab: 'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا',
        latin: 'Qayyiman liyundzira ba\'san syadiidan mil-ladunhu wa yubasysyiral-mu\'miniinalladziina ya\'maluunas-saalihaati anna lahum ajran hasanaa',
        translation: 'sebagai bimbingan yang lurus, untuk memperingatkan akan siksa yang sangat pedih dari sisi-Nya dan memberikan kabar gembira kepada orang-orang mukmin yang mengerjakan kebajikan bahwa mereka akan mendapat balasan yang baik,'
      },
      {
        number: 3,
        arab: 'مَّاكِثِينَ فِيهِ أَبَدًا',
        latin: 'Maakitsiina fiihi abadaa',
        translation: 'mereka kekal di dalamnya untuk selama-lamanya.'
      },
      {
        number: 4,
        arab: 'وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا',
        latin: 'Wa yundziralladziina qaaluttakhadzallaahu waladaa',
        translation: 'Dan untuk memperingatkan kepada orang yang berkata, "Allah mengambil seorang anak."'
      },
      {
        number: 5,
        arab: 'مَّا لَهُم بِهِ مِنْ عِلْمٍ وَلَا لِآبَائِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَاهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا',
        latin: 'Maa lahum bihii min \'ilmin wa laa li\'aabaa\'ihim, kaburat kalimatan takhruju min afwaahihim, in yaquuluuna illaa kadzibaa',
        translation: 'Mereka sama sekali tidak mempunyai pengetahuan tentang hal itu, begitu pula nenek moyang mereka. Alangkah jeleknya kata-kata yang keluar dari mulut mereka; mereka hanya mengatakan kebohongan belaka.'
      }
    ]
  },
  {
    id: 36,
    name: 'Yasin',
    nameArabic: 'يس',
    meaning: 'Yasin',
    ayahCount: 83,
    juz: 22,
    type: 'Makkiyah',
    fadhilah: 'Jantung Al-Qur\'an yang melembutkan hati dan mendatangkan pengampunan dosa bila dibaca ikhlas.',
    ayahs: [
      {
        number: 1,
        arab: 'يس',
        latin: 'Yaa Siin',
        translation: 'Yaa Siin.'
      },
      {
        number: 2,
        arab: 'وَالْقُرْآنِ الْحَكِيمِ',
        latin: 'Wal-qur\'aanil-hakiim',
        translation: 'Demi Al-Qur\'an yang penuh hikmah,'
      },
      {
        number: 3,
        arab: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
        latin: 'Innaka laminal-mursaliin',
        translation: 'sungguh, engkau (Muhammad) benar-benar salah seorang dari rasul-rasul,'
      },
      {
        number: 4,
        arab: 'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ',
        latin: '\'Alaa siraatin mustaqiim',
        translation: '(yang berada) di atas jalan yang lurus,'
      },
      {
        number: 5,
        arab: 'تَنزِيلَ الْعَزِيزِ الرَّحِيمِ',
        latin: 'Tanziilal-\'aziizir-rahiim',
        translation: '(sebagai wahyu) yang diturunkan oleh (Allah) Yang Mahaperkasa, Maha Penyayang,'
      }
    ]
  },
  {
    id: 55,
    name: 'Ar-Rahman',
    nameArabic: 'الرحمن',
    meaning: 'Yang Maha Pengasih',
    ayahCount: 78,
    juz: 27,
    type: 'Madaniyah',
    fadhilah: '\'Arusul Qur\'an (Pengantin Al-Qur\'an) yang mengingatkan hamba akan jutaan nikmat Allah Ta\'ala.',
    ayahs: [
      {
        number: 1,
        arab: 'الرَّحْمَٰنُ',
        latin: 'Ar-rahmaan',
        translation: '(Allah) Yang Maha Pengasih,'
      },
      {
        number: 2,
        arab: 'عَلَّمَ الْقُرْآنَ',
        latin: '\'Allamal-qur\'aan',
        translation: 'Yang telah mengajarkan Al-Qur\'an.'
      },
      {
        number: 3,
        arab: 'خَلَقَ الْإِنسَانَ',
        latin: 'Khalaqal-insaan',
        translation: 'Dia menciptakan manusia,'
      },
      {
        number: 4,
        arab: 'عَلَّمَهُ الْبَيَانَ',
        latin: '\'Allamahul-bayaan',
        translation: 'Mengajarnya pandai berbicara.'
      },
      {
        number: 5,
        arab: 'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ',
        latin: 'Asy-syamsu wal-qamaru bihusbaan',
        translation: 'Matahari dan bulan beredar menurut perhitungan.'
      },
      {
        number: 13,
        arab: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
        latin: 'Fabi\'ayyi aalaaa\'i rabbikumaa tukadzdzibaan',
        translation: 'Maka nikmat Tuhanmu yang manakah yang kamu dustakan?'
      }
    ]
  },
  {
    id: 56,
    name: 'Al-Waqi\'ah',
    nameArabic: 'الواقعة',
    meaning: 'Hari Kiamat',
    ayahCount: 96,
    juz: 27,
    type: 'Makkiyah',
    fadhilah: 'Surah pembuka pintu rezeki dan penangkal kefakiran/kemiskinan bagi pembacanya (Atsar Ibnu Mas\'ud).',
    ayahs: [
      {
        number: 1,
        arab: 'إِذَا وَقَعَتِ الْوَاقِعَةُ',
        latin: 'Idzaa waqa\'atil-waaqi\'ah',
        translation: 'Apabila terjadi hari Kiamat,'
      },
      {
        number: 2,
        arab: 'لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ',
        latin: 'Laisa liwaq\'atihaa kaadzibah',
        translation: 'terjadinya tidak dapat didustakan (disangkal).'
      },
      {
        number: 3,
        arab: 'خَافِضَةٌ رَّافِعَةٌ',
        latin: 'Khaafidatur-raafi\'ah',
        translation: '(Kejadian itu) merendahkan (satu golongan) dan meninggikan (golongan yang lain).'
      },
      {
        number: 4,
        arab: 'إِذَا رُجَّتِ الْأَرْضُ رَجًّا',
        latin: 'Idzaa rujjatil-ardu rajjaa',
        translation: 'Apabila bumi diguncangkan sedahsyat-dahsyatnya,'
      },
      {
        number: 5,
        arab: 'وَبُسَّتِ الْجِبَالُ بَسًّا',
        latin: 'Wa bussatil-jibaalu bassaa',
        translation: 'dan gunung-gunung dihancurluluhkan sehancur-hancurnya,'
      }
    ]
  },
  {
    id: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    meaning: 'Kemurnian Keesaan Allah',
    ayahCount: 4,
    juz: 30,
    type: 'Makkiyah',
    fadhilah: 'Setara dengan sepertiga Al-Qur\'an (Tsulutsul Qur\'an) pahala membacanya (HR. Bukhari).',
    ayahs: [
      {
        number: 1,
        arab: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        latin: 'Qul huwallaahu ahad',
        translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."'
      },
      {
        number: 2,
        arab: 'اللَّهُ الصَّمَدُ',
        latin: 'Allaahus-samad',
        translation: 'Allah tempat meminta segala sesuatu.'
      },
      {
        number: 3,
        arab: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        latin: 'Lam yalid wa lam yuulad',
        translation: '(Allah) tidak beranak dan tidak pula diperanakkan,'
      },
      {
        number: 4,
        arab: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        latin: 'Wa lam yakul lahuu kufuwan ahad',
        translation: 'dan tidak ada sesuatu yang setara dengan Dia.'
      }
    ]
  },
  {
    id: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    meaning: 'Waktu Subuh',
    ayahCount: 5,
    juz: 30,
    type: 'Makkiyah',
    fadhilah: 'Al-Mu\'awwidzatain: Perlindungan mutlak dari kejahatan malam, sihir, dan kedengkian manusia.',
    ayahs: [
      {
        number: 1,
        arab: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        latin: 'Qul a\'uudzu birabbil-falaq',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),'
      },
      {
        number: 2,
        arab: 'مِن شَرِّ مَا خَلَقَ',
        latin: 'Min syarri maa khalaq',
        translation: 'dari kejahatan (makhluk yang) Dia ciptakan,'
      },
      {
        number: 3,
        arab: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        latin: 'Wa min syarri gaasiqin idzaa waqab',
        translation: 'dan dari kejahatan malam apabila telah gelap gulita,'
      },
      {
        number: 4,
        arab: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        latin: 'Wa min syarrin-naffaatsaati fil-\'uqad',
        translation: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),'
      },
      {
        number: 5,
        arab: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        latin: 'Wa min syarri haasidin idzaa hasad',
        translation: 'dan dari kejahatan orang yang dengki apabila dia dengki."'
      }
    ]
  },
  {
    id: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    meaning: 'Manusia',
    ayahCount: 6,
    juz: 30,
    type: 'Makkiyah',
    fadhilah: 'Al-Mu\'awwidzatain: Benteng utama dari bisikan waswas setan jin dan manusia.',
    ayahs: [
      {
        number: 1,
        arab: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        latin: 'Qul a\'uudzu birabbin-naas',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,'
      },
      {
        number: 2,
        arab: 'مَلِكِ النَّاسِ',
        latin: 'Malikin-naas',
        translation: 'Raja manusia,'
      },
      {
        number: 3,
        arab: 'إِلَٰهِ النَّاسِ',
        latin: 'Ilaahin-naas',
        translation: 'sembahan manusia,'
      },
      {
        number: 4,
        arab: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        latin: 'Min syarril-waswaasil-khannaas',
        translation: 'dari kejahatan (bisikan) setan yang bersembunyi,'
      },
      {
        number: 5,
        arab: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        latin: 'Alladzii yuwaswisu fii suduurin-naas',
        translation: 'yang membisikkan (kejahatan) ke dalam dada manusia,'
      },
      {
        number: 6,
        arab: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        latin: 'Minal-jinnati wan-naas',
        translation: 'dari (golongan) jin dan manusia."'
      }
    ]
  }
];
