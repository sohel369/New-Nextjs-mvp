import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../lib/translations';

/**
 * Custom hook for easy translation access
 * Usage: const t = useTranslation();
 * Then: t('welcome') or t('home')
 */
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}

/**
 * Hook for getting current language info and translation function
 * Usage: const { t, currentLanguage, isRTL } = useLanguageAndTranslation();
 */
export function useLanguageAndTranslation() {
  const { t, currentLanguage, isRTL } = useLanguage();
  return { t, currentLanguage, isRTL };
}

/**
 * Hook for translating with fallback
 * Usage: const translate = useTranslationWithFallback();
 * Then: translate('welcome', 'Welcome') - uses fallback if translation missing
 */
export function useTranslationWithFallback() {
  const { t } = useLanguage();
  
  return (key: TranslationKey, fallback?: string) => {
    const translation = t(key);
    return translation === key ? (fallback || key) : translation;
  };
}
