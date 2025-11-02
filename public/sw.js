// Service Worker for PWA with Offline Support
const CACHE_NAME = 'lingua-ai-v2';
const STATIC_CACHE_NAME = 'lingua-ai-static-v2';
const DYNAMIC_CACHE_NAME = 'lingua-ai-dynamic-v2';
const API_CACHE_NAME = 'lingua-ai-api-v2';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

// Routes that should be cached (static pages)
const CACHEABLE_ROUTES = [
  '/dashboard',
  '/lessons',
  '/quiz-system',
  '/language-selection',
  '/profile',
  '/leaderboard',
];

// API routes that can be cached (GET requests only)
const CACHEABLE_APIS = [
  '/api/settings',
  '/api/leaderboard',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        console.log('[SW] Caching static assets');
        
        // Cache static assets with individual error handling
        const cachePromises = STATIC_ASSETS.map(url => 
          cache.add(new Request(url, { cache: 'reload' }))
            .catch(err => {
              console.warn(`[SW] Failed to cache ${url}:`, err);
              return null; // Continue even if one fails
            })
        );
        
        // Also try to cache offline page (but don't fail if it doesn't exist yet)
        cachePromises.push(
          cache.add(new Request('/offline', { cache: 'reload' }))
            .catch(err => {
              console.warn('[SW] Failed to cache /offline (might not exist yet):', err);
              return null;
            })
        );
        
        await Promise.all(cachePromises);
        console.log('[SW] Static assets cached successfully');
        console.log('[SW] Note: Next.js chunks will be cached as pages are visited');
        
        // Skip waiting to activate immediately
        await self.skipWaiting();
        console.log('[SW] Service worker ready');
      } catch (error) {
        console.error('[SW] Cache install failed:', error);
        // Still skip waiting even if cache fails
        await self.skipWaiting();
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Helper function to check if request is cacheable
function isCacheableRequest(request) {
  const url = new URL(request.url);
  
  // Don't cache non-GET requests
  if (request.method !== 'GET') {
    return false;
  }
  
  // Don't cache external resources
  if (url.origin !== location.origin) {
    return false;
  }
  
  // Skip Next.js dev tools and HMR requests (development only)
  if (url.pathname.includes('__nextjs') || 
      url.pathname.includes('_next/webpack-hmr') ||
      url.pathname.includes('__webpack') ||
      url.pathname.includes('on-demand-entries')) {
    return false;
  }
  
  // Don't cache API routes that require authentication or are dynamic
  if (url.pathname.startsWith('/api/chat') || 
      url.pathname.startsWith('/api/ai-coach') ||
      url.pathname.startsWith('/api/create-profile') ||
      url.pathname.startsWith('/api/update-languages')) {
    return false;
  }
  
  return true;
}

// Network-first strategy with cache fallback
async function networkFirst(request, cacheName) {
  try {
    // Try network first with timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), 5000)
    );
    
    const networkResponse = await Promise.race([networkPromise, timeoutPromise]);
    
    // Cache successful responses (but not errors)
    if (networkResponse && networkResponse.ok && networkResponse.status < 400) {
      const cache = await caches.open(cacheName);
      // Clone the response because it can only be consumed once
      const responseToCache = networkResponse.clone();
      // Don't wait for cache to complete
      cache.put(request, responseToCache).catch(err => {
        console.warn('[SW] Failed to cache response:', err);
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    
    // Network failed, try cache - check all cache stores
    let cachedResponse = await caches.match(request);
    if (!cachedResponse) {
      // Try all cache stores
      const allCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, API_CACHE_NAME, CACHE_NAME];
      for (const cacheName of allCaches) {
        try {
          const cache = await caches.open(cacheName);
          cachedResponse = await cache.match(request);
          if (cachedResponse) {
            console.log('[SW] Found in cache:', cacheName);
            break;
          }
        } catch (e) {
          // Cache doesn't exist, continue
        }
      }
    }
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // If it's a navigation request and we're offline, return offline page
    if (request.mode === 'navigate' || request.destination === 'document') {
      // Try to get offline page from cache
      let offlinePage = await caches.match('/offline');
      if (!offlinePage) {
        // Try all caches for offline page
        const allCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, CACHE_NAME];
        for (const cacheName of allCaches) {
          try {
            const cache = await caches.open(cacheName);
            offlinePage = await cache.match('/offline');
            if (offlinePage) break;
          } catch (e) {
            // Cache doesn't exist, continue
          }
        }
      }
      
      if (offlinePage) {
        console.log('[SW] Serving offline page');
        return offlinePage;
      }
      
      // If offline page not cached, create a simple one
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Offline - LinguaAI</title>
            <style>
              body { 
                font-family: system-ui; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                margin: 0;
                background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                color: white;
                text-align: center;
                padding: 20px;
              }
              .container { max-width: 500px; }
              h1 { font-size: 2em; margin-bottom: 1em; }
              p { font-size: 1.2em; opacity: 0.9; }
              button {
                margin-top: 2em;
                padding: 12px 24px;
                background: white;
                color: #1e1b4b;
                border: none;
                border-radius: 8px;
                font-size: 1em;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>You're Offline</h1>
              <p>No internet connection. Please check your connection and try again.</p>
              <button onclick="window.location.reload()">Retry</button>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        })
      });
    }
    
    // Return a basic offline response for other requests
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request, cacheName) {
  // Check specific cache first
  let cachedResponse = null;
  try {
    const cache = await caches.open(cacheName);
    cachedResponse = await cache.match(request);
  } catch (e) {
    // Cache doesn't exist
  }
  
  // Check all caches if not found in specific one
  if (!cachedResponse) {
    const allCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, API_CACHE_NAME, CACHE_NAME];
    for (const cache of allCaches) {
      try {
        const cacheInstance = await caches.open(cache);
        cachedResponse = await cacheInstance.match(request);
        if (cachedResponse) {
          console.log('[SW] Found in alternative cache:', cache);
          return cachedResponse;
        }
      } catch (e) {
        // Cache doesn't exist, continue
      }
    }
  } else {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  // Not in cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.warn('[SW] Failed to cache:', err);
      });
      console.log('[SW] Cached new asset:', request.url);
    }
    return networkResponse;
  } catch (error) {
    // Network failed and not in cache
    console.warn('[SW] Network failed and not cached:', request.url);
    
    // For JavaScript chunks, return empty response instead of error
    // This prevents Next.js from showing error page
    if (request.url.includes('/_next/static/chunks/') || 
        request.url.includes('.js') ||
        request.url.includes('.mjs')) {
      console.log('[SW] Returning empty response for missing JS chunk');
      return new Response('', {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'Content-Type': 'application/javascript',
          'Cache-Control': 'no-cache'
        })
      });
    }
    
    // For CSS files, return empty stylesheet
    if (request.url.includes('.css')) {
      return new Response('', {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'Content-Type': 'text/css',
          'Cache-Control': 'no-cache'
        })
      });
    }
    
    // If it's a navigation request and we're offline, return offline page
    if (request.mode === 'navigate') {
      let offlinePage = await caches.match('/offline');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh data in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, ignore
  });
  
  // Return cached version immediately, or wait for network if no cache
  return cachedResponse || fetchPromise;
}

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting message received');
    self.skipWaiting();
  }
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Always respond to requests within our scope
  if (url.origin !== location.origin) {
    return; // Don't cache external resources
  }
  
  // Skip non-cacheable requests
  if (!isCacheableRequest(request)) {
    return;
  }
  
  // Handle Next.js static files (_next/static) with cache-first
  // These are build-time assets that should be cached aggressively
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }
  
  // Handle Next.js chunks specifically - must cache these for offline
  if (url.pathname.includes('/_next/static/chunks/') || 
      url.pathname.includes('/_next/static/css/') ||
      url.pathname.includes('/_next/static/media/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }
  
  // Handle Next.js data requests (_next/data/) for client-side navigation
  // These are JSON payloads for routes, use network-first
  if (url.pathname.startsWith('/_next/data/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }
  
  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE_NAME));
    return;
  }
  
  // Handle static assets (JS, CSS, images, fonts) with cache-first
  // Match file extensions and also Next.js webpack chunks
  if (url.pathname.match(/\.(js|mjs|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|ico|webp|avif)$/) ||
      url.searchParams.has('_rsc') || // Next.js RSC requests
      url.pathname.includes('webpack') ||
      url.pathname.includes('chunks')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }
  
  // Handle navigation requests (pages) with network-first
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }
  
  // Handle other requests with stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
});

// Background sync for queued requests (when online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement background sync for queued requests
  console.log('[SW] Syncing data in background...');
  // You can add logic here to sync queued API requests
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'LinguaAI';
  const options = {
    body: data.body || 'New notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: 'lingua-ai-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
