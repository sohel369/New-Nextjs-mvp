'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import LanguageLearningQuiz from '../../components/LanguageLearningQuiz';

const QuizSystemPage: React.FC = () => {
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA Installation handling
  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Handle PWA installation
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      } else {
        console.log('PWA installation declined');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <>
      <Head>
        <title>Language Learning Quiz System</title>
        <meta name="description" content="Interactive language learning quiz with multiple languages and difficulty levels" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LangQuiz" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icon-192x192.png" as="image" />
        <link rel="preload" href="/icon-512x512.png" as="image" />
        
        {/* Meta tags for social sharing */}
        <meta property="og:title" content="Language Learning Quiz System" />
        <meta property="og:description" content="Master languages with interactive quizzes" />
        <meta property="og:image" content="/screenshot-mobile.png" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Language Learning Quiz System" />
        <meta name="twitter:description" content="Master languages with interactive quizzes" />
        <meta name="twitter:image" content="/screenshot-mobile.png" />
      </Head>

      <div className="min-h-screen">
        {/* PWA Install Banner */}
        {showInstallPrompt && !isPWAInstalled && (
          <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📱</div>
                <div>
                  <div className="font-bold">Install LangQuiz App</div>
                  <div className="text-sm opacity-90">Get the full experience with offline support</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstallPWA}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offline Indicator */}
        <div id="offline-indicator" className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50 hidden">
          <div className="flex items-center justify-center">
            <div className="mr-2">📡</div>
            <span>You're offline. Some features may be limited.</span>
          </div>
        </div>

        {/* Main Quiz Component */}
        <LanguageLearningQuiz className={showInstallPrompt ? 'pt-20' : ''} />

        {/* PWA Status Indicator */}
        {isPWAInstalled && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg z-40">
            <div className="text-sm">📱 PWA</div>
          </div>
        )}
      </div>

      {/* Offline Page */}
      <div id="offline-page" className="hidden fixed inset-0 bg-gray-900 text-white flex items-center justify-center z-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📡</div>
          <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
          <p className="text-gray-300 mb-6">
            Don't worry! You can still practice with cached content.
          </p>
          <button
            onClick={() => {
              document.getElementById('offline-page')?.classList.add('hidden');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>

      {/* Scripts for PWA functionality */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Online/Offline detection
            function updateOnlineStatus() {
              const offlineIndicator = document.getElementById('offline-indicator');
              const offlinePage = document.getElementById('offline-page');
              
              if (navigator.onLine) {
                offlineIndicator?.classList.add('hidden');
                offlinePage?.classList.add('hidden');
              } else {
                offlineIndicator?.classList.remove('hidden');
                // Show offline page after 3 seconds of being offline
                setTimeout(() => {
                  if (!navigator.onLine) {
                    offlinePage?.classList.remove('hidden');
                  }
                }, 3000);
              }
            }
            
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
            updateOnlineStatus();
            
            // Prevent zoom on double tap (iOS)
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
              const now = (new Date()).getTime();
              if (now - lastTouchEnd <= 300) {
                event.preventDefault();
              }
              lastTouchEnd = now;
            }, false);
            
            // Prevent context menu on long press
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            });
            
            // Add to home screen detection
            if (window.matchMedia('(display-mode: standalone)').matches) {
              document.body.classList.add('pwa-installed');
            }
          `
        }}
      />
    </>
  );
};

export default QuizSystemPage;
