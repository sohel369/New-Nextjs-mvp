// Language Data and Quiz Questions for Language Learning App
// Optimized for faster loading and better performance

export const INTERFACE_LANGUAGES = {
  english: {
    code: 'en',
    name: 'English',
    native: 'English',
    flag: '🇺🇸',
    isRTL: false
  },
  arabic: {
    code: 'ar',
    name: 'Arabic',
    native: 'العربية',
    flag: '🇸🇦',
    isRTL: true
  }
};

export const TRANSLATIONS = {
  english: {
    question: 'Question',
    correctAnswer: 'Correct Answer',
    nextQuestion: 'Next Question',
    finishQuiz: 'Finish Quiz',
    welcome: 'Welcome',
    readyToLearn: 'Ready to learn?',
    dayStreak: 'Day Streak',
    totalXP: 'Total XP',
    level: 'Level',
    selectLanguage: 'Select Language',
    continue: 'Continue',
    lessons: 'Lessons',
    aiCoach: 'AI Coach',
    quiz: 'Quiz',
    leaderboard: 'Leaderboard',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    submitAnswer: 'Submit Answer',
    playAudio: 'Play Audio',
    playing: 'Playing...',
    hearCorrectAnswer: 'Hear correct answer',
    explanation: 'Explanation',
    retakeQuiz: 'Retake Quiz',
    backToDashboard: 'Back to Dashboard',
    quizComplete: 'Quiz Complete!',
    score: 'Score',
    accuracy: 'Accuracy',
    time: 'Time',
    startEnhancedQuiz: 'Start Enhanced Quiz',
    startBasicQuiz: 'Start Basic Quiz',
    chooseYourQuiz: 'Choose Your Quiz',
    selectQuizType: 'Select the type of quiz you\'d like to take',
    enhancedQuiz: 'Enhanced Quiz',
    basicQuiz: 'Basic Quiz',
    advancedQuiz: 'Advanced quiz with multiple question types',
    simpleQuiz: 'Simple quiz with standard questions',
    differentQuestionTypes: '8 Different Question Types',
    audioPronunciation: 'Audio & Pronunciation Practice',
    realTimeScoring: 'Real-time Scoring & Timing',
    googleTTSIntegration: 'Google TTS Integration',
    arabicVowelSupport: 'Arabic Vowel Support',
    multipleChoiceQuestions: 'Multiple Choice Questions',
    trueFalseQuestions: 'True/False Questions',
    fillInTheBlank: 'Fill in the Blank',
    quickAndSimple: 'Quick & Simple'
  },
  arabic: {
    question: 'سؤال',
    correctAnswer: 'الإجابة الصحيحة',
    nextQuestion: 'السؤال التالي',
    finishQuiz: 'إنهاء الاختبار',
    welcome: 'مرحباً',
    readyToLearn: 'مستعد للتعلم؟',
    dayStreak: 'سلسلة الأيام',
    totalXP: 'النقاط الإجمالية',
    level: 'المستوى',
    selectLanguage: 'اختر اللغة',
    continue: 'متابعة',
    lessons: 'الدروس',
    aiCoach: 'المدرب الذكي',
    quiz: 'الاختبار',
    leaderboard: 'لوحة المتصدرين',
    correct: 'صحيح!',
    incorrect: 'خطأ',
    submitAnswer: 'إرسال الإجابة',
    playAudio: 'تشغيل الصوت',
    playing: 'جاري التشغيل...',
    hearCorrectAnswer: 'سماع الإجابة الصحيحة',
    explanation: 'التفسير',
    retakeQuiz: 'إعادة الاختبار',
    backToDashboard: 'العودة للوحة التحكم',
    quizComplete: 'تم الانتهاء من الاختبار!',
    score: 'النتيجة',
    accuracy: 'الدقة',
    time: 'الوقت',
    startEnhancedQuiz: 'بدء الاختبار المتقدم',
    startBasicQuiz: 'بدء الاختبار الأساسي',
    chooseYourQuiz: 'اختر اختبارك',
    selectQuizType: 'اختر نوع الاختبار الذي تريد أن تأخذه',
    enhancedQuiz: 'الاختبار المتقدم',
    basicQuiz: 'الاختبار الأساسي',
    advancedQuiz: 'اختبار متقدم مع أنواع أسئلة متعددة',
    simpleQuiz: 'اختبار بسيط مع أسئلة عادية',
    differentQuestionTypes: '8 أنواع أسئلة مختلفة',
    audioPronunciation: 'ممارسة الصوت والنطق',
    realTimeScoring: 'تسجيل النقاط والتوقيت في الوقت الفعلي',
    googleTTSIntegration: 'تكامل Google TTS',
    arabicVowelSupport: 'دعم الحركات العربية',
    multipleChoiceQuestions: 'أسئلة الاختيار من متعدد',
    trueFalseQuestions: 'أسئلة صح أو خطأ',
    fillInTheBlank: 'ملء الفراغات',
    quickAndSimple: 'سريع وبسيط'
  }
};

export const QUIZ_QUESTIONS = {
  english: [
    // Science Questions
    {
      id: 1,
      type: "multiple_choice",
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0,
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 2,
      type: "true_false",
      question: "The Earth revolves around the Sun.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 3,
      type: "multiple_choice",
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Jupiter", "Saturn", "Neptune"],
      correct: 1,
      difficulty: "intermediate",
      category: "science"
    },
    {
      id: 4,
      type: "short_answer",
      question: "What gas do plants absorb from the atmosphere?",
      answer: "carbon dioxide",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 5,
      type: "true_false",
      question: "Light travels faster than sound.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    
    // ABC/Alphabet Questions
    {
      id: 6,
      type: "multiple_choice",
      question: "What letter comes after 'M' in the alphabet?",
      options: ["L", "N", "O", "P"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 7,
      type: "fill_blank",
      question: "Complete the sequence: A, B, C, D, _____",
      options: ["E", "F", "G", "H"],
      blank: "E",
      correct: 0,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 8,
      type: "multiple_choice",
      question: "How many letters are in the English alphabet?",
      options: ["24", "25", "26", "27"],
      correct: 2,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 9,
      type: "true_false",
      question: "The letter 'Z' is the last letter of the English alphabet.",
      correct: true,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 10,
      type: "short_answer",
      question: "What letter comes before 'K' in the alphabet?",
      answer: "J",
      difficulty: "beginner",
      category: "alphabet"
    },
    
    // International Knowledge
    {
      id: 11,
      type: "multiple_choice",
      question: "What is the capital of Japan?",
      options: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 12,
      type: "true_false",
      question: "The Great Wall of China is visible from space.",
      correct: false,
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 13,
      type: "multiple_choice",
      question: "Which country is known as the 'Land of the Rising Sun'?",
      options: ["China", "Japan", "South Korea", "Thailand"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 14,
      type: "short_answer",
      question: "What is the largest country in the world by area?",
      answer: "Russia",
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 15,
      type: "multiple_choice",
      question: "Which continent is Brazil located in?",
      options: ["North America", "South America", "Africa", "Europe"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    
    // Social Studies
    {
      id: 16,
      type: "multiple_choice",
      question: "What is the study of past events called?",
      options: ["Geography", "History", "Biology", "Mathematics"],
      correct: 1,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 17,
      type: "true_false",
      question: "Democracy means rule by the people.",
      correct: true,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 18,
      type: "multiple_choice",
      question: "What is the study of human society and social relationships called?",
      options: ["Psychology", "Sociology", "Anthropology", "Philosophy"],
      correct: 1,
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 19,
      type: "short_answer",
      question: "What document established the United States as an independent nation?",
      answer: "Declaration of Independence",
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 20,
      type: "true_false",
      question: "The United Nations was founded after World War II.",
      correct: true,
      difficulty: "intermediate",
      category: "social"
    },
    
    // European Knowledge
    {
      id: 21,
      type: "multiple_choice",
      question: "What is the capital of France?",
      options: ["Lyon", "Marseille", "Paris", "Nice"],
      correct: 2,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 22,
      type: "true_false",
      question: "The United Kingdom is made up of four countries: England, Scotland, Wales, and Northern Ireland.",
      correct: true,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 23,
      type: "multiple_choice",
      question: "Which European country is famous for pasta and pizza?",
      options: ["Spain", "France", "Italy", "Greece"],
      correct: 2,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 24,
      type: "short_answer",
      question: "What is the longest river in Europe?",
      answer: "Volga",
      difficulty: "intermediate",
      category: "europe"
    },
    {
      id: 25,
      type: "multiple_choice",
      question: "Which European country is known for chocolate and watches?",
      options: ["Austria", "Switzerland", "Belgium", "Netherlands"],
      correct: 1,
      difficulty: "beginner",
      category: "europe"
    },
    
    // Additional Science Questions
    {
      id: 26,
      type: "multiple_choice",
      question: "What is the center of an atom called?",
      options: ["Nucleus", "Electron", "Proton", "Neutron"],
      correct: 0,
      difficulty: "intermediate",
      category: "science"
    },
    {
      id: 27,
      type: "true_false",
      question: "The human body has 206 bones.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 28,
      type: "short_answer",
      question: "What is the process by which plants make their own food?",
      answer: "photosynthesis",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 29,
      type: "multiple_choice",
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Diamond", "Iron", "Platinum"],
      correct: 1,
      difficulty: "intermediate",
      category: "science"
    },
    {
      id: 30,
      type: "true_false",
      question: "The heart has four chambers.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    
    // Additional ABC/Alphabet Questions
    {
      id: 31,
      type: "multiple_choice",
      question: "What letter comes before 'H' in the alphabet?",
      options: ["F", "G", "I", "J"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 32,
      type: "fill_blank",
      question: "Complete: Q, R, S, T, _____",
      options: ["U", "V", "W", "X"],
      blank: "U",
      correct: 0,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 33,
      type: "true_false",
      question: "The letter 'A' is a vowel.",
      correct: true,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 34,
      type: "short_answer",
      question: "What is the first letter of the English alphabet?",
      answer: "A",
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 35,
      type: "multiple_choice",
      question: "How many vowels are in the English alphabet?",
      options: ["4", "5", "6", "7"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet"
    },
    
    // Additional International Knowledge
    {
      id: 36,
      type: "multiple_choice",
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correct: 2,
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 37,
      type: "true_false",
      question: "Mount Everest is the tallest mountain in the world.",
      correct: true,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 38,
      type: "short_answer",
      question: "What is the smallest country in the world?",
      answer: "Vatican City",
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 39,
      type: "multiple_choice",
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 40,
      type: "true_false",
      question: "The Amazon rainforest is located in South America.",
      correct: true,
      difficulty: "beginner",
      category: "international"
    },
    
    // Additional Social Studies
    {
      id: 41,
      type: "multiple_choice",
      question: "What is the study of the Earth's physical features called?",
      options: ["History", "Geography", "Biology", "Chemistry"],
      correct: 1,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 42,
      type: "true_false",
      question: "The Renaissance was a period of cultural rebirth in Europe.",
      correct: true,
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 43,
      type: "short_answer",
      question: "What is the study of government and political systems called?",
      answer: "Political Science",
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 44,
      type: "multiple_choice",
      question: "What is the study of human behavior and mental processes called?",
      options: ["Sociology", "Psychology", "Anthropology", "Philosophy"],
      correct: 1,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 45,
      type: "true_false",
      question: "The Industrial Revolution began in the 18th century.",
      correct: true,
      difficulty: "intermediate",
      category: "social"
    },
    
    // Additional European Knowledge
    {
      id: 46,
      type: "multiple_choice",
      question: "What is the capital of Germany?",
      options: ["Munich", "Hamburg", "Berlin", "Frankfurt"],
      correct: 2,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 47,
      type: "true_false",
      question: "The Euro is the currency used in most European Union countries.",
      correct: true,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 48,
      type: "short_answer",
      question: "What is the longest river in the United Kingdom?",
      answer: "Thames",
      difficulty: "intermediate",
      category: "europe"
    },
    {
      id: 49,
      type: "multiple_choice",
      question: "Which European country is famous for windmills and tulips?",
      options: ["Belgium", "Netherlands", "Denmark", "Sweden"],
      correct: 1,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 50,
      type: "true_false",
      question: "The Eiffel Tower is located in Paris, France.",
      correct: true,
      difficulty: "beginner",
      category: "europe"
    },
    
    // English Language Learning Questions
    {
      id: 51,
      type: "multiple_choice",
      question: "What is the English word for 'مرحبا'?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 52,
      type: "true_false",
      question: "The English word 'book' means 'كتاب' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 53,
      type: "short_answer",
      question: "What does 'شكرا' mean in English?",
      answer: "thank you",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 54,
      type: "multiple_choice",
      question: "What is the English word for 'ماء'?",
      options: ["fire", "water", "air", "earth"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 55,
      type: "true_false",
      question: "English is written from left to right.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 56,
      type: "fill_blank",
      question: "Complete: I read a _____ (كتاب)",
      options: ["book", "pen", "paper", "desk"],
      blank: "book",
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 57,
      type: "multiple_choice",
      question: "What is the English word for 'بيت'?",
      options: ["house", "book", "car", "tree"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 58,
      type: "short_answer",
      question: "What is the English word for 'صديق'?",
      answer: "friend",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 59,
      type: "true_false",
      question: "The English word 'school' means 'مدرسة' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 60,
      type: "multiple_choice",
      question: "What is the English word for 'أم'?",
      options: ["father", "mother", "brother", "sister"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    
    // Arabic Language Learning Questions
    {
      id: 61,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'hello'؟",
      options: ["مرحبا", "شكرا", "مع السلامة", "أهلا وسهلا"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 62,
      type: "true_false",
      question: "كلمة 'book' تعني 'كتاب' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 63,
      type: "short_answer",
      question: "ما معنى كلمة 'thank you' بالعربية؟",
      answer: "شكرا",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 64,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'water'؟",
      options: ["نار", "ماء", "هواء", "تراب"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 65,
      type: "true_false",
      question: "اللغة العربية تُكتب من اليمين إلى اليسار.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 66,
      type: "fill_blank",
      question: "أكمل: أنا أقرأ _____ (book)",
      options: ["كتاب", "قلم", "ورقة", "مكتب"],
      blank: "كتاب",
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 67,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'house'؟",
      options: ["بيت", "كتاب", "سيارة", "شجرة"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 68,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'friend'؟",
      answer: "صديق",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 69,
      type: "true_false",
      question: "كلمة 'school' تعني 'مدرسة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 70,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'mother'؟",
      options: ["أب", "أم", "أخ", "أخت"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    
    // Additional Basic Quiz Questions - English Learning (Unique from Enhanced)
    {
      id: 71,
      type: "multiple_choice",
      question: "What is the English word for 'أكل'?",
      options: ["eat", "drink", "sleep", "walk"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 72,
      type: "true_false",
      question: "The English word 'car' means 'سيارة' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 73,
      type: "short_answer",
      question: "What is the English word for 'سماء'?",
      answer: "sky",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 74,
      type: "multiple_choice",
      question: "What is the English word for 'شمس'?",
      options: ["moon", "sun", "star", "cloud"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 75,
      type: "true_false",
      question: "The English word 'tree' means 'شجرة' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 76,
      type: "fill_blank",
      question: "Complete: I see a _____ (شجرة)",
      options: ["tree", "car", "house", "book"],
      blank: "tree",
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 77,
      type: "multiple_choice",
      question: "What is the English word for 'قمر'?",
      options: ["sun", "moon", "star", "planet"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 78,
      type: "short_answer",
      question: "What is the English word for 'أرض'?",
      answer: "earth",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 79,
      type: "true_false",
      question: "The English word 'flower' means 'زهرة' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 80,
      type: "multiple_choice",
      question: "What is the English word for 'نهر'?",
      options: ["mountain", "river", "lake", "ocean"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    
    // Additional Basic Quiz Questions - Arabic Learning (Unique from Enhanced)
    {
      id: 81,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'eat'؟",
      options: ["أكل", "شرب", "نام", "مشى"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 82,
      type: "true_false",
      question: "كلمة 'car' الإنجليزية تعني 'سيارة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 83,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'sky'؟",
      answer: "سماء",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 84,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'sun'؟",
      options: ["قمر", "شمس", "نجمة", "سحابة"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 85,
      type: "true_false",
      question: "كلمة 'tree' الإنجليزية تعني 'شجرة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 86,
      type: "fill_blank",
      question: "أكمل: أنا أرى _____ (tree)",
      options: ["شجرة", "سيارة", "بيت", "كتاب"],
      blank: "شجرة",
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 87,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'moon'؟",
      options: ["شمس", "قمر", "نجمة", "كوكب"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 88,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'earth'؟",
      answer: "أرض",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 89,
      type: "true_false",
      question: "كلمة 'flower' الإنجليزية تعني 'زهرة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 90,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'river'؟",
      options: ["جبل", "نهر", "بحيرة", "محيط"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    
    // More Basic Quiz Questions - Daily Life (English)
    {
      id: 91,
      type: "multiple_choice",
      question: "What is the English word for 'ملابس'?",
      options: ["clothes", "shoes", "hat", "bag"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 92,
      type: "true_false",
      question: "The English word 'shoes' means 'أحذية' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 93,
      type: "short_answer",
      question: "What is the English word for 'سرير'?",
      answer: "bed",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 94,
      type: "multiple_choice",
      question: "What is the English word for 'طاولة'?",
      options: ["chair", "table", "desk", "shelf"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 95,
      type: "true_false",
      question: "The English word 'chair' means 'كرسي' in Arabic.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    
    // More Basic Quiz Questions - Daily Life (Arabic)
    {
      id: 96,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'clothes'؟",
      options: ["ملابس", "أحذية", "قبعة", "حقيبة"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 97,
      type: "true_false",
      question: "كلمة 'shoes' الإنجليزية تعني 'أحذية' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 98,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'bed'؟",
      answer: "سرير",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 99,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'table'؟",
      options: ["كرسي", "طاولة", "مكتب", "رف"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 100,
      type: "true_false",
      question: "كلمة 'chair' الإنجليزية تعني 'كرسي' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    }
  ],
  arabic: [
    // Science Questions (Arabic)
    {
      id: 1,
      type: "multiple_choice",
      question: "ما هو الرمز الكيميائي للماء؟",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0,
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 2,
      type: "true_false",
      question: "الأرض تدور حول الشمس.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 3,
      type: "multiple_choice",
      question: "ما هو أكبر كوكب في نظامنا الشمسي؟",
      options: ["الأرض", "المشتري", "زحل", "نبتون"],
      correct: 1,
      difficulty: "intermediate",
      category: "science"
    },
    {
      id: 4,
      type: "short_answer",
      question: "ما هو الغاز الذي تمتصه النباتات من الغلاف الجوي؟",
      answer: "ثاني أكسيد الكربون",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 5,
      type: "true_false",
      question: "الضوء ينتقل أسرع من الصوت.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    
    // ABC/Alphabet Questions (Arabic)
    {
      id: 6,
      type: "multiple_choice",
      question: "ما هو الحرف الذي يأتي بعد 'م' في الأبجدية الإنجليزية؟",
      options: ["ل", "ن", "و", "ب"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 7,
      type: "fill_blank",
      question: "أكمل التسلسل: A, B, C, D, _____",
      options: ["E", "F", "G", "H"],
      blank: "E",
      correct: 0,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 8,
      type: "multiple_choice",
      question: "كم عدد الحروف في الأبجدية الإنجليزية؟",
      options: ["24", "25", "26", "27"],
      correct: 2,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 9,
      type: "true_false",
      question: "الحرف 'Z' هو آخر حرف في الأبجدية الإنجليزية.",
      correct: true,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 10,
      type: "short_answer",
      question: "ما هو الحرف الذي يأتي قبل 'K' في الأبجدية؟",
      answer: "J",
      difficulty: "beginner",
      category: "alphabet"
    },
    
    // International Knowledge (Arabic)
    {
      id: 11,
      type: "multiple_choice",
      question: "ما هي عاصمة اليابان؟",
      options: ["أوساكا", "طوكيو", "كيوتو", "هيروشيما"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 12,
      type: "true_false",
      question: "سور الصين العظيم مرئي من الفضاء.",
      correct: false,
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 13,
      type: "multiple_choice",
      question: "أي دولة تُعرف باسم 'أرض الشمس المشرقة'؟",
      options: ["الصين", "اليابان", "كوريا الجنوبية", "تايلاند"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 14,
      type: "short_answer",
      question: "ما هي أكبر دولة في العالم من حيث المساحة؟",
      answer: "روسيا",
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 15,
      type: "multiple_choice",
      question: "في أي قارة تقع البرازيل؟",
      options: ["أمريكا الشمالية", "أمريكا الجنوبية", "أفريقيا", "أوروبا"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    
    // Social Studies (Arabic)
    {
      id: 16,
      type: "multiple_choice",
      question: "ما هو اسم دراسة الأحداث الماضية؟",
      options: ["الجغرافيا", "التاريخ", "الأحياء", "الرياضيات"],
      correct: 1,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 17,
      type: "true_false",
      question: "الديمقراطية تعني حكم الشعب.",
      correct: true,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 18,
      type: "multiple_choice",
      question: "ما هو اسم دراسة المجتمع البشري والعلاقات الاجتماعية؟",
      options: ["علم النفس", "علم الاجتماع", "الأنثروبولوجيا", "الفلسفة"],
      correct: 1,
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 19,
      type: "short_answer",
      question: "ما هو الوثيقة التي أسست الولايات المتحدة كدولة مستقلة؟",
      answer: "إعلان الاستقلال",
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 20,
      type: "true_false",
      question: "الأمم المتحدة تأسست بعد الحرب العالمية الثانية.",
      correct: true,
      difficulty: "intermediate",
      category: "social"
    },
    
    // European Knowledge (Arabic)
    {
      id: 21,
      type: "multiple_choice",
      question: "ما هي عاصمة فرنسا؟",
      options: ["ليون", "مرسيليا", "باريس", "نيس"],
      correct: 2,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 22,
      type: "true_false",
      question: "المملكة المتحدة تتكون من أربع دول: إنجلترا، اسكتلندا، ويلز، وأيرلندا الشمالية.",
      correct: true,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 23,
      type: "multiple_choice",
      question: "أي دولة أوروبية مشهورة بالمعكرونة والبيتزا؟",
      options: ["إسبانيا", "فرنسا", "إيطاليا", "اليونان"],
      correct: 2,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 24,
      type: "short_answer",
      question: "ما هو أطول نهر في أوروبا؟",
      answer: "فولغا",
      difficulty: "intermediate",
      category: "europe"
    },
    {
      id: 25,
      type: "multiple_choice",
      question: "أي دولة أوروبية مشهورة بالشوكولاتة والساعات؟",
      options: ["النمسا", "سويسرا", "بلجيكا", "هولندا"],
      correct: 1,
      difficulty: "beginner",
      category: "europe"
    },
    
    // Additional Science Questions (Arabic)
    {
      id: 26,
      type: "multiple_choice",
      question: "ما هو مركز الذرة؟",
      options: ["النواة", "الإلكترون", "البروتون", "النيوترون"],
      correct: 0,
      difficulty: "intermediate",
      category: "science"
    },
    {
      id: 27,
      type: "true_false",
      question: "الجسم البشري يحتوي على 206 عظمة.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 28,
      type: "short_answer",
      question: "ما هو اسم العملية التي تصنع بها النباتات طعامها؟",
      answer: "التمثيل الضوئي",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 29,
      type: "multiple_choice",
      question: "ما هو أقسى مادة طبيعية على الأرض؟",
      options: ["الذهب", "الماس", "الحديد", "البلاتين"],
      correct: 1,
      difficulty: "intermediate",
      category: "science"
    },
    {
      id: 30,
      type: "true_false",
      question: "القلب يحتوي على أربع حجرات.",
      correct: true,
      difficulty: "beginner",
      category: "science"
    },
    
    // Additional ABC/Alphabet Questions (Arabic)
    {
      id: 31,
      type: "multiple_choice",
      question: "ما هو الحرف الذي يأتي قبل 'H' في الأبجدية؟",
      options: ["F", "G", "I", "J"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 32,
      type: "fill_blank",
      question: "أكمل: Q, R, S, T, _____",
      options: ["U", "V", "W", "X"],
      blank: "U",
      correct: 0,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 33,
      type: "true_false",
      question: "الحرف 'A' هو حرف متحرك.",
      correct: true,
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 34,
      type: "short_answer",
      question: "ما هو أول حرف في الأبجدية الإنجليزية؟",
      answer: "A",
      difficulty: "beginner",
      category: "alphabet"
    },
    {
      id: 35,
      type: "multiple_choice",
      question: "كم عدد الحروف المتحركة في الأبجدية الإنجليزية؟",
      options: ["4", "5", "6", "7"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet"
    },
    
    // Additional International Knowledge (Arabic)
    {
      id: 36,
      type: "multiple_choice",
      question: "ما هي عاصمة أستراليا؟",
      options: ["سيدني", "ملبورن", "كانبرا", "بيرث"],
      correct: 2,
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 37,
      type: "true_false",
      question: "جبل إفرست هو أعلى جبل في العالم.",
      correct: true,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 38,
      type: "short_answer",
      question: "ما هي أصغر دولة في العالم؟",
      answer: "الفاتيكان",
      difficulty: "intermediate",
      category: "international"
    },
    {
      id: 39,
      type: "multiple_choice",
      question: "أي محيط هو الأكبر؟",
      options: ["الأطلسي", "الهادئ", "الهندي", "المتجمد الشمالي"],
      correct: 1,
      difficulty: "beginner",
      category: "international"
    },
    {
      id: 40,
      type: "true_false",
      question: "غابات الأمازون المطيرة تقع في أمريكا الجنوبية.",
      correct: true,
      difficulty: "beginner",
      category: "international"
    },
    
    // Additional Social Studies (Arabic)
    {
      id: 41,
      type: "multiple_choice",
      question: "ما هو اسم دراسة المعالم الفيزيائية للأرض؟",
      options: ["التاريخ", "الجغرافيا", "الأحياء", "الكيمياء"],
      correct: 1,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 42,
      type: "true_false",
      question: "النهضة كانت فترة إحياء ثقافي في أوروبا.",
      correct: true,
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 43,
      type: "short_answer",
      question: "ما هو اسم دراسة الحكومة والنظم السياسية؟",
      answer: "العلوم السياسية",
      difficulty: "intermediate",
      category: "social"
    },
    {
      id: 44,
      type: "multiple_choice",
      question: "ما هو اسم دراسة السلوك البشري والعمليات العقلية؟",
      options: ["علم الاجتماع", "علم النفس", "الأنثروبولوجيا", "الفلسفة"],
      correct: 1,
      difficulty: "beginner",
      category: "social"
    },
    {
      id: 45,
      type: "true_false",
      question: "الثورة الصناعية بدأت في القرن الثامن عشر.",
      correct: true,
      difficulty: "intermediate",
      category: "social"
    },
    
    // Additional European Knowledge (Arabic)
    {
      id: 46,
      type: "multiple_choice",
      question: "ما هي عاصمة ألمانيا؟",
      options: ["ميونخ", "هامبورغ", "برلين", "فرانكفورت"],
      correct: 2,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 47,
      type: "true_false",
      question: "اليورو هو العملة المستخدمة في معظم دول الاتحاد الأوروبي.",
      correct: true,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 48,
      type: "short_answer",
      question: "ما هو أطول نهر في المملكة المتحدة؟",
      answer: "التايمز",
      difficulty: "intermediate",
      category: "europe"
    },
    {
      id: 49,
      type: "multiple_choice",
      question: "أي دولة أوروبية مشهورة بطواحين الهواء والزنبق؟",
      options: ["بلجيكا", "هولندا", "الدنمارك", "السويد"],
      correct: 1,
      difficulty: "beginner",
      category: "europe"
    },
    {
      id: 50,
      type: "true_false",
      question: "برج إيفل يقع في باريس، فرنسا.",
      correct: true,
      difficulty: "beginner",
      category: "europe"
    },
    
    // English Language Learning Questions (Arabic)
    {
      id: 51,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'مرحبا'؟",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 52,
      type: "true_false",
      question: "كلمة 'book' الإنجليزية تعني 'كتاب' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 53,
      type: "short_answer",
      question: "ما معنى كلمة 'شكرا' بالإنجليزية؟",
      answer: "thank you",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 54,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'ماء'؟",
      options: ["fire", "water", "air", "earth"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 55,
      type: "true_false",
      question: "اللغة الإنجليزية تُكتب من اليسار إلى اليمين.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 56,
      type: "fill_blank",
      question: "أكمل: I read a _____ (كتاب)",
      options: ["book", "pen", "paper", "desk"],
      blank: "book",
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 57,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'بيت'؟",
      options: ["house", "book", "car", "tree"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 58,
      type: "short_answer",
      question: "ما هي الكلمة الإنجليزية لكلمة 'صديق'؟",
      answer: "friend",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 59,
      type: "true_false",
      question: "كلمة 'school' الإنجليزية تعني 'مدرسة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 60,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'أم'؟",
      options: ["father", "mother", "brother", "sister"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    
    // Arabic Language Learning Questions (Arabic)
    {
      id: 61,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'hello'؟",
      options: ["مرحبا", "شكرا", "مع السلامة", "أهلا وسهلا"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 62,
      type: "true_false",
      question: "كلمة 'book' تعني 'كتاب' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 63,
      type: "short_answer",
      question: "ما معنى كلمة 'thank you' بالعربية؟",
      answer: "شكرا",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 64,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'water'؟",
      options: ["نار", "ماء", "هواء", "تراب"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 65,
      type: "true_false",
      question: "اللغة العربية تُكتب من اليمين إلى اليسار.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 66,
      type: "fill_blank",
      question: "أكمل: أنا أقرأ _____ (book)",
      options: ["كتاب", "قلم", "ورقة", "مكتب"],
      blank: "كتاب",
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 67,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'house'؟",
      options: ["بيت", "كتاب", "سيارة", "شجرة"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 68,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'friend'؟",
      answer: "صديق",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 69,
      type: "true_false",
      question: "كلمة 'school' تعني 'مدرسة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 70,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'mother'؟",
      options: ["أب", "أم", "أخ", "أخت"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    
    // Additional Basic Quiz Questions - English Learning (Unique from Enhanced)
    {
      id: 71,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'أكل'؟",
      options: ["eat", "drink", "sleep", "walk"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 72,
      type: "true_false",
      question: "كلمة 'car' الإنجليزية تعني 'سيارة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 73,
      type: "short_answer",
      question: "ما هي الكلمة الإنجليزية لكلمة 'سماء'؟",
      answer: "sky",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 74,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'شمس'؟",
      options: ["moon", "sun", "star", "cloud"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 75,
      type: "true_false",
      question: "كلمة 'tree' الإنجليزية تعني 'شجرة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 76,
      type: "fill_blank",
      question: "أكمل: I see a _____ (شجرة)",
      options: ["tree", "car", "house", "book"],
      blank: "tree",
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 77,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'قمر'؟",
      options: ["sun", "moon", "star", "planet"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 78,
      type: "short_answer",
      question: "ما هي الكلمة الإنجليزية لكلمة 'أرض'؟",
      answer: "earth",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 79,
      type: "true_false",
      question: "كلمة 'flower' الإنجليزية تعني 'زهرة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 80,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'نهر'؟",
      options: ["mountain", "river", "lake", "ocean"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    
    // Additional Basic Quiz Questions - Arabic Learning (Unique from Enhanced)
    {
      id: 81,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'eat'؟",
      options: ["أكل", "شرب", "نام", "مشى"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 82,
      type: "true_false",
      question: "كلمة 'car' الإنجليزية تعني 'سيارة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 83,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'sky'؟",
      answer: "سماء",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 84,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'sun'؟",
      options: ["قمر", "شمس", "نجمة", "سحابة"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 85,
      type: "true_false",
      question: "كلمة 'tree' الإنجليزية تعني 'شجرة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 86,
      type: "fill_blank",
      question: "أكمل: أنا أرى _____ (tree)",
      options: ["شجرة", "سيارة", "بيت", "كتاب"],
      blank: "شجرة",
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 87,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'moon'؟",
      options: ["شمس", "قمر", "نجمة", "كوكب"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 88,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'earth'؟",
      answer: "أرض",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 89,
      type: "true_false",
      question: "كلمة 'flower' الإنجليزية تعني 'زهرة' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 90,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'river'؟",
      options: ["جبل", "نهر", "بحيرة", "محيط"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    
    // More Basic Quiz Questions - Daily Life (English)
    {
      id: 91,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'ملابس'؟",
      options: ["clothes", "shoes", "hat", "bag"],
      correct: 0,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 92,
      type: "true_false",
      question: "كلمة 'shoes' الإنجليزية تعني 'أحذية' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 93,
      type: "short_answer",
      question: "ما هي الكلمة الإنجليزية لكلمة 'سرير'؟",
      answer: "bed",
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 94,
      type: "multiple_choice",
      question: "ما هي الكلمة الإنجليزية لكلمة 'طاولة'؟",
      options: ["chair", "table", "desk", "shelf"],
      correct: 1,
      difficulty: "beginner",
      category: "english_language"
    },
    {
      id: 95,
      type: "true_false",
      question: "كلمة 'chair' الإنجليزية تعني 'كرسي' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "english_language"
    },
    
    // More Basic Quiz Questions - Daily Life (Arabic)
    {
      id: 96,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'clothes'؟",
      options: ["ملابس", "أحذية", "قبعة", "حقيبة"],
      correct: 0,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 97,
      type: "true_false",
      question: "كلمة 'shoes' الإنجليزية تعني 'أحذية' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 98,
      type: "short_answer",
      question: "ما هي الكلمة العربية لكلمة 'bed'؟",
      answer: "سرير",
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 99,
      type: "multiple_choice",
      question: "ما هي الكلمة العربية لكلمة 'table'؟",
      options: ["كرسي", "طاولة", "مكتب", "رف"],
      correct: 1,
      difficulty: "beginner",
      category: "arabic_language"
    },
    {
      id: 100,
      type: "true_false",
      question: "كلمة 'chair' الإنجليزية تعني 'كرسي' بالعربية.",
      correct: true,
      difficulty: "beginner",
      category: "arabic_language"
    }
  ]
};

// Quiz History Interface
export interface QuizHistory {
  id: string;
  userId: string;
  quizType: 'basic' | 'enhanced';
  language: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number; // in seconds
  completedAt: string;
  questions: Array<{
    questionId: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

// Enhanced Quiz Question Types
export interface EnhancedQuizQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'audio_pronunciation' | 'translation' | 'grammar' | 'listening';
  question: string;
  options?: string[];
  correct?: number | boolean | string;
  answer?: string;
  blank?: string;
  audioUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  explanation?: string;
  hints?: string[];
}

export const ENHANCED_QUIZ_QUESTIONS: Record<string, EnhancedQuizQuestion[]> = {
  english: [
    // Science Questions
    {
      id: 1,
      type: "multiple_choice",
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0,
      difficulty: "beginner",
      category: "science",
      explanation: "H2O represents two hydrogen atoms and one oxygen atom, which makes water."
    },
    {
      id: 2,
      type: "true_false",
      question: "The Earth revolves around the Sun.",
      correct: true,
      difficulty: "beginner",
      category: "science",
      explanation: "The Earth takes approximately 365 days to complete one revolution around the Sun."
    },
    {
      id: 3,
      type: "multiple_choice",
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Jupiter", "Saturn", "Neptune"],
      correct: 1,
      difficulty: "intermediate",
      category: "science",
      explanation: "Jupiter is the largest planet in our solar system, more than twice as massive as all other planets combined."
    },
    {
      id: 4,
      type: "short_answer",
      question: "What gas do plants absorb from the atmosphere?",
      answer: "carbon dioxide",
      difficulty: "beginner",
      category: "science",
      explanation: "Plants absorb carbon dioxide (CO2) from the atmosphere during photosynthesis."
    },
    {
      id: 5,
      type: "true_false",
      question: "Light travels faster than sound.",
      correct: true,
      difficulty: "beginner",
      category: "science",
      explanation: "Light travels at approximately 300,000 km/s while sound travels at about 343 m/s in air."
    },
    
    // ABC/Alphabet Questions
    {
      id: 6,
      type: "multiple_choice",
      question: "What letter comes after 'M' in the alphabet?",
      options: ["L", "N", "O", "P"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "The alphabet sequence is: L, M, N, O, P..."
    },
    {
      id: 7,
      type: "fill_blank",
      question: "Complete the sequence: A, B, C, D, _____",
      options: ["E", "F", "G", "H"],
      blank: "E",
      correct: 0,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "The sequence follows the alphabetical order: A, B, C, D, E, F, G..."
    },
    {
      id: 8,
      type: "multiple_choice",
      question: "How many letters are in the English alphabet?",
      options: ["24", "25", "26", "27"],
      correct: 2,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "The English alphabet has 26 letters, from A to Z."
    },
    {
      id: 9,
      type: "true_false",
      question: "The letter 'Z' is the last letter of the English alphabet.",
      correct: true,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "Z is indeed the 26th and final letter of the English alphabet."
    },
    {
      id: 10,
      type: "short_answer",
      question: "What letter comes before 'K' in the alphabet?",
      answer: "J",
      difficulty: "beginner",
      category: "alphabet",
      explanation: "The alphabetical order is: I, J, K, L, M..."
    },
    
    // International Knowledge
    {
      id: 11,
      type: "multiple_choice",
      question: "What is the capital of Japan?",
      options: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"],
      correct: 1,
      difficulty: "beginner",
      category: "international",
      explanation: "Tokyo is the capital and largest city of Japan."
    },
    {
      id: 12,
      type: "true_false",
      question: "The Great Wall of China is visible from space.",
      correct: false,
      difficulty: "intermediate",
      category: "international",
      explanation: "Despite popular belief, the Great Wall of China is not visible from space with the naked eye."
    },
    {
      id: 13,
      type: "multiple_choice",
      question: "Which country is known as the 'Land of the Rising Sun'?",
      options: ["China", "Japan", "South Korea", "Thailand"],
      correct: 1,
      difficulty: "beginner",
      category: "international",
      explanation: "Japan is called 'Land of the Rising Sun' because it is located to the east of the Asian continent."
    },
    {
      id: 14,
      type: "short_answer",
      question: "What is the largest country in the world by area?",
      answer: "Russia",
      difficulty: "intermediate",
      category: "international",
      explanation: "Russia is the largest country by land area, covering over 17 million square kilometers."
    },
    {
      id: 15,
      type: "multiple_choice",
      question: "Which continent is Brazil located in?",
      options: ["North America", "South America", "Africa", "Europe"],
      correct: 1,
      difficulty: "beginner",
      category: "international",
      explanation: "Brazil is the largest country in South America."
    },
    
    // Social Studies
    {
      id: 16,
      type: "multiple_choice",
      question: "What is the study of past events called?",
      options: ["Geography", "History", "Biology", "Mathematics"],
      correct: 1,
      difficulty: "beginner",
      category: "social",
      explanation: "History is the study of past events, particularly human affairs."
    },
    {
      id: 17,
      type: "true_false",
      question: "Democracy means rule by the people.",
      correct: true,
      difficulty: "beginner",
      category: "social",
      explanation: "Democracy comes from Greek words meaning 'rule by the people'."
    },
    {
      id: 18,
      type: "multiple_choice",
      question: "What is the study of human society and social relationships called?",
      options: ["Psychology", "Sociology", "Anthropology", "Philosophy"],
      correct: 1,
      difficulty: "intermediate",
      category: "social",
      explanation: "Sociology is the study of human society, social relationships, and social institutions."
    },
    {
      id: 19,
      type: "short_answer",
      question: "What document established the United States as an independent nation?",
      answer: "Declaration of Independence",
      difficulty: "intermediate",
      category: "social",
      explanation: "The Declaration of Independence was adopted on July 4, 1776, establishing the United States as an independent nation."
    },
    {
      id: 20,
      type: "true_false",
      question: "The United Nations was founded after World War II.",
      correct: true,
      difficulty: "intermediate",
      category: "social",
      explanation: "The United Nations was established on October 24, 1945, after World War II to promote international cooperation."
    },
    
    // European Knowledge
    {
      id: 21,
      type: "multiple_choice",
      question: "What is the capital of France?",
      options: ["Lyon", "Marseille", "Paris", "Nice"],
      correct: 2,
      difficulty: "beginner",
      category: "europe",
      explanation: "Paris is the capital and largest city of France."
    },
    {
      id: 22,
      type: "true_false",
      question: "The United Kingdom is made up of four countries: England, Scotland, Wales, and Northern Ireland.",
      correct: true,
      difficulty: "beginner",
      category: "europe",
      explanation: "The UK consists of four constituent countries: England, Scotland, Wales, and Northern Ireland."
    },
    {
      id: 23,
      type: "multiple_choice",
      question: "Which European country is famous for pasta and pizza?",
      options: ["Spain", "France", "Italy", "Greece"],
      correct: 2,
      difficulty: "beginner",
      category: "europe",
      explanation: "Italy is famous for its pasta and pizza, which are integral parts of Italian cuisine."
    },
    {
      id: 24,
      type: "short_answer",
      question: "What is the longest river in Europe?",
      answer: "Volga",
      difficulty: "intermediate",
      category: "europe",
      explanation: "The Volga River in Russia is the longest river in Europe, flowing for about 3,690 kilometers."
    },
    {
      id: 25,
      type: "multiple_choice",
      question: "Which European country is known for chocolate and watches?",
      options: ["Austria", "Switzerland", "Belgium", "Netherlands"],
      correct: 1,
      difficulty: "beginner",
      category: "europe",
      explanation: "Switzerland is famous for its high-quality chocolate and precision watches."
    }
  ],
  arabic: [
    // Science Questions (Arabic)
    {
      id: 1,
      type: "multiple_choice",
      question: "ما هو الرمز الكيميائي للماء؟",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0,
      difficulty: "beginner",
      category: "science",
      explanation: "H2O يمثل ذرتين من الهيدروجين وذرة واحدة من الأكسجين، مما يشكل الماء."
    },
    {
      id: 2,
      type: "true_false",
      question: "الأرض تدور حول الشمس.",
      correct: true,
      difficulty: "beginner",
      category: "science",
      explanation: "تستغرق الأرض حوالي 365 يوماً لإكمال دورة واحدة حول الشمس."
    },
    {
      id: 3,
      type: "multiple_choice",
      question: "ما هو أكبر كوكب في نظامنا الشمسي؟",
      options: ["الأرض", "المشتري", "زحل", "نبتون"],
      correct: 1,
      difficulty: "intermediate",
      category: "science",
      explanation: "المشتري هو أكبر كوكب في نظامنا الشمسي، وأكبر من ضعف كتلة جميع الكواكب الأخرى مجتمعة."
    },
    {
      id: 4,
      type: "short_answer",
      question: "ما هو الغاز الذي تمتصه النباتات من الغلاف الجوي؟",
      answer: "ثاني أكسيد الكربون",
      difficulty: "beginner",
      category: "science",
      explanation: "النباتات تمتص ثاني أكسيد الكربون (CO2) من الغلاف الجوي أثناء عملية التمثيل الضوئي."
    },
    {
      id: 5,
      type: "true_false",
      question: "الضوء ينتقل أسرع من الصوت.",
      correct: true,
      difficulty: "beginner",
      category: "science",
      explanation: "الضوء ينتقل بسرعة حوالي 300,000 كم/ث بينما الصوت ينتقل بسرعة حوالي 343 م/ث في الهواء."
    },
    
    // ABC/Alphabet Questions (Arabic)
    {
      id: 6,
      type: "multiple_choice",
      question: "ما هو الحرف الذي يأتي بعد 'م' في الأبجدية الإنجليزية؟",
      options: ["ل", "ن", "و", "ب"],
      correct: 1,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "تسلسل الأبجدية هو: ل، م، ن، و، ب..."
    },
    {
      id: 7,
      type: "fill_blank",
      question: "أكمل التسلسل: A, B, C, D, _____",
      options: ["E", "F", "G", "H"],
      blank: "E",
      correct: 0,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "التسلسل يتبع الترتيب الأبجدي: A, B, C, D, E, F, G..."
    },
    {
      id: 8,
      type: "multiple_choice",
      question: "كم عدد الحروف في الأبجدية الإنجليزية؟",
      options: ["24", "25", "26", "27"],
      correct: 2,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "الأبجدية الإنجليزية تحتوي على 26 حرفاً، من A إلى Z."
    },
    {
      id: 9,
      type: "true_false",
      question: "الحرف 'Z' هو آخر حرف في الأبجدية الإنجليزية.",
      correct: true,
      difficulty: "beginner",
      category: "alphabet",
      explanation: "Z هو بالفعل الحرف السادس والعشرون والأخير في الأبجدية الإنجليزية."
    },
    {
      id: 10,
      type: "short_answer",
      question: "ما هو الحرف الذي يأتي قبل 'K' في الأبجدية؟",
      answer: "J",
      difficulty: "beginner",
      category: "alphabet",
      explanation: "الترتيب الأبجدي هو: I, J, K, L, M..."
    },
    
    // International Knowledge (Arabic)
    {
      id: 11,
      type: "multiple_choice",
      question: "ما هي عاصمة اليابان؟",
      options: ["أوساكا", "طوكيو", "كيوتو", "هيروشيما"],
      correct: 1,
      difficulty: "beginner",
      category: "international",
      explanation: "طوكيو هي عاصمة اليابان وأكبر مدنها."
    },
    {
      id: 12,
      type: "true_false",
      question: "سور الصين العظيم مرئي من الفضاء.",
      correct: false,
      difficulty: "intermediate",
      category: "international",
      explanation: "على الرغم من الاعتقاد الشائع، فإن سور الصين العظيم غير مرئي من الفضاء بالعين المجردة."
    },
    {
      id: 13,
      type: "multiple_choice",
      question: "أي دولة تُعرف باسم 'أرض الشمس المشرقة'؟",
      options: ["الصين", "اليابان", "كوريا الجنوبية", "تايلاند"],
      correct: 1,
      difficulty: "beginner",
      category: "international",
      explanation: "اليابان تُسمى 'أرض الشمس المشرقة' لأنها تقع شرق القارة الآسيوية."
    },
    {
      id: 14,
      type: "short_answer",
      question: "ما هي أكبر دولة في العالم من حيث المساحة؟",
      answer: "روسيا",
      difficulty: "intermediate",
      category: "international",
      explanation: "روسيا هي أكبر دولة في العالم من حيث المساحة، حيث تغطي أكثر من 17 مليون كيلومتر مربع."
    },
    {
      id: 15,
      type: "multiple_choice",
      question: "في أي قارة تقع البرازيل؟",
      options: ["أمريكا الشمالية", "أمريكا الجنوبية", "أفريقيا", "أوروبا"],
      correct: 1,
      difficulty: "beginner",
      category: "international",
      explanation: "البرازيل هي أكبر دولة في أمريكا الجنوبية."
    },
    
    // Social Studies (Arabic)
    {
      id: 16,
      type: "multiple_choice",
      question: "ما هو اسم دراسة الأحداث الماضية؟",
      options: ["الجغرافيا", "التاريخ", "الأحياء", "الرياضيات"],
      correct: 1,
      difficulty: "beginner",
      category: "social",
      explanation: "التاريخ هو دراسة الأحداث الماضية، خاصة الشؤون الإنسانية."
    },
    {
      id: 17,
      type: "true_false",
      question: "الديمقراطية تعني حكم الشعب.",
      correct: true,
      difficulty: "beginner",
      category: "social",
      explanation: "الديمقراطية تأتي من الكلمات اليونانية التي تعني 'حكم الشعب'."
    },
    {
      id: 18,
      type: "multiple_choice",
      question: "ما هو اسم دراسة المجتمع البشري والعلاقات الاجتماعية؟",
      options: ["علم النفس", "علم الاجتماع", "الأنثروبولوجيا", "الفلسفة"],
      correct: 1,
      difficulty: "intermediate",
      category: "social",
      explanation: "علم الاجتماع هو دراسة المجتمع البشري والعلاقات الاجتماعية والمؤسسات الاجتماعية."
    },
    {
      id: 19,
      type: "short_answer",
      question: "ما هو الوثيقة التي أسست الولايات المتحدة كدولة مستقلة؟",
      answer: "إعلان الاستقلال",
      difficulty: "intermediate",
      category: "social",
      explanation: "تم اعتماد إعلان الاستقلال في 4 يوليو 1776، مما أسس الولايات المتحدة كدولة مستقلة."
    },
    {
      id: 20,
      type: "true_false",
      question: "الأمم المتحدة تأسست بعد الحرب العالمية الثانية.",
      correct: true,
      difficulty: "intermediate",
      category: "social",
      explanation: "تأسست الأمم المتحدة في 24 أكتوبر 1945، بعد الحرب العالمية الثانية لتعزيز التعاون الدولي."
    },
    
    // European Knowledge (Arabic)
    {
      id: 21,
      type: "multiple_choice",
      question: "ما هي عاصمة فرنسا؟",
      options: ["ليون", "مرسيليا", "باريس", "نيس"],
      correct: 2,
      difficulty: "beginner",
      category: "europe",
      explanation: "باريس هي عاصمة فرنسا وأكبر مدنها."
    },
    {
      id: 22,
      type: "true_false",
      question: "المملكة المتحدة تتكون من أربع دول: إنجلترا، اسكتلندا، ويلز، وأيرلندا الشمالية.",
      correct: true,
      difficulty: "beginner",
      category: "europe",
      explanation: "المملكة المتحدة تتكون من أربع دول مكونة: إنجلترا، اسكتلندا، ويلز، وأيرلندا الشمالية."
    },
    {
      id: 23,
      type: "multiple_choice",
      question: "أي دولة أوروبية مشهورة بالمعكرونة والبيتزا؟",
      options: ["إسبانيا", "فرنسا", "إيطاليا", "اليونان"],
      correct: 2,
      difficulty: "beginner",
      category: "europe",
      explanation: "إيطاليا مشهورة بالمعكرونة والبيتزا، وهي جزء لا يتجزأ من المطبخ الإيطالي."
    },
    {
      id: 24,
      type: "short_answer",
      question: "ما هو أطول نهر في أوروبا؟",
      answer: "فولغا",
      difficulty: "intermediate",
      category: "europe",
      explanation: "نهر فولغا في روسيا هو أطول نهر في أوروبا، حيث يبلغ طوله حوالي 3,690 كيلومتر."
    },
    {
      id: 25,
      type: "multiple_choice",
      question: "أي دولة أوروبية مشهورة بالشوكولاتة والساعات؟",
      options: ["النمسا", "سويسرا", "بلجيكا", "هولندا"],
      correct: 1,
      difficulty: "beginner",
      category: "europe",
      explanation: "سويسرا مشهورة بالشوكولاتة عالية الجودة والساعات الدقيقة."
    }
  ]
};