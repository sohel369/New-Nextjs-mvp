'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from '../hooks/useTranslation';
import { db } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  writeBatch
} from 'firebase/firestore';
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
  AlertCircle,
  Zap
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
  const { setCurrentLanguage } = useLanguage();
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
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load user profile from Firestore
      const profileRef = doc(db, 'profiles', user.id);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const profile = profileSnap.data();
        setBaseLanguage(profile.base_language || 'en');
        setLearningLanguages(profile.learning_languages || ['en']);
      }

      // Load user settings from Firestore
      const settingsRef = doc(db, 'user_settings', user.id);
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        const userSettings = settingsSnap.data();
        setSettings({
          dark_mode: userSettings.dark_mode ?? true,
          notifications_enabled: userSettings.notifications_enabled ?? true,
          sound_enabled: userSettings.sound_enabled ?? true,
          auto_play_audio: userSettings.auto_play_audio ?? true,
          high_contrast: userSettings.high_contrast ?? false,
          large_text: userSettings.large_text ?? false
        });
      } else {
        // Create default settings if they don't exist
        const defaultSettings = {
          dark_mode: true,
          notifications_enabled: true,
          sound_enabled: true,
          auto_play_audio: true,
          high_contrast: false,
          large_text: false,
          created_at: new Date().toISOString()
        };
        await setDoc(settingsRef, defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings from Firebase:', error);
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

      // Optimized: Use writeBatch for faster atomic updates
      const batch = writeBatch(db);
      
      const profileRef = doc(db, 'profiles', user.id);
      batch.update(profileRef, {
        base_language: baseLanguage,
        learning_languages: learningLanguages,
        updated_at: new Date().toISOString()
      });

      const settingsRef = doc(db, 'user_settings', user.id);
      batch.set(settingsRef, {
        dark_mode: settings.dark_mode,
        notifications_enabled: settings.notifications_enabled,
        sound_enabled: settings.sound_enabled,
        auto_play_audio: settings.auto_play_audio,
        high_contrast: settings.high_contrast,
        large_text: settings.large_text,
        updated_at: new Date().toISOString()
      }, { merge: true });

      await batch.commit();

      // 3. Update active UI context
      const lang = languages.find(l => l.code === baseLanguage);
      if (lang) {
        handleBaseLanguageChange(lang.code);
      }

      updateAccessibilitySetting('theme', settings.dark_mode ? 'dark' : 'light');
      updateAccessibilitySetting('highContrast', settings.high_contrast);
      updateAccessibilitySetting('fontSize', settings.large_text ? 'large' : 'medium');
      updateAccessibilitySetting('notificationsEnabled', settings.notifications_enabled);
      updateAccessibilitySetting('soundEnabled', settings.sound_enabled);

      // 4. Force refresh of user context
      await refreshUser();

      setSuccess('All settings saved to database!');
      onSettingsUpdate?.();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving settings to Firebase:', error);
      setError(error instanceof Error ? error.message : 'Database sync failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBaseLanguageChange = (langCode: string) => {
    setBaseLanguage(langCode);
    const lang = languages.find(l => l.code === langCode);
    if (lang) {
      setCurrentLanguage(lang);
    }
  };

  const handleLearningLanguageToggle = (langCode: string) => {
    setLearningLanguages(prev => {
      const isAlreadySelected = prev.includes(langCode);
      if (isAlreadySelected) {
        return prev.length > 1 ? prev.filter(lang => lang !== langCode) : prev;
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
    
    // Linked appearance settings to AccessibilityContext for immediate feedback
    if (key === 'dark_mode') {
      updateAccessibilitySetting('theme', value ? 'dark' : 'light');
    } else if (key === 'high_contrast') {
      updateAccessibilitySetting('highContrast', value);
    } else if (key === 'large_text') {
      updateAccessibilitySetting('fontSize', value ? 'large' : 'medium');
    }
    
    if (key === 'notifications_enabled' && value) {
      setShowNotificationPopup(true);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/20"></div>
        <p className="text-purple-300 font-medium animate-pulse">{t('saving')}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 🌐 Language Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-blue-500/20 rounded-xl">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Language Settings</h3>
        </div>
        
        <div className="space-y-8">
          {/* Interface Language */}
          <div>
            <label className="block text-white/50 text-sm font-semibold uppercase tracking-wider mb-4">
              Interface Language (App Language)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => (
                <button
                  key={`base-${lang.code}`}
                  onClick={() => handleBaseLanguageChange(lang.code)}
                  className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    baseLanguage === lang.code
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                      : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{lang.flag}</div>
                    <div className="text-white font-bold text-sm sm:text-base">{lang.name}</div>
                    <div className="text-white/40 text-xs mt-1 truncate">{lang.native}</div>
                  </div>
                  {baseLanguage === lang.code && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Languages */}
          <div>
            <label className="block text-white/50 text-sm font-semibold uppercase tracking-wider mb-4">
              Learning Languages (Select one or more)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => {
                const isSelected = learningLanguages.includes(lang.code);
                return (
                  <button
                    key={`learn-${lang.code}`}
                    onClick={() => handleLearningLanguageToggle(lang.code)}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                        : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="relative z-10 text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{lang.flag}</div>
                      <div className="text-white font-bold text-sm sm:text-base">{lang.name}</div>
                      <div className="text-white/40 text-xs mt-1 truncate">{lang.native}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-emerald-500 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-white/40 text-sm mt-4 flex items-center bg-white/5 p-3 rounded-xl border border-white/10">
              <AlertCircle className="w-4 h-4 mr-2 text-blue-400" />
              Lessons and quizzes will be automatically filtered based on your choices.
            </p>
          </div>
        </div>
      </div>

      {/* 🎨 Appearance Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-purple-500/20 rounded-xl">
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Appearance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'dark_mode', label: 'Dark Mode', desc: 'Sleek dark theme for night usage', icon: Moon },
            { id: 'high_contrast', label: 'High Contrast', desc: 'Enhanced accessibility & visibility', icon: Sun },
            { id: 'large_text', label: 'Large Text', desc: 'Better readability for all screens', icon: Sun },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm sm:text-base">{item.label}</div>
                  <div className="text-white/40 text-xs">{item.desc}</div>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange(item.id as keyof UserSettings, !settings[item.id as keyof UserSettings])}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  settings[item.id as keyof UserSettings] ? 'bg-purple-500 shadow-lg shadow-purple-500/40' : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  settings[item.id as keyof UserSettings] ? 'left-8' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔔 Notifications */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-orange-500/20 rounded-xl">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-500/10 to-transparent rounded-2xl border border-orange-500/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-white font-bold text-base sm:text-lg">Enable Reminders</div>
                <div className="text-white/40 text-sm">Stay consistent with daily alerts</div>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('notifications_enabled', !settings.notifications_enabled)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                settings.notifications_enabled ? 'bg-orange-500 shadow-lg shadow-orange-500/40' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                settings.notifications_enabled ? 'left-9' : 'left-2'
              }`} />
            </button>
          </div>
          
          <button
            onClick={() => setShowNotificationPopup(true)}
            className="w-full p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-semibold flex items-center justify-center space-x-3 group"
          >
            <Zap className="w-5 h-5 text-yellow-400 group-hover:scale-125 transition-transform" />
            <span>Test Interaction Feedback</span>
          </button>
        </div>
      </div>

      {/* 🔊 Audio Experience */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-cyan-500/20 rounded-xl">
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Audio Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-white font-bold">Sound Effects</div>
            </div>
            <button
              onClick={() => handleSettingChange('sound_enabled', !settings.sound_enabled)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                settings.sound_enabled ? 'bg-cyan-500' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                settings.sound_enabled ? 'left-8' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-white font-bold">Auto-play Voice</div>
            </div>
            <button
              onClick={() => handleSettingChange('auto_play_audio', !settings.auto_play_audio)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                settings.auto_play_audio ? 'bg-blue-500' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                settings.auto_play_audio ? 'left-8' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 💾 Save Action Bar */}
      <div className="sticky bottom-4 left-0 right-0 z-50 px-4">
        <div className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/5 border border-white/20 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {error && (
              <div className="flex items-center space-x-2 text-red-100 bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/30 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center space-x-2 text-emerald-100 bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30 animate-bounce-in">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}
            {!error && !success && (
              <div className="text-white/40 text-sm italic ml-2">Unsaved changes will be lost after refresh</div>
            )}
          </div>
          
          <button
            onClick={saveSettings}
            disabled={saving}
            className={`group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-black py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl shadow-purple-500/25 flex items-center justify-center space-x-3 w-full sm:w-auto transform hover:scale-105 active:scale-95 ${
              saving ? 'animate-pulse' : ''
            }`}
          >
            {saving ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            )}
            <span className="tracking-widest uppercase text-sm sm:text-base">
              {saving ? 'Syncing...' : 'Publish Settings'}
            </span>
          </button>
        </div>
      </div>
      
      {/* 🛡 Popups */}
      <SimpleNotificationPopup 
        show={showNotificationPopup} 
        onClose={() => setShowNotificationPopup(false)}
        isNotificationEnabled={settings.notifications_enabled}
      />
    </div>
  );
}
