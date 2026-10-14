import test from "node:test";
import assert from "node:assert/strict";
import { nextTheme, resolveTheme } from "./theme.ts";

// Menguji logika murni pemilihan tema (tanpa DOM).

test("pilihan user yang tersimpan menang atas setelan sistem", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
});

test("tanpa pilihan tersimpan, ikuti setelan sistem", () => {
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
});

test("nilai tersimpan yang tidak valid diabaikan (ikut sistem)", () => {
  assert.equal(resolveTheme("", true), "dark");
  assert.equal(resolveTheme("ungu", false), "light");
});

test("nextTheme membalik tema", () => {
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("dark"), "light");
});
