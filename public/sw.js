/* Minimal service worker: offline fallback only (§288).
   All paths resolve relative to the SW's own location so the same file
   works at "/" (Vercel) and "/Sayan_portfolio/" (GitHub Pages). */
const CACHE = "sayan-os-v1";
const OFFLINE_URL = new URL("offline.html", self.location.href).pathname;
const ICON_URL = new URL("favicon.svg", self.location.href).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL, ICON_URL])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r ?? Response.error()),
      ),
    );
  }
});
