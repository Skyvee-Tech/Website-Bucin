"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { site } from "@/content/site";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// LoveLetter — surat cinta dengan efek "diketik" saat masuk layar.
// ---------------------------------------------------------------------------
// - Tipografi serif (Playfair) agar enak dibaca; lebar teks dibatasi.
// - Kalau pengguna memilih "kurangi gerak", surat langsung tampil utuh.
// - Ada tombol "Lewati" untuk langsung menampilkan seluruh isi.

export default function LoveLetter() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotionSafe();

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
        <article className="relative rounded-3xl border border-border bg-white/70 px-6 py-8 shadow-sm backdrop-blur-sm sm:px-10 sm:py-10">
          {/* Salinan utuh untuk pembaca layar (teks yang terlihat disembunyikan dari SR). */}
          <p className="sr-only">{full}</p>

          <p
            aria-hidden="true"
            className="whitespace-pre-line font-heading text-[clamp(1.05rem,4.4vw,1.3rem)] leading-relaxed text-foreground/90"
          >
            {visibleText}
            {!finished && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] animate-pulse bg-primary align-middle" />
            )}
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
        </article>
      </div>
    </section>
  );
}
