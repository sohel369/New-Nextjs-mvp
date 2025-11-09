'use client';

import { useState } from 'react';
import { Globe, Check, ArrowRight, Bot, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNavigation from './BottomNavigation';

interface AICoachLanguageSelectorProps {
  onLanguageSelect: (language: 'en' | 'ar') => void;
}

export default function AICoachLanguageSelector({ onLanguageSelect }: AICoachLanguageSelectorProps) {
  const t = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | null>(null);

  const languages = [
    {
      code: 'en' as const,
      name: 'English',
      native: 'English',
      flag: '🇺🇸',
      description: 'Practice with AI coach in English',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      code: 'ar' as const,
      name: 'Arabic',
      native: 'العربية',
      flag: '🇸🇦',
      description: 'تدرب مع المدرب الذكي باللغة العربية',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    }
  ];

  const handleLanguageSelect = (language: 'en' | 'ar') => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 pb-20 sm:pb-24">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            {t('aiCoach')} 🤖
          </h1>
          <p className="text-white/70 text-base sm:text-lg">
            Choose your practice language to start your AI coaching session
          </p>
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedLanguage === lang.code
                  ? 'border-purple-500 bg-purple-500/20 scale-105'
                  : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
              }`}
              dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{lang.flag}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{lang.name}</h3>
                <p className="text-white/70 text-sm mb-3 sm:mb-4">{lang.native}</p>
                <p className="text-white/60 text-xs">{lang.description}</p>
                
                {selectedLanguage === lang.code && (
                  <div className="flex items-center justify-center mt-3 sm:mt-4">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center">
            What you'll get with AI Coach:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-white/80 text-xs sm:text-sm">Interactive conversations</span>
            </div>
            <div className="flex items-center space-x-3">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-white/80 text-xs sm:text-sm">Personalized feedback</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-white/80 text-xs sm:text-sm">Language-specific practice</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white/80 text-xs sm:text-sm">Progress tracking</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className={`w-full bg-gradient-to-r ${
              selectedLanguage 
                ? 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                : 'from-gray-600 to-gray-700 cursor-not-allowed'
            } text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3`}
          >
            <span className="text-sm sm:text-base">Continue to AI Coach</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {!selectedLanguage && (
            <p className="text-white/50 text-xs sm:text-sm mt-2 sm:mt-3">
              Please select a language to continue
            </p>
          )}
        </div>

        {/* Language Info */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <div className="text-blue-400 font-medium text-xs sm:text-sm mb-2">💡 Tip:</div>
          <p className="text-blue-300 text-xs sm:text-sm">
            You can switch between languages anytime during your session. 
            The AI coach will adapt to your selected language for the best learning experience.
          </p>
        </div>
      </div>
      
      {/* Bottom Navigation - Fixed */}
      <div className="flex-shrink-0">
        <BottomNavigation />
      </div>
    </div>
  );
}
