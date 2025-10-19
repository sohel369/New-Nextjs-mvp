'use client';

import { useState } from 'react';
import { useLanguage, languages } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Globe, Check, ArrowRight } from 'lucide-react';

export default function TestLanguageSwitchingPage() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Helper function to safely translate language names
  const translateLanguageName = (name: string): string => {
    const key = name.toLowerCase();
    try {
      const translation = t(key as any);
      // If translation returns the same key, it means the translation doesn't exist
      return translation !== key ? translation : name;
    } catch {
      // Fallback to original name if translation fails
      return name;
    }
  };

  const handleLanguageChange = (language: any) => {
    console.log('Changing language to:', language);
    setCurrentLanguage(language);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('selectLanguage')} 🌍
            </h1>
            <p className="text-white/70">
              {t('readyToLearn')} - {currentLanguage.name}
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 mb-6 flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Language changed to {currentLanguage.name}!</span>
            </div>
          )}

          {/* Current Language Display */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Current Language</h2>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentLanguage.flag}</div>
              <div>
                <div className="text-lg font-semibold text-white">{currentLanguage.name}</div>
                <div className="text-sm text-white/70">{currentLanguage.native}</div>
                <div className="text-xs text-white/50">Direction: {isRTL ? 'RTL' : 'LTR'}</div>
              </div>
            </div>
          </div>

          {/* Language Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  currentLanguage.code === lang.code
                    ? 'border-blue-500 bg-blue-500/20 scale-105'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:scale-105'
                }`}
                dir={lang.isRTL ? 'rtl' : 'ltr'}
              >
                <div className="text-3xl mb-3">{lang.flag}</div>
                <div className="text-sm font-medium text-white mb-1">
                  {translateLanguageName(lang.name)}
                </div>
                <div className="text-xs text-white/70">{lang.native}</div>
                {currentLanguage.code === lang.code && (
                  <div className="flex items-center justify-center mt-2">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Translation Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Home:</span>
                  <span className="text-white">{t('home')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Lessons:</span>
                  <span className="text-white">{t('lessons')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Quiz:</span>
                  <span className="text-white">{t('quiz')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Profile:</span>
                  <span className="text-white">{t('profile')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Common Actions</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Continue:</span>
                  <span className="text-white">{t('continue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Next:</span>
                  <span className="text-white">{t('next')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Save:</span>
                  <span className="text-white">{t('save')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Cancel:</span>
                  <span className="text-white">{t('cancel')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">Test Instructions:</h3>
            <ol className="text-blue-300 text-sm space-y-1">
              <li>1. Click on any language flag to switch the interface language</li>
              <li>2. Notice how all text changes immediately</li>
              <li>3. Check the document direction (RTL for Arabic)</li>
              <li>4. Navigate to other pages to see global translation</li>
              <li>5. Refresh the page to see language persistence</li>
            </ol>
          </div>

          {/* Language Info */}
          <div className="mt-6 p-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">Language Information:</h3>
            <div className="text-yellow-300 text-sm space-y-1">
              <div><strong>Current Language:</strong> {currentLanguage.name} ({currentLanguage.code})</div>
              <div><strong>Native Name:</strong> {currentLanguage.native}</div>
              <div><strong>Direction:</strong> {isRTL ? 'Right-to-Left' : 'Left-to-Right'}</div>
              <div><strong>Flag:</strong> {currentLanguage.flag}</div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              <span>{t('back')}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
