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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 pb-20 sm:pb-24">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    index <= currentStep ? 'bg-purple-500' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                {currentStepData.icon}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              {currentStepData.title}
            </h1>
            
            <h2 className="text-lg sm:text-xl md:text-2xl text-purple-300 mb-3 sm:mb-4 px-2">
              {currentStepData.subtitle}
            </h2>
            
            <p className="text-white/80 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              {currentStepData.description}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto px-2">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center sm:justify-start space-x-2 text-white/70 text-sm sm:text-base">
                  <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handleSkip}
              className="text-white/70 hover:text-white transition-colors text-sm sm:text-base px-2 py-2 sm:py-0 order-2 sm:order-1"
            >
              Skip Introduction
            </button>
            
            <div className="flex items-center justify-end sm:justify-start space-x-2 sm:space-x-4 order-1 sm:order-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 sm:mt-8 px-2">
          <p className="text-white/50 text-xs sm:text-sm">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-purple-400 hover:text-purple-300 transition-colors underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
