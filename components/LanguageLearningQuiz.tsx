// Main Language Learning Quiz System Component
// Responsive, mobile-first design with all requested features

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  QUIZ_QUESTIONS, 
  LANGUAGE_CONFIG, 
  LEADERBOARD_DATA,
  getRandomQuestion,
  calculateLevel,
  getLevelProgress,
  XP_SYSTEM,
  QuizQuestion,
  UserProgress
} from '../data/quizSystemData';
import { quizAudioService } from '../lib/quizAudioService';
import { quizProgressManager } from '../lib/quizProgressManager';
import QuizConfetti from './QuizConfetti';

interface LanguageLearningQuizProps {
  className?: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type QuizState = 'setup' | 'playing' | 'result' | 'leaderboard';

const LanguageLearningQuiz: React.FC<LanguageLearningQuizProps> = ({ className = '' }) => {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confettiType, setConfettiType] = useState<'celebration' | 'correct' | 'levelup' | 'achievement'>('correct');
  const [userProgress, setUserProgress] = useState<UserProgress>(quizProgressManager.getUserProgress());
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizState === 'playing') {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizState]);

  // Load new question
  const loadNewQuestion = useCallback(() => {
    const question = getRandomQuestion(selectedLanguage, selectedDifficulty);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(30);
  }, [selectedLanguage, selectedDifficulty]);

  // Start quiz
  const startQuiz = useCallback(() => {
    setQuizState('playing');
    setScore(0);
    setQuestionCount(0);
    setAchievements([]);
    loadNewQuestion();
  }, [loadNewQuestion]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showFeedback || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setQuestionCount(questionCount + 1);
    
    // Update progress
    const progressUpdate = quizProgressManager.updateProgress(correct, selectedLanguage);
    setUserProgress(progressUpdate.progress);
    
    // Check for achievements
    if (progressUpdate.newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...progressUpdate.newAchievements]);
    }
    
    // Show confetti for correct answers
    if (correct) {
      setConfettiType('correct');
      setShowConfetti(true);
    }
    
    // Show confetti every 5 correct answers
    if (correct && progressUpdate.progress.totalCorrect % XP_SYSTEM.CONFETTI_INTERVAL === 0) {
      setConfettiType('celebration');
      setShowConfetti(true);
    }
    
    // Show confetti for level up
    if (progressUpdate.levelUp) {
      setConfettiType('levelup');
      setShowConfetti(true);
    }
    
    // Show confetti for achievements
    if (progressUpdate.newAchievements.length > 0) {
      setConfettiType('achievement');
      setShowConfetti(true);
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (questionCount < 9) {
        loadNewQuestion();
      } else {
        setQuizState('result');
      }
    }, 2000);
  }, [currentQuestion, showFeedback, score, questionCount, selectedLanguage, loadNewQuestion]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(-1);
    setIsCorrect(false);
    setShowFeedback(true);
    setQuestionCount(questionCount + 1);
    
    // Update progress
    quizProgressManager.updateProgress(false, selectedLanguage);
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (questionCount < 9) {
        loadNewQuestion();
      } else {
        setQuizState('result');
      }
    }, 2000);
  }, [currentQuestion, questionCount, selectedLanguage, loadNewQuestion]);

  // Play audio
  const playAudio = useCallback(async () => {
    if (!currentQuestion) return;
    
    try {
      setIsPlaying(true);
      await quizAudioService.speakQuizWord(currentQuestion.word, selectedLanguage);
    } catch (error) {
      console.error('Audio playback error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [currentQuestion, selectedLanguage]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setQuizState('setup');
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuestionCount(0);
    setTimeLeft(30);
    setShowConfetti(false);
    setAchievements([]);
  }, []);

  // Memoized progress stats
  const progressStats = useMemo(() => {
    return quizProgressManager.getProgressStats(userProgress);
  }, [userProgress]);

  // Memoized language config
  const languageConfig = useMemo(() => {
    return LANGUAGE_CONFIG[selectedLanguage as keyof typeof LANGUAGE_CONFIG];
  }, [selectedLanguage]);

  // Render setup screen
  if (quizState === 'setup') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 ${className}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🌍 Language Learning Quiz
            </h1>
            <p className="text-xl text-blue-200">
              Master languages with interactive quizzes
            </p>
          </div>

          {/* Progress Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{progressStats.currentLevel}</div>
                <div className="text-sm text-blue-200">Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{progressStats.currentXP}</div>
                <div className="text-sm text-blue-200">XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{progressStats.streak}</div>
                <div className="text-sm text-blue-200">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{Math.round(progressStats.accuracy)}%</div>
                <div className="text-sm text-blue-200">Accuracy</div>
              </div>
            </div>
            
            {/* Level Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-200 mb-2">
                <span>Level {progressStats.currentLevel}</span>
                <span>{Math.round(progressStats.levelProgress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressStats.levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Choose Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
                <button
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    selectedLanguage === code
                      ? 'bg-blue-500 text-white transform scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="text-2xl mb-2">{config.flag}</div>
                  <div className="font-semibold">{config.name}</div>
                  <div className="text-sm opacity-80">{config.native}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Choose Difficulty</h2>
            <div className="grid grid-cols-3 gap-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`p-4 rounded-xl transition-all duration-300 capitalize ${
                    selectedDifficulty === difficulty
                      ? 'bg-green-500 text-white transform scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'}
                  </div>
                  <div className="font-semibold">{difficulty}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              🚀 Start Quiz
            </button>
          </div>

          {/* Leaderboard Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="bg-white/20 text-white text-lg font-semibold py-3 px-8 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              🏆 View Leaderboard
            </button>
          </div>
        </div>

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-white text-2xl hover:text-red-400"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                {LEADERBOARD_DATA.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center p-4 rounded-xl ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' : 'bg-white/10'
                    }`}
                  >
                    <div className="text-2xl font-bold text-white w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="text-3xl mx-4">{entry.avatar}</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{entry.name}</div>
                      <div className="text-blue-200 text-sm">{entry.country}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{entry.xp} XP</div>
                      <div className="text-blue-200 text-sm">Level {entry.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render playing screen
  if (quizState === 'playing' && currentQuestion) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 ${className}`}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              <div className="text-2xl font-bold">
                {languageConfig.flag} {languageConfig.name}
              </div>
              <div className="text-sm text-blue-200 capitalize">{selectedDifficulty}</div>
            </div>
            <div className="text-right text-white">
              <div className="text-2xl font-bold">{score}/{questionCount + 1}</div>
              <div className="text-sm text-blue-200">Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-blue-200 mb-2">
              <span>Question {questionCount + 1}/10</span>
              <span>{timeLeft}s</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${((questionCount + 1) / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-4" dir={languageConfig.isRTL ? 'rtl' : 'ltr'}>
                {currentQuestion.word}
              </h2>
              
              {/* Audio Button */}
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                {isPlaying ? '🔊' : '🔊'}
              </button>
              
              <div className="text-sm text-blue-200 mt-2">
                {isPlaying ? 'Playing...' : 'Tap to hear pronunciation'}
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span dir={languageConfig.isRTL ? 'rtl' : 'ltr'}>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-6 p-4 rounded-xl text-center ${
                isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                <div className="text-2xl mb-2">
                  {isCorrect ? '✅ Correct!' : '❌ Try again!'}
                </div>
                {!isCorrect && (
                  <div className="text-sm">
                    Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* XP and Streak Display */}
          <div className="flex justify-center space-x-6 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{userProgress.xp}</div>
              <div className="text-sm text-blue-200">XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{userProgress.streak}</div>
              <div className="text-sm text-blue-200">Streak</div>
            </div>
          </div>
        </div>

        {/* Confetti */}
        <QuizConfetti
          show={showConfetti}
          type={confettiType}
          onComplete={() => setShowConfetti(false)}
        />
      </div>
    );
  }

  // Render result screen
  if (quizState === 'result') {
    const percentage = Math.round((score / 10) * 100);
    const isPerfect = score === 10;
    
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 ${className}`}>
        <div className="max-w-2xl mx-auto">
          {/* Result Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {isPerfect ? '🎉' : percentage >= 70 ? '🎊' : '📚'}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {isPerfect ? 'Perfect Score!' : percentage >= 70 ? 'Great Job!' : 'Keep Learning!'}
            </h1>
            <p className="text-xl text-blue-200">
              You scored {score}/10 ({percentage}%)
            </p>
          </div>

          {/* Score Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Quiz Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-blue-200">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{10 - score}</div>
                <div className="text-sm text-blue-200">Incorrect</div>
              </div>
            </div>
          </div>

          {/* Updated Progress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{userProgress.level}</div>
                <div className="text-sm text-blue-200">Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{userProgress.xp}</div>
                <div className="text-sm text-blue-200">XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{userProgress.streak}</div>
                <div className="text-sm text-blue-200">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{Math.round(userProgress.accuracy)}%</div>
                <div className="text-sm text-blue-200">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">🏆 New Achievements!</h2>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-500/20 rounded-xl">
                    <div className="text-2xl mr-3">🏆</div>
                    <div className="text-white font-semibold">
                      {quizProgressManager.getAchievementDescription(achievement)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-4 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
            >
              🔄 Play Again
            </button>
            <button
              onClick={resetQuiz}
              className="w-full bg-white/20 text-white text-lg font-semibold py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>

        {/* Confetti for perfect score */}
        {isPerfect && (
          <QuizConfetti
            show={true}
            type="celebration"
            duration={5000}
          />
        )}
      </div>
    );
  }

  return null;
};

export default LanguageLearningQuiz;
