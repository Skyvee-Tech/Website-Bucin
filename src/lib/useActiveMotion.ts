"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// useActiveMotion — "boleh beranimasi sekarang?"
// ---------------------------------------------------------------------------
// `active` bernilai true HANYA kalau elemennya sedang ada di viewport DAN
// tab-nya terlihat. Dipakai agar animasi dekoratif (partikel hati, denyut,
// marquee) serta interval berhenti saat tidak terlihat — hemat CPU/baterai,
// terutama di HP lemah. Nilai awalnya `false` di server & saat hydration,
// jadi tidak ada mismatch dan dekornya baru muncul setelah terpasang.

function subscribeVisibility(cb: () => void): () => void {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

function getVisible(): boolean {
  return document.visibilityState === "visible";
}

// Server (dan hydration): anggap terlihat, sama seperti HTML server.
function getServerVisible(): boolean {
  return true;
}

export function usePageVisible(): boolean {
  return useSyncExternalStore(subscribeVisibility, getVisible, getServerVisible);
}

export function useActiveMotion<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const visible = usePageVisible();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // margin sedikit supaya animasi sudah jalan sebelum benar-benar masuk layar
      { rootMargin: "150px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, active: inView && visible };
}
