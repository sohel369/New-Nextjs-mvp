'use client';

import { useState } from 'react';
import { useLanguage, languages } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Globe, Check, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function TestLanguageIntegrationPage() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const [showRTLDemo, setShowRTLDemo] = useState(false);

  const handleLanguageSelect = (language: any) => {
    setCurrentLanguage(language);
  };

  const arabicDiacriticsDemo = {
    welcome: 'مَرْحَباً بِعُودَتِكَ',
    learning: 'تَعَلُّم اللُّغَةِ',
    practice: 'مُمَارَسَةٌ',
    lesson: 'دَرْسٌ',
    quiz: 'اِخْتِبَارٌ',
    progress: 'تَقَدُّمٌ',
    achievement: 'إِنْجَازٌ',
    level: 'مُسْتَوَى',
    streak: 'سِلْسِلَةٌ',
    points: 'نِقَاطٌ',
    coach: 'مُدَرِّبٌ',
    smart: 'ذَكِيٌّ',
    artificial: 'اِصْطِنَاعِيٌّ',
    intelligence: 'ذَكَاءٌ'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Language Integration Test
          </h1>

          {/* Current Language Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Current Language Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <div className="text-blue-400 font-medium mb-2">Selected Language</div>
                <div className="text-white text-lg">{currentLanguage.name}</div>
                <div className="text-white/70 text-sm">{currentLanguage.native}</div>
              </div>
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <div className="text-green-400 font-medium mb-2">Direction</div>
                <div className="text-white text-lg">{isRTL ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)'}</div>
                <div className="text-white/70 text-sm">{isRTL ? 'العربية' : 'English'}</div>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
                <div className="text-purple-400 font-medium mb-2">Language Code</div>
                <div className="text-white text-lg">{currentLanguage.code}</div>
                <div className="text-white/70 text-sm">ISO Code</div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Available Languages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    currentLanguage.code === lang.code
                      ? 'border-blue-500 bg-blue-500/20 scale-105'
                      : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                  }`}
                  dir={lang.isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <div className="text-white font-semibold text-sm mb-1">{lang.name}</div>
                    <div className="text-white/70 text-xs">{lang.native}</div>
                    {currentLanguage.code === lang.code && (
                      <div className="flex items-center justify-center mt-2">
                        <Check className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Translation Test */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Translation Test
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Key Translations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Welcome:</span>
                    <span className="text-white font-medium">{t('welcome')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Ready to Learn:</span>
                    <span className="text-white font-medium">{t('readyToLearn')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Start Journey:</span>
                    <span className="text-white font-medium">{t('startJourney')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">AI Coach:</span>
                    <span className="text-white font-medium">{t('aiCoach')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Select Language:</span>
                    <span className="text-white font-medium">{t('selectLanguage')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Navigation Items</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Home:</span>
                    <span className="text-white font-medium">{t('home')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Lessons:</span>
                    <span className="text-white font-medium">{t('lessons')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Quiz:</span>
                    <span className="text-white font-medium">{t('quiz')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Profile:</span>
                    <span className="text-white font-medium">{t('profile')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Settings:</span>
                    <span className="text-white font-medium">{t('settings')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arabic Diacritics Demo */}
          {currentLanguage.code === 'ar' && (
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Arabic Diacritics Demo
                </h2>
                <button
                  onClick={() => setShowRTLDemo(!showRTLDemo)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {showRTLDemo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showRTLDemo ? 'Hide' : 'Show'} Demo</span>
                </button>
              </div>
              
              {showRTLDemo && (
                <div className="space-y-4">
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <h3 className="text-green-400 font-medium mb-3">Enhanced Arabic Text with Diacritics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(arabicDiacriticsDemo).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-white/70 capitalize">{key}:</span>
                          <span className="text-white font-medium text-lg" dir="rtl">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-3">RTL Layout Features</h3>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>• Text flows from right to left</li>
                      <li>• Form inputs align to the right</li>
                      <li>• Navigation elements reverse order</li>
                      <li>• Spacing and margins adapt automatically</li>
                      <li>• Font family optimized for Arabic text</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RTL Layout Test */}
          {isRTL && (
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                RTL Layout Test
              </h2>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">1</span>
                    </div>
                    <span className="text-white">First Item</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">2</span>
                    </div>
                    <span className="text-white">Second Item</span>
                  </div>
                </div>
                <div className="text-white/70 text-sm">
                  Notice how the layout adapts to RTL direction. In Arabic, items flow from right to left.
                </div>
              </div>
            </div>
          )}

          {/* Test Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-4">Test Instructions:</h3>
            <ul className="text-yellow-300 text-sm space-y-2">
              <li>• Click on different language options to test switching</li>
              <li>• Notice how Arabic switches to RTL layout</li>
              <li>• Check that all translations work correctly</li>
              <li>• Test the signup page with the new language list</li>
              <li>• Verify that Arabic diacritics display properly</li>
              <li>• Test the AI coach language selection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
