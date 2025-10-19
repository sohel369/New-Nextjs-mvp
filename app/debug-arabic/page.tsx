'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { languages } from '../../contexts/LanguageContext';

export default function DebugArabicPage() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Update debug info whenever language changes
    setDebugInfo({
      currentLanguage,
      isRTL,
      documentDir: typeof window !== 'undefined' ? document.documentElement.dir : 'N/A',
      documentLang: typeof window !== 'undefined' ? document.documentElement.lang : 'N/A',
      hasArabicClass: typeof window !== 'undefined' ? document.documentElement.classList.contains('arabic-layout') : false,
      hasArabicTextClass: typeof window !== 'undefined' ? document.body.classList.contains('arabic-text') : false,
      translations: {
        welcome: t('welcome'),
        readyToLearn: t('readyToLearn'),
        lessons: t('lessons'),
        quiz: t('quiz'),
        leaderboard: t('leaderboard'),
        profile: t('profile'),
        aiCoach: t('aiCoach'),
      }
    });
  }, [currentLanguage, isRTL, t]);

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      console.log('Debug: Language changed to:', language);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Arabic Language Debug Page
        </h1>

        {/* Language Switcher */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Language Switcher</h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentLanguage.code === lang.code
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name} ({lang.native})
              </button>
            ))}
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Current Language</h3>
              <p className="text-white/70">Code: {currentLanguage.code}</p>
              <p className="text-white/70">Name: {currentLanguage.name}</p>
              <p className="text-white/70">Native: {currentLanguage.native}</p>
              <p className="text-white/70">RTL: {isRTL ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">DOM Attributes</h3>
              <p className="text-white/70">Document Dir: {debugInfo.documentDir}</p>
              <p className="text-white/70">Document Lang: {debugInfo.documentLang}</p>
              <p className="text-white/70">Arabic Layout Class: {debugInfo.hasArabicClass ? 'Yes' : 'No'}</p>
              <p className="text-white/70">Arabic Text Class: {debugInfo.hasArabicTextClass ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Translation Test */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Translation Test</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Welcome:</span>
              <span className="text-white font-medium">{debugInfo.translations?.welcome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Ready to Learn:</span>
              <span className="text-white font-medium">{debugInfo.translations?.readyToLearn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Lessons:</span>
              <span className="text-white font-medium">{debugInfo.translations?.lessons}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Quiz:</span>
              <span className="text-white font-medium">{debugInfo.translations?.quiz}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Leaderboard:</span>
              <span className="text-white font-medium">{debugInfo.translations?.leaderboard}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Profile:</span>
              <span className="text-white font-medium">{debugInfo.translations?.profile}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">AI Coach:</span>
              <span className="text-white font-medium">{debugInfo.translations?.aiCoach}</span>
            </div>
          </div>
        </div>

        {/* RTL Layout Test */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">RTL Layout Test</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">1</span>
              </div>
              <span className="text-white">This is a test item with icon on the left</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">2</span>
              </div>
              <span className="text-white">Another test item with icon on the left</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">3</span>
              </div>
              <span className="text-white">Third test item with icon on the left</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <a 
            href="/dashboard" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
