const CACHE_NAME = "vertika-fit-disabled-cache-v16-final";
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => { event.respondWith(fetch(event.request)); });
