'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Target
} from 'lucide-react';

export default function GettingStartedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to LinguaAI",
      subtitle: "Your Personal Language Learning Journey",
      icon: <BookOpen className="w-16 h-16 text-purple-400" />,
      description: "Master new languages with AI-powered lessons, interactive quizzes, and personalized learning paths.",
      features: [
        "AI-powered lessons",
        "Interactive quizzes",
        "Real-time progress tracking",
        "Multi-language support"
      ]
    },
    {
      title: "Learn Anywhere, Anytime",
      subtitle: "Flexible Learning Experience",
      icon: <Globe className="w-16 h-16 text-blue-400" />,
      description: "Access your lessons on any device with offline support and personalized learning schedules.",
      features: [
        "Mobile-first design",
        "Offline learning",
        "Cross-platform sync",
        "Adaptive scheduling"
      ]
    },
    {
      title: "Track Your Progress",
      subtitle: "Achieve Your Language Goals",
      icon: <Trophy className="w-16 h-16 text-yellow-400" />,
      description: "Monitor your learning journey with detailed analytics, streaks, and achievement badges.",
      features: [
        "Progress analytics",
        "Learning streaks",
        "Achievement badges",
        "Leaderboard rankings"
      ]
    },
    {
      title: "Join a Global Community",
      subtitle: "Learn Together, Grow Together",
      icon: <Users className="w-16 h-16 text-green-400" />,
      description: "Connect with learners worldwide, share achievements, and compete on the global leaderboard.",
      features: [
        "Global leaderboard",
        "Social learning",
        "Community challenges",
        "Peer motivation"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSkip = () => {
    router.push('/auth/login');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index <= currentStep ? 'bg-purple-500' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              {currentStepData.icon}
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              {currentStepData.title}
            </h1>
            
            <h2 className="text-xl text-purple-300 mb-4">
              {currentStepData.subtitle}
            </h2>
            
            <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
              {currentStepData.description}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-white/70">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-white/70 hover:text-white transition-colors"
            >
              Skip Introduction
            </button>
            
            <div className="flex items-center space-x-4">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
