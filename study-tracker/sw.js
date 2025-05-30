const CACHE_NAME = 'study-tracker-cache-v1.3'; // Incremented version for new UI
const URLS_TO_CACHE = [
  './', 
  './index.html',
  // Essential CDNs - best effort for offline shell if user loads once online.
  // For full control, self-host these or ensure robust error handling for their absence.
  // Note: Caching opaque responses from 'no-cors' requests to CDNs can be problematic for updates.
  // 'https://cdn.tailwindcss.com', // Consider removing if causing issues and relying on browser cache.
  // 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' // Same as above.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        // Prioritize local assets for core offline functionality
        return cache.addAll(['./', './index.html'])
          .catch(error => {
            console.error('Failed to cache core local assets during install:', error);
          });
      })
      // Attempt to cache external resources separately and non-blockingly if needed
      // This part is tricky and depends on desired offline robustness for external assets.
      // For now, focusing on the local shell being available.
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Cache-first strategy for local assets / app shell
  if (URLS_TO_CACHE.includes(event.request.url) || event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            // Optionally clone and cache new local assets if needed,
            // but install should cover the basics.
            return networkResponse;
          });
        })
    );
    return;
  }
  
  // Network-first for other assets (like CDN, if not pre-cached aggressively or if SW fetch for them is removed)
  // or just let them pass through if SW doesn't explicitly handle them.
  event.respondWith(
    fetch(event.request).catch(() => {
        // Optional: return a specific offline response for failed non-core assets
        // console.warn('Network request failed for:', event.request.url);
    })
  );
});