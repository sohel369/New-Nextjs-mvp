'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  font_size: 'small' | 'medium' | 'large' | 'xl';
  font_family: string;
  notifications_enabled: boolean;
  learning_reminders: boolean;
  achievement_notifications: boolean;
  live_session_alerts: boolean;
  security_alerts: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  sound_effects: boolean;
  background_music: boolean;
  voice_guidance: boolean;
  sound_volume: number;
  high_contrast: boolean;
  reduced_motion: boolean;
  screen_reader: boolean;
  keyboard_navigation: boolean;
  daily_goal_minutes: number;
  reminder_time: string;
  preferred_difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  auto_advance: boolean;
  profile_visibility: 'public' | 'friends' | 'private';
  show_progress: boolean;
  show_achievements: boolean;
  show_streak: boolean;
  interface_language: string;
  learning_language: string;
  native_language: string;
  created_at: string;
  updated_at: string;
}

interface SettingsContextType {
  settings: UserSettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  applyTheme: (theme: 'light' | 'dark' | 'system') => void;
  applyFontSize: (fontSize: 'small' | 'medium' | 'large' | 'xl') => void;
  applyNotificationSettings: (settings: Partial<UserSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Default settings
  const defaultSettings: Partial<UserSettings> = {
    theme: 'dark',
    font_size: 'medium',
    font_family: 'system',
    notifications_enabled: true,
    learning_reminders: true,
    achievement_notifications: true,
    live_session_alerts: false,
    security_alerts: true,
    email_notifications: true,
    push_notifications: true,
    sound_enabled: true,
    sound_effects: true,
    background_music: false,
    voice_guidance: true,
    sound_volume: 70,
    high_contrast: false,
    reduced_motion: false,
    screen_reader: false,
    keyboard_navigation: true,
    daily_goal_minutes: 15,
    reminder_time: '09:00:00',
    preferred_difficulty: 'adaptive',
    auto_advance: true,
    profile_visibility: 'public',
    show_progress: true,
    show_achievements: true,
    show_streak: true,
    interface_language: 'en',
    learning_language: 'ar',
    native_language: 'en',
  };

  // Fetch user settings from API
  const fetchSettings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/settings?userId=${user.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setSettings(result.data);
        // Apply settings immediately
        applyTheme(result.data.theme);
        applyFontSize(result.data.font_size);
      } else {
        // Create default settings if none exist
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback to default settings
      setSettings(defaultSettings as UserSettings);
    } finally {
      setLoading(false);
    }
  };

  // Create default settings for new user
  const createDefaultSettings = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setSettings(result.data);
        applyTheme(result.data.theme);
        applyFontSize(result.data.font_size);
      }
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  // Update settings in database
  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<boolean> => {
    if (!user?.id || !settings) return false;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          settings: newSettings,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setSettings(result.data);
        
        // Apply theme and font size changes immediately
        if (newSettings.theme) {
          applyTheme(newSettings.theme);
        }
        if (newSettings.font_size) {
          applyFontSize(newSettings.font_size);
        }
        
        // Apply notification settings
        applyNotificationSettings(newSettings);
        
        return true;
      } else {
        console.error('Failed to update settings:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  // Apply theme globally
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'system');
    body.classList.remove('light', 'dark', 'system');
    
    if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      root.classList.add('system', systemTheme);
      body.classList.add('system', systemTheme);
      
      // Set CSS custom properties for system theme
      root.style.setProperty('--theme-mode', 'system');
      root.style.setProperty('--current-theme', systemTheme);
    } else {
      root.classList.add(theme);
      body.classList.add(theme);
      
      // Set CSS custom properties
      root.style.setProperty('--theme-mode', theme);
      root.style.setProperty('--current-theme', theme);
    }
    
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme, actualTheme: theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme }
    }));
  };

  // Apply font size globally
  const applyFontSize = (fontSize: 'small' | 'medium' | 'large' | 'xl') => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing font size classes
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xl');
    body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xl');
    
    // Add new font size class
    root.classList.add(`font-${fontSize}`);
    body.classList.add(`font-${fontSize}`);
    
    // Set CSS custom property for font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
    };
    
    root.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
    root.style.setProperty('--font-size', fontSize);
    
    // Store font size preference
    localStorage.setItem('fontSize', fontSize);
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('fontSizeChanged', { 
      detail: { fontSize, size: fontSizeMap[fontSize] }
    }));
  };

  // Apply notification settings globally
  const applyNotificationSettings = (notificationSettings: Partial<UserSettings>) => {
    // Update browser notification permissions
    if (notificationSettings.push_notifications !== undefined) {
      if (notificationSettings.push_notifications && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    }

    // Update sound settings
    if (notificationSettings.sound_enabled !== undefined) {
      // Store sound preference globally
      localStorage.setItem('soundEnabled', notificationSettings.sound_enabled.toString());
    }

    if (notificationSettings.sound_volume !== undefined) {
      // Store sound volume globally
      localStorage.setItem('soundVolume', notificationSettings.sound_volume.toString());
    }

    // Dispatch custom event for notification changes
    window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
      detail: notificationSettings 
    }));
  };

  // Refresh settings
  const refreshSettings = async () => {
    await fetchSettings();
  };

  // Load settings when user changes
  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    } else {
      setSettings(null);
      setLoading(false);
    }
  }, [user?.id]);

  // Apply saved theme and font size on mount
  useEffect(() => {
    if (settings) {
      applyTheme(settings.theme);
      applyFontSize(settings.font_size);
    } else {
      // Apply localStorage preferences as fallback
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | 'xl' | null;
      
      if (savedTheme) {
        applyTheme(savedTheme);
      }
      if (savedFontSize) {
        applyFontSize(savedFontSize);
      }
    }
  }, [settings]);

  const value: SettingsContextType = {
    settings,
    loading,
    updateSettings,
    refreshSettings,
    applyTheme,
    applyFontSize,
    applyNotificationSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
