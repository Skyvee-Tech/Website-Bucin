"use client";

import { motion } from "motion/react";
import { site } from "@/content/site";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// ---------------------------------------------------------------------------
// Closing — bagian penutup + footer.
// ---------------------------------------------------------------------------

export default function Closing() {
  const reduce = useReducedMotionSafe();

  return (
    <section
      id="penutup"
      className="mx-auto w-full max-w-2xl px-5 py-24 text-center sm:px-8"
    >
      <motion.div
        aria-hidden="true"
        className="mx-auto mb-6 h-10 w-10 text-secondary"
        animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <path
            fill="currentColor"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </motion.div>

      <h2 className="font-heading text-[clamp(1.9rem,8vw,3rem)] text-primary">
        {site.closingTitle}
      </h2>
      <p className="mx-auto mt-4 max-w-prose text-base leading-relaxed text-foreground/80">
        {site.closingMessage}
      </p>
      <p className="mt-8 font-heading text-lg text-accent">— {site.myName}</p>

      <footer className="mt-16 border-t border-border pt-6 text-xs text-foreground/70">
        Dibuat dengan sepenuh hati oleh {site.myName}.
      </footer>
    </section>
  );
}
