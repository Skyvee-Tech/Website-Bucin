"use client";

import { site } from "@/content/site";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// Timeline — garis kenangan yang muncul saat di-scroll.
// ---------------------------------------------------------------------------
// Di HP: rail di kiri, kartu full-width. Di layar besar: kartu bergantian
// kiri-kanan mengikuti garis tengah.

export default function Timeline() {
  return (
    <section
      id="kenangan"
      className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8"
    >
      <SectionReveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          Kenangan
        </p>
        <h2 className="mt-3 text-center text-[clamp(1.6rem,7vw,2.5rem)] text-primary">
          Perjalanan kita
        </h2>
      </SectionReveal>

      <ol className="relative mt-12">
        {/* Garis vertikal: di kiri saat HP, di tengah saat layar besar. */}
        <span
          aria-hidden="true"
          className="absolute left-[1.125rem] top-2 h-[calc(100%-1rem)] w-px bg-border md:left-1/2 md:-translate-x-1/2"
        />

        {site.timeline.map((item, i) => {
          const isLeft = i % 2 === 0; // kartu di kiri (layar besar)
          return (
            <li
              key={`${item.title}-${i}`}
              className={`relative mb-8 pl-12 md:mb-10 md:w-1/2 md:pl-0 ${
                isLeft
                  ? "md:pr-12 md:text-right"
                  : "md:ml-auto md:pl-12 md:text-left"
              }`}
            >
              {/* Titik pada garis */}
              <span
                aria-hidden="true"
                className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background ${
                  isLeft
                    ? "left-[10px] md:left-auto md:right-[-9px]"
                    : "left-[10px] md:left-[-9px]"
                }`}
              />
              <SectionReveal>
                <span className="text-xs uppercase tracking-[0.2em] text-accent">
                  {item.date}
                </span>
                <h3 className="mt-1 font-heading text-xl text-primary sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-base text-foreground/80">
                  {item.description}
                </p>
              </SectionReveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
