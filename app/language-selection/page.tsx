'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, languages } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { supabase } from '../../lib/supabase';
import { 
  Globe, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Save,
  AlertCircle
} from 'lucide-react';

export default function LanguageSelectionPage() {
  const { user } = useAuth();
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [baseLanguage, setBaseLanguage] = useState<string>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use languages from LanguageContext which includes isRTL
  const availableLanguages = languages;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => {
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

  // Update current language when base language changes
  useEffect(() => {
    const lang = availableLanguages.find(l => l.code === baseLanguage);
    if (lang && lang.isRTL !== undefined) {
      setCurrentLanguage(lang);
    }
  }, [baseLanguage, availableLanguages]);

  const handleSaveAndContinue = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      // Update user profile with language preferences
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          base_language: baseLanguage,
          learning_languages: selectedLanguages,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        throw new Error('Failed to update language preferences');
      }

      // Create default user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          dark_mode: true,
          notifications_enabled: true,
          sound_enabled: true,
          auto_play_audio: true,
          high_contrast: false,
          large_text: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (settingsError) {
        console.error('Error creating user settings:', settingsError);
        // Don't throw error here as it's not critical
      }

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error saving language preferences:', error);
      setError(error instanceof Error ? error.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('chooseYourLanguages')}
            </h1>
            <p className="text-white/70 text-lg">
              {t('selectInterfaceAndLearning')}
            </p>
          </div>

          {/* Base Language Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('interfaceLanguage')}
            </h2>
            <p className="text-white/70 mb-4">
              {t('interfaceLanguageDescription')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setBaseLanguage(lang.code)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    baseLanguage === lang.code
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{lang.flag}</div>
                    <div className="text-white font-medium text-sm">{lang.name}</div>
                    <div className="text-white/70 text-xs">{lang.native}</div>
                    {baseLanguage === lang.code && (
                      <Check className="w-4 h-4 text-blue-400 mx-auto mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Languages Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('learningLanguages')}
            </h2>
            <p className="text-white/70 mb-4">
              {t('learningLanguagesDescription')}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
              <p className="text-blue-300 text-sm">
                {t('learningLanguagesTip')}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageToggle(lang.code)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedLanguages.includes(lang.code)
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{lang.flag}</div>
                    <div className="text-white font-medium text-sm">{lang.name}</div>
                    <div className="text-white/70 text-xs">{lang.native}</div>
                    {selectedLanguages.includes(lang.code) && (
                      <Check className="w-4 h-4 text-green-400 mx-auto mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/70 text-sm">
                <strong>{t('selectedLanguages')}:</strong> {selectedLanguages.length} {t('languageCount')}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLanguages.map(langCode => {
                  const lang = availableLanguages.find(l => l.code === langCode);
                  return (
                    <span key={langCode} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                      {lang?.flag} {lang?.name}
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="text-white/60 text-sm mt-2">
              {t('changeLater')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-white/70 hover:text-white transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </button>
            
            <button
              onClick={handleSaveAndContinue}
              disabled={saving}
              className={`bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? t('saving') : t('saveAndContinue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            {t('dontWorry')}
          </p>
        </div>
      </div>
    </div>
  );
}
