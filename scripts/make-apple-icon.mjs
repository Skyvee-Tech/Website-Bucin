// ---------------------------------------------------------------------------
// make-apple-icon — bikin src/app/apple-icon.png (ikon "Add to Home Screen" iOS)
// ---------------------------------------------------------------------------
// Ikon Apple harus: persegi penuh, TANPA transparansi, TANPA sudut membulat —
// iOS yang membulatkan sendiri. Karena itu versi ini tidak memakai bingkai
// emas (sudut bingkai akan terpotong oleh mask iOS).
//
// Jalankan: npm run apple-icon  (butuh devDependency `sharp`)
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#33172a"/>
      <stop offset="1" stop-color="#1b1218"/>
    </linearGradient>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f9a8d4"/>
      <stop offset="0.55" stop-color="#f472b6"/>
      <stop offset="1" stop-color="#e0c06a"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#bg)"/>
  <path
    d="M21.4 11.6C21.4 9 18.9 7.9 16.2 7.9C12.9 7.9 10.6 9.4 10.6 12.1C10.6 14.7 12.7 15.9 16 16.9C19.3 17.9 21.4 19.1 21.4 21.8C21.4 24.6 19.1 25.9 15.8 25.9C13.1 25.9 10.6 24.8 10.6 22.2"
    fill="none"
    stroke="url(#s)"
    stroke-width="2.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;

const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "app",
  "apple-icon.png",
);

await sharp(Buffer.from(svg)).removeAlpha().png().toFile(out);
console.log("Wrote", out);
