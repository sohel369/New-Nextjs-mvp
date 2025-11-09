'use client';

import { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { ArrowLeft, Star, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import BottomNavigation from '../../components/BottomNavigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import QuizLoadingSpinner from '../../components/QuizLoadingSpinner';
import { supabase } from '../../lib/supabase';
import { saveQuizHistory } from '../../lib/quizHistory';

const QuizScreen = lazy(() => import('../../components/QuizScreen'));

export default function QuizPage() {
  const { user } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalLanguage, setGlobalLanguage] = useState('english');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizType, setQuizType] = useState('enhanced');
  const [quizScore, setQuizScore] = useState(0);
  const [quizTime, setQuizTime] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 🧩 Ensure client-side rendering only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && mounted) {
      loadUserLearningLanguages();
    }
  }, [user, mounted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted) {
      interval = setInterval(() => setQuizTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted]);

  const loadUserLearningLanguages = useCallback(async () => {
    // 🛡 Check if component is still mounted before proceeding
    if (!mounted) return;

    // ✅ Validate user exists and has an id before attempting fetch
    if (!user || !user.id) {
      if (!mounted) return;
      setSelectedLanguages([currentLanguage.code]);
      setLoading(false);
      return;
    }

    // 🧩 Wrap async Supabase call in safe async function
    try {
      if (!mounted) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('learning_languages')
        .eq('id', user.id)
        .maybeSingle();

      // 🛡 Check mounted again after async operation
      if (!mounted) return;

      if (error) {
        // ✅ Only log if error has meaningful content (not empty object)
        // Check if error is an empty object - if so, skip logging entirely
        const isErrorObject = typeof error === 'object' && error !== null;
        const errorKeys = isErrorObject ? Object.keys(error) : [];
        const isEmptyObject = isErrorObject && errorKeys.length === 0;
        
        // Only proceed with logging if it's not an empty object
        if (!isEmptyObject) {
          const hasMessage = error.message && typeof error.message === 'string' && error.message.trim().length > 0;
          const hasCode = error.code && (typeof error.code === 'string' || typeof error.code === 'number');
          const hasDetails = error.details && typeof error.details === 'string' && error.details.trim().length > 0;
          const hasHint = error.hint && typeof error.hint === 'string' && error.hint.trim().length > 0;
          
          // Only log if at least one meaningful property exists
          if (hasMessage || hasCode || hasDetails || hasHint) {
            console.error('Error loading user learning languages:', {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint
            });
          }
        }
        // Always set fallback languages even if error is empty (no logging)
        if (!mounted) return;
        setSelectedLanguages([currentLanguage.code]);
      } else if (data?.learning_languages && Array.isArray(data.learning_languages) && data.learning_languages.length > 0) {
        // ✅ Use the fetched languages if valid array with items
        setSelectedLanguages(data.learning_languages);
      } else {
        // ✅ Fallback to empty array or current language code if no languages found
        const fallbackLanguages = currentLanguage?.code ? [currentLanguage.code] : [];
        setSelectedLanguages(fallbackLanguages);
      }
    } catch (error) {
      // ✅ Proper error logging with detailed information
      // Only log if error has meaningful content
      const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : null);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      // Only log if we have a meaningful error message or stack trace
      // Explicitly avoid logging empty objects
      if (errorMessage && errorMessage.trim().length > 0) {
        console.error('Error loading user learning languages:', {
          message: errorMessage,
          stack: errorStack
        });
      } else if (errorStack) {
        console.error('Error loading user learning languages:', {
          stack: errorStack
        });
      }
      // If error is just an empty object or has no meaningful content, skip logging
      
      if (!mounted) return;
      // ✅ Fallback to empty array or current language code on error
      const fallbackLanguages = currentLanguage?.code ? [currentLanguage.code] : [];
      setSelectedLanguages(fallbackLanguages);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }, [user, mounted, currentLanguage.code]);

  const handleQuizFinish = useCallback(async (score: number, total: number, timeSpent?: number) => {
    if (!user) return;
    try {
      const quizData = {
        userId: user.id,
        quizType: quizType as 'basic' | 'enhanced',
        language: currentLanguage.code,
        score,
        totalQuestions: total,
        accuracy: (score / total) * 100,
        timeSpent: timeSpent || quizTime,
        completedAt: new Date().toISOString(),
        questions: []
      };
      await saveQuizHistory(quizData);
      console.log('Quiz history saved successfully');
    } catch (error) {
      console.error('Error saving quiz history:', error);
    }
  }, [user, quizType, currentLanguage.code, quizTime]);

  const handleSpeakText = useCallback((text: string, language: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = /[\u0600-\u06FF]/.test(text) ? 'ar-SA' : language === 'arabic' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizStarted(false);
    setQuizScore(0);
    setQuizTime(0);
    setCurrentQuestion(0);
    setTotalQuestions(0);
    setResetCounter(prev => prev + 1);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const quizProgress = useMemo(() => ({
    percentage: Math.round((quizScore / Math.max(totalQuestions, 1)) * 100),
    formattedTime: formatTime(quizTime)
  }), [quizScore, totalQuestions, formatTime, quizTime]);

  // 🛡 Prevent SSR/client mismatch by rendering a placeholder before mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-white/70">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <QuizLoadingSpinner message="Loading quizzes..." size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <Link
              href="/"
              title="Go back to Home Page"
              className="flex items-center space-x-2 sm:space-x-3 text-white hover:text-purple-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{currentLanguage.flag}</div>
                <div className="text-xs sm:text-sm text-gray-300">{currentLanguage.native}</div>
              </div>
            </div>
          </div>

          {/* Quiz Challenge Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Quiz Challenge</h1>

            {/* Language Selection */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Choose Learning Language:</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setGlobalLanguage('english')}
                  title="Select English to learn"
                  className={`px-4 sm:px-6 py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base font-medium cursor-pointer ${
                    globalLanguage === 'english'
                      ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50 hover:scale-105'
                  }`}
                >
                  🇺🇸 Learn English
                </button>
                <button
                  onClick={() => setGlobalLanguage('arabic')}
                  title="Select Arabic to learn"
                  className={`px-4 sm:px-6 py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base font-medium cursor-pointer ${
                    globalLanguage === 'arabic'
                      ? 'border-green-500 bg-green-500/20 text-white shadow-lg shadow-green-500/25'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50 hover:scale-105'
                  }`}
                >
                  🇸🇦 Learn Arabic
                </button>
              </div>
            </div>

            {/* Quiz Type Toggle */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
              <div className="flex bg-slate-700/50 rounded-xl p-1 border border-slate-600 w-full lg:w-auto">
                <button
                  onClick={() => setQuizType('enhanced')}
                  title="Start Enhanced Quiz"
                  className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                    quizType === 'enhanced'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-600/50 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Target size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Enhanced Quiz</span>
                  </div>
                </button>
                <button
                  onClick={() => setQuizType('basic')}
                  title="Start Basic Quiz"
                  className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                    quizType === 'basic'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-600/50 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Target size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Basic Quiz</span>
                  </div>
                </button>
              </div>

              {/* Quiz Progress Stats */}
              <div className="flex items-center justify-center lg:justify-end space-x-3 sm:space-x-4 w-full lg:w-auto">
                <div className="flex items-center space-x-1 sm:space-x-2 text-white" title="Your Score">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-sm sm:text-base font-semibold">{quizScore}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-white" title="Time Elapsed">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-semibold">{quizProgress.formattedTime}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-white" title="Quiz Progress">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold">{quizProgress.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Content */}
          <div className="flex-1">
            <Suspense fallback={<QuizLoadingSpinner message="Loading quiz..." size="md" />}>
              <QuizScreen
                key={`quiz-${globalLanguage}-${resetCounter}`}
                selectedLanguage={globalLanguage}
                onFinish={(score, total) => {
                  setQuizScore(score);
                  setTotalQuestions(total);
                  handleQuizFinish(score, total, quizTime);
                }}
                onSpeakText={handleSpeakText}
                onQuestionChange={(question, total) => {
                  setCurrentQuestion(question);
                  setTotalQuestions(total);
                }}
                onQuizStart={() => setQuizStarted(true)}
                onResetQuiz={resetQuiz}
                quizType={quizType}
              />
            </Suspense>
          </div>
        </div>

        {/* Bottom Navigation - Fixed */}
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}
