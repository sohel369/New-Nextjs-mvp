import React, { useState, useCallback, useEffect } from 'react';
import { Volume2, Check, X, Play, Pause, RotateCcw, Target, Clock, Star, PartyPopper } from 'lucide-react';
import { ENHANCED_QUIZ_QUESTIONS, INTERFACE_LANGUAGES, TRANSLATIONS } from '../data/languageData';
import Confetti from './Confetti';

interface EnhancedQuizProps {
  selectedLanguage: string;
  onFinish: (score: number, total: number, timeSpent: number) => void;
  onQuestionComplete?: (questionIndex: number, isCorrect: boolean, answer: string) => void;
}

const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ 
  selectedLanguage, 
  onFinish, 
  onQuestionComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Get current language with RTL support
  const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage as keyof typeof INTERFACE_LANGUAGES];

  // Translation function
  const t = (key: string) => {
    return TRANSLATIONS[selectedLanguage as keyof typeof TRANSLATIONS]?.[key as keyof typeof TRANSLATIONS.english] || TRANSLATIONS.english[key as keyof typeof TRANSLATIONS.english] || key;
  };

  const questions = ENHANCED_QUIZ_QUESTIONS[selectedLanguage as keyof typeof ENHANCED_QUIZ_QUESTIONS] || ENHANCED_QUIZ_QUESTIONS.english;
  const currentQuestionObj = questions[currentQuestion];

  // Check if question contains Arabic text
  const isQuestionArabic = /[\u0600-\u06FF]/.test(currentQuestionObj?.question || '');

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset question timer when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showResult) return; // prevent multiple clicks
      setSelectedAnswer(answerIndex);
      setShowResult(true);

      let isCorrect = false;

      if (currentQuestionObj.type === "true_false") {
        isCorrect = (answerIndex === 0 && currentQuestionObj.correct === true) || 
                   (answerIndex === 1 && currentQuestionObj.correct === false);
      } else if (currentQuestionObj.type === "multiple_choice") {
        isCorrect = answerIndex === currentQuestionObj.correct;
      } else if (currentQuestionObj.type === "fill_blank") {
        isCorrect = currentQuestionObj.options?.[answerIndex] === currentQuestionObj.correct;
      }

      if (isCorrect) {
        setQuizScore((prev) => prev + 1);
        setShowConfetti(true);
        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 2000);
      }
      setIsCurrentCorrect(isCorrect);

      // Call question complete callback
      if (onQuestionComplete) {
        const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
        onQuestionComplete(currentQuestion, isCorrect, currentQuestionObj.options?.[answerIndex] || '');
      }

      // Speak selected answer
      const answerText = currentQuestionObj.options?.[answerIndex];
      if (answerText) {
        const lang = /[\u0600-\u06FF]/.test(answerText) ? "arabic" : selectedLanguage;
        speakText(answerText, lang);
      }
    },
    [currentQuestionObj, selectedLanguage, showResult, onQuestionComplete, currentQuestion, questionStartTime]
  );

  const handleShortAnswer = useCallback(() => {
    if (showResult || !userAnswer.trim()) return;
    setShowResult(true);

    const correctAnswer = (currentQuestionObj.answer || '').toLowerCase().trim();
    const userAns = userAnswer.toLowerCase().trim();
    const isCorrectBool = userAns === correctAnswer;

    setSelectedAnswer(userAnswer);
    if (isCorrectBool) {
      setQuizScore((prev) => prev + 1);
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setIsCurrentCorrect(isCorrectBool);

    // Call question complete callback
    if (onQuestionComplete) {
      const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
      onQuestionComplete(currentQuestion, isCorrectBool, userAnswer);
    }

    // Speak user's answer
    const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
    speakText(userAnswer, lang);
  }, [userAnswer, currentQuestionObj, selectedLanguage, showResult, onQuestionComplete, currentQuestion, questionStartTime]);

  const speakText = (text: string, language: string) => {
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
      
      // Add event listeners
      utterance.onstart = () => console.log('Speech started');
      utterance.onend = () => console.log('Speech ended');
      utterance.onerror = (event) => console.error('Speech error:', event.error);
      
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  };

  const playAudio = () => {
    if (currentQuestionObj.audioUrl) {
      if (audioElement) {
        audioElement.pause();
      }
      
      const audio = new Audio(currentQuestionObj.audioUrl);
      setAudioElement(audio);
      setIsPlaying(true);
      
      audio.play();
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback failed');
      };
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setUserAnswer("");
    setShowResult(false);
    setIsCurrentCorrect(false);
    setIsPlaying(false);
    setShowConfetti(false);
    
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz finished - ensure we call onFinish
      console.log('Quiz completed! Score:', quizScore, 'Total:', questions.length, 'Time:', timeSpent);
      if (onFinish) {
        onFinish(quizScore, questions.length, timeSpent);
      }
    }
  };

  if (!currentQuestionObj) return <div className="text-white">Loading quiz...</div>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 p-4 pb-32 min-h-screen">
      {/* Confetti Animation */}
      <Confetti show={showConfetti} duration={3000} />
      
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <Target className="w-5 h-5" />
            <span className="font-semibold">
              {t('question')} {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">{quizScore}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-white">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">{formatTime(timeSpent)}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-white text-xl font-semibold mb-4">
          {currentQuestionObj.category.charAt(0).toUpperCase() + currentQuestionObj.category.slice(1)} • {currentQuestionObj.difficulty.charAt(0).toUpperCase() + currentQuestionObj.difficulty.slice(1)}
        </h3>
        
        <p
          className={`text-white text-lg mb-4 ${isQuestionArabic ? "text-right" : "text-left"}`}
          dir={isQuestionArabic ? "rtl" : "auto"}
        >
          {currentQuestionObj.question}
        </p>

        {/* Audio Player for audio questions */}
        {currentQuestionObj.type === "audio_pronunciation" || currentQuestionObj.type === "listening" ? (
          <div className="mb-6">
            <button
              onClick={playAudio}
              disabled={!currentQuestionObj.audioUrl}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
            </button>
          </div>
        ) : null}
      </div>

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
            className={`w-full p-4 rounded-xl text-white bg-slate-700 border-2 focus:outline-none focus:border-blue-400 ${
              showResult
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
              className="w-full px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500 transition-colors"
            >
              Submit Answer
            </button>
          )}
        </div>
      ) : currentQuestionObj.type === "true_false" ? (
        <div className="space-y-2">
          <button
            onClick={() => handleAnswer(0)}
            disabled={showResult}
            className={`w-full p-4 rounded-xl text-white transition-all text-center ${
              showResult
                ? currentQuestionObj.correct === true
                  ? "bg-green-600 border-2 border-green-400"
                  : selectedAnswer === 0
                    ? "bg-red-600 border-2 border-red-400"
                    : "bg-slate-700"
                : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent hover:border-slate-600"
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
            className={`w-full p-4 rounded-xl text-white transition-all text-center ${
              showResult
                ? currentQuestionObj.correct === false
                  ? "bg-green-600 border-2 border-green-400"
                  : selectedAnswer === 1
                    ? "bg-red-600 border-2 border-red-400"
                    : "bg-slate-700"
                : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent hover:border-slate-600"
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
        <div className="space-y-2">
          {currentQuestionObj.options?.map((option, index) => {
            const isArabic = /[\u0600-\u06FF]/.test(option);
            const lang = isArabic ? "arabic" : selectedLanguage;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-white transition-all ${
                  isArabic ? "text-right" : "text-left"
                } ${
                  showResult
                    ? index === currentQuestionObj.correct
                      ? "bg-green-600 border-2 border-green-400"
                      : selectedAnswer === index
                        ? "bg-red-600 border-2 border-red-400"
                        : "bg-slate-700"
                    : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent hover:border-slate-600"
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(option, lang);
                        }}
                        className="text-blue-400 ml-2 hover:text-blue-300"
                      >
                        <Volume2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Result Display */}
      {showResult && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${
            isCurrentCorrect 
              ? 'bg-green-600/20 border border-green-400' 
              : 'bg-red-600/20 border border-red-400'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isCurrentCorrect ? (
                <Check className="text-green-400" />
              ) : (
                <X className="text-red-400" />
              )}
              <span className={`font-semibold ${
                isCurrentCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCurrentCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            
            {!isCurrentCorrect && currentQuestionObj.explanation && (
              <p className="text-white/80 text-sm">
                <strong>Explanation:</strong> {currentQuestionObj.explanation}
              </p>
            )}
          </div>

          <button
            onClick={nextQuestion}
            className="w-full px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? t('nextQuestion') : t('finishQuiz')}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedQuiz;