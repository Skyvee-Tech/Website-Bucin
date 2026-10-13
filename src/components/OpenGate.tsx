"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAudio } from "./AudioProvider";

// ---------------------------------------------------------------------------
// OpenGate — layar pembuka (amplop/kartu "Ketuk untuk membuka").
// ---------------------------------------------------------------------------
// Ketika diketuk: musik mulai diputar (dipicu dari tap user), lalu layar
// pembuka menghilang dengan animasi.
export default function OpenGate() {
  const { start } = useAudio();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    start(); // mulai musik (harus dari interaksi user)
    setOpen(true); // tutup gate
  };

  // Kunci scroll halaman selama gate masih tertutup.
  useEffect(() => {
    if (open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            minHeight: "100dvh",
            paddingTop: "calc(1.5rem + env(safe-area-inset-top))",
            paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            paddingLeft: "calc(1.5rem + env(safe-area-inset-left))",
            paddingRight: "calc(1.5rem + env(safe-area-inset-right))",
            background:
              "radial-gradient(1200px 700px at 50% -10%, #ffe4ef 0%, transparent 60%), var(--color-background)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <motion.button
            type="button"
            onClick={handleOpen}
            aria-label="Buka halaman dan putar musik"
            className="group flex w-full max-w-sm flex-col items-center gap-5 rounded-[2rem] border border-border bg-white/70 px-8 py-10 text-center shadow-[0_20px_60px_-20px_rgba(190,24,93,0.35)] backdrop-blur-md transition-transform duration-200 active:scale-[0.98]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Ilustrasi amplop sederhana (SVG, bukan emoji) */}
            <span className="relative block h-24 w-32" aria-hidden="true">
              <svg
                viewBox="0 0 128 96"
                className="h-full w-full drop-shadow-sm"
                fill="none"
              >
                <rect
                  x="6"
                  y="16"
                  width="116"
                  height="72"
                  rx="10"
                  fill="#fff"
                  stroke="#f7e3eb"
                  strokeWidth="2"
                />
                <path
                  d="M6 26 L64 60 L122 26"
                  stroke="#be185d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="64" cy="62" r="12" fill="#be185d" />
                <path
                  d="M64 68.5c-4.2-3-6.5-5-6.5-7.3a3.2 3.2 0 015.2-2.5c.5.4.9.8 1.3 1.4.4-.6.8-1 1.3-1.4a3.2 3.2 0 015.2 2.5c0 2.3-2.3 4.3-6.5 7.3z"
                  fill="#fff"
                />
              </svg>
            </span>

            <span className="font-heading text-3xl text-primary">Untukmu</span>
            <span className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
              Ketuk untuk membuka
            </span>
            <span className="text-xs text-foreground/70">
              (akan ada musik yang mulai diputar)
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
