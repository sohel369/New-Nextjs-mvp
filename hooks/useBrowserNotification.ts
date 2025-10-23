import { useEffect } from 'react';

interface UseBrowserNotificationProps {
  unreadCount: number;
  appName?: string;
  showFaviconBadge?: boolean;
}

export const useBrowserNotification = ({
  unreadCount,
  appName = 'Language Learning App',
  showFaviconBadge = true,
}: UseBrowserNotificationProps) => {
  
  // Update document title with unread count
  useEffect(() => {
    const originalTitle = appName;
    
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }

    // Cleanup function to restore original title
    return () => {
      document.title = originalTitle;
    };
  }, [unreadCount, appName]);

  // Update favicon with badge
  useEffect(() => {
    if (!showFaviconBadge) return;

    const updateFavicon = async () => {
      try {
        // Get the current favicon
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        
        if (!favicon) {
          // Create favicon if it doesn't exist
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }

        if (unreadCount > 0) {
          // Create favicon with badge
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;

          // Set canvas size (32x32 for favicon)
          canvas.width = 32;
          canvas.height = 32;

          // Create a simple badge design
          ctx.fillStyle = '#ef4444'; // Red background
          ctx.fillRect(0, 0, 32, 32);

          // Add white border
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(1, 1, 30, 30);

          // Add notification count text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const countText = unreadCount > 99 ? '99+' : unreadCount.toString();
          ctx.fillText(countText, 16, 16);

          // Convert canvas to data URL and update favicon
          const dataURL = canvas.toDataURL('image/png');
          favicon.href = dataURL;
        } else {
          // Reset to original favicon
          favicon.href = '/favicon.ico';
        }
      } catch (error) {
        console.error('Error updating favicon:', error);
      }
    };

    updateFavicon();
  }, [unreadCount, showFaviconBadge]);

  // Request notification permission for browser notifications
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  // Show browser notification
  const showNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  return {
    requestNotificationPermission,
    showNotification,
  };
};
