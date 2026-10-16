"use client";

import { useSyncExternalStore } from "react";
import { nextTheme, type Theme } from "./theme";

// ---------------------------------------------------------------------------
// useTheme — baca & ubah tema dari sisi browser (aman-hydration).
// ---------------------------------------------------------------------------
// Sama seperti useReducedMotionSafe: useSyncExternalStore memakai snapshot
// server ("light") saat hydration, sehingga HTML server dan render pertama
// browser cocok (tidak ada error #418). Setelah terpasang, nilainya mengikuti
// atribut data-theme yang sesungguhnya. Tema awal sudah dipasang lebih dulu
// oleh skrip kecil di layout (lihat layout.tsx) supaya tidak ada kedipan.

const KEY = "theme";
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

// Snapshot server (dan saat hydration): tema terang.
function getServerSnapshot(): Theme {
  return "light";
}

export function toggleTheme(): void {
  const theme = nextTheme(getSnapshot());
  const root = document.documentElement;

  // Transisi warna halus hanya saat ganti tema (lihat .theme-transition di CSS).
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), 350);

  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // localStorage bisa diblokir (mode privat); tema tetap berlaku sesi ini.
  }
  for (const l of listeners) l();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
