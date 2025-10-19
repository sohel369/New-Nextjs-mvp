'use client';

import Link from 'next/link';

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Simple Navigation Test</h1>
      
      <div className="space-y-4">
        <Link href="/" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Homepage
        </Link>
        
        <Link href="/lessons" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Go to Lessons
        </Link>
        
        <Link href="/test-navigation" className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Go to Context Test
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold text-white mb-2">Test Results:</h2>
        <p className="text-gray-300">If you can see this page, basic navigation is working.</p>
        <p className="text-gray-300">Check the browser console for any errors.</p>
      </div>
    </div>
  );
}
