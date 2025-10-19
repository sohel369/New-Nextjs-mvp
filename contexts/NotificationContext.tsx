'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'progress' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  icon?: string;
  color?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    }
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Simulate live notifications
  useEffect(() => {
    if (!user) return;

    const intervals = [
      // Achievement notifications
      setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 30 seconds
          addNotification({
            type: 'achievement',
            title: '🎉 Achievement Unlocked!',
            message: 'You completed 5 lessons in a row!',
            priority: 'high',
            color: 'text-yellow-400',
            icon: '🏆'
          });
        }
      }, 30000),

      // Progress notifications
      setInterval(() => {
        if (Math.random() < 0.15) { // 15% chance every 45 seconds
          addNotification({
            type: 'progress',
            title: '📈 Progress Update',
            message: 'You\'re on a 3-day streak! Keep it up!',
            priority: 'medium',
            color: 'text-blue-400',
            icon: '🔥'
          });
        }
      }, 45000),

      // Social notifications
      setInterval(() => {
        if (Math.random() < 0.08) { // 8% chance every 60 seconds
          addNotification({
            type: 'social',
            title: '👥 Social Update',
            message: 'Ahmed just completed a lesson!',
            priority: 'low',
            color: 'text-green-400',
            icon: '👤'
          });
        }
      }, 60000),

      // System notifications
      setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance every 90 seconds
          addNotification({
            type: 'system',
            title: '🔔 System Update',
            message: 'New features available in your language learning app!',
            priority: 'medium',
            color: 'text-purple-400',
            icon: '⚡'
          });
        }
      }, 90000)
    ];

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [user]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep only last 50 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const showNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    addNotification(notificationData);
    
    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(notificationData.title, {
        body: notificationData.message,
        icon: '/favicon.ico',
        tag: notificationData.title
      });
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        removeNotification, 
        clearAllNotifications,
        showNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
