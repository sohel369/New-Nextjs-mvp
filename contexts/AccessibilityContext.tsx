'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  highContrast: boolean;
  screenReader: boolean;
  captions: boolean;
  reducedMotion: boolean;
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  soundEffects: boolean;
  voiceGuidance: boolean;
  soundVolume: number;
  notificationsEnabled: boolean;
  learningReminders: boolean;
  achievementNotifications: boolean;
  liveSessionAlerts: boolean;
  securityAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  saveSettings: () => Promise<void>;
  loading: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  screenReader: false,
  captions: true,
  reducedMotion: false,
  colorBlind: 'none',
  theme: 'system',
  soundEnabled: true,
  soundEffects: true,
  voiceGuidance: true,
  soundVolume: 70,
  notificationsEnabled: true,
  learningReminders: true,
  achievementNotifications: true,
  liveSessionAlerts: false,
  securityAlerts: true,
  emailNotifications: true,
  pushNotifications: true
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load settings from database when user is available
  useEffect(() => {
    if (user?.id) {
      loadSettingsFromDatabase();
    } else {
      // Load from localStorage when not authenticated
      loadSettingsFromLocalStorage();
    }
  }, [user?.id]);

  const loadSettingsFromDatabase = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/settings?userId=${user.id}`);
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type') || '';
      const isJSON = contentType.includes('application/json');
      
      if (!isJSON) {
        // API routes not available (static export mode)
        console.warn('API routes not available, using localStorage fallback');
        loadSettingsFromLocalStorage();
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const dbSettings = data.data;
        setSettings({
          fontSize: dbSettings.font_size,
          highContrast: dbSettings.high_contrast,
          screenReader: dbSettings.screen_reader,
          captions: true, // Default for captions
          reducedMotion: dbSettings.reduced_motion,
          colorBlind: 'none', // Default for color blind
          theme: dbSettings.theme,
          soundEnabled: dbSettings.sound_enabled,
          soundEffects: dbSettings.sound_effects,
          voiceGuidance: dbSettings.voice_guidance,
          soundVolume: dbSettings.sound_volume,
          notificationsEnabled: dbSettings.notifications_enabled,
          learningReminders: dbSettings.learning_reminders,
          achievementNotifications: dbSettings.achievement_notifications,
          liveSessionAlerts: dbSettings.live_session_alerts,
          securityAlerts: dbSettings.security_alerts,
          emailNotifications: dbSettings.email_notifications,
          pushNotifications: dbSettings.push_notifications
        });
      }
    } catch (error) {
      // Network error or API routes not available - fallback to localStorage
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Network error or API routes not available, using localStorage fallback');
      } else {
        console.error('Error loading settings from database:', error);
      }
      loadSettingsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadSettingsFromLocalStorage = () => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing accessibility settings:', error);
      }
    }
  };

  useEffect(() => {
    // Apply settings to the document
    applySettings(settings);
    
    // Save to localStorage as backup
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px'
    };
    root.style.fontSize = fontSizeMap[newSettings.fontSize];

    // Theme
    if (newSettings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (newSettings.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // System theme - let CSS handle it
      root.classList.remove('light', 'dark');
    }

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
    }

    // Color blind support
    root.setAttribute('data-colorblind', newSettings.colorBlind);

    // Sound settings (guard against undefined)
    const soundEnabled = Boolean(newSettings.soundEnabled);
    const soundEffects = Boolean(newSettings.soundEffects);
    const voiceGuidance = Boolean(newSettings.voiceGuidance);
    const soundVolume = Number.isFinite(newSettings.soundVolume) ? newSettings.soundVolume : 70;
    root.setAttribute('data-sound-enabled', String(soundEnabled));
    root.setAttribute('data-sound-effects', String(soundEffects));
    root.setAttribute('data-voice-guidance', String(voiceGuidance));
    root.style.setProperty('--sound-volume', `${soundVolume}%`);

    // Notification settings (guard against undefined)
    const notificationsEnabled = Boolean(newSettings.notificationsEnabled);
    root.setAttribute('data-notifications-enabled', String(notificationsEnabled));
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          settings: {
            theme: settings.theme,
            font_size: settings.fontSize,
            font_family: 'system',
            notifications_enabled: settings.notificationsEnabled,
            learning_reminders: settings.learningReminders,
            achievement_notifications: settings.achievementNotifications,
            live_session_alerts: settings.liveSessionAlerts,
            security_alerts: settings.securityAlerts,
            email_notifications: settings.emailNotifications,
            push_notifications: settings.pushNotifications,
            sound_enabled: settings.soundEnabled,
            sound_effects: settings.soundEffects,
            background_music: false,
            voice_guidance: settings.voiceGuidance,
            sound_volume: settings.soundVolume,
            high_contrast: settings.highContrast,
            reduced_motion: settings.reducedMotion,
            screen_reader: settings.screenReader,
            keyboard_navigation: true,
            daily_goal_minutes: 15,
            reminder_time: '09:00:00',
            preferred_difficulty: 'adaptive',
            auto_advance: true,
            profile_visibility: 'friends',
            show_progress: true,
            show_achievements: true,
            show_streak: true,
            interface_language: 'en',
            learning_language: 'ar',
            native_language: 'en'
          }
        })
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type') || '';
      const isJSON = contentType.includes('application/json');
      
      if (!isJSON) {
        // API routes not available, settings saved to localStorage instead
        console.warn('API routes not available, settings saved to localStorage');
        return;
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSetting, 
        resetSettings,
        saveSettings,
        loading
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
