'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Save, RotateCcw } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function TestSettingsPage() {
  const { settings, updateSetting, saveSettings, resetSettings, loading } = useAccessibility();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      await saveSettings();
      setMessage('✅ Settings saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('❌ Failed to save settings. Please try again.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetSettings();
    setMessage('🔄 Settings reset to defaults');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-semibold">Test Settings</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-purple-400" />
              <span className="text-white font-semibold">Settings Test</span>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-white text-center">{message}</div>
            </div>
          )}

          {/* Current Settings Display */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Current Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{settings.theme}</div>
                <div className="text-white/70 text-sm">Theme</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{settings.fontSize}</div>
                <div className="text-white/70 text-sm">Font Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{settings.soundVolume}%</div>
                <div className="text-white/70 text-sm">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{settings.notificationsEnabled ? 'ON' : 'OFF'}</div>
                <div className="text-white/70 text-sm">Notifications</div>
              </div>
            </div>
          </div>

          {/* Quick Settings Test */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Settings Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme Test */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Theme</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' }
                  ].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => updateSetting('theme', theme.value as any)}
                      className={`p-2 rounded-lg border transition-all ${
                        settings.theme === theme.value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Test */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Font Size</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                    { value: 'xl', label: 'XL' }
                  ].map(size => (
                    <button
                      key={size.value}
                      onClick={() => updateSetting('fontSize', size.value as any)}
                      className={`p-2 rounded-lg border transition-all ${
                        settings.fontSize === size.value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Test */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Sound</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Sound Effects</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.soundEnabled} 
                        onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Voice Guidance</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.voiceGuidance} 
                        onChange={(e) => updateSetting('voiceGuidance', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Volume: {settings.soundVolume}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.soundVolume}
                      onChange={(e) => updateSetting('soundVolume', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications Test */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white">All Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.notificationsEnabled} 
                        onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Learning Reminders</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.learningReminders} 
                        onChange={(e) => updateSetting('learningReminders', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Achievement Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.achievementNotifications} 
                        onChange={(e) => updateSetting('achievementNotifications', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving || loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Instructions</h3>
            <div className="text-white/80 space-y-2">
              <p>• Change settings above to see real-time updates</p>
              <p>• Click "Save Settings" to persist changes to database</p>
              <p>• Settings are applied globally across the app</p>
              <p>• Check the profile page to see the full settings interface</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
