'use client';

import React, { useState } from 'react';
import { useEnhancedNotifications } from '../contexts/EnhancedNotificationContext';
import { NotificationService } from '../utils/notificationService';
import { useAuth } from '../contexts/AuthContext';

export const NotificationDemo: React.FC = () => {
  const { user } = useAuth();
  const { showNotification, requestNotificationPermission } = useEnhancedNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const createTestNotification = async (type: 'info' | 'success' | 'warning' | 'error') => {
    if (!user) return;

    setIsLoading(true);
    try {
      await NotificationService.createNotification({
        user_id: user.id,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
        message: `This is a test ${type} notification to demonstrate the notification system.`,
        type,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAchievementNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await NotificationService.createNotification({
        user_id: user.id,
        title: '🏆 Achievement Unlocked!',
        message: 'Congratulations! You have completed your first lesson. Keep up the great work!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error creating achievement notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProgressNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await NotificationService.createNotification({
        user_id: user.id,
        title: '📈 Progress Update',
        message: 'You have completed 5 lessons this week! You are making excellent progress.',
        type: 'info',
      });
    } catch (error) {
      console.error('Error creating progress notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createReminderNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await NotificationService.createNotification({
        user_id: user.id,
        title: '⏰ Daily Reminder',
        message: "Don't forget to practice your language skills today! Even 10 minutes can make a difference.",
        type: 'warning',
      });
    } catch (error) {
      console.error('Error creating reminder notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      alert('Notification permission granted! You will now receive browser notifications.');
    } else {
      alert('Notification permission denied. You can still see notifications in the app.');
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <p className="text-yellow-800">Please log in to test notifications.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Notification System Demo
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => createTestNotification('info')}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            Create Info Notification
          </button>
          
          <button
            onClick={() => createTestNotification('success')}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            Create Success Notification
          </button>
          
          <button
            onClick={() => createTestNotification('warning')}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
          >
            Create Warning Notification
          </button>
          
          <button
            onClick={() => createTestNotification('error')}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            Create Error Notification
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={createAchievementNotification}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            Create Achievement Notification
          </button>
          
          <button
            onClick={createProgressNotification}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            Create Progress Notification
          </button>
          
          <button
            onClick={createReminderNotification}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            Create Reminder Notification
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleRequestPermission}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Request Browser Notification Permission
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>• Notifications will appear in the browser tab title and favicon</p>
          <p>• Click the bell icon in the header to view notifications</p>
          <p>• Browser notifications will show for new notifications (if permission granted)</p>
        </div>
      </div>
    </div>
  );
};
