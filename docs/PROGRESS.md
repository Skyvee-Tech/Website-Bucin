# PROGRESS — Bucin Web

Catatan keputusan teknis & progres lintas sesi. **Tanpa data pribadi**
(tidak ada nama, isi surat, foto, atau konten personal apa pun di sini).
Konten personal hanya ada di `src/content/site.ts`.

## Stack

- Next.js 16.4 (App Router) + TypeScript + Tailwind CSS v4.
- Animasi: paket `motion` (nama baru Framer Motion), import dari `motion/react`.
- Font: Playfair Display (judul) + Poppins (body) via `next/font/google`.
- Test logika murni: `node:test` bawaan Node + `tsx` (devDep). Tanpa framework berat.
- Deploy: static export (`output: 'export'`) ke GitHub Pages.

## Struktur

- `src/content/site.ts` — semua konten yang bisa diedit.
- `src/lib/withBase.ts` — tambah base path ke aset `/public` (foto & mp3).
- `src/lib/date.ts` — logika murni penghitung hari/jam/menit/detik.
- `src/lib/useReducedMotionSafe.ts` — deteksi "kurangi gerak" yang aman-hydration.
- `src/app/` — layout (font, metadata, viewport) + `page.tsx` (komposisi).
- `src/components/` — komponen kecil satu tanggung jawab:
  `MotionProvider`, `AudioProvider`, `OpenGate`, `MusicButton`, `Hero`,
  `FloatingHearts`, `WordMarquee`, `SectionReveal`, `Divider`, `Countdown`,
  `MarriageBook`, `Gallery`, `LoveLetter`, `KataKata`, `Closing`.
- `raw-photos/` — foto mentah (di-.gitignore; dioptimasi lewat `npm run photos`).
- `scripts/optimize-photos.mjs` + `src/content/photos-manifest.json` — pipeline foto.
- `public/photos`, `public/music` — aset hasil (di-commit).
- `.github/workflows/deploy.yml` — deploy otomatis ke GitHub Pages.
- `docs/superpowers/` — spec & plan (superpowers).

## Keputusan penting

- `next.config.ts`: `output:'export'`, `trailingSlash:true`, `images.unoptimized:true`,
  `basePath`/`assetPrefix` dari env `NEXT_PUBLIC_BASE_PATH`.
- `cacheComponents`/PPR dimatikan (tidak cocok untuk static export murni).
- Palet rose/blush/krem + emas; aksen emas `#8a6a1f` dipilih agar kontras teks
  >= 4.5:1 (versi lebih terang gagal WCAG AA).
- Mobile-first, `100dvh`, `env(safe-area-inset-*)`, target ketuk >= 44px,
  hormati `prefers-reduced-motion`.
- Partikel hati DETERMINISTIK (fungsi murni) + kurangi jumlah di layar kecil
  via CSS — hemat re-render & lolos lint React Compiler.
- Deteksi reduced-motion lewat `useSyncExternalStore` (bukan `useReducedMotion`
  framer-motion) untuk menghindari error hydration (#418).
- Test logika murni (`withBase`, `date`) via `node:test` + `tsx`; impor di
  test memakai ekstensi `.ts` (butuh `tsconfig.allowImportingTsExtensions`).
- shadcn/ui TIDAK dipakai (YAGNI + tidak ada MCP aktif).
- Base path diuji: build dengan `NEXT_PUBLIC_BASE_PATH=/website-bucin` -> aset
  jadi `/website-bucin/_next/...`.
- Verifikasi responsif nyata (Chrome headless): 360/390/768/1280 tanpa scroll
  horizontal; lightbox & flip card bekerja; hanya 404 `lagu.mp3` (belum diisi).

## Revisi setelah live

- Nama partner & pengirim diambil dari `site.ts` (bukan di file ini).
- `startDate` memakai offset WIB `+07:00`; penghitung menampilkan detik real-time.
- Section timeline DIHAPUS total (komponen + data).
- Pipeline foto: `sharp` (devDep) + `scripts/optimize-photos.mjs`; hanya memproses
  `memori-NN.jpg`, `fika.jpg`, `greshya.jpg`; `.rotate()` auto-orient; tanpa
  metadata (EXIF/GPS terhapus); manifest lebar×tinggi di `src/content/`.
- Galeri = masonry (CSS columns) memakai manifest (anti layout-shift), lightbox
  swipe dipertahankan. Caption masih placeholder "Memori ke-N" (TODO di site.ts).
- Section "Buku Nikah Kita": candaan, tanpa lambang negara; emas foil via CSS
  gradient; buka 3D (perspective+rotateY); `aria-expanded`; reduced-motion = fade;
  data opsional (tempat/tanggal lahir, julukan) dibiarkan TODO.
- Privasi: `robots noindex,nofollow` (metadata) + `public/robots.txt` Disallow.
- Animasi tambahan: marquee kata (`WordMarquee`), ornamen pembatas (`Divider`),
  hero (hati berdenyut + garis nama).
- Section "Kata-kata" (komponen `KataKata`) = dua kutipan (ditulis PERSIS),
  kutipan kedua dipecah per kalimat & muncul bertahap; menggantikan section
  "alasan sayang" (komponen `Reasons` dihapus).
- Teks penutup baru (`closingLetter`, bahasa Inggris, PERSIS) muncul bertahap
  per paragraf; tanda tangan + footer tetap menampilkan nama pengirim.
- Verifikasi ini: `npm test` 7/7, lint bersih, build PASS; headless tanpa error
  hydration; detik berdetak; buku `aria-expanded=true`.
- Section "Kata-kata" & "Penutup" DIHAPUS; seluruh teksnya digabung ke satu
  section **"Surat untukmu"** (`LoveLetter.tsx`): surat Indonesia (typewriter)
  → 2 kutipan → surat penutup Inggris → tanda tangan → footer. Kutipan kedua
  tetap dipecah per kalimat (muncul bertahap). Komponen `KataKata.tsx` &
  `Closing.tsx` dihapus; `page.tsx` kini berakhir di `<LoveLetter />`.

## Status fase

- [x] FASE 1 — Setup: scaffold, static export, `withBase`, `site.ts`. Build PASS.
- [x] FASE 2 — Desain & fitur: gate+musik, hero+hati, penghitung, galeri+lightbox,
  timeline, surat typewriter, kartu alasan, penutup. `npm test` 6/6, lint bersih,
  build PASS (lokal & dengan base path). Menunggu konfirmasi user.
- [x] FASE 3 — Live di `https://skyvee-tech.github.io/Website-Bucin/`.
- [x] Revisi (nama/tanggal/detik, hapus timeline, pipeline foto, galeri masonry,
  buku nikah, privasi, animasi). Menunggu commit/push dari user.

## Perbaikan error hydration pada FloatingHearts

- **Masalah:** console melaporkan `A tree hydrated but some attributes of the
  server rendered HTML didn't match the client properties` pada `FloatingHearts`.
  Catatan verifikasi sebelumnya ("headless tanpa error hydration") ternyata
  keliru — error ini nyata dan terulang di dev maupun build.
- **Akar masalah:** bukan nilai partikelnya (fungsi `pseudoRandom` sudah
  deterministik dan hasil server = browser), melainkan **presisi penulisan**.
  Browser memotong angka panjang jadi ~6 angka penting saat menyimpan gaya,
  sehingga `left: "5.721816935692914%"` tersimpan sebagai `5.72182%`, dan
  `width: 22.574022882356076` (angka telanjang) tersimpan sebagai `"22.574px"`.
  React membandingkan nilai yang ia tulis dengan yang ada di DOM, melihat beda,
  lalu melaporkan mismatch.
- **Perbaikan (`src/components/FloatingHearts.tsx`):** nilai `left` dan `size`
  dibulatkan 2 desimal lewat `bulat()` sebelum ditulis, dan satuan `px` ditulis
  eksplisit sebagai teks (bukan angka telanjang). Tidak ada perubahan tampilan.
- **Bukti:** setelah muat ulang, console **0 error**; 18 partikel tetap
  dirender (6 terlihat di layar HP), posisinya bergerak; `npm test` 7/7;
  lint bersih; `npm run build` PASS.
- **Peringatan lain di console — hasil penyelidikan:**
  - 3 font preload "tidak terpakai" dan petunjuk `loading="eager"` untuk LCP
    **hanya muncul di mode dev**. Dibuktikan: pada hasil `npm run build` yang
    disajikan sebagai berkas statis, console **bersih** tanpa keduanya. Penyebab
    di dev: indikator dev Next.js memuat fontnya sendiri (`__nextjs-Geist`) dan
    pemuatan lebih lambat, sehingga Chrome menganggap preload font belum
    terpakai dalam beberapa detik. **Tidak ada kode yang perlu diubah.**
  - Keempat bobot Poppins (300/400/500/600) **semuanya terpakai**, jadi tidak
    ada yang bisa dihapus. Bobot 600 dipakai cap dekoratif di dalam buku nikah
    (`MarriageBook.tsx` baris 241, memakai font body) — baru dirender setelah
    buku dibuka, makanya tampak "unloaded" saat buku masih tertutup.
  - Peringatan Chrome "Lazy-loaded images should have explicit dimensions
    (count: 10)": gambar galeri **sudah** punya `width`/`height` dari manifest
    dan CLS-nya memang sudah baik (0,0315; ambang "baik" 0,1) — jadi ini bukan
    masalah tata letak. Tetapi Chrome ternyata menuntut rasio ditulis
    **eksplisit** di CSS, bukan yang dihitung otomatis dari atribut
    (`auto 900 / 1600` dianggap belum cukup). **Perbaikan:** tambahkan
    `style={{ aspectRatio: ... }}` pada `Image` di `Gallery.tsx`.
    Hasilnya CLS **0** dan console produksi **benar-benar bersih (0 pesan)**.
    Foto buku nikah tidak perlu diubah karena wadahnya sudah ber-`aspect-[3/4]`.
- Setelah semua perbaikan: `npm test` 7/7, lint bersih, `npm run build` PASS,
  console produksi 0 pesan, CLS 0.

## Mode gelap/terang (toggle ikon vektor)

- Tombol bulat **kanan-atas**, ikon SVG vektor (bulan sabit saat terang,
  matahari saat gelap), bukan emoji. Selalu tampil, **termasuk sebelum gerbang
  dibuka** (z-51 di atas gate z-50); tidak bertabrakan dengan tombol musik
  (kanan-bawah).
- **Tanpa dependency baru** (bukan `next-themes`). Logika murni
  `src/lib/theme.ts` (+ test `node:test`), hook aman-hydration
  `src/lib/useTheme.ts` (pola `useSyncExternalStore`, sama seperti
  `useReducedMotionSafe`), komponen `src/components/ThemeToggle.tsx`.
- Tema disimpan di `localStorage["theme"]` ("light"|"dark"); kalau belum ada,
  ikut `prefers-color-scheme`. Pilihan manual menang atas sistem.
- Ikon ditampilkan lewat CSS berdasarkan `data-theme` (bukan state React), jadi
  ikon benar sudah tampil sejak frame pertama. `aria-pressed`/`aria-label`
  diambil dari hook (snapshot server "light") supaya tidak ada error hydration.
- **Anti-kedip:** skrip inline sinkron di awal `<body>` (`layout.tsx`)
  menetapkan `data-theme` **sebelum konten dilukis**; `<html>` pakai
  `suppressHydrationWarning`. Diukur dgn throttle Slow 3G: frame render pertama
  sudah gelap, **0 frame putih**.
- Tailwind v4 (tanpa `tailwind.config.js`): `@custom-variant dark
  (&:where([data-theme="dark"], [data-theme="dark"] *))` + timpa token `@theme`
  di `html[data-theme="dark"]`; `color-scheme` diatur per tema. Permukaan
  `bg-white/*` -> `bg-card/*`; glow `#ffe4ef` -> token `--color-glow`.
- Palet gelap: bg `#1b1218`, fg `#f3e8ee`, primary `#f472b6`, secondary
  `#f9a8d4`, accent `#e0c06a`, card `#241820`, muted `#2a1d25`, border `#3f2c37`.
  Kontras teks (dihitung): fg 15.34, primary 6.92, accent 10.40 — semua >= 4.5:1.
  Lighthouse accessibility **100** & audit `color-contrast` lulus di kedua tema.
- **Buku nikah ikut tema:** warna kertas jadi token `--book-*` + kelas
  `.book-paper` (mode terang tetap krem persis seperti sebelumnya; mode gelap
  jadi cokelat tua `#33291c/#2a2116/#241c12`). Memperbaiki teks tempat/tanggal
  lahir yang sebelumnya hilang di mode gelap (sekarang kontras 6.65–7.51:1).
  Bingkai/sudut emas, foil, dan sampul dibiarkan (memang objek fisik).
- Verifikasi: lint bersih, `npm test` **11/11**, `npm run build` PASS; console
  produksi **0 pesan** pada 360/390/768/1280 (tanpa scroll horizontal, tombol
  48x48 di dalam viewport).
- Belum diverifikasi dgn emulasi nyata: `prefers-reduced-motion` (tool tidak
  menyediakan emulasi; dicek lewat aturan CSS yang mematikan transisi + toggle
  yang tidak bergantung animasi). Catatan: `theme-color` (bilah browser)
  mengikuti setelan sistem, bukan pilihan manual user.
