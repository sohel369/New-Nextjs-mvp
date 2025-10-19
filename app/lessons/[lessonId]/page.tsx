'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Clock, 
  Star, 
  Trophy,
  Headphones,
  Mic,
  BookOpen,
  Target,
  Globe,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { quizAudioService } from '../../../lib/quizAudioService';
import BottomNavigation from '../../../components/BottomNavigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface Exercise {
  id: string;
  type: 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
  title: string;
  description: string;
  content?: any;
  audioUrl?: string;
  audioText?: string;
  imageUrl?: string;
  completed: boolean;
  score?: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  audioUrl?: string;
  audioText?: string;
  videoUrl?: string;
  exercises: Exercise[];
  completed: boolean;
  progress: number;
  xpReward: number;
  difficulty: number;
}

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const t = useTranslation();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exerciseResults, setExerciseResults] = useState<Record<string, any>>({});

  const lessonId = params.lessonId as string;

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      // In a real app, fetch from your database
      // For now, we'll use sample data
      const sampleLesson: Lesson = {
        id: lessonId,
        title: 'Basic Greetings',
        description: 'Learn essential English greetings and polite expressions',
        language: 'en',
        level: 'beginner',
        duration: 15,
        audioText: 'Basic Greetings. Learn essential English greetings and polite expressions. Hello, Hi, Good morning, Good afternoon, Good evening, How are you, Nice to meet you, Thank you, You are welcome, Goodbye.',
        exercises: [
          {
            id: 'ex1',
            type: 'listening',
            title: 'Listen and Repeat',
            description: 'Listen to the greetings and repeat them',
            audioText: 'Hello, Hi, Good morning, Good afternoon, Good evening, How are you, Nice to meet you',
            completed: false
          },
          {
            id: 'ex2',
            type: 'speaking',
            title: 'Practice Greetings',
            description: 'Practice saying hello in different situations',
            audioText: 'Practice saying hello in different situations. Say hello to a friend, say good morning to your teacher, say nice to meet you to a new person',
            completed: false
          },
          {
            id: 'ex3',
            type: 'vocabulary',
            title: 'Greeting Words',
            description: 'Learn common greeting words and phrases',
            audioText: 'Greeting Words. Hello, Hi, Good morning, Good afternoon, Good evening, How are you, Nice to meet you, Thank you, You are welcome, Goodbye, See you later',
            completed: false
          }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      };
      
      setLesson(sampleLesson);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (audioText: string, language: string = 'en') => {
    try {
      setIsPlaying(true);
      
      // Stop any current audio
      quizAudioService.stop();
      
      // Use TTS to speak the lesson content
      await quizAudioService.speak(audioText, language);
      
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    quizAudioService.stop();
    setIsPlaying(false);
  };

  const handleExerciseComplete = (exerciseId: string, result: any) => {
    setExerciseResults(prev => ({
      ...prev,
      [exerciseId]: result
    }));

    // Mark exercise as completed
    if (lesson) {
      const updatedExercises = lesson.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      );
      setLesson(prev => prev ? { ...prev, exercises: updatedExercises } : null);
    }
  };

  const handleNextExercise = () => {
    if (lesson && currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'listening': return <Headphones className="w-5 h-5" />;
      case 'speaking': return <Mic className="w-5 h-5" />;
      case 'reading': return <BookOpen className="w-5 h-5" />;
      case 'writing': return <Target className="w-5 h-5" />;
      case 'vocabulary': return <Globe className="w-5 h-5" />;
      case 'grammar': return <Trophy className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return 'bg-green-500';
    if (difficulty <= 2) return 'bg-yellow-500';
    if (difficulty <= 3) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading lesson...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!lesson) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Lesson Not Found</h1>
            <Link href="/lessons" className="text-purple-400 hover:text-purple-300">
              Back to Lessons
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentExerciseData = lesson.exercises[currentExercise];
  const isLastExercise = currentExercise === lesson.exercises.length - 1;
  const completedExercises = lesson.exercises.filter(ex => ex.completed).length;
  const progressPercentage = (completedExercises / lesson.exercises.length) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Link href="/lessons" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Back to Lessons</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-white/70">Progress</div>
                <div className="text-lg font-bold text-white">{Math.round(progressPercentage)}%</div>
              </div>
            </div>
          </div>

          {/* Lesson Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
            <p className="text-white/70 text-lg mb-4">{lesson.description}</p>
            
            <div className="flex items-center space-x-6">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(lesson.level)}`}>
                {lesson.level}
              </div>
              <div className="flex items-center space-x-1 text-white/70">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{lesson.duration} min</span>
              </div>
              <div className="flex items-center space-x-1 text-white/70">
                <Star className="w-4 h-4" />
                <span className="text-sm">{lesson.xpReward} XP</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/70">Difficulty:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= lesson.difficulty
                          ? getDifficultyColor(lesson.difficulty)
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">
                Exercise {currentExercise + 1} of {lesson.exercises.length}
              </span>
              <span className="text-sm text-white/70">
                {completedExercises} completed
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Audio Player */}
          {lesson.audioText && (
            <div className="mb-6">
              <button
                onClick={() => 
                  isPlaying 
                    ? handleStopAudio() 
                    : handlePlayAudio(lesson.audioText!, lesson.language)
                }
                className="w-full flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                <span className="text-lg">
                  {isPlaying ? 'Playing Lesson Audio...' : 'Play Lesson Audio'}
                </span>
                {isPlaying && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Exercise Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Current Exercise */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                {getExerciseIcon(currentExerciseData.type)}
                <span className="text-sm text-white/70 capitalize">
                  {currentExerciseData.type.replace('-', ' ')}
                </span>
                {currentExerciseData.completed && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentExerciseData.title}</h3>
              <p className="text-white/70 mb-4">{currentExerciseData.description}</p>

              {/* Exercise Audio */}
              {currentExerciseData.audioText && (
                <div className="mb-4">
                  <button
                    onClick={() => handlePlayAudio(currentExerciseData.audioText!, lesson.language)}
                    className="flex items-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>{isPlaying ? 'Playing...' : 'Play Exercise Audio'}</span>
                    {isPlaying && (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                </div>
              )}

              {/* Exercise Content */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/80">
                  Exercise content will be rendered here based on the exercise type.
                  This could include interactive elements, forms, audio players, etc.
                </p>
              </div>

              {/* Exercise Actions */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => handleExerciseComplete(currentExerciseData.id, { score: 100 })}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Mark as Complete
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousExercise}
                    disabled={currentExercise === 0}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextExercise}
                    disabled={isLastExercise}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Exercise Navigation */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4">Exercise Progress</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lesson.exercises.map((exercise, index) => (
                  <button
                    key={exercise.id}
                    onClick={() => setCurrentExercise(index)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      index === currentExercise
                        ? 'border-purple-500 bg-purple-500/20'
                        : exercise.completed
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      {getExerciseIcon(exercise.type)}
                      <span className="text-sm font-medium text-white">
                        {exercise.title}
                      </span>
                      {exercise.completed && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/70">{exercise.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation - Fixed */}
        <div className="flex-shrink-0">
          <BottomNavigation />
        </div>
      </div>
    </ProtectedRoute>
  );
}
