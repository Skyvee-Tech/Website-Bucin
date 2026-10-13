"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// ---------------------------------------------------------------------------
// Divider — ornamen pemisah antar-bagian: garis yang tumbuh + hati berdenyut.
// ---------------------------------------------------------------------------

function Heart() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-secondary" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

export default function Divider() {
  const reduce = useReducedMotionSafe();

  return (
    <div
      className="mx-auto flex w-full max-w-xs items-center justify-center gap-3 py-6"
      aria-hidden="true"
    >
      <motion.span
        className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60"
        initial={reduce ? undefined : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "right center" }}
      />
      <motion.span
        className="shrink-0"
        animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart />
      </motion.span>
      <motion.span
        className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/60"
        initial={reduce ? undefined : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
}
