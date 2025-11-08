'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Info, AlertTriangle, XCircle, Bell } from 'lucide-react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';
import { usePathname } from 'next/navigation';

interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  actionUrl?: string;
}

export default function YouTubeStyleNotification() {
  const { notifications, unreadCount } = useEnhancedNotifications();
  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [visibleToasts, setVisibleToasts] = useState<Set<string>>(new Set());
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Show new notifications as toasts (YouTube-style)
  useEffect(() => {
    if (notifications.length === 0) return;

    // Get unread notifications sorted by timestamp (newest first)
    const unreadNotifications = notifications
      .filter(n => !n.read)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Show the most recent unread notification if we haven't shown it yet
    const latestUnread = unreadNotifications[0];
    
    if (latestUnread && !shownNotificationIds.has(latestUnread.id)) {
      const toast: NotificationToast = {
        id: latestUnread.id,
        title: latestUnread.title,
        message: latestUnread.message,
        type: latestUnread.type as 'success' | 'info' | 'warning' | 'error',
        timestamp: latestUnread.timestamp,
        actionUrl: latestUnread.actionUrl,
      };

      // Mark as shown
      setShownNotificationIds(prev => new Set(prev).add(latestUnread.id));
      
      // Add to toasts
      setToasts(prev => {
        const newToasts = [toast, ...prev.filter(t => t.id !== latestUnread.id)];
        return newToasts.slice(0, 5); // Max 5 toasts
      });
      
      setVisibleToasts(prev => new Set(prev).add(latestUnread.id));

      // Auto-remove after 5 seconds
      const timer = setTimeout(() => {
        removeToast(latestUnread.id);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, shownNotificationIds]);

  const removeToast = (id: string) => {
    setVisibleToasts(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    
    // Remove from toasts after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'info':
        return 'border-l-blue-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-3 pointer-events-none">
      {toasts.map((toast, index) => {
        const isVisible = visibleToasts.has(toast.id);
        
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-out ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0'
            }`}
            style={{
              animation: isVisible ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-out',
            }}
          >
            <div
              className={`
                bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4 ${getBorderColor(toast.type)}
                backdrop-blur-xl border border-gray-200 dark:border-gray-700
                w-80 sm:w-96 max-w-[calc(100vw-2rem)]
                overflow-hidden
                hover:shadow-3xl transition-shadow duration-200
              `}
            >
              {/* Content */}
              <div className="p-4 flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(toast.type)}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {toast.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {toast.message}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                        {formatTime(toast.timestamp)}
                      </span>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Close notification"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </button>
                  </div>

                  {/* Action Button (if URL provided) */}
                  {toast.actionUrl && (
                    <button
                      onClick={() => {
                        window.location.href = toast.actionUrl!;
                        removeToast(toast.id);
                      }}
                      className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View →
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full ${
                    toast.type === 'success' ? 'bg-green-500' :
                    toast.type === 'info' ? 'bg-blue-500' :
                    toast.type === 'warning' ? 'bg-yellow-500' :
                    toast.type === 'error' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}
                  style={{
                    animation: 'shrink 5s linear forwards',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

