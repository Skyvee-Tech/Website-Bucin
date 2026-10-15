"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/withBase";

// ---------------------------------------------------------------------------
// ServiceWorkerRegister — daftarkan service worker (PWA).
// ---------------------------------------------------------------------------
// Hanya di PRODUKSI: kalau jalan di `next dev`, SW akan meng-cache aset dev dan
// membuat perubahan tidak muncul. Didaftarkan setelah halaman selesai dimuat
// supaya tidak berebut bandwidth dengan render awal (menjaga LCP).
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register(withBase("/sw.js")).catch(() => {
        // diabaikan: SW hanya bonus, situs tetap jalan tanpa itu
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
