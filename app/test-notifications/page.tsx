'use client';

import { useState } from 'react';
import { useEnhancedNotifications } from '../../contexts/EnhancedNotificationContext';
import { Bell, Trophy, Target, Users, Zap, Clock, Trash2, Check } from 'lucide-react';

export default function TestNotificationsPage() {
  const { addNotification, clearAllNotifications, notifications, unreadCount } = useEnhancedNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const testNotifications = [
    {
      type: 'achievement' as const,
      title: '🏆 Achievement Unlocked!',
      message: 'You completed your first lesson! Welcome to the learning journey!',
      priority: 'high' as const,
      color: 'text-yellow-400',
      icon: '🏆'
    },
    {
      type: 'progress' as const,
      title: '📈 Progress Update',
      message: 'Great job! You\'ve learned 25 new words this week. Keep it up!',
      priority: 'medium' as const,
      color: 'text-blue-400',
      icon: '📈'
    },
    {
      type: 'social' as const,
      title: '👥 Social Update',
      message: 'Sarah just completed a lesson and earned 50 XP!',
      priority: 'low' as const,
      color: 'text-green-400',
      icon: '👥'
    },
    {
      type: 'system' as const,
      title: '⚡ System Update',
      message: 'New features are now available! Check out the improved quiz system.',
      priority: 'medium' as const,
      color: 'text-purple-400',
      icon: '⚡'
    },
    {
      type: 'reminder' as const,
      title: '⏰ Learning Reminder',
      message: 'Don\'t forget to practice today! Your streak is at 5 days.',
      priority: 'high' as const,
      color: 'text-orange-400',
      icon: '⏰'
    }
  ];

  const sendTestNotification = (notification: typeof testNotifications[0]) => {
    setIsLoading(true);
    addNotification(notification);
    setTimeout(() => setIsLoading(false), 500);
  };

  const sendRandomNotification = () => {
    const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
    sendTestNotification(randomNotification);
  };

  const sendMultipleNotifications = () => {
    setIsLoading(true);
    testNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 1000);
    });
    setTimeout(() => setIsLoading(false), testNotifications.length * 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Notification Test Center</h1>
            <p className="text-white/70">
              Test the live notification system with different types of notifications
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">{notifications.length}</div>
              <div className="text-white/70">Total Notifications</div>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-400">{unreadCount}</div>
              <div className="text-white/70">Unread Notifications</div>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400">{notifications.length - unreadCount}</div>
              <div className="text-white/70">Read Notifications</div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {testNotifications.map((notification, index) => (
              <button
                key={index}
                onClick={() => sendTestNotification(notification)}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  notification.priority === 'high'
                    ? 'border-red-500 bg-red-500/20 hover:bg-red-500/30'
                    : notification.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30'
                    : 'border-green-500 bg-green-500/20 hover:bg-green-500/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-2xl mb-2">{notification.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{notification.title}</div>
                <div className="text-white/70 text-xs">{notification.message}</div>
                <div className={`text-xs mt-2 ${
                  notification.priority === 'high' ? 'text-red-400' :
                  notification.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {notification.priority.toUpperCase()} PRIORITY
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={sendRandomNotification}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Bell className="w-5 h-5" />
              <span>Send Random Notification</span>
            </button>

            <button
              onClick={sendMultipleNotifications}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Send All Notifications</span>
            </button>

            <button
              onClick={clearAllNotifications}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-400 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Sending notifications...</span>
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Notifications</h3>
            {notifications.length === 0 ? (
              <div className="text-center text-white/70 py-8">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet. Send some test notifications!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read 
                        ? 'border-white/10 bg-white/5' 
                        : 'border-blue-500/50 bg-blue-500/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-xl">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{notification.title}</div>
                        <div className="text-white/70 text-xs mt-1">{notification.message}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/50">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                Unread
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${
                              notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-4">How to Test:</h3>
            <ul className="text-yellow-300 text-sm space-y-2">
              <li>• Click on any notification card to send a test notification</li>
              <li>• Use "Send Random Notification" for surprise notifications</li>
              <li>• Use "Send All Notifications" to see all types at once</li>
              <li>• Check the notification bell in the header for live updates</li>
              <li>• Notifications are automatically generated every 30-90 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
