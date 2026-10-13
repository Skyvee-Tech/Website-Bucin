import test from "node:test";
import assert from "node:assert/strict";
import { getElapsed } from "./date.ts";

// Menguji logika murni penghitung waktu bersama (tanpa DOM).

test("menghitung hari, jam, menit dengan benar", () => {
  // Dari 14 Feb 2023 20:00 ke 16 Feb 2023 22:30 = 2 hari 2 jam 30 menit.
  const hasil = getElapsed("2023-02-14T20:00:00", new Date("2023-02-16T22:30:00"));
  assert.deepEqual(hasil, { days: 2, hours: 2, minutes: 30, invalid: false });
});

test("tanggal jadian di masa depan ditampilkan sebagai 0, bukan negatif", () => {
  const hasil = getElapsed("2024-01-01T00:00:00", new Date("2023-01-01T00:00:00"));
  assert.deepEqual(hasil, { days: 0, hours: 0, minutes: 0, invalid: false });
});

test("string tanggal tidak valid ditandai invalid", () => {
  const hasil = getElapsed("bukan-tanggal", new Date("2023-01-01T00:00:00"));
  assert.deepEqual(hasil, { days: 0, hours: 0, minutes: 0, invalid: true });
});
