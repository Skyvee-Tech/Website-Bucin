"use client";

import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// useInstallPrompt — status "pasang ke layar utama" untuk PWA.
// ---------------------------------------------------------------------------
// Mengikuti pola useTheme: state kecil di luar React + useSyncExternalStore,
// dengan snapshot server "unavailable". Jadi tidak ada setState di dalam effect
// (menghindari aturan react-hooks/set-state-in-effect) dan tidak ada mismatch
// saat hydration.

export type InstallState =
  | "unavailable" // browser tidak menawarkan pemasangan
  | "android" // bisa dipasang, ada prompt bawaan (beforeinstallprompt)
  | "ios" // iOS: perlu langkah manual "Bagikan > Tambahkan ke Layar Utama"
  | "dismissed" // user sudah menutup hint
  | "installed"; // sudah terpasang / sedang standalone

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: string }>;
};

const KEY = "install-hint-dismissed";

let started = false;
let dismissed = false;
let installed = false;
let bipEvent: BeforeInstallPromptEvent | null = null;
let snapshot: InstallState = "unavailable";
const listeners = new Set<() => void>();

function isIOS(): boolean {
  const ua = navigator.userAgent;
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    // iPadOS terbaru menyamar sebagai Mac; bedakan lewat sentuhan.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function compute(): InstallState {
  if (installed) return "installed";
  if (dismissed) return "dismissed";
  if (bipEvent) return "android";
  if (isIOS() && !isStandalone()) return "ios";
  return "unavailable";
}

function emit(): void {
  const next = compute();
  if (next === snapshot) return;
  snapshot = next;
  for (const l of listeners) l();
}

// Dipasang sekali, saat komponen pertama kali berlangganan.
function ensure(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  try {
    dismissed = localStorage.getItem(KEY) === "1";
  } catch {
    // localStorage bisa diblokir; anggap belum ditutup
  }
  if (isStandalone()) installed = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    // Tahan prompt bawaan supaya bisa kita tampilkan lewat tombol sendiri.
    event.preventDefault();
    bipEvent = event as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    emit();
  });

  snapshot = compute();
}

function subscribe(cb: () => void): () => void {
  ensure();
  listeners.add(cb);
  // Beri tahu setelah hydration kalau status sebenarnya bukan "unavailable".
  queueMicrotask(() => {
    const next = compute();
    if (next !== snapshot) {
      snapshot = next;
      cb();
    }
  });
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): InstallState {
  ensure();
  return snapshot;
}

function getServerSnapshot(): InstallState {
  return "unavailable";
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function dismissInstallHint(): void {
  dismissed = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // diabaikan
  }
  emit();
}

export async function promptInstall(): Promise<void> {
  const event = bipEvent;
  if (!event) return;
  bipEvent = null;
  await event.prompt().catch(() => {});
  await event.userChoice?.catch(() => {});
  emit();
}
