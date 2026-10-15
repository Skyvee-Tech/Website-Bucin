// ---------------------------------------------------------------------------
// make-icons — bikin semua ikon turunan dari SATU sumber: `src/app/icon.svg`
// ---------------------------------------------------------------------------
// Menghasilkan:
//   - src/app/apple-icon.png            (180x180, iOS) persegi penuh, tanpa alpha
//   - public/icons/icon-192.png         (PWA, tile membulat)
//   - public/icons/icon-512.png         (PWA, tile membulat)
//   - public/icons/maskable-512.png     (PWA maskable: tile penuh, mark 62%)
// Kalau ikon berubah: ubah src/app/icon.svg lalu `npm run icons`.
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

if (!letterPath) throw new Error('Tidak menemukan <path d="..."> di ' + iconPath);

const strokeAttrs =
  strokeWidth > 0
    ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="miter"`
    : "";

// Persegi 256x256: rx untuk tile membulat, scale untuk mengecilkan mark (maskable).
function svg({ size, rx = null, scale = 1 }) {
  const rxAttr = rx ? ` rx="${rx}"` : "";
  const gAttr =
    scale !== 1
      ? ` transform="translate(128 128) scale(${scale}) translate(-128 -128)"`
      : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">` +
    `<rect width="256" height="256"${rxAttr} fill="${tile}"/>` +
    `<g${gAttr}><path d="${letterPath}" fill="${letter}"${strokeAttrs}/></g>` +
    `</svg>`
  );
}

// 1) Apple touch icon (persegi penuh, tanpa transparansi)
await sharp(Buffer.from(svg({ size: 180 })))
  .removeAlpha()
  .png()
  .toFile(path.join(root, "src", "app", "apple-icon.png"));

// 2) Ikon PWA
const iconsDir = path.join(root, "public", "icons");
fs.mkdirSync(iconsDir, { recursive: true });

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg({ size, rx: 58 })))
    .png()
    .toFile(path.join(iconsDir, `icon-${size}.png`));
}

// Maskable: tile penuh (tanpa sudut) + mark 62% supaya aman dari mask OS.
await sharp(Buffer.from(svg({ size: 512, scale: 0.62 })))
  .png()
  .toFile(path.join(iconsDir, "maskable-512.png"));

console.log(
  "wrote apple-icon.png + public/icons/{icon-192,icon-512,maskable-512}.png | stroke",
  strokeWidth,
);
