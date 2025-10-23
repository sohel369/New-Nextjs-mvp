'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useNotificationCount } from '../hooks/useNotificationCount';
import { useBrowserNotification } from '../hooks/useBrowserNotification';

interface NotificationContextType {
  unreadCount: number;
  notifications: any[];
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  requestNotificationPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  appName?: string;
  showFaviconBadge?: boolean;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  appName = 'Language Learning App',
  showFaviconBadge = true,
}) => {
  const {
    unreadCount,
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotificationCount();

  const {
    requestNotificationPermission,
    showNotification,
  } = useBrowserNotification({
    unreadCount,
    appName,
    showFaviconBadge,
  });

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const value: NotificationContextType = {
    unreadCount,
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    requestNotificationPermission,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
