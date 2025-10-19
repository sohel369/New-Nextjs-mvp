'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { languages } from '../../contexts/LanguageContext';

export default function TestArabicStabilityPage() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      addTestResult(`Switching to ${language.name} (${languageCode})`);
      setCurrentLanguage(language);
      
      // Test visibility after language change
      setTimeout(() => {
        const dashboard = document.querySelector('.dashboard-container');
        const isVisible = dashboard && 
          window.getComputedStyle(dashboard).visibility !== 'hidden' &&
          window.getComputedStyle(dashboard).opacity !== '0';
        
        addTestResult(`Dashboard visibility after switch: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
      }, 100);
    }
  };

  useEffect(() => {
    addTestResult(`Page loaded with language: ${currentLanguage.name}`);
    addTestResult(`RTL mode: ${isRTL ? 'ON' : 'OFF'}`);
  }, []);

  useEffect(() => {
    addTestResult(`Language changed to: ${currentLanguage.name} (RTL: ${isRTL})`);
  }, [currentLanguage, isRTL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Arabic Language Stability Test
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

        {/* Dashboard Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20 dashboard-container" style={{ visibility: 'visible', opacity: 1 }}>
          <h2 className="text-xl font-semibold text-white mb-4">Dashboard Preview</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">
                {t('welcome')}! 👋
              </h3>
              <p className="text-white/80">
                {t('readyToLearn')}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-white/70 text-sm">{t('dayStreak')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-white/70 text-sm">{t('totalXP')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-white/70 text-sm">{t('level')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-white/80 text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a 
            href="/dashboard" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4"
          >
            Back to Dashboard
          </a>
          <a 
            href="/debug-arabic" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Debug Page
          </a>
        </div>
      </div>
    </div>
  );
}
