'use client';

import { useState } from 'react';

export default function DebugGeminiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testGeminiAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing Gemini API...');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello, can you help me learn English?' }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      setResult({ 
        success: response.ok, 
        status: response.status,
        data,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (error) {
      console.error('Test error:', error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'network_error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectGemini = async () => {
    setLoading(true);
    try {
      console.log('Testing direct Gemini API call...');
      
      // Test direct API call to Gemini
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAjiOqmTiGWUpc1g3aFl2CtLdVL42BfNeg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, can you help me learn English?'
            }]
          }]
        })
      });

      const data = await response.json();
      console.log('Direct Gemini response:', data);

      setResult({ 
        success: response.ok, 
        status: response.status,
        data,
        type: 'direct_gemini'
      });
    } catch (error) {
      console.error('Direct test error:', error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'direct_gemini_error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gemini API Debug Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Our API Route</h2>
            <button
              onClick={testGeminiAPI}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test /api/chat'}
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Direct Gemini</h2>
            <button
              onClick={testDirectGemini}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Direct Gemini API'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            
            <div className={`p-4 rounded-lg mb-4 ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <strong>Status:</strong> {result.success ? 'Success' : 'Failed'}
              {result.status && <span> (HTTP {result.status})</span>}
              {result.type && <span> - {result.type}</span>}
            </div>
            
            {result.data && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Response Data:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {result.error && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-red-600">Error:</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800">{result.error}</p>
                </div>
              </div>
            )}
            
            {result.headers && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Response Headers:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(result.headers, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Debugging Steps:</h3>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>First, test our API route to see if the server is working</li>
            <li>Then test direct Gemini API to see if the key works</li>
            <li>Check the console for detailed error messages</li>
            <li>Verify the server is running on the correct port</li>
            <li>Check if the API key is valid and has proper permissions</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
