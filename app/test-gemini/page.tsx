"use client";

import { useState } from 'react';

export default function TestGeminiPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (data.reply) {
        setResponse(data.reply);
      } else {
        setError('No valid response received from Gemini.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gemini API Test</h1>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your message:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-red-800 font-medium">Error:</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            {response && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-green-800 font-medium">Gemini Response:</h3>
                <p className="text-green-700 mt-1 whitespace-pre-wrap">{response}</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Test Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enter a message in the text area above</li>
              <li>• Click "Send Message" to test the Gemini API</li>
              <li>• Check the browser console for detailed logs</li>
              <li>• Try messages like "Hello", "Help me learn English", or "What's the weather?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
