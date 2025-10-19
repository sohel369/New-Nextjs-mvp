'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Bell, 
  Palette, 
  Type, 
  Trash2, 
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Shield,
  User,
  Trophy
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings, UserSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { languages } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Remove the local Settings interface since we're using UserSettings from context

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const { settings, updateSettings, loading } = useSettings();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'privacy' | 'account'>('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    
    setSaving(true);
    const success = await updateSettings({ [key]: value });
    setSaving(false);
    
    if (!success) {
      console.error('Failed to update setting:', key, value);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      await handleSettingChange('interface_language', languageCode);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      // Implement account deletion logic here
      console.log('Account deletion confirmed');
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
  ];

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-800 rounded-lg sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[500px] sm:h-[600px]">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden border-b border-slate-700 p-3 sm:p-4">
            <div className="flex overflow-x-auto space-x-1 sm:space-x-2 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-56 xl:w-64 bg-slate-900/50 border-r border-slate-700 p-3 xl:p-4">
            <nav className="space-y-1 xl:space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-2 xl:space-x-3 px-3 xl:px-4 py-2 xl:py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                    <span className="text-sm xl:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">General Settings</h3>
                
                {/* Language Selection */}
                <div className="space-y-3">
                  <label className="block text-white font-medium text-sm sm:text-base">Language</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                          settings?.interface_language === lang.code
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm sm:text-base lg:text-lg font-semibold mb-1">{lang.name}</div>
                          <div className="text-xs sm:text-sm text-white/80">{lang.native}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Appearance</h3>
                
                {/* Theme Selection */}
                <div className="space-y-3">
                  <label className="block text-white font-medium text-sm sm:text-base">Theme</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'auto', label: 'Auto', icon: Palette },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => handleSettingChange('theme', theme.value)}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-1 sm:space-y-2 ${
                            settings?.theme === theme.value
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                          }`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                          <span className="font-medium text-xs sm:text-sm">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <label className="block text-white font-medium text-sm sm:text-base">Font Size</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { value: 'small', label: 'Small', size: 'text-sm' },
                      { value: 'medium', label: 'Medium', size: 'text-base' },
                      { value: 'large', label: 'Large', size: 'text-lg' },
                    ].map((font) => (
                      <button
                        key={font.value}
                        onClick={() => handleSettingChange('font_size', font.value)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                          settings?.font_size === font.value
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                        }`}
                      >
                        <div className={`font-medium text-xs sm:text-sm ${font.size}`}>{font.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Notifications</h3>
                
                {/* Notification Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-white font-medium">Enable Notifications</div>
                        <div className="text-slate-400 text-sm">Receive app notifications</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('notifications_enabled', !settings?.notifications_enabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings?.notifications_enabled ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings?.notifications_enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-white font-medium">Sound Notifications</div>
                        <div className="text-slate-400 text-sm">Play sound for notifications</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('sound_enabled', !settings?.sound_enabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings?.sound_enabled ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings?.sound_enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-white font-medium">Email Notifications</div>
                        <div className="text-slate-400 text-sm">Receive email updates</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('email_notifications', !settings?.email_notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings?.email_notifications ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings?.email_notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-white font-medium">Push Notifications</div>
                        <div className="text-slate-400 text-sm">Browser push notifications</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('push_notifications', !settings?.push_notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings?.push_notifications ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings?.push_notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Privacy & Security</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-white font-medium">Public Profile</div>
                        <div className="text-slate-400 text-sm">Make your profile visible to other users</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('profile_visibility', 
                        settings?.profile_visibility === 'public' ? 'private' : 'public'
                      )}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings?.profile_visibility === 'public' ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings?.profile_visibility === 'public' ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-white font-medium">Show Progress</div>
                        <div className="text-slate-400 text-sm">Display your learning progress publicly</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('show_progress', !settings?.show_progress)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings?.show_progress ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings?.show_progress ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Account Management</h3>
                
                {!showDeleteConfirm ? (
                  <div className="space-y-4">
                    <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <Trash2 className="w-6 h-6 text-red-400" />
                        <h4 className="text-lg font-semibold text-red-400">Delete Account</h4>
                      </div>
                      <p className="text-slate-300 mb-4">
                        This action cannot be undone. All your data, progress, and settings will be permanently deleted.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <Trash2 className="w-6 h-6 text-red-400" />
                        <h4 className="text-lg font-semibold text-red-400">Confirm Account Deletion</h4>
                      </div>
                      <p className="text-slate-300 mb-4">
                        Type <strong className="text-red-400">DELETE</strong> to confirm account deletion:
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                      />
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmText !== 'DELETE'}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText('');
                          }}
                          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-slate-700 space-y-2 sm:space-y-0">
          <div className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
            {saving ? 'Saving changes...' : 'Changes are saved automatically'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
