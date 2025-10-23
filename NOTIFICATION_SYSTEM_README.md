# Dynamic Notification System

This notification system provides real-time notification counts in the browser tab title and favicon, with optional browser notifications.

## Features

✅ **Browser Tab Title**: Shows unread count in title (e.g., "(3) MyApp")  
✅ **Favicon Badge**: Updates favicon with notification count  
✅ **Real-time Updates**: Instant updates when notifications are read/created  
✅ **Browser Notifications**: Optional desktop notifications  
✅ **Supabase Integration**: Persistent notifications with real-time sync  
✅ **Mobile Support**: Works on both desktop and mobile browsers  
✅ **Modular Design**: Easy to integrate into existing components  

## Quick Start

### 1. Update your layout.tsx

Replace the existing NotificationProvider with the enhanced version:

```tsx
// app/layout.tsx
import { EnhancedNotificationProvider } from '../contexts/EnhancedNotificationContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <EnhancedNotificationProvider appName="Your App Name">
            {children}
          </EnhancedNotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Add Notification Bell to Header

```tsx
// components/Header.tsx
import { NotificationBell } from './NotificationBell';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <NotificationBell />
    </header>
  );
}
```

### 3. Create Notifications

```tsx
// Any component
import { NotificationService } from '../utils/notificationService';
import { useAuth } from '../contexts/AuthContext';

export default function MyComponent() {
  const { user } = useAuth();

  const createNotification = async () => {
    if (!user) return;
    
    await NotificationService.createNotification({
      user_id: user.id,
      title: 'New Message',
      message: 'You have received a new message.',
      type: 'info',
    });
  };

  return (
    <button onClick={createNotification}>
      Create Notification
    </button>
  );
}
```

## Database Setup

Run the SQL commands in `database/schema.sql` to create the notifications table:

```sql
-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);
```

## Components

### NotificationBell
A bell icon with dropdown showing notifications.

```tsx
import { NotificationBell } from './NotificationBell';

<NotificationBell className="ml-4" />
```

### NotificationDemo
Test component for creating sample notifications.

```tsx
import { NotificationDemo } from './NotificationDemo';

<NotificationDemo />
```

## Hooks

### useEnhancedNotifications
Main hook for notification functionality.

```tsx
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';

const {
  unreadCount,
  notifications,
  markAsRead,
  markAllAsRead,
  showBrowserNotification,
} = useEnhancedNotifications();
```

## Services

### NotificationService
Utility class for creating and managing notifications.

```tsx
import { NotificationService } from '../utils/notificationService';

// Create single notification
await NotificationService.createNotification({
  user_id: userId,
  title: 'Title',
  message: 'Message',
  type: 'info',
});

// Create bulk notifications
await NotificationService.createBulkNotifications(
  [userId1, userId2],
  'Title',
  'Message',
  'success'
);

// Create global notification
await NotificationService.createGlobalNotification(
  'Title',
  'Message',
  'warning'
);
```

## Browser Support

### Title Updates
- ✅ All modern browsers
- ✅ Mobile browsers
- ✅ Updates immediately

### Favicon Updates
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ Canvas-based badge generation

### Browser Notifications
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Requires user permission
- ✅ Works on mobile (limited)

## Customization

### App Name
```tsx
<EnhancedNotificationProvider appName="My Custom App Name">
  {children}
</EnhancedNotificationProvider>
```

### Disable Favicon Badge
```tsx
<EnhancedNotificationProvider showFaviconBadge={false}>
  {children}
</EnhancedNotificationProvider>
```

### Custom Notification Types
```tsx
// Add to database schema
ALTER TABLE notifications ADD CONSTRAINT check_type 
CHECK (type IN ('info', 'success', 'warning', 'error', 'custom'));
```

## Testing

1. **Add NotificationDemo component** to any page
2. **Click "Create Notification"** buttons
3. **Check browser tab title** updates
4. **Check favicon** shows badge
5. **Click bell icon** to view notifications
6. **Mark as read** to see count decrease

## Troubleshooting

### Notifications not showing
- Check Supabase connection
- Verify RLS policies
- Check browser console for errors

### Favicon not updating
- Check browser cache
- Verify canvas support
- Check console for errors

### Browser notifications not working
- Check notification permission
- Verify HTTPS (required for notifications)
- Check browser support

## Performance

- **Real-time updates**: Uses Supabase real-time subscriptions
- **Efficient queries**: Indexed database queries
- **Minimal re-renders**: Optimized React state updates
- **Canvas optimization**: Efficient favicon generation

## Security

- **RLS enabled**: Users can only see their own notifications
- **Input validation**: Sanitized notification content
- **Permission-based**: Browser notifications require user consent

## Mobile Considerations

- **Touch-friendly**: Large tap targets
- **Responsive design**: Works on all screen sizes
- **Battery efficient**: Minimal background processing
- **Offline support**: Notifications persist when offline

This notification system provides a complete solution for dynamic notification counts in browser tabs with real-time updates and excellent user experience across all devices.
