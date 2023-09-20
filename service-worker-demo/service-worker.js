const cacheName = 'offline-cache-v1';

// Files to cache
const filesToCache = [
  './',
  './offline.html',
  './offline-image.jpg'
];

// install web service: add all files to cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(filesToCache); //reload all files
      })
  );
});

// activate: clean up cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// intercept: fetch request
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        // no response -> return always cached offline page
        return fetch(event.request)
          .catch(() => {
            return caches.match('./offline.html');
          });
      })
  );
});
