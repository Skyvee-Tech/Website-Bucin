"use client";

import { motion, type Variants } from "motion/react";
import { site } from "@/content/site";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// KataKata — section "Kata-kata": dua kutipan.
// ---------------------------------------------------------------------------
// Kutipan 1 muncul saat di-scroll. Kutipan 2 panjang, jadi dipecah per kalimat
// dan muncul bertahap (stagger) supaya nyaman dibaca di HP.

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function KataKata() {
  return (
    <section id="kata-kata" className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8">
      <SectionReveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          Kata-kata
        </p>
      </SectionReveal>

      {/* Kutipan 1 */}
      <motion.blockquote
        className="mx-auto mt-8 max-w-xl text-center"
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

      {/* Kutipan 2 — per kalimat, muncul bertahap */}
      <motion.blockquote
        className="mx-auto mt-12 max-w-prose border-l-2 border-accent/40 pl-5 sm:pl-6"
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
    </section>
  );
}
