import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Target, Star, Trophy, TrendingUp, Calendar, Award } from 'lucide-react';
import { getQuizHistory, getQuizStats } from '../lib/quizHistory';
import { QuizHistory } from '../data/languageData';

interface QuizHistoryProps {
  userId: string;
  limit?: number;
}

const QuizHistoryComponent: React.FC<QuizHistoryProps> = React.memo(({ userId, limit = 10 }) => {
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadQuizData();
    }
  }, [userId, limit]);

  const loadQuizData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const [history, stats] = await Promise.all([
        getQuizHistory(userId, limit),
        getQuizStats(userId)
      ]);
      
      setQuizHistory(history);
      setQuizStats(stats);
    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const memoizedQuizHistory = useMemo(() => quizHistory, [quizHistory]);
  const memoizedQuizStats = useMemo(() => quizStats, [quizStats]);

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-600/20 border-green-400/50';
    if (percentage >= 60) return 'bg-yellow-600/20 border-yellow-400/50';
    return 'bg-red-600/20 border-red-400/50';
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!quizStats || quizStats.totalQuizzes === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          Quiz History
        </h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-white/70 text-lg mb-2">No quiz history yet</p>
          <p className="text-white/50 text-sm">Complete your first quiz to see your progress here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Statistics */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
          Quiz Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{quizStats.totalQuizzes}</div>
            <div className="text-white/70 text-sm">Total Quizzes</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{Math.round(quizStats.averageScore)}</div>
            <div className="text-white/70 text-sm">Avg Score</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{Math.round(quizStats.averageAccuracy)}%</div>
            <div className="text-white/70 text-sm">Avg Accuracy</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{formatTime(quizStats.totalTimeSpent)}</div>
            <div className="text-white/70 text-sm">Total Time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-medium mb-2">Quiz Types</h4>
            <div className="space-y-2">
              {Object.entries(quizStats.quizTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-white/70 capitalize">{type} Quiz</span>
                  <span className="text-white font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Languages</h4>
            <div className="space-y-2">
              {Object.entries(quizStats.languages).map(([lang, count]) => (
                <div key={lang} className="flex justify-between items-center">
                  <span className="text-white/70 capitalize">{lang}</span>
                  <span className="text-white font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quiz History */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-400" />
          Recent Quiz History
        </h3>
        
        {quizHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-white/70">No recent quizzes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizHistory.map((quiz, index) => (
              <div
                key={quiz.id}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${getScoreBgColor(quiz.score, quiz.totalQuestions)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold capitalize">
                        {quiz.quizType} Quiz - {quiz.language}
                      </h4>
                      <p className="text-white/70 text-sm">
                        {formatDate(quiz.completedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(quiz.score, quiz.totalQuestions)}`}>
                      {quiz.score}/{quiz.totalQuestions}
                    </div>
                    <div className="text-white/70 text-sm">
                      {Math.round(quiz.accuracy)}% accuracy
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-white/70" />
                      <span className="text-white/70">{formatTime(quiz.timeSpent)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 text-white/70" />
                      <span className="text-white/70">{quiz.questions.length} questions</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

QuizHistoryComponent.displayName = 'QuizHistoryComponent';

export default QuizHistoryComponent;
