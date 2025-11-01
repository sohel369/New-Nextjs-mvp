'use client';

import React, { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';
import { NotificationModal } from './NotificationModal';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
}) => {
  const { unreadCount } = useEnhancedNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBellClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleBellClick}
        className={`relative p-2 text-white hover:text-purple-300 transition-colors ${className}`}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};