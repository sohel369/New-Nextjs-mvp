'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function TestAudioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);

  const testAudioUrl = '/audio/lessons/en/basic-greetings.mp3';
  const testText = 'Hello, welcome to our language learning lesson. This is a test of the audio functionality.';

  const handlePlayAudio = async () => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Create new audio element
      const audio = new Audio(testAudioUrl);
      setCurrentAudio(audio);
      setIsPlaying(true);

      // Handle audio events
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        console.error('Audio file not found, trying text-to-speech...');
        handleTextToSpeech();
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      // Play audio
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      handleTextToSpeech();
      setIsPlaying(false);
    }
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      try {
        // Stop any current speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setTtsPlaying(false);
        };
        
        utterance.onerror = (event) => {
          console.log('Text-to-speech error:', event.error);
          setTtsPlaying(false);
        };
        
        speechSynthesis.speak(utterance);
        setTtsPlaying(true);
      } catch (error) {
        console.log('Text-to-speech initialization failed:', error);
        setTtsPlaying(false);
      }
    } else {
      console.log('Text-to-speech not supported in this browser');
    }
  };

  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    setTtsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🔊 Audio Test Page</h1>
          <p className="text-white/70 text-lg">
            Test the audio functionality and text-to-speech fallback
          </p>
        </div>

        {/* Audio Test Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Audio Playback Test</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="text-white font-medium mb-2">Test Audio File</div>
                <div className="text-white/70 text-sm mb-2">
                  File: {testAudioUrl}
                </div>
                <div className="text-white/60 text-xs">
                  This will try to play the audio file, and fall back to text-to-speech if the file is not found.
                </div>
              </div>
              <button
                onClick={isPlaying || ttsPlaying ? handleStopAudio : handlePlayAudio}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isPlaying || ttsPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>
                  {isPlaying ? 'Playing Audio...' : ttsPlaying ? 'Speaking...' : 'Play Audio'}
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="text-white font-medium mb-2">Text-to-Speech Test</div>
                <div className="text-white/70 text-sm mb-2">
                  Text: "{testText}"
                </div>
                <div className="text-white/60 text-xs">
                  This will use the browser's built-in text-to-speech functionality.
                </div>
              </div>
              <button
                onClick={ttsPlaying ? handleStopAudio : handleTextToSpeech}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {ttsPlaying ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
                <span>
                  {ttsPlaying ? 'Stop Speech' : 'Start Speech'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Status Information</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Audio File Status:</span>
              <span className="text-yellow-400">Placeholder (will use TTS)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/70">Text-to-Speech Support:</span>
              <span className={typeof speechSynthesis !== 'undefined' ? 'text-green-400' : 'text-red-400'}>
                {typeof speechSynthesis !== 'undefined' ? 'Supported' : 'Not Supported'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/70">Current Status:</span>
              <span className={isPlaying ? 'text-green-400' : ttsPlaying ? 'text-blue-400' : 'text-gray-400'}>
                {isPlaying ? 'Playing Audio' : ttsPlaying ? 'Speaking' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          
          <div className="space-y-3 text-white/70">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <div className="font-medium text-white">Test Audio File</div>
                <div className="text-sm">Click "Play Audio" to test the audio file playback. Since the file is a placeholder, it will automatically fall back to text-to-speech.</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <div className="font-medium text-white">Test Text-to-Speech</div>
                <div className="text-sm">Click "Start Speech" to test the browser's text-to-speech functionality directly.</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <div className="font-medium text-white">Check Browser Console</div>
                <div className="text-sm">Open the browser console (F12) to see detailed logs about audio playback attempts and fallback behavior.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <a
            href="/test-lessons-multilang"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
          >
            <span>Test Multi-Language Lessons</span>
          </a>
        </div>
      </div>
    </div>
  );
}
