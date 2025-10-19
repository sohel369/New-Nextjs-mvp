'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Globe, 
  Star, 
  ArrowRight, 
  Play,
  Volume2,
  Bell,
  Target,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      title: "AI-Powered Lessons",
      description: "Learn with personalized lessons adapted to your learning style and pace."
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with engaging quizzes and track your progress."
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Global Community",
      description: "Join thousands of learners worldwide and compete on the leaderboard."
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      title: "Multi-Language Support",
      description: "Learn 7 different languages with native speaker audio and cultural context."
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">LinguaAI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Languages with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              {" "}AI Power
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            Learn 7 languages with AI-powered lessons, interactive quizzes, and personalized learning paths. 
            Join thousands of learners worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/getting-started"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Language Flags */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white font-medium">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose LinguaAI?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">7</div>
              <div className="text-white/70">Languages Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-white/70">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of learners and start mastering new languages today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/getting-started"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/test-complete-system"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold">LinguaAI</span>
          </div>
          <p className="text-white/50 text-sm">
            © 2024 LinguaAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
