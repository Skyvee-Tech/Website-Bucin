// ---------------------------------------------------------------------------
// withBase — helper untuk memberi prefix base path ke file di folder /public
// ---------------------------------------------------------------------------
// Kenapa perlu? Next.js otomatis menambahkan base path ke halaman & asset
// internalnya, TAPI TIDAK untuk file yang kita taruh sendiri di /public
// (foto & mp3). Kalau kita tulis src="/photos/kita.jpg", di GitHub Pages
// file itu dicari di root domain (https://username.github.io/photos/...)
// padahal aslinya ada di https://username.github.io/<nama-repo>/photos/...
//
// Solusinya: bungkus semua path dengan withBase("/photos/kita.jpg"), maka
// hasilnya otomatis "/<nama-repo>/photos/kita.jpg" saat build di GitHub.
//
// Cara pakai:
//   <img src={withBase("/photos/kita.jpg")} />
//   <audio src={withBase("/music/lagu.mp3")} />
//
// Catatan: env dibaca saat fungsi dipanggil (bukan saat import) supaya bisa
// diuji dengan mudah. Di browser, Next.js mengganti `process.env.NEXT_PUBLIC_*`
// dengan nilai literal saat build, jadi ini tetap bekerja di sisi klien.

export function withBase(path: string): string {
  // Base path: kosong saat dev lokal, "/<nama-repo>" saat build GitHub Pages.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  // Pastikan path selalu diawali "/" (contoh: "photos/a.jpg" -> "/photos/a.jpg")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Kalau base path kosong (dev lokal), langsung kembalikan path apa adanya.
  if (!base) return normalizedPath;

  // Cegah base path ditambahkan dua kali kalau path sudah punya prefix.
  if (normalizedPath.startsWith(`${base}/`)) return normalizedPath;

  return `${base}${normalizedPath}`;
}
