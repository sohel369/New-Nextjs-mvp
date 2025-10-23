'use client';

import React from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useNotifications } from './NotificationProvider';

interface NotificationBadgeProps {
  className?: string;
  showIcon?: boolean;
  showCount?: boolean;
  maxCount?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className = '',
  showIcon = true,
  showCount = true,
  maxCount = 99,
}) => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) {
    return null;
  }

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {showIcon && (
        <div className="relative">
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5 text-yellow-500" />
          ) : (
            <Bell className="w-5 h-5 text-gray-400" />
          )}
          
          {showCount && unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {displayCount}
            </span>
          )}
        </div>
      )}
      
      {!showIcon && showCount && (
        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
          {displayCount}
        </span>
      )}
    </div>
  );
};
