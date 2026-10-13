"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// ---------------------------------------------------------------------------
// FloatingHearts — partikel hati/kelopak melayang yang ringan.
// ---------------------------------------------------------------------------
// Pendekatan "paling murah" di HP:
// - Nilai acak dibuat DETERMINISTIK (fungsi murni), jadi tidak ada efek,
//   tidak ada re-render, dan server & browser menghasilkan hal yang sama.
// - Hanya memakai transform (y) + opacity.
// - Partikel ke-7 dst disembunyikan di layar kecil (`hidden sm:block`),
//   jadi HP hanya menganimasikan 6 partikel.
// - Tidak dirender sama sekali jika pengguna memilih "kurangi gerak".
// - pointer-events: none + aria-hidden (murni dekoratif).

// Angka acak semu yang murni (deterministik) dari sebuah seed.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const MOBILE_VISIBLE = 6; // jumlah partikel di layar kecil
const TOTAL = 18; // jumlah partikel di layar besar

// Dibuat sekali di level modul (bukan saat render).
const PARTICLES = Array.from({ length: TOTAL }, (_, i) => ({
  left: pseudoRandom(i + 1) * 100,
  size: 12 + pseudoRandom(i + 21) * 16,
  duration: 9 + pseudoRandom(i + 41) * 8,
  delay: pseudoRandom(i + 61) * 8,
  opacity: 0.25 + pseudoRandom(i + 81) * 0.4,
  mobileVisible: i < MOBILE_VISIBLE,
}));

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

export default function FloatingHearts() {
  const reduce = useReducedMotionSafe();
  if (reduce) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute ${p.mobileVisible ? "" : "hidden sm:block"}`}
          style={{
            left: `${p.left}%`,
            bottom: "-8%",
            width: p.size,
            height: p.size,
            color: i % 2 === 0 ? "#ec4899" : "#f9a8d4",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-110dvh", opacity: [0, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <HeartIcon className="h-full w-full" />
        </motion.span>
      ))}
    </div>
  );
}
