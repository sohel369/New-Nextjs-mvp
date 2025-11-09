'use client';

import React, { useState, useEffect } from 'react';
import { Lesson, Exercise } from '../data/lessonsData';
import QuestionCard from './QuestionCard';
import AICoach from './AICoach';
import LessonCompletionModal from './LessonCompletionModal';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Trophy, Star, Target } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from './BottomNavigation';

interface LessonDetailProps {
  lesson: Lesson;
  isRTL?: boolean;
  onBack?: () => void;
}

export default function LessonDetail({ lesson, isRTL = false, onBack }: LessonDetailProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<Array<{exerciseId: number, answer: string, timestamp: Date, isCorrect?: boolean, correctAnswer?: string}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [aiCoachMessages, setAiCoachMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);

  const currentExerciseData = lesson.exercises[currentExercise];
  const progress = ((currentExercise + 1) / lesson.exercises.length) * 100;
  const isLastExercise = currentExercise === lesson.exercises.length - 1;
  const isCompleted = userAnswers.length === lesson.exercises.length;

  // Initialize AI Coach with lesson-specific welcome
  useEffect(() => {
    setAiCoachMessages([
      {
        id: '1',
        type: 'ai',
        content: `Welcome to "${lesson.title}"! I'm here to help you practice ${lesson.language.toUpperCase()}. Let's start with the first exercise!`,
        timestamp: new Date()
      }
    ]);
  }, [lesson]);

  const handleAnswer = (answer: string) => {
    if (!answer.trim()) return;

    // Validate answer and determine if correct
    const isCorrect = validateAnswer(answer.trim(), currentExerciseData);
    const correctAnswer = getCorrectAnswer(currentExerciseData);

    // Save user answer with validation results
    const newAnswer = {
      exerciseId: currentExerciseData.id,
      answer: answer.trim(),
      timestamp: new Date(),
      isCorrect,
      correctAnswer
    };
    setUserAnswers(prev => [...prev, newAnswer]);

    // Add user message to AI Coach
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: answer.trim(),
      timestamp: new Date()
    };
    setAiCoachMessages(prev => [...prev, userMessage]);

    // Generate AI feedback
    const aiFeedback = generateAIFeedback(answer, currentExerciseData);
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai' as const,
      content: aiFeedback,
      timestamp: new Date()
    };
    setAiCoachMessages(prev => [...prev, aiMessage]);

    // Clear current answer
    setUserAnswer("");

    // Move to next exercise after delay
    setTimeout(() => {
      if (!isLastExercise) {
        goToNext();
      }
    }, 2000);
  };

  const goToNext = () => {
    if (currentExercise < lesson.exercises.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentExercise(currentExercise + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPrevious = () => {
    if (currentExercise > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentExercise(currentExercise - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Answer validation function
  const validateAnswer = (userAnswer: string, exercise: Exercise): boolean => {
    if (!exercise.correctAnswer) {
      // If no correct answer is defined, use basic validation
      return userAnswer.length > 2;
    }
    
    // Simple validation - can be enhanced based on exercise type
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = exercise.correctAnswer.toLowerCase().trim();
    
    return normalizedUserAnswer === normalizedCorrectAnswer || 
           normalizedUserAnswer.includes(normalizedCorrectAnswer) ||
           normalizedCorrectAnswer.includes(normalizedUserAnswer);
  };

  // Get correct answer for display
  const getCorrectAnswer = (exercise: Exercise): string => {
    return exercise.correctAnswer || 'No specific correct answer defined';
  };

  const generateAIFeedback = (answer: string, exercise: Exercise): string => {
    const encouragingFeedbacks = [
      "Excellent! That's a great answer!",
      "Perfect! You're doing fantastic!",
      "Wonderful! Keep up the great work!",
      "Amazing! You're learning so well!",
      "Outstanding! That was exactly right!",
      "Brilliant! You're mastering this!",
      "Fantastic! Your pronunciation is improving!",
      "Superb! You're becoming fluent!",
      "Great job! That's the correct answer!",
      "Well done! You're making excellent progress!"
    ];

    const supportiveFeedbacks = [
      "Good try! You're on the right track!",
      "Nice attempt! Keep practicing!",
      "Good effort! You're getting there!",
      "Well done! Every attempt helps you learn!",
      "Keep going! You're making progress!",
      "Good work! Practice makes perfect!",
      "Nice try! You're improving with each exercise!",
      "Great effort! Learning takes time!",
      "Good job! You're building confidence!",
      "Keep it up! You're doing great!"
    ];

    // Analyze answer quality
    const answerLength = answer.trim().length;
    const hasNumbers = /\d/.test(answer);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(answer);
    
    if (answerLength > 5 && !hasSpecialChars) {
      return encouragingFeedbacks[Math.floor(Math.random() * encouragingFeedbacks.length)];
    } else if (answerLength > 2) {
      return supportiveFeedbacks[Math.floor(Math.random() * supportiveFeedbacks.length)];
    } else {
      return "Good start! Try to give a more detailed answer next time!";
    }
  };

  if (isCompleted) {
    return (
      <LessonCompletionModal
        lesson={lesson}
        userAnswers={userAnswers}
        onRetake={() => {
          setCurrentExercise(0);
          setUserAnswers([]);
          setUserAnswer("");
        }}
        onBack={onBack || (() => {})}
        isRTL={isRTL}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-16 sm:pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-all duration-200 hover:scale-105 self-start"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">Back to Lessons</span>
            </button>
            
            <div className="text-center sm:text-right">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {lesson.title}
              </h1>
              <p className="text-white/70 text-xs sm:text-sm md:text-base mt-1">
                {lesson.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-white/20">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                  <span className="text-xs sm:text-sm font-medium text-white">
                    Exercise {currentExercise + 1} of {lesson.exercises.length}
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-lg px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-white/20">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-yellow-400 font-medium">
                    {userAnswers.length} completed
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-white/20">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-white">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Exercise Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} ${isRTL ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}>
              <QuestionCard
                exercise={currentExerciseData}
                onAnswer={handleAnswer}
                isRTL={isRTL}
                disabled={!!userAnswer}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={goToPrevious}
                disabled={currentExercise === 0 || isTransitioning}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Previous</span>
              </button>

              <button
                onClick={goToNext}
                disabled={currentExercise === lesson.exercises.length - 1 || isTransitioning}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
              >
                <span className="font-medium">Next</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* AI Coach Section */}
          <div className="lg:sticky lg:top-6">
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} ${isRTL ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
              <AICoach
                language={lesson.language}
                isRTL={isRTL}
                initialMessages={aiCoachMessages}
                onNewMessage={(message) => {
                  setAiCoachMessages(prev => [...prev, message]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation - Fixed */}
      <div className="flex-shrink-0">
        <BottomNavigation />
      </div>
    </div>
  );
}
