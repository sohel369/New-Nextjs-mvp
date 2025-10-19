'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

export default function LanguageDebugger() {
  const { currentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">🌍 Language Debug</div>
      <div className="space-y-1">
        <div><strong>Current:</strong> {currentLanguage.name}</div>
        <div><strong>Code:</strong> {currentLanguage.code}</div>
        <div><strong>RTL:</strong> {isRTL ? 'Yes' : 'No'}</div>
        <div><strong>Direction:</strong> {isRTL ? 'rtl' : 'ltr'}</div>
        <div><strong>Test Translation:</strong> {t('welcome')}</div>
        <div><strong>Home:</strong> {t('home')}</div>
        <div><strong>Lessons:</strong> {t('lessons')}</div>
      </div>
    </div>
  );
}