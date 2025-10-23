'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Mic, MicOff, Square } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface SpeechControlsProps {
  language: string;
  onTextChange: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  disabled?: boolean;
  isRTL?: boolean;
}

export default function SpeechControls({ 
  language, 
  onTextChange, 
  onSpeechStart, 
  onSpeechEnd, 
  disabled = false,
  isRTL = false 
}: SpeechControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Language mapping for TTS
  const languageMap: { [key: string]: string } = {
    'ar': 'ar-SA',
    'en': 'en-US',
    'nl': 'nl-NL',
    'id': 'id-ID',
    'ms': 'ms-MY',
    'th': 'th-TH',
    'km': 'km-KH'
  };

  // Speech recognition setup
  const speech = useSpeechRecognition({ 
    language: languageMap[language] || 'en-US', 
    continuous: false, 
    interimResults: false 
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // TTS function to read text aloud
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language] || 'en-US';
    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a suitable voice
    const voices = speechSynthesis.getVoices();
    const suitableVoice = voices.find(voice => 
      voice.lang.startsWith(languageMap[language] || 'en-US')
    );
    
    if (suitableVoice) {
      utterance.voice = suitableVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!speech.isSupported) {
      console.warn('SpeechRecognition not supported');
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    speech.clearError();
    
    speech.start().then(() => {
      setIsListening(true);
      onSpeechStart?.();
      speech.attachResultHandler((res) => {
        if (res.transcript) {
          console.log('Recognized:', res.transcript);
          onTextChange(res.transcript);
          setIsListening(false);
          onSpeechEnd?.();
          speech.stop();
        }
      });
    }).catch((error) => {
      console.error('Speech recognition failed:', error);
      setIsListening(false);
      onSpeechEnd?.();
    });
  };

  return (
    <div className="flex items-center space-x-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* TTS Play Button */}
      <button
        onClick={isPlaying ? stopSpeaking : () => speakText('Hello, this is a test')}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${
          isPlaying
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-purple-600 hover:bg-purple-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isPlaying ? 'Stop speaking' : 'Test speech synthesis'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Speech Recognition Button */}
      <button
        onClick={handleVoiceInput}
        disabled={disabled || isListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } ${disabled || isListening ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <MicOff className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Status Indicator */}
      {isListening && (
        <div className="flex items-center space-x-1 text-red-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs">Listening...</span>
        </div>
      )}

      {speech.error && (
        <div className="text-red-400 text-xs">
          <div className="font-medium">{speech.error}</div>
          <div className="text-xs mt-1">Click microphone to try again</div>
        </div>
      )}
    </div>
  );
}
