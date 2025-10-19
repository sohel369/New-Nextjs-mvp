'use client';

import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageLessons from '../../components/LanguageLessons';
import { Globe, Check, ArrowRight } from 'lucide-react';

export default function TestLessonsMultiLangPage() {
  const { currentLanguage } = useLanguage();
  const [testLanguages, setTestLanguages] = useState<string[]>(['en', 'ar']);
  const [showTest, setShowTest] = useState(false);

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾', native: 'Bahasa Melayu' },
    { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭', native: 'ខ្មែរ' }
  ];

  const handleLanguageToggle = (langCode: string) => {
    setTestLanguages(prev => {
      if (prev.includes(langCode)) {
        if (prev.length > 1) {
          return prev.filter(lang => lang !== langCode);
        }
        return prev;
      } else {
        return [...prev, langCode];
      }
    });
  };

  const handleStartTest = () => {
    setShowTest(true);
  };

  if (showTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowTest(false)}
              className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span>Back to Setup</span>
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">🧪 Test Mode</div>
              <div className="text-sm text-gray-300">Multi-Language Lessons</div>
            </div>
          </div>
          
          <LanguageLessons 
            userLearningLanguages={testLanguages}
            onLessonComplete={(lessonId, xp) => {
              console.log('Test: Lesson completed:', lessonId, 'XP earned:', xp);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🧪 Multi-Language Lessons Test</h1>
          <p className="text-white/70 text-lg">
            Test the enhanced lessons functionality with multiple languages
          </p>
        </div>

        {/* Current Language Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Current Language Context</h2>
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{currentLanguage.flag}</span>
            <div>
              <div className="text-lg font-medium text-white">{currentLanguage.name}</div>
              <div className="text-white/70">{currentLanguage.native}</div>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Select Test Languages</h2>
          <p className="text-white/70 mb-6">
            Choose which languages to test in the lessons. You'll see separate tabs for each selected language.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageToggle(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  testLanguages.includes(lang.code)
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-white/20 bg-white/10 hover:border-white/40'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="text-white font-medium text-sm">{lang.name}</div>
                  <div className="text-white/70 text-xs">{lang.native}</div>
                  {testLanguages.includes(lang.code) && (
                    <Check className="w-4 h-4 text-green-400 mx-auto mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="text-white/60 text-sm">
            Selected: {testLanguages.length} language(s) - {testLanguages.map(lang => {
              const langInfo = availableLanguages.find(l => l.code === lang);
              return langInfo ? `${langInfo.flag} ${langInfo.name}` : lang;
            }).join(', ')}
          </div>
        </div>

        {/* Test Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Test Features</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Separate Language Tabs</div>
                <div className="text-white/70 text-sm">Each selected language gets its own tab with progress tracking</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Language-Specific Audio</div>
                <div className="text-white/70 text-sm">Audio plays in the correct language when switching between tabs</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Audio Language Indicators</div>
                <div className="text-white/70 text-sm">Clear indicators show which language the audio is in</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Progress Tracking</div>
                <div className="text-white/70 text-sm">Each language tab shows completion progress independently</div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Test Button */}
        <div className="text-center">
          <button
            onClick={handleStartTest}
            disabled={testLanguages.length === 0}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-3 mx-auto"
          >
            <Globe className="w-5 h-5" />
            <span>Start Multi-Language Test</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
