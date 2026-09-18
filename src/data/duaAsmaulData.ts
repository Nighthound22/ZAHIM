export interface AsmaulHusnaItem {
  id: number;
  arabic: string;
  latin: string;
  translation: string;
  fadhilah: string;
}

export interface DailyDuaItem {
  id: string;
  category: 'tidur' | 'sholat' | 'aktivitas' | 'rezeki' | 'perlindungan';
  categoryLabel: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  reference: string;
}

export const ASMAUL_HUSNA: AsmaulHusnaItem[] = [
  { id: 1, arabic: 'الرَّحْمَنُ', latin: 'Ar-Rahman', translation: 'Yang Maha Pengasih', fadhilah: 'Menebarkan kasih sayang dan melembutkan hati yang keras.' },
  { id: 2, arabic: 'الرَّحِيمُ', latin: 'Ar-Rahim', translation: 'Yang Maha Penyayang', fadhilah: 'Mendatangkan rahmat dan pertolongan Allah di dunia & akhirat.' },
  { id: 3, arabic: 'الْمَلِكُ', latin: 'Al-Malik', translation: 'Yang Maha Merajai', fadhilah: 'Diberikan wibawa dan kecukupan hidup dari segala arah.' },
  { id: 4, arabic: 'الْقُدُّوسُ', latin: 'Al-Quddus', translation: 'Yang Mahasuci', fadhilah: 'Membersihkan hati dari rasa dengki, riya, dan kotoran batin.' },
  { id: 5, arabic: 'السَّلَامُ', latin: 'As-Salam', translation: 'Yang Maha Memberi Kesejahteraan', fadhilah: 'Memberi ketenteraman jiwa, keselamatan keluarga & harta.' },
  { id: 6, arabic: 'الْمُؤْمِنُ', latin: 'Al-Mu\'min', translation: 'Yang Maha Memberi Keamanan', fadhilah: 'Diberikan rasa aman dari segala ketakutan dan fitnah zaman.' },
  { id: 7, arabic: 'الْمُهَيْمِنُ', latin: 'Al-Muhaimin', translation: 'Yang Maha Mengatur & Mengawasi', fadhilah: 'Menjaga kewaspadaan diri dari kemaksiatan dan kelalaian.' },
  { id: 8, arabic: 'الْعَزِيزُ', latin: 'Al-\'Aziz', translation: 'Yang Mahaperkasa', fadhilah: 'Menguatkan mental, dijauhkan dari kehinaan di hadapan manusia.' },
  { id: 9, arabic: 'الْجَبَّارُ', latin: 'Al-Jabbar', translation: 'Yang Maha Menundukkan', fadhilah: 'Memulihkan hati yang patah dan melindungi dari kedzaliman.' },
  { id: 10, arabic: 'الْمُتَكَبِّرُ', latin: 'Al-Mutakabbir', translation: 'Yang Maha Megah / Memiliki Kebesaran', fadhilah: 'Menyadarkan diri akan ketiadaan daya di hadapan kebesaran-Nya.' },
  { id: 11, arabic: 'الْخَالِقُ', latin: 'Al-Khaliq', translation: 'Yang Maha Pencipta', fadhilah: 'Membuka kreativitas dan ketajaman akal dalam berkarya.' },
  { id: 12, arabic: 'الْبَارِئُ', latin: 'Al-Bari\'', translation: 'Yang Maha Mengadakan dari Ketiadaan', fadhilah: 'Diberikan kelapangan saat menghadapi keruwetan masalah.' },
  { id: 13, arabic: 'الْمُصَوِّرُ', latin: 'Al-Mushawwir', translation: 'Yang Maha Membentuk Rupa', fadhilah: 'Membentuk keindahan akhlak dan keselarasan hidup.' },
  { id: 14, arabic: 'الْغَفَّارُ', latin: 'Al-Ghaffar', translation: 'Yang Maha Pengampun', fadhilah: 'Menghapuskan dosa-dosa dan menutupi aib hamba-Nya.' },
  { id: 15, arabic: 'الْقَهَّارُ', latin: 'Al-Qahhar', translation: 'Yang Maha Memaksa / Menaklukkan', fadhilah: 'Menaklukkan hawa nafsu dan bisikan setan dalam diri.' },
  { id: 16, arabic: 'الْوَهَّابُ', latin: 'Al-Wahhab', translation: 'Yang Maha Pemberi Karunia', fadhilah: 'Mendatangkan rezeki tak terduga dan kemudahan rezeki.' },
  { id: 17, arabic: 'الرَّزَّاقُ', latin: 'Ar-Razzaq', translation: 'Yang Maha Memberi Rezeki', fadhilah: 'Membuka pintu rezeki halal, berkah, dan berlimpah ruah.' },
  { id: 18, arabic: 'الْفَتَّاحُ', latin: 'Al-Fattah', translation: 'Yang Maha Membuka Pintu Rahmat', fadhilah: 'Membuka jalan buntu, rezeki, dan pintu ilmu pengetahuan.' },
  { id: 19, arabic: 'الْعَلِيمُ', latin: 'Al-\'Alim', translation: 'Yang Maha Mengetahui', fadhilah: 'Dianugerahi hikmah, kepahaman agama, dan daya ingat kuat.' },
  { id: 20, arabic: 'الْقَابِضُ', latin: 'Al-Qabidh', translation: 'Yang Maha Menyempitkan', fadhilah: 'Menjaga diri dari pemborosan dan rasa tamak duniawi.' },
  { id: 21, arabic: 'الْبَاسِطُ', latin: 'Al-Basith', translation: 'Yang Maha Melapangkan', fadhilah: 'Melapangkan dada dari rasa sempit dan depresi.' },
  { id: 22, arabic: 'الْخَافِضُ', latin: 'Al-Khafidh', translation: 'Yang Maha Merendahkan', fadhilah: 'Menundukkan kesombongan musuh yang berbuat zalim.' },
  { id: 23, arabic: 'الرَّافِعُ', latin: 'Ar-Rafi\'', translation: 'Yang Maha Meninggikan Derajat', fadhilah: 'Meninggikan derajat keimanan dan kehormatan di masyarakat.' },
  { id: 24, arabic: 'الْمُعِزُّ', latin: 'Al-Mu\'izz', translation: 'Yang Maha Memuliakan', fadhilah: 'Diberi kemuliaan dan kehormatan tanpa bergantung makhluk.' },
  { id: 25, arabic: 'الْمُذِلُّ', latin: 'Al-Mudzill', translation: 'Yang Maha Menghinakan', fadhilah: 'Menghindarkan diri dari jebakan makar dan tipu daya.' },
  { id: 26, arabic: 'السَّمِيعُ', latin: 'As-Sami\'', translation: 'Yang Maha Mendengar', fadhilah: 'Doa-doa senantiasa didengar dan diijabah oleh-Nya.' },
  { id: 27, arabic: 'الْبَصِيرُ', latin: 'Al-Bashir', translation: 'Yang Maha Melihat', fadhilah: 'Menganugerahkan bashirah (ketajaman mata hati).' },
  { id: 28, arabic: 'الْحَكَمُ', latin: 'Al-Hakam', translation: 'Yang Maha Menetapkan Hukum', fadhilah: 'Diberi kemampuan membedakan kebenaran dari kebatilan.' },
  { id: 29, arabic: 'الْعَدْلُ', latin: 'Al-\'Adl', translation: 'Yang Mahaadil', fadhilah: 'Memperoleh keadilan dan bimbingan bersikap adil.' },
  { id: 30, arabic: 'اللَّطِيفُ', latin: 'Al-Lathif', translation: 'Yang Mahalembut', fadhilah: 'Menghilangkan kesusahan hidup dengan jalan yang amat halus.' },
  { id: 31, arabic: 'الْخَبِيرُ', latin: 'Al-Khabir', translation: 'Yang Maha Mengenal Segala Hal', fadhilah: 'Diberikan kepekaan intuisi dan kehati-hatian dalam bertindak.' },
  { id: 32, arabic: 'الْحَلِيمُ', latin: 'Al-Halim', translation: 'Yang Maha Penyantun', fadhilah: 'Menenangkan amarah dan mendidik kesabaran yang lapang.' },
  { id: 33, arabic: 'الْعَظِيمُ', latin: 'Al-\'Azhim', translation: 'Yang Mahaagung', fadhilah: 'Mendapat penghormatan dan perlindungan dari marabahaya.' },
  { id: 34, arabic: 'الْغَفُورُ', latin: 'Al-Ghafur', translation: 'Yang Maha Pengampun', fadhilah: 'Melenyapkan kecemasan atas dosa-dosa masa lalu.' },
  { id: 35, arabic: 'الشَّكُورُ', latin: 'Asy-Syakur', translation: 'Yang Maha Menghargai', fadhilah: 'Melipatgandakan pahala amal kebaikan yang sedikit.' },
  { id: 36, arabic: 'الْعَلِيُّ', latin: 'Al-\'Aliyy', translation: 'Yang Mahatinggi', fadhilah: 'Mengangkat cita-cita spiritual melampaui gemerlap dunia.' },
  { id: 37, arabic: 'الْكَبِيرُ', latin: 'Al-Kabir', translation: 'Yang Mahabesar', fadhilah: 'Membuka kemudahan urusan-urusan besar yang tampak mustahil.' },
  { id: 38, arabic: 'الْحَفِيظُ', latin: 'Al-Hafizh', translation: 'Yang Maha Memelihara & Menjaga', fadhilah: 'Benteng penjagaan mutlak bagi jiwa, keluarga, dan keturunan.' },
  { id: 39, arabic: 'الْمُقِيتُ', latin: 'Al-Muqit', translation: 'Yang Maha Memberi Kecukupan', fadhilah: 'Menjamin kecukupan nafkah rohani dan jasmani.' },
  { id: 40, arabic: 'الْحَسِيبُ', latin: 'Al-Hasib', translation: 'Yang Maha Menghisab & Menjamin', fadhilah: 'Cukuplah Allah sebagai pelindung dalam setiap kekhawatiran.' },
  { id: 41, arabic: 'الْجَلِيلُ', latin: 'Al-Jalil', translation: 'Yang Mahamulia & Memiliki Kebesaran', fadhilah: 'Memberikan kharisma wibawa yang diridhai Allah.' },
  { id: 42, arabic: 'الْكَرِيمُ', latin: 'Al-Karim', translation: 'Yang Mahadermawan', fadhilah: 'Mendatangkan kemuliaan akhlak dan kedermawanan hidup.' },
  { id: 43, arabic: 'الرَّقِيبُ', latin: 'Ar-Raqib', translation: 'Yang Maha Mengawasi', fadhilah: 'Menghadirkan ihsan (merasa selalu dalam pengawasan Allah).' },
  { id: 44, arabic: 'الْمُجِيبُ', latin: 'Al-Mujib', translation: 'Yang Maha Mengabulkan Doa', fadhilah: 'Mempercepat terkabulnya permohonan yang dipanjatkan.' },
  { id: 45, arabic: 'الْوَاسِعُ', latin: 'Al-Wasi\'', translation: 'Yang Mahaluas Karunia-Nya', fadhilah: 'Meluaskan rezeki dan kelapangan pikiran saat buntu.' },
  { id: 46, arabic: 'الْحَكِيمُ', latin: 'Al-Hakim', translation: 'Yang Mahabijaksana', fadhilah: 'Menganugerahkan hikmah dalam mengambil keputusan sulit.' },
  { id: 47, arabic: 'الْوَدُودُ', latin: 'Al-Wadud', translation: 'Yang Maha Mencintai Hamba-Nya', fadhilah: 'Menebarkan rasa cinta dan keharmonisan dalam rumah tangga.' },
  { id: 48, arabic: 'الْمَجِيدُ', latin: 'Al-Majid', translation: 'Yang Mahamulia', fadhilah: 'Membersihkan kehormatan diri dari fitnah orang lain.' },
  { id: 49, arabic: 'الْبَاعِثُ', latin: 'Al-Ba\'its', translation: 'Yang Maha Membangkitkan', fadhilah: 'Membangkitkan kembali semangat ibadah yang sempat redup.' },
  { id: 50, arabic: 'الشَّهِيدُ', latin: 'Asy-Syahid', translation: 'Yang Maha Menyaksikan', fadhilah: 'Meneguhkan kejujuran dan integritas dalam beramal.' },
  { id: 51, arabic: 'الْحَقُّ', latin: 'Al-Haqq', translation: 'Yang Mahabenar', fadhilah: 'Menegakkan kebenaran dan menepis segala kebingungan batin.' },
  { id: 52, arabic: 'الْوَكِيلُ', latin: 'Al-Wakil', translation: 'Yang Maha Memelihara Urusan', fadhilah: 'Ketenangan tawakkal sejati atas masa depan dan rezeki.' },
  { id: 53, arabic: 'الْقَوِيُّ', latin: 'Al-Qawiyy', translation: 'Yang Mahakuat', fadhilah: 'Diberi kekuatan fisik dan mental menghadapi cobaan berat.' },
  { id: 54, arabic: 'الْمَتِينُ', latin: 'Al-Matin', translation: 'Yang Mahakukuh', fadhilah: 'Meneguhkan keistiqamahan di jalan Sunnah.' },
  { id: 55, arabic: 'الْوَلِيُّ', latin: 'Al-Waliyy', translation: 'Yang Maha Melindungi', fadhilah: 'Dijadikan sebagai kekasih Allah yang selalu dibimbing-Nya.' },
  { id: 56, arabic: 'الْحَمِيدُ', latin: 'Al-Hamid', translation: 'Yang Maha Terpuji', fadhilah: 'Menjadikan lisan senantiasa basah dengan syukur.' },
  { id: 57, arabic: 'الْمُحْصِي', latin: 'Al-Muhshi', translation: 'Yang Maha Menghitung Segala Amal', fadhilah: 'Mendorong muhasabah dan kehati-hatian dalam bertutur kata.' },
  { id: 58, arabic: 'الْمُبْدِئُ', latin: 'Al-Mubdi\'', translation: 'Yang Maha Memulai Penciptaan', fadhilah: 'Memudahkan awal mula pekerjaan atau bisnis yang dirintis.' },
  { id: 59, arabic: 'الْمُعِيدُ', latin: 'Al-Mu\'id', translation: 'Yang Maha Mengembalikan', fadhilah: 'Mengembalikan ketenangan dan apa yang sempat hilang.' },
  { id: 60, arabic: 'الْمُحْيِي', latin: 'Al-Muhyi', translation: 'Yang Maha Menghidupkan', fadhilah: 'Menghidupkan hati yang mati dan menyembuhkan penyakit.' },
  { id: 61, arabic: 'الْمُمِيتُ', latin: 'Al-Mumit', translation: 'Yang Maha Mematikan', fadhilah: 'Mematikan hawa nafsu buruk dan mengingat hakikat kematian.' },
  { id: 62, arabic: 'الْحَيُّ', latin: 'Al-Hayyu', translation: 'Yang Mahahidup Kekal', fadhilah: 'Ismul A\'zham penyegar energi kehidupan dan penghilang letih.' },
  { id: 63, arabic: 'الْقَيُّومُ', latin: 'Al-Qayyum', translation: 'Yang Maha Berdiri Sendiri', fadhilah: 'Doa Ya Hayyu Ya Qayyum melenyapkan segala duka nestapa.' },
  { id: 64, arabic: 'الْوَاجِدُ', latin: 'Al-Wajid', translation: 'Yang Maha Menemukan', fadhilah: 'Mempertemukan dengan solusi yang sedang dicari-cari.' },
  { id: 65, arabic: 'الْمَاجِدُ', latin: 'Al-Majid', translation: 'Yang Mahamulia & Agung', fadhilah: 'Menganugerahkan cahaya kemuliaan dalam beragama.' },
  { id: 66, arabic: 'الْوَاحِدُ', latin: 'Al-Wahid', translation: 'Yang Maha Tunggal', fadhilah: 'Menghilangkan rasa takut kepada selain Allah.' },
  { id: 67, arabic: 'الْأَحَدُ', latin: 'Al-Ahad', translation: 'Yang Maha Esa', fadhilah: 'Memurnikan tauhid dan menjauhkan dari syirik tersembunyi.' },
  { id: 68, arabic: 'الصَّمَدُ', latin: 'Ash-Shamad', translation: 'Yang Menjadi Tempat Bergantung', fadhilah: 'Tidak membutuhkan pertolongan selain dari Allah Ta\'ala.' },
  { id: 69, arabic: 'الْقَادِرُ', latin: 'Al-Qadir', translation: 'Yang Mahakuasa', fadhilah: 'Menghilangkan rasa putus asa atas cita-cita mulia.' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', latin: 'Al-Muqtadir', translation: 'Yang Maha Menentukan', fadhilah: 'Menerima takdir Allah dengan lapang dada dan ridha.' },
  { id: 71, arabic: 'الْمُقَدِّمُ', latin: 'Al-Muqaddim', translation: 'Yang Maha Mendahulukan', fadhilah: 'Didahulukan dalam kebaikan dan saf terdepan pahala.' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', latin: 'Al-Mu\'akhkhir', translation: 'Yang Maha Mengakhirkan', fadhilah: 'Menjauhkan dari ketergesa-gesaan yang berujung sesal.' },
  { id: 73, arabic: 'الْأَوَّلُ', latin: 'Al-Awwal', translation: 'Yang Maha Awal Tanpa Permulaan', fadhilah: 'Menjadikan Allah sebagai tujuan pertama dalam berniat.' },
  { id: 74, arabic: 'الْآخِرُ', latin: 'Al-Akhir', translation: 'Yang Maha Akhir Tanpa Batas', fadhilah: 'Memperoleh husnul khatimah di akhir perjalanan hidup.' },
  { id: 75, arabic: 'الظَّاهِرُ', latin: 'Azh-Zhahir', translation: 'Yang Mahanyata Tanda Kebesaran-Nya', fadhilah: 'Melihat tanda-tanda kebesaran Allah pada alam semesta.' },
  { id: 76, arabic: 'الْبَاطِنُ', latin: 'Al-Bathin', translation: 'Yang Mahagaib', fadhilah: 'Diberikan pemahaman atas rahasia hikmah di balik ujian.' },
  { id: 77, arabic: 'الْوَالِي', latin: 'Al-Wali', translation: 'Yang Maha Memerintah & Menguasai', fadhilah: 'Diberi perlindungan kepemimpinan yang adil dan bijak.' },
  { id: 78, arabic: 'الْمُتَعَالِي', latin: 'Al-Muta\'ali', translation: 'Yang Mahatinggi dari Segala Kelemahan', fadhilah: 'Mengangkat martabat hamba yang tawadhu.' },
  { id: 79, arabic: 'الْبَرُّ', latin: 'Al-Barr', translation: 'Yang Maha Melimpahkan Kebaikan', fadhilah: 'Membimbing untuk selalu berbakti pada orang tua dan sesama.' },
  { id: 80, arabic: 'التَّوَّابُ', latin: 'At-Tawwab', translation: 'Yang Maha Menerima Taubat', fadhilah: 'Memudahkan hamba untuk senantiasa bertaubat nasuha.' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', latin: 'Al-Muntaqim', translation: 'Yang Maha Memberi Balasan Setimpal', fadhilah: 'Menyerahkan kezaliman orang jahat kepada keadilan Allah.' },
  { id: 82, arabic: 'الْعَفُوُّ', latin: 'Al-\'Afuww', translation: 'Yang Maha Pemaaf Tanpa Bekas', fadhilah: 'Doa malam Lailatul Qadar pembersih catatan dosa.' },
  { id: 83, arabic: 'الرَّءُوفُ', latin: 'Ar-Ra\'uf', translation: 'Yang Maha Belas Kasih', fadhilah: 'Menumbuhkan kasih sayang terhadap fakir miskin dan anak yatim.' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', latin: 'Malikul Mulk', translation: 'Penguasa Kerajaan Semesta', fadhilah: 'Menyadari bahwa segala jabatan dan harta hanyalah titipan.' },
  { id: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', latin: 'Dzul Jalali Wal Ikram', translation: 'Pemilik Keagungan & Kemuliaan', fadhilah: 'Ismul A\'zham yang menjadikan doa diijabah.' },
  { id: 86, arabic: 'الْمُقْسِطُ', latin: 'Al-Muqsit', translation: 'Yang Maha Mengadili dengan Tepat', fadhilah: 'Mencegah diri dari berbuat zhalim kepada bawahan.' },
  { id: 87, arabic: 'الْجَامِعُ', latin: 'Al-Jami\'', translation: 'Yang Maha Mengumpulkan', fadhilah: 'Mengumpulkan kembali keluarga yang tercerai-berai.' },
  { id: 88, arabic: 'الْغَنِيُّ', latin: 'Al-Ghaniyy', translation: 'Yang Mahakaya Tanpa Butuh Apapun', fadhilah: 'Menganugerahkan kekayaan hati (qana\'ah) dan kecukupan.' },
  { id: 89, arabic: 'الْمُغْنِي', latin: 'Al-Mughni', translation: 'Yang Maha Menganugerahi Kekayaan', fadhilah: 'Membukakan pintu kelimpahan materi dan spiritual.' },
  { id: 90, arabic: 'الْمَانِعُ', latin: 'Al-Mani\'', translation: 'Yang Maha Mencegah Bahaya', fadhilah: 'Mencegah mara bahaya dan fitnah sebelum terjadi.' },
  { id: 91, arabic: 'الضَّارُّ', latin: 'Adh-Dharr', translation: 'Yang Maha Memberi Mudharat (atas Izin-Nya)', fadhilah: 'Menyadari tiada mudharat melainkan dengan izin Allah semata.' },
  { id: 92, arabic: 'النَّافِعُ', latin: 'An-Nafi\'', translation: 'Yang Maha Memberi Manfaat', fadhilah: 'Menjadikan diri bermanfaat luas bagi umat manusia.' },
  { id: 93, arabic: 'النُّورُ', latin: 'An-Nur', translation: 'Yang Maha Bercahaya Menerangi', fadhilah: 'Menerangi hati, wajah, dan kubur dengan nur keimanan.' },
  { id: 94, arabic: 'الْهَادِي', latin: 'Al-Hadi', translation: 'Yang Maha Memberi Petunjuk', fadhilah: 'Menunjukkan jalan lurus dalam kebimbangan.' },
  { id: 95, arabic: 'الْبَدِيعُ', latin: 'Al-Badi\'', translation: 'Yang Maha Pencipta Keindahan Tanpa Tanding', fadhilah: 'Menganugerahkan gagasan brilian dan karya bernilai tinggi.' },
  { id: 96, arabic: 'الْبَاقِي', latin: 'Al-Baqi', translation: 'Yang Mahakekal Abadi', fadhilah: 'Mengarahkan fokus pada amal jariyah yang abadi di akhirat.' },
  { id: 97, arabic: 'الْوَارِثُ', latin: 'Al-Warits', translation: 'Yang Maha Mewarisi Semesta', fadhilah: 'Diberi keturunan yang shalih dan mewarisi kebaikan.' },
  { id: 98, arabic: 'الرَّشِيدُ', latin: 'Ar-Rasyid', translation: 'Yang Mahapandai & Memberi Petunjuk Benar', fadhilah: 'Membimbing kecerdasan menuju keputusan yang berkah.' },
  { id: 99, arabic: 'الصَّبُورُ', latin: 'Ash-Shabur', translation: 'Yang Mahasabar', fadhilah: 'Menganugerahkan kesabaran tanpa batas saat diuji.' }
];

export const DAILY_DUAS: DailyDuaItem[] = [
  {
    id: 'dua-tidur-1',
    category: 'tidur',
    categoryLabel: 'Sebelum & Bangun Tidur',
    title: 'Doa Bangun Tidur',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Al-hamdu lillaahil-ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin-nusyuur.',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami (tidur) dan hanya kepada-Nya kami dibangkitkan.',
    reference: 'HR. Bukhari no. 6312 & Muslim no. 2711'
  },
  {
    id: 'dua-tidur-2',
    category: 'tidur',
    categoryLabel: 'Sebelum & Bangun Tidur',
    title: 'Doa Hendak Tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    latin: 'Bismikallaahumma amuutu wa ahyaa.',
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    reference: 'HR. Bukhari no. 6324 & Muslim no. 2711'
  },
  {
    id: 'dua-masjid-1',
    category: 'sholat',
    categoryLabel: 'Sholat & Masjid',
    title: 'Doa Masuk Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allaahummaftah lii abwaaba rahmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    reference: 'HR. Muslim no. 713'
  },
  {
    id: 'dua-masjid-2',
    category: 'sholat',
    categoryLabel: 'Sholat & Masjid',
    title: 'Doa Keluar Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allaahumma innii as-aluka min fadlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon keutamaan dan karunia dari-Mu.',
    reference: 'HR. Muslim no. 713'
  },
  {
    id: 'dua-rumah-1',
    category: 'aktivitas',
    categoryLabel: 'Aktivitas & Perjalanan',
    title: 'Doa Keluar Rumah (Tawakkal)',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Bismillaahi tawakkaltu \'alallaahi, laa haula wa laa quwwata illaa billaah.',
    translation: 'Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan tiada kekuatan melainkan dengan pertolongan Allah.',
    reference: 'HR. Abu Dawud no. 5095 & Tirmidzi no. 3426 (Shahih)'
  },
  {
    id: 'dua-istighfar-1',
    category: 'perlindungan',
    categoryLabel: 'Perlindungan & Hati',
    title: 'Sayyidul Istighfar (Penghulu Istighfar)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: 'Allaahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa \'abduka, wa anaa \'alaa \'ahdika wa wa\'dika mastatha\'tu, a\'uudzu bika min syarri maa shana\'tu, abuu-u laka bini\'matika \'alayya, wa abuu-u laka bidzanbii faghfir lii fa-innahuu laa yaghfirudz-dzunuuba illaa anta.',
    translation: 'Ya Allah, Engkau adalah Tuhanku, tiada tuhan yang berhak disembah selain Engkau. Engkau menciptakanku dan aku adalah hamba-Mu. Aku memegang janji-Mu semampuku. Aku berlindung dari keburukan yang telah aku perbuat. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku, maka ampunilah aku, sesungguhnya tiada yang mengampuni dosa selain Engkau.',
    reference: 'HR. Bukhari no. 6306 (Barang siapa membacanya di waktu petang lalu meninggal, ia masuk surga)'
  },
  {
    id: 'dua-rezeki-1',
    category: 'rezeki',
    categoryLabel: 'Rezeki & Kelapangan',
    title: 'Doa Perlindungan dari Kesedihan & Lilitan Hutang',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    latin: 'Allaahumma innii a\'uudzu bika minal-hammi wal-hazan, wa a\'uudzu bika minal-\'ajzi wal-kasal, wa a\'uudzu bika minal-jubni wal-bukhl, wa a\'uudzu bika min ghalabatid-daini wa qahrir-rijaal.',
    translation: 'Ya Allah, aku berlindung kepada-Mu dari rasa gelisah dan sedih, aku berlindung kepada-Mu dari kelemahan dan kemalasan, aku berlindung kepada-Mu dari sifat pengecut dan kikir, serta aku berlindung kepada-Mu dari lilitan hutang dan penindasan orang lain.',
    reference: 'HR. Abu Dawud no. 1555 (Shahih)'
  },
  {
    id: 'dua-majlis-1',
    category: 'aktivitas',
    categoryLabel: 'Aktivitas & Perjalanan',
    title: 'Doa Kafaratul Majlis (Penutup Pertemuan)',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    latin: 'Subhaanakallaahumma wa bihamdika, asyhadu allaa ilaaha illaa anta, astaghfiruka wa atuubu ilaik.',
    translation: 'Mahasuci Engkau ya Allah dan dengan memuji-Mu, aku bersaksi bahwa tiada sesembahan yang berhak disembah selain Engkau, aku memohon ampunan kepada-Mu dan bertaubat kepada-Mu.',
    reference: 'HR. Tirmidzi no. 3433 & Abu Dawud no. 4859 (Shahih)'
  }
];
