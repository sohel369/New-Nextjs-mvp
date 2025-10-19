// Comprehensive Language Learning Quiz System Data
// Multi-language support with RTL, diacritics, and cultural context

export interface QuizQuestion {
  id: string;
  word: string;
  translation: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  category: string;
  pronunciation?: string;
  audioUrl?: string;
  culturalNote?: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  level: number;
  totalCorrect: number;
  totalAnswered: number;
  accuracy: number;
  lastPlayed: string;
  achievements: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
  country: string;
}

// Language configurations
export const LANGUAGE_CONFIG = {
  en: {
    name: 'English',
    native: 'English',
    flag: '🇺🇸',
    isRTL: false,
    ttsLang: 'en-US',
    diacritics: false
  },
  ar: {
    name: 'Arabic',
    native: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
    ttsLang: 'ar-SA',
    diacritics: true
  },
  nl: {
    name: 'Dutch',
    native: 'Nederlands',
    flag: '🇳🇱',
    isRTL: false,
    ttsLang: 'nl-NL',
    diacritics: false
  },
  id: {
    name: 'Indonesian',
    native: 'Bahasa Indonesia',
    flag: '🇮🇩',
    isRTL: false,
    ttsLang: 'id-ID',
    diacritics: false
  },
  ms: {
    name: 'Malay',
    native: 'Bahasa Melayu',
    flag: '🇲🇾',
    isRTL: false,
    ttsLang: 'ms-MY',
    diacritics: false
  },
  th: {
    name: 'Thai',
    native: 'ไทย',
    flag: '🇹🇭',
    isRTL: false,
    ttsLang: 'th-TH',
    diacritics: false
  },
  km: {
    name: 'Khmer',
    native: 'ខ្មែរ',
    flag: '🇰🇭',
    isRTL: false,
    ttsLang: 'km-KH',
    diacritics: false
  }
};

// Comprehensive quiz questions for all languages
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  en: [
    // Easy Level
    {
      id: 'en-easy-1',
      word: 'hello',
      translation: 'مرحبا',
      options: ['مرحبا', 'وداعا', 'شكرا', 'آسف'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'en',
      category: 'greetings',
      pronunciation: 'həˈloʊ'
    },
    {
      id: 'en-easy-2',
      word: 'water',
      translation: 'ماء',
      options: ['ماء', 'طعام', 'نار', 'هواء'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'en',
      category: 'basics',
      pronunciation: 'ˈwɔːtər'
    },
    {
      id: 'en-easy-3',
      word: 'book',
      translation: 'كتاب',
      options: ['كتاب', 'قلم', 'ورقة', 'مكتب'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'en',
      category: 'objects',
      pronunciation: 'bʊk'
    },
    {
      id: 'en-easy-4',
      word: 'house',
      translation: 'بيت',
      options: ['بيت', 'سيارة', 'شجرة', 'جبل'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'en',
      category: 'places',
      pronunciation: 'haʊs'
    },
    {
      id: 'en-easy-5',
      word: 'cat',
      translation: 'قطة',
      options: ['قطة', 'كلب', 'طائر', 'سمك'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'en',
      category: 'animals',
      pronunciation: 'kæt'
    },
    
    // Medium Level
    {
      id: 'en-medium-1',
      word: 'beautiful',
      translation: 'جميل',
      options: ['جميل', 'قبيح', 'كبير', 'صغير'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'en',
      category: 'adjectives',
      pronunciation: 'ˈbjuːtɪfəl'
    },
    {
      id: 'en-medium-2',
      word: 'restaurant',
      translation: 'مطعم',
      options: ['مطعم', 'مستشفى', 'مدرسة', 'مكتبة'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'en',
      category: 'places',
      pronunciation: 'ˈrestərɑːnt'
    },
    {
      id: 'en-medium-3',
      word: 'adventure',
      translation: 'مغامرة',
      options: ['مغامرة', 'رحلة', 'عطلة', 'عمل'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'en',
      category: 'abstract',
      pronunciation: 'ədˈventʃər'
    },
    {
      id: 'en-medium-4',
      word: 'knowledge',
      translation: 'معرفة',
      options: ['معرفة', 'حكمة', 'خبرة', 'مهارة'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'en',
      category: 'abstract',
      pronunciation: 'ˈnɑːlɪdʒ'
    },
    {
      id: 'en-medium-5',
      word: 'butterfly',
      translation: 'فراشة',
      options: ['فراشة', 'نحلة', 'عنكبوت', 'دودة'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'en',
      category: 'animals',
      pronunciation: 'ˈbʌtərflaɪ'
    },
    
    // Hard Level
    {
      id: 'en-hard-1',
      word: 'serendipity',
      translation: 'صدفة سعيدة',
      options: ['صدفة سعيدة', 'حظ', 'فرصة', 'مصادفة'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'en',
      category: 'abstract',
      pronunciation: 'ˌserənˈdɪpəti'
    },
    {
      id: 'en-hard-2',
      word: 'ephemeral',
      translation: 'عابر',
      options: ['عابر', 'دائم', 'مؤقت', 'سريع'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'en',
      category: 'adjectives',
      pronunciation: 'ɪˈfemərəl'
    },
    {
      id: 'en-hard-3',
      word: 'ubiquitous',
      translation: 'موجود في كل مكان',
      options: ['موجود في كل مكان', 'نادر', 'شائع', 'مهم'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'en',
      category: 'adjectives',
      pronunciation: 'juːˈbɪkwɪtəs'
    },
    {
      id: 'en-hard-4',
      word: 'mellifluous',
      translation: 'عذب',
      options: ['عذب', 'صاخب', 'هادئ', 'جميل'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'en',
      category: 'adjectives',
      pronunciation: 'məˈlɪfluəs'
    },
    {
      id: 'en-hard-5',
      word: 'perspicacious',
      translation: 'ثاقب البصيرة',
      options: ['ثاقب البصيرة', 'ذكي', 'حكيم', 'فهم'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'en',
      category: 'adjectives',
      pronunciation: 'ˌpɜːrspɪˈkeɪʃəs'
    }
  ],
  
  ar: [
    // Easy Level
    {
      id: 'ar-easy-1',
      word: 'مرحبا',
      translation: 'hello',
      options: ['hello', 'goodbye', 'thank you', 'sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ar',
      category: 'greetings',
      pronunciation: 'marhaban'
    },
    {
      id: 'ar-easy-2',
      word: 'ماء',
      translation: 'water',
      options: ['water', 'food', 'fire', 'air'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ar',
      category: 'basics',
      pronunciation: 'ma\'un'
    },
    {
      id: 'ar-easy-3',
      word: 'كتاب',
      translation: 'book',
      options: ['book', 'pen', 'paper', 'desk'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ar',
      category: 'objects',
      pronunciation: 'kitab'
    },
    {
      id: 'ar-easy-4',
      word: 'بيت',
      translation: 'house',
      options: ['house', 'car', 'tree', 'mountain'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ar',
      category: 'places',
      pronunciation: 'bayt'
    },
    {
      id: 'ar-easy-5',
      word: 'قطة',
      translation: 'cat',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ar',
      category: 'animals',
      pronunciation: 'qitta'
    },
    
    // Medium Level
    {
      id: 'ar-medium-1',
      word: 'جميل',
      translation: 'beautiful',
      options: ['beautiful', 'ugly', 'big', 'small'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'ar',
      category: 'adjectives',
      pronunciation: 'jameel'
    },
    {
      id: 'ar-medium-2',
      word: 'مطعم',
      translation: 'restaurant',
      options: ['restaurant', 'hospital', 'school', 'library'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'ar',
      category: 'places',
      pronunciation: 'mat\'am'
    },
    {
      id: 'ar-medium-3',
      word: 'مغامرة',
      translation: 'adventure',
      options: ['adventure', 'trip', 'vacation', 'work'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'ar',
      category: 'abstract',
      pronunciation: 'mughamara'
    },
    {
      id: 'ar-medium-4',
      word: 'معرفة',
      translation: 'knowledge',
      options: ['knowledge', 'wisdom', 'experience', 'skill'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'ar',
      category: 'abstract',
      pronunciation: 'ma\'rifa'
    },
    {
      id: 'ar-medium-5',
      word: 'فراشة',
      translation: 'butterfly',
      options: ['butterfly', 'bee', 'spider', 'worm'],
      correctAnswer: 0,
      difficulty: 'medium',
      language: 'ar',
      category: 'animals',
      pronunciation: 'farasha'
    },
    
    // Hard Level
    {
      id: 'ar-hard-1',
      word: 'صدفة سعيدة',
      translation: 'serendipity',
      options: ['serendipity', 'luck', 'opportunity', 'coincidence'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'ar',
      category: 'abstract',
      pronunciation: 'sudfa sa\'ida'
    },
    {
      id: 'ar-hard-2',
      word: 'عابر',
      translation: 'ephemeral',
      options: ['ephemeral', 'permanent', 'temporary', 'quick'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'ar',
      category: 'adjectives',
      pronunciation: 'aabir'
    },
    {
      id: 'ar-hard-3',
      word: 'موجود في كل مكان',
      translation: 'ubiquitous',
      options: ['ubiquitous', 'rare', 'common', 'important'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'ar',
      category: 'adjectives',
      pronunciation: 'mawjud fi kull makan'
    },
    {
      id: 'ar-hard-4',
      word: 'عذب',
      translation: 'mellifluous',
      options: ['mellifluous', 'loud', 'quiet', 'beautiful'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'ar',
      category: 'adjectives',
      pronunciation: 'adhb'
    },
    {
      id: 'ar-hard-5',
      word: 'ثاقب البصيرة',
      translation: 'perspicacious',
      options: ['perspicacious', 'smart', 'wise', 'understanding'],
      correctAnswer: 0,
      difficulty: 'hard',
      language: 'ar',
      category: 'adjectives',
      pronunciation: 'thaqib al-basira'
    }
  ],
  
  nl: [
    // Easy Level
    {
      id: 'nl-easy-1',
      word: 'hallo',
      translation: 'hello',
      options: ['hello', 'goodbye', 'thank you', 'sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'nl',
      category: 'greetings',
      pronunciation: 'haˈloː'
    },
    {
      id: 'nl-easy-2',
      word: 'water',
      translation: 'water',
      options: ['water', 'food', 'fire', 'air'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'nl',
      category: 'basics',
      pronunciation: 'ˈʋaːtər'
    },
    {
      id: 'nl-easy-3',
      word: 'boek',
      translation: 'book',
      options: ['book', 'pen', 'paper', 'desk'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'nl',
      category: 'objects',
      pronunciation: 'buk'
    },
    {
      id: 'nl-easy-4',
      word: 'huis',
      translation: 'house',
      options: ['house', 'car', 'tree', 'mountain'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'nl',
      category: 'places',
      pronunciation: 'ɦœys'
    },
    {
      id: 'nl-easy-5',
      word: 'kat',
      translation: 'cat',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'nl',
      category: 'animals',
      pronunciation: 'kɑt'
    }
  ],
  
  id: [
    // Easy Level
    {
      id: 'id-easy-1',
      word: 'halo',
      translation: 'hello',
      options: ['hello', 'goodbye', 'thank you', 'sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'id',
      category: 'greetings',
      pronunciation: 'haˈlo'
    },
    {
      id: 'id-easy-2',
      word: 'air',
      translation: 'water',
      options: ['water', 'food', 'fire', 'air'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'id',
      category: 'basics',
      pronunciation: 'aˈir'
    },
    {
      id: 'id-easy-3',
      word: 'buku',
      translation: 'book',
      options: ['book', 'pen', 'paper', 'desk'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'id',
      category: 'objects',
      pronunciation: 'ˈbuku'
    },
    {
      id: 'id-easy-4',
      word: 'rumah',
      translation: 'house',
      options: ['house', 'car', 'tree', 'mountain'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'id',
      category: 'places',
      pronunciation: 'ruˈmah'
    },
    {
      id: 'id-easy-5',
      word: 'kucing',
      translation: 'cat',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'id',
      category: 'animals',
      pronunciation: 'ˈkutʃiŋ'
    }
  ],
  
  ms: [
    // Easy Level
    {
      id: 'ms-easy-1',
      word: 'halo',
      translation: 'hello',
      options: ['hello', 'goodbye', 'thank you', 'sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ms',
      category: 'greetings',
      pronunciation: 'haˈlo'
    },
    {
      id: 'ms-easy-2',
      word: 'air',
      translation: 'water',
      options: ['water', 'food', 'fire', 'air'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ms',
      category: 'basics',
      pronunciation: 'aˈir'
    },
    {
      id: 'ms-easy-3',
      word: 'buku',
      translation: 'book',
      options: ['book', 'pen', 'paper', 'desk'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ms',
      category: 'objects',
      pronunciation: 'ˈbuku'
    },
    {
      id: 'ms-easy-4',
      word: 'rumah',
      translation: 'house',
      options: ['house', 'car', 'tree', 'mountain'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ms',
      category: 'places',
      pronunciation: 'ruˈmah'
    },
    {
      id: 'ms-easy-5',
      word: 'kucing',
      translation: 'cat',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'ms',
      category: 'animals',
      pronunciation: 'ˈkutʃiŋ'
    }
  ],
  
  th: [
    // Easy Level
    {
      id: 'th-easy-1',
      word: 'สวัสดี',
      translation: 'hello',
      options: ['hello', 'goodbye', 'thank you', 'sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'th',
      category: 'greetings',
      pronunciation: 'sa-wat-di'
    },
    {
      id: 'th-easy-2',
      word: 'น้ำ',
      translation: 'water',
      options: ['water', 'food', 'fire', 'air'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'th',
      category: 'basics',
      pronunciation: 'nam'
    },
    {
      id: 'th-easy-3',
      word: 'หนังสือ',
      translation: 'book',
      options: ['book', 'pen', 'paper', 'desk'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'th',
      category: 'objects',
      pronunciation: 'nang-sue'
    },
    {
      id: 'th-easy-4',
      word: 'บ้าน',
      translation: 'house',
      options: ['house', 'car', 'tree', 'mountain'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'th',
      category: 'places',
      pronunciation: 'ban'
    },
    {
      id: 'th-easy-5',
      word: 'แมว',
      translation: 'cat',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'th',
      category: 'animals',
      pronunciation: 'maeo'
    }
  ],
  
  km: [
    // Easy Level
    {
      id: 'km-easy-1',
      word: 'ជំរាបសួរ',
      translation: 'hello',
      options: ['hello', 'goodbye', 'thank you', 'sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'km',
      category: 'greetings',
      pronunciation: 'chum-reap-sour'
    },
    {
      id: 'km-easy-2',
      word: 'ទឹក',
      translation: 'water',
      options: ['water', 'food', 'fire', 'air'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'km',
      category: 'basics',
      pronunciation: 'tuk'
    },
    {
      id: 'km-easy-3',
      word: 'សៀវភៅ',
      translation: 'book',
      options: ['book', 'pen', 'paper', 'desk'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'km',
      category: 'objects',
      pronunciation: 'siev-phov'
    },
    {
      id: 'km-easy-4',
      word: 'ផ្ទះ',
      translation: 'house',
      options: ['house', 'car', 'tree', 'mountain'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'km',
      category: 'places',
      pronunciation: 'phteah'
    },
    {
      id: 'km-easy-5',
      word: 'ឆ្មា',
      translation: 'cat',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 0,
      difficulty: 'easy',
      language: 'km',
      category: 'animals',
      pronunciation: 'chhma'
    }
  ]
};

// Dummy leaderboard data
export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    xp: 2450,
    level: 12,
    streak: 15,
    avatar: '👨‍💼',
    country: '🇪🇬'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    xp: 2380,
    level: 11,
    streak: 12,
    avatar: '👩‍🎓',
    country: '🇺🇸'
  },
  {
    id: '3',
    name: 'Mohammed Al-Rashid',
    xp: 2200,
    level: 10,
    streak: 8,
    avatar: '👨‍🎨',
    country: '🇸🇦'
  },
  {
    id: '4',
    name: 'Emma van der Berg',
    xp: 2150,
    level: 10,
    streak: 6,
    avatar: '👩‍💻',
    country: '🇳🇱'
  },
  {
    id: '5',
    name: 'Priya Patel',
    xp: 2000,
    level: 9,
    streak: 10,
    avatar: '👩‍⚕️',
    country: '🇮🇳'
  },
  {
    id: '6',
    name: 'Chen Wei',
    xp: 1950,
    level: 9,
    streak: 7,
    avatar: '👨‍🔬',
    country: '🇨🇳'
  },
  {
    id: '7',
    name: 'Maria Garcia',
    xp: 1800,
    level: 8,
    streak: 5,
    avatar: '👩‍🍳',
    country: '🇪🇸'
  },
  {
    id: '8',
    name: 'Yuki Tanaka',
    xp: 1750,
    level: 8,
    streak: 9,
    avatar: '👨‍🎌',
    country: '🇯🇵'
  },
  {
    id: '9',
    name: 'Fatima Al-Zahra',
    xp: 1700,
    level: 8,
    streak: 4,
    avatar: '👩‍🏫',
    country: '🇲🇦'
  },
  {
    id: '10',
    name: 'David Kim',
    xp: 1650,
    level: 7,
    streak: 6,
    avatar: '👨‍💼',
    country: '🇰🇷'
  }
];

// XP and level system
export const XP_SYSTEM = {
  CORRECT_ANSWER: 10,
  STREAK_BONUS: 5,
  LEVEL_UP_MULTIPLIER: 100,
  CONFETTI_INTERVAL: 5
};

// Achievement system
export const ACHIEVEMENTS = {
  FIRST_CORRECT: 'first_correct',
  STREAK_5: 'streak_5',
  STREAK_10: 'streak_10',
  STREAK_20: 'streak_20',
  LEVEL_5: 'level_5',
  LEVEL_10: 'level_10',
  PERFECT_SCORE: 'perfect_score',
  LANGUAGE_MASTER: 'language_master'
};

// Get questions by language and difficulty
export const getQuestionsByLanguageAndDifficulty = (
  language: string, 
  difficulty: 'easy' | 'medium' | 'hard'
): QuizQuestion[] => {
  const questions = QUIZ_QUESTIONS[language] || [];
  return questions.filter(q => q.difficulty === difficulty);
};

// Get random question
export const getRandomQuestion = (
  language: string, 
  difficulty: 'easy' | 'medium' | 'hard'
): QuizQuestion => {
  const questions = getQuestionsByLanguageAndDifficulty(language, difficulty);
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Calculate level from XP
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_SYSTEM.LEVEL_UP_MULTIPLIER) + 1;
};

// Calculate XP needed for next level
export const getXPForNextLevel = (currentLevel: number): number => {
  return currentLevel * XP_SYSTEM.LEVEL_UP_MULTIPLIER;
};

// Get progress percentage for current level
export const getLevelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = (currentLevel - 1) * XP_SYSTEM.LEVEL_UP_MULTIPLIER;
  const nextLevelXP = currentLevel * XP_SYSTEM.LEVEL_UP_MULTIPLIER;
  const progressXP = xp - currentLevelXP;
  const levelXP = nextLevelXP - currentLevelXP;
  return (progressXP / levelXP) * 100;
};
