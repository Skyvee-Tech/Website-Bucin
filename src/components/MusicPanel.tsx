"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAudio } from "./AudioProvider";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// ---------------------------------------------------------------------------
// MusicPanel — panel pemutar musik (muncul di atas tombol musik).
// ---------------------------------------------------------------------------
// Isi: cover art (dari tag ID3 file mp3), judul/artis, posisi lagu yang bisa
// digeser, dan tombol prev / play-pause / next. Kalau hanya ada satu lagu,
// tombol maju/mundur dinonaktifkan.

function formatTime(t: number): string {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const minutes = Math.floor(t / 60);
  const seconds = Math.floor(t % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function HeartFallback() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

export default function MusicPanel({ open }: { open: boolean }) {
  const {
    playing,
    meta,
    currentTime,
    duration,
    hasPrev,
    hasNext,
    togglePlay,
    next,
    prev,
    seek,
  } = useAudio();
  const reduce = useReducedMotionSafe();

  // Posisi yang sedang digeser (null = ikut waktu asli). Dipakai supaya nilai
  // "timeupdate" tidak menarik thumb kembali saat pengguna menggeser.
  const [scrub, setScrub] = useState<number | null>(null);
  const scrubRef = useRef<number | null>(null);
  const max = duration || 0;
  const shown = scrub ?? Math.min(currentTime, max);
  const commitSeek = () => {
    const v = scrubRef.current;
    if (v !== null) {
      seek(v);
      scrubRef.current = null;
      setScrub(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="music-player-panel"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
          role="region"
          aria-label="Pemutar musik"
          className="w-[16rem] rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-secondary">
              {meta?.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meta.coverUrl}
                  alt="Cover lagu"
                  className="h-full w-full object-cover"
                />
              ) : (
                <HeartFallback />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-sm text-primary">
                {meta ? (meta.title ?? "Tanpa judul") : "Memuat…"}
              </p>
              <p className="truncate text-xs text-foreground/70">
                {meta?.artist ?? ""}
              </p>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={max}
            step={0.1}
            value={Math.min(shown, max)}
            onChange={(e) => {
              const v = Number(e.target.value);
              scrubRef.current = v;
              setScrub(v);
            }}
            onPointerUp={commitSeek}
            onPointerCancel={commitSeek}
            onKeyUp={commitSeek}
            onBlur={commitSeek}
            aria-label="Posisi lagu"
            className="music-range mt-2 w-full"
            // `--p` dipakai track CSS untuk mewarnai bagian yang sudah dilewati.
            style={
              {
                "--p": `${max > 0 ? Math.round(Math.min(100, (shown / max) * 100) * 10) / 10 : 0}%`,
              } as React.CSSProperties
            }
          />
          <div className="flex justify-between text-[0.65rem] tabular-nums text-foreground/60">
            <span>{formatTime(shown)}</span>
            <span>{formatTime(max)}</span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={!hasPrev}
              aria-label="Lagu sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition active:scale-95 disabled:opacity-35"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 6h2v12H7zM19 6v12l-9-6z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Jeda" : "Putar"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition active:scale-95"
            >
              {playing ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={next}
              disabled={!hasNext}
              aria-label="Lagu berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition active:scale-95 disabled:opacity-35"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M15 6h2v12h-2zM5 6v12l9-6z" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
