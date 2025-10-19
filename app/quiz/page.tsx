'use client';

import { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { ArrowLeft, Flame, Star, Clock, Target, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import BottomNavigation from '../../components/BottomNavigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import QuizLoadingSpinner from '../../components/QuizLoadingSpinner';
import { supabase } from '../../lib/supabase';
import { saveQuizHistory } from '../../lib/quizHistory';

// Lazy load components for better performance
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

  useEffect(() => {
    if (user) {
      loadUserLearningLanguages();
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted) {
      interval = setInterval(() => {
        setQuizTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted]);

  const loadUserLearningLanguages = useCallback(async () => {
    if (!user?.id) {
      setSelectedLanguages([currentLanguage.code]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('learning_languages')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading user learning languages:', error);
        setSelectedLanguages([currentLanguage.code]);
      } else if (data?.learning_languages && data.learning_languages.length > 0) {
        setSelectedLanguages(data.learning_languages);
      } else {
        setSelectedLanguages([currentLanguage.code]);
      }
    } catch (error) {
      console.error('Error loading user learning languages:', error);
      setSelectedLanguages([currentLanguage.code]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentLanguage.code]);

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
      
      if (/[\u0600-\u06FF]/.test(text)) {
        utterance.lang = 'ar-SA';
      } else {
        utterance.lang = language === 'arabic' ? 'ar-SA' : 'en-US';
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
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

  // Memoize expensive calculations
  const quizProgress = useMemo(() => ({
    percentage: Math.round((quizScore / Math.max(totalQuestions, 1)) * 100),
    formattedTime: formatTime(quizTime)
  }), [quizScore, totalQuestions, formatTime, quizTime]);

  const languageToggleProps = useMemo(() => ({
    globalLanguage,
    onLanguageChange: setGlobalLanguage
  }), [globalLanguage]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="p-4 sm:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 text-white hover:text-purple-300 transition-colors">
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
                  className={`px-4 sm:px-6 py-3 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base font-medium ${
                    globalLanguage === 'english'
                      ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50'
                  }`}
                >
                  🇺🇸 Learn English
                </button>
                <button
                  onClick={() => setGlobalLanguage('arabic')}
                  className={`px-4 sm:px-6 py-3 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base font-medium ${
                    globalLanguage === 'arabic'
                      ? 'border-green-500 bg-green-500/20 text-white shadow-lg shadow-green-500/25'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50'
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
                  className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                    quizType === 'enhanced' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Target size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Enhanced Quiz</span>
                    <span className="sm:hidden">Enhanced</span>
                  </div>
                </button>
                <button
                  onClick={() => setQuizType('basic')}
                  className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                    quizType === 'basic' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Target size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Basic Quiz</span>
                    <span className="sm:hidden">Basic</span>
                  </div>
                </button>
              </div>

              {/* Quiz Progress Stats */}
              <div className="flex items-center justify-center lg:justify-end space-x-3 sm:space-x-4 w-full lg:w-auto">
                <div className="flex items-center space-x-1 sm:space-x-2 text-white">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-sm sm:text-base font-semibold">{quizScore}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-white">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-semibold">{quizProgress.formattedTime}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-white">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold">{quizProgress.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Content */}
          <div className="flex-1 overflow-y-auto pb-20">
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
        
        {/* Bottom Navigation */}
        <div className="flex-shrink-0">
          <BottomNavigation />
        </div>
        
      </div>
    </ProtectedRoute>
  );
}