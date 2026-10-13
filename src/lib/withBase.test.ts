import test from "node:test";
import assert from "node:assert/strict";
import { withBase } from "./withBase.ts";

// Menguji helper base path agar aset /public tidak 404 di GitHub Pages.

test("tanpa base path, path tetap diawali garis miring", () => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  assert.equal(withBase("photos/a.jpg"), "/photos/a.jpg");
  assert.equal(withBase("/photos/a.jpg"), "/photos/a.jpg");
});

test("dengan base path, prefix repo ditambahkan", () => {
  process.env.NEXT_PUBLIC_BASE_PATH = "/website-bucin";
  assert.equal(withBase("/photos/a.jpg"), "/website-bucin/photos/a.jpg");
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

test("prefix tidak digandakan kalau path sudah punya base path", () => {
  process.env.NEXT_PUBLIC_BASE_PATH = "/website-bucin";
  assert.equal(
    withBase("/website-bucin/photos/a.jpg"),
    "/website-bucin/photos/a.jpg",
  );
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});
