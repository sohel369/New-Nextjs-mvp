'use client';

import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
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
import ProfileSettings from '../../components/ProfileSettings';
import QuizHistoryComponent from '../../components/QuizHistory';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import BottomNavigation from '../../components/BottomNavigation';
import { db } from '../../lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

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

export default function ProfilePage() {
  const { user, signOut, refreshUser, loading: authLoading, authChecked } = useAuth();
  const { currentLanguage, setCurrentLanguage, isRTL, t: contextT } = useLanguage();
  const { settings, updateSetting } = useAccessibility();
  const t = useTranslation();

  const [currentTab, setCurrentTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [tabLoading, setTabLoading] = useState(false);
  
  useEffect(() => {
    setEditName(user?.name || '');
  }, [user?.name]);

  const profileCreationRef = React.useRef(false);
  const profileCreationTimeoutRef = React.useRef<NodeJS.Timeout|null>(null);
  const saveNameRef = useRef(false);
  const createProfileLoadingRef = useRef(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [showInterfaceLanguage, setShowInterfaceLanguage] = useState(false);
  
  const createUserProfile = React.useCallback(async () => {
    if (!user || createProfileLoadingRef.current) return;
    try {
      createProfileLoadingRef.current = true;
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: user.email?.split('@')[0] || 'User',
          email: user.email || ''
        }),
      });
      const result = await response.json();
      if (result.success) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      createProfileLoadingRef.current = false;
    }
  }, [user, refreshUser]);

  useEffect(() => {
    return () => {
      if (profileCreationTimeoutRef.current) {
        clearTimeout(profileCreationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (user && user.id && user.email && (!user.name || user.name === 'Guest') && !profileCreationRef.current) {
      profileCreationRef.current = true;
      createUserProfile().finally(() => {
        profileCreationTimeoutRef.current = setTimeout(() => {
          profileCreationRef.current = false;
        }, 5000);
      });
    }
  }, [user?.id, user?.email, user?.name, createUserProfile]);
  
  const handleSaveName = async () => {
    if (!user || !editName.trim() || saveNameRef.current) return;
    try {
      saveNameRef.current = true;
      const docRef = doc(db, 'profiles', user.id);
      await updateDoc(docRef, { name: editName.trim() });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      saveNameRef.current = false;
    }
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('just_logged_out', 'true');
        sessionStorage.setItem('prevent_redirect', 'true');
        localStorage.clear();
        if (signOut) {
          signOut().catch(() => {});
        }
        window.location.replace('/');
      } catch (error) {
        window.location.replace('/');
      }
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === currentTab) return;
    setTabLoading(true);
    setCurrentTab(tabId);
    setTimeout(() => {
      setTabLoading(false);
    }, 200);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center group">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500">
              <span className="text-white font-black text-xl">L</span>
            </div>
          </div>
          <p className="text-white/70 font-medium tracking-widest uppercase text-xs animate-pulse">Initializing Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-16 sm:pb-20">
        {/* Header */}
        <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">LinguaAI</h1>
                <p className="text-sm text-white/60">{t('readyToLearn')}</p>
              </div>
            </div>
            
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="flex items-center space-x-2 px-4 py-2 bg-orange-500/10 border border-orange-400/30 rounded-full">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-white font-bold">{user?.streak || 0}</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <button 
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-white rounded-xl text-sm font-medium hover:bg-red-500/30 transition-all"
              >
                {isLoggingOut ? t('saving') : t('logout') || 'Logout'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'stats', label: t('stats') || 'Stats', icon: Target, gradient: 'from-blue-500 to-cyan-500' },
                { id: 'quiz-history', label: t('history') || 'History', icon: Trophy, gradient: 'from-yellow-500 to-orange-500' },
                { id: 'settings', label: t('settings') || 'Settings', icon: Settings, gradient: 'from-purple-500 to-pink-500' },
                { id: 'leaderboard', label: t('leaderboard') || 'Leaderboard', icon: Crown, gradient: 'from-emerald-500 to-teal-500' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative p-3 rounded-2xl transition-all duration-300 ${
                      isActive ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg` : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold hidden sm:block">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {tabLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {currentTab === 'stats' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-md">
                          <span className="text-4xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-slate-900 font-bold">{user?.level || 1}</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-left">
                        <h2 className="text-4xl font-bold mb-2">{user?.name || 'User'}</h2>
                        <p className="text-white/80 mb-4">{user?.email}</p>
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/20">
                          <Globe className="w-4 h-4 mr-2" />
                          <span className="font-medium">{t('learningLanguages')}: {languages.find(l => l.code === (user?.learning_language || 'ar'))?.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Total XP', value: user?.total_xp || 0, icon: '⭐' },
                        { label: 'Streak', value: user?.streak || 0, icon: '🔥' },
                        { label: 'Level', value: user?.level || 1, icon: '🎯' },
                        { label: 'Badges', value: 0, icon: '🏆' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center backdrop-blur-md hover:bg-white/15 transition-all">
                          <div className="text-2xl mb-1">{stat.icon}</div>
                          <div className="text-2xl font-black">{stat.value}</div>
                          <div className="text-xs font-bold uppercase tracking-wider text-white/60">{t(stat.label.toLowerCase() as any) || stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements Grid */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                      {t('achievements')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help relative group">
                          <div className="flex items-center justify-center p-3 bg-white/5 rounded-xl mb-3">
                            <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">{achievement.name}</div>
                            <div className="text-xs text-white/50">{achievement.description}</div>
                          </div>
                          <div className="absolute inset-0 bg-slate-900/80 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">LOCKED</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'quiz-history' && (
                <div className="animate-fade-in">
                  <QuizHistoryComponent userId={user?.id || ''} limit={10} />
                </div>
              )}

              {currentTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Profile Edit */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <User className="w-6 h-6 mr-3 text-purple-400" />
                      {t('profileInformation') || 'Profile Information'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/40 text-xs font-black uppercase">Display Name</label>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button onClick={handleSaveName} className="bg-emerald-600 px-4 rounded-xl text-white font-bold text-sm">{t('save')}</button>
                            <button onClick={() => setIsEditing(false)} className="bg-white/10 px-4 rounded-xl text-white font-bold text-sm">X</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-white font-bold">{user?.name || 'User'}</span>
                            <button onClick={() => setIsEditing(true)} className="p-2 text-purple-400"><Edit3 className="w-5 h-5"/></button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/40 text-xs font-black uppercase">Email Address</label>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/60 font-medium truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unified Settings Component */}
                  <ProfileSettings onSettingsUpdate={() => refreshUser()} />
                </div>
              )}

              {currentTab === 'leaderboard' && (
                <div className="animate-fade-in">
                  <LiveLeaderboard userId={user?.id} limit={10} autoRefresh={true} />
                </div>
              )}
            </>
          )}
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}