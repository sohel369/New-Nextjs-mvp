'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SimpleLessonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-white mb-6 hover:text-purple-300">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">🎉 Lessons Page Works!</h1>
          <p className="text-xl text-gray-300 mb-8">
            If you can see this page, navigation is working correctly.
          </p>
          
          <div className="bg-gray-800/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Simple Lessons Test</h2>
            <p className="text-gray-300 mb-6">
              This is a simplified version of the lessons page to test navigation.
            </p>
            
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-500 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2">✅ Navigation Working</h3>
                <p className="text-green-200">
                  You successfully navigated from the homepage to the lessons page!
                </p>
              </div>
              
              <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Next Steps</h3>
                <p className="text-blue-200">
                  Now you can go back to the full lessons page at <code className="bg-gray-700 px-2 py-1 rounded">/lessons</code>
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4 justify-center">
              <Link 
                href="/" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
              <Link 
                href="/lessons" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Full Lessons Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
