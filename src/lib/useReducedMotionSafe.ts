"use client";

import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// useReducedMotionSafe — versi aman-hydration dari "kurangi gerak".
// ---------------------------------------------------------------------------
// useReducedMotion bawaan Framer Motion membaca matchMedia pada render pertama
// di browser, sehingga bisa berbeda dengan hasil render di server (SSR) dan
// memicu error hydration (#418). useSyncExternalStore memakai snapshot server
// (false) saat hydration, lalu memperbarui setelahnya — tanpa error.

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Snapshot khusus server (dan saat hydration): anggap tidak mengurangi gerak.
function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
