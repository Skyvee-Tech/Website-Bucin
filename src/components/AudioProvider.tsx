"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { site } from "@/content/site";
import { withBase } from "@/lib/withBase";

// ---------------------------------------------------------------------------
// AudioProvider — satu elemen <audio> global yang dibagi ke seluruh halaman.
// ---------------------------------------------------------------------------
// Kenapa lewat Context? Supaya layar pembuka (gate) dan tombol mute melayang
// mengendalikan elemen audio yang SAMA, tanpa masing-masing punya player sendiri.

type AudioContextValue = {
  started: boolean; // apakah musik sudah mulai diputar
  muted: boolean; // status bisu
  start: () => void; // mulai putar + fade-in (HARUS dipanggil dari tap user)
  toggleMute: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

// Hook untuk mengambil state audio dari context.
export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudio() harus dipakai di dalam <AudioProvider>");
  }
  return ctx;
}

const TARGET_VOLUME = 0.6; // volume awal yang dituju (soal spec: 0.6)

export default function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  // Hentikan proses fade kalau masih berjalan.
  const stopFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  // Dipanggil saat user mengetuk gate. Ini WAJIB berasal dari interaksi user,
  // kalau tidak browser akan memblokir autoplay.
  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || started) return;

    audio.volume = 0;
    // play() bisa ditolak (diblokir). Tangani promise-nya agar tidak error.
    const playPromise = audio.play();
    if (playPromise) playPromise.catch(() => {});

    setStarted(true);

    // Fade-in volume dari 0 -> 0.6 secara halus.
    stopFade();
    fadeRef.current = window.setInterval(() => {
      const a = audioRef.current;
      if (!a) {
        stopFade();
        return;
      }
      const next = Math.min(TARGET_VOLUME, a.volume + 0.03);
      a.volume = next;
      if (next >= TARGET_VOLUME) stopFade();
    }, 50);
  }, [started, stopFade]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !audio.muted;
    audio.muted = next;
    setMuted(next);
  }, []);

  // Bersihkan interval saat komponen dilepas.
  useEffect(() => stopFade, [stopFade]);

  const value = useMemo(
    () => ({ started, muted, start, toggleMute }),
    [started, muted, start, toggleMute],
  );

  return (
    <AudioCtx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={withBase(site.musicSrc)}
        loop
        preload="auto"
      />
    </AudioCtx.Provider>
  );
}
