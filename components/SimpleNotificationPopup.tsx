'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';

interface SimpleNotificationPopupProps {
  show: boolean;
  onClose: () => void;
  isNotificationEnabled: boolean;
}

export default function SimpleNotificationPopup({ 
  show, 
  onClose, 
  isNotificationEnabled 
}: SimpleNotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

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
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {isNotificationEnabled ? (
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <BellOff className="w-5 h-5 text-red-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {isNotificationEnabled ? 'Notifications Enabled' : 'Notifications Disabled'}
              </h3>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mt-1">
              {isNotificationEnabled 
                ? 'You will receive learning reminders and updates.'
                : 'You will not receive any notifications. Enable them in settings if needed.'
              }
            </p>
            
            <div className="mt-3 flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isNotificationEnabled ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {isNotificationEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
