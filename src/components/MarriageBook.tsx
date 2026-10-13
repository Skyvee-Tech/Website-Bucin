"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { withBase } from "@/lib/withBase";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// MarriageBook — section "BUKU NIKAH KITA" (versi romantis/candaan).
// ---------------------------------------------------------------------------
// Bukan dokumen resmi: tidak ada lambang negara/instansi. Emblem = monogram
// hati "F & G"; cap dekoratif "SAH MENURUT HATI".
// Sampul emas (gold foil via CSS gradient) dibuka dengan animasi 3D
// (perspective + rotateY). Pengguna reduced-motion mendapat fade biasa.

const GOLD = "#d4af37";

// Tekstur kertas krem (gradien CSS, tanpa gambar eksternal).
const paperStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(138,106,31,0.035) 0 2px, transparent 2px 5px), radial-gradient(120% 120% at 0% 0%, #fffdf7 0%, #fbf3e3 55%, #f6ecd7 100%)",
};

// Efek emas timbul (gold foil) untuk teks.
const goldFoilStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(100deg,#8a6a1f 0%,#f6e27a 22%,#d4af37 42%,#fff6c8 52%,#c9a24b 66%,#8a6a1f 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const coverStyle: React.CSSProperties = {
  background:
    "linear-gradient(160deg,#5c0a24 0%,#7a1030 45%,#45081a 100%)",
  boxShadow:
    "inset 0 0 0 2px rgba(212,175,55,0.55), inset 0 0 50px rgba(0,0,0,0.35)",
  transformOrigin: "left center",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

function HeartEmblem() {
  return (
    <span className="relative block h-16 w-16">
      <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
        <path
          fill={GOLD}
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center pt-1 font-heading text-xs font-semibold text-[#5c0a24]">
        F &amp; G
      </span>
    </span>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 border-[#d4af37] ${className}`}
    />
  );
}

function Page({ person }: { person: typeof site.marriageBook.left }) {
  return (
    <article className="flex flex-col items-center gap-4 px-6 pb-6 pt-7 text-center sm:px-8 sm:pb-8 sm:pt-9">
      <p className="text-[0.7rem] uppercase tracking-[0.35em] text-accent">
        {person.label}
      </p>

      {/* Foto formal dalam bingkai emas dengan sudut hias. Latar foto asli
          TIDAK diubah (object-cover saja). */}
      <div className="relative rounded-xl border-2 border-[#d4af37] p-1.5">
        <div className="relative aspect-[3/4] w-[clamp(9rem,45vw,12rem)] overflow-hidden rounded-lg bg-muted">
          <Image
            src={withBase(person.photo)}
            alt={person.photoAlt}
            fill
            unoptimized
            sizes="(max-width: 768px) 45vw, 200px"
            className="object-cover"
          />
        </div>
        <Corner className="-left-1 -top-1 border-l-2 border-t-2" />
        <Corner className="-right-1 -top-1 border-r-2 border-t-2" />
        <Corner className="-bottom-1 -left-1 border-b-2 border-l-2" />
        <Corner className="-bottom-1 -right-1 border-b-2 border-r-2" />
      </div>

      <h3 className="font-heading text-lg leading-tight text-primary sm:text-xl">
        {person.name}
      </h3>

      {/* Tempat & tanggal lahir — tanpa label, tampil tenang di tengah. */}
      {person.birthPlaceDate ? (
        <p className="text-sm italic text-foreground/70">
          {person.birthPlaceDate}
        </p>
      ) : null}
    </article>
  );
}

export default function MarriageBook() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotionSafe();
  const book = site.marriageBook;

  return (
    <section
      id="buku-nikah"
      className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8"
    >
      <SectionReveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          Tanda cinta
        </p>
        <h2 className="mt-3 text-center text-[clamp(1.6rem,7vw,2.5rem)] text-primary">
          Buku Nikah Kita
        </h2>
        <p className="mt-3 text-center text-sm text-foreground/70">
          Bukan resmi kok — cuma versi kita berdua. Ketuk bukunya.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.05}>
        {/* Pembungkus: perspective untuk efek 3D + overflow-hidden supaya
            sapuan sampul saat terbuka tidak menimbulkan scroll horizontal. */}
        <div
          className="relative mx-auto mt-10 w-full max-w-3xl overflow-hidden"
          style={{ perspective: "1600px" }}
        >
          <div className="relative">
            {/* Isi buku (dua halaman) */}
            <div
              id="buku-nikah-isi"
              className="relative grid grid-cols-1 overflow-hidden rounded-2xl border border-[#e6d6a8] md:grid-cols-2"
              style={paperStyle}
            >
              <Page person={book.left} />
              <Page person={book.right} />

              {/* Lipatan buku (spine): horizontal di HP, vertikal di layar besar */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-[#c9a24b]/50 to-transparent md:hidden"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#c9a24b]/50 to-transparent md:block"
              />
            </div>

            {/* Sampul (menutupi isi, terbuka saat diketuk) */}
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="buku-nikah-isi"
              aria-hidden={open}
              tabIndex={open ? -1 : 0}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl px-8 text-center"
              style={{
                ...coverStyle,
                pointerEvents: open ? "none" : "auto",
              }}
              animate={
                reduce
                  ? { opacity: open ? 0 : 1 }
                  : { rotateY: open ? -150 : 0, opacity: open ? 0 : 1 }
              }
              transition={{ duration: open ? 1.1 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeartEmblem />
              <span
                className="font-heading text-[clamp(1.5rem,7vw,2.5rem)] font-semibold tracking-wide"
                style={goldFoilStyle}
              >
                {book.title}
              </span>
              <span
                className="font-heading text-lg italic"
                style={goldFoilStyle}
              >
                {book.subtitle}
              </span>
              <span className="mt-2 inline-flex h-11 items-center gap-2 rounded-full border border-[#d4af37]/70 px-5 text-xs uppercase tracking-[0.25em] text-[#f6e27a]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 3h8a2 2 0 012 2v14H6V5a2 2 0 012-2z" />
                  <path d="M6 19a2 2 0 002 2h8" />
                </svg>
                Ketuk untuk membuka
              </span>
            </motion.button>

            {/* Pita pembatas buku — menggantung dari tepi atas, di area padding
                halaman, jadi tidak menimpa teks/foto di lebar layar mana pun. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 z-30 h-6 w-3.5 -translate-x-1/2 bg-primary/85 shadow-sm"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
              }}
            />
          </div>
        </div>
      </SectionReveal>

      {/* Janji + data bersama + cap, muncul setelah buku terbuka. */}
      {open ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.7 }}
          className="mx-auto mt-6 max-w-3xl text-center"
        >
          <p className="font-heading text-[clamp(1rem,4.2vw,1.25rem)] italic text-foreground/85">
            “{book.promise}”
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">
            {book.since} · No. Seri {book.serial}
          </p>

          {/* Cap dekoratif miring */}
          <span className="mx-auto mt-5 inline-block -rotate-6 rounded-lg border-4 border-double border-primary/50 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-primary/70">
            {book.stamp}
          </span>

          <div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-11 items-center rounded-full border border-primary/30 px-5 text-sm font-medium text-primary transition active:scale-95"
            >
              Tutup buku
            </button>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
