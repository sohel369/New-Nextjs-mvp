# PWA Offline Troubleshooting Guide

If your PWA offline functionality is not working, follow these steps:

## 1. Verify Service Worker is Registered

1. Open Chrome DevTools (F12)
2. Go to **Application** tab → **Service Workers**
3. Check if your service worker is listed and shows status as **activated**
4. Look for any error messages

## 2. Check Service Worker Status

Visit `/pwa-test` page to see detailed status:
- Service Worker registration status
- Cache information
- Online/offline status

## 3. Common Issues and Solutions

### Issue: Service Worker Not Registering

**Symptoms:**
- No service worker in DevTools
- Console shows registration errors

**Solutions:**
1. Ensure you're using HTTPS or localhost (service workers require secure context)
2. Check browser console for errors
3. Clear browser cache and reload
4. Check if service worker file is accessible at `/sw.js`

### Issue: Offline Mode Not Working

**Symptoms:**
- Pages don't load when offline
- Service worker is registered but not intercepting requests

**Solutions:**
1. **Verify service worker is active:**
   - DevTools → Application → Service Workers
   - Should show "activated and is running"

2. **Check if pages are cached:**
   - DevTools → Application → Cache Storage
   - Look for `lingua-ai-dynamic-v2` cache
   - Should contain visited pages

3. **Test offline mode:**
   - Visit pages while online (to cache them)
   - DevTools → Network → Check "Offline"
   - Navigate to previously visited pages
   - Should load from cache

4. **Force service worker update:**
   - DevTools → Application → Service Workers
   - Click "Update" button
   - Or click "Unregister" then reload page

### Issue: Service Worker Updates Not Applying

**Symptoms:**
- Changes to service worker not taking effect
- Old version still running

**Solutions:**
1. **Unregister old service worker:**
   - DevTools → Application → Service Workers
   - Click "Unregister"
   - Clear cache storage
   - Reload page

2. **Hard refresh:**
   - Windows/Linux: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

3. **Clear all data:**
   - DevTools → Application → Clear storage
   - Click "Clear site data"

### Issue: Pages Not Caching

**Symptoms:**
- Visited pages don't appear in cache
- Offline mode shows error pages

**Solutions:**
1. **Check network-first strategy:**
   - Pages use network-first, so they only cache after successful network requests
   - Ensure you visit pages while online first

2. **Verify cache storage:**
   - DevTools → Application → Cache Storage
   - Check if `lingua-ai-dynamic-v2` exists
   - Should contain visited pages

3. **Check for errors:**
   - Console might show cache storage errors
   - Check browser storage quota

### Issue: Static Assets Not Loading Offline

**Symptoms:**
- CSS/JS files fail to load offline
- Images missing when offline

**Solutions:**
1. **Check static cache:**
   - DevTools → Application → Cache Storage
   - Look for `lingua-ai-static-v2`
   - Should contain static assets

2. **Verify cache-first strategy:**
   - Static assets use cache-first
   - Should load immediately from cache

3. **Clear and rebuild cache:**
   - Unregister service worker
   - Clear all caches
   - Reload and visit pages again

## 4. Debugging Steps

### Step 1: Check Service Worker Logs
```
1. Open DevTools Console
2. Look for [SW] and [PWA] prefixed logs
3. Check for error messages
```

### Step 2: Inspect Cache
```
1. DevTools → Application → Cache Storage
2. Expand each cache
3. Verify expected resources are cached
```

### Step 3: Test Offline Mode
```
1. Visit key pages while online:
   - Homepage (/)
   - Quiz system (/quiz-system)
   - Dashboard (/dashboard)

2. Enable offline mode:
   - DevTools → Network → Offline

3. Navigate to visited pages:
   - Should load from cache
   - Should show offline indicator

4. Navigate to new page:
   - Should show offline page
```

### Step 4: Verify Production Build
```
1. Build production version:
   npm run build
   npm start

2. Test in production mode:
   - Service workers work better in production
   - Development mode has hot reload that can interfere
```

## 5. Browser-Specific Issues

### Chrome/Edge
- Full service worker support
- Best for development/testing

### Firefox
- Full service worker support
- May need to allow service workers in settings

### Safari
- Service workers supported on iOS 11.3+
- macOS Safari 11.1+
- May have stricter caching rules

## 6. Quick Fixes

### Quick Reset (Clears Everything)
```javascript
// Run in browser console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
  }
});
location.reload();
```

### Force Service Worker Update
```javascript
// Run in browser console
navigator.serviceWorker.getRegistration().then(function(registration) {
  if (registration) {
    registration.update();
  }
});
```

## 7. Testing Checklist

- [ ] Service worker registered and activated
- [ ] Pages cached after visiting while online
- [ ] Static assets load from cache offline
- [ ] Navigation works offline (cached pages)
- [ ] Offline page shows for uncached pages
- [ ] Online indicator shows/hides correctly
- [ ] Cache updates when online
- [ ] Service worker updates properly

## 8. Still Having Issues?

1. Check browser console for specific error messages
2. Verify Next.js is running in production mode (`npm run build && npm start`)
3. Test on different browsers
4. Check network tab for failed requests
5. Verify `/sw.js` file is accessible and not returning 404

## 9. Common Error Messages

### "Service Worker registration failed"
- Check if file exists at `/sw.js`
- Verify HTTPS/localhost
- Check browser console for details

### "Failed to fetch"
- Network request failed (expected when offline)
- Service worker should handle this and serve from cache

### "QuotaExceededError"
- Cache storage quota exceeded
- Clear old caches or increase quota

