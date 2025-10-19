// Comprehensive Vocabulary Data for English and Arabic Learning
// 100+ vocabulary words with proper pronunciation and categories

export interface VocabularyWord {
  id: string;
  english: string;
  arabic: string;
  arabicTransliteration: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pronunciation?: string;
  example?: string;
  exampleTranslation?: string;
  audioUrl?: string;
}

export const VOCABULARY_DATA: VocabularyWord[] = [
  // GREETINGS & POLITE EXPRESSIONS (Beginner)
  { id: '1', english: 'hello', arabic: 'مَرْحَبًا', arabicTransliteration: 'marhaban', category: 'greetings', difficulty: 'beginner' },
  { id: '2', english: 'goodbye', arabic: 'وَدَاعًا', arabicTransliteration: 'wada\'an', category: 'greetings', difficulty: 'beginner' },
  { id: '3', english: 'good morning', arabic: 'صَبَاحُ الْخَيْرِ', arabicTransliteration: 'sabah al-khayr', category: 'greetings', difficulty: 'beginner' },
  { id: '4', english: 'good evening', arabic: 'مَسَاءُ الْخَيْرِ', arabicTransliteration: 'masa\' al-khayr', category: 'greetings', difficulty: 'beginner' },
  { id: '5', english: 'please', arabic: 'مِنْ فَضْلِك', arabicTransliteration: 'min fadlik', category: 'greetings', difficulty: 'beginner' },
  { id: '6', english: 'thank you', arabic: 'شُكْرًا', arabicTransliteration: 'shukran', category: 'greetings', difficulty: 'beginner' },
  { id: '7', english: 'you\'re welcome', arabic: 'عَفْوًا', arabicTransliteration: 'afwan', category: 'greetings', difficulty: 'beginner' },
  { id: '8', english: 'excuse me', arabic: 'اعْتِذَار', arabicTransliteration: 'i\'tithar', category: 'greetings', difficulty: 'beginner' },
  { id: '9', english: 'sorry', arabic: 'آسِف', arabicTransliteration: 'asif', category: 'greetings', difficulty: 'beginner' },
  { id: '10', english: 'yes', arabic: 'نَعَم', arabicTransliteration: 'na\'am', category: 'greetings', difficulty: 'beginner' },
  { id: '11', english: 'no', arabic: 'لَا', arabicTransliteration: 'la', category: 'greetings', difficulty: 'beginner' },

  // BASIC ESSENTIALS (Beginner)
  { id: '12', english: 'water', arabic: 'مَاءٌ', arabicTransliteration: 'ma\'un', category: 'basics', difficulty: 'beginner' },
  { id: '13', english: 'food', arabic: 'طَعَام', arabicTransliteration: 'ta\'am', category: 'basics', difficulty: 'beginner' },
  { id: '14', english: 'bread', arabic: 'خُبْز', arabicTransliteration: 'khubz', category: 'basics', difficulty: 'beginner' },
  { id: '15', english: 'milk', arabic: 'حَلِيب', arabicTransliteration: 'halib', category: 'basics', difficulty: 'beginner' },
  { id: '16', english: 'house', arabic: 'بَيْت', arabicTransliteration: 'bayt', category: 'basics', difficulty: 'beginner' },
  { id: '17', english: 'door', arabic: 'بَاب', arabicTransliteration: 'bab', category: 'basics', difficulty: 'beginner' },
  { id: '18', english: 'window', arabic: 'نَافِذَة', arabicTransliteration: 'nafidha', category: 'basics', difficulty: 'beginner' },
  { id: '19', english: 'book', arabic: 'كِتَاب', arabicTransliteration: 'kitab', category: 'basics', difficulty: 'beginner' },
  { id: '20', english: 'pen', arabic: 'قَلَم', arabicTransliteration: 'qalam', category: 'basics', difficulty: 'beginner' },
  { id: '21', english: 'paper', arabic: 'وَرَق', arabicTransliteration: 'waraq', category: 'basics', difficulty: 'beginner' },

  // FAMILY & PEOPLE (Beginner)
  { id: '22', english: 'father', arabic: 'أَب', arabicTransliteration: 'ab', category: 'family', difficulty: 'beginner' },
  { id: '23', english: 'mother', arabic: 'أُم', arabicTransliteration: 'umm', category: 'family', difficulty: 'beginner' },
  { id: '24', english: 'brother', arabic: 'أَخ', arabicTransliteration: 'akh', category: 'family', difficulty: 'beginner' },
  { id: '25', english: 'sister', arabic: 'أُخْت', arabicTransliteration: 'ukht', category: 'family', difficulty: 'beginner' },
  { id: '26', english: 'son', arabic: 'ابْن', arabicTransliteration: 'ibn', category: 'family', difficulty: 'beginner' },
  { id: '27', english: 'daughter', arabic: 'ابْنَة', arabicTransliteration: 'ibna', category: 'family', difficulty: 'beginner' },
  { id: '28', english: 'friend', arabic: 'صَدِيق', arabicTransliteration: 'sadiq', category: 'family', difficulty: 'beginner' },
  { id: '29', english: 'teacher', arabic: 'مُعَلِّم', arabicTransliteration: 'mu\'allim', category: 'family', difficulty: 'beginner' },
  { id: '30', english: 'student', arabic: 'طَالِب', arabicTransliteration: 'talib', category: 'family', difficulty: 'beginner' },

  // NUMBERS (Beginner)
  { id: '31', english: 'one', arabic: 'وَاحِد', arabicTransliteration: 'wahid', category: 'numbers', difficulty: 'beginner' },
  { id: '32', english: 'two', arabic: 'اثْنَان', arabicTransliteration: 'ithnan', category: 'numbers', difficulty: 'beginner' },
  { id: '33', english: 'three', arabic: 'ثَلَاثَة', arabicTransliteration: 'thalatha', category: 'numbers', difficulty: 'beginner' },
  { id: '34', english: 'four', arabic: 'أَرْبَعَة', arabicTransliteration: 'arba\'a', category: 'numbers', difficulty: 'beginner' },
  { id: '35', english: 'five', arabic: 'خَمْسَة', arabicTransliteration: 'khamsa', category: 'numbers', difficulty: 'beginner' },
  { id: '36', english: 'six', arabic: 'سِتَّة', arabicTransliteration: 'sitta', category: 'numbers', difficulty: 'beginner' },
  { id: '37', english: 'seven', arabic: 'سَبْعَة', arabicTransliteration: 'sab\'a', category: 'numbers', difficulty: 'beginner' },
  { id: '38', english: 'eight', arabic: 'ثَمَانِيَة', arabicTransliteration: 'thamaniya', category: 'numbers', difficulty: 'beginner' },
  { id: '39', english: 'nine', arabic: 'تِسْعَة', arabicTransliteration: 'tis\'a', category: 'numbers', difficulty: 'beginner' },
  { id: '40', english: 'ten', arabic: 'عَشَرَة', arabicTransliteration: 'ashara', category: 'numbers', difficulty: 'beginner' },

  // COLORS (Beginner)
  { id: '41', english: 'red', arabic: 'أَحْمَر', arabicTransliteration: 'ahmar', category: 'colors', difficulty: 'beginner' },
  { id: '42', english: 'blue', arabic: 'أَزْرَق', arabicTransliteration: 'azraq', category: 'colors', difficulty: 'beginner' },
  { id: '43', english: 'green', arabic: 'أَخْضَر', arabicTransliteration: 'akhdar', category: 'colors', difficulty: 'beginner' },
  { id: '44', english: 'yellow', arabic: 'أَصْفَر', arabicTransliteration: 'asfar', category: 'colors', difficulty: 'beginner' },
  { id: '45', english: 'black', arabic: 'أَسْوَد', arabicTransliteration: 'aswad', category: 'colors', difficulty: 'beginner' },
  { id: '46', english: 'white', arabic: 'أَبْيَض', arabicTransliteration: 'abyad', category: 'colors', difficulty: 'beginner' },

  // ANIMALS (Beginner)
  { id: '47', english: 'cat', arabic: 'قِطَّة', arabicTransliteration: 'qitta', category: 'animals', difficulty: 'beginner' },
  { id: '48', english: 'dog', arabic: 'كَلْب', arabicTransliteration: 'kalb', category: 'animals', difficulty: 'beginner' },
  { id: '49', english: 'bird', arabic: 'طَيْر', arabicTransliteration: 'tayr', category: 'animals', difficulty: 'beginner' },
  { id: '50', english: 'fish', arabic: 'سَمَك', arabicTransliteration: 'samak', category: 'animals', difficulty: 'beginner' },
  { id: '51', english: 'horse', arabic: 'حِصَان', arabicTransliteration: 'hisan', category: 'animals', difficulty: 'beginner' },

  // INTERMEDIATE WORDS - FOOD & DRINKS
  { id: '52', english: 'coffee', arabic: 'قَهْوَة', arabicTransliteration: 'qahwa', category: 'food', difficulty: 'intermediate' },
  { id: '53', english: 'tea', arabic: 'شَاي', arabicTransliteration: 'shay', category: 'food', difficulty: 'intermediate' },
  { id: '54', english: 'rice', arabic: 'أَرُز', arabicTransliteration: 'aruz', category: 'food', difficulty: 'intermediate' },
  { id: '55', english: 'meat', arabic: 'لَحْم', arabicTransliteration: 'lahm', category: 'food', difficulty: 'intermediate' },
  { id: '56', english: 'chicken', arabic: 'دَجَاج', arabicTransliteration: 'dajaj', category: 'food', difficulty: 'intermediate' },
  { id: '57', english: 'fish', arabic: 'سَمَك', arabicTransliteration: 'samak', category: 'food', difficulty: 'intermediate' },
  { id: '58', english: 'vegetables', arabic: 'خُضَار', arabicTransliteration: 'khudar', category: 'food', difficulty: 'intermediate' },
  { id: '59', english: 'fruit', arabic: 'فَاكِهَة', arabicTransliteration: 'fakiha', category: 'food', difficulty: 'intermediate' },
  { id: '60', english: 'apple', arabic: 'تُفَّاح', arabicTransliteration: 'tuffah', category: 'food', difficulty: 'intermediate' },
  { id: '61', english: 'banana', arabic: 'مَوْز', arabicTransliteration: 'mawz', category: 'food', difficulty: 'intermediate' },

  // INTERMEDIATE WORDS - TIME & WEATHER
  { id: '62', english: 'today', arabic: 'الْيَوْم', arabicTransliteration: 'al-yawm', category: 'time', difficulty: 'intermediate' },
  { id: '63', english: 'tomorrow', arabic: 'غَدًا', arabicTransliteration: 'ghadan', category: 'time', difficulty: 'intermediate' },
  { id: '64', english: 'yesterday', arabic: 'أَمْس', arabicTransliteration: 'ams', category: 'time', difficulty: 'intermediate' },
  { id: '65', english: 'morning', arabic: 'صَبَاح', arabicTransliteration: 'sabah', category: 'time', difficulty: 'intermediate' },
  { id: '66', english: 'afternoon', arabic: 'بَعْدَ الظُّهْر', arabicTransliteration: 'ba\'d al-zhuhr', category: 'time', difficulty: 'intermediate' },
  { id: '67', english: 'evening', arabic: 'مَسَاء', arabicTransliteration: 'masa\'', category: 'time', difficulty: 'intermediate' },
  { id: '68', english: 'night', arabic: 'لَيْل', arabicTransliteration: 'layl', category: 'time', difficulty: 'intermediate' },
  { id: '69', english: 'sunny', arabic: 'مُشْمِس', arabicTransliteration: 'mushmis', category: 'weather', difficulty: 'intermediate' },
  { id: '70', english: 'rainy', arabic: 'مُمْطِر', arabicTransliteration: 'mumtir', category: 'weather', difficulty: 'intermediate' },
  { id: '71', english: 'cold', arabic: 'بَارِد', arabicTransliteration: 'barid', category: 'weather', difficulty: 'intermediate' },
  { id: '72', english: 'hot', arabic: 'حَار', arabicTransliteration: 'har', category: 'weather', difficulty: 'intermediate' },

  // INTERMEDIATE WORDS - BODY PARTS
  { id: '73', english: 'head', arabic: 'رَأْس', arabicTransliteration: 'ra\'s', category: 'body', difficulty: 'intermediate' },
  { id: '74', english: 'eye', arabic: 'عَيْن', arabicTransliteration: 'ayn', category: 'body', difficulty: 'intermediate' },
  { id: '75', english: 'ear', arabic: 'أُذُن', arabicTransliteration: 'udhun', category: 'body', difficulty: 'intermediate' },
  { id: '76', english: 'nose', arabic: 'أَنْف', arabicTransliteration: 'anf', category: 'body', difficulty: 'intermediate' },
  { id: '77', english: 'mouth', arabic: 'فَم', arabicTransliteration: 'fam', category: 'body', difficulty: 'intermediate' },
  { id: '78', english: 'hand', arabic: 'يَد', arabicTransliteration: 'yad', category: 'body', difficulty: 'intermediate' },
  { id: '79', english: 'foot', arabic: 'قَدَم', arabicTransliteration: 'qadam', category: 'body', difficulty: 'intermediate' },
  { id: '80', english: 'heart', arabic: 'قَلْب', arabicTransliteration: 'qalb', category: 'body', difficulty: 'intermediate' },

  // ADVANCED WORDS - EMOTIONS & FEELINGS
  { id: '81', english: 'happy', arabic: 'سَعِيد', arabicTransliteration: 'sa\'id', category: 'emotions', difficulty: 'advanced' },
  { id: '82', english: 'sad', arabic: 'حَزِين', arabicTransliteration: 'hazin', category: 'emotions', difficulty: 'advanced' },
  { id: '83', english: 'angry', arabic: 'غَاضِب', arabicTransliteration: 'ghadib', category: 'emotions', difficulty: 'advanced' },
  { id: '84', english: 'excited', arabic: 'مُتَحَمِّس', arabicTransliteration: 'mutahammis', category: 'emotions', difficulty: 'advanced' },
  { id: '85', english: 'worried', arabic: 'قَلِق', arabicTransliteration: 'qaliq', category: 'emotions', difficulty: 'advanced' },
  { id: '86', english: 'surprised', arabic: 'مُفَاجَأ', arabicTransliteration: 'mufaja\'', category: 'emotions', difficulty: 'advanced' },
  { id: '87', english: 'tired', arabic: 'تَعْبَان', arabicTransliteration: 'ta\'ban', category: 'emotions', difficulty: 'advanced' },
  { id: '88', english: 'confused', arabic: 'مُحَيَّر', arabicTransliteration: 'muhayyar', category: 'emotions', difficulty: 'advanced' },

  // ADVANCED WORDS - PROFESSIONS
  { id: '89', english: 'doctor', arabic: 'طَبِيب', arabicTransliteration: 'tabib', category: 'professions', difficulty: 'advanced' },
  { id: '90', english: 'engineer', arabic: 'مُهَنْدِس', arabicTransliteration: 'muhandis', category: 'professions', difficulty: 'advanced' },
  { id: '91', english: 'lawyer', arabic: 'مُحَامِي', arabicTransliteration: 'muhami', category: 'professions', difficulty: 'advanced' },
  { id: '92', english: 'artist', arabic: 'فَنَّان', arabicTransliteration: 'fannan', category: 'professions', difficulty: 'advanced' },
  { id: '93', english: 'musician', arabic: 'مُوسِيقِي', arabicTransliteration: 'musiqi', category: 'professions', difficulty: 'advanced' },
  { id: '94', english: 'chef', arabic: 'طَبَّاخ', arabicTransliteration: 'tabbakh', category: 'professions', difficulty: 'advanced' },
  { id: '95', english: 'pilot', arabic: 'طَيَّار', arabicTransliteration: 'tayyar', category: 'professions', difficulty: 'advanced' },
  { id: '96', english: 'journalist', arabic: 'صَحَفِي', arabicTransliteration: 'sahafi', category: 'professions', difficulty: 'advanced' },

  // ADVANCED WORDS - TECHNOLOGY
  { id: '97', english: 'computer', arabic: 'حَاسُوب', arabicTransliteration: 'hasub', category: 'technology', difficulty: 'advanced' },
  { id: '98', english: 'phone', arabic: 'هَاتِف', arabicTransliteration: 'hatif', category: 'technology', difficulty: 'advanced' },
  { id: '99', english: 'internet', arabic: 'إِنْتَرْنِت', arabicTransliteration: 'internet', category: 'technology', difficulty: 'advanced' },
  { id: '100', english: 'website', arabic: 'مَوْقِع', arabicTransliteration: 'mawqi\'', category: 'technology', difficulty: 'advanced' },
  { id: '101', english: 'email', arabic: 'بَرِيد إِلِكْتْرُونِي', arabicTransliteration: 'barid iliktruni', category: 'technology', difficulty: 'advanced' },
  { id: '102', english: 'software', arabic: 'بَرْمَجِيَّات', arabicTransliteration: 'barmajiyyat', category: 'technology', difficulty: 'advanced' },
  { id: '103', english: 'application', arabic: 'تَطْبِيق', arabicTransliteration: 'tatbiq', category: 'technology', difficulty: 'advanced' },
  { id: '104', english: 'database', arabic: 'قَاعِدَة بَيَانَات', arabicTransliteration: 'qa\'ida bayanat', category: 'technology', difficulty: 'advanced' },
  { id: '105', english: 'security', arabic: 'أَمْن', arabicTransliteration: 'amn', category: 'technology', difficulty: 'advanced' },
  { id: '106', english: 'password', arabic: 'كَلِمَة مَرور', arabicTransliteration: 'kalimat murur', category: 'technology', difficulty: 'advanced' }
];

// Category-based vocabulary organization
export const VOCABULARY_CATEGORIES = {
  greetings: 'Greetings & Polite Expressions',
  basics: 'Basic Essentials',
  family: 'Family & People',
  numbers: 'Numbers',
  colors: 'Colors',
  animals: 'Animals',
  food: 'Food & Drinks',
  time: 'Time',
  weather: 'Weather',
  body: 'Body Parts',
  emotions: 'Emotions & Feelings',
  professions: 'Professions',
  technology: 'Technology'
};

// Get vocabulary by category
export const getVocabularyByCategory = (category: string) => {
  return VOCABULARY_DATA.filter(word => word.category === category);
};

// Get vocabulary by difficulty
export const getVocabularyByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  return VOCABULARY_DATA.filter(word => word.difficulty === difficulty);
};

// Get vocabulary by language learning mode
export const getVocabularyForLanguage = (learningLanguage: 'english' | 'arabic') => {
  return VOCABULARY_DATA;
};
