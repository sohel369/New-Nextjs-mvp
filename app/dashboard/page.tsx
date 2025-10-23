'use client';

import { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalNotifications } from '../../hooks/useGlobalNotifications';
import { languages } from '../../contexts/LanguageContext';
import { NotificationBell } from '../../components/NotificationBell';
import BottomNavigation from '../../components/BottomNavigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardNotificationPopup from '../../components/DashboardNotificationPopup';
import SettingsModal from '../../components/SettingsModal';
import Layout from '../../components/Layout';

export default function DashboardPage() {
  const { user, loading, authChecked } = useAuth();
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const { settings } = useSettings();
  const { showNotificationWithSound } = useGlobalNotifications();
  const t = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      console.log('Dashboard: Language changed to:', language);
      console.log('Dashboard: isRTL:', language.isRTL);
      console.log('Dashboard: document.dir:', document.documentElement.dir);
      console.log('Dashboard: document.lang:', document.documentElement.lang);
    }
  };

  // Function to show notification popup
  const showNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setCurrentNotification({ title, message, type });
    setShowNotificationPopup(true);
    
    // Also show browser notification if enabled
    if (settings?.notifications_enabled) {
      showNotificationWithSound({
        title,
        body: message,
        icon: '/favicon.ico',
        tag: `dashboard-${type}`,
        requireInteraction: type === 'error' || type === 'warning',
      });
    }
  };

  // Debug language changes
  useEffect(() => {
    console.log('Dashboard: Current language:', currentLanguage);
    console.log('Dashboard: isRTL:', isRTL);
    console.log('Dashboard: document.dir:', document.documentElement.dir);
    console.log('Dashboard: document.lang:', document.documentElement.lang);
  }, [currentLanguage, isRTL]);

  // Simulate notifications for demonstration
  useEffect(() => {
    // Show welcome notification after 2 seconds
    const welcomeTimer = setTimeout(() => {
      showNotification(
        'Welcome to LinguaAI! 🎉',
        'Start your language learning journey with personalized lessons and AI-powered guidance.',
        'success'
      );
    }, 2000);

    // Show daily reminder after 8 seconds
    const reminderTimer = setTimeout(() => {
      showNotification(
        'Daily Learning Reminder ⏰',
        'Keep your streak alive! Complete a lesson today to maintain your progress.',
        'info'
      );
    }, 8000);

    // Show achievement notification after 15 seconds
    const achievementTimer = setTimeout(() => {
      showNotification(
        'Achievement Unlocked! 🏆',
        'Congratulations! You\'ve completed your first lesson. Keep up the great work!',
        'success'
      );
    }, 15000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(reminderTimer);
      clearTimeout(achievementTimer);
    };
  }, []);

  // Show loading only if auth hasn't been checked yet
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-x-hidden relative w-full dashboard-container" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Responsive Header */}
        <header className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg sm:text-xl font-bold text-white">LinguaAI</h1>
                  <p className="text-white/70 text-xs sm:text-sm hidden sm:block">Smart Language Learning</p>
                </div>
              </div>
              
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'}`}>
                <button
                  onClick={() => showNotification(
                    'Test Notification 🔔',
                    'This is a test notification to demonstrate the popup functionality.',
                    'info'
                  )}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-lg text-xs transition-colors"
                >
                  Test
                </button>
                <NotificationBell />
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="text-white/70 hover:text-white transition-colors p-2"
                >
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <Link href="/profile" className="text-white/70 hover:text-white transition-colors p-2">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white">LinguaAI</h1>
                  <p className="text-white/70 text-sm">Smart Language Learning</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Language Tabs */}
                <div className="flex bg-white/10 rounded-lg p-1" dir="ltr">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      currentLanguage.code === 'en' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      currentLanguage.code === 'ar' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🇸🇦</span>
                    <span>العربية</span>
                  </button>
                </div>
                
                <button
                  onClick={() => showNotification(
                    'Test Notification 🔔',
                    'This is a test notification to demonstrate the popup functionality.',
                    'info'
                  )}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Test Notify
                </button>
                <Globe className="w-6 h-6 text-white/70 hover:text-white transition-colors cursor-pointer" />
                <NotificationBell />
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>
                <Link href="/profile" className="text-white/70 hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Mobile Language Selector */}
            <div className="lg:hidden mt-3 sm:mt-4" dir="ltr">
              <div className="flex bg-white/10 rounded-lg p-1 overflow-x-auto scrollbar-hide">
                {languages.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} ${
                      currentLanguage.code === lang.code 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 pb-16 sm:pb-20 w-full">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 w-full">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                    {t('welcome')}! 👋
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                    {t('readyToLearn')}
                  </p>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-400" />
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-xs sm:text-sm">{t('dayStreak')}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" />
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-xs sm:text-sm">{t('totalXP')}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">1</div>
                    <div className="text-white/70 text-xs sm:text-sm">{t('level')}</div>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -translate-y-8 sm:-translate-y-12 lg:-translate-y-16 translate-x-8 sm:translate-x-12 lg:translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-white/5 rounded-full translate-y-6 sm:translate-y-9 lg:translate-y-12 -translate-x-6 sm:-translate-x-9 lg:-translate-x-12"></div>
            </div>

            {/* Language Selection Section - Desktop Only */}
            <div className="hidden lg:block bg-slate-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10" dir="ltr">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h3 className="text-lg sm:text-xl font-semibold text-white">{t('selectLanguage')}</h3>
              </div>
              <p className="text-white/70 text-sm mb-4 sm:mb-6">
                {t('chooseLanguageDescription')}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      currentLanguage.code === lang.code
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm sm:text-base lg:text-lg font-semibold mb-1">{lang.name}</div>
                      <div className="text-xs sm:text-sm text-white/80">{lang.native}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              <Link
                href="/lessons"
                className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 sm:py-5 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} shadow-lg hover:shadow-xl group`}
              >
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base lg:text-lg">{t('continue')} {t('lessons')}</span>
                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
              
        <Link
          href="/lessons"
          className={`bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 sm:py-5 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} shadow-lg hover:shadow-xl group`}
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base lg:text-lg">Interactive Lessons</span>
          <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
        </Link>
        
        <Link
          href="/lesson-ai-coach"
          className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 sm:py-5 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} shadow-lg hover:shadow-xl group`}
        >
          <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base lg:text-lg">Lesson & AI Coach</span>
          <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
        </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
              <Link
                href="/lessons"
                className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} mb-2 sm:mb-3`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <div className={`min-w-0 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="text-white font-semibold text-sm sm:text-base truncate">{t('lessons')}</div>
                    <div className="text-white/70 text-xs sm:text-sm truncate">Start learning</div>
                  </div>
                </div>
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>0</div>
                <div className={`text-white/70 text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('completed')}</div>
              </Link>

              <Link
                href="/quiz"
                className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} mb-2 sm:mb-3`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  </div>
                  <div className={`min-w-0 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="text-white font-semibold text-sm sm:text-base truncate">{t('quiz')}</div>
                    <div className="text-white/70 text-xs sm:text-sm truncate">{t('testYourself')}</div>
                  </div>
                </div>
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>0</div>
                <div className={`text-white/70 text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('completed')}</div>
              </Link>

              <Link
                href="/leaderboard"
                className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} mb-2 sm:mb-3`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                  <div className={`min-w-0 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="text-white font-semibold text-sm sm:text-base truncate">{t('leaderboard')}</div>
                    <div className="text-white/70 text-xs sm:text-sm truncate">{t('seeRankings')}</div>
                  </div>
                </div>
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>#1</div>
                <div className={`text-white/70 text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('yourRank')}</div>
              </Link>

              <Link
                href="/ai-coach"
                className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'} mb-2 sm:mb-3`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                  </div>
                  <div className={`min-w-0 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="text-white font-semibold text-sm sm:text-base truncate">{t('aiCoach')}</div>
                    <div className="text-white/70 text-xs sm:text-sm truncate">{t('getHelp')}</div>
                  </div>
                </div>
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>0</div>
                <div className={`text-white/70 text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('sessions')}</div>
              </Link>
            </div>
          </div>
        </main>
        
        {/* Bottom Navigation - Fixed */}
        <div className="flex-shrink-0">
          <BottomNavigation />
        </div>
        
        {/* Dashboard Notification Popup */}
        {currentNotification && (
          <DashboardNotificationPopup
            show={showNotificationPopup}
            onClose={() => setShowNotificationPopup(false)}
            title={currentNotification.title}
            message={currentNotification.message}
            type={currentNotification.type}
          />
        )}
        
        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
        
      </div>
    </ProtectedRoute>
  );
}