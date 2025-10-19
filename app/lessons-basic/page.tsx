'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Play, Pause, CheckCircle, Star, Volume2, BookOpen, Target, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { VOCABULARY_DATA, VOCABULARY_CATEGORIES, VocabularyWord } from '../../data/vocabularyData';
import { audioService } from '../../lib/audioService';

export default function BasicLessonsPage() {
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());
  const [learningMode, setLearningMode] = useState<'english' | 'arabic'>('english');

  // Memoized filtered words for better performance
  const currentWords = useMemo(() => {
    let filtered = VOCABULARY_DATA.filter(word => word.difficulty === selectedLevel);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(word => word.category === selectedCategory);
    }
    
    return filtered;
  }, [selectedLevel, selectedCategory]);

  const currentWord = currentWords[currentWordIndex];

  // Get available categories for current level
  const availableCategories = useMemo(() => {
    const categories = new Set(
      VOCABULARY_DATA
        .filter(word => word.difficulty === selectedLevel)
        .map(word => word.category)
    );
    return Array.from(categories);
  }, [selectedLevel]);

  // Enhanced audio handling with high-quality service
  const handlePlayAudio = useCallback(async () => {
    if (!currentWord) return;
    
    try {
      setIsPlaying(true);
      
      if (learningMode === 'english') {
        // Learning English - speak English word
        await audioService.speakVocabulary(currentWord.english, 'english');
      } else {
        // Learning Arabic - speak Arabic word
        await audioService.speakVocabulary(currentWord.arabic, 'arabic');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [currentWord, learningMode]);

  // Play transliteration for Arabic learning
  const handlePlayTransliteration = useCallback(async () => {
    if (!currentWord) return;
    
    try {
      setIsPlaying(true);
      await audioService.speakVocabulary(currentWord.arabicTransliteration, 'english', true);
    } catch (error) {
      console.error('Transliteration playback error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [currentWord]);

  const handleMasterWord = useCallback(() => {
    if (currentWord && !masteredWords.has(currentWord.id)) {
      setMasteredWords(prev => new Set([...prev, currentWord.id]));
    }
  }, [currentWord, masteredWords]);

  // Reset word index when level or category changes
  useEffect(() => {
    setCurrentWordIndex(0);
    setShowTranslation(false);
  }, [selectedLevel, selectedCategory]);

  // Calculate progress
  const progress = useMemo(() => {
    if (currentWords.length === 0) return 0;
    return Math.round((masteredWords.size / currentWords.length) * 100);
  }, [masteredWords.size, currentWords.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4">
        <Link href="/" className="flex items-center space-x-3 text-white mb-6 hover:text-purple-300">
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Vocabulary Lessons</h1>
          <p className="text-gray-400">Learn {learningMode === 'english' ? 'English' : 'Arabic'} vocabulary</p>
        </div>

        {/* Learning Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800/50 rounded-xl p-1 flex">
            <button
              onClick={() => setLearningMode('english')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                learningMode === 'english'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🇺🇸 Learn English
            </button>
            <button
              onClick={() => setLearningMode('arabic')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                learningMode === 'arabic'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🇸🇦 Learn Arabic
            </button>
          </div>
        </div>

        {/* Level Selector */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLevel === level
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">
                {level === 'beginner' ? '🌱' : level === 'intermediate' ? '📚' : '🏆'}
              </div>
              <div className="text-sm font-medium text-white capitalize">{level}</div>
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {VOCABULARY_CATEGORIES[category as keyof typeof VOCABULARY_CATEGORIES] || category}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress: {masteredWords.size}/{currentWords.length} words</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">

        {/* Current Word */}
        {currentWord && (
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-6">
            <div className="text-center mb-6">
              {/* Main Word Display */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-4">
                  {learningMode === 'english' ? currentWord.english : currentWord.arabic}
                </div>
                
                {/* Audio Controls */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={handlePlayAudio}
                    disabled={isPlaying}
                    className="p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-full transition-colors"
                    title="Play pronunciation"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                  </button>
                  
                  {learningMode === 'arabic' && (
                    <button
                      onClick={handlePlayTransliteration}
                      disabled={isPlaying}
                      className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-full transition-colors"
                      title="Play transliteration"
                    >
                      <Volume2 className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>
                
                {/* Transliteration for Arabic */}
                {learningMode === 'arabic' && (
                  <div className="text-lg text-gray-300 mb-2">
                    {currentWord.arabicTransliteration}
                  </div>
                )}
                
                {/* Category */}
                <div className="text-sm text-gray-400 capitalize">
                  {VOCABULARY_CATEGORIES[currentWord.category as keyof typeof VOCABULARY_CATEGORIES] || currentWord.category}
                </div>
              </div>
            </div>

            {/* Translation Toggle */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {showTranslation ? 'Hide Translation' : 'Show Translation'}
              </button>
            </div>

            {/* Translation */}
            {showTranslation && (
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {learningMode === 'english' ? currentWord.arabic : currentWord.english}
                  </div>
                  {learningMode === 'english' && (
                    <div className="text-lg text-gray-300">
                      {currentWord.arabicTransliteration}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Master Button */}
            <div className="text-center mb-6">
              <button
                onClick={handleMasterWord}
                disabled={masteredWords.has(currentWord.id)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  masteredWords.has(currentWord.id)
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {masteredWords.has(currentWord.id) ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Mastered!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6" />
                    <span>Master This Word</span>
                  </div>
                )}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentWordIndex > 0) {
                    setCurrentWordIndex(currentWordIndex - 1);
                    setShowTranslation(false);
                  }
                }}
                disabled={currentWordIndex === 0}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Previous
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Word {currentWordIndex + 1} of {currentWords.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(((currentWordIndex + 1) / currentWords.length) * 100)}% complete
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (currentWordIndex < currentWords.length - 1) {
                    setCurrentWordIndex(currentWordIndex + 1);
                    setShowTranslation(false);
                  }
                }}
                disabled={currentWordIndex === currentWords.length - 1}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Words Message */}
        {currentWords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No words found for the selected level and category.</div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Show All Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
