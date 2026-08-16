const CACHE_NAME = 'what-todo-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// install: Simpan file ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Menyimpan file aset ke cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// activate: Hapus cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('🗑️ Menghapus cache lama:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// fetch: Kalau offline, ambil dari Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Kalau ada di cache, pakai itu. Kalau gak ada, ambil dari internet.
      return response || fetch(event.request);
    }).catch(() => {
        // Fallback kalau internet mati total & file belum ada di cache
        if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
        }
    })
  );
});