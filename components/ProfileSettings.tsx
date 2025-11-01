'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import SimpleNotificationPopup from './SimpleNotificationPopup';
import { 
  Globe, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Volume2, 
  VolumeX, 
  Check, 
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface UserSettings {
  dark_mode: boolean;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  auto_play_audio: boolean;
  high_contrast: boolean;
  large_text: boolean;
}

interface ProfileSettingsProps {
  onSettingsUpdate?: () => void;
}

export default function ProfileSettings({ onSettingsUpdate }: ProfileSettingsProps) {
  const { user, refreshUser } = useAuth();
  const { setCurrentLanguage, languages } = useLanguage();
  const { updateSetting: updateAccessibilitySetting } = useAccessibility();
  const t = useTranslation();
  const [settings, setSettings] = useState<UserSettings>({
    dark_mode: true,
    notifications_enabled: true,
    sound_enabled: true,
    auto_play_audio: true,
    high_contrast: false,
    large_text: false
  });
  const [baseLanguage, setBaseLanguage] = useState<string>('en');
  const [learningLanguages, setLearningLanguages] = useState<string[]>(['en']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Use languages from LanguageContext to ensure consistency
  const availableLanguages = languages;

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('base_language, learning_languages')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
      } else {
        setBaseLanguage(profile?.base_language || 'en');
        setLearningLanguages(profile?.learning_languages || ['en']);
      }

      // Load user settings
      const { data: userSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error loading settings:', settingsError);
      } else if (userSettings) {
        setSettings({
          dark_mode: userSettings.dark_mode ?? true,
          notifications_enabled: userSettings.notifications_enabled ?? true,
          sound_enabled: userSettings.sound_enabled ?? true,
          auto_play_audio: userSettings.auto_play_audio ?? true,
          high_contrast: userSettings.high_contrast ?? false,
          large_text: userSettings.large_text ?? false
        });
      }
      
      // If no settings exist, create default settings
      if (settingsError && settingsError.code === 'PGRST116') {
        const { error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user?.id,
            dark_mode: true,
            notifications_enabled: true,
            sound_enabled: true,
            auto_play_audio: true,
            high_contrast: false,
            large_text: false
          });
        
        if (createError) {
          console.error('Error creating default settings:', createError);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          base_language: baseLanguage,
          learning_languages: learningLanguages,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        throw new Error('Failed to update profile');
      }

      // Update or create user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (settingsError) {
        throw new Error('Failed to update settings');
      }

      // Update language context if base language changed
      const lang = languages.find(l => l.code === baseLanguage);
      if (lang) {
        setCurrentLanguage(lang);
      }

      // Update accessibility context with new settings
      updateAccessibilitySetting('theme', settings.dark_mode ? 'dark' : 'light');
      updateAccessibilitySetting('highContrast', settings.high_contrast);
      updateAccessibilitySetting('notificationsEnabled', settings.notifications_enabled);
      updateAccessibilitySetting('soundEnabled', settings.sound_enabled);

      // Refresh user data to get latest settings
      await refreshUser();

      setSuccess('Settings saved successfully!');
      onSettingsUpdate?.();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLearningLanguageToggle = (langCode: string) => {
    setLearningLanguages(prev => {
      if (prev.includes(langCode)) {
        // Don't allow removing all languages
        if (prev.length > 1) {
          return prev.filter(lang => lang !== langCode);
        }
        return prev;
      } else {
        return [...prev, langCode];
      }
    });
  };

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Show notification popup when notification settings change
    if (key === 'notifications_enabled') {
      setShowNotificationPopup(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Language Settings
        </h3>
        
        <div className="space-y-6">
          {/* Base Language */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">
              Interface Language (App Language)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setBaseLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    baseLanguage === lang.code
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="text-white text-sm font-medium">{lang.name}</div>
                    <div className="text-white/70 text-xs">{lang.native}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Languages */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">
              Learning Languages (Select one or more)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLearningLanguageToggle(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    learningLanguages.includes(lang.code)
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="text-white text-sm font-medium">{lang.name}</div>
                    <div className="text-white/70 text-xs">{lang.native}</div>
                    {learningLanguages.includes(lang.code) && (
                      <Check className="w-4 h-4 text-green-400 mx-auto mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-white/60 text-xs mt-2">
              Lessons and quizzes will be filtered based on your selected learning languages.
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Moon className="w-5 h-5 mr-2" />
          Appearance
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Dark Mode</div>
              <div className="text-white/70 text-sm">Use dark theme for the app</div>
            </div>
            <button
              onClick={() => handleSettingChange('dark_mode', !settings.dark_mode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.dark_mode ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.dark_mode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">High Contrast</div>
              <div className="text-white/70 text-sm">Increase contrast for better visibility</div>
            </div>
            <button
              onClick={() => handleSettingChange('high_contrast', !settings.high_contrast)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.high_contrast ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.high_contrast ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Large Text</div>
              <div className="text-white/70 text-sm">Increase text size for better readability</div>
            </div>
            <button
              onClick={() => handleSettingChange('large_text', !settings.large_text)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.large_text ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.large_text ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Enable Notifications</div>
              <div className="text-white/70 text-sm">Receive learning reminders and updates</div>
            </div>
            <button
              onClick={() => handleSettingChange('notifications_enabled', !settings.notifications_enabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.notifications_enabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notifications_enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Test Notification Popup</div>
              <div className="text-white/70 text-sm">Show notification status popup</div>
            </div>
            <button
              onClick={() => {
                setShowNotificationPopup(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Test Popup
            </button>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Volume2 className="w-5 h-5 mr-2" />
          Audio
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Enable Sound</div>
              <div className="text-white/70 text-sm">Play audio for lessons and notifications</div>
            </div>
            <button
              onClick={() => handleSettingChange('sound_enabled', !settings.sound_enabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.sound_enabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.sound_enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto-play Audio</div>
              <div className="text-white/70 text-sm">Automatically play audio in lessons</div>
            </div>
            <button
              onClick={() => handleSettingChange('auto_play_audio', !settings.auto_play_audio)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.auto_play_audio ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.auto_play_audio ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-2 text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
      
      {/* Notification Popup */}
      <SimpleNotificationPopup 
        show={showNotificationPopup} 
        onClose={() => setShowNotificationPopup(false)}
        isNotificationEnabled={settings.notifications_enabled}
      />
    </div>
  );
}
