// ---------------------------------------------------------------------------
// id3 — pembaca tag ID3v2 (judul, artis, album, gambar/cover) TANPA dependency.
// ---------------------------------------------------------------------------
// Fungsi murni: menerima byte, mengembalikan info. Byte-nya sendiri diunduh di
// src/lib/trackMeta.ts. Mendukung ID3v2.2/2.3/2.4 (frame teks + APIC).

export type Picture = { mime: string; data: Uint8Array };

export type Id3Info = {
  title: string | null;
  artist: string | null;
  album: string | null;
  picture: Picture | null;
};

function empty(): Id3Info {
  return { title: null, artist: null, album: null, picture: null };
}

function ascii(b: Uint8Array, from: number, to: number): string {
  let s = "";
  for (let i = from; i < to; i++) s += String.fromCharCode(b[i]);
  return s;
}

// Ukuran isi tag (tanpa 10 byte header), atau null kalau bukan ID3v2 didukung.
export function id3TagSize(b: Uint8Array): number | null {
  if (b.length < 10) return null;
  if (b[0] !== 0x49 || b[1] !== 0x44 || b[2] !== 0x33) return null; // "ID3"
  const version = b[3];
  if (version < 2 || version > 4) return null;
  return (
    ((b[6] & 0x7f) << 21) |
    ((b[7] & 0x7f) << 14) |
    ((b[8] & 0x7f) << 7) |
    (b[9] & 0x7f)
  );
}

function decodeText(data: Uint8Array): string {
  if (data.length === 0) return "";
  const enc = data[0];
  const body = data.subarray(1);
  let out: string;
  try {
    if (enc === 0) out = new TextDecoder("windows-1252").decode(body);
    else if (enc === 1) out = new TextDecoder("utf-16").decode(body);
    else if (enc === 2) out = new TextDecoder("utf-16be").decode(body);
    else out = new TextDecoder("utf-8").decode(body);
  } catch {
    out = new TextDecoder("utf-8").decode(body);
  }
  // Buang null terminator & sisa nilai ganda.
  const nul = out.indexOf("\0");
  return (nul >= 0 ? out.slice(0, nul) : out).trim();
}

// Struktur APIC: encoding(1) + mime(diakhiri 0) + tipe(1) + deskripsi(diakhiri 0) + data gambar.
function parsePicture(data: Uint8Array): Picture | null {
  if (data.length < 4) return null;
  const enc = data[0];
  let i = 1;
  let mimeEnd = i;
  while (mimeEnd < data.length && data[mimeEnd] !== 0) mimeEnd++;
  if (mimeEnd >= data.length) return null;
  const mime = ascii(data, i, mimeEnd) || "image/jpeg";
  i = mimeEnd + 1;
  i += 1; // tipe gambar (depan/samping/…)
  if (enc === 1 || enc === 2) {
    while (i + 1 < data.length && !(data[i] === 0 && data[i + 1] === 0)) i += 2;
    i += 2;
  } else {
    while (i < data.length && data[i] !== 0) i++;
    i += 1;
  }
  if (i >= data.length) return null;
  return { mime, data: data.subarray(i) };
}

export function parseId3(b: Uint8Array): Id3Info {
  const info = empty();
  const size = id3TagSize(b);
  if (size === null) return info;

  const version = b[3];
  const end = Math.min(b.length, 10 + size);
  let off = 10;

  // Lewati extended header kalau ada (jarang dipakai).
  if (b[5] & 0x40 && off + 4 <= end) {
    const ext =
      version === 4
        ? ((b[10] & 0x7f) << 21) |
          ((b[11] & 0x7f) << 14) |
          ((b[12] & 0x7f) << 7) |
          (b[13] & 0x7f)
        : (b[10] << 24) | (b[11] << 16) | (b[12] << 8) | b[13];
    off = 10 + (version === 4 ? ext : 4 + ext);
    if (off < 10 || off >= end) off = 10;
  }

  const idLen = version === 2 ? 3 : 4;
  const sizeLen = version === 2 ? 3 : 4;
  const headerLen = idLen + sizeLen + (version === 2 ? 0 : 2); // v2.2 tanpa flag

  while (off + headerLen <= end) {
    const id = ascii(b, off, off + idLen);
    if (!/^[A-Z0-9]{3,4}$/.test(id)) break;

    let frameSize: number;
    if (version === 2) {
      frameSize = (b[off + 3] << 16) | (b[off + 4] << 8) | b[off + 5];
    } else if (version === 4) {
      frameSize =
        ((b[off + 4] & 0x7f) << 21) |
        ((b[off + 5] & 0x7f) << 14) |
        ((b[off + 6] & 0x7f) << 7) |
        (b[off + 7] & 0x7f);
    } else {
      frameSize =
        (b[off + 4] << 24) | (b[off + 5] << 16) | (b[off + 6] << 8) | b[off + 7];
    }

    const dataStart = off + headerLen;
    if (frameSize <= 0 || dataStart + frameSize > end) break;
    const data = b.subarray(dataStart, dataStart + frameSize);

    if (id === "TIT2" || id === "TT2") info.title = decodeText(data) || null;
    else if (id === "TPE1" || id === "TP1") info.artist = decodeText(data) || null;
    else if (id === "TALB" || id === "TAL") info.album = decodeText(data) || null;
    else if (id === "APIC" || id === "PIC") info.picture = parsePicture(data);

    off = dataStart + frameSize;
  }

  return info;
}
