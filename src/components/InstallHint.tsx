"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAudio } from "./AudioProvider";
import {
  dismissInstallHint,
  promptInstall,
  useInstallState,
} from "@/lib/useInstallPrompt";

// ---------------------------------------------------------------------------
// InstallHint — ajakan "pasang ke layar utama" (PWA).
// ---------------------------------------------------------------------------
// Muncul SETELAH gerbang dibuka (pakai status `started` dari audio) + jeda
// sebentar, supaya tidak mengganggu render pertama (LCP) maupun gerbang.
// Android: tombol memicu dialog install bawaan. iOS: petunjuk manual karena
// iOS tidak punya prompt otomatis.
export default function InstallHint() {
  const { started } = useAudio();
  const state = useInstallState();
  const [show, setShow] = useState(false);

  const installable = state === "android" || state === "ios";

  useEffect(() => {
    if (!started || !installable) return;
    const timer = window.setTimeout(() => setShow(true), 3500);
    return () => window.clearTimeout(timer);
  }, [started, installable]);

  if (!show || !installable) return null;

  const isIos = state === "ios";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      role="region"
      aria-label="Pasang ke layar utama"
      className="fixed left-4 right-4 z-[55] mx-auto max-w-sm rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-md"
      style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5" />
            <path d="M5 17v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm text-primary">
            {isIos ? "Tambahkan ke layar utama" : "Pasang di layar utama"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">
            {isIos
              ? "Ketuk tombol Bagikan (⬆) di Safari, lalu pilih “Tambahkan ke Layar Utama”."
              : "Buka lebih cepat, seperti aplikasi."}
          </p>
          <button
            type="button"
            onClick={() => {
              if (isIos) dismissInstallHint();
              else void promptInstall();
            }}
            className="mt-2 inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition active:scale-95"
          >
            {isIos ? "Mengerti" : "Pasang"}
          </button>
        </div>

        <button
          type="button"
          onClick={dismissInstallHint}
          aria-label="Tutup ajakan pasang"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/60 transition active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
