# Website Bucin — Design Document (FASE 2 & 3)

> Dokumen ini adalah "spec" yang dipakai oleh rencana kerja di
> `docs/superpowers/plans/2026-10-13-bucin-web-phase2.md`.

**Intent:** Website romantis personal sebagai hadiah untuk pacar, dibuka
paling sering lewat HP. Tujuan emosional: terasa hangat, personal, dan
"wah" tanpa mengorbankan kecepatan di HP.

**Pengguna utama:** satu orang (pacar), kemungkinan besar di HP Android/iPhone,
koneksi seluler, dan browser default (Chrome/Safari).

**Non-goals:** bukan blog, tidak ada CMS, tidak ada login, tidak ada backend,
tidak ada analitik/tracking, tidak mengumpulkan data pribadi.

**Anti-goals:** lambat/lag di HP, ada scroll horizontal, teks terpotong
address bar, musik tidak jalan, foto/aset 404 di GitHub Pages.

## Constraints (wajib, dari spec user)

- Next.js 16 App Router, TypeScript, Tailwind CSS v4, `src/` dir.
- Animasi: Framer Motion (paket `motion`). Hanya `transform`/`opacity`.
- Font: Playfair Display (judul) + Poppins (body) via `next/font/google`.
- Static export ke GitHub Pages (`output: 'export'`), base path dari env.
- Mobile-first. Lebar acuan: 360, 390, 768, 1280. Tanpa scroll horizontal.
- `100dvh` (bukan `100vh`). Hormati `env(safe-area-inset-*)`.
- Viewport `viewport-fit=cover`. Teks pakai `clamp()`, body >= 16px.
- Target ketuk >= 44x44px. Semua fitur jalan dengan tap (bukan hover).
- Lightbox & carousel bisa di-swipe + tombol tutup dekat jempol.
- Hormati `prefers-reduced-motion`. Kurangi partikel di layar kecil.
- Kontras teks aman, `alt` untuk semua foto.
- GitHub Pages: `.github/workflows/deploy.yml`, source = GitHub Actions.

## Design System (hasil ui-ux-pro-max, disesuaikan)

Palet rose/blush/krem + aksen emas lembut. Semua jadi token Tailwind v4.

| Peran | Nilai | Catatan |
|---|---|---|
| background | `#FFF7FA` | blush krem hangat |
| foreground | `#3F3540` | plum-ink, kontras >= 4.5:1 |
| primary (rose) | `#BE185D` | judul/aksen utama |
| secondary (pink) | `#EC4899` | gradien, highlight |
| accent (gold) | `#C9A24B` | aksen emas lembut |
| muted | `#FBF1F5` | latar kartu lembut |
| border | `#F7E3EB` | garis tipis |
| card | `rgba(255,255,255,0.65)` + `backdrop-blur` | glassmorphism halus |

**Tipografi:** Playfair Display untuk judul (serif elegan), Poppins untuk
teks isi. Ukuran via `clamp()`, mis. judul `clamp(2rem, 8vw, 4rem)`.

**Motion:** MotionConfig `reducedMotion="user"`. Reveal saat scroll: opacity +
`translateY(12px)`, 300–450ms. Partikel hati: jumlah dibatasi (mis. 18 di
desktop, 6 di layar kecil, 0 saat reduced-motion).

## Architecture

- `src/content/site.ts` — satu sumber konten (sudah ada di Fase 1).
- `src/lib/` — logika murni yang bisa diuji: `withBase.ts`, `date.ts`.
- `src/app/` — layout (font + metadata + viewport) dan `page.tsx` yang
  menyusun komponen.
- `src/components/` — komponen kecil, satu tanggung jawab.

Audio: satu elemen `<audio>` global di `AudioProvider` (client, pakai React
Context). Gate memicu `.play()` dari klik user (wajib, kalau tidak diblokir
browser). Tombol mute melayang diakses lewat context yang sama.

## Review Focus

1. **Autoplay musik diblokir** — kalau `play()` dipanggil bukan dari tap user
   / promise rejection, musik tidak jalan. Harus ditangani tanpa bikin halaman
   rusak.
2. **`startDate` di masa depan / tidak valid** — penghitung harus menampilkan
   0 (bukan angka negatif atau `NaN`).
3. **Layar sangat sempit (360px)** — tidak boleh scroll horizontal; kartu
   timeline/galeri wrap dengan benar.
4. **`prefers-reduced-motion` aktif** — semua animasi dimatikan, konten tetap
   terbaca dan interaktif.
5. **Aset di GitHub Pages** — foto & musik harus lewat `withBase()` supaya
   tidak 404 (base path ikut ditambahkan).

## Yang diserahkan ke builder (pilihan saya, bisa kamu koreksi)

- Nama paket animasi: pakai `motion` (nama baru Framer Motion). Import
  `motion/react`.
- Test runner logika murni: pakai `node:test` bawaan Node + `tsx` sebagai
  devDependency. TDD hanya untuk `date.ts` & `withBase.ts`.
- Galeri: grid responsif + lightbox (bukan carousel terpisah), karena lebih
  ringan di HP dan tetap bisa swipe di dalam lightbox.
- shadcn/ui tidak dipakai (tidak ada MCP shadcn aktif + YAGNI; desain custom
  lebih pas dan lebih ringan).
