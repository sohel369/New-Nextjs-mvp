'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LANGUAGE_CONFIG } from '../../data/quizSystemData';

const QuizDemoPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            🌍 Language Learning Quiz System
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8">
            Interactive, responsive, and feature-rich language learning experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz-system"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-4 px-8 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              🚀 Try the Quiz System
            </Link>
            <Link
              href="/"
              className="bg-white/20 text-white text-lg font-semibold py-4 px-8 rounded-2xl hover:bg-white/30 transition-all duration-300"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Core Features */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-3">Three Difficulty Levels</h3>
            <p className="text-blue-200 text-sm">
              Easy, Medium, and Hard questions to match your learning level
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-white mb-3">7 Languages</h3>
            <p className="text-blue-200 text-sm">
              English, Arabic (RTL), Dutch, Indonesian, Malay, Thai, Khmer
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-3xl mb-4">🔊</div>
            <h3 className="text-xl font-bold text-white mb-3">Audio Pronunciation</h3>
            <p className="text-blue-200 text-sm">
              High-quality TTS with language-specific settings
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-3xl mb-4">🎊</div>
            <h3 className="text-xl font-bold text-white mb-3">Confetti Feedback</h3>
            <p className="text-blue-200 text-sm">
              Visual celebrations for correct answers and achievements
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-3">XP & Streaks</h3>
            <p className="text-blue-200 text-sm">
              Gamified learning with points, levels, and streaks
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-white mb-3">PWA Support</h3>
            <p className="text-blue-200 text-sm">
              Install as app, works offline, responsive design
            </p>
          </div>
        </div>

        {/* Language Showcase */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Supported Languages
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
              <div
                key={code}
                className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  selectedLanguage === code
                    ? 'bg-blue-500 text-white transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onClick={() => setSelectedLanguage(code)}
              >
                <div className="text-3xl mb-2">{config.flag}</div>
                <div className="font-semibold text-sm">{config.name}</div>
                <div className="text-xs opacity-80" dir={config.isRTL ? 'rtl' : 'ltr'}>
                  {config.native}
                </div>
                {config.isRTL && (
                  <div className="text-xs text-yellow-300 mt-1">RTL Support</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Technical Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🎤 Bonus Features</h3>
              <ul className="space-y-2 text-blue-200">
                <li>• AI Pronunciation Coach</li>
                <li>• Adaptive Difficulty System</li>
                <li>• Multiple Confetti Types</li>
                <li>• Achievement System</li>
                <li>• Progress Analytics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🛠️ Technology Stack</h3>
              <ul className="space-y-2 text-blue-200">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Web Speech API for TTS</li>
                <li>• Service Worker for PWA</li>
                <li>• localStorage for persistence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Quiz System Stats
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">100+</div>
              <div className="text-sm text-blue-200">Questions per Language</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">7</div>
              <div className="text-sm text-blue-200">Supported Languages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400">3</div>
              <div className="text-sm text-blue-200">Difficulty Levels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400">100%</div>
              <div className="text-sm text-blue-200">Mobile Responsive</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-200 mb-6">
              Experience the most comprehensive language learning quiz system
            </p>
            <Link
              href="/quiz-system"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block"
            >
              🚀 Launch Quiz System
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200">
          <p>Built with ❤️ for language learners worldwide</p>
          <p className="text-sm mt-2">Responsive • Offline-Ready • PWA • Multi-language</p>
        </div>
      </div>
    </div>
  );
};

export default QuizDemoPage;
