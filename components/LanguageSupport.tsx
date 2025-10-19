'use client';

import { useState, useEffect } from 'react';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { 
  Globe, 
  Check, 
  ArrowRight, 
  Users, 
  BookOpen, 
  MessageCircle,
  Star,
  Zap,
  Target,
  Award,
  Crown,
  Flame
} from 'lucide-react';

interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  speakers: number;
  countries: string[];
  features: string[];
}

interface LanguageSupportProps {
  onLanguageChange?: (language: string) => void;
}

export default function LanguageSupport({ onLanguageChange }: LanguageSupportProps) {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage.code);
  const [showLanguageDetails, setShowLanguageDetails] = useState<string | null>(null);

  const languageInfo: Record<string, LanguageInfo> = {
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      difficulty: 'easy',
      speakers: 1500000000,
      countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand'],
      features: ['Global Business Language', 'Internet Dominance', 'Academic Language', 'Tourism Language']
    },
    ar: {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true,
      difficulty: 'hard',
      speakers: 420000000,
      countries: ['Saudi Arabia', 'Egypt', 'UAE', 'Jordan', 'Lebanon'],
      features: ['Rich Literature', 'Cultural Heritage', 'Business Language', 'Religious Language']
    },
    nl: {
      code: 'nl',
      name: 'Dutch',
      nativeName: 'Nederlands',
      flag: '🇳🇱',
      rtl: false,
      difficulty: 'medium',
      speakers: 24000000,
      countries: ['Netherlands', 'Belgium', 'Suriname'],
      features: ['Business Language', 'EU Language', 'Tourism', 'Academic']
    },
    id: {
      code: 'id',
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia',
      flag: '🇮🇩',
      rtl: false,
      difficulty: 'easy',
      speakers: 280000000,
      countries: ['Indonesia', 'Malaysia', 'Brunei'],
      features: ['ASEAN Language', 'Tourism', 'Business', 'Cultural Exchange']
    },
    ms: {
      code: 'ms',
      name: 'Malay',
      nativeName: 'Bahasa Melayu',
      flag: '🇲🇾',
      rtl: false,
      difficulty: 'easy',
      speakers: 300000000,
      countries: ['Malaysia', 'Brunei', 'Singapore'],
      features: ['ASEAN Language', 'Cultural Heritage', 'Business', 'Education']
    },
    th: {
      code: 'th',
      name: 'Thai',
      nativeName: 'ไทย',
      flag: '🇹🇭',
      rtl: false,
      difficulty: 'hard',
      speakers: 70000000,
      countries: ['Thailand'],
      features: ['Cultural Heritage', 'Tourism', 'Business', 'Unique Script']
    },
    km: {
      code: 'km',
      name: 'Khmer',
      nativeName: 'ខ្មែរ',
      flag: '🇰🇭',
      rtl: false,
      difficulty: 'hard',
      speakers: 16000000,
      countries: ['Cambodia'],
      features: ['Cultural Heritage', 'Historical Language', 'Tourism', 'Unique Script']
    }
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
    }
    onLanguageChange?.(languageCode);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Globe className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Language Support</h2>
        </div>
        <p className="text-white/70">
          Choose your preferred language for the best learning experience
        </p>
      </div>

      {/* Current Language Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Current Language</h3>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        </div>
        
        {selectedLanguage && languageInfo[selectedLanguage] && (
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{languageInfo[selectedLanguage].flag}</div>
            <div>
              <h4 className="text-xl font-bold text-white">{languageInfo[selectedLanguage].name}</h4>
              <p className="text-white/70">{languageInfo[selectedLanguage].nativeName}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(languageInfo[selectedLanguage].difficulty)}`}>
                  {getDifficultyText(languageInfo[selectedLanguage].difficulty)}
                </span>
                {languageInfo[selectedLanguage].rtl && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    RTL
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Language Selection */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Available Languages</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(languageInfo).map((lang) => (
            <div
              key={lang.code}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedLanguage === lang.code
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{lang.flag}</div>
                <div>
                  <h4 className="text-white font-semibold">{lang.name}</h4>
                  <p className="text-white/70 text-sm">{lang.nativeName}</p>
                </div>
                {selectedLanguage === lang.code && (
                  <Check className="w-5 h-5 text-blue-400 ml-auto" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Speakers:</span>
                  <span className="text-white font-medium">{formatNumber(lang.speakers)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Difficulty:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(lang.difficulty)}`}>
                    {getDifficultyText(lang.difficulty)}
                  </span>
                </div>
                
                {lang.rtl && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Direction:</span>
                    <span className="text-blue-400 font-medium">Right-to-Left</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowLanguageDetails(showLanguageDetails === lang.code ? null : lang.code)}
                className="w-full mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {showLanguageDetails === lang.code ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Language Details */}
      {showLanguageDetails && languageInfo[showLanguageDetails] && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">{languageInfo[showLanguageDetails].flag}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{languageInfo[showLanguageDetails].name}</h3>
              <p className="text-white/70">{languageInfo[showLanguageDetails].nativeName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Statistics</span>
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Speakers:</span>
                  <span className="text-white font-medium">{formatNumber(languageInfo[showLanguageDetails].speakers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Difficulty Level:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(languageInfo[showLanguageDetails].difficulty)}`}>
                    {getDifficultyText(languageInfo[showLanguageDetails].difficulty)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Text Direction:</span>
                  <span className="text-white font-medium">
                    {languageInfo[showLanguageDetails].rtl ? 'Right-to-Left' : 'Left-to-Right'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-400" />
                <span>Countries</span>
              </h4>
              <div className="space-y-1">
                {languageInfo[showLanguageDetails].countries.map((country, index) => (
                  <div key={index} className="text-white/70 text-sm">• {country}</div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Key Features</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {languageInfo[showLanguageDetails].features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Learning Tips */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <span>Learning Tips</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Practice Daily</span>
            </h4>
            <p className="text-white/70 text-sm">
              Consistent daily practice is more effective than long study sessions.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span>Speak Out Loud</span>
            </h4>
            <p className="text-white/70 text-sm">
              Practice pronunciation by speaking aloud, even if you're alone.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Set Goals</span>
            </h4>
            <p className="text-white/70 text-sm">
              Set achievable goals and track your progress to stay motivated.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>Immerse Yourself</span>
            </h4>
            <p className="text-white/70 text-sm">
              Watch movies, listen to music, and read in your target language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
