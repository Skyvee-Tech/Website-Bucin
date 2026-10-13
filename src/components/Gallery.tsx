"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import { withBase } from "@/lib/withBase";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// Gallery — grid foto responsif + lightbox.
// ---------------------------------------------------------------------------
// - Grid: 2 kolom di HP, 3 kolom di tablet ke atas.
// - Foto pakai aspek tetap (4:5) supaya tata letak tidak "melompat" saat load.
// - Lightbox bisa di-swipe, diklik tombol, dan lewat keyboard (Esc & panah).
// - Fokus keyboard terkunci di dalam lightbox.

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = index !== null;
  const currentIndex = index ?? 0;
  const current = site.photos[currentIndex];

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % site.photos.length)),
    [],
  );
  const prev = useCallback(
    () =>
      setIndex((i) =>
        i === null ? i : (i - 1 + site.photos.length) % site.photos.length,
      ),
    [],
  );

  // Saat lightbox terbuka: simpan fokus lama, pindahkan fokus ke tombol tutup,
  // dan kunci scroll halaman. Saat ditutup, kembalikan fokus & scroll.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open]);

  // Kontrol keyboard: Esc menutup, panah kiri/kanan pindah foto, Tab tetap
  // berputar di dalam lightbox (fokus terkunci).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>("button, [href]"),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  return (
    <section
      id="galeri"
      className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8"
    >
      <SectionReveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          Galeri
        </p>
        <h2 className="mt-3 text-center text-[clamp(1.6rem,7vw,2.5rem)] text-primary">
          Momen kita
        </h2>
      </SectionReveal>

      {/* Grid foto */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {site.photos.map((photo, i) => (
          <SectionReveal key={photo.src} delay={i * 0.05}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Buka foto: ${photo.caption}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
            >
              <Image
                src={withBase(photo.src)}
                alt={photo.alt}
                fill
                unoptimized
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-active:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-2.5 text-left text-xs text-white">
                {photo.caption}
              </span>
            </button>
          </SectionReveal>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && current && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ${currentIndex + 1} dari ${site.photos.length}: ${current.caption}`}
            className="fixed inset-0 z-[60] flex flex-col bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Penghitung di atas */}
            <div
              className="flex justify-center px-4 text-sm text-white/80"
              style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
            >
              {currentIndex + 1} / {site.photos.length}
            </div>

            {/* Area foto (bisa digeser ke kiri/kanan) */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3">
              {/* Tombol sebelumnya (kiri) */}
              <button
                type="button"
                onClick={prev}
                aria-label="Foto sebelumnya"
                className="absolute left-1 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>

              <motion.div
                key={currentIndex}
                className="relative h-full w-full"
                drag="x"
                dragElastic={0.2}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) next();
                  else if (info.offset.x > 60) prev();
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Image
                  src={withBase(current.src)}
                  alt={current.alt}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="touch-pan-y object-contain"
                />
              </motion.div>

              {/* Tombol berikutnya (kanan) */}
              <button
                type="button"
                onClick={next}
                aria-label="Foto berikutnya"
                className="absolute right-1 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>

            {/* Caption + tombol tutup (dekat jempol di bagian bawah) */}
            <div
              className="flex flex-col items-center gap-3 px-5 pt-3"
              style={{
                paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
              }}
            >
              <p className="text-center text-sm text-white/90">
                {current.caption}
              </p>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                className="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-foreground shadow-lg transition active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
