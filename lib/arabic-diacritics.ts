// Arabic Diacritics and RTL Support
export const arabicDiacritics = {
  // Common Arabic diacritics for better text rendering
  diacritics: {
    fatha: 'َ',    // َ
    damma: 'ُ',    // ُ
    kasra: 'ِ',    // ِ
    sukun: 'ْ',    // ْ
    shadda: 'ّ',   // ّ
    fathatan: 'ً', // ً
    dammatan: 'ٌ', // ٌ
    kasratan: 'ٍ'  // ٍ
  },

  // Arabic text with proper diacritics for common words
  commonWords: {
    welcome: 'مَرْحَباً',
    learning: 'تَعَلُّم',
    language: 'لُغَة',
    practice: 'مُمَارَسَة',
    lesson: 'دَرْس',
    quiz: 'اِخْتِبَار',
    progress: 'تَقَدُّم',
    achievement: 'إِنْجَاز',
    level: 'مُسْتَوَى',
    streak: 'سِلْسِلَة',
    points: 'نِقَاط',
    coach: 'مُدَرِّب',
    smart: 'ذَكِي',
    artificial: 'اِصْطِنَاعِي',
    intelligence: 'ذَكَاء'
  },

  // RTL text direction utilities
  rtl: {
    isRTL: (text: string) => {
      const arabicRegex = /[\u0600-\u06FF]/;
      return arabicRegex.test(text);
    },
    
    getDirection: (text: string) => {
      return arabicDiacritics.rtl.isRTL(text) ? 'rtl' : 'ltr';
    },

    // Apply proper text direction to elements
    applyDirection: (element: HTMLElement, text: string) => {
      element.dir = arabicDiacritics.rtl.getDirection(text);
      element.lang = arabicDiacritics.rtl.isRTL(text) ? 'ar' : 'en';
    }
  },

  // Enhanced Arabic text with diacritics
  enhancedText: {
    welcomeBack: 'مَرْحَباً بِعُودَتِكَ',
    readyToLearn: 'مُسْتَعِدٌ لِمُوَاصَلَةِ التَّعَلُّمِ؟',
    startJourney: 'اِبْدَأْ رِحْلَةَ تَعَلُّمِ اللُّغَةِ!',
    joinLearners: 'اِنْضَمَّ إِلَى آلافِ المُتَعَلِّمِينَ حَوْلَ العَالَمِ وَأَتْقِنْ لُغَاتٍ جَدِيدَةٍ بِدُرُوسٍ مَدْعُومَةٍ بِالذَّكَاءِ الِاصْطِنَاعِيِّ',
    getStarted: 'اِبْدَأْ مَجَّاناً',
    signIn: 'تَسْجِيلُ الدُّخُولِ',
    selectLanguage: 'اخْتَرِ اللُّغَةَ',
    aiCoach: 'المُدَرِّبُ الذَّكِيُّ',
    dayStreak: 'يَوْمٌ مُتَتَالٍ',
    totalXP: 'إِجْمَالِيُّ النِّقَاطِ',
    level: 'المُسْتَوَى'
  }
};

// CSS classes for Arabic RTL support
export const arabicStyles = `
  .arabic-text {
    direction: rtl;
    text-align: right;
    font-family: 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif;
  }
  
  .arabic-text input,
  .arabic-text textarea {
    direction: rtl;
    text-align: right;
  }
  
  .arabic-text .flex {
    flex-direction: row-reverse;
  }
  
  .arabic-text .space-x-2 > * + * {
    margin-left: 0;
    margin-right: 0.5rem;
  }
  
  .arabic-text .space-x-3 > * + * {
    margin-left: 0;
    margin-right: 0.75rem;
  }
  
  .arabic-text .space-x-4 > * + * {
    margin-left: 0;
    margin-right: 1rem;
  }
`;

// Hook for Arabic RTL support
export const useArabicRTL = (text: string) => {
  const isRTL = arabicDiacritics.rtl.isRTL(text);
  const direction = arabicDiacritics.rtl.getDirection(text);
  
  return {
    isRTL,
    direction,
    className: isRTL ? 'arabic-text' : '',
    style: {
      direction: direction as 'rtl' | 'ltr',
      textAlign: isRTL ? 'right' : 'left'
    }
  };
};
