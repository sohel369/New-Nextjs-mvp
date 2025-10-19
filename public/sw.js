// Service Worker for Language Learning Quiz System
// Provides offline support and caching

const CACHE_NAME = 'lang-quiz-v1';
const STATIC_CACHE = 'lang-quiz-static-v1';
const DYNAMIC_CACHE = 'lang-quiz-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/quiz',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - try cache first, then network
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Return offline page if available
              return caches.match('/offline.html');
            });
        })
    );
  } else if (request.destination === 'script' || 
             request.destination === 'style' || 
             request.destination === 'image') {
    // Static assets - cache first strategy
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return networkResponse;
            });
        })
    );
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - network first strategy
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request);
        })
    );
  }
});

// Background sync for quiz progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'quiz-progress-sync') {
    console.log('Syncing quiz progress...');
    event.waitUntil(syncQuizProgress());
  }
});

// Sync quiz progress to server
async function syncQuizProgress() {
  try {
    // Get pending progress from IndexedDB
    const pendingProgress = await getPendingProgress();
    
    if (pendingProgress.length > 0) {
      // Send to server
      const response = await fetch('/api/quiz/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: pendingProgress })
      });
      
      if (response.ok) {
        // Clear pending progress
        await clearPendingProgress();
        console.log('Quiz progress synced successfully');
      }
    }
  } catch (error) {
    console.error('Error syncing quiz progress:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Continue Learning',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/quiz')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingProgress() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function clearPendingProgress() {
  // Implementation would depend on your IndexedDB setup
  return;
}

// Cache management
async function cleanOldCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('lang-quiz-') && 
    name !== STATIC_CACHE && 
    name !== DYNAMIC_CACHE
  );
  
  return Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}

// Periodic cache cleanup
setInterval(cleanOldCache, 24 * 60 * 60 * 1000); // Daily cleanup