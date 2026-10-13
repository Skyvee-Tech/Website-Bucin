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

## Status fase

- [x] FASE 1 — Setup: scaffold, static export, `withBase`, `site.ts`. Build PASS.
- [x] FASE 2 — Desain & fitur: gate+musik, hero+hati, penghitung, galeri+lightbox,
  timeline, surat typewriter, kartu alasan, penutup. `npm test` 6/6, lint bersih,
  build PASS (lokal & dengan base path). Menunggu konfirmasi user.
- [x] FASE 3 — Live di `https://skyvee-tech.github.io/Website-Bucin/`.
- [x] Revisi (nama/tanggal/detik, hapus timeline, pipeline foto, galeri masonry,
  buku nikah, privasi, animasi). Menunggu commit/push dari user.
