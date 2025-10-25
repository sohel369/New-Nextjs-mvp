'use client';

import { useState } from 'react';
import { sendMessage } from '../../lib/gemini';

export default function TestGeminiChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const reply = await sendMessage(message);
      setResponse(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Gemini AI Chat Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Gemini Integration</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask the AI coach anything about language learning..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {response && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-600">AI Response:</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-800">{response}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Error:</h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">About This Test:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Tests the Gemini API integration</li>
            <li>• Uses the sendMessage function from lib/gemini.ts</li>
            <li>• Calls the /api/chat endpoint</li>
            <li>• Shows real-time AI responses</li>
            <li>• Handles errors gracefully</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
