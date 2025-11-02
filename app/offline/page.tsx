'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  const [cachedPages, setCachedPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get list of cached pages
    const getCachedPages = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          const pages: string[] = [];
          
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            
            for (const request of keys) {
              const url = new URL(request.url);
              // Only show HTML pages (navigation requests)
              if (
                request.mode === 'navigate' || 
                request.destination === 'document' ||
                url.pathname.match(/^\/[^/]*$/) || // Root level pages
                url.pathname.match(/^\/[^/]+\/[^/]*$/) // One level deep
              ) {
                // Filter out Next.js internal routes and special pages
                if (
                  !url.pathname.startsWith('/_next') &&
                  !url.pathname.startsWith('/api') &&
                  !url.pathname.startsWith('/offline') &&
                  !url.pathname.includes('.') &&
                  url.origin === window.location.origin
                ) {
                  if (!pages.includes(url.pathname)) {
                    pages.push(url.pathname);
                  }
                }
              }
            }
          }
          
          setCachedPages(pages.sort());
        } catch (error) {
          console.error('Error getting cached pages:', error);
        }
      }
      setLoading(false);
    };

    getCachedPages();
  }, []);

  const handleNavigate = (href: string) => {
    // Use window.location for offline navigation to bypass Next.js router
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Offline Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
            {/* Animated pulse ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-blue-100 text-lg mb-8">
          No internet connection detected. Don't worry - you can still continue learning with cached content!
        </p>

        {/* Features Available Offline */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4 mb-8">
          <h2 className="text-white font-semibold text-lg mb-3">
            Available Offline:
          </h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center text-blue-100">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Practice quizzes and lessons</span>
            </div>
            <div className="flex items-center text-blue-100">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>View your progress and statistics</span>
            </div>
            <div className="flex items-center text-blue-100">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Browse vocabulary and lessons</span>
            </div>
          </div>
        </div>

        {/* Cached Pages List */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <p className="text-blue-100 text-center">Checking cached pages...</p>
          </div>
        ) : cachedPages.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-white font-semibold text-lg mb-3">
              Cached Pages Available:
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cachedPages.map((page) => (
                <button
                  key={page}
                  onClick={() => handleNavigate(page)}
                  className="block w-full text-left bg-white/5 hover:bg-white/10 text-blue-100 px-4 py-2 rounded transition-colors text-sm"
                >
                  {page === '/' ? 'Home' : page.replace(/^\//, '').replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-6 mb-8 border border-yellow-500/30">
            <p className="text-yellow-100 text-sm text-center">
              No cached pages found. Visit some pages while online to enable offline access.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {cachedPages.length > 0 && (
            <>
              <button
                onClick={() => handleNavigate('/quiz-system')}
                className="block w-full bg-white text-blue-900 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Go to Quiz System
              </button>
              <button
                onClick={() => handleNavigate('/')}
                className="block w-full bg-white/20 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
              >
                Go to Home
              </button>
            </>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="block w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
          >
            Check Connection
          </button>
        </div>

        {/* Connection Status Indicator */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-blue-200 text-sm">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span>Offline Mode</span>
        </div>
      </div>
    </div>
  );
}

