import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// BASE PATH
// ---------------------------------------------------------------------------
// Di GitHub Pages, website akan diakses di:
//   https://<username>.github.io/<nama-repo>/
// Jadi SEMUA file (halaman, CSS, JS, foto, musik) harus dikasih prefix
// "/<nama-repo>". Kalau tidak, akan error 404.
//
// Nilai prefix ini dibaca dari environment variable NEXT_PUBLIC_BASE_PATH:
// - Saat build di GitHub Actions : diisi "/nama-repo"
// - Saat development di laptop     : dikosongkan (""), jadi biasa buka "/"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Mode "export" => next build menghasilkan website statis murni
  // di folder "out". Tidak butuh server Node. Inilah yang dipakai GitHub Pages.
  output: "export",

  // Setiap halaman ditulis sebagai "<nama>/index.html" supaya URL dengan
  // garis miring di akhir tetap berfungsi di GitHub Pages.
  trailingSlash: true,

  // Prefix untuk semua halaman/asset milik Next.js (chunk JS & CSS di /_next).
  basePath: basePath,
  assetPrefix: basePath,

  images: {
    // GitHub Pages tidak bisa mengoptimalkan gambar secara on-the-fly,
    // jadi matikan optimasi bawaan next/image.
    unoptimized: true,
  },

  // Loader khusus Tailwind CSS v4 saat build memakai Turbopack.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
