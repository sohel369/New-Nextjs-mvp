# Notification System Setup Guide

This guide will help you set up the notification system in your Supabase database.

## Quick Setup

### 1. Run Database Migration

Execute the following SQL commands in your Supabase SQL Editor:

```sql
-- Create notifications table
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

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);
```

### 2. Enable Real-time (Optional)

To enable real-time notifications, go to your Supabase dashboard:

1. Navigate to **Database** → **Replication**
2. Find the `notifications` table
3. Click **Enable** for real-time updates

### 3. Test the System

Add this to any page to test notifications:

```tsx
import { NotificationDemo } from '../components/NotificationDemo';

export default function TestPage() {
  return (
    <div>
      <h1>Test Notifications</h1>
      <NotificationDemo />
    </div>
  );
}
```

## Troubleshooting

### Error: "relation 'notifications' does not exist"

This means the database migration hasn't been run yet. Follow step 1 above.

### Error: "permission denied for table notifications"

This means RLS policies aren't set up correctly. Make sure you've run the RLS policy commands from step 1.

### Notifications not showing in real-time

1. Check if real-time is enabled in Supabase dashboard
2. Verify the user is authenticated
3. Check browser console for errors

### Browser notifications not working

1. Check if notification permission is granted
2. Ensure you're using HTTPS (required for notifications)
3. Check browser console for permission errors

## Features

✅ **Browser Tab Title**: Shows unread count in title  
✅ **Favicon Badge**: Updates favicon with notification count  
✅ **Real-time Updates**: Instant updates when notifications change  
✅ **Browser Notifications**: Desktop notifications with permission  
✅ **Mobile Support**: Works on mobile browsers  
✅ **Supabase Integration**: Persistent notifications with real-time sync  

## Usage Examples

### Create a notification:

```tsx
import { NotificationService } from '../utils/notificationService';

// Create single notification
await NotificationService.createNotification({
  user_id: user.id,
  title: 'New Achievement!',
  message: 'You completed your first lesson!',
  type: 'success',
});
```

### Create bulk notifications:

```tsx
await NotificationService.createBulkNotifications(
  [userId1, userId2, userId3],
  'System Maintenance',
  'The system will be down for maintenance at 2 AM.',
  'warning'
);
```

### Create global notification:

```tsx
await NotificationService.createGlobalNotification(
  'New Feature Available!',
  'Check out our new AI-powered learning features.',
  'info'
);
```

## Integration

The notification system is already integrated into your app layout. The `NotificationBell` component will automatically appear in your header and show unread counts.

To add it to a custom header:

```tsx
import { NotificationBell } from '../components/NotificationBell';

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <NotificationBell />
    </header>
  );
}
```

That's it! Your notification system is now ready to use.
