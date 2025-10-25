'use client';

import React from 'react';
import { CheckCircle, XCircle, Trophy, Star, Target, Clock, RotateCcw, ArrowLeft } from 'lucide-react';

interface UserAnswer {
  exerciseId: number;
  answer: string;
  timestamp: Date;
  isCorrect?: boolean;
  correctAnswer?: string;
}

interface Exercise {
  id: number;
  question: string;
  type: string;
  correctAnswer?: string;
  options?: string[];
}

interface LessonCompletionModalProps {
  lesson: {
    title: string;
    description: string;
    exercises: Exercise[];
    xp: number;
    language: string;
  };
  userAnswers: UserAnswer[];
  onRetake: () => void;
  onBack: () => void;
  isRTL?: boolean;
}

export default function LessonCompletionModal({ 
  lesson, 
  userAnswers, 
  onRetake, 
  onBack, 
  isRTL = false 
}: LessonCompletionModalProps) {
  // Calculate accuracy and statistics
  const totalExercises = lesson.exercises.length;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const accuracy = Math.round((correctAnswers / totalExercises) * 100);
  const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);
  
  // Calculate time spent (approximate)
  const startTime = userAnswers[0]?.timestamp;
  const endTime = userAnswers[userAnswers.length - 1]?.timestamp;
  const timeSpent = startTime && endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) : 0; // minutes

  // Determine performance level
  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (accuracy >= 80) return { level: 'Great', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (accuracy >= 70) return { level: 'Good', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    if (accuracy >= 60) return { level: 'Fair', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    return { level: 'Needs Practice', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  };

  const performance = getPerformanceLevel(accuracy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-green-500/30 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              🎉 Congratulations! 🎉
            </h2>
            
            <p className="text-white/80 text-lg mb-2">
              You've completed "{lesson.title}" successfully!
            </p>
            
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${performance.bgColor} border border-current`}>
              <span className={`font-semibold ${performance.color}`}>
                {performance.level} Performance
              </span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{accuracy}%</p>
              <p className="text-white/70 text-sm">Accuracy</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{correctAnswers}</p>
              <p className="text-white/70 text-sm">Correct</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{incorrectAnswers.length}</p>
              <p className="text-white/70 text-sm">Incorrect</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{lesson.xp}</p>
              <p className="text-white/70 text-sm">XP Earned</p>
            </div>
          </div>

          {/* Time and Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">Time Spent</p>
                  <p className="text-white/70">{timeSpent} minutes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-white font-semibold">Exercises Completed</p>
                  <p className="text-white/70">{totalExercises} of {totalExercises}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Incorrect Answers Review */}
          {incorrectAnswers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
                Review Incorrect Answers
              </h3>
              
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {incorrectAnswers.map((answer, index) => {
                  const exercise = lesson.exercises.find(ex => ex.id === answer.exerciseId);
                  return (
                    <div key={index} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">
                            Question {lesson.exercises.findIndex(ex => ex.id === answer.exerciseId) + 1}
                          </p>
                          <p className="text-white/80 text-sm mb-2">{exercise?.question}</p>
                          <div className="space-y-1">
                            <p className="text-red-300 text-sm">
                              <span className="font-medium">Your answer:</span> {answer.answer}
                            </p>
                            {answer.correctAnswer && (
                              <p className="text-green-300 text-sm">
                                <span className="font-medium">Correct answer:</span> {answer.correctAnswer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Lessons</span>
            </button>
            
            <button
              onClick={onRetake}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Lesson</span>
            </button>
          </div>

          {/* Motivational Message */}
          <div className="mt-8 text-center">
            {accuracy >= 80 ? (
              <p className="text-green-300 text-lg font-medium">
                🌟 Outstanding work! You're mastering {lesson.language.toUpperCase()}! 🌟
              </p>
            ) : accuracy >= 60 ? (
              <p className="text-blue-300 text-lg font-medium">
                💪 Great progress! Keep practicing to improve even more! 💪
              </p>
            ) : (
              <p className="text-yellow-300 text-lg font-medium">
                📚 Don't worry! Practice makes perfect. Try the lesson again! 📚
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
