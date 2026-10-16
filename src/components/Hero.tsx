"use client";

import { motion, type Variants } from "motion/react";
import { site } from "@/content/site";
import { useActiveMotion } from "@/lib/useActiveMotion";
import FloatingHearts from "./FloatingHearts";

// ---------------------------------------------------------------------------
// Hero — bagian pembuka: nama pacar + kalimat pembuka.
// ---------------------------------------------------------------------------
// Full tinggi layar memakai 100dvh (aman dari address bar HP).

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

// Animasi masuk hero: pakai transform SAJA (tanpa opacity) supaya teks sudah
// terlihat sejak paint pertama — LCP tidak menunggu hydration/JS.
const item: Variants = {
  hidden: { y: 22 },
  show: { y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  // Denyut hati berhenti saat hero tidak terlihat.
  const { ref, active } = useActiveMotion<HTMLElement>();
  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden px-6"
      style={{
        paddingTop: "calc(2rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
      }}
    >
      <FloatingHearts />

      <motion.div
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Hati berdenyut */}
        <motion.span
          variants={item}
          className="mb-1 inline-flex text-secondary"
          aria-hidden="true"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            animate={active ? { scale: [1, 1.15, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              fill="currentColor"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </motion.svg>
        </motion.span>

        <motion.p
          variants={item}
          className="text-xs uppercase tracking-[0.4em] text-accent sm:text-sm"
        >
          Untuk kamu
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-3 max-w-4xl text-balance font-heading text-[clamp(2rem,9vw,4.5rem)] leading-[1.05] text-primary"
        >
          {site.partnerName}
        </motion.h1>

        {/* Garis hias yang tergambar di bawah nama */}
        <motion.svg
          viewBox="0 0 200 10"
          className="mt-3 h-3 w-44 text-accent"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M2 6 C 50 0, 150 0, 198 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
          />
        </motion.svg>

        <motion.p
          variants={item}
          className="mt-6 max-w-prose text-[clamp(1.05rem,4.4vw,1.35rem)] leading-relaxed text-foreground/80"
        >
          {site.openingQuote}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 text-sm tracking-[0.2em] text-accent"
        >
          {site.openingSubtitle}
        </motion.p>
      </motion.div>

      {/* Petunjuk geser ke bawah (ikon chevron). */}
      <motion.div
        className="absolute left-1/2 z-10 -translate-x-1/2"
        style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-primary/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
