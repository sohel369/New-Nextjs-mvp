# PWA Offline Setup Guide

This document describes the Progressive Web App (PWA) offline functionality that has been implemented in the Language Learning App.

## Features Implemented

### 1. Service Worker with Advanced Caching Strategies
- **Location**: `public/sw.js`
- **Caching Strategies**:
  - **Cache-First**: For static assets (JS, CSS, images, fonts) - serves from cache immediately
  - **Network-First**: For API requests and page navigation - tries network first, falls back to cache
  - **Stale-While-Revalidate**: For other resources - serves cache immediately while updating in background

### 2. Offline Page
- **Location**: `app/offline/page.tsx`
- Beautiful offline fallback page that shows when the user navigates to an uncached page while offline
- Provides options to continue learning with cached content

### 3. Offline Indicator Component
- **Location**: `components/OfflineIndicator.tsx`
- Shows a banner at the top of the screen when the app detects offline status
- Automatically hides when connection is restored

### 4. Enhanced PWA Registration
- **Location**: `components/PWARegister.tsx`
- Automatically registers the service worker
- Handles service worker updates
- Monitors online/offline status

### 5. Updated Manifest
- **Location**: `public/manifest.json`
- Added offline support flags
- Enhanced with proper icons configuration
- Added shortcuts for quick access to key features

## How It Works

### Service Worker Caching
1. **On Install**: Caches critical static assets and the offline page
2. **On Fetch**: 
   - Static assets → Served from cache immediately (fast loading)
   - Pages → Network first, cache fallback (always fresh content when online)
   - API calls → Network first, cache fallback (respects API freshness)
   - Non-cacheable routes (like `/api/chat`) → Network only

### Offline Behavior
- When offline:
  - Previously visited pages are available from cache
  - Static assets load instantly from cache
  - API responses are served from cache (if previously cached)
  - New page navigation shows the offline page
  - Offline indicator banner appears at the top

### Cache Management
- Separate caches for:
  - Static assets (long-term cache)
  - Dynamic pages (medium-term cache)
  - API responses (short-term cache)
- Automatic cleanup of old cache versions

## Testing Offline Functionality

### Development Testing
1. Build the production version: `npm run build`
2. Start the production server: `npm start`
3. Open Chrome DevTools → Application → Service Workers
4. Check "Offline" checkbox to simulate offline mode
5. Navigate around the app to test cached content

### Manual Testing
1. Visit the app and browse different pages
2. Open DevTools → Network tab → Check "Offline"
3. Try navigating to previously visited pages
4. Try navigating to new pages (should show offline page)
5. Check that static assets still load
6. Uncheck "Offline" to restore connection

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Full support on iOS 11.3+)
- ⚠️ Older browsers (Limited support)

## Next Steps / Enhancements

1. **Background Sync**: Queue API requests when offline and sync when online
2. **Push Notifications**: Implement push notifications for learning reminders
3. **IndexedDB**: Store user data locally for better offline experience
4. **Cache Versioning**: Implement cache version management with update notifications
5. **Offline-First Data**: Cache lesson content and vocabulary for full offline learning

## Configuration

### Service Worker Scope
The service worker is registered with scope `/` and will handle all requests on the site.

### Cache Names
- `lingua-ai-static-v2`: Static assets cache
- `lingua-ai-dynamic-v2`: Dynamic pages cache
- `lingua-ai-api-v2`: API responses cache

### Excluded Routes
The following routes are NOT cached (network only):
- `/api/chat` - Dynamic AI chat
- `/api/ai-coach` - Dynamic AI coach responses
- `/api/create-profile` - POST requests
- `/api/update-languages` - POST requests

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure you're using HTTPS (or localhost for development)
- Clear browser cache and reload

### Cached Content Not Updating
- Service worker updates automatically on page reload
- Clear application cache in DevTools → Application → Clear storage

### Offline Page Not Showing
- Ensure `/offline` route is accessible
- Check that the offline page is cached in the service worker
- Verify service worker is active in DevTools

## Files Modified/Created

- ✅ `public/sw.js` - Enhanced service worker
- ✅ `app/offline/page.tsx` - Offline fallback page
- ✅ `components/OfflineIndicator.tsx` - Offline status indicator
- ✅ `components/PWARegister.tsx` - Enhanced PWA registration
- ✅ `public/manifest.json` - Updated manifest
- ✅ `app/layout.tsx` - Added offline indicator
- ✅ `next.config.ts` - Added PWA headers

