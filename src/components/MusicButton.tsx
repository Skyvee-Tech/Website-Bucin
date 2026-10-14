"use client";

// ---------------------------------------------------------------------------
// MusicButton — tombol bulat musik (kanan bawah). Mengetuk membuka/menutup
// panel pemutar (MusicPanel). Ikon not musik (vektor, currentColor).
// ---------------------------------------------------------------------------
export default function MusicButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="music-player-panel"
      aria-label={open ? "Tutup pemutar musik" : "Buka pemutar musik"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 text-primary shadow-lg backdrop-blur-md transition-transform duration-200 active:scale-95"
    >
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
        <path d="M9 18V6l10-2v12" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    </button>
  );
}
