import React, { useState } from 'react';
import EnhancedQuiz from './EnhancedQuiz';
import QuizScreen from './QuizScreen';
import { Globe, Target, Languages } from 'lucide-react';

// Global Language Toggle Component
interface GlobalLanguageToggleProps {
  globalLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
  compact?: boolean;
}

const GlobalLanguageToggle: React.FC<GlobalLanguageToggleProps> = ({ 
  globalLanguage, 
  onLanguageChange, 
  className = "", 
  compact = false 
}) => (
  <div className={`bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/60 ${compact ? 'p-2' : 'p-4'} ${className}`}>
    {!compact && (
      <div className="flex items-center gap-2 mb-3">
        <Globe className="text-blue-400" size={18} />
        <span className="font-semibold text-white text-sm">{globalLanguage === 'arabic' ? 'اللغة' : 'Language'}</span>
      </div>
    )}
    
    <div className={`flex gap-2 ${compact ? 'gap-1' : 'gap-3'}`}>
      <button
        onClick={() => onLanguageChange('english')}
        className={`flex-1 ${compact ? 'p-2' : 'p-3'} rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
          globalLanguage === 'english'
            ? 'border-blue-500 bg-gradient-to-br from-blue-500/30 to-blue-600/30 shadow-lg shadow-blue-500/30 text-white'
            : 'border-slate-600 bg-slate-700/40 hover:border-slate-500 hover:bg-slate-700/60 text-slate-300'
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <span className={`${compact ? 'text-lg' : 'text-xl'}`}>🇺🇸</span>
          <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} ${globalLanguage === 'english' ? 'text-white' : 'text-slate-300'}`}>
            English
          </span>
        </div>
      </button>
      
      <button
        onClick={() => onLanguageChange('arabic')}
        className={`flex-1 ${compact ? 'p-2' : 'p-3'} rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
          globalLanguage === 'arabic'
            ? 'border-green-500 bg-gradient-to-br from-green-500/30 to-green-600/30 shadow-lg shadow-green-500/30 text-white'
            : 'border-slate-600 bg-slate-700/40 hover:border-slate-500 hover:bg-slate-700/60 text-slate-300'
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <span className={`${compact ? 'text-lg' : 'text-xl'}`}>🇸🇦</span>
          <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} ${globalLanguage === 'arabic' ? 'text-white' : 'text-slate-300'}`}>
            العربية
          </span>
        </div>
      </button>
    </div>
  </div>
);

interface QuizResults {
  score: number;
  total: number;
  timeSpent: number;
}

interface QuizScreenEnhancedProps {
  selectedLanguage?: string;
  onFinish?: (score: number, total: number) => void;
  globalLanguage?: string;
  onGlobalLanguageChange?: (language: string) => void;
}

const QuizScreenEnhanced: React.FC<QuizScreenEnhancedProps> = ({ 
  selectedLanguage = "english", 
  onFinish, 
  globalLanguage = "english", 
  onGlobalLanguageChange 
}) => {
  const [useEnhancedQuiz, setUseEnhancedQuiz] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<QuizResults | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [learningLanguage, setLearningLanguage] = useState('ar'); // Language to learn

  const handleQuizFinish = (score: number, total: number, timeSpent: number) => {
    setFinalScore({ score, total, timeSpent });
    setQuizFinished(true);
    if (onFinish) {
      onFinish(score, total);
    }
  };

  // Wrapper for QuizScreen onFinish callback
  const handleQuizScreenFinish = (score: number, total: number) => {
    // For QuizScreen, we don't have timeSpent, so we'll use 0 as default
    handleQuizFinish(score, total, 0);
  };

  const handleQuestionComplete = (questionIndex: number, isCorrect: boolean, answer: string) => {
    console.log(`Question ${questionIndex + 1}: ${isCorrect ? 'Correct' : 'Incorrect'} - ${answer}`);
  };

  if (quizFinished && finalScore) {
    return (
      <div className="space-y-6 p-4">
        <div className="bg-gradient-to-br from-green-800 to-blue-800 rounded-2xl p-6 text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-xl">Score: {finalScore.score}/{finalScore.total}</p>
            <p className="text-lg">Accuracy: {Math.round((finalScore.score / finalScore.total) * 100)}%</p>
            <p className="text-lg">Time: {Math.floor(finalScore.timeSpent / 60)}:{(finalScore.timeSpent % 60).toString().padStart(2, '0')}</p>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                setQuizFinished(false);
                setFinalScore(null);
                setQuizStarted(false);
              }}
              className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz selection if not started
  if (!quizStarted) {
    return (
      <div className="space-y-6 p-4 pb-24">
        <div className="text-center">
          <h2 className="text-white text-3xl font-bold mb-4">{globalLanguage === 'arabic' ? 'اختر اختبارك' : 'Choose Your Quiz'}</h2>
          <p className="text-slate-300 mb-8">{globalLanguage === 'arabic' ? 'اختر نوع الاختبار الذي تريد أن تأخذه' : 'Select the type of quiz you\'d like to take'}</p>
        </div>

        {/* Language Selection */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Languages className="mr-2" size={20} />
            {globalLanguage === 'arabic' ? 'اختر لغة التعلم' : 'Choose Learning Language'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {globalLanguage === 'arabic' ? 'اختر اللغة التي تريد ممارستها في هذا الاختبار' : 'Select the language you want to practice in this quiz'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
              { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
              { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
              { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLearningLanguage(lang.code)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  learningLanguage === lang.code
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="text-sm font-semibold">{lang.name}</div>
                  <div className="text-xs text-white/80">{lang.native}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Enhanced Quiz Card */}
          <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-2xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{globalLanguage === 'arabic' ? 'الاختبار المتقدم' : 'Enhanced Quiz'}</h3>
              <p className="text-blue-200">{globalLanguage === 'arabic' ? 'اختبار متقدم مع أنواع أسئلة متعددة' : 'Advanced quiz with multiple question types'}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>8 Different Question Types</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Audio & Pronunciation Practice</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Real-time Scoring & Timing</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Google TTS Integration</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Arabic Vowel Support</span>
              </div>
            </div>

            <button
              onClick={() => {
                setUseEnhancedQuiz(true);
                setQuizStarted(true);
              }}
              className="w-full bg-white text-blue-800 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              {globalLanguage === 'arabic' ? 'بدء الاختبار المتقدم' : 'Start Enhanced Quiz'}
            </button>
          </div>

          {/* Basic Quiz Card */}
          <div className="bg-gradient-to-br from-green-800 to-teal-900 rounded-2xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{globalLanguage === 'arabic' ? 'الاختبار الأساسي' : 'Basic Quiz'}</h3>
              <p className="text-green-200">{globalLanguage === 'arabic' ? 'اختبار بسيط مع أسئلة عادية' : 'Simple quiz with standard questions'}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Multiple Choice Questions</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>True/False Questions</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Fill in the Blank</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Quick & Simple</span>
              </div>
            </div>

            <button
              onClick={() => {
                setUseEnhancedQuiz(false);
                setQuizStarted(true);
              }}
              className="w-full bg-white text-green-800 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              {globalLanguage === 'arabic' ? 'بدء الاختبار الأساسي' : 'Start Basic Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Type Toggle */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-orange-500/20">
        <h2 className="font-bold text-white mb-4 flex items-center text-xl">
          <Target className="mr-2" size={20} />
          Quiz Mode
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Choose your preferred quiz experience
        </p>
        
        <div className="flex justify-center">
          <div className="bg-slate-700/50 rounded-xl p-1 border border-slate-600">
            <button
              onClick={() => setUseEnhancedQuiz(true)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                useEnhancedQuiz 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target size={16} />
                Enhanced Quiz
              </div>
            </button>
            <button
              onClick={() => setUseEnhancedQuiz(false)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                !useEnhancedQuiz 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target size={16} />
                Basic Quiz
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        {useEnhancedQuiz ? (
          <EnhancedQuiz
            selectedLanguage={learningLanguage}
            onFinish={handleQuizFinish}
            onQuestionComplete={handleQuestionComplete}
          />
        ) : (
          <QuizScreen
            selectedLanguage={learningLanguage}
            onFinish={handleQuizScreenFinish}
          />
        )}
      </div>
    </div>
  );
};

export default QuizScreenEnhanced;
