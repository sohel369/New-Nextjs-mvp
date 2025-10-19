'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  isRTL: boolean;
}

const languages: Language[] = [
  { code: 'en-US', name: 'English', native: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'ar-SA', name: 'Arabic', native: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'nl-NL', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', isRTL: false },
  { code: 'id-ID', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'ms-MY', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', isRTL: false },
  { code: 'th-TH', name: 'Thai', native: 'ไทย', flag: '🇹🇭', isRTL: false },
  { code: 'km-KH', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭', isRTL: false },
];

export default function TTSReader() {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.8);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [error, setError] = useState<string | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Find the best voice for the selected language
      const suitableVoice = voices.find(voice => 
        voice.lang === selectedLanguage.code
      ) || voices.find(voice => 
        voice.lang.startsWith(selectedLanguage.code.split('-')[0])
      );
      
      if (suitableVoice) {
        setSelectedVoice(suitableVoice);
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also load when voices change (some browsers load them asynchronously)
    if ('speechSynthesis' in window) {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, [selectedLanguage]);

  // Update voice when language changes
  useEffect(() => {
    const suitableVoice = availableVoices.find(voice => 
      voice.lang === selectedLanguage.code
    ) || availableVoices.find(voice => 
      voice.lang.startsWith(selectedLanguage.code.split('-')[0])
    );
    
    if (suitableVoice) {
      setSelectedVoice(suitableVoice);
    }
  }, [selectedLanguage, availableVoices]);

  const handleReadAloud = () => {
    if (!text.trim()) {
      setError('Please enter some text to read aloud');
      return;
    }

    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser');
      return;
    }

    setError(null);

    // Stop any current speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.code;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Set voice if available
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.log('Speech synthesis error:', event.error);
      setError(`Speech synthesis error: ${event.error}`);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Store reference for pause/resume
    utteranceRef.current = utterance;

    // Start speaking
    speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
    } else if (isPaused) {
      speechSynthesis.resume();
    }
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // Stop current speech when changing language
    if (isPlaying) {
      handleStop();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir={selectedLanguage.isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Text-to-Speech Reader</h1>
        <p className="text-gray-600">Type or paste text and hear it read aloud in your chosen language</p>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4 inline mr-2" />
          Select Language
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedLanguage.code === language.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium text-sm">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.native}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text to Read Aloud
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Enter text in ${selectedLanguage.name}...`}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          dir={selectedLanguage.isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Voice Settings */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speech Rate: {rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Voice Selection */}
      {availableVoices.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice
          </label>
          <select
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = availableVoices.find(v => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Default Voice</option>
            {availableVoices
              .filter(voice => voice.lang.startsWith(selectedLanguage.code.split('-')[0]))
              .map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleReadAloud}
          disabled={!text.trim() || isPlaying}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Volume2 className="w-5 h-5" />
          <span>🔊 Read Aloud</span>
        </button>

        {isPlaying && (
          <>
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleStop}
              className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}
      </div>

      {/* Status */}
      {isPlaying && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {isPaused ? 'Paused' : 'Reading aloud...'}
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <VolumeX className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Type or paste your text in the text area above</li>
          <li>Select your preferred language from the options</li>
          <li>Adjust speech rate, pitch, and volume as needed</li>
          <li>Click "🔊 Read Aloud" to hear your text</li>
          <li>Use pause/resume and stop controls as needed</li>
        </ul>
      </div>
    </div>
  );
}
