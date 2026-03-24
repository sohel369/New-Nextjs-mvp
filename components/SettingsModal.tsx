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
import { motion, AnimatePresence } from 'framer-motion';

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
                    onClick={() => setActiveTab(tab.id as 'general' | 'appearance' | 'notifications' | 'privacy' | 'account')}
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
                    onClick={() => setActiveTab(tab.id as 'general' | 'appearance' | 'notifications' | 'privacy' | 'account')}
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
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-900/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Globe className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">General Settings</h3>
                    </div>
                    
                    {/* Language Selection */}
                    <div className="space-y-4">
                      <label className="block text-slate-300 font-medium">Interface Language</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${
                              settings?.interface_language === lang.code
                                ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/80 hover:text-white'
                            }`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-bold">{lang.name}</span>
                              <span className="text-xs opacity-60 font-medium">{lang.native}</span>
                            </div>
                            <span className="text-2xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Palette className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">Appearance</h3>
                    </div>
                    
                    {/* Theme Selection */}
                    <div className="space-y-4">
                      <label className="block text-slate-300 font-medium">Theme Mode</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun, color: 'text-orange-400' },
                          { value: 'dark', label: 'Dark', icon: Moon, color: 'text-indigo-400' },
                          { value: 'system', label: 'Auto', icon: Globe, color: 'text-emerald-400' },
                        ].map((theme) => {
                          const Icon = theme.icon;
                          const isActive = settings?.theme === theme.value;
                          return (
                            <button
                              key={theme.value}
                              onClick={() => handleSettingChange('theme', theme.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 group ${
                                isActive
                                  ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                  : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10'
                              }`}
                            >
                              <Icon className={`w-6 h-6 ${isActive ? theme.color : 'text-slate-500 group-hover:text-slate-300'}`} />
                              <span className="font-bold text-sm tracking-wide">{theme.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Size Selection */}
                    <div className="space-y-4">
                      <label className="block text-slate-300 font-medium">Font Size</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'small', label: 'Small', icon: Type, size: 'text-sm' },
                          { value: 'medium', label: 'Medium', icon: Type, size: 'text-base' },
                        ].map((font) => {
                          const Icon = font.icon;
                          const isActive = settings?.font_size === font.value;
                          return (
                            <button
                              key={font.value}
                              onClick={() => handleSettingChange('font_size', font.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-3 group ${
                                isActive
                                  ? 'bg-pink-500/20 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                                  : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${isActive ? 'text-pink-400' : 'text-slate-500'}`} />
                              <span className={`font-bold ${font.size}`}>{font.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Bell className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-xl font-bold text-white">Notifications</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'notifications_enabled', label: 'Enable Notifications', desc: 'Real-time learning alerts', icon: Bell },
                        { key: 'sound_enabled', label: 'Sound Notifications', desc: 'Audio alerts for interactions', icon: Volume2 },
                        { key: 'email_notifications', label: 'Email Updates', desc: 'Progress reports via email', icon: Save },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-slate-300" />
                            </div>
                            <div>
                              <div className="text-white font-bold">{item.label}</div>
                              <div className="text-slate-500 text-xs font-medium">{item.desc}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange(item.key as keyof UserSettings, !settings?.[item.key as keyof UserSettings])}
                            className={`w-14 h-7 rounded-full transition-all duration-500 relative ${
                              settings?.[item.key as keyof UserSettings] ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-700'
                            }`}
                          >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${
                              settings?.[item.key as keyof UserSettings] ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Shield className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-xl font-bold text-white">Privacy & Security</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-slate-300" />
                          </div>
                          <div>
                            <div className="text-white font-bold">Public Profile</div>
                            <div className="text-slate-500 text-xs font-medium">Visible to other learners</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('profile_visibility', 
                            settings?.profile_visibility === 'public' ? 'private' : 'public'
                          )}
                          className={`w-14 h-7 rounded-full transition-all duration-500 relative ${
                            settings?.profile_visibility === 'public' ? 'bg-emerald-600' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${
                            settings?.profile_visibility === 'public' ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <User className="w-6 h-6 text-pink-400" />
                      <h3 className="text-xl font-bold text-white">Account Management</h3>
                    </div>
                    
                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                      <h4 className="text-red-400 font-bold mb-2 flex items-center space-x-2">
                        <Trash2 className="w-5 h-5" />
                        <span>Dangerous Area</span>
                      </h4>
                      <p className="text-slate-400 text-sm mb-6 font-medium">
                        Deleting your account will erase all your learning progress, XP, and personal settings. This action is permanent.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="w-full sm:w-auto px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/30 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full p-4 bg-slate-900 border border-red-500/30 rounded-xl text-white font-bold placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                          />
                          <div className="flex space-x-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deleteConfirmText !== 'DELETE'}
                              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold disabled:opacity-30 transition-all"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                              className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
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
