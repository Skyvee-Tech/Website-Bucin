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

export type Quotes = {
  first: string; // kutipan pertama
  second: string[]; // kutipan kedua, dipecah per kalimat
};

// Satu orang dalam "Buku Nikah Kita".
export type BookPerson = {
  label: string; // contoh: "Yang Tercinta" / "Yang Mencintai"
  name: string;
  photo: string; // lokasi file di /public
  photoAlt: string;
  // Tempat & tanggal lahir (ditampilkan tanpa label di bawah nama).
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
  marriageBook: MarriageBook;
  quotes: Quotes; // section "Kata-kata" (kini di dalam Surat untukmu)
  closingLetter: string[]; // teks penutup di akhir halaman (per paragraf)
  // Daftar lagu (file .mp3 di /public/music). Judul/artis/cover dibaca dari tag
  // ID3 masing-masing file. Satu entri = tombol maju/mundur dinonaktifkan.
  playlist: string[];
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
      birthPlaceDate: "Batang, 2 Juni 2008",
      // nickname: "", // TODO (opsional): isi julukan kalau mau (jangan dikarang)
    },
    right: {
      label: "Yang Mencintai",
      name: "GRESHYA FHAREL IBRAHIM",
      photo: "/photos/greshya.jpg",
      photoAlt: "Foto Greshya Fharel Ibrahim",
      birthPlaceDate: "Demak, 6 Desember 2006",
      // nickname: "", // TODO (opsional): isi julukan kalau mau (jangan dikarang)
    },
  },

  // Section "Kata-kata" — ditulis PERSIS sesuai permintaan (jangan diperbaiki).
  quotes: {
    first:
      "dan jika engkau adalah hujan badai yang penuh gemuruh, aku adalah yang tidak memilih berteduh.",
    // Kutipan kedua dipecah per kalimat agar muncul bertahap di HP.
    second: [
      " jika aku mencintaimu karena kamu baik, mungkin aku sudah tidak mencintaimu lagi saat pertama kali kau menyakitiku,",
      " jika alasanku mencintaimu karna penasaran, mungkin aku sudah tidak mencintaimu lagi saat sudah tau banyak tentangmu,",
      " jika alasanku mencintaimu karna kepribadianmu,mungkin aku sudah tidak mencintaimu lagi saat sudah mengetahui sikapmu di belakangku,",
      " tapi aku mencintaimu karna itu kamu, semua kurang lebihmu.",
    ],
  },

  // Teks penutup di akhir halaman — ditulis PERSIS (bahasa Inggris), per paragraf.
  closingLetter: [
    "sorry if i don't treat you the way you wanted to be treated. i'm sorry for not being enough for you. sorry i'm not good at fixing problems. but i hope you know that i'm always trying my best to be better for you.",
    "with or without me, go chase every dream you've ever talked about. become everything you told me you wanted to be. I'll still be smiling, watching you win from afar.",
    "If i see you falling in love with someone else, i wish you happiness always.",
    "And if i ever did hurt you and you never told me about it, i'm sorry.",
    "Don't worry about hurting my feelings, I've been left in the dark so many times, I've been everyone's last choice and I've have been pushed away. I've learned to accept the disappointed.",
    "Hard work don't scare me. I'll get my hands dirty, bleed a little, sweat a lot, and still won't quit. That's just me. Built to grind, build to endure, built to never give up.",
  ],

  // Daftar lagu latar (file .mp3 di public/music/). Tambah entri baru kalau
  // mau lebih dari satu lagu — tombol maju/mundur otomatis aktif.
  playlist: ["/music/lagu.mp3", "/music/lagu-2.mp3"],
};

export default site;
