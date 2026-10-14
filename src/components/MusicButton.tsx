"use client";

import { useAudio } from "./AudioProvider";

// ---------------------------------------------------------------------------
// MusicButton — tombol mute/unmute melayang di pojok kanan bawah.
// ---------------------------------------------------------------------------
// Ditaruh dekat jempol, tetap menjauh dari konten, ukuran >= 44px, dan
// menghormati safe-area (poni/gesture bar HP).
export default function MusicButton() {
  const { muted, toggleMute } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
      className="fixed z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 text-primary shadow-lg backdrop-blur-md transition-transform duration-200 active:scale-95"
      style={{
        right: "calc(1rem + env(safe-area-inset-right))",
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      {muted ? (
        // Ikon speaker mati (garis miring)
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      ) : (
        // Ikon speaker berbunyi
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <path d="M15.5 8.5a5 5 0 010 7" />
          <path d="M18.5 6a9 9 0 010 12" />
        </svg>
      )}
    </button>
  );
}
