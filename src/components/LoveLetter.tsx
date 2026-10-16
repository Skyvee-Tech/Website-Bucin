"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { site } from "@/content/site";
import { useActiveMotion } from "@/lib/useActiveMotion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// LoveLetter — section "Surat untukmu".
// ---------------------------------------------------------------------------
// SEMUA teks berada di dalam SATU kartu surat:
//   1) surat berbahasa Indonesia (efek "diketik" saat masuk layar),
//   2) dua kutipan,
//   3) surat penutup berbahasa Inggris (per paragraf),
//   4) tanda tangan.
// Kalau pengguna memilih "kurangi gerak", surat langsung tampil utuh.

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function LoveLetter() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotionSafe();
  // Denyut hati berhenti saat section ini tidak terlihat.
  const { ref: sectionRef, active } = useActiveMotion<HTMLElement>();

  const full = site.letter;
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Mulai mengetik ketika surat masuk viewport.
  useEffect(() => {
    if (reduce || skipped || !inView) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= full.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [reduce, skipped, inView, full.length]);

  const finished = reduce || skipped || count >= full.length;
  const visibleText = finished ? full : full.slice(0, count);

  return (
    <section
      ref={sectionRef}
      id="surat"
      className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8"
    >
      <SectionReveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          Sepenuh hati
        </p>
        <h2 className="mt-3 text-center text-[clamp(1.6rem,7vw,2.5rem)] text-primary">
          Surat untukmu
        </h2>
      </SectionReveal>

      <div ref={ref} className="mt-8">
        {/* SATU kartu berisi seluruh kata. */}
        <article className="relative rounded-3xl border border-border bg-card/70 px-6 py-8 shadow-sm backdrop-blur-sm sm:px-10 sm:py-10">
          {/* Salinan utuh surat untuk pembaca layar (teks yang terlihat disembunyikan dari SR). */}
          <p className="sr-only">{full}</p>

          {/* Surat (diketik) */}
          <p
            aria-hidden="true"
            className="whitespace-pre-line font-heading text-[clamp(1.05rem,4.4vw,1.3rem)] leading-relaxed text-foreground/90"
          >
            {visibleText}
            {!finished && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] animate-pulse bg-primary align-middle" />
            )}
          </p>

          {/* Tanda tangan surat, muncul setelah surat selesai diketik. */}
          <p
            aria-hidden={!finished}
            className={`mt-6 font-heading text-lg text-primary transition-opacity duration-700 ${finished ? "opacity-100" : "opacity-0"}`}
          >
            {site.letterSignature}
          </p>

          {!finished && (
            <button
              type="button"
              onClick={() => setSkipped(true)}
              className="mt-6 inline-flex h-11 items-center rounded-full border border-primary/30 px-5 text-sm font-medium text-primary transition active:scale-95"
            >
              Lewati animasi
            </button>
          )}

          {/* Kutipan pertama (dulu section "Kata-kata"). */}
          <motion.blockquote
            className="mx-auto mt-10 max-w-xl text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span
              className="block font-heading text-4xl leading-none text-accent"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="font-heading text-[clamp(1.25rem,5.2vw,1.75rem)] italic leading-relaxed text-primary">
              {site.quotes.first}
            </p>
          </motion.blockquote>

          {/* Kutipan kedua — dipecah per kalimat dan muncul bertahap. */}
          <motion.blockquote
            className="mx-auto mt-8 max-w-prose border-l-2 border-accent/40 pl-5 sm:pl-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {site.quotes.second.map((line, i) => (
              <motion.p
                key={i}
                variants={item}
                className="mb-4 font-heading text-[clamp(1.05rem,4.6vw,1.35rem)] italic leading-relaxed text-foreground/85 last:mb-0"
              >
                {line}
              </motion.p>
            ))}
          </motion.blockquote>

          {/* Surat penutup (dulu section "Penutup") — muncul bertahap per paragraf. */}
          <motion.div
            aria-hidden="true"
            className="mx-auto mb-6 mt-12 h-10 w-10 text-secondary"
            animate={reduce || !active ? undefined : { scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" className="h-full w-full">
              <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </motion.div>

          <motion.div
            className="mx-auto max-w-prose space-y-5 text-left"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {site.closingLetter.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={item}
                className="text-[clamp(0.98rem,4.2vw,1.15rem)] font-light leading-relaxed text-foreground/85"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <p className="mt-10 text-center font-heading text-lg text-accent">
            — {site.myName}
          </p>
        </article>
      </div>

      <footer className="mt-10 border-t border-border pt-6 text-center text-xs text-foreground/70">
        Made By Skyvee Tech Corporation
      </footer>
    </section>
  );
}
