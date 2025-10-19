'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey, LanguageCode } from '../lib/translations';

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  isRTL: boolean;
}

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  isRTL: boolean;
  t: (key: TranslationKey) => string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', isRTL: false },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', isRTL: false },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', isRTL: false },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭', isRTL: false },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage (only on client side)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selected-language');
      if (savedLanguage) {
        const language = languages.find(lang => lang.code === savedLanguage);
        if (language) {
          setCurrentLanguage(language);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Save language to localStorage
      localStorage.setItem('selected-language', currentLanguage.code);
      
      // Update document direction and language
      document.documentElement.dir = currentLanguage.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLanguage.code;
      
      // Add Arabic-specific styles for better RTL support
      if (currentLanguage.code === 'ar') {
        document.documentElement.classList.add('arabic-layout');
        document.body.classList.add('arabic-text');
      } else {
        document.documentElement.classList.remove('arabic-layout');
        document.body.classList.remove('arabic-text');
      }
    }
  }, [currentLanguage]);

  const handleSetLanguage = (language: Language) => {
    console.log('Context: Setting language to:', language);
    console.log('Context: Previous language was:', currentLanguage);
    setCurrentLanguage(language);
    // Force a re-render by updating localStorage immediately (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-language', language.code);
      document.documentElement.dir = language.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language.code;
      console.log('Context: Updated DOM attributes - dir:', document.documentElement.dir, 'lang:', document.documentElement.lang);
    }
  };

  // Translation function
  const t = (key: TranslationKey): string => {
    const currentTranslations = translations[currentLanguage.code as LanguageCode];
    if (!currentTranslations) {
      console.warn(`No translations found for language: ${currentLanguage.code}`);
      return translations.en[key] || key;
    }
    const translation = (currentTranslations as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
    console.log(`Translation: ${key} -> ${translation} (lang: ${currentLanguage.code})`);
    return translation;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setCurrentLanguage: handleSetLanguage,
        isRTL: currentLanguage.isRTL,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { languages };
