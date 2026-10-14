"use client";

import { useState } from "react";
import MusicButton from "./MusicButton";
import MusicPanel from "./MusicPanel";
import ThemeToggle from "./ThemeToggle";

// ---------------------------------------------------------------------------
// FloatingControls — kumpulan tombol melayang di kanan bawah.
// ---------------------------------------------------------------------------
// Berisi panel pemutar musik (muncul di atas bila dibuka) dan sebaris tombol:
// tombol tema + tombol musik, bersebelahan. Ditaruh di dekat jempol dan
// menghormati safe-area (poni/gesture bar HP). z di atas gerbang pembuka.
export default function FloatingControls() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed z-[51] flex flex-col items-end gap-3"
      style={{
        right: "calc(1rem + env(safe-area-inset-right))",
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <MusicPanel open={open} />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <MusicButton open={open} onToggle={() => setOpen((o) => !o)} />
      </div>
    </div>
  );
}
