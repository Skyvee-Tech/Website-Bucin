// ---------------------------------------------------------------------------
// trackMeta — unduh tag ID3 sebuah lagu lalu siapkan judul/artis/cover.
// ---------------------------------------------------------------------------
// Dipakai di sisi browser. Sengaja HANYA mengambil bagian tag, bukan seluruh
// file mp3: pakai permintaan HTTP Range kalau didukung server; kalau tidak,
// baca stream sedikit-sedikit lalu dibatalkan.

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

// Baca stream sampai byte tag lengkap, lalu batalkan (untuk server tanpa Range).
async function readUntilTag(res: Response): Promise<Uint8Array> {
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

export async function fetchId3Tag(src: string): Promise<Uint8Array> {
  // Minta 10 byte header dulu. Kalau server mendukung Range (206), kita bisa
  // mengunduh tepat sebesar tag-nya saja.
  const head = await fetch(src, { headers: { Range: "bytes=0-9" } });
  if (head.status !== 206) return readUntilTag(head); // server abaikan Range
  const headBytes = new Uint8Array(await head.arrayBuffer());

  const size = id3TagSize(headBytes);
  if (size === null) return headBytes;

  const end = Math.min(9 + size, MAX_TAG - 1);
  const tag = await fetch(src, { headers: { Range: `bytes=0-${end}` } });
  if (tag.status !== 206) return readUntilTag(tag);
  const tagBytes = new Uint8Array(await tag.arrayBuffer());
  return tagBytes.length >= headBytes.length ? tagBytes : headBytes;
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
