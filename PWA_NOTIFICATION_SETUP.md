# PWA & Notification System Setup Guide

Complete guide for testing the YouTube-style notification system and PWA installation.

## ✅ What's Implemented

### 1. **PWA Install Prompt** (`components/PWAInstall.tsx`)
- ✅ Custom floating "Install this app" button
- ✅ Uses `beforeinstallprompt` event
- ✅ Stores user preference in localStorage (7-day expiry)
- ✅ iOS-specific instructions
- ✅ Framer Motion animations
- ✅ Safe area support for mobile

### 2. **Notification System**
- ✅ YouTube-style bell icon with red badge
- ✅ Shows unread count (99+ for overflow)
- ✅ Notification modal with read/unread status
- ✅ Mark as read / Delete functionality
- ✅ Mark all as read button
- ✅ Real-time updates from Supabase

### 3. **Service Worker** (`public/sw.js`)
- ✅ Push notification handler
- ✅ Background sync for notifications
- ✅ Offline caching
- ✅ Message passing to clients

### 4. **Toast Notifications** (`components/NotificationToast.tsx`)
- ✅ YouTube-style toast notifications
- ✅ Slide-in animations (Framer Motion)
- ✅ Auto-dismiss with progress bar
- ✅ Multiple toasts support (max 4)
- ✅ Type indicators (success, info, warning, error)

### 5. **PWA Support**
- ✅ Updated `manifest.json` with icons
- ✅ Service worker registration
- ✅ Offline support

## 🚀 Testing Instructions

### Localhost Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open in Chrome/Edge:**
   - Navigate to `http://localhost:3000`
   - Open DevTools (F12) → Application tab
   - Check Service Workers section (should show registered)

3. **Test PWA Install Prompt:**
   - The install prompt should appear after 3 seconds
   - Click "Install" to test installation
   - For iOS testing, use Safari on Mac or actual iOS device

4. **Test Notifications:**
   - Click the bell icon (🔔) in the top-right
   - Use the test button on home page (dev mode only)
   - Or create notifications via API:
     ```javascript
     // In browser console
     fetch('/api/notifications/create', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         user_id: 'YOUR_USER_ID',
         event_type: 'achievement_unlocked',
         metadata: { achievementName: 'Test Notification' }
       })
     })
     ```

5. **Test Browser Notifications:**
   - Grant notification permission when prompted
   - New notifications will show browser notifications
   - Click notification to open the app

### Android Testing

1. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

2. **Access from Android device:**
   - Ensure your computer and Android device are on the same network
   - Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - On Android, navigate to `http://YOUR_IP:3000`

3. **Install PWA:**
   - Chrome will show "Add to Home Screen" banner
   - Or use the custom install prompt
   - Tap "Install" or "Add to Home Screen"

4. **Test Notifications:**
   - Grant notification permission
   - Create notifications via API or test button
   - Should see both in-app toasts and system notifications

### iOS Testing

1. **Use Safari on Mac:**
   - Connect iOS device via USB
   - Enable Web Inspector in Safari → Develop menu
   - Or test on physical device via network IP

2. **Install PWA:**
   - Tap share button (□↑) in Safari
   - Select "Add to Home Screen"
   - The custom prompt shows instructions for this

3. **Test Notifications:**
   - iOS requires user interaction to request permission
   - Click bell icon to trigger permission request
   - Notifications work when app is in foreground

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Click the install prompt that appears
2. Or click the install icon in address bar
3. App will install as standalone window

### Android
1. Custom install prompt appears after 3 seconds
2. Or Chrome's native "Add to Home Screen" banner
3. App installs to home screen

### iOS
1. Use Safari browser
2. Tap share button (□↑)
3. Select "Add to Home Screen"
4. Custom prompt shows instructions

## 🔔 Notification Features

### Notification Bell
- **Location:** Top-right corner of navbar
- **Badge:** Red circle with unread count
- **Animation:** Pulses when new notifications arrive
- **Click:** Opens notification modal

### Notification Modal
- **Features:**
  - Shows all notifications (read/unread)
  - Mark individual notifications as read
  - Delete notifications
  - Mark all as read
  - Click action URLs to navigate

### Toast Notifications
- **Location:** Top-right corner
- **Auto-dismiss:** 5 seconds
- **Stack:** Up to 4 toasts
- **Animation:** Slide-in from right

### Browser Notifications
- **Trigger:** When app is in background
- **Click:** Opens app to notification
- **Sound:** Enabled (if permission granted)
- **Vibration:** On supported devices

## 🛠️ Configuration

### Manifest.json
Located at `public/manifest.json`
- Icons: `/favicon.ico` (update with proper PWA icons)
- Theme color: `#3b82f6`
- Display mode: `standalone`

### Service Worker
Located at `public/sw.js`
- Cache version: `lingua-ai-v2`
- Offline support: ✅
- Push notifications: ✅

### Environment Variables
No additional env vars needed for basic functionality.

## 🎨 Customization

### Change Install Prompt Position
Edit `components/PWAInstall.tsx`:
```tsx
className="fixed bottom-4 left-4 right-4 ..." // Change position
```

### Change Notification Badge Style
Edit `components/NotificationBell.tsx`:
```tsx
className="... bg-red-500 ..." // Change color
```

### Change Toast Duration
Edit `components/NotificationToast.tsx`:
```tsx
setTimeout(() => removeToast(id), 5000); // Change duration
```

## 📝 Notes

1. **Notification Permission:**
   - Must be granted by user
   - Requested automatically on first visit
   - Required for browser notifications

2. **Service Worker:**
   - Updates automatically
   - Can be manually updated in DevTools
   - Clear cache if issues occur

3. **PWA Install:**
   - Only shows if not already installed
   - Remembers dismissal for 7 days
   - iOS requires manual installation

4. **Testing Push Notifications:**
   - Use DevTools → Application → Service Workers
   - Click "Push" to send test notification
   - Or use the notification API endpoint

## 🐛 Troubleshooting

### Install Prompt Not Showing
- Check if app is already installed
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

### Notifications Not Appearing
- Check notification permission status
- Verify service worker is registered
- Check browser console for errors
- Ensure Supabase notifications table exists

### Service Worker Not Updating
- Unregister in DevTools → Application → Service Workers
- Clear cache and hard reload (Ctrl+Shift+R)
- Check for errors in console

## 📚 API Endpoints

### Create Notification
```
POST /api/notifications/create
Body: {
  user_id: string,
  event_type: string,
  metadata?: object
}
```

### Available Event Types
- `lesson_completed`
- `streak_achieved`
- `level_up`
- `quiz_passed`
- `achievement_unlocked`
- `xp_milestone`
- `daily_reminder`
- `weekly_report`
- `new_feature`
- `friend_activity`
- `practice_reminder`

## ✅ Checklist

- [x] PWA Install Prompt with localStorage
- [x] Notification Bell with YouTube-style badge
- [x] Notification Modal with read/delete
- [x] Toast notifications with animations
- [x] Service Worker with push notifications
- [x] Browser notifications
- [x] Real-time updates from Supabase
- [x] iOS support
- [x] Android support
- [x] Desktop support

## 🎉 Ready to Use!

Your app now has a complete YouTube-style notification system and PWA installation support. Test it locally, then deploy to see it in action!

