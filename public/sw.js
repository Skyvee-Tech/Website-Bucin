// ---------------------------------------------------------------------------
// Service worker (PWA) — cache "app shell" agar kunjungan berikutnya cepat/offline.
// ---------------------------------------------------------------------------
// Strategi:
//   - navigasi HTML  : network-first (agar pembaruan situs selalu terlihat),
//                      fallback ke cache / halaman offline.
//   - aset statis     : cache-first (CSS/JS/font/ikon/foto). Aman karena aset
//                       Next ber-hash; foto cukup di-cache saat dimuat.
//   - audio (/music/) : TIDAK di-cache (file besar + respons Range/206 tidak bisa
//                       disimpan Cache API). Dibiarkan lewat apa adanya.
// Naikkan VERSION kalau strategi berubah, agar cache lama dibuang.

const VERSION = "v1";
const CACHE = `bucin-${VERSION}`;

const OFFLINE_HTML = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sedang offline</title><style>
html,body{height:100%;margin:0}
body{display:flex;align-items:center;justify-content:center;background:#1b1218;color:#f3e8ee;font-family:system-ui,sans-serif;text-align:center;padding:2rem}
h1{font-size:1.1rem;font-weight:600;margin:0 0 .5rem}
p{margin:0;opacity:.7;font-size:.9rem}
</style></head><body><div><h1>Sedang offline</h1><p>Halaman ini butuh koneksi sekali saja. Coba lagi ya.</p></div></body></html>`;

function isCacheableAsset(url) {
  if (url.pathname.includes("/music/")) return false; // audio: jangan di-cache
  if (url.pathname.includes("/_next/static/")) return true;
  if (/\/(photos|icons)\//.test(url.pathname)) return true;
  return /\.(?:css|js|woff2|png|jpg|jpeg|svg|ico|webmanifest)$/.test(url.pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Simpan HTML awal supaya bisa dibuka saat offline.
      try {
        await cache.add(new Request(self.registration.scope, { cache: "reload" }));
      } catch {
        /* kalau gagal, tetap lanjut */
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const root = await cache.match(self.registration.scope);
    if (root) return root;
    return new Response(OFFLINE_HTML, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  // Cache API menolak respons 206 (Range) — jadi hanya simpan 200 biasa.
  if (response && response.status === 200) {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isCacheableAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
