'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Brain, 
  Target, 
  Star, 
  Bell,
  User,
  Settings,
  Globe,
  LogOut,
  Flame,
  ChevronRight
} from 'lucide-react';

export default function TestDashboardPage() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English', country: 'US' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', native: 'العربية', country: 'SA' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands', country: 'NL' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia', country: 'ID' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾', native: 'Bahasa Melayu', country: 'MY' },
    { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย', country: 'TH' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭', native: 'ខ្មែរ', country: 'KH' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">LinguaAI</h1>
              <p className="text-white/70 text-sm">Smart Language Learning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Globe className="w-6 h-6 text-white/70 hover:text-white transition-colors cursor-pointer" />
            <div className="relative">
              <Bell className="w-6 h-6 text-white/70 hover:text-white transition-colors cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </div>
            <Users className="w-6 h-6 text-white/70 hover:text-white transition-colors cursor-pointer" />
            <Settings className="w-6 h-6 text-white/70 hover:text-white transition-colors cursor-pointer" />
            <div className="relative">
              <LogOut className="w-6 h-6 text-white/70 hover:text-white transition-colors cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-4 pb-24 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Welcome back! 👋
                  </h2>
                  <p className="text-white/80 text-lg">
                    Ready to continue learning?
                  </p>
                </div>
                
                {/* Language Toggle */}
                <div className="flex items-center space-x-3">
                  <div className="flex bg-white/20 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentLanguage('en')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentLanguage.code === 'en' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      US English
                    </button>
                    <button
                      onClick={() => setCurrentLanguage('ar')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentLanguage.code === 'ar' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      SA العربية
                    </button>
                  </div>
                  <Settings className="w-5 h-5 text-white/70" />
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-white/70 text-sm">Day Streak</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-white/70 text-sm">Total XP</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1</div>
                  <div className="text-white/70 text-sm">Level</div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Language Selection Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Select Language</h3>
            </div>
            <p className="text-white/70 text-sm mb-6">
              Choose your preferred language for the app interface
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLanguage(lang.code)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentLanguage === lang.code
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-1">{lang.country}</div>
                    <div className="text-sm text-white/80">{lang.native}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/lessons"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-lg">Continue Lesson</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/ai-coach"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
            >
              <Brain className="w-6 h-6" />
              <span className="text-lg">AI Coach</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/lessons"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Lessons</div>
                  <div className="text-white/70 text-sm">Start learning</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/70 text-sm">Completed</div>
            </Link>

            <Link
              href="/quiz"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Quiz</div>
                  <div className="text-white/70 text-sm">Test yourself</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/70 text-sm">Completed</div>
            </Link>

            <Link
              href="/leaderboard"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Leaderboard</div>
                  <div className="text-white/70 text-sm">See rankings</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">#1</div>
              <div className="text-white/70 text-sm">Your rank</div>
            </Link>

            <Link
              href="/ai-coach"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">AI Coach</div>
                  <div className="text-white/70 text-sm">Get help</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/70 text-sm">Sessions</div>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 z-50">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center space-y-1 p-2 text-white">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
            </div>
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link href="/lessons" className="flex flex-col items-center space-y-1 p-2 text-slate-400 hover:text-white">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Lessons</span>
          </Link>
          
          <Link href="/quiz" className="flex flex-col items-center space-y-1 p-2 text-slate-400 hover:text-white">
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">Quiz</span>
          </Link>
          
          <Link href="/ai-coach" className="flex flex-col items-center space-y-1 p-2 text-slate-400 hover:text-white">
            <Brain className="w-6 h-6" />
            <span className="text-xs font-medium">AI Coach</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center space-y-1 p-2 text-slate-400 hover:text-white">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
