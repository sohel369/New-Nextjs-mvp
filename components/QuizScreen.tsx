import React, { useState, useCallback, useRef, useEffect, useMemo, memo } from 'react';
import { Volume2, Check, X, Play, PartyPopper, RotateCcw } from 'lucide-react';
import { getQuizQuestions, getLanguageInfo, getTranslation } from '../lib/quizDataLoader';
import QuizResults from './QuizResults';
import Confetti from './Confetti';

interface QuizScreenProps {
  selectedLanguage: string;
  onSpeakText?: (text: string, language: string) => void;
  onFinish?: (score: number, total: number) => void;
  onQuestionChange?: (question: number, total: number) => void;
  onQuizStart?: () => void;
  onResetQuiz?: () => void;
  quizType?: string;
}

const QuizScreen: React.FC<QuizScreenProps> = memo(({ 
  selectedLanguage, 
  onSpeakText, 
  onFinish, 
  onQuestionChange, 
  onQuizStart,
  onResetQuiz,
  quizType = 'enhanced'
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize expensive calculations using optimized loaders
  const currentLanguage = useMemo(() => 
    getLanguageInfo(selectedLanguage),
    [selectedLanguage]
  );

  const questions = useMemo(() => 
    getQuizQuestions(selectedLanguage),
    [selectedLanguage]
  );

  const currentQuestionObj = useMemo(() => 
    questions[currentQuestion],
    [questions, currentQuestion]
  );

  // Memoize translation function using optimized loader
  const t = useCallback((key: string) => {
    return getTranslation(selectedLanguage, key);
  }, [selectedLanguage]);

  // Notify parent component of question changes
  useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange(currentQuestion + 1, questions.length);
    }
  }, [currentQuestion, questions.length, onQuestionChange]);

  // Memoize Arabic text detection
  const isQuestionArabic = useMemo(() => 
    /[\u0600-\u06FF]/.test(currentQuestionObj?.question || ''),
    [currentQuestionObj?.question]
  );

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showResult) return; // prevent multiple clicks
      
      // Start quiz if not started
      if (onQuizStart) {
        onQuizStart();
      }
      
      setSelectedAnswer(answerIndex);
      setShowResult(true);

      let isCorrect = false;

      if (currentQuestionObj.type === "true_false") {
        isCorrect = (answerIndex === 0 && currentQuestionObj.correct === true) || 
                   (answerIndex === 1 && currentQuestionObj.correct === false);
      } else if (currentQuestionObj.type === "multiple_choice") {
        isCorrect = answerIndex === currentQuestionObj.correct;
      } else if (currentQuestionObj.type === "fill_blank") {
        isCorrect = currentQuestionObj.options?.[answerIndex] === currentQuestionObj.blank;
      }

      if (isCorrect) {
        setQuizScore((prev) => prev + 1);
        // Clear any existing timeout
        if (confettiTimeoutRef.current) {
          clearTimeout(confettiTimeoutRef.current);
        }
        // Trigger confetti animation for correct answers
        setShowConfetti(true);
        // Stop confetti after 3 seconds
        confettiTimeoutRef.current = setTimeout(() => {
          setShowConfetti(false);
          confettiTimeoutRef.current = null;
        }, 3000);
      }
      setIsCurrentCorrect(isCorrect);

      // Speak selected answer
      const answerText = currentQuestionObj.options?.[answerIndex] || '';
      const lang = /[\u0600-\u06FF]/.test(answerText) ? "arabic" : selectedLanguage;
      if (onSpeakText) {
        onSpeakText(answerText, lang);
      } else {
        // Fallback TTS
        speakText(answerText, lang);
      }
    },
    [currentQuestionObj, selectedLanguage, showResult, onSpeakText, onQuizStart]
  );

  const handleShortAnswer = useCallback(() => {
    if (showResult || !userAnswer.trim()) return;
    
    // Start quiz if not started
    if (onQuizStart) {
      onQuizStart();
    }
    
    setShowResult(true);

    const correctAnswer = currentQuestionObj.answer?.toLowerCase().trim() || '';
    const userAns = userAnswer.toLowerCase().trim();
    const isCorrectBool = userAns === correctAnswer;

    setSelectedAnswer(userAnswer);
    if (isCorrectBool) {
      setQuizScore((prev) => prev + 1);
      // Clear any existing timeout
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
      // Trigger confetti animation for correct answers
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      confettiTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false);
        confettiTimeoutRef.current = null;
      }, 3000);
    }
    setIsCurrentCorrect(isCorrectBool);

    // Speak user's answer
    const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
    if (onSpeakText) {
      onSpeakText(userAnswer, lang);
    } else {
      // Fallback TTS
      speakText(userAnswer, lang);
    }
  }, [userAnswer, currentQuestionObj, selectedLanguage, showResult, onSpeakText, onQuizStart]);

  const speakText = useCallback((text: string, language: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on content
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

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setUserAnswer("");
    setShowResult(false);
    setIsCurrentCorrect(false);
    setShowConfetti(false);
    // Clear any pending confetti timeout
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = null;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz finished
      console.log('Quiz completed! Score:', quizScore, 'Total:', questions.length);
      setQuizFinished(true);
      if (onFinish) {
        onFinish(quizScore, questions.length);
      }
    }
  }, [currentQuestion, questions.length, quizScore, onFinish]);

  if (!currentQuestionObj) return <div>Loading quiz...</div>;

  // Show results screen if quiz is finished
  if (quizFinished) {
    return (
      <QuizResults
        score={quizScore}
        total={questions.length}
        onRetake={() => {
          setQuizFinished(false);
          setCurrentQuestion(0);
          setQuizScore(0);
          setSelectedAnswer(null);
          setUserAnswer('');
          setShowResult(false);
          setIsCurrentCorrect(false);
          setShowConfetti(false);
        }}
        onGoHome={() => {
          // Navigate to home or dashboard
          window.location.href = '/dashboard';
        }}
        language={selectedLanguage}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 pb-32 min-h-screen">
      {/* Enhanced Confetti Animation */}
      <Confetti show={showConfetti} duration={3000} />
      
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">
          Question {currentQuestion + 1}/{questions.length}
        </h2>
      </div>

      {/* Question Card */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        {/* Category and Difficulty Tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
              {currentQuestionObj.category?.toUpperCase() || 'GENERAL'}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
              {currentQuestionObj.difficulty?.toUpperCase() || 'BEGINNER'}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <p
          className={`text-white text-lg mb-6 ${isQuestionArabic ? "text-right" : "text-left"}`}
          dir={isQuestionArabic ? "rtl" : "auto"}
        >
          {currentQuestionObj.question}
        </p>

        {/* Answer Options */}
        {currentQuestionObj.type === "short_answer" ? (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={
                isQuestionArabic
                  ? "اكْتُبْ إِجَابَتَكَ هُنَا..."
                  : "Enter your answer here..."
              }
              className={`w-full p-4 rounded-xl text-white bg-slate-700 border-2 focus:outline-none focus:border-blue-400 ${showResult
                ? isCurrentCorrect
                  ? "border-green-400 bg-green-600"
                  : "border-red-400 bg-red-600"
                : "border-transparent"
                }`}
              dir={isQuestionArabic ? "rtl" : "auto"}
            />
            {!showResult && (
              <button
                onClick={handleShortAnswer}
                className="w-full px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500"
              >
                Submit Answer
              </button>
            )}
            {showResult && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  {isCurrentCorrect ? (
                    <Check className="text-green-400" />
                  ) : (
                    <X className="text-red-400" />
                  )}
                  <button
                    onClick={() => {
                      const lang = /[\u0600-\u06FF]/.test(userAnswer)
                        ? "arabic"
                        : selectedLanguage;
                      onSpeakText && onSpeakText(userAnswer, lang);
                    }}
                    className="text-blue-400"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                {!isCurrentCorrect && (
                  <div className="space-y-2">
                    <div className="text-green-400 font-medium">
                      {t('correctAnswer')}: {currentQuestionObj.answer || ''}
                    </div>
                    <span
                      onClick={() => onSpeakText && onSpeakText(currentQuestionObj.answer || '', "arabic")}
                      className="text-blue-400 flex items-center cursor-pointer hover:text-blue-300"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSpeakText && onSpeakText(currentQuestionObj.answer || '', "arabic");
                        }
                      }}
                    >
                      <Volume2 size={16} className="mr-1" />
                      Hear correct answer
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : currentQuestionObj.type === "true_false" ? (
          <div className="space-y-3">
            <button
              onClick={() => handleAnswer(0)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-white transition-all duration-200 text-center ${
                showResult
                  ? currentQuestionObj.correct === true
                    ? "bg-green-600 border-2 border-green-400"
                    : selectedAnswer === 0
                      ? "bg-red-600 border-2 border-red-400"
                      : "bg-slate-700"
                  : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent hover:border-slate-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>True</span>
                {showResult && (
                  <>
                    {currentQuestionObj.correct === true && (
                      <Check className="text-green-400" />
                    )}
                    {selectedAnswer === 0 && currentQuestionObj.correct !== true && (
                      <X className="text-red-400" />
                    )}
                  </>
                )}
              </div>
            </button>
            <button
              onClick={() => handleAnswer(1)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-white transition-all duration-200 text-center ${
                showResult
                  ? currentQuestionObj.correct === false
                    ? "bg-green-600 border-2 border-green-400"
                    : selectedAnswer === 1
                      ? "bg-red-600 border-2 border-red-400"
                      : "bg-slate-700"
                  : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent hover:border-slate-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>False</span>
                {showResult && (
                  <>
                    {currentQuestionObj.correct === false && (
                      <Check className="text-green-400" />
                    )}
                    {selectedAnswer === 1 && currentQuestionObj.correct !== false && (
                      <X className="text-red-400" />
                    )}
                  </>
                )}
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentQuestionObj.options?.map((option, index) => {
              const isArabic = /[\u0600-\u06FF]/.test(option);
              const lang = isArabic ? "arabic" : selectedLanguage;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-white transition-all duration-200 ${isArabic ? "text-right" : "text-left"
                    } ${showResult
                      ? index === currentQuestionObj.correct
                        ? "bg-green-600 border-2 border-green-400"
                        : selectedAnswer === index
                          ? "bg-red-600 border-2 border-red-400"
                          : "bg-slate-700"
                      : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent hover:border-slate-500"
                    }`}
                  dir={isArabic ? "rtl" : "auto"}
                >
                  <div className="flex justify-between items-center">
                    <span dir={isArabic ? "rtl" : "auto"}>{option}</span>
                    {showResult && (
                      <>
                        {index === currentQuestionObj.correct && (
                          <Check className="text-green-400" />
                        )}
                        {selectedAnswer === index &&
                          index !== currentQuestionObj.correct && (
                            <X className="text-red-400" />
                          )}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onSpeakText && onSpeakText(option, lang);
                          }}
                          className="text-blue-400 ml-2 hover:text-blue-300 cursor-pointer inline-flex items-center"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              onSpeakText && onSpeakText(option, lang);
                            }
                          }}
                        >
                          <Volume2 size={16} />
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showResult && (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={nextQuestion}
            className="flex-1 px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? t('nextQuestion') : t('finishQuiz')}
          </button>
          {onResetQuiz && (
            <button
              onClick={onResetQuiz}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 rounded-xl text-white font-medium hover:bg-red-500 transition-colors"
              title="Reset Quiz"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

QuizScreen.displayName = 'QuizScreen';

export default QuizScreen;