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
import { loadTrackMeta, type TrackMeta } from "@/lib/trackMeta";

// ---------------------------------------------------------------------------
// AudioProvider — satu elemen <audio> global + state pemutar (playlist).
// ---------------------------------------------------------------------------
// Dipakai bersama oleh gerbang pembuka (mulai musik) dan panel pemutar
// (play/pause, maju/mundur, geser posisi, judul/artis/cover dari tag ID3).

type AudioContextValue = {
  started: boolean; // musik sudah dinyalakan lewat gerbang
  playing: boolean;
  index: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  currentTime: number;
  duration: number;
  meta: TrackMeta | null;
  start: () => void; // mulai putar + fade-in (HARUS dari tap user)
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudio() harus dipakai di dalam <AudioProvider>");
  }
  return ctx;
}

const TARGET_VOLUME = 0.6;

export default function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const tracks = useMemo(() => site.playlist.map((p) => withBase(p)), []);
  const total = tracks.length;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const coverRef = useRef<string | null>(null);
  // Ref untuk dibaca di dalam efek tanpa memicu dependensi ulang.
  const startedRef = useRef(false);
  const playingRef = useRef(false);
  // Penanda "lanjutkan putar" saat lagu habis sendiri (event `ended`).
  const keepPlayingRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Metadata disimpan bersama src-nya, supaya tidak perlu setState saat ganti lagu.
  const [trackMeta, setTrackMeta] = useState<{
    src: string;
    data: TrackMeta;
  } | null>(null);

  const src = tracks[index] ?? "";
  const meta = trackMeta && trackMeta.src === src ? trackMeta.data : null;

  const stopFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  // Dipicu dari tap gerbang. WAJIB dari interaksi user (autoplay diblokir).
  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || started) return;

    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise) playPromise.catch(() => {});
    setStarted(true);

    stopFade();
    fadeRef.current = window.setInterval(() => {
      const a = audioRef.current;
      if (!a) {
        stopFade();
        return;
      }
      const nextVolume = Math.min(TARGET_VOLUME, a.volume + 0.03);
      a.volume = nextVolume;
      if (nextVolume >= TARGET_VOLUME) stopFade();
    }, 50);
  }, [started, stopFade]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) {
      start();
      return;
    }
    if (audio.paused) {
      const p = audio.play();
      if (p) p.catch(() => {});
    } else {
      audio.pause();
    }
  }, [started, start]);

  const goto = useCallback(
    (delta: number) => {
      if (total <= 1) return;
      setIndex((i) => (i + delta + total) % total);
      setCurrentTime(0);
      setDuration(0);
    },
    [total],
  );
  const next = useCallback(() => goto(1), [goto]);
  const prev = useCallback(() => goto(-1), [goto]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  // Samakan durasi dari elemen audio. Dipanggil dari event handler (bukan efek),
  // supaya tidak ada race saat event "loadedmetadata" sudah lewat lebih dulu.
  const syncDuration = useCallback((el: HTMLAudioElement) => {
    setDuration(Number.isFinite(el.duration) ? el.duration : 0);
  }, []);

  const onEnded = useCallback(() => {
    if (total > 1) {
      // Ketika lagu habis, browser TURUT memicu `pause` (playing jadi false),
      // jadi tandai supaya efek ganti-lagu tetap memutar lagu berikutnya.
      keepPlayingRef.current = true;
      setIndex((i) => (i + 1) % total);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [total]);

  // Jaga ref tetap terbaru (tanpa memicu efek lain).
  useEffect(() => {
    startedRef.current = started;
  }, [started]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Ganti lagu: mulai dari awal, lalu putar kalau sebelumnya sedang berjalan
  // ATAU lagu sebelumnya habis sendiri (auto-advance).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    const keepPlaying = keepPlayingRef.current;
    keepPlayingRef.current = false;
    if (keepPlaying || (startedRef.current && playingRef.current)) {
      const p = audio.play();
      if (p) p.catch(() => {});
    }
  }, [index]);

  // Baca tag ID3 lagu aktif -> judul/artis/cover + metadata MediaSession (OS).
  useEffect(() => {
    let cancelled = false;
    loadTrackMeta(src)
      .then((m) => {
        if (cancelled) {
          if (m.coverUrl) URL.revokeObjectURL(m.coverUrl);
          return;
        }
        if (coverRef.current) URL.revokeObjectURL(coverRef.current);
        coverRef.current = m.coverUrl;
        setTrackMeta({ src, data: m });
        if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: m.title ?? "Lagu",
            artist: m.artist ?? "",
            album: m.album ?? "",
            artwork: m.coverUrl ? [{ src: m.coverUrl }] : [],
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Bersihkan interval fade & object URL cover saat provider dilepas.
  useEffect(() => stopFade, [stopFade]);
  useEffect(
    () => () => {
      if (coverRef.current) URL.revokeObjectURL(coverRef.current);
    },
    [],
  );

  const value = useMemo<AudioContextValue>(
    () => ({
      started,
      playing,
      index,
      total,
      hasPrev: total > 1,
      hasNext: total > 1,
      currentTime,
      duration,
      meta,
      start,
      togglePlay,
      next,
      prev,
      seek,
    }),
    [
      started,
      playing,
      index,
      total,
      currentTime,
      duration,
      meta,
      start,
      togglePlay,
      next,
      prev,
      seek,
    ],
  );

  return (
    <AudioCtx.Provider value={value}>
      {children}
      {/* "metadata" (bukan "auto") supaya lagu 5 MB TIDAK diunduh saat halaman
          dibuka; hanya header-nya. Pemutaran penuh menyusul saat gerbang diketuk. */}
      <audio
        ref={audioRef}
        src={src}
        loop={total <= 1}
        preload="metadata"
        onPlay={(e) => {
          setPlaying(true);
          syncDuration(e.currentTarget);
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
          syncDuration(e.currentTarget);
        }}
        onLoadedMetadata={(e) => syncDuration(e.currentTarget)}
        onEnded={onEnded}
      />
    </AudioCtx.Provider>
  );
}
