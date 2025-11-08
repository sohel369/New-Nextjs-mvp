'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, XCircle, Bell } from 'lucide-react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';

interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function NotificationToast() {
  const { notifications } = useEnhancedNotifications();
  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Get the latest unread notification
    const latestUnread = notifications.find(n => !n.read && !shownIds.has(n.id));
    
    if (latestUnread) {
      const toast: NotificationToast = {
        id: latestUnread.id,
        title: latestUnread.title,
        message: latestUnread.message,
        type: (latestUnread.type || 'info') as 'success' | 'info' | 'warning' | 'error',
      };

      setShownIds(prev => new Set(prev).add(latestUnread.id));
      setToasts(prev => [toast, ...prev.slice(0, 4)]); // Max 4 toasts

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeToast(latestUnread.id);
      }, 5000);
    }
  }, [notifications, shownIds]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[10001] space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.8 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              delay: index * 0.1
            }}
            className={`pointer-events-auto w-80 sm:w-96 max-w-[calc(100vw-2rem)] ${getBgColor(toast.type)} rounded-lg shadow-2xl border-2 p-4 backdrop-blur-xl`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  {toast.title}
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className={`mt-3 h-1 rounded-full ${
                toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'info' ? 'bg-blue-500' :
                toast.type === 'warning' ? 'bg-yellow-500' :
                toast.type === 'error' ? 'bg-red-500' :
                'bg-gray-500'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

