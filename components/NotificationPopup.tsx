'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface NotificationPopupProps {
  show: boolean;
  onClose: () => void;
  isNotificationEnabled?: boolean;
}

export default function NotificationPopup({ show, onClose, isNotificationEnabled }: NotificationPopupProps) {
  const { settings } = useAccessibility();
  const [isVisible, setIsVisible] = useState(false);
  
  // Use the prop if provided, otherwise fall back to context
  const notificationEnabled = isNotificationEnabled !== undefined ? isNotificationEnabled : settings.notificationsEnabled;

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className="bg-white/95 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-2xl border border-white/20 p-3 sm:p-4 w-80 sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-sm">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="flex-shrink-0">
            {notificationEnabled ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <BellOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                {notificationEnabled ? 'Notifications Enabled' : 'Notifications Disabled'}
              </h3>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {notificationEnabled 
                ? 'You will receive learning reminders and updates.'
                : 'You will not receive any notifications. Enable them in settings if needed.'
              }
            </p>
            
            <div className="mt-2 sm:mt-3 flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                notificationEnabled ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {notificationEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
