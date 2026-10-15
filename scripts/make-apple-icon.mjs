// ---------------------------------------------------------------------------
// make-apple-icon — bikin src/app/apple-icon.png (ikon "Add to Home Screen" iOS)
// ---------------------------------------------------------------------------
// Sumber TUNGGAL bentuk ikon adalah `src/app/icon.svg`. Skrip ini membacanya
// (fill, path huruf S, dan stroke penebalnya) lalu membuat versi untuk Apple:
//   - persegi PENUH (tanpa sudut membulat) — iOS membulatkan sendiri,
//   - TANPA transparansi (alpha dibuang).
// Kalau ikon berubah: ubah icon.svg lalu jalankan `npm run apple-icon`.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconPath = path.join(root, "src", "app", "icon.svg");
const icon = fs.readFileSync(iconPath, "utf8");

const grab = (re, fallback) => (re.exec(icon)?.[1] ?? fallback).trim();
const tile = grab(/<rect[^>]*\sfill="(#[0-9A-Fa-f]{3,8})"/, "#1B1218");
const letterPath = grab(/<path[^>]*\sd="([^"]+)"/, "");
const letter = grab(/<path[^>]*\sfill="(#[0-9A-Fa-f]{3,8})"/, "#FFF7FA");
const stroke = grab(/<path[^>]*\sstroke="(#[0-9A-Fa-f]{3,8})"/, letter);
const strokeWidth = Number(grab(/<path[^>]*\sstroke-width="([\d.]+)"/, "0")) || 0;

if (!letterPath) {
  throw new Error('Tidak menemukan <path d="..."> di ' + iconPath);
}

// Stroke penebal (small-size cut) ikut dibawa agar ikon konsisten.
const strokeAttrs =
  strokeWidth > 0
    ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="miter"`
    : "";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="${tile}"/>
  <path d="${letterPath}" fill="${letter}"${strokeAttrs}/>
</svg>`;

const out = path.join(root, "src", "app", "apple-icon.png");
await sharp(Buffer.from(svg)).removeAlpha().png().toFile(out);
console.log("Wrote", out, "| stroke", strokeWidth);
