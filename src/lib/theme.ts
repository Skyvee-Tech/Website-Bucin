// ---------------------------------------------------------------------------
// theme — logika murni pemilihan tema. Tanpa DOM, jadi bisa diuji (node:test).
// ---------------------------------------------------------------------------
export type Theme = "light" | "dark";

// Tema awal: pilihan user (yang tersimpan) menang. Kalau belum ada atau tidak
// valid, ikuti setelan sistem (prefers-color-scheme).
export function resolveTheme(
  stored: string | null | undefined,
  prefersDark: boolean,
): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}
