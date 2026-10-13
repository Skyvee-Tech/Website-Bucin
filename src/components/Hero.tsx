"use client";

import { motion, type Variants } from "motion/react";
import { site } from "@/content/site";
import FloatingHearts from "./FloatingHearts";

// ---------------------------------------------------------------------------
// Hero — bagian pembuka: nama pacar + kalimat pembuka.
// ---------------------------------------------------------------------------
// Full tinggi layar memakai 100dvh (aman dari address bar HP).

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
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
        <motion.p
          variants={item}
          className="text-xs uppercase tracking-[0.4em] text-accent sm:text-sm"
        >
          Untuk kamu
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-4 font-heading text-[clamp(2.75rem,13vw,5.5rem)] text-primary"
        >
          {site.partnerName}
        </motion.h1>

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
