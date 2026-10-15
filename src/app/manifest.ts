import type { MetadataRoute } from "next";
import { withBase } from "@/lib/withBase";

// Wajib force-static supaya tetap bisa di-generate saat `output: "export"`.
export const dynamic = "force-static";

// Manifest PWA. Semua URL dibungkus withBase supaya ikut base path GitHub Pages.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Untuk Kamu",
    short_name: "Untuk Kamu",
    description:
      "Sebuah halaman kecil yang dibuat khusus untuk seseorang yang spesial.",
    lang: "id",
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#1b1218",
    theme_color: "#1b1218",
    icons: [
      {
        src: withBase("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBase("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBase("/icons/maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
