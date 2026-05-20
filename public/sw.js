const CACHE_NAME = 'ferga-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/khani.png',
  '/KURDISTANSUN.png',
  '/UniQAIDAR_Afarin_001.ttf',
  '/UniQAIDAR_Afarin_002.ttf'
];

// On install, open cache and pre-cache essential static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Failed to cache some static assets during install:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// On activation, clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch events
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests, non-http, or Firebase / Chrome Extension requests
  if (
    event.request.method !== 'GET' ||
    !url.protocol.startsWith('http') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('firebaseapp.com') ||
    url.hostname.includes('firebase')
  ) {
    return; // Let browser handle it normally
  }

  // Strategy: Cache-First for static fonts, images, audios
  const isStaticAsset = 
    url.pathname.endsWith('.ttf') || 
    url.pathname.endsWith('.woff') || 
    url.pathname.endsWith('.woff2') || 
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.svg') || 
    url.pathname.endsWith('.mp3') ||
    url.href.includes('soundjay.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy: Stale-While-Revalidate for app JS/CSS/HTML and general scripts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[SW] Fetch failed for:', event.request.url, err);
      });

      return cachedResponse || fetchPromise;
    })
  );
});
