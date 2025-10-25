"use client";

import { useState, useRef } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export default function TestAudioPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speech recognition
  const speech = useSpeechRecognition({ 
    language: 'en-US',
    continuous: false,
    interimResults: false 
  });

  const testTTS = () => {
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    const testText = "Hello! This is a test of the text-to-speech feature. Can you hear me clearly?";
    
    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError('');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        const errorMessage = event?.error || event?.type || 'Unknown speech synthesis error';
        setError(`TTS Error: ${errorMessage}`);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      setError(`TTS Setup Error: ${error}`);
    }
  };

  const testMicrophone = () => {
    if (!speech.isSupported) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    setError('');
    speech.clearError();
    
    speech.start().then(() => {
      setError('Listening... Speak now!');
      speech.attachResultHandler((res) => {
        if (res.transcript) {
          setMessage(res.transcript);
          setError('Speech recognized: ' + res.transcript);
          speech.stop();
        }
      });
    }).catch((error) => {
      setError(`Microphone Error: ${error.message || error}`);
    });
  };

  const testAPI = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');

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
        setError('');
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

  const speakResponse = () => {
    if (!response) return;
    
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError('');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        const errorMessage = event?.error || event?.type || 'Unknown speech synthesis error';
        setError(`TTS Error: ${errorMessage}`);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      setError(`TTS Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Audio Features Test</h1>
          
          {/* Browser Support Check */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Browser Support</h2>
            <div className="space-y-2">
              <div>Speech Synthesis: {typeof window !== 'undefined' && 'speechSynthesis' in window ? '✅ Supported' : '❌ Not Supported'}</div>
              <div>Speech Recognition: {speech.isSupported ? '✅ Supported' : '❌ Not Supported'}</div>
              <div>HTTPS/Localhost: {typeof window !== 'undefined' && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? '✅ Secure' : '❌ Not Secure'}</div>
                </div>
              </div>

          {/* TTS Test */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Text-to-Speech Test</h2>
              <button
              onClick={testTTS}
              disabled={isSpeaking}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSpeaking ? 'Speaking...' : 'Test TTS'}
              </button>
            <p className="text-sm text-gray-600 mt-2">Click to test if you can hear audio output</p>
            </div>

          {/* Microphone Test */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Microphone Test</h2>
            <button
              onClick={testMicrophone}
              disabled={speech.isListening}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {speech.isListening ? 'Listening...' : 'Test Microphone'}
            </button>
            <p className="text-sm text-gray-600 mt-2">Click and speak to test microphone input</p>
            {speech.error && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {speech.error}
                </div>
            )}
                </div>

          {/* API Test */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">API Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                onClick={testAPI}
                disabled={loading || !message.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send to API'}
              </button>
            </div>
          </div>

          {/* Response Display */}
          {response && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">API Response</h2>
              <p className="text-gray-700 mb-2">{response}</p>
              <button
                onClick={speakResponse}
                disabled={isSpeaking}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSpeaking ? 'Speaking...' : 'Speak Response'}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Error:</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

        {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Test Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Check browser support above</li>
              <li>2. Test TTS by clicking "Test TTS" - you should hear audio</li>
              <li>3. Test microphone by clicking "Test Microphone" and speaking</li>
              <li>4. Test API by typing a message and clicking "Send to API"</li>
              <li>5. Test speaking the response by clicking "Speak Response"</li>
              <li>6. Check browser console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}