'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Star, 
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  audio_url?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  language: string;
  questions: QuizQuestion[];
}

interface LanguageQuizProps {
  selectedLanguages: string[];
}

export default function LanguageQuiz({ selectedLanguages }: LanguageQuizProps) {
  const { user } = useAuth();
  const t = useTranslation();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(selectedLanguages[0] || 'en');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const isRTL = selectedLanguage === 'ar';

  useEffect(() => {
    loadQuizzes();
  }, [selectedLanguage]);

  useEffect(() => {
    if (currentQuiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentQuiz && timeLeft === 0) {
      handleQuizComplete();
    }
  }, [timeLeft, currentQuiz]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      
      // Use local quiz data instead of Supabase
      const { QUIZ_QUESTIONS } = await import('../data/quizSystemData');
      const languageQuestions = QUIZ_QUESTIONS[selectedLanguage] || [];
      
      if (languageQuestions.length === 0) {
        setQuizzes([]);
        return;
      }

      // Create quiz sets by difficulty
      const easyQuestions = languageQuestions.filter(q => q.difficulty === 'easy');
      const mediumQuestions = languageQuestions.filter(q => q.difficulty === 'medium');
      const hardQuestions = languageQuestions.filter(q => q.difficulty === 'hard');

      const formattedQuizzes: Quiz[] = [];

      // Create Easy Quiz
      if (easyQuestions.length > 0) {
        formattedQuizzes.push({
          id: `${selectedLanguage}-easy`,
          title: `Easy ${getLanguageInfo(selectedLanguage).name} Quiz`,
          description: `Test your basic ${getLanguageInfo(selectedLanguage).name} vocabulary`,
          difficulty: 'easy',
          time_limit: 300, // 5 minutes
          language: selectedLanguage,
          questions: easyQuestions.slice(0, 5).map(q => ({
            id: q.id,
            question: `What is the ${selectedLanguage === 'ar' ? 'English' : getLanguageInfo(selectedLanguage).name} translation of "${q.word}"?`,
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: `The correct answer is "${q.translation}"`,
            audio_url: undefined
          }))
        });
      }

      // Create Medium Quiz
      if (mediumQuestions.length > 0) {
        formattedQuizzes.push({
          id: `${selectedLanguage}-medium`,
          title: `Medium ${getLanguageInfo(selectedLanguage).name} Quiz`,
          description: `Challenge yourself with intermediate ${getLanguageInfo(selectedLanguage).name} words`,
          difficulty: 'medium',
          time_limit: 600, // 10 minutes
          language: selectedLanguage,
          questions: mediumQuestions.slice(0, 7).map(q => ({
            id: q.id,
            question: `What is the ${selectedLanguage === 'ar' ? 'English' : getLanguageInfo(selectedLanguage).name} translation of "${q.word}"?`,
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: `The correct answer is "${q.translation}"`,
            audio_url: undefined
          }))
        });
      }

      // Create Hard Quiz
      if (hardQuestions.length > 0) {
        formattedQuizzes.push({
          id: `${selectedLanguage}-hard`,
          title: `Hard ${getLanguageInfo(selectedLanguage).name} Quiz`,
          description: `Master advanced ${getLanguageInfo(selectedLanguage).name} vocabulary`,
          difficulty: 'hard',
          time_limit: 900, // 15 minutes
          language: selectedLanguage,
          questions: hardQuestions.slice(0, 10).map(q => ({
          id: q.id,
            question: `What is the ${selectedLanguage === 'ar' ? 'English' : getLanguageInfo(selectedLanguage).name} translation of "${q.word}"?`,
          options: q.options,
            correct_answer: q.correctAnswer,
            explanation: `The correct answer is "${q.translation}"`,
            audio_url: undefined
          }))
        });
      }

      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(quiz.time_limit);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    if (!currentQuiz) return;

    setQuizCompleted(true);
    
    // For local quizzes, we just show the results
    // XP and progress tracking can be added later if needed
    console.log('Quiz completed with score:', score, 'out of', currentQuiz.questions.length);
  };

  const playAudio = (audioUrl: string) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(audioUrl);
    newAudio.addEventListener('ended', () => setIsPlaying(false));
    newAudio.addEventListener('error', () => {
      console.error('Audio playback error');
      setIsPlaying(false);
    });

    newAudio.play()
      .then(() => {
        setAudio(newAudio);
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('Audio play failed:', error);
        setIsPlaying(false);
      });
  };

  const toggleAudio = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Audio play failed:', error);
          setIsPlaying(false);
        });
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(0);
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getLanguageInfo = (langCode: string) => {
    const languages = {
      en: { name: 'English', flag: '🇺🇸', native: 'English' },
      ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
      nl: { name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
      id: { name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' },
      ms: { name: 'Malay', flag: '🇲🇾', native: 'Bahasa Melayu' },
      th: { name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
      km: { name: 'Khmer', flag: '🇰🇭', native: 'ខ្មែរ' }
    };
    return languages[langCode as keyof typeof languages] || { name: langCode, flag: '🌐', native: langCode };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (currentQuiz && !quizCompleted) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Quiz Header */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">{currentQuiz.title}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white/70">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div className="text-white/70">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-white text-lg leading-relaxed">{currentQuestion.question}</h4>
            {currentQuestion.audio_url && (
              <button
                onClick={() => playAudio(currentQuestion.audio_url!)}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'p-4 rounded-lg border-2 transition-all cursor-pointer ';
              
              if (showResult) {
                if (index === currentQuestion.correct_answer) {
                  optionClass += 'border-green-500 bg-green-500/20 text-green-400';
                } else if (index === selectedAnswer && index !== currentQuestion.correct_answer) {
                  optionClass += 'border-red-500 bg-red-500/20 text-red-400';
                } else {
                  optionClass += 'border-white/20 bg-white/10 text-white/70';
                }
              } else if (selectedAnswer === index) {
                optionClass += 'border-blue-500 bg-blue-500/20 text-blue-400';
              } else {
                optionClass += 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/15';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={optionClass}
                  disabled={showResult}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {showResult && index === currentQuestion.correct_answer && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentQuestion.correct_answer && (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-left">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <div className="text-blue-400 font-medium mb-2">Explanation:</div>
              <div className="text-blue-300 text-sm">{currentQuestion.explanation}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={resetQuiz}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Quiz</span>
            </button>
            
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && currentQuiz) {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    const xpEarned = Math.floor(percentage);

    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
          <p className="text-white/70">Great job on completing the quiz</p>
        </div>

        <div className="bg-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-white/70 text-sm">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{percentage}%</div>
              <div className="text-white/70 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">+{xpEarned}</div>
              <div className="text-white/70 text-sm">XP Earned</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Tabs */}
      {selectedLanguages.length > 1 && (
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">Select Language:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((lang) => {
              const langInfo = getLanguageInfo(lang);
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{langInfo.flag}</span>
                  {langInfo.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          {getLanguageInfo(selectedLanguage).name} Quizzes
        </h2>

        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white/70 text-lg mb-2">No Quizzes Available</h3>
            <p className="text-white/50 text-sm">
              Quizzes for {getLanguageInfo(selectedLanguage).name} will be available soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => startQuiz(quiz)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold">{quiz.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <p className="text-white/70 text-sm mb-4">{quiz.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-white/70 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(quiz.time_limit / 60)} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
