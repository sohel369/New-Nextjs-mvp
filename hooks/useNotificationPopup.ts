'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export function useNotificationPopup() {
  const { settings } = useAccessibility();
  const [showPopup, setShowPopup] = useState(false);
  const [previousNotificationState, setPreviousNotificationState] = useState<boolean | null>(null);

  // Watch for changes in notification settings
  useEffect(() => {
    // Initialize previous state on first load
    if (previousNotificationState === null) {
      setPreviousNotificationState(settings.notificationsEnabled);
      return;
    }

    // If notification state changed, show popup
    if (previousNotificationState !== settings.notificationsEnabled) {
      setShowPopup(true);
      setPreviousNotificationState(settings.notificationsEnabled);
    }
  }, [settings.notificationsEnabled, previousNotificationState]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const triggerPopup = () => {
    setShowPopup(true);
  };

  return {
    showPopup,
    closePopup,
    triggerPopup,
    isNotificationEnabled: settings.notificationsEnabled
  };
}
