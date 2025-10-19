'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  sound?: string;
}

export function useGlobalNotifications() {
  const { settings } = useSettings();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const showNotification = async (options: NotificationOptions) => {
    // Check if notifications are enabled in settings
    if (!settings?.notifications_enabled) {
      console.log('Notifications disabled in settings');
      return false;
    }

    // Check if push notifications are enabled
    if (!settings?.push_notifications) {
      console.log('Push notifications disabled in settings');
      return false;
    }

    // Check browser support
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    // Request permission if needed
    if (Notification.permission === 'default') {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);
      if (newPermission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }
    }

    if (Notification.permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    // Create notification with sound settings
    const notificationOptions: NotificationOptions = {
      ...options,
      silent: !settings?.sound_enabled,
    };

    // Add sound if enabled
    if (settings?.sound_enabled && options.sound) {
      notificationOptions.sound = options.sound;
    }

    try {
      const notification = new Notification(options.title, notificationOptions);
      
      // Auto-close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  };

  const playNotificationSound = (soundUrl?: string) => {
    if (!settings?.sound_enabled) {
      return;
    }

    try {
      const audio = new Audio(soundUrl || '/audio/notification.mp3');
      audio.volume = (settings?.sound_volume || 70) / 100;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
      });
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  };

  const showNotificationWithSound = async (options: NotificationOptions) => {
    const success = await showNotification(options);
    
    if (success && settings?.sound_enabled) {
      playNotificationSound(options.sound);
    }
    
    return success;
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);
    return newPermission === 'granted';
  };

  return {
    showNotification,
    showNotificationWithSound,
    playNotificationSound,
    requestPermission,
    permission,
    isEnabled: settings?.notifications_enabled && settings?.push_notifications,
    soundEnabled: settings?.sound_enabled,
    soundVolume: settings?.sound_volume || 70,
  };
}
