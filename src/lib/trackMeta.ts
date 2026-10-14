// ---------------------------------------------------------------------------
// trackMeta — unduh tag ID3 sebuah lagu lalu siapkan judul/artis/cover.
// ---------------------------------------------------------------------------
// Dipakai di sisi browser. Hanya mengunduh bagian tag (streaming) lalu berhenti,
// jadi tidak perlu mengunduh seluruh file mp3.

import { id3TagSize, parseId3, type Id3Info } from "./id3";

export type TrackMeta = {
  title: string | null;
  artist: string | null;
  album: string | null;
  coverUrl: string | null;
};

const MAX_TAG = 8 * 1024 * 1024; // batas aman kalau tag rusak/aneh

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

// Ambil byte tag ID3 saja dengan membaca stream sedikit demi sedikit.
export async function fetchId3Tag(src: string): Promise<Uint8Array> {
  const res = await fetch(src);
  if (!res.body) return new Uint8Array(0);
  const reader = res.body.getReader();
  let buffer: Uint8Array = new Uint8Array(0);
  let need = 10;
  try {
    while (buffer.length < need) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) buffer = concat(buffer, value);
      if (need === 10 && buffer.length >= 10) {
        const size = id3TagSize(buffer);
        if (size === null) break; // bukan ID3v2 -> berhenti
        need = Math.min(10 + size, MAX_TAG);
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // diabaikan
    }
  }
  return buffer;
}

export async function loadTrackMeta(src: string): Promise<TrackMeta> {
  let info: Id3Info = { title: null, artist: null, album: null, picture: null };
  try {
    info = parseId3(await fetchId3Tag(src));
  } catch {
    // File tak bisa dibaca / bukan mp3 bertag: biarkan kosong.
  }

  let coverUrl: string | null = null;
  if (info.picture && info.picture.data.length > 0) {
    coverUrl = URL.createObjectURL(
      new Blob([new Uint8Array(info.picture.data)], {
        type: info.picture.mime,
      }),
    );
  }

  return {
    title: info.title,
    artist: info.artist,
    album: info.album,
    coverUrl,
  };
}
