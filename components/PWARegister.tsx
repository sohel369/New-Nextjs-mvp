'use client';

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistered, setSwRegistered] = useState(false);
  const [swError, setSwError] = useState<string | null>(null);

  useEffect(() => {
    // Register service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          // Check if service worker is already registered
          const existingRegistration = await navigator.serviceWorker.getRegistration();
          
          if (existingRegistration) {
            console.log('[PWA] Service Worker already registered:', existingRegistration);
            setSwRegistered(true);
            
            // Check if it's active
            if (existingRegistration.active) {
              console.log('[PWA] Service Worker is active');
            }
            
            // Check for updates
            await existingRegistration.update();
            return;
          }

          // Register new service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none' // Always check for updates
          });
          
          console.log('[PWA] Service Worker registered:', registration);
          setSwRegistered(true);
          setSwError(null);

          // Wait for the service worker to become active
          if (registration.installing) {
            const installingWorker = registration.installing;
            installingWorker.addEventListener('statechange', () => {
              console.log('[PWA] Service Worker state:', installingWorker.state);
              if (installingWorker.state === 'activated') {
                console.log('[PWA] Service Worker activated!');
                // Reload to use the new service worker
                if (navigator.serviceWorker.controller) {
                  window.location.reload();
                }
              }
            });
          } else if (registration.waiting) {
            console.log('[PWA] Service Worker waiting, skip waiting...');
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          } else if (registration.active) {
            console.log('[PWA] Service Worker already active');
          }

          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('[PWA] Service Worker update found');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('[PWA] New Service Worker state:', newWorker.state);
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New service worker available');
                  // Optionally show update notification to user
                }
              });
            }
          });

          // Listen for service worker controller changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[PWA] Service worker controller changed');
            setSwRegistered(true);
          });

          // Listen for service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('[PWA] Message from service worker:', event.data);
            if (event.data && event.data.type === 'SKIP_WAITING') {
              window.location.reload();
            }
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('[PWA] Service Worker registration failed:', error);
          setSwError(errorMessage);
        }
      };

      // Register immediately, but with a small delay to not block initial render
      const timeoutId = setTimeout(() => {
        registerSW();
      }, 500);

      // Also register when page becomes visible (user comes back to tab)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !swRegistered) {
          registerSW();
        }
      });

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      console.warn('[PWA] Service Workers not supported in this browser');
      setSwError('Service Workers not supported');
    }

    // Online/Offline status detection
    const handleOnline = () => {
      setIsOnline(true);
      console.log('[PWA] Online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('[PWA] Offline');
    };

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [swRegistered]);

  // Debug info (remove in production)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    useEffect(() => {
      navigator.serviceWorker?.getRegistration().then((reg) => {
        if (reg) {
          console.log('[PWA Debug] Registration:', reg);
          console.log('[PWA Debug] Active:', reg.active?.state);
          console.log('[PWA Debug] Controller:', navigator.serviceWorker.controller?.state);
        }
      });
  }, []);
  }

  return null;
}
