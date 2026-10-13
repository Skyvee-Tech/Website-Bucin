"use client";

import { useState } from "react";
import { site, type Reason } from "@/content/site";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// Reasons — kartu "alasan aku sayang kamu" yang bisa dibalik dengan tap.
// ---------------------------------------------------------------------------
// - Memakai <button> + aria-pressed supaya bisa diakses keyboard & pembaca layar.
// - Sisi depan (ikon + judul) dan sisi belakang (penjelasan) sama-sama tersedia;
//   sisi yang sedang tidak tampak disembunyikan dari pembaca layar.
// - Animasi hanya rotateY (transform) dan otomatis instan pada mode kurangi gerak.

function FlipCard({ reason }: { reason: Reason }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="relative block h-44 w-full text-left"
      style={{ perspective: "1000px" }}
    >
      <span
        className="relative block h-full w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Sisi depan */}
        <span
          aria-hidden={flipped}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-white/75 p-4 text-center shadow-sm backdrop-blur-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-3xl" aria-hidden="true">
            {reason.icon}
          </span>
          <span className="font-heading text-lg text-primary">
            {reason.title}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
            ketuk
          </span>
        </span>

        {/* Sisi belakang */}
        <span
          aria-hidden={!flipped}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary p-5 text-center text-primary-foreground shadow-md"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="font-heading text-base">{reason.title}</span>
          <span className="text-sm leading-relaxed text-white/90">
            {reason.detail}
          </span>
        </span>
      </span>
    </button>
  );
}

export default function Reasons() {
  return (
    <section
      id="alasan"
      className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8"
    >
      <SectionReveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          Alasan
        </p>
        <h2 className="mt-3 text-center text-[clamp(1.6rem,7vw,2.5rem)] text-primary">
          Kenapa aku sayang kamu
        </h2>
        <p className="mt-3 text-center text-sm text-foreground/70">
          Ketuk kartunya untuk membuka alasannya.
        </p>
      </SectionReveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {site.reasons.map((reason, i) => (
          <SectionReveal key={reason.title} delay={i * 0.05}>
            <FlipCard reason={reason} />
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
