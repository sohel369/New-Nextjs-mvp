'use client';

import { useState } from 'react';
import AICoach from '../../components/AICoach';
import AICoachLanguageSelector from '../../components/AICoachLanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from '../../components/BottomNavigation';

export default function AICoachPage() {
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);

  const handleLanguageSelect = (language: 'en' | 'ar') => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
  };

  const handleBackToSelector = () => {
    setShowLanguageSelector(true);
    setSelectedLanguage(null);
  };

  if (showLanguageSelector) {
    return <AICoachLanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-16 sm:pb-20 relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </Link>
          
          <button
            onClick={handleBackToSelector}
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm sm:text-base"
          >
            <span>Change Language</span>
          </button>
        </div>
        
        <AICoach language={selectedLanguage || 'en'} isRTL={selectedLanguage === 'ar'} />
      </div>
      
      {/* Bottom Navigation - Fixed */}
      <BottomNavigation />
    </div>
  );
}
