'use client';

import { useState } from 'react';
import PlacementTest from '../../components/PlacementTest';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlacementTestPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isCompleted, setIsCompleted] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [userScore, setUserScore] = useState(0);

  const handleTestComplete = (level: number, score: number) => {
    setUserLevel(level);
    setUserScore(score);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Placement Test Complete!</h1>
            <p className="text-gray-400 mb-6">Your language level has been determined</p>
            
            <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Your Level</h3>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {userLevel === 1 ? 'Beginner' : userLevel === 2 ? 'Intermediate' : 'Advanced'}
              </div>
              <p className="text-sm text-purple-200">
                Score: {Math.round(userScore)}% - Level {userLevel}
              </p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-white mb-2">What's Next?</h4>
              <p className="text-gray-300 text-sm">
                Based on your results, we recommend starting with {userLevel === 1 ? 'beginner' : userLevel === 2 ? 'intermediate' : 'advanced'} level lessons. 
                You can now access personalized content tailored to your skill level.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Link 
                href="/lessons" 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start Learning
              </Link>
              <Link 
                href="/" 
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-white mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Placement Test</h1>
          <p className="text-gray-400">Take this test to determine your language level</p>
        </div>
        
        <PlacementTest 
          language={selectedLanguage}
          onComplete={handleTestComplete}
        />
      </div>
    </div>
  );
}
