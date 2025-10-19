// Optimized quiz data loader for better performance
import { QUIZ_QUESTIONS, ENHANCED_QUIZ_QUESTIONS, INTERFACE_LANGUAGES, TRANSLATIONS } from '../data/languageData';

// Cache for loaded questions
const questionCache = new Map<string, any[]>();
const translationCache = new Map<string, any>();

// Preload essential data
export const preloadQuizData = () => {
  // Preload questions for both languages
  Object.keys(QUIZ_QUESTIONS).forEach(lang => {
    if (!questionCache.has(lang)) {
      questionCache.set(lang, QUIZ_QUESTIONS[lang as keyof typeof QUIZ_QUESTIONS]);
    }
  });

  // Preload translations
  Object.keys(TRANSLATIONS).forEach(lang => {
    if (!translationCache.has(lang)) {
      translationCache.set(lang, TRANSLATIONS[lang as keyof typeof TRANSLATIONS]);
    }
  });
};

// Optimized question getter
export const getQuizQuestions = (language: string) => {
  if (questionCache.has(language)) {
    return questionCache.get(language)!;
  }
  
  const questions = QUIZ_QUESTIONS[language as keyof typeof QUIZ_QUESTIONS] || QUIZ_QUESTIONS.english;
  questionCache.set(language, questions);
  return questions;
};

// Optimized enhanced questions getter
export const getEnhancedQuizQuestions = (language: string) => {
  const cacheKey = `enhanced_${language}`;
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }
  
  const questions = ENHANCED_QUIZ_QUESTIONS[language as keyof typeof ENHANCED_QUIZ_QUESTIONS] || ENHANCED_QUIZ_QUESTIONS.english;
  questionCache.set(cacheKey, questions);
  return questions;
};

// Optimized translation getter
export const getTranslation = (language: string, key: string) => {
  const cacheKey = `${language}_${key}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const translation = TRANSLATIONS[language as keyof typeof TRANSLATIONS]?.[key as keyof typeof TRANSLATIONS.english] || 
                     TRANSLATIONS.english[key as keyof typeof TRANSLATIONS.english] || key;
  translationCache.set(cacheKey, translation);
  return translation;
};

// Optimized language info getter
export const getLanguageInfo = (language: string) => {
  return INTERFACE_LANGUAGES[language as keyof typeof INTERFACE_LANGUAGES];
};

// Clear cache if needed (for development)
export const clearCache = () => {
  questionCache.clear();
  translationCache.clear();
};

// Initialize preloading
if (typeof window !== 'undefined') {
  // Only preload on client side
  preloadQuizData();
}
