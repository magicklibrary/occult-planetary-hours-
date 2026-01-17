// Service Worker for Planetary Hours App v3.0
// Enhanced security and offline functionality

const CACHE_NAME = 'planetary-hours-v3.0';
const CACHE_VERSION = 3;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Rate limiting for API calls
const rateLimiter = {
  requests: new Map(),
  maxRequests: 60,
  timeWindow: 60000, // 1 minute
  
  canMakeRequest(key) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Cache installation failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .catch(err => console.error('[SW] Activation failed:', err))
  );
});

// Fetch event with security enhancements
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle same-origin requests and whitelisted APIs
  const isAllowedOrigin = url.origin === self.location.origin;
  const isAllowedAPI = url.hostname === 'nominatim.openstreetmap.org';
  
  if (!isAllowedOrigin && !isAllowedAPI) {
    return;
  }
  
  // Rate limiting for external API calls
  if (isAllowedAPI) {
    if (!rateLimiter.canMakeRequest(url.hostname)) {
      event.respondWith(
        new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        })
      );
      return;
    }
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache invalid responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache valid responses
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Return cached index as fallback
        return caches.match('./index.html');
      })
  );
});

// Message handler for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});
