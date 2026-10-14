import test from "node:test";
import assert from "node:assert/strict";
import { id3TagSize, parseId3 } from "./id3.ts";

// Menguji pembaca tag ID3v2 murni (tanpa DOM).

function textFrame(id: string, text: string): number[] {
  const body = [0x00, ...[...text].map((c) => c.charCodeAt(0))]; // encoding 0 = latin1
  return [
    ...[...id].map((c) => c.charCodeAt(0)),
    (body.length >>> 24) & 0xff,
    (body.length >>> 16) & 0xff,
    (body.length >>> 8) & 0xff,
    body.length & 0xff,
    0x00,
    0x00,
    ...body,
  ];
}

function apicFrame(mime: string, img: number[]): number[] {
  const body = [
    0x00, // encoding latin1
    ...[...mime].map((c) => c.charCodeAt(0)),
    0x00, // akhir mime
    0x03, // tipe gambar = cover depan
    0x00, // deskripsi kosong (diakhiri 0)
    ...img,
  ];
  return [
    0x41,
    0x50,
    0x49,
    0x43, // "APIC"
    (body.length >>> 24) & 0xff,
    (body.length >>> 16) & 0xff,
    (body.length >>> 8) & 0xff,
    body.length & 0xff,
    0x00,
    0x00,
    ...body,
  ];
}

function synchsafe(n: number): number[] {
  return [(n >>> 21) & 0x7f, (n >>> 14) & 0x7f, (n >>> 7) & 0x7f, n & 0x7f];
}

function buildId3(frames: number[][]): Uint8Array {
  const content = frames.flat();
  // Header ID3v2.3: "ID3", 3, 0, flag 0, lalu ukuran (synchsafe).
  return Uint8Array.from([
    0x49,
    0x44,
    0x33,
    0x03,
    0x00,
    0x00,
    ...synchsafe(content.length),
    ...content,
  ]);
}

test("membaca judul, artis, dan cover dari ID3v2.3", () => {
  const img = [0xff, 0xd8, 0xff, 0xe0, 0x01, 0x02, 0x03, 0x04];
  const bytes = buildId3([
    textFrame("TIT2", "Lagu Kita"),
    textFrame("TPE1", "Skyvee"),
    apicFrame("image/jpeg", img),
  ]);

  const info = parseId3(bytes);
  assert.equal(info.title, "Lagu Kita");
  assert.equal(info.artist, "Skyvee");
  assert.equal(info.picture?.mime, "image/jpeg");
  assert.deepEqual([...(info.picture?.data ?? [])], img);
});

test("tag tanpa APIC -> picture null", () => {
  const bytes = buildId3([textFrame("TIT2", "Hanya Judul")]);
  const info = parseId3(bytes);
  assert.equal(info.title, "Hanya Judul");
  assert.equal(info.picture, null);
});

test("bukan byte ID3 -> kosong & ukuran null", () => {
  const bytes = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(id3TagSize(bytes), null);
  assert.deepEqual(parseId3(bytes), {
    title: null,
    artist: null,
    album: null,
    picture: null,
  });
});
