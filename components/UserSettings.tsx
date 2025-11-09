'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Type, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Eye, 
  EyeOff, 
  Zap, 
  Save, 
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';

export default function UserSettings() {
  const { settings, updateSetting, saveSettings, resetSettings, loading } = useAccessibility();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Ensure settings have default values to prevent undefined errors
  const safeSettings = {
    soundEnabled: settings?.soundEnabled ?? true,
    soundEffects: settings?.soundEffects ?? true,
    voiceGuidance: settings?.voiceGuidance ?? true,
    soundVolume: settings?.soundVolume ?? 70,
    notificationsEnabled: settings?.notificationsEnabled ?? true,
    learningReminders: settings?.learningReminders ?? true,
    achievementNotifications: settings?.achievementNotifications ?? true,
    liveSessionAlerts: settings?.liveSessionAlerts ?? false,
    securityAlerts: settings?.securityAlerts ?? true,
    theme: settings?.theme ?? 'dark',
    fontSize: settings?.fontSize ?? 'medium',
    highContrast: settings?.highContrast ?? false,
    reducedMotion: settings?.reducedMotion ?? false,
    screenReader: settings?.screenReader ?? false,
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await saveSettings();
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetSettings();
    setSaveMessage('Settings reset to defaults');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Settings
        </h3>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none px-3 py-1.5 sm:py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || loading}
            className="flex-1 sm:flex-none px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-3 rounded-lg flex items-center space-x-2 text-sm sm:text-base ${
          saveMessage.includes('successfully') 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {saveMessage.includes('successfully') ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="break-words">{saveMessage}</span>
        </div>
      )}

      {/* Theme Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Theme & Appearance</h4>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white/80 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" /> }
              ].map(theme => (
                <button
                  key={theme.value}
                  onClick={() => updateSetting('theme', theme.value as 'light' | 'dark' | 'system')}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                    safeSettings.theme === theme.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    {theme.icon}
                    <span className="text-xs sm:text-sm font-medium">{theme.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Font Size</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'xl', label: 'XL' }
              ].map(size => (
                <button
                  key={size.value}
                  onClick={() => updateSetting('fontSize', size.value as 'small' | 'medium' | 'large' | 'xl')}
                  className={`p-2 sm:p-2.5 rounded-lg border transition-all text-xs sm:text-sm ${
                    safeSettings.fontSize === size.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                  }`}
                >
                  <span className="font-medium">{size.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Sound & Audio</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {safeSettings.soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />}
              <span className="text-white text-sm sm:text-base truncate">Sound Effects</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={safeSettings.soundEnabled} 
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {safeSettings.soundEnabled && (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base truncate">Sound Effects</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.soundEffects} 
                    onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base truncate">Voice Guidance</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.voiceGuidance} 
                    onChange={(e) => updateSetting('voiceGuidance', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Sound Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={safeSettings.soundVolume}
                  onChange={(e) => updateSetting('soundVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/70 text-sm mt-1">
                  <span>0%</span>
                  <span className="font-medium">{safeSettings.soundVolume}%</span>
                  <span>100%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {safeSettings.notificationsEnabled ? <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" /> : <BellOff className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />}
              <span className="text-white text-sm sm:text-base truncate">All Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={safeSettings.notificationsEnabled} 
                onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {safeSettings.notificationsEnabled && (
            <>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base truncate">Learning Reminders</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.learningReminders} 
                    onChange={(e) => updateSetting('learningReminders', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base truncate">Achievement Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.achievementNotifications} 
                    onChange={(e) => updateSetting('achievementNotifications', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base truncate">Live Session Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.liveSessionAlerts} 
                    onChange={(e) => updateSetting('liveSessionAlerts', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base truncate">Security Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.securityAlerts} 
                    onChange={(e) => updateSetting('securityAlerts', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Accessibility</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {safeSettings.highContrast ? <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />}
              <span className="text-white text-sm sm:text-base truncate">High Contrast</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={safeSettings.highContrast} 
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
              <span className="text-white text-sm sm:text-base truncate">Reduced Motion</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={safeSettings.reducedMotion} 
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
              <span className="text-white text-sm sm:text-base truncate">Screen Reader Support</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={safeSettings.screenReader} 
                onChange={(e) => updateSetting('screenReader', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}