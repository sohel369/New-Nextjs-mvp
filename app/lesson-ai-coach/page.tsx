'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LessonList from '../../components/LessonList';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function LessonAICoachPage() {
  const { user } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage.code);

  // Language options
  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' }
  ];

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Language Selector */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold text-white mb-3">Choose Learning Language</h2>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                    selectedLanguage === lang.code
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Lesson Content */}
        <LessonList 
          language={selectedLanguage} 
          isRTL={selectedLanguage === 'ar'} 
        />
      </div>
    </ProtectedRoute>
  );
}
