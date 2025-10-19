'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, languages } from '../../contexts/LanguageContext';
import AIPronunciationCoach from '../../components/AIPronunciationCoach';
import AdaptiveLearningSystem from '../../components/AdaptiveLearningSystem';
import LiveTeacherIntegration from '../../components/LiveTeacherIntegration';
import EnhancedAccessibility from '../../components/EnhancedAccessibility';
import AICreativeFeatures from '../../components/AICreativeFeatures';
import { 
  Brain, 
  Mic, 
  Video, 
  Eye, 
  Sparkles, 
  Settings,
  BookOpen,
  Users,
  Accessibility,
  Wand2
} from 'lucide-react';

export default function AIFeaturesPage() {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('pronunciation');
  const [targetWord, setTargetWord] = useState('Hello');
  const [targetLanguage, setTargetLanguage] = useState(currentLanguage.code);

  const tabs = [
    {
      id: 'pronunciation',
      name: 'AI Pronunciation Coach',
      icon: Mic,
      description: 'Practice pronunciation with AI feedback'
    },
    {
      id: 'adaptive',
      name: 'Adaptive Learning',
      icon: Brain,
      description: 'Personalized learning experience'
    },
    {
      id: 'live-teacher',
      name: 'Live Teacher',
      icon: Video,
      description: 'Real-time correction and guidance'
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      icon: Accessibility,
      description: 'Enhanced accessibility options'
    },
    {
      id: 'creative',
      name: 'AI Creative Features',
      icon: Sparkles,
      description: 'AI-powered creative content'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'pronunciation':
        return (
          <AIPronunciationCoach
            targetWord={targetWord}
            targetLanguage={targetLanguage}
            onPronunciationComplete={(score) => {
              console.log('Pronunciation score:', score);
            }}
            onComplete={(result) => {
              console.log('Pronunciation result:', result);
            }}
            onProgress={(progress) => {
              console.log('Pronunciation progress:', progress);
            }}
          />
        );
      case 'adaptive':
        return (
          <AdaptiveLearningSystem
            language={targetLanguage}
            onContentUpdate={(content) => {
              console.log('Adaptive content updated:', content);
            }}
          />
        );
      case 'live-teacher':
        return (
          <LiveTeacherIntegration
            language={targetLanguage}
            onSessionStart={(session) => {
              console.log('Live session started:', session);
            }}
            onSessionEnd={(session) => {
              console.log('Live session ended:', session);
            }}
          />
        );
      case 'accessibility':
        return (
          <EnhancedAccessibility
            onSettingsChange={(settings) => {
              console.log('Accessibility settings changed:', settings);
            }}
          />
        );
      case 'creative':
        return (
          <AICreativeFeatures
            language={targetLanguage}
            onContentGenerated={(content) => {
              console.log('AI content generated:', content);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to access AI features</h1>
          <a
            href="/auth/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">AI-Powered Learning Features</h1>
          </div>
          <p className="text-white/70 text-lg">
            Experience the future of language learning with advanced AI technology
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Language Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Target Language</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>
            
            {activeTab === 'pronunciation' && (
              <div>
                <label className="block text-white font-semibold mb-2">Practice Word</label>
                <input
                  type="text"
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  placeholder="Enter word to practice..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold text-sm">{tab.name}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          {renderActiveTab()}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-white font-semibold">AI Features</div>
                <div className="text-white/70 text-sm">5 Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white font-semibold">Live Teachers</div>
                <div className="text-white/70 text-sm">Available</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Accessibility className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-white font-semibold">Accessibility</div>
                <div className="text-white/70 text-sm">Enhanced</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-white font-semibold">AI Content</div>
                <div className="text-white/70 text-sm">Unlimited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
