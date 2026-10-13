// ---------------------------------------------------------------------------
// SITE CONTENT — SEMUA KONTEN YANG BISA DIEDIT ADA DI FILE INI
// ---------------------------------------------------------------------------
// Kamu cukup ubah nilai-nilai di bawah ini, tidak perlu menyentuh kode
// komponen. Setelah diubah, jalankan ulang `npm run build`.
//
// Catatan soal FOTO & MUSIK:
// - Foto mentah taruh di raw-photos/, lalu jalankan `npm run photos`
//   (lihat scripts/optimize-photos.mjs). Hasilnya muncul di public/photos/.
// - File musik di public/music/ (contoh: lagu.mp3, WAJIB mp3)
// - Tulis path-nya di sini DIAWALI "/" tanpa "/public".
// Helper withBase() akan menambahkan prefix repo otomatis saat deploy.

// ---------------------------------------------------------------------------
// Tipe data (kontrak) supaya kalau salah tulis, editor langsung memberi tanda.
// ---------------------------------------------------------------------------
export type Photo = {
  src: string; // lokasi file di folder /public
  caption: string; // tulisan di bawah foto
  alt: string; // deskripsi foto untuk pembaca layar (aksesibilitas)
};

export type Reason = {
  icon: string; // satu emoji sebagai ikon kartu
  title: string; // alasan singkat
  detail: string; // penjelasan singkat
};

// Satu orang dalam "Buku Nikah Kita".
export type BookPerson = {
  label: string; // contoh: "Yang Tercinta" / "Yang Mencintai"
  name: string;
  photo: string; // lokasi file di /public
  photoAlt: string;
  // TODO (opsional): isi tempat/tanggal lahir kalau mau. JANGAN dikarang.
  birthPlaceDate?: string;
  // TODO (opsional): isi julukan/panggilan sayang kalau mau. JANGAN dikarang.
  nickname?: string;
};

export type MarriageBook = {
  title: string;
  subtitle: string;
  serial: string; // nomor seri fiktif
  since: string; // teks "Bersama sejak ..."
  stamp: string; // teks cap dekoratif
  promise: string; // satu kalimat janji
  left: BookPerson; // halaman kiri
  right: BookPerson; // halaman kanan
};

export type SiteContent = {
  partnerName: string;
  myName: string;
  startDate: string; // format ISO dengan zona waktu, contoh: "2024-03-28T00:00:00+07:00"
  openingQuote: string;
  openingSubtitle: string;
  loveWords: string[]; // kata-kata yang berjalan (marquee)
  photos: Photo[];
  letter: string;
  letterSignature: string; // tanda tangan di akhir surat
  reasons: Reason[];
  marriageBook: MarriageBook;
  closingTitle: string;
  closingMessage: string;
  musicSrc: string;
};

// ---------------------------------------------------------------------------
// ISI KONTEN
// ---------------------------------------------------------------------------
export const site: SiteContent = {
  // Nama kalian. partnerName dipakai di hero; myName di tanda tangan & footer.
  partnerName: "FIKA ARISTIA PRATAMA",
  myName: "GRESHYA FHAREL IBRAHIM",

  // Tanggal jadian (zona waktu WIB). Dipakai untuk penghitung hari bersama.
  startDate: "2024-03-28T00:00:00+07:00",

  // Kalimat pembuka di layar hero.
  openingQuote: "Setiap detik bersamamu adalah bagian terindah dari ceritaku.",
  openingSubtitle: "Sebuah halaman kecil yang kubuat khusus untukmu.",

  // Kata-kata yang berjalan (marquee) di halaman.
  loveWords: [
    "Selamanya",
    "Kamu & Aku",
    "Bahagia",
    "Rumah",
    "Sayang",
    "Cinta",
    "Kita",
    "Selalu",
  ],

  // Daftar foto galeri (hasil `npm run photos`, file di public/photos/).
  photos: [
    // TODO: ganti caption "Memori ke-N" dengan cerita aslinya.
    { src: "/photos/memori-01.jpg", caption: "Memori ke-1", alt: "Foto kenangan ke-1" },
    { src: "/photos/memori-02.jpg", caption: "Memori ke-2", alt: "Foto kenangan ke-2" },
    { src: "/photos/memori-03.jpg", caption: "Memori ke-3", alt: "Foto kenangan ke-3" },
    { src: "/photos/memori-04.jpg", caption: "Memori ke-4", alt: "Foto kenangan ke-4" },
    { src: "/photos/memori-05.jpg", caption: "Memori ke-5", alt: "Foto kenangan ke-5" },
    { src: "/photos/memori-06.jpg", caption: "Memori ke-6", alt: "Foto kenangan ke-6" },
    { src: "/photos/memori-07.jpg", caption: "Memori ke-7", alt: "Foto kenangan ke-7" },
    { src: "/photos/memori-08.jpg", caption: "Memori ke-8", alt: "Foto kenangan ke-8" },
    { src: "/photos/memori-09.jpg", caption: "Memori ke-9", alt: "Foto kenangan ke-9" },
    { src: "/photos/memori-10.jpg", caption: "Memori ke-10", alt: "Foto kenangan ke-10" },
  ],

  // Isi surat cinta. Pakai "\n\n" untuk memisahkan paragraf.
  letter: [
    "Untuk FIKA ARISTIA PRATAMA,",
    "Aku tidak pandai merangkai kata, jadi kubuat halaman ini supaya kamu tahu betapa berartinya kamu. Terima kasih sudah sabar, sudah peduli, dan sudah memilih bertahan.",
    "Kalau suatu hari kamu merasa lelah, ingat ya, kamu tidak harus menjalani semuanya sendiri. Aku ada di sini, untuk dijadikan tempat pulang.",
    "Dengan sayang yang tidak akan pernah selesai,",
  ].join("\n\n"),

  // Tanda tangan di akhir surat (juga tampil di footer).
  letterSignature: "GRESHYA FHAREL IBRAHIM",

  // Kartu "alasan aku sayang kamu". Bisa ditambah sebanyak apa pun.
  reasons: [
    {
      icon: "🌷",
      title: "Karena kamu kamu",
      detail: "Tidak perlu alasan rumit. Kamu sungguh jadi kamu, dan itu cukup.",
    },
    {
      icon: "☀️",
      title: "Bikin hariku cerah",
      detail: "Sekalipun hari berat, ngobrol sama kamu selalu menenangkan.",
    },
    {
      icon: "🤝",
      title: "Selalu ada",
      detail: "Kamu hadir di momen senangku dan tetap tinggal di momen sulitku.",
    },
    {
      icon: "😂",
      title: "Jokes receh kamu",
      detail: "Tertawa bareng kamu itu obat paling murah dan paling manjur.",
    },
    {
      icon: "🌟",
      title: "Kamu kuat",
      detail: "Lihat kamu berjuang bikin aku ikut ingin jadi lebih baik.",
    },
    {
      icon: "💗",
      title: "Cara kamu sayang",
      detail: "Detail kecil yang kamu lakukan, itu yang paling aku rindukan.",
    },
  ],

  // "Buku Nikah Kita" — versi romantis/candaan, bukan dokumen resmi.
  marriageBook: {
    title: "BUKU NIKAH KITA",
    subtitle: "Edisi Cinta",
    serial: "BN-28032024",
    since: "Bersama sejak 28 Maret 2024",
    stamp: "SAH MENURUT HATI",
    // Kalimat janji (boleh diganti).
    promise: "Aku janji akan terus memilihmu, menjaga, dan menemanimu di setiap keadaan.",
    left: {
      label: "Yang Tercinta",
      name: "FIKA ARISTIA PRATAMA",
      photo: "/photos/fika.jpg",
      photoAlt: "Foto Fika Aristia Pratama",
      // birthPlaceDate: "", // TODO: isi kalau mau (jangan dikarang)
      // nickname: "",        // TODO: isi kalau mau (jangan dikarang)
    },
    right: {
      label: "Yang Mencintai",
      name: "GRESHYA FHAREL IBRAHIM",
      photo: "/photos/greshya.jpg",
      photoAlt: "Foto Greshya Fharel Ibrahim",
      // birthPlaceDate: "", // TODO: isi kalau mau (jangan dikarang)
      // nickname: "",        // TODO: isi kalau mau (jangan dikarang)
    },
  },

  // Kalimat penutup di bagian akhir halaman.
  closingTitle: "Aku cinta kamu 🤍",
  closingMessage:
    "Terima kasih sudah membuka halaman ini sampai selesai. Ini hadiah kecil dariku untukmu.",

  // File musik latar. Ganti dengan file mp3 milikmu di public/music/.
  musicSrc: "/music/lagu.mp3",
};

export default site;
