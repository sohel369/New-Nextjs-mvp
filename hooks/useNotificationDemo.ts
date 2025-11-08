'use client';

import { useEffect, useRef } from 'react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';

interface DemoNotification {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'achievement' | 'progress';
  priority?: 'low' | 'medium' | 'high';
}

const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    title: '🎉 Achievement Unlocked!',
    message: 'You completed 10 lessons in a row! Keep up the great work!',
    type: 'achievement',
    priority: 'high',
  },
  {
    title: '📈 Progress Update',
    message: 'You\'ve learned 50 new words this week. Your vocabulary is growing!',
    type: 'progress',
    priority: 'medium',
  },
  {
    title: '🔥 Streak Milestone',
    message: 'Amazing! You\'ve maintained a 7-day learning streak.',
    type: 'success',
    priority: 'high',
  },
  {
    title: '⏰ Daily Reminder',
    message: 'Don\'t forget to practice today! Your daily practice helps maintain your streak.',
    type: 'warning',
    priority: 'medium',
  },
  {
    title: '👥 Friend Activity',
    message: 'Sarah just completed a lesson and earned 50 XP!',
    type: 'info',
    priority: 'low',
  },
  {
    title: '⭐ Level Up!',
    message: 'Congratulations! You\'ve reached level 5. Your progress is impressive!',
    type: 'achievement',
    priority: 'high',
  },
  {
    title: '✨ New Feature',
    message: 'Check out the new AI-powered pronunciation trainer in your lessons!',
    type: 'info',
    priority: 'medium',
  },
  {
    title: '📊 Weekly Report',
    message: 'You\'ve completed 12 lessons this week. Outstanding performance!',
    type: 'progress',
    priority: 'medium',
  },
];

/**
 * Hook to simulate notifications at regular intervals (demo mode)
 * @param enabled - Whether demo mode is enabled
 * @param intervalSeconds - Interval between notifications in seconds (default: 60)
 */
export function useNotificationDemo(enabled: boolean = false, intervalSeconds: number = 60) {
  const { addNotification } = useEnhancedNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Send first notification after a short delay
    const firstTimer = setTimeout(() => {
      const firstNotification = DEMO_NOTIFICATIONS[0];
      addNotification({
        type: firstNotification.type as any,
        title: firstNotification.title,
        message: firstNotification.message,
        priority: firstNotification.priority || 'medium',
      });
      notificationIndexRef.current = 1;
    }, 2000);

    // Set up interval for subsequent notifications
    intervalRef.current = setInterval(() => {
      const notification = DEMO_NOTIFICATIONS[
        notificationIndexRef.current % DEMO_NOTIFICATIONS.length
      ];
      
      addNotification({
        type: notification.type as any,
        title: notification.title,
        message: notification.message,
        priority: notification.priority || 'medium',
      });

      notificationIndexRef.current++;
    }, intervalSeconds * 1000);

    return () => {
      clearTimeout(firstTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalSeconds, addNotification]);

  return {
    isActive: enabled,
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
  };
}

