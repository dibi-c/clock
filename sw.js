const CACHE_NAME = 'bms-remote-v6.6'; // Naikkan versi ini setiap kali Anda update kode di GitHub
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Tahap Install: Menyimpan file ke cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Memaksa Service Worker baru langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Tahap Activate: Menghapus cache lama agar tidak memenuhi memori
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // CEK: Pastikan respon valid sebelum di-clone dan disimpan
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // PERBAIKAN: Clone dilakukan DI SINI (sebelum dikembalikan)
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse; // Respon asli dikembalikan ke browser
      }).catch(() => {
        // Opsional: Handle jika benar-benar offline dan tidak ada di cache
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Mendengarkan perintah dari tombol 'Update' di index.html
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
