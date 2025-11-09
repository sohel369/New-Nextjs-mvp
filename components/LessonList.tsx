'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LESSONS_DATA, Lesson } from '../data/lessonsData';
import { Clock, Star, Target, BookOpen, Play, Trophy } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from './BottomNavigation';

interface LessonListProps {
  onSelectLesson?: (lesson: Lesson) => void;
  language?: string;
  isRTL?: boolean;
}

export default function LessonList({ onSelectLesson, language, isRTL }: LessonListProps) {
  const { currentLanguage } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  
  // Use passed language prop or fall back to context
  const selectedLanguage = language || currentLanguage;
  const lessons = LESSONS_DATA[String(selectedLanguage) as keyof typeof LESSONS_DATA] || LESSONS_DATA['en'];
  
  const filteredLessons = selectedLevel === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.level === selectedLevel);

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'text-blue-400 bg-blue-400/20';
      case 'intermediate': return 'text-purple-400 bg-purple-400/20';
      case 'advanced': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-16 sm:pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-all duration-200 hover:scale-105"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 sm:mb-4">
              Language Lessons
            </h1>
            <p className="text-white/70 text-sm sm:text-base md:text-lg">
              Master {String(currentLanguage).toUpperCase()} with interactive lessons
            </p>
          </div>
        </div>

        {/* Level Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-all duration-200 text-xs sm:text-sm font-medium ${
                  selectedLevel === level
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredLessons.map((lesson: Lesson) => (
            <div
              key={lesson.id}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              {/* Lesson Header */}
              <div className="mb-3 sm:mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors flex-1 pr-2">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium text-xs sm:text-sm">{lesson.xp} XP</span>
                  </div>
                </div>
                
                <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                  {lesson.description}
                </p>
              </div>

              {/* Lesson Stats */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>
                  {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                </div>
                <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-400/20">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.duration}</span>
                </div>
              </div>

              {/* Exercise Count */}
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span className="text-white/70 text-xs sm:text-sm">
                  {lesson.exercises.length} exercises
                </span>
              </div>

              {/* Action Button */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectLesson?.(lesson)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group text-xs sm:text-sm"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                  <span>Start Lesson</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-white/70 mb-2">No lessons found</h3>
            <p className="text-white/50 text-sm sm:text-base">Try selecting a different level or language.</p>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation - Fixed */}
      <div className="flex-shrink-0">
        <BottomNavigation />
      </div>
    </div>
  );
}