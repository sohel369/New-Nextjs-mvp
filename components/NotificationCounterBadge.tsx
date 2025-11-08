'use client';

import React, { useEffect, useState } from 'react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCounterBadgeProps {
  className?: string;
  showAlways?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationCounterBadge: React.FC<NotificationCounterBadgeProps> = ({
  className = '',
  showAlways = false,
  size = 'md',
  position = 'top-right',
}) => {
  const { unreadCount } = useEnhancedNotifications();
  const [shouldPulse, setShouldPulse] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  // Pulse animation when count increases
  useEffect(() => {
    if (unreadCount > previousCount && previousCount > 0) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 2000);
      return () => clearTimeout(timer);
    }
    setPreviousCount(unreadCount);
  }, [unreadCount, previousCount]);

  const formatCount = (count: number): string => {
    if (count <= 0) return '0';
    if (count > 999) return '999+';
    if (count > 99) return '99+';
    return count.toString();
  };

  const sizeClasses = {
    sm: 'min-w-[16px] h-4 text-[10px] px-1',
    md: 'min-w-[20px] h-5 text-[11px] px-1.5',
    lg: 'min-w-[24px] h-6 text-xs px-2',
  };

  const positionClasses = {
    'top-right': '-top-0.5 -right-0.5',
    'top-left': '-top-0.5 -left-0.5',
    'bottom-right': '-bottom-0.5 -right-0.5',
    'bottom-left': '-bottom-0.5 -left-0.5',
  };

  const displayCount = formatCount(unreadCount);
  const shouldShow = showAlways || unreadCount > 0;

  if (!shouldShow) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={unreadCount}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -2, 0]
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: 'spring',
          damping: 15,
          stiffness: 300,
        }}
        className={`absolute ${positionClasses[position]} pointer-events-none ${className}`}
      >
        <motion.div
          animate={shouldPulse ? {
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.7)',
              '0 0 0 6px rgba(239, 68, 68, 0)',
              '0 0 0 0 rgba(239, 68, 68, 0)',
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: shouldPulse ? Infinity : 0 }}
          className="relative"
        >
          <span
            className={`
              inline-flex items-center justify-center
              bg-red-500 text-white
              rounded-full
              font-bold
              shadow-lg
              border-2 border-white dark:border-gray-900
              ${sizeClasses[size]}
              leading-none
              ${displayCount.length > 2 ? 'px-1' : ''}
            `}
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {displayCount}
          </span>
          
          {/* Pulse ring effect */}
          {shouldPulse && (
            <motion.span
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ 
                scale: [1, 1.8, 1.8],
                opacity: [0.7, 0, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-full -z-10"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

