// ---------------------------------------------------------------------------
// optimize-photos.mjs — skrip sekali-jalan untuk menyiapkan foto.
// ---------------------------------------------------------------------------
// Cara pakai:
//   1. Taruh foto mentah di folder raw-photos/
//   2. Jalankan:  npm run photos
//
// Yang dilakukan skrip ini:
// - HANYA memproses file: memori-01.jpg .. memori-10.jpg, fika.jpg, greshya.jpg
//   (pencocokan nama tidak peduli huruf besar/kecil). File lain diabaikan total.
// - Mengosongkan dulu public/photos/ sebelum menulis hasil baru.
// - Memutar foto sesuai orientasi EXIF (.rotate()) supaya tidak salah arah.
// - Ukuran sisi terpanjang: 1600px (memori), 1000px (fika & greshya).
// - Kualitas ~80, diusahakan tiap file < 300KB (diturunkan otomatis bila perlu).
// - TIDAK menyertakan metadata (tanpa withMetadata) -> EXIF & GPS terhapus.
// - Menulis manifest (nama + lebar + tinggi) untuk mencegah layout shift.

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const rawDir = path.join(root, "raw-photos");
const outDir = path.join(root, "public", "photos");
const manifestPath = path.join(root, "src", "content", "photos-manifest.json");

const MAX_MEMORI = 1600;
const MAX_FORMAL = 1000;
const TARGET_BYTES = 300 * 1024; // ~300KB

// Daftar file yang boleh diproses (nama keluaran).
const memoriNames = Array.from(
  { length: 10 },
  (_, i) => `memori-${String(i + 1).padStart(2, "0")}.jpg`,
);

const jobs = [
  ...memoriNames.map((name) => ({ name, max: MAX_MEMORI })),
  { name: "fika.jpg", max: MAX_FORMAL },
  { name: "greshya.jpg", max: MAX_FORMAL },
];

const kb = (bytes) => Math.round(bytes / 1024);

async function optimize(inputPath, outputPath, maxSide) {
  // Coba beberapa tingkat kualitas sampai file cukup kecil.
  const qualities = [80, 72, 64, 56];
  let last = null;
  for (const quality of qualities) {
    const { data, info } = await sharp(inputPath)
      .rotate() // auto-orient berdasarkan EXIF, lalu buang informasi orientasi
      .resize({
        width: maxSide,
        height: maxSide,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true }) // tanpa withMetadata -> metadata hilang
      .toBuffer({ resolveWithObject: true });

    last = { data, info, quality };
    if (data.length <= TARGET_BYTES) break;
  }
  await fs.writeFile(outputPath, last.data);
  return {
    width: last.info.width,
    height: last.info.height,
    bytes: last.data.length,
    quality: last.quality,
  };
}

async function main() {
  // Pastikan folder mentah ada.
  try {
    await fs.access(rawDir);
  } catch {
    console.error(`Folder tidak ditemukan: ${rawDir}`);
    process.exitCode = 1;
    return;
  }

  // Peta nama (huruf kecil) -> nama asli, agar pencocokan tidak peka huruf besar/kecil.
  const entries = await fs.readdir(rawDir);
  const byLower = new Map(entries.map((e) => [e.toLowerCase(), e]));

  // Kosongkan public/photos/ sebelum menulis hasil baru.
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const manifest = {};
  const rows = [];

  for (const job of jobs) {
    const actual = byLower.get(job.name.toLowerCase());
    if (!actual) {
      console.warn(`[lewati] tidak ada file: ${job.name}`);
      continue;
    }
    const inputPath = path.join(rawDir, actual);
    const outputPath = path.join(outDir, job.name);
    const result = await optimize(inputPath, outputPath, job.max);
    manifest[job.name] = { width: result.width, height: result.height };
    rows.push({
      "File": job.name,
      "Ukuran": `${result.width}x${result.height}`,
      "KB": kb(result.bytes),
      "q": result.quality,
    });
  }

  // Tulis manifest (dipakai galeri) — key = nama file.
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  console.log("\nHasil optimasi foto:");
  console.table(rows);
  const over = rows.filter((r) => r.KB > 300);
  if (over.length) {
    console.warn(
      `Perhatian: ${over.length} file masih > 300KB:`,
      over.map((r) => r.File).join(", "),
    );
  }
  console.log(`Manifest: ${path.relative(root, manifestPath)}`);
}

await main();
