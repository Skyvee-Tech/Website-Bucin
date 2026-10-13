"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// ---------------------------------------------------------------------------
// WordMarquee — barisan kata romantis yang berjalan pelan.
// ---------------------------------------------------------------------------
// Lebar dikunci di dalam pembungkus overflow-hidden supaya tidak pernah
// menimbulkan scroll horizontal. Hormati reduced-motion (berhenti total).

function HeartDot() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-secondary" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

export default function WordMarquee({ words }: { words: string[] }) {
  const reduce = useReducedMotionSafe();
  const loop = [...words, ...words];

  return (
    <div className="w-full overflow-hidden py-6" aria-hidden="true">
      <motion.div
        className="flex w-max items-center gap-8 pr-8"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex shrink-0 items-center gap-8 font-heading text-[clamp(1.1rem,4.5vw,1.6rem)] text-primary/80"
          >
            {word}
            <HeartDot />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
