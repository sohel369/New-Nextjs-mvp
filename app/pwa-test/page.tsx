'use client';

import { useEffect, useState } from 'react';

export default function PWATestPage() {
  const [swStatus, setSwStatus] = useState<string>('Checking...');
  const [cacheStatus, setCacheStatus] = useState<Record<string, any>>({});
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    // Check service worker status
    const checkSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            if (registration.active) {
              setSwStatus(`Active (State: ${registration.active.state})`);
            } else if (registration.installing) {
              setSwStatus(`Installing (State: ${registration.installing.state})`);
            } else if (registration.waiting) {
              setSwStatus(`Waiting (State: ${registration.waiting.state})`);
            } else {
              setSwStatus('Registered but not active');
            }
          } else {
            setSwStatus('Not registered');
          }

          // Check cache status
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            const cacheData: Record<string, any> = {};
            
            for (const cacheName of cacheNames) {
              const cache = await caches.open(cacheName);
              const keys = await cache.keys();
              cacheData[cacheName] = {
                size: keys.length,
                keys: keys.map(k => k.url).slice(0, 5) // Show first 5
              };
            }
            
            setCacheStatus(cacheData);
          }
        } catch (error) {
          setSwStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        setSwStatus('Service Workers not supported');
      }
    };

    checkSW();
    const interval = setInterval(checkSW, 2000);

    // Online/offline status
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearCaches = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      alert('All caches cleared!');
      window.location.reload();
    }
  };

  const unregisterSW = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        alert('Service Worker unregistered!');
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">PWA Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Service Worker Status</h2>
          <div className="space-y-2">
            <div>
              <strong>Status:</strong> <span className="text-blue-600">{swStatus}</span>
            </div>
            <div>
              <strong>Online:</strong> <span className={onlineStatus ? 'text-green-600' : 'text-red-600'}>
                {onlineStatus ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <strong>Controller:</strong> {navigator.serviceWorker?.controller ? 'Active' : 'None'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cache Status</h2>
          {Object.keys(cacheStatus).length === 0 ? (
            <p className="text-gray-500">No caches found</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(cacheStatus).map(([name, data]) => (
                <div key={name} className="border-b pb-2">
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-gray-600">
                    {data.size} items cached
                  </div>
                  {data.keys.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      <div>Sample URLs:</div>
                      <ul className="list-disc list-inside ml-2">
                        {data.keys.map((url: string, i: number) => (
                          <li key={i} className="truncate">{url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <button
              onClick={clearCaches}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Clear All Caches
            </button>
            <button
              onClick={unregisterSW}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Unregister Service Worker
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check that Service Worker Status shows "Active"</li>
            <li>Check that Cache Status shows caches with items</li>
            <li>Open Chrome DevTools → Network tab</li>
            <li>Check "Offline" checkbox</li>
            <li>Navigate to other pages - they should load from cache</li>
            <li>Try visiting a new page - should show offline page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

