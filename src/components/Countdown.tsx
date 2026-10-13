"use client";

import { useEffect, useState } from "react";
import { getElapsed, type Elapsed } from "@/lib/date";
import { site } from "@/content/site";
import SectionReveal from "./SectionReveal";

// ---------------------------------------------------------------------------
// Countdown — penghitung "sudah bersama selama ..." (hari, jam, menit, detik).
// ---------------------------------------------------------------------------
// Nilai awal `null` supaya server & browser tidak berbeda (hindari hydration
// mismatch); nilainya baru dihitung setelah komponen terpasang di browser,
// lalu diperbarui tiap 1 detik. Interval dibersihkan saat unmount.

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white/70 px-2 py-4 shadow-sm backdrop-blur-sm sm:px-3 sm:py-5">
      <span className="font-heading text-[clamp(1.75rem,8vw,3rem)] leading-none tabular-nums text-primary">
        {value === null ? "–" : value}
      </span>
      <span className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-accent sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);

  useEffect(() => {
    const update = () => setElapsed(getElapsed(site.startDate));
    // Hitung langsung setelah mount, lalu berdetak tiap detik.
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="penghitung"
      className="mx-auto w-full max-w-2xl px-5 py-20 text-center sm:px-8"
    >
      <SectionReveal>
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          Sejak {site.startDate.slice(0, 10).split("-").reverse().join("/")}
        </p>
        <h2 className="mt-3 text-[clamp(1.6rem,7vw,2.5rem)] text-primary">
          Kita sudah bersama selama
        </h2>
      </SectionReveal>

      {elapsed?.invalid ? (
        <p className="mt-8 text-base text-foreground/70">
          Tanggal jadian belum diisi dengan benar, tapi kita tetap bersama kok.
        </p>
      ) : (
        <SectionReveal
          delay={0.1}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
        >
          <Stat label="Hari" value={elapsed?.days ?? null} />
          <Stat label="Jam" value={elapsed?.hours ?? null} />
          <Stat label="Menit" value={elapsed?.minutes ?? null} />
          <Stat label="Detik" value={elapsed?.seconds ?? null} />
        </SectionReveal>
      )}
    </section>
  );
}
