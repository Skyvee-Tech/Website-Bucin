import test from "node:test";
import assert from "node:assert/strict";
import { getElapsed } from "./date.ts";

// Menguji logika murni penghitung waktu bersama (tanpa DOM).

test("menghitung hari, jam, menit, detik dengan benar", () => {
  // Dari 14 Feb 2023 20:00:00 ke 16 Feb 2023 22:30:45 = 2 hari 2 jam 30 menit 45 detik.
  const hasil = getElapsed(
    "2023-02-14T20:00:00",
    new Date("2023-02-16T22:30:45"),
  );
  assert.deepEqual(hasil, {
    days: 2,
    hours: 2,
    minutes: 30,
    seconds: 45,
    invalid: false,
  });
});

test("tanggal jadian di masa depan ditampilkan sebagai 0, bukan negatif", () => {
  const hasil = getElapsed("2024-01-01T00:00:00", new Date("2023-01-01T00:00:00"));
  assert.deepEqual(hasil, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    invalid: false,
  });
});

test("string tanggal tidak valid ditandai invalid", () => {
  const hasil = getElapsed("bukan-tanggal", new Date("2023-01-01T00:00:00"));
  assert.deepEqual(hasil, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    invalid: true,
  });
});

test("menerima offset zona waktu (+07:00) dengan benar", () => {
  // 28 Mar 2024 00:00 WIB (+07:00) = 27 Mar 2024 17:00 UTC.
  // Ke 28 Mar 2024 00:00:01 WIB = 1 detik.
  const hasil = getElapsed(
    "2024-03-28T00:00:00+07:00",
    new Date("2024-03-28T00:00:01+07:00"),
  );
  assert.deepEqual(hasil, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 1,
    invalid: false,
  });
});
