/* TooLongAgo — service worker
 * Strategy:
 *  - Network-first for HTML, JS, CSS, JSON: online users always get the latest deploy.
 *    Cache is a fallback when offline.
 *  - Cache-first (stale-while-revalidate) for icons / manifest / static media.
 *  - skipWaiting + clients.claim so a new SW takes over immediately.
 *  - Listens for SKIP_WAITING messages from the page as a manual override.
 */

const CACHE = "toolongago-runtime-v1";
const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "logo.svg",
  "favicon.svg",
  "manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // bypass cross-origin

  const path = url.pathname;
  // "Source" files that should always reflect the latest deploy when online.
  const isSource =
    req.mode === "navigate" ||
    path === "/" || path.endsWith("/") ||
    /\.(?:html|js|css|json|webmanifest)$/i.test(path);

  if (isSource) {
    // Network-first: try fresh, fall back to cache offline. Cache the new response either way.
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        if (cached) return cached;
        // Last resort: try to serve index.html for navigations
        if (req.mode === "navigate") {
          const fallback = await caches.match("index.html");
          if (fallback) return fallback;
        }
        throw e;
      }
    })());
    return;
  }

  // Cache-first (stale-while-revalidate) for icons and other static media.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const networkFetch = fetch(req).then(resp => {
      caches.open(CACHE).then(cache => cache.put(req, resp.clone())).catch(() => {});
      return resp;
    }).catch(() => cached);
    return cached || networkFetch;
  })());
});

// Bring the app to the front when a notification is clicked.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of allClients) {
      if ("focus" in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow("./");
  })());
});
