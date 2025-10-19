'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';

interface DashboardNotificationPopupProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function DashboardNotificationPopup({ 
  show, 
  onClose, 
  title, 
  message, 
  type 
}: DashboardNotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'info':
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/50';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-blue-500/20 border-blue-500/50';
    }
  };

  return (
    <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 z-[9999] transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`bg-white/95 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-2xl border p-3 sm:p-4 w-80 sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-sm ${getBgColor()}`}>
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-500/20' :
              type === 'info' ? 'bg-blue-500/20' :
              type === 'warning' ? 'bg-yellow-500/20' :
              type === 'error' ? 'bg-red-500/20' :
              'bg-blue-500/20'
            }`}>
              {getIcon()}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                {title}
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
            
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
              {message}
            </p>
            
            <div className="mt-2 sm:mt-3 flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                type === 'success' ? 'bg-green-500' :
                type === 'info' ? 'bg-blue-500' :
                type === 'warning' ? 'bg-yellow-500' :
                type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}></div>
              <span className="text-xs text-gray-500 capitalize">
                {type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
