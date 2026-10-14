"use client";

import { toggleTheme, useTheme } from "@/lib/useTheme";

// ---------------------------------------------------------------------------
// ThemeToggle — tombol bulat pengubah mode terang/gelap (ikon vektor).
// ---------------------------------------------------------------------------
// Ikon ditampilkan lewat CSS berdasarkan data-theme, jadi ikon yang benar
// sudah tampil sejak frame pertama (tanpa kedip, tanpa menunggu hydration).
// aria-pressed/aria-label diambil dari useTheme agar pembaca layar tahu status.
// Posisi diatur oleh pembungkusnya (FloatingControls) — bersebelahan dengan
// tombol musik di kanan-bawah.
export default function ThemeToggle() {
  const dark = useTheme() === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={dark}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 text-primary shadow-lg backdrop-blur-md transition-transform duration-200 active:scale-95"
    >
      {/* Bulan sabit — tampil di mode terang. */}
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>

      {/* Matahari — tampil di mode gelap. */}
      <svg
        viewBox="0 0 24 24"
        className="hidden h-6 w-6 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
