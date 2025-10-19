'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Award, 
  Star, 
  Flame, 
  Settings, 
  LogOut, 
  Edit3,
  Trophy,
  Users,
  Target,
  Crown,
  Zap,
  Globe,
  ChevronDown,
  Check,
  Bell,
  Volume2,
  Type,
  Sun,
  Moon,
  Monitor,
  Play,
  Home,
  BookOpen,
  Bot
} from 'lucide-react';
import LiveLeaderboard from '../../components/LiveLeaderboard';
import UserSettings from '../../components/UserSettings';
import ProfileSettings from '../../components/ProfileSettings';
import QuizHistoryComponent from '../../components/QuizHistory';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import ResponsiveTabs, { TabItem } from '../../components/ResponsiveTabs';
import { supabase } from '../../lib/supabase';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'US English' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', native: 'SA العربية' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', native: 'NL Nederlands' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', native: 'TH ไทย' },
  { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭', native: 'KH ខ្មែរ' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', native: 'ID Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', native: 'MY Bahasa Melayu' }
];

const achievements = [
  {
    id: 1,
    name: 'Quick Learner',
    description: 'Complete 10 lessons in one day',
    icon: Zap,
    unlocked: false,
    color: 'text-yellow-400'
  },
  {
    id: 2,
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    unlocked: false,
    color: 'text-orange-400'
  },
  {
    id: 3,
    name: 'Vocabulary Champion',
    description: 'Learn 300+ words',
    icon: Crown,
    unlocked: false,
    color: 'text-purple-400'
  },
  {
    id: 4,
    name: 'Perfect Score',
    description: 'Get 100% in 5 lessons',
    icon: Star,
    unlocked: false,
    color: 'text-blue-400'
  },
  {
    id: 5,
    name: 'Social Butterfly',
    description: 'Join the leaderboard',
    icon: Users,
    unlocked: false,
    color: 'text-green-400'
  }
];

const leaderboardData = [
  { rank: 1, name: 'Ahmed', xp: 2500, streak: 15, avatar: 'A' },
  { rank: 2, name: 'Sarah', xp: 2200, streak: 12, avatar: 'S' },
  { rank: 3, name: 'Muhammad', xp: 1800, streak: 8, avatar: 'M' },
  { rank: 4, name: 'Fatima', xp: 1600, streak: 7, avatar: 'F' },
  { rank: 5, name: 'Ali', xp: 1400, streak: 6, avatar: 'A' }
];

export default function ProfilePage() {
  const { user, signOut, refreshUser, loading } = useAuth();
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const { settings, updateSetting } = useAccessibility();

  const [currentTab, setCurrentTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [tabLoading, setTabLoading] = useState(false);
  
  // Update editName when user changes
  useEffect(() => {
    setEditName(user?.name || '');
  }, [user?.name]);

  // Auto-create profile if user exists but has no name
  useEffect(() => {
    if (user && user.id && user.email && (!user.name || user.name === 'Guest')) {
      console.log('User has no name, attempting to create profile...');
      createUserProfile();
    }
  }, [user]);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showInterfaceLanguage, setShowInterfaceLanguage] = useState(false);
  

  const handleSaveName = async () => {
    if (!user || !editName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: editName.trim() })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating name:', error);
        return;
      }

      // Update local user state
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  const createUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.email?.split('@')[0] || 'User',
          email: user.email || ''
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Profile created successfully:', result);
        await refreshUser();
        alert('Profile created successfully!');
      } else {
        console.error('Error creating profile:', result.error);
        alert('Error creating profile: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const updateUserLanguages = async (nativeLang: string, learningLang: string) => {
    if (!user) return;
    
    try {
      // Use public.profiles table (correct approach)
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'User',
          email: user.email,
          native_language: nativeLang,
          learning_language: learningLang
        })
        .select();

      if (error) {
        console.error('Error updating languages in profiles table:', error);
        alert('Error updating languages: ' + error.message);
        return;
      }

      console.log('Languages updated successfully in profiles table:', data);
      await refreshUser();
      alert('Languages updated successfully!');
    } catch (error) {
      console.error('Error updating languages:', error);
      alert('Error updating languages: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const handleInterfaceLanguageChange = (langCode: string) => {
    setShowInterfaceLanguage(false);
    // Handle interface language change
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === currentTab) return;
    
    setTabLoading(true);
    setCurrentTab(tabId);
    
    // Simulate a small delay for smooth transition
    setTimeout(() => {
      setTabLoading(false);
    }, 100);
  };


  const testNotification = (type: string) => {
    // Handle test notification
    console.log(`Testing ${type} notification`);
    // You would implement actual notification testing here
  };

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-16 sm:pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        
        {/* Glassmorphism Header */}
        <div className="relative backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
              {/* Premium Logo Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <span className="text-white font-bold text-xl">L</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">LinguaAI</h1>
                  <p className="text-sm text-white/60 font-medium">Smart Language Learning</p>
            </div>
          </div>
          
              {/* Premium User Info and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Streak Badge */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full">
              <Flame className="w-5 h-5 text-orange-400" />
                      <span className="text-white font-bold text-sm">{user?.streak || 0}</span>
            </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-sm -z-10"></div>
                  </div>
                  
                  {/* User Avatar */}
                  <div className="relative group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
                  </div>
                  
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{user?.name || 'User'}</div>
                    <div className="text-white/60 text-xs hidden sm:block">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
                
                {/* Premium Action Buttons */}
                <div className="flex flex-wrap gap-2">
            <button
                    onClick={() => setShowInterfaceLanguage(!showInterfaceLanguage)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 text-white rounded-xl text-sm font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 shadow-lg shadow-blue-500/10"
            >
                    🇺🇸 English
            </button>
              <button
                onClick={() => setShowInterfaceLanguage(!showInterfaceLanguage)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 text-white rounded-xl text-sm font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 shadow-lg shadow-green-500/10"
              >
                    🇸🇦 العربية
              </button>
              <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 text-white rounded-xl text-sm font-medium hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 shadow-lg shadow-red-500/10"
              >
                    <LogOut className="w-4 h-4 inline mr-1" />
                    Logout
              </button>
            </div>
          </div>
        </div>
                </div>
              </div>
            </div>

        {/* Premium Profile Header */}
        <div className="relative px-4 sm:px-6 mb-8">
          <div className="text-center">
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
                Profile
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            <p className="text-white/70 text-lg font-medium mt-6">Track your progress and customize your experience</p>
          </div>
        </div>

        {/* Premium Tab Navigation */}
        <div className="px-4 sm:px-6 mb-8">
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
            
            {/* Premium Tab Container */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-2">
              <div className="flex overflow-x-auto scrollbar-hide gap-2">
                {[
            {
              id: 'stats',
              label: 'Stats',
              icon: Target,
                    description: 'Your learning progress',
                    gradient: 'from-blue-500 to-cyan-500',
                    glow: 'shadow-blue-500/25'
            },
            {
              id: 'quiz-history',
              label: 'Quiz History',
              icon: Trophy,
                    description: 'Past quiz results',
                    gradient: 'from-yellow-500 to-orange-500',
                    glow: 'shadow-yellow-500/25'
            },
            {
              id: 'settings',
              label: 'Settings',
              icon: Settings,
                    description: 'Account preferences',
                    gradient: 'from-purple-500 to-pink-500',
                    glow: 'shadow-purple-500/25'
            },
            {
              id: 'leaderboard',
              label: 'Leaderboard',
              icon: Crown,
                    description: 'Global rankings',
                    gradient: 'from-emerald-500 to-teal-500',
                    glow: 'shadow-emerald-500/25'
                  }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      disabled={tabLoading}
                      className={`relative group p-3 sm:p-4 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg ${tab.glow}`
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      } ${tabLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Active Glow Effect */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-2xl blur-sm opacity-50 -z-10`}></div>
                      )}
                      
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/15'}`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="hidden sm:block">
                          <div className="font-semibold text-sm whitespace-nowrap">{tab.label}</div>
                          <div className="text-xs opacity-75 hidden lg:block">{tab.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Tab */}
        {currentTab === 'stats' && (
          <div className="space-y-6">
            {tabLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}
            {!tabLoading && (
              <>
            {/* Premium Profile Summary Card */}
            <div className="relative px-4 sm:px-6">
              <div className="relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
                
                {/* Glassmorphism Card */}
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-blue-600/80 to-purple-600/80 border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
                      {/* Premium Avatar */}
                      <div className="relative group">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/25">
                          <span className="text-white font-bold text-3xl sm:text-4xl">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
                        
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{user?.level || 1}</span>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-3">
                    {user?.name || 'Loading...'}
                  </h2>
                        <p className="text-blue-100 text-lg mb-4">{user?.email || 'user@example.com'}</p>
                        <div>
                          <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium">
                      {languages.find(l => l.code === user?.learning_language || selectedLanguage)?.flag} {languages.find(l => l.code === user?.learning_language || selectedLanguage)?.native}
                    </span>
                  </div>
                </div>
              </div>
              
                    {/* Premium Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      {[
                        { value: user?.total_xp || 0, label: 'Total XP', icon: '⭐', gradient: 'from-yellow-400 to-orange-500' },
                        { value: user?.streak || 0, label: 'Day Streak', icon: '🔥', gradient: 'from-orange-400 to-red-500' },
                        { value: user?.level || 1, label: 'Level', icon: '🎯', gradient: 'from-blue-400 to-purple-500' },
                        { value: 0, label: 'Badges', icon: '🏆', gradient: 'from-green-400 to-emerald-500' }
                      ].map((stat, index) => (
                        <div key={index} className="relative group">
                          <div className="text-center p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-blue-100 text-xs sm:text-sm font-medium">{stat.label}</div>
                </div>
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity -z-10`}></div>
                </div>
                      ))}
                </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Stats */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-white/30 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Learning Stats</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{user?.total_xp || 0}</div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">Total XP</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{user?.streak || 0}</div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">Day Streak</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white">0</div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">Words Learned</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{user?.level || 1}</div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">Level</div>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-white/30 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Learning Progress</h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-1 sm:space-y-0">
                    <span className="text-white font-semibold text-base sm:text-lg">Current Level Progress</span>
                    <span className="text-white/80 text-sm font-medium">0 / 200 XP</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-3 sm:h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 sm:h-4 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-1 sm:space-y-0">
                    <span className="text-white font-semibold text-base sm:text-lg">Weekly Goal</span>
                    <span className="text-white/80 text-sm font-medium">0 / 7 days</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-3 sm:h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 sm:h-4 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border-2 border-white/30 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-yellow-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-lg shadow-green-500/20' 
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      <achievement.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${achievement.color}`} />
                    </div>
                      <span className="text-white font-semibold text-base sm:text-lg">{achievement.name}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <div className="flex items-center space-x-1 text-green-400 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        <span>Unlocked!</span>
                      </div>
                    ) : (
                      <div className="text-white/60 text-sm">Not unlocked yet</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <span className="text-yellow-300 font-semibold text-base sm:text-lg">No achievements yet</span>
                </div>
                <p className="text-yellow-200 text-sm mt-2">Keep learning to unlock them! Complete lessons and quizzes to earn your first achievement.</p>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* Quiz History Tab */}
        {currentTab === 'quiz-history' && (
          <div className="space-y-6">
            {tabLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {!tabLoading && (
            <QuizHistoryComponent userId={user?.id || ''} limit={10} />
            )}
          </div>
        )}

        {/* Settings Tab */}
        {currentTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6">
            {tabLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {!tabLoading && (
              <>
            {/* Basic Profile Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your name"
                      />
                      <div className="flex space-x-2">
                      <button
                        onClick={handleSaveName}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                          className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-white">{user?.name || 'User'}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <span className="text-white text-sm sm:text-base break-all">{user?.email || 'user@example.com'}</span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Learning Language</label>
                  <span className="text-white text-sm sm:text-base">
                    {languages.find(l => l.code === user?.learning_language)?.native || 'Arabic'}
                  </span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Native Language</label>
                  <span className="text-white text-sm sm:text-base">
                    {languages.find(l => l.code === user?.native_language)?.native || 'English'}
                  </span>
                </div>
              </div>
            </div>
            
            <ProfileSettings />
            <UserSettings />
              </>
            )}
          </div>
        )}

        {/* Legacy Settings Tab - keeping for reference */}
        {false && currentTab === 'settings' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleSaveName}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-white">{user?.name || 'User'}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <span className="text-white">{user?.email || 'user@example.com'}</span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Learning Language</label>
                  <span className="text-white">
                    {languages.find(l => l.code === user?.learning_language)?.native || 'Arabic'}
                  </span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Native Language</label>
                  <span className="text-white">
                    {languages.find(l => l.code === user?.native_language)?.native || 'English'}
                  </span>
                </div>
          </div>
        </div>

            {/* App Settings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                App Settings
              </h3>
              
              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Theme</label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map(theme => (
              <button
                        key={theme.value}
                        onClick={() => updateSetting('theme', theme.value as 'light' | 'dark' | 'system')}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          settings.theme === theme.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <theme.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

                {/* Notifications */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Notifications</label>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Enable push notifications</span>
                    <button
                      onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
          </div>
          
                {/* Sound */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Sound</label>
            <div className="flex items-center justify-between">
                    <span className="text-white">Enable audio feedback</span>
                    <button
                      onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.soundEnabled ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Font Size */}
              <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Font Size</label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ].map(size => (
                      <button
                        key={size.value}
                        onClick={() => updateSetting('fontSize', size.value as 'small' | 'medium' | 'large' | 'xl')}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          settings.fontSize === size.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-medium">{size.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Bell className="w-6 h-6 mr-2" />
                Notification Settings
              </h3>
              
              <div className="space-y-4">
                {/* Learning Reminders */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">Learning Reminders</div>
                    <div className="text-white/70 text-sm">Daily learning session reminders</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testNotification('learning-reminders')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Test
                    </button>
              <button
                      onClick={() => updateSetting('learningReminders', !settings.learningReminders)}
                className={`w-12 h-6 rounded-full transition-colors ${
                        settings.learningReminders ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.learningReminders ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
              </button>
                  </div>
            </div>

                {/* Live Session Alerts */}
            <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">Live Session Alerts</div>
                    <div className="text-white/70 text-sm">Notifications for live learning sessions</div>
              </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testNotification('live-sessions')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Test
                    </button>
              <button
                      onClick={() => updateSetting('liveSessionAlerts', !settings.liveSessionAlerts)}
                className={`w-12 h-6 rounded-full transition-colors ${
                        settings.liveSessionAlerts ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.liveSessionAlerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
              </button>
                  </div>
            </div>

                {/* Achievement Notifications */}
            <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">Achievement Notifications</div>
                    <div className="text-white/70 text-sm">Celebrate your learning milestones</div>
              </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testNotification('achievements')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Test
                    </button>
              <button
                      onClick={() => updateSetting('achievementNotifications', !settings.achievementNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                        settings.achievementNotifications ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.achievementNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
              </button>
            </div>
          </div>
        </div>

              {/* Notification Statistics */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="text-white font-medium mb-4">Notification Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Learning Reminders</div>
          </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Live Sessions</div>
                      </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Achievements</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-white/70 text-sm">Progress Updates</div>
          </div>
        </div>

              {/* Permission Status */}
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Permission Status</span>
                    </div>
                    <div className="text-green-300 text-sm mt-1">
                      Enabled
                    </div>
                    <div className="text-green-200 text-xs mt-1">
                      Notifications are enabled. You'll receive learning reminders and updates.
                    </div>
              </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    Enabled
              </button>
            </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {currentTab === 'leaderboard' && (
          <div>
            {tabLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {!tabLoading && (
          <LiveLeaderboard 
            userId={user?.id}
            limit={10}
            autoRefresh={true}
            refreshInterval={30000}
          />
            )}
          </div>
        )}
      </div>
      
      {/* Premium Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-blue-900/10 to-transparent"></div>
        
        {/* Glassmorphism Navigation */}
        <div className="relative backdrop-blur-2xl bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-around py-3 px-4">
            {[
              { href: '/', label: 'Home', icon: Home, gradient: 'from-blue-500 to-cyan-500' },
              { href: '/lessons', label: 'Lessons', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
              { href: '/quiz', label: 'Quiz', icon: Target, gradient: 'from-yellow-500 to-orange-500' },
              { href: '/ai-coach', label: 'AI Coach', icon: Bot, gradient: 'from-purple-500 to-pink-500' },
              { href: '/profile', label: 'Profile', icon: User, gradient: 'from-indigo-500 to-purple-500', active: true }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
              <Link
                key={index}
                href={item.href}
                className={`relative group flex flex-col items-center space-y-1 min-w-0 flex-1 transition-all duration-300 ${
                  item.active ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {/* Active Background */}
                {item.active && (
                  <div className="absolute -top-2 -bottom-2 -left-2 -right-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-sm"></div>
                )}
                
                {/* Icon Container */}
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  item.active 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' 
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <Icon className="w-5 h-5" />
                  
                  {/* Hover Glow */}
                  {!item.active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
                  )}
                </div>
                
                {/* Label */}
                <span className="text-xs font-medium truncate hidden sm:block">{item.label}</span>
                
                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
          </Link>
              );
            })}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}