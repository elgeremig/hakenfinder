/* BA-Hakenfinder – Offline-Speicher. Bei jedem Update VERSION hochzählen. */
const VERSION = "2026-11-22-2";
const CACHE = "hakenfinder-" + VERSION;
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "archivo-latin-600-normal.woff2",
  "archivo-latin-700-normal.woff2",
  "source-sans-3-latin-400-normal.woff2",
  "source-sans-3-latin-600-normal.woff2",
  "ibm-plex-mono-latin-500-normal.woff2",
  "ibm-plex-mono-latin-600-normal.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("hakenfinder-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).catch(() => req.mode === "navigate" ? caches.match("index.html") : Response.error());
    })
  );
});
