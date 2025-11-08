'use client';

import { useEffect, useRef } from 'react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';

interface AutoNotification {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'achievement' | 'progress';
  priority?: 'low' | 'medium' | 'high';
}

const AUTO_NOTIFICATIONS: AutoNotification[] = [
  {
    title: '🎯 New Quiz Unlocked!',
    message: 'A new quiz is available! Test your knowledge and earn XP.',
    type: 'achievement',
    priority: 'high',
  },
  {
    title: '✅ Daily Goal Completed!',
    message: 'Congratulations! You\'ve completed your daily learning goal.',
    type: 'success',
    priority: 'high',
  },
  {
    title: '⭐ You Earned 10 XP!',
    message: 'Great job! Keep learning to unlock more achievements.',
    type: 'progress',
    priority: 'medium',
  },
  {
    title: '📚 New Lesson Available!',
    message: 'A new lesson has been added to your learning path.',
    type: 'info',
    priority: 'medium',
  },
  {
    title: '🤖 AI Coach Recommends Practice!',
    message: 'Your AI Coach suggests practicing speaking exercises to improve fluency.',
    type: 'info',
    priority: 'low',
  },
  {
    title: '🔥 Streak Bonus!',
    message: 'You\'re on a roll! Complete another lesson to maintain your streak.',
    type: 'success',
    priority: 'high',
  },
  {
    title: '📈 Level Progress!',
    message: 'You\'re 75% of the way to the next level. Keep going!',
    type: 'progress',
    priority: 'medium',
  },
  {
    title: '💬 Community Challenge!',
    message: 'Join the weekly vocabulary challenge and compete with other learners.',
    type: 'info',
    priority: 'low',
  },
  {
    title: '🎁 Achievement Unlocked!',
    message: 'You\'ve unlocked the "Vocabulary Master" achievement!',
    type: 'achievement',
    priority: 'high',
  },
  {
    title: '⏰ Practice Reminder',
    message: 'Time for your daily practice! Consistency is key to success.',
    type: 'warning',
    priority: 'medium',
  },
];

/**
 * Hook to automatically generate notifications at random intervals (1-2 minutes)
 * @param enabled - Whether auto-notifications are enabled
 */
export function useAutoNotifications(enabled: boolean = true) {
  const { addNotification } = useEnhancedNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const generateRandomNotification = () => {
      // Pick a random notification from the pool
      const randomIndex = Math.floor(Math.random() * AUTO_NOTIFICATIONS.length);
      const notification = AUTO_NOTIFICATIONS[randomIndex];
      
      // Sometimes generate 1-3 notifications at once
      const count = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 1;
      
      for (let i = 0; i < count; i++) {
        // Add small delay between multiple notifications for better UX
        setTimeout(() => {
          const notificationToUse = i === 0 
            ? notification 
            : AUTO_NOTIFICATIONS[Math.floor(Math.random() * AUTO_NOTIFICATIONS.length)];
          
          addNotification({
            type: notificationToUse.type as any,
            title: notificationToUse.title,
            message: notificationToUse.message,
            priority: notificationToUse.priority || 'medium',
          });
        }, i * 500); // 500ms delay between multiple notifications
      }
    };

    // Generate first notification after a random delay (60-120 seconds)
    const firstDelay = Math.random() * 60000 + 60000; // 60-120 seconds
    timeoutRef.current = setTimeout(() => {
      generateRandomNotification();
      
      // Set up interval for subsequent notifications (60-120 seconds)
      intervalRef.current = setInterval(() => {
        generateRandomNotification();
      }, Math.random() * 60000 + 60000); // Random interval between 60-120 seconds
    }, firstDelay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [enabled, addNotification]);

  return {
    isActive: enabled,
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
  };
}


