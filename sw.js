const CACHE_NAME = 'my-pwa-cache-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192new.png',
  './icon-512new.png'
];

// Tahap Install: Menyimpan file ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Tahap Fetch: Mengambil data dari cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
