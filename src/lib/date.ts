// ---------------------------------------------------------------------------
// getElapsed — logika murni penghitung "sudah bersama sejak kapan"
// ---------------------------------------------------------------------------
// Dipisah dari komponen supaya bisa diuji tanpa DOM (lihat date.test.ts).

export type Elapsed = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  invalid: boolean; // true kalau startISO bukan tanggal yang valid
};

export function getElapsed(startISO: string, now: Date = new Date()): Elapsed {
  const start = new Date(startISO);

  // Tanggal tidak valid -> tandai invalid, jangan menghitung.
  if (Number.isNaN(start.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, invalid: true };
  }

  const diffMs = now.getTime() - start.getTime();

  // Tanggal jadian di masa depan (selisih negatif) -> tampilkan 0, bukan negatif.
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, invalid: false };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, invalid: false };
}
