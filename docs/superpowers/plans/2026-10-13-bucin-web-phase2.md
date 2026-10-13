# Bucin Web — FASE 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun website romantis statis (Next.js 16) yang responsif di HP, dengan gate pembuka, musik latar, hero, penghitung hari, galeri, timeline, surat, kartu alasan, dan penutup.

**Architecture:** Static export App Router. Konten terpusat di `src/content/site.ts`. Logika murni (tanggal, base path) dipisah di `src/lib/` agar bisa diuji. Audio dikelola satu `AudioProvider` (React Context) yang juga mengontrol gate & tombol mute.

**Tech Stack:** Next.js 16.4, TypeScript, Tailwind CSS v4, `motion` (Framer Motion), `next/font/google`, `node:test` + `tsx` (hanya untuk logika murni).

**Spec:** `docs/superpowers/specs/2026-10-13-bucin-web-design.md`

## Global Constraints

- Mobile-first; acuan 360/390/768/1280px; TIDAK boleh scroll horizontal.
- Tinggi layar pakai `100dvh`. Hormati `env(safe-area-inset-*)`.
- Teks body >= 16px; ukuran pakai `clamp()`. Target ketuk >= 44x44px.
- Animasi hanya `transform` + `opacity`; hormati `prefers-reduced-motion`.
- Semua aset `/public` dibungkus `withBase()`.
- Commit hanya dijalankan bila user mengizinkan (default: JANGAN commit).
- Setiap task diakhiri `npm run build` tanpa error.

## Review Focus

1. Autoplay musik diblokir browser (tap user wajib, tangani `play()` rejection).
2. `startDate` masa depan / tidak valid -> tampilkan 0, bukan negatif/`NaN`.
3. Layar 360px tidak pecah / tidak ada scroll horizontal.
4. `prefers-reduced-motion` mematikan animasi tanpa merusak konten.
5. Foto & musik muncul di GitHub Pages (lewat `withBase`).

---

### Task 1: Fondasi tema, font, dan layout

**Files:**
- Modify: `package.json` (tambah dep `motion`)
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/page.tsx` (komposisi kosong dulu)

**Interfaces:**
- Produces: CSS variable `--font-playfair`, `--font-poppins`; token warna
  (`--color-background`, `--color-primary`, dst) dari `@theme`.

- [ ] Install dependency: `npm install motion`
- [ ] `globals.css`: ganti tema dengan token rose/blush/krem + emas (lihat Spec).
- [ ] `layout.tsx`: pakai `Playfair_Display` & `Poppins` dari `next/font/google`,
  pasang ke `<html>`, set `lang="id"`, `metadata` romantis, dan `export const viewport` dengan `viewportFit: 'cover'`, `themeColor`.
- [ ] `page.tsx`: render satu `<main>` bertema sebagai placeholder.
- [ ] Run: `npm run build` -> Expected: PASS tanpa error.
- [ ] (JANGAN commit tanpa izin)

### Task 2: Logika murni + TDD (withBase & penghitung tanggal)

**Files:**
- Create: `src/lib/date.ts`
- Create: `src/lib/date.test.ts`
- Create: `src/lib/withBase.test.ts`
- Modify: `package.json` (devDep `tsx`, script `test`)

**Interfaces:**
- Produces: `getElapsed(startISO: string, now?: Date): { days: number; hours: number; minutes: number; invalid: boolean }`
- Consumes: `withBase` dari `src/lib/withBase.ts` (sudah ada).

- [ ] `npm install -D tsx`; tambah script `"test": "tsx --test src/lib/*.test.ts"`.
- [ ] Tulis `date.test.ts` yang GAGAL: durasi normal, `startDate` masa depan -> semua 0 + `invalid:false`, string tidak valid -> `invalid:true`.
- [ ] Run: `npm test` -> Expected: FAIL (`getElapsed` belum ada).
- [ ] Implement `getElapsed` di `date.ts` (selisih ms, lantai hari/jam/menit; clamp negatif ke 0).
- [ ] Tulis `withBase.test.ts`: kosong -> `/photos/a.jpg`; base di-set -> `/repo/photos/a.jpg`; cegah dobel prefix.
- [ ] Run: `npm test` -> Expected: PASS semua.
- [ ] `npm run build` -> PASS.

### Task 3: Pipeline audio (provider + gate + tombol mute)

**Files:**
- Create: `src/components/AudioProvider.tsx`
- Create: `src/components/OpenGate.tsx`
- Create: `src/components/MusicButton.tsx`

**Interfaces:**
- Produces: `useAudio(): { started: boolean; muted: boolean; start(): void; toggleMute(): void }`
- Consumes: `site.musicSrc`, `withBase`.

- [ ] `AudioProvider`: `<audio loop preload="auto">` + `useRef`; `start()`
  set volume 0 lalu fade ke 0.6, `play().catch(() => {})` diam-diam.
- [ ] `OpenGate`: overlay `100dvh`, kartu amplop "Ketuk untuk membuka",
  `role="button"`, `onClick={start}`; hilang dengan `AnimatePresence`.
- [ ] `MusicButton`: fixed bottom-right, `44x44px`, hormati
  `env(safe-area-inset-*)`, `aria-label` dinamis, ikon SVG (bukan emoji).
- [ ] Run: `npm run build` -> PASS.

### Task 4: Hero + partikel hati

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/FloatingHearts.tsx`
- Create: `src/components/SectionReveal.tsx` (reveal saat scroll)

**Interfaces:**
- Consumes: `site.partnerName`, `site.openingQuote`, `site.openingSubtitle`.

- [ ] `Hero`: `min-h-[100dvh]`, gradien blush, nama + kalimat dengan animasi
  masuk (fade + naik). Tanda "geser ke bawah".
- [ ] `FloatingHearts`: N hati absolut, dianimasikan `y`/`opacity`. N = 18
  desktop / 6 mobile / 0 saat `prefers-reduced-motion`. `aria-hidden`.
- [ ] `SectionReveal`: wrapper `whileInView` (opacity + `y`), hormati reduced-motion.
- [ ] `npm run build` -> PASS.

### Task 5: Penghitung hari bersama

**Files:**
- Create: `src/components/Countdown.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getElapsed` (Task 2), `site.startDate`, `site.partnerName`.

- [ ] Tampilkan 3 kartu glass: Hari / Jam / Menit. Update tiap 60s via
  `setInterval`. Tangani `invalid` dengan pesan tenang.
- [ ] `npm run build` -> PASS.

### Task 6: Galeri foto + lightbox (swipe)

**Files:**
- Create: `src/components/Gallery.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.photos`, `withBase`.

- [ ] Grid 2 kolom (mobile) -> 3 kolom (tablet). Tiap foto `next/image`
  `unoptimized` + `alt` + `loading="lazy"` + rasio tetap (anti-jank).
- [ ] Lightbox: overlay penuh, tombol tutup besar di atas (dekat jempol),
  navigasi prev/next, dukung swipe; tutup dengan `Esc`. Fokus terkunci.
- [ ] `npm run build` -> PASS.

### Task 7: Timeline kenangan

**Files:**
- Create: `src/components/Timeline.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.timeline`.

- [ ] Garis vertikal + kartu bergantian muncul saat scroll. Di mobile kartu
  full-width. `npm run build` -> PASS.

### Task 8: Surat cinta (typewriter)

**Files:**
- Create: `src/components/LoveLetter.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.letter`.

- [ ] Efek ketik muncul saat masuk viewport. Font serif (Playfair),
  measure terbatas (`max-w-prose`). Saat reduced-motion, tampilkan penuh
  (tanpa animasi). Sediakan tombol "lewati" untuk mempercepat.
- [ ] `npm run build` -> PASS.

### Task 9: Kartu "Alasan aku sayang kamu"

**Files:**
- Create: `src/components/Reasons.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.reasons`.

- [ ] Grid kartu yang bisa dibalik (tap untuk flip) pakai `rotateY`.
  Aksesibel: pakai `<button>`, `aria-pressed`, teks juga terbaca saat flipped.
- [ ] `npm run build` -> PASS.

### Task 10: Penutup + footer, komposisi final

**Files:**
- Create: `src/components/Closing.tsx`
- Modify: `src/app/page.tsx` (susun semua + `AudioProvider`, `OpenGate`, `MusicButton`)

**Interfaces:**
- Consumes: `site.closingTitle`, `site.closingMessage`, `site.myName`.

- [ ] Closing: pesan penutup dengan animasi lembut + footer kecil.
- [ ] `page.tsx` menyusun: `<AudioProvider>` -> sections -> `<OpenGate/>` -> `<MusicButton/>`.
- [ ] `npm run build` -> PASS.

### Task 11: Verifikasi responsif + aksesibilitas + deploy prep

**Files:**
- Create: `.github/workflows/deploy.yml` (FASE 3)

- [ ] Cek render di lebar 360/390/768/1280 (dev server + laporan per ukuran).
- [ ] Cek tidak ada scroll horizontal, target ketuk >= 44px, `alt` lengkap,
  reduced-motion aman.
- [ ] `npm run build` + simulasi `NEXT_PUBLIC_BASE_PATH=/nama-repo`.
- [ ] Siapkan workflow GitHub Actions (FASE 3), tunggu izin sebelum push.
