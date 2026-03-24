'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  deleteDoc,
  orderBy,
  writeBatch,
  addDoc,
  getDocs
} from 'firebase/firestore';

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'progress' | 'system' | 'social' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  icon?: string;
  color?: string;
}

interface EnhancedNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  requestNotificationPermission: () => Promise<boolean>;
  showBrowserNotification: (title: string, options?: NotificationOptions) => void;
  updateBrowserTitle: (count: number) => void;
  updateFavicon: (count: number) => void;
}

const EnhancedNotificationContext = createContext<EnhancedNotificationContextType | undefined>(undefined);

export function EnhancedNotificationProvider({ 
  children, 
  appName = 'Language Learning App' 
}: { 
  children: ReactNode;
  appName?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Update document title with unread count
  const updateBrowserTitle = (count: number) => {
    const originalTitle = appName;
    
    if (typeof document !== 'undefined') {
      if (count > 0) {
        document.title = `(${count}) ${originalTitle}`;
      } else {
        document.title = originalTitle;
      }
    }
  };

  // Update favicon with badge
  const updateFavicon = (count: number) => {
    if (typeof document === 'undefined') return;
    try {
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }

      if (count > 0) {
        // Create favicon with badge
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        canvas.width = 32;
        canvas.height = 32;

        // Create badge design
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
        
        const countText = count > 99 ? '99+' : count.toString();
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

  // Request notification permission for browser notifications
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
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
  const showBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (typeof window !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  // Load notifications from Firebase Firestore
  useEffect(() => {
    if (!user || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') {
      setNotifications([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', user.id),
        orderBy('created_at', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const formattedNotifications = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: (data.type || 'info') as Notification['type'],
            title: data.title || '',
            message: data.message || '',
            timestamp: data.created_at ? new Date(data.created_at) : new Date(),
            read: !!data.read,
            priority: (data.priority || 'medium') as Notification['priority'],
            actionUrl: data.actionUrl,
            icon: data.icon,
            color: data.color,
          };
        });

        setNotifications(formattedNotifications);
      }, (error) => {
        console.warn('Error fetching notifications from Firebase:', error);
        setNotifications([]);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error setting up notification subscription:', error);
      setNotifications([]);
    }
  }, [user]);


  // Update browser title and favicon when unread count changes
  useEffect(() => {
    updateBrowserTitle(unreadCount);
    updateFavicon(unreadCount);
  }, [unreadCount]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!user || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') {
      // Offline-only fallback if not logged in or Firebase not available
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
      return;
    }

    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        user_id: user.id,
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding notification to Firebase:', error);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') return;

    try {
      const docRef = doc(db, 'notifications', id);
      await updateDoc(docRef, { 
        read: true, 
        updated_at: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0 || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') return;

    try {
      const batch = writeBatch(db);
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', user.id),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      
      snapshot.forEach(d => {
        batch.update(d.ref, { 
          read: true, 
          updated_at: new Date().toISOString() 
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    if (!user || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') return;

    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (!user || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') return;

    try {
      const batch = writeBatch(db);
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', user.id)
      );
      const snapshot = await getDocs(q);
      
      snapshot.forEach(d => {
        batch.delete(d.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    addNotification(notification);
    
    // Show browser notification
    showBrowserNotification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
    });
  };

  const value: EnhancedNotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    showNotification,
    requestNotificationPermission,
    showBrowserNotification,
    updateBrowserTitle,
    updateFavicon,
  };

  return (
    <EnhancedNotificationContext.Provider value={value}>
      {children}
    </EnhancedNotificationContext.Provider>
  );
}

export const useEnhancedNotifications = () => {
  const context = useContext(EnhancedNotificationContext);
  if (context === undefined) {
    throw new Error('useEnhancedNotifications must be used within an EnhancedNotificationProvider');
  }
  return context;
};
