'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Exercise } from '../data/lessonsData';
import { Volume2, VolumeX, Mic, MicOff, Send, Loader2, Eye, EyeOff, Play, Square } from 'lucide-react';

interface QuestionCardProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  isRTL?: boolean;
  disabled?: boolean;
}

export default function QuestionCard({ exercise, onAnswer, isRTL = false, disabled = false }: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isPlayingHint, setIsPlayingHint] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hintUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Language mapping for TTS
  const languageMap: { [key: string]: string } = {
    'ar': 'ar-SA',
    'en': 'en-US',
  };

  // Speech recognition setup
  const [speech] = useState(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = languageMap[exercise.language] || 'en-US';
      return { recognition, isSupported: true };
    }
    return { recognition: null, isSupported: false };
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // TTS function to read exercise text aloud
  const speakExercise = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechError('Speech synthesis not supported in this browser');
      return;
    }

    // Check if speech synthesis is available
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setSpeechError(null);
    setIsPlaying(true);
    setIsPlayingHint(false);

    const utterance = new SpeechSynthesisUtterance(exercise.text);
    utterance.lang = languageMap[exercise.language] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = speechSynthesis.getVoices();
    const suitableVoice = voices.find(voice => 
      voice.lang.startsWith(languageMap[exercise.language] || 'en-US')
    );
    if (suitableVoice) {
      utterance.voice = suitableVoice;
    }

    utterance.onstart = () => { setIsPlaying(true); };
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setSpeechError('Speech synthesis timed out. Please try again.');
      }
    }, 10000); // 10 second timeout
    
    utterance.onend = () => {
      clearTimeout(timeout);
      setIsPlaying(false);
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(false);
      
      // Handle specific error types with user-friendly messages
      let errorMessage = 'Speech synthesis failed';
      if (event.error === 'not-allowed') {
        errorMessage = 'Speech not allowed. Please interact with the page first.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (event.error === 'synthesis-failed') {
        errorMessage = 'Voice synthesis failed. Please try again.';
      } else if (event.error === 'audio-busy') {
        errorMessage = 'Audio is busy. Please wait a moment.';
      } else if (event.error === 'audio-hardware') {
        errorMessage = 'Audio hardware error. Please check your speakers.';
      }
      
      setSpeechError(errorMessage);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // TTS function to read hint aloud
  const speakHint = () => {
    if (!exercise.hint || !('speechSynthesis' in window)) {
      setSpeechError('Speech synthesis not supported in this browser');
      return;
    }

    // Check if speech synthesis is available
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setSpeechError(null);
    setIsPlayingHint(true);
    setIsPlaying(false);

    const utterance = new SpeechSynthesisUtterance(exercise.hint);
    utterance.lang = languageMap[exercise.language] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = speechSynthesis.getVoices();
    const suitableVoice = voices.find(voice => 
      voice.lang.startsWith(languageMap[exercise.language] || 'en-US')
    );
    if (suitableVoice) {
      utterance.voice = suitableVoice;
    }

    utterance.onstart = () => { setIsPlayingHint(true); };
    
    // Add timeout to prevent hanging
    const hintTimeout = setTimeout(() => {
      if (isPlayingHint) {
        speechSynthesis.cancel();
        setIsPlayingHint(false);
        setSpeechError('Speech synthesis timed out. Please try again.');
      }
    }, 10000); // 10 second timeout
    
    utterance.onend = () => {
      clearTimeout(hintTimeout);
      setIsPlayingHint(false);
    };
    utterance.onerror = (event) => {
      console.error('Hint speech synthesis error:', event.error);
      setIsPlayingHint(false);
      
      // Handle specific error types with user-friendly messages
      let errorMessage = 'Speech synthesis failed';
      if (event.error === 'not-allowed') {
        errorMessage = 'Speech not allowed. Please interact with the page first.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (event.error === 'synthesis-failed') {
        errorMessage = 'Voice synthesis failed. Please try again.';
      } else if (event.error === 'audio-busy') {
        errorMessage = 'Audio is busy. Please wait a moment.';
      } else if (event.error === 'audio-hardware') {
        errorMessage = 'Audio hardware error. Please check your speakers.';
      }
      
      setSpeechError(errorMessage);
    };

    hintUtteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPlayingHint(false);
    setSpeechError(null);
  };

  // Retry speech synthesis
  const retrySpeech = () => {
    setSpeechError(null);
    if (isPlayingHint) {
      speakHint();
    } else {
      speakExercise();
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!speech.isSupported) {
      console.warn('SpeechRecognition not supported');
      return;
    }

    if (isListening) {
      speech.recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpeechError(null);

    speech.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
      setIsListening(false);
    };

    speech.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Handle specific speech recognition error types
      let errorMessage = 'Speech recognition failed';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not accessible. Please check permissions.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access denied. Please allow microphone access.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (event.error === 'aborted') {
        errorMessage = 'Speech recognition was interrupted.';
      }
      
      setSpeechError(errorMessage);
    };

    speech.recognition.onend = () => {
      setIsListening(false);
    };

    speech.recognition.start();
  };

  // Handle answer submission
  const handleSubmit = async () => {
    if (!userAnswer.trim() || disabled || isProcessing) return;

    setIsProcessing(true);
    try {
      await onAnswer(userAnswer);
    } finally {
      setIsProcessing(false);
    }
  };

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case 'listen_repeat': return '👂';
      case 'practice_speech': return '🎤';
      case 'translation': return '🔄';
      case 'fill_blank': return '✏️';
      case 'multiple_choice': return '❓';
      default: return '📝';
    }
  };

  const getExerciseTypeText = (type: string) => {
    switch (type) {
      case 'listen_repeat': return 'Listen & Repeat';
      case 'practice_speech': return 'Practice Speech';
      case 'translation': return 'Translation';
      case 'fill_blank': return 'Fill in the Blank';
      case 'multiple_choice': return 'Multiple Choice';
      default: return 'Exercise';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg">
      {/* Exercise Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm sm:text-lg">{getExerciseTypeIcon(exercise.type)}</span>
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-bold text-white">{getExerciseTypeText(exercise.type)}</h3>
            <p className="text-white/70 text-xs sm:text-sm">Exercise {exercise.id}</p>
          </div>
        </div>
        
        <button
          onClick={isPlaying ? stopSpeaking : speakExercise}
          disabled={disabled}
          className={`p-2 sm:p-3 rounded-lg transition-all duration-200 shadow-lg ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isPlaying ? 'Stop speaking' : 'Play exercise text'}
        >
          {isPlaying ? (
            <Square className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
        </button>
      </div>

      {/* Exercise Text */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white/5 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-white text-sm sm:text-lg leading-relaxed">{exercise.text}</p>
        </div>

        {/* Hint Section */}
        {exercise.hint && (
          <div className="mb-3 sm:mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showHint ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="text-xs sm:text-sm font-medium">
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </span>
            </button>
            
            {showHint && (
              <div className="mt-2 sm:mt-3 bg-purple-500/20 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <p className="text-purple-200 text-xs sm:text-sm">{exercise.hint}</p>
                  <button
                    onClick={speakHint}
                    disabled={isPlayingHint || disabled}
                    className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
                      isPlayingHint
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isPlayingHint ? 'Stop speaking hint' : 'Play hint'}
                  >
                    {isPlayingHint ? (
                      <Square className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multiple Choice Options */}
        {exercise.type === 'multiple_choice' && exercise.options && (
          <div className="space-y-2 mb-3 sm:mb-4">
            {exercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                  userAnswer === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                disabled={disabled}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Answer Input */}
      {exercise.type !== 'multiple_choice' && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !disabled && handleSubmit()}
                placeholder={`Type your answer in ${exercise.language}...`}
                disabled={disabled || isProcessing}
                className="w-full bg-gray-700/50 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-xs sm:text-sm md:text-base disabled:opacity-50 transition-all duration-200 focus:bg-gray-700"
              />
            </div>
            
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              disabled={disabled || isListening || isProcessing}
              className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 shadow-lg animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
              } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isListening ? 'Stop listening' : 'Speak your answer'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || disabled || isProcessing}
              className="p-2 sm:p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              title="Submit answer"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Status Messages */}
          <div className="text-xs text-gray-400">
            {isListening ? (
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Listening... Speak now</span>
              </div>
            ) : speechError ? (
              <div className="text-red-400">
                <div className="font-medium">{speechError}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <button
                    onClick={retrySpeech}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setSpeechError(null)}
                    className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
                  >
                    Dismiss
                  </button>
                  <span className="text-xs">or try clicking the play button again</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="hidden sm:block">Click microphone to speak your answer</div>
                  <div className="sm:hidden">Tap mic to speak</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}