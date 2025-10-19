'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  audio_url?: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, timeSpent: number) => void;
  isRTL?: boolean;
}

export default function QuizComponent({ questions, onComplete, isRTL = false }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === question.correct_answer;
    if (isCorrect) {
      setScore(score + 1);
      // Trigger confetti for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      onComplete(score, totalTime);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStartTime(Date.now());
  };

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? 'bg-purple-600 border-purple-500'
        : 'bg-gray-700 border-gray-600 hover:border-gray-500';
    }

    if (index === question.correct_answer) {
      return 'bg-green-600 border-green-500';
    }
    if (index === selectedAnswer && index !== question.correct_answer) {
      return 'bg-red-600 border-red-500';
    }
    return 'bg-gray-700 border-gray-600';
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-2xl mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            Score: <span className={getScoreColor()}>{score}/{questions.length}</span>
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">{question.question}</h3>
        
        {question.audio_url && (
          <button className="mb-4 p-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            <span className="text-white">🔊 Play Audio</span>
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${getOptionClass(index)}`}
            disabled={showResult}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{option}</span>
              {showResult && index === question.correct_answer && (
                <CheckCircle className="w-5 h-5 text-white" />
              )}
              {showResult && index === selectedAnswer && index !== question.correct_answer && (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-300 mb-2">Explanation:</h4>
          <p className="text-blue-100">{question.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {showResult && (
          <button
            onClick={handleNext}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
        
        <button
          onClick={handleRestart}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
