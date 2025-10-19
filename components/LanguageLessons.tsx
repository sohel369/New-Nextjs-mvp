'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle, 
  Lock,
  ArrowRight,
  Globe,
  Headphones,
  Mic,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  audioUrl?: string;
  videoUrl?: string;
  exercises: Exercise[];
  completed: boolean;
  progress: number; // 0-100
  xpReward: number;
  difficulty: number; // 1-5
}

interface Exercise {
  id: string;
  type: 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
  title: string;
  description: string;
  audioUrl?: string;
  text?: string;
  completed: boolean;
}

interface LanguageLessonsProps {
  userLearningLanguages: string[];
  onLessonComplete?: (lessonId: string, xp: number) => void;
}

export default function LanguageLessons({ userLearningLanguages, onLessonComplete }: LanguageLessonsProps) {
  const { currentLanguage, isRTL } = useLanguage();
  const { user } = useAuth();
  const t = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(userLearningLanguages[0] || 'en');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [allLessons, setAllLessons] = useState<Record<string, Lesson[]>>({});

  // Sample lessons data - in a real app, this would come from your database
  const sampleLessons: Record<string, Lesson[]> = {
    en: [
      {
        id: 'en-basic-greetings',
        title: 'Basic Greetings',
        description: 'Learn essential English greetings and polite expressions',
        language: 'en',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/en/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'Listen and Repeat', description: 'Listen to the greetings and repeat them', audioUrl: '/audio/lessons/en/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'Practice Greetings', description: 'Practice saying hello in different situations', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'Greeting Words', description: 'Learn common greeting words and phrases', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      },
      {
        id: 'en-numbers-1-10',
        title: 'Numbers 1-10',
        description: 'Learn to count from 1 to 10 in English',
        language: 'en',
        level: 'beginner',
        duration: 20,
        audioUrl: '/audio/lessons/en/numbers-1-10.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'Number Sounds', description: 'Listen to each number pronunciation', audioUrl: '/audio/lessons/en/numbers-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'Count Out Loud', description: 'Practice counting from 1 to 10', completed: false },
          { id: 'ex3', type: 'reading', title: 'Number Recognition', description: 'Recognize written numbers', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 75,
        difficulty: 2
      },
      {
        id: 'en-family-members',
        title: 'Family Members',
        description: 'Learn vocabulary for family relationships',
        language: 'en',
        level: 'intermediate',
        duration: 25,
        audioUrl: '/audio/lessons/en/family-members.mp3',
        exercises: [
          { id: 'ex1', type: 'vocabulary', title: 'Family Tree', description: 'Learn family member names', completed: false },
          { id: 'ex2', type: 'speaking', title: 'Describe Family', description: 'Practice describing your family', completed: false },
          { id: 'ex3', type: 'writing', title: 'Family Story', description: 'Write about your family', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 100,
        difficulty: 3
      }
    ],
    ar: [
      {
        id: 'ar-basic-greetings',
        title: 'التحيات الأساسية',
        description: 'تعلم التحيات الأساسية والتعبيرات المهذبة باللغة العربية',
        language: 'ar',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/ar/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'استمع وكرر', description: 'استمع للتحيات وكررها', audioUrl: '/audio/lessons/ar/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'ممارسة التحيات', description: 'مارس قول مرحبا في مواقف مختلفة', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'كلمات التحية', description: 'تعلم كلمات وعبارات التحية الشائعة', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      },
      {
        id: 'ar-numbers-1-10',
        title: 'الأرقام 1-10',
        description: 'تعلم العد من 1 إلى 10 باللغة العربية',
        language: 'ar',
        level: 'beginner',
        duration: 20,
        audioUrl: '/audio/lessons/ar/numbers-1-10.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'أصوات الأرقام', description: 'استمع لنطق كل رقم', audioUrl: '/audio/lessons/ar/numbers-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'العد بصوت عالي', description: 'مارس العد من 1 إلى 10', completed: false },
          { id: 'ex3', type: 'reading', title: 'التعرف على الأرقام', description: 'تعرف على الأرقام المكتوبة', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 75,
        difficulty: 2
      },
      {
        id: 'ar-family-members',
        title: 'أفراد العائلة',
        description: 'تعلم مفردات العلاقات العائلية',
        language: 'ar',
        level: 'intermediate',
        duration: 25,
        audioUrl: '/audio/lessons/ar/family-members.mp3',
        exercises: [
          { id: 'ex1', type: 'vocabulary', title: 'شجرة العائلة', description: 'تعلم أسماء أفراد العائلة', completed: false },
          { id: 'ex2', type: 'speaking', title: 'وصف العائلة', description: 'مارس وصف عائلتك', completed: false },
          { id: 'ex3', type: 'writing', title: 'قصة العائلة', description: 'اكتب عن عائلتك', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 100,
        difficulty: 3
      }
    ],
    nl: [
      {
        id: 'nl-basic-greetings',
        title: 'Basis Groeten',
        description: 'Leer essentiële Nederlandse begroetingen en beleefde uitdrukkingen',
        language: 'nl',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/nl/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'Luister en Herhaal', description: 'Luister naar de begroetingen en herhaal ze', audioUrl: '/audio/lessons/nl/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'Oefen Groeten', description: 'Oefen met het zeggen van hallo in verschillende situaties', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'Groetwoorden', description: 'Leer veelgebruikte groetwoorden en zinnen', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      }
    ],
    id: [
      {
        id: 'id-basic-greetings',
        title: 'Salam Dasar',
        description: 'Pelajari salam dasar dan ekspresi sopan dalam bahasa Indonesia',
        language: 'id',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/id/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'Dengarkan dan Ulangi', description: 'Dengarkan salam dan ulangi', audioUrl: '/audio/lessons/id/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'Latihan Salam', description: 'Berlatih mengucapkan halo dalam situasi berbeda', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'Kata Salam', description: 'Pelajari kata dan frasa salam yang umum', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      }
    ],
    ms: [
      {
        id: 'ms-basic-greetings',
        title: 'Salam Asas',
        description: 'Pelajari salam asas dan ungkapan sopan dalam bahasa Melayu',
        language: 'ms',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/ms/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'Dengar dan Ulang', description: 'Dengar salam dan ulang', audioUrl: '/audio/lessons/ms/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'Latihan Salam', description: 'Berlatih mengucapkan halo dalam situasi berbeza', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'Kata Salam', description: 'Pelajari kata dan frasa salam yang biasa', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      }
    ],
    th: [
      {
        id: 'th-basic-greetings',
        title: 'การทักทายพื้นฐาน',
        description: 'เรียนรู้การทักทายพื้นฐานและการแสดงออกที่สุภาพในภาษาไทย',
        language: 'th',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/th/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'ฟังและพูดตาม', description: 'ฟังการทักทายและพูดตาม', audioUrl: '/audio/lessons/th/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'ฝึกทักทาย', description: 'ฝึกพูดสวัสดีในสถานการณ์ต่างๆ', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'คำทักทาย', description: 'เรียนรู้คำและวลีทักทายที่ใช้บ่อย', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      }
    ],
    km: [
      {
        id: 'km-basic-greetings',
        title: 'ការស្វាគមន៍មូលដ្ឋាន',
        description: 'រៀនការស្វាគមន៍មូលដ្ឋាន និងការបង្ហាញដែលគួរសមក្នុងភាសាខ្មែរ',
        language: 'km',
        level: 'beginner',
        duration: 15,
        audioUrl: '/audio/lessons/km/basic-greetings.mp3',
        exercises: [
          { id: 'ex1', type: 'listening', title: 'ស្តាប់ និងនិយាយតាម', description: 'ស្តាប់ការស្វាគមន៍ និងនិយាយតាម', audioUrl: '/audio/lessons/km/greetings-listen.mp3', completed: false },
          { id: 'ex2', type: 'speaking', title: 'អនុវត្តការស្វាគមន៍', description: 'អនុវត្តនិយាយសួរសុខសប្បាយក្នុងស្ថានការផ្សេងៗ', completed: false },
          { id: 'ex3', type: 'vocabulary', title: 'ពាក្យស្វាគមន៍', description: 'រៀនពាក្យ និងឃ្លាស្វាគមន៍ដែលជាទូទៅ', completed: false }
        ],
        completed: false,
        progress: 0,
        xpReward: 50,
        difficulty: 1
      }
    ]
  };

  useEffect(() => {
    // Load lessons for all user learning languages
    const lessonsForAllLanguages: Record<string, Lesson[]> = {};
    
    userLearningLanguages.forEach(lang => {
      lessonsForAllLanguages[lang] = sampleLessons[lang] || [];
    });
    
    setAllLessons(lessonsForAllLanguages);
    
    // Set lessons for the currently selected language
    const languageLessons = lessonsForAllLanguages[selectedLanguage] || [];
    setLessons(languageLessons);
    setLoading(false);
  }, [userLearningLanguages, selectedLanguage]);

  const handlePlayAudio = async (audioUrl: string, lessonId: string) => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Ensure we're playing the correct language version
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson || lesson.language !== selectedLanguage) {
        console.warn('Audio language mismatch - this should not happen');
        return;
      }

      // Check if audio file exists before trying to play
      try {
        const response = await fetch(audioUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('Audio file not found');
        }
      } catch (fetchError) {
        console.log('Audio file not available, using text-to-speech fallback');
        handleTextToSpeech(lesson.title, lesson.language);
        return;
      }

      // Create new audio element with the correct language audio
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setIsPlaying(lessonId);

      // Handle audio events
      audio.onended = () => {
        setIsPlaying(null);
        setCurrentAudio(null);
      };

      audio.onerror = (error) => {
        console.log('Audio playback failed, using text-to-speech fallback');
        // Try to use text-to-speech as fallback
        handleTextToSpeech(lesson.title, lesson.language);
        setIsPlaying(null);
        setCurrentAudio(null);
      };

      // Play audio
      await audio.play();
    } catch (error) {
      console.log('Audio playback error, using text-to-speech fallback');
      // Try text-to-speech fallback
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        handleTextToSpeech(lesson.title, lesson.language);
      }
      setIsPlaying(null);
    }
  };

  const handleTextToSpeech = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      try {
        // Stop any current speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language based on the lesson language
        const languageMap: Record<string, string> = {
          'en': 'en-US',
          'ar': 'ar-SA',
          'nl': 'nl-NL',
          'id': 'id-ID',
          'ms': 'ms-MY',
          'th': 'th-TH',
          'km': 'km-KH'
        };
        
        utterance.lang = languageMap[language] || 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setIsPlaying(null);
        };
        
        utterance.onerror = (event) => {
          console.log('Text-to-speech error:', event.error);
          setIsPlaying(null);
          // Show user-friendly message instead of alert
          console.log('Audio not available for this lesson');
        };
        
        speechSynthesis.speak(utterance);
        setIsPlaying('tts');
      } catch (error) {
        console.log('Text-to-speech initialization failed:', error);
        setIsPlaying(null);
      }
    } else {
      console.log('Text-to-speech not supported in this browser');
      setIsPlaying(null);
    }
  };

  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    // Stop text-to-speech if playing
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    setIsPlaying(null);
  };

  const handleLanguageSwitch = (lang: string) => {
    // Stop any currently playing audio when switching languages
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    // Stop text-to-speech if playing
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    setIsPlaying(null);
    
    // Switch to the new language
    setSelectedLanguage(lang);
    
    // Update lessons for the new language
    const languageLessons = allLessons[lang] || [];
    setLessons(languageLessons);
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: 'English',
      ar: 'العربية',
      nl: 'Nederlands',
      id: 'Bahasa Indonesia',
      ms: 'Bahasa Melayu',
      th: 'ไทย',
      km: 'ខ្មែរ'
    };
    return languages[code] || code;
  };

  const getLanguageFlag = (code: string) => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      ar: '🇸🇦',
      nl: '🇳🇱',
      id: '🇮🇩',
      ms: '🇲🇾',
      th: '🇹🇭',
      km: '🇰🇭'
    };
    return flags[code] || '🌍';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return 'bg-green-500';
    if (difficulty <= 2) return 'bg-yellow-500';
    if (difficulty <= 3) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'listening': return <Headphones className="w-4 h-4" />;
      case 'speaking': return <Mic className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'writing': return <Target className="w-4 h-4" />;
      case 'vocabulary': return <Globe className="w-4 h-4" />;
      case 'grammar': return <Trophy className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Language Lessons</h1>
          <p className="text-white/70 text-base sm:text-lg">
            Learn with lessons tailored to your selected languages
          </p>
        </div>

        {/* Language Tabs */}
        {userLearningLanguages.length > 1 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Select Language to Learn</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {userLearningLanguages.map((lang) => {
                const languageLessons = allLessons[lang] || [];
                const completedCount = languageLessons.filter(l => l.completed).length;
                const totalCount = languageLessons.length;
                
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSwitch(lang)}
                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 flex items-center space-x-2 sm:space-x-3 ${
                      selectedLanguage === lang
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    <span className="text-lg sm:text-2xl">{getLanguageFlag(lang)}</span>
                    <div className="text-left">
                      <div className="font-semibold text-sm sm:text-base">{getLanguageName(lang)}</div>
                      <div className="text-xs sm:text-sm opacity-75">
                        {completedCount}/{totalCount} completed
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Language Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl">{getLanguageFlag(selectedLanguage)}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {getLanguageName(selectedLanguage)} Lessons
              </h2>
              <p className="text-white/70 text-xs sm:text-sm">
                Learning {getLanguageName(selectedLanguage)} • Audio in {getLanguageName(selectedLanguage)}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/70">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{lessons.length} lessons available</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{lessons.filter(l => l.completed).length} completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Headphones className="w-4 h-4" />
              <span className="text-sm">Audio in {getLanguageName(selectedLanguage)}</span>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              {/* Lesson Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{lesson.title}</h3>
                  <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">{lesson.description}</p>
                </div>
                {lesson.completed && (
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
                )}
              </div>

              {/* Lesson Meta */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(lesson.level)}`}>
                  {lesson.level}
                </div>
                <div className="flex items-center space-x-1 text-white/70">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">{lesson.duration} min</span>
                </div>
                <div className="flex items-center space-x-1 text-white/70">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">{lesson.xpReward} XP</span>
                </div>
              </div>

              {/* Difficulty Indicator */}
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm text-white/70">Difficulty:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        level <= lesson.difficulty
                          ? getDifficultyColor(lesson.difficulty)
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {lesson.progress > 0 && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm text-white/70">Progress</span>
                    <span className="text-xs sm:text-sm text-white/70">{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Audio Player */}
              {lesson.audioUrl && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm text-white/70">Audio Preview</span>
                    <div className="flex items-center space-x-1 text-xs text-white/60">
                      <Headphones className="w-3 h-3" />
                      <span className="hidden sm:inline">in {getLanguageName(lesson.language)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-white/50 mb-2">
                    💡 Audio files not available - using text-to-speech
                  </div>
                  <button
                    onClick={() => 
                      (isPlaying === lesson.id || isPlaying === 'tts')
                        ? handleStopAudio() 
                        : handlePlayAudio(lesson.audioUrl!, lesson.id)
                    }
                    className="w-full flex items-center justify-center space-x-2 p-2 sm:p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {(isPlaying === lesson.id || isPlaying === 'tts') ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span className="text-sm sm:text-base">
                      {(isPlaying === lesson.id || isPlaying === 'tts') 
                        ? 'Pause Audio' 
                        : `Play Audio (${getLanguageName(lesson.language)})`
                      }
                    </span>
                  </button>
                </div>
              )}

              {/* Exercises Preview */}
              <div className="mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2">Exercises:</h4>
                <div className="space-y-1 sm:space-y-2">
                  {lesson.exercises.slice(0, 3).map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {getExerciseIcon(exercise.type)}
                        <span className={`${exercise.completed ? 'text-green-400' : 'text-white/70'}`}>
                          {exercise.title}
                        </span>
                        {exercise.completed && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />}
                      </div>
                      {exercise.audioUrl && (
                        <div className="flex items-center space-x-1 text-xs text-white/60">
                          <Headphones className="w-3 h-3" />
                          <span className="hidden sm:inline">{getLanguageName(lesson.language)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {lesson.exercises.length > 3 && (
                    <div className="text-xs sm:text-sm text-white/50">
                      +{lesson.exercises.length - 3} more exercises
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/lessons/${lesson.id}`}
                className="w-full flex items-center justify-center space-x-2 p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
              >
                <span className="text-sm sm:text-base">Start Lesson</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* No Lessons Message */}
        {lessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Lessons Available</h3>
            <p className="text-white/70">
              No lessons are available for {getLanguageName(selectedLanguage)} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}