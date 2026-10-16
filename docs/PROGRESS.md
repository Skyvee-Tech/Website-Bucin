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
- **Tombol tema dipindah** ke kanan-bawah, bersebelahan dengan tombol musik
  (pembungkus `FloatingControls`; `z-[51]` sehingga tetap di atas gerbang).
- **Player musik** (`MusicPanel` + `MusicButton`): tombol bulat membuka panel
  berisi cover art, judul/artis, geser posisi, dan prev/play/next. State pemutar
  ada di `AudioProvider` (playlist, indeks, waktu, MediaSession).
- **Daftar lagu**: `site.playlist` (array). Satu entri = tombol maju/mundur
  nonaktif. Judul/artis/cover dibaca dari **tag ID3** file mp3 oleh
  `src/lib/id3.ts` (fungsi murni, + `id3.test.ts`) dan `src/lib/trackMeta.ts`
  (unduh hanya byte tag lewat streaming, bukan seluruh file). Tanpa dependency
  baru. Kalau mp3 tidak punya gambar (`APIC`), panel menampilkan ikon hati.
  Catatan: `lagu.mp3` saat ini TIDAK punya `APIC`, jadi cover belum tampil.
- Pelajaran: listener event audio yang dipasang di `useEffect` bisa kalah balap
  dengan `loadedmetadata` (duration terbaca 0). Solusi: pakai event handler
  React langsung pada elemen `<audio>`.
- **Slider posisi musik diperbaiki**: dulu pakai `h-1` (area sentuh 4px) sehingga
  thumb gepeng & susah digeser, dan nilai ter-controlled `currentTime` menarik
  thumb kembali. Sekarang kelas `.music-range` (track tipis + thumb 16px, area
  sentuh 28px) + state `scrub` (nilai ditahan saat digeser, seek saat dilepas).
- **Catatan alat uji (penting):** server statis pratinjau untuk folder `out/`
  HARUS mendukung **HTTP Range**. Kalau tidak, Chrome menandai audio
  `seekable=[0,0]` dan geser posisi tampak rusak padahal aplikasinya benar.
  GitHub Pages & `next dev` sudah mendukung Range.

## Hemat kuota & pratinjau saat dibagikan

- `<audio>` memakai `preload="metadata"` (bukan `auto`) supaya lagu 5 MB TIDAK
  diunduh saat halaman dibuka. Pembacaan tag ID3 (`src/lib/trackMeta.ts`) juga
  memakai **HTTP Range** (dua permintaan kecil: header 10 byte, lalu isi tag),
  dengan fallback baca-stream-lalu-batalkan kalau server tak mendukung Range.
  Hasil terverifikasi: semua permintaan `lagu.mp3` saat halaman dimuat = `206`
  (bukan `200` full-body); judul/artis tetap terbaca.
- Pratinjau link saat dibagikan (WhatsApp/IG): `src/app/opengraph-image.png`
  (1200x630, lewat file convention Next) + `metadataBase`/`openGraph`/`twitter`
  di `layout.tsx`. **Penting:** `metadataBase` memakai **origin saja** —
  Next menambahkan base path sendiri ke aset metadata, kalau dobel URL-nya rusak.
  Gambar dibuat ulang lewat `scripts/og-card.html` (render 1200x630 di browser).

## Judul tab & logo (favicon)

- Judul tab dokumen: **"Skyvee Tech"** (`metadata.title`). Judul pratinjau share
  (`openGraph`/`twitter`) sengaja **tetap "Untuk Kamu"** supaya selaras dengan
  gambar OG-nya.
- Logo tab: `src/app/icon.svg` — huruf **"S"** ber-gradasi rose→emas di badge
  plum berbingkai emas (vektor, tajam di semua ukuran). Favicon bawaan Next
  (`src/app/favicon.ico`, kotak hitam "N") DIHAPUS supaya logo ini yang dipakai.
- Ikon iOS ("Add to Home Screen"): `src/app/apple-icon.png` (180x180, persegi
  penuh tanpa transparansi & tanpa bingkai — iOS membulatkan sudutnya sendiri).
  Dibuat ulang lewat **`npm run apple-icon`** (`scripts/make-apple-icon.mjs`,
  memakai `sharp`).

## Ikon S gaya racing (revisi, pakai skill logo-design)

- `src/app/icon.svg` sekarang: tile plum gelap (#1B1218) + huruf **S** yang
  diambil sebagai **outline dari font** `RacingSportDisplay-q2o72.otf`
  (diekstrak via `fontTools` → path, **bukan `<text>`**), diwarnai cream (#FFF7FA),
  ada `<title>`. Audit `svg_audit.py`: 97/100, 2 warna, tanpa gradien.
- **Small-size cut (disengaja):** huruf diberi `stroke-width="10"` (sewarna) karena
  bentuk fontnya tipis di 16 px. Diuji: 0 = tipis, **10 = pas**, 18 = counter
  menutup. Jadi ada 1 stroke di file — itu koreksi optis, bukan kecelakaan.
- Alasan tidak pakai versi "bold rancangan sendiri": user memilih pakai font ini.
- `apple-icon.png` kini **diturunkan dari `icon.svg`** (sumber tunggal) —
  `scripts/make-apple-icon.mjs` membaca fill/path/stroke dari icon.svg.
- `favicon.ico` DILEPAS: dengan basePath, file convention `app/favicon.ico` tidak
  diberi `<link>` oleh Next, dan menaruh `icons` di `metadata` justru MENIMPA link
  `icon.svg`/`apple-icon` (jangan diulang). Ikon tab mengandalkan `icon.svg`
  (Chrome/Firefox/Safari 16+), apple-icon untuk iOS.
- Lisensi: font itu **DEMO / personal use only** (fontspace, multypestudio).
  Dipakai atas permintaan user untuk keperluan pribadi.

## Performa (LCP) & PWA

- **Diukur dulu** (situs live, 390 px, CPU 4×, Slow 4G, cache dingin):
  **LCP 2.889 ms**, **CLS 0,00**, TTFB 3 ms. Elemen LCP = `<h1>` nama; 99,9 %
  waktunya "render delay". Penyebab: konten di atas layar dirender **`opacity: 0`**
  oleh `motion`, baru muncul setelah JS diunduh + hydration + animasi.
- **Perbaikan:** hilangkan `opacity` dari state awal animasi **di atas layar**
  (`Hero` → `item.hidden = { y: 22 }`; kartu `OpenGate` → `initial = { y, scale }`).
  Konten kini terlukis sejak paint pertama, animasi tetap jalan (transform).
  Diukur ulang: delay **setelah CSS 2.886 ms → ~434 ms** (CLS tetap 0,00; sisa
  biaya = parsing HTML/CSS di CPU 4×). **Aturan:** animasi `opacity` hanya untuk
  bagian DI BAWAH layar (`SectionReveal`), jangan untuk konten di atas layar.
- **PWA:**
  - `src/app/manifest.ts` (`dynamic = "force-static"`) — name, `start_url`,
    `scope`, `display: standalone`, `theme_color`, + 3 ikon; semua via `withBase`.
  - Ikon: `public/icons/{icon-192,icon-512,maskable-512}.png` + `src/app/apple-icon.png`
    dibuat oleh **`npm run icons`** (`scripts/make-icons.mjs`) dari SATU sumber
    `icon.svg` (skrip `make-apple-icon.mjs` lama digantikan).
  - `public/sw.js` — service worker **tulisan sendiri, tanpa dependency**:
    navigasi network-first (fallback cache/halaman offline), aset statis
    cache-first, **audio TIDAK di-cache** (respons 206/Range tak bisa disimpan
    Cache API). Ada `VERSION` untuk membuang cache lama.
  - `src/components/ServiceWorkerRegister.tsx` — daftar SW **hanya produksi** dan
    setelah `load`, supaya tidak berebut bandwidth dengan render awal.
  - `appleWebApp` di metadata (iOS Home Screen).
  - Diuji: SW aktif & mengontrol halaman; **server dimatikan → halaman tetap
    terbuka penuh dari cache** (`servedBySW: true`, `transferSize: 0`).

## Daftar lagu (playlist)

- `site.playlist` → `["/music/lagu.mp3", "/music/lagu-2.mp3"]`. Begitu ada >1 lagu,
  tombol **prev/next otomatis aktif** dan `loop` dimatikan (lagu lanjut sendiri
  saat habis). Terverifikasi: **next** → "Harvey / Her's" (`lagu-2.mp3`) sambil
  tetap diputar, **prev** → kembali ke "Brooklyn Baby".
- `lagu-2.mp3` (8,06 MB) dari `Her's - Harvey (Official Audio).mp3`. File sumber
  TIDAK punya tag judul/artis dan tanpa cover, jadi tag **ID3v2.3** (TIT2
  "Harvey", TPE1 "Her's") ditulis ulang lewat skrip Node (tanpa ffmpeg).
- Panel pemutar: kalau sebuah mp3 tidak punya judul, tampil "Tanpa judul"
  (bukan "Memuat…" selamanya).

## Polish UI: progress lagu, transisi tema, focus ring

- **Progress lagu terisi**: track `.music-range` diwarnai lewat custom property
  `--p` (diisi `MusicPanel` dari posisi/durasi), jadi bagian yang sudah diputar
  berwarna primary dan sisanya abu.
- **Transisi tema: DIHAPUS — tema kini ganti seketika.** Diukur di HP lemah
  (CPU 6×, 390 px, situs live): transisi `*` → ~760 ms long task & 8 frame >50 ms;
  transisi `body` saja (180 ms) → 55–258 ms long task; **tanpa transisi → 0**.
  Sebabnya: background `body` adalah **gradien seluas layar**, jadi setiap frame
  animasi = paint ulang seluruh viewport. Jangan dihidupkan lagi tanpa mengukur.
  Catatan penting: sisa "jank" kadang muncul **justru tanpa ganti tema** (kontrol
  tanpa toggle sempat 200 ms long task) — itu dari animasi dekoratif yang berjalan
  terus (hati melayang & marquee), bukan dari ganti tema.
- **Fade tema singkat HANYA desktop** (lebih dari 768 px): `body` diberi transisi
  160 ms di dalam `@media (min-width: 768px) and (prefers-reduced-motion:
  no-preference)`. Di HP tidak ada transisi (terukur paling berat di sana).

## Animasi berhenti saat tidak terlihat

- `src/lib/useActiveMotion.ts` — `active` = elemen ada di viewport
  (IntersectionObserver, margin 150 px) **dan** tab terlihat
  (`visibilitychange` via `useSyncExternalStore`, snapshot server `true`).
- Dipakai untuk menghentikan kerja yang tak terlihat:
  - `FloatingHearts`: partikel **di-unmount** saat keluar viewport (aman, karena
    animasinya mulai dari bawah = di luar layar).
  - `Countdown`: **interval 1 detik berhenti** saat di luar viewport (angka beku,
    dihitung ulang saat kembali) — ini kerja JS yang sebelumnya jalan selamanya.
  - `Hero`, `Divider`, `LoveLetter`: denyut hati berhenti saat tidak terlihat.
  - `WordMarquee`: jeda **hanya saat tab disembunyikan** — kalau dihentikan saat
    keluar layar, tinggi berubah & posisi teks melompat (CLS).
- Terverifikasi: partikel 18 → **0** saat digulir jauh → 18 lagi saat naik;
  penghitung **beku** (22→22) saat di luar layar dan **berdetak** (19→22, 47→50)
  saat terlihat; transisi `body` = `0s` di HP dan `0.16s` di desktop.
- **Jumlah hati diperbanyak** atas permintaan user: `TOTAL` 18 → **32** dan yang
  tampil di HP (`MOBILE_VISIBLE`) 6 → **12** (desktop tetap 32).

## Uji menyeluruh (regresi) setelah perubahan

Dijalankan pada **build produksi** (dilayani statis) di viewport 390 px + 3 lebar lain:
lint bersih, `npm test` lolos, `npm run build` PASS, lalu di browser:
gerbang terbuka, tema gelap→terang **tersimpan setelah reload**, penghitung
**berdetak**, player: 2 lagu (Brooklyn Baby ↔ Harvey/Her's), tombol prev/next
**aktif**, tombol play/pause ada, progress `--p` terisi; lightbox galeri terbuka
& tertutup dengan `Esc` (scroll badan dikunci lalu pulih); hint instal muncul;
service worker aktif; **console 0 pesan**; tanpa scroll horizontal di
360/390/768/1280 dan tombol tetap 48×48 di dalam viewport.
- **Focus ring keyboard**:
  `:where(a, button, input, select, textarea):focus-visible` → outline 2px warna
  primary. Spesifisitas rendah supaya komponen bisa menimpa bila perlu.
- **JEBAKAN (terulang):** setelah mengubah `globals.css`, **build produksi bisa
  mengeluarkan CSS BASI dari cache Turbopack** — aturan baru tidak muncul walau
  build "PASS". Kalau perubahan CSS tidak terlihat: **hapus `.next` lalu build
  ulang**, dan pastikan aturannya benar-benar ada di `out/_next/static/chunks/*.css`.
- **Perbaikan auto-advance:** saat lagu habis, browser TURUT memicu event `pause`
  (sehingga `playing=false`) → lagu berikutnya ikut berhenti. Ditambahkan
  `keepPlayingRef`: event `ended` menandai "lanjutkan putar", lalu efek ganti-lagu
  memutar lagu berikutnya. Terverifikasi: lompat ke akhir lagu kedua → otomatis
  pindah ke lagu pertama **dan tetap diputar** (waktu terus berjalan).
  - **Hasil LCP di situs live:** 390 px, CPU 4×, Slow 4G → **904 ms** (dari
    **2.889 ms** sebelumnya), CLS **0,00**.

## PENTING: deploy mati setelah repo sempat dibuat private

- Saat repo diubah ke **private** (paket Free), GitHub **meng-unpublish** GitHub
  Pages. Beralih kembali ke **public TIDAK** mengaktifkannya lagi, sehingga
  workflow gagal di langkah `actions/configure-pages` dengan
  **`HttpError: Resource not accessible by integration`** (panggilan `POST /pages`),
  dan `GET /repos/.../pages` menjawab **404**. Job `build` lain (install/build)
  tetap sukses — yang gagal hanya langkah Pages.
- **Perbaikan:** aktifkan Pages lagi. Lewat UI:
  **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
  Atau lewat API (butuh token dengan izin Pages/admin):
  `POST /repos/<owner>/<repo>/pages` dengan body `{"build_type":"workflow"}`.
  Setelah aktif, **jalankan ulang workflow** (Actions → run → Re-run) — tidak
  perlu push baru.
- `deploy.yml` sudah diberi `enablement: true` pada `configure-pages`, tetapi itu
  **tidak cukup** untuk kasus ini (token workflow tidak boleh membuat situs
  Pages). Artinya: **kalau repo dibuat private lagi, Pages harus diaktifkan ulang
  secara manual.**
