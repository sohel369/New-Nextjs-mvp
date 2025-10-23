'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

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
    
    if (count > 0) {
      document.title = `(${count}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
  };

  // Update favicon with badge
  const updateFavicon = (count: number) => {
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
  const showBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  // Load notifications from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // Check if it's a table doesn't exist error
          if (error.code === 'PGRST116' || error.message?.includes('relation "notifications" does not exist')) {
            console.warn('Notifications table does not exist yet. Please run the database migration.');
            setNotifications([]);
            return;
          }
          
          // Only log other errors, don't throw
          console.warn('Error fetching notifications:', error.message || error);
          setNotifications([]);
          return;
        }

        const formattedNotifications = (data || []).map(notification => ({
          id: notification.id,
          type: notification.type as Notification['type'],
          title: notification.title,
          message: notification.message,
          timestamp: new Date(notification.created_at),
          read: notification.read,
          priority: 'medium' as const,
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.warn('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          try {
            if (payload.eventType === 'INSERT') {
              const newNotification = payload.new;
              const formattedNotification = {
                id: newNotification.id,
                type: newNotification.type as Notification['type'],
                title: newNotification.title,
                message: newNotification.message,
                timestamp: new Date(newNotification.created_at),
                read: newNotification.read,
                priority: 'medium' as const,
              };
              
              setNotifications(prev => [formattedNotification, ...prev]);
              
              // Show browser notification for new notifications
              if (!newNotification.read) {
                showBrowserNotification(newNotification.title, {
                  body: newNotification.message,
                  icon: '/favicon.ico',
                });
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedNotification = payload.new;
              setNotifications(prev => 
                prev.map(n => 
                  n.id === updatedNotification.id 
                    ? { ...n, read: updatedNotification.read }
                    : n
                )
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedNotification = payload.old;
              setNotifications(prev => 
                prev.filter(n => n.id !== deletedNotification.id)
              );
            }
          } catch (error) {
            console.warn('Error processing real-time notification update:', error);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications');
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('Failed to subscribe to notifications - table may not exist yet');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
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

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.code === 'PGRST116' || error.message?.includes('relation "notifications" does not exist')) {
          console.warn('Notifications table does not exist yet. Please run the database migration.');
          // Still update local state for better UX
          setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
          );
          return;
        }
        
        console.warn('Error marking notification as read:', error.message || error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.warn('Error marking notification as read:', error);
      // Still update local state for better UX
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.code === 'PGRST116' || error.message?.includes('relation "notifications" does not exist')) {
          console.warn('Notifications table does not exist yet. Please run the database migration.');
          // Still update local state for better UX
          setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
          );
          return;
        }
        
        console.warn('Error marking all notifications as read:', error.message || error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.warn('Error marking all notifications as read:', error);
      // Still update local state for better UX
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  const removeNotification = async (id: string) => {
    if (!user) return;

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.code === 'PGRST116' || error.message?.includes('relation "notifications" does not exist')) {
          console.warn('Notifications table does not exist yet. Please run the database migration.');
          // Still update local state for better UX
          setNotifications(prev => prev.filter(n => n.id !== id));
          return;
        }
        
        console.warn('Error deleting notification:', error.message || error);
        return;
      }

      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.warn('Error deleting notification:', error);
      // Still update local state for better UX
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;

    try {
      // Delete all from Supabase
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.code === 'PGRST116' || error.message?.includes('relation "notifications" does not exist')) {
          console.warn('Notifications table does not exist yet. Please run the database migration.');
          // Still update local state for better UX
          setNotifications([]);
          return;
        }
        
        console.warn('Error clearing all notifications:', error.message || error);
        return;
      }

      // Update local state
      setNotifications([]);
    } catch (error) {
      console.warn('Error clearing all notifications:', error);
      // Still update local state for better UX
      setNotifications([]);
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
