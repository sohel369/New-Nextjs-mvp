'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import BottomNavigation from '../../components/BottomNavigation';
import LanguageLessons from '../../components/LanguageLessons';
import ProtectedRoute from '../../components/ProtectedRoute';
import { supabase } from '../../lib/supabase';

export default function LessonsPage() {
  const { user } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserLearningLanguages();
    }
  }, [user]);

  const loadUserLearningLanguages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('learning_languages')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading user learning languages:', error);
        // Default to current language if no learning languages set
        setSelectedLanguages([currentLanguage.code]);
        return;
      }

      if (data?.learning_languages && data.learning_languages.length > 0) {
        setSelectedLanguages(data.learning_languages);
      } else {
        // Default to current language if no learning languages set
        setSelectedLanguages([currentLanguage.code]);
      }
    } catch (error) {
      console.error('Error loading user learning languages:', error);
      setSelectedLanguages([currentLanguage.code]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading lessons...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{currentLanguage.flag}</div>
              <div className="text-xs sm:text-sm text-gray-300">{currentLanguage.native}</div>
            </div>
          </div>
        </div>

          {/* Lessons Content */}
          <LanguageLessons 
            userLearningLanguages={selectedLanguages}
            onLessonComplete={(lessonId, xp) => {
              console.log('Lesson completed:', lessonId, 'XP earned:', xp);
              // Handle lesson completion logic here
            }}
          />
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
    </ProtectedRoute>
  );
}
