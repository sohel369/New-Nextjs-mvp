import React from 'react';
import { Trophy, Star, Clock, RotateCcw, Home } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  total: number;
  onRetake: () => void;
  onGoHome: () => void;
  language: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  score, 
  total, 
  onRetake, 
  onGoHome, 
  language 
}) => {
  const accuracy = Math.round((score / total) * 100);
  const isRTL = language === 'arabic';

  const getPerformanceMessage = () => {
    if (accuracy >= 90) {
      return isRTL ? 'ممتاز! أداء رائع!' : 'Excellent! Outstanding performance!';
    } else if (accuracy >= 70) {
      return isRTL ? 'جيد جداً! استمر في التقدم!' : 'Very good! Keep up the great work!';
    } else if (accuracy >= 50) {
      return isRTL ? 'جيد! يمكنك التحسن أكثر!' : 'Good! You can improve more!';
    } else {
      return isRTL ? 'استمر في التعلم والممارسة!' : 'Keep learning and practicing!';
    }
  };

  return (
    <div className={`space-y-6 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Celebration Header */}
      <div className="text-center">
        <div className="text-8xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold text-white mb-2">
          {isRTL ? 'انتهى الاختبار!' : 'Quiz Complete!'}
        </h2>
        <p className="text-slate-300 text-lg">
          {getPerformanceMessage()}
        </p>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-center text-white">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-xl font-bold mb-2">
            {isRTL ? 'النتيجة' : 'Score'}
          </h3>
          <div className="text-3xl font-bold">{score}/{total}</div>
          <div className="text-sm opacity-80">
            {isRTL ? 'أسئلة' : 'Questions'}
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-center text-white">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-xl font-bold mb-2">
            {isRTL ? 'الدقة' : 'Accuracy'}
          </h3>
          <div className="text-3xl font-bold">{accuracy}%</div>
          <div className="text-sm opacity-80">
            {accuracy >= 80 ? (isRTL ? 'ممتاز!' : 'Excellent!') : 
             accuracy >= 60 ? (isRTL ? 'جيد!' : 'Good!') : 
             (isRTL ? 'استمر في الممارسة!' : 'Keep practicing!')}
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-center text-white">
          <div className="text-3xl mb-2">⏱️</div>
          <h3 className="text-xl font-bold mb-2">
            {isRTL ? 'الوقت' : 'Time'}
          </h3>
          <div className="text-3xl font-bold">--:--</div>
          <div className="text-sm opacity-80">
            {isRTL ? 'دقائق' : 'Minutes'}
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">
          {isRTL ? 'تحليل الأداء' : 'Performance Analysis'}
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              {isRTL ? 'الإجابات الصحيحة' : 'Correct Answers'}
            </span>
            <span className="text-green-400 font-semibold">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              {isRTL ? 'الإجابات الخاطئة' : 'Incorrect Answers'}
            </span>
            <span className="text-red-400 font-semibold">{total - score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              {isRTL ? 'نسبة النجاح' : 'Success Rate'}
            </span>
            <span className="text-blue-400 font-semibold">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetake}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          {isRTL ? 'إعادة الاختبار' : 'Retake Quiz'}
        </button>
        <button
          onClick={onGoHome}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
