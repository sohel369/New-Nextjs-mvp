'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserCircle, Bot, ArrowRight, Check, Globe } from 'lucide-react';

export default function TestNavigationPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | null>(null);

  const handleLanguageSelect = (language: 'en' | 'ar') => {
    setSelectedLanguage(language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Navigation & AI Coach Test
          </h1>

          {/* Profile Icon Test */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <UserCircle className="w-6 h-6 mr-2" />
              Profile Icon Navigation
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Profile Icon</div>
                <div className="text-white/70 text-sm">Click to navigate to profile page</div>
              </div>
              <Link
                href="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Test Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* AI Coach Language Selection Test */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Bot className="w-6 h-6 mr-2" />
              AI Coach Language Selection
            </h2>
            <p className="text-white/70 mb-6">
              Test the language selection for AI coach (English or Arabic)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === 'en'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/10 hover:border-white/40'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇺🇸</div>
                  <div className="text-white font-semibold">English</div>
                  <div className="text-white/70 text-sm">Practice with AI coach in English</div>
                  {selectedLanguage === 'en' && (
                    <div className="flex items-center justify-center mt-2">
                      <Check className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleLanguageSelect('ar')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === 'ar'
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-white/20 bg-white/10 hover:border-white/40'
                }`}
                dir="rtl"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇸🇦</div>
                  <div className="text-white font-semibold">Arabic</div>
                  <div className="text-white/70 text-sm">تدرب مع المدرب الذكي باللغة العربية</div>
                  {selectedLanguage === 'ar' && (
                    <div className="flex items-center justify-center mt-2">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {selectedLanguage && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">
                    Language Selected: {selectedLanguage === 'en' ? 'English' : 'Arabic'}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/ai-coach"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Bot className="w-5 h-5" />
              <span>Test AI Coach</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Navigation Test */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Navigation Test
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
              >
                Home
              </Link>
              <Link
                href="/profile"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
              >
                Profile
              </Link>
              <Link
                href="/ai-coach"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
              >
                AI Coach
              </Link>
              <Link
                href="/test-notifications"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
              >
                Notifications
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-4">Test Instructions:</h3>
            <ul className="text-yellow-300 text-sm space-y-2">
              <li>• Click the profile icon in the header to navigate to profile page</li>
              <li>• Visit AI coach to see the language selection interface</li>
              <li>• Test both English and Arabic language selection</li>
              <li>• Verify that the AI coach adapts to the selected language</li>
              <li>• Check that you can change languages during the session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}