// ---------------------------------------------------------------------------
// SITE CONTENT — SEMUA KONTEN YANG BISA DIEDIT ADA DI FILE INI
// ---------------------------------------------------------------------------
// Kamu cukup ubah nilai-nilai di bawah ini, tidak perlu menyentuh kode
// komponen. Setelah diubah, jalankan ulang `npm run build`.
//
// Catatan soal FOTO & MUSIK:
// - Taruh file foto di folder  public/photos/  (contoh: kita-1.jpg)
// - Taruh file musik di folder public/music/  (contoh: lagu.mp3, WAJIB mp3)
// - Tulis path-nya di sini DIAWALI "/" tanpa "/public".
//   Contoh file public/photos/kita-1.jpg  ->  tulis "/photos/kita-1.jpg"
// Helper withBase() yang akan menambahkan prefix repo otomatis saat deploy.

// ---------------------------------------------------------------------------
// Tipe data (kontrak) supaya kalau salah tulis, editor langsung memberi tanda.
// ---------------------------------------------------------------------------
export type Photo = {
  src: string; // lokasi file di folder /public
  caption: string; // tulisan di bawah foto
  alt: string; // deskripsi foto untuk pembaca layar (aksesibilitas)
};

export type TimelineItem = {
  date: string; // contoh: "14 Februari 2023"
  title: string; // judul singkat momen
  description: string; // cerita singkat momen itu
};

export type Reason = {
  icon: string; // satu emoji sebagai ikon kartu
  title: string; // alasan singkat
  detail: string; // penjelasan singkat
};

export type SiteContent = {
  partnerName: string;
  myName: string;
  startDate: string; // format ISO: "YYYY-MM-DDTHH:mm:ss"
  openingQuote: string;
  openingSubtitle: string;
  photos: Photo[];
  timeline: TimelineItem[];
  letter: string;
  reasons: Reason[];
  closingTitle: string;
  closingMessage: string;
  musicSrc: string;
};

// ---------------------------------------------------------------------------
// ISI KONTEN — ganti teks di bawah dengan ceritamu sendiri ya!
// ---------------------------------------------------------------------------
export const site: SiteContent = {
  // Nama kalian (ditampilkan di hero & penutup).
  partnerName: "Sayang",
  myName: "Aku",

  // Tanggal jadian. Dipakai untuk penghitung hari bersama.
  // Format: Tahun-Bulan-Hari jam:menit:detik (contoh ini 14 Feb 2023, 20:00).
  startDate: "2023-02-14T20:00:00",

  // Kalimat pembuka di layar hero.
  openingQuote: "Setiap detik bersamamu adalah bagian terindah dari ceritaku.",
  openingSubtitle: "Sebuah halaman kecil yang kubuat khusus untukmu.",

  // Daftar foto. Tambah/hapus sesuai keinginan. caption & alt wajib diisi.
  photos: [
    {
      src: "/photos/kita-1.jpg",
      caption: "Pertama kali kita jalan bareng",
      alt: "Foto kami sedang berjalan berdua",
    },
    {
      src: "/photos/kita-2.jpg",
      caption: "Ketawa sampai lupa waktu",
      alt: "Foto kami tertawa bersama",
    },
    {
      src: "/photos/kita-3.jpg",
      caption: "Sore yang tidak akan kulupakan",
      alt: "Foto kami berdua menikmati sore hari",
    },
    {
      src: "/photos/kita-4.jpg",
      caption: "Kamu, aku, dan langit senja",
      alt: "Foto kami berdua dengan latar langit senja",
    },
    {
      src: "/photos/kita-5.jpg",
      caption: "Momen sederhana tapi paling berharga",
      alt: "Foto momen sederhana kami berdua",
    },
    {
      src: "/photos/kita-6.jpg",
      caption: "Terima kasih sudah selalu ada",
      alt: "Foto kami berdua saling tersenyum",
    },
  ],

  // Timeline kenangan — urut dari yang paling lama ke paling baru.
  timeline: [
    {
      date: "14 Februari 2023",
      title: "Hari kita mulai",
      description:
        "Hari pertama kamu bilang iya. Sejak itu duniamu jadi dunianya kita berdua.",
    },
    {
      date: "Maret 2023",
      title: "Jalan pertama",
      description:
        "Kita canggung, kita gugup, tapi pulangnya aku sadar aku betah sama kamu.",
    },
    {
      date: "Juni 2023",
      title: "Liburan kecil",
      description:
        "Perjalanan singkat yang bikin aku makin yakin mau jalan jauh sama kamu.",
    },
    {
      date: "Desember 2023",
      title: "Pertama kali ngambek",
      description:
        "Ternyata setelah ribut, aku makin sayang. Maaf kalau aku keras kepala ya.",
    },
    {
      date: "Hari ini",
      title: "Masih memilih kamu",
      description:
        "Dan setiap hari aku masih memilih kamu, lagi dan lagi, tanpa ragu.",
    },
  ],

  // Isi surat cinta. Pakai "\n\n" untuk memisahkan paragraf.
  letter: [
    "Untuk kamu yang selalu jadi alasan aku semangat,",
    "Aku tidak pandai merangkai kata, jadi kubuat halaman ini supaya kamu tahu betapa berartinya kamu. Terima kasih sudah sabar, sudah peduli, dan sudah memilih bertahan.",
    "Kalau suatu hari kamu merasa lelah, ingat ya, kamu tidak harus menjalani semuanya sendiri. Aku ada di sini, untuk dijadikan tempat pulang.",
    "Dengan sayang yang tidak akan pernah selesai,",
  ].join("\n\n"),

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

  // Kalimat penutup di bagian akhir halaman.
  closingTitle: "Aku cinta kamu 🤍",
  closingMessage:
    "Terima kasih sudah membuka halaman ini sampai selesai. Ini hadiah kecil dariku untukmu.",

  // File musik latar. Ganti dengan file mp3 milikmu di public/music/.
  musicSrc: "/music/lagu.mp3",
};

export default site;
