'use client';

import { useState, useRef, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { createTTS } from '../lib/tts';

interface AudioControls {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isPlaying: boolean;
  isPaused: boolean;
}

export function useAICoachAudio() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentAudioRef = useRef<Audio | null>(null);
  const currentTTSRef = useRef<any>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);

  // Initialize TTS with fallback
  const tts = createTTS();

  const playText = useCallback(async (text: string, language: string = 'en'): Promise<AudioControls> => {
    // Check if sound is enabled
    if (!settings?.sound_enabled) {
      console.log('Sound is disabled in settings');
      return {
        play: async () => {},
        stop: () => {},
        pause: () => {},
        resume: () => {},
        isPlaying: false,
        isPaused: false
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      // Enhanced language mapping for better TTS
      const languageMap: { [key: string]: string } = {
        'ar': 'ar-SA',
        'en': 'en-US',
        'nl': 'nl-NL',
        'id': 'id-ID',
        'ms': 'ms-MY',
        'th': 'th-TH',
        'km': 'km-KH'
      };

      const ttsLanguage = languageMap[language] || 'en-US';
      const volume = (settings?.sound_volume || 70) / 100;

      // Try multiple TTS methods for better reliability
      let audioControls: AudioControls | null = null;

      // Method 1: Try Google TTS (if available)
      if (tts.synthesizeSpeech) {
        try {
          const audioBuffer = await tts.synthesizeSpeech({
            language: ttsLanguage,
            text: text,
            speed: 0.9, // Slightly slower for better comprehension
            pitch: 0.0
          });

          if (audioBuffer) {
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            audioControls = await playAudioFromUrl(audioUrl, volume);
          }
        } catch (error) {
          console.log('Google TTS failed, trying fallback:', error);
        }
      }

      // Method 2: Try Web Speech API (fallback)
      if (!audioControls && 'speechSynthesis' in window) {
        audioControls = await playWithWebSpeechAPI(text, ttsLanguage, volume);
      }

      // Method 3: Try simple audio file (last resort)
      if (!audioControls) {
        audioControls = await playWithAudioFile(text, volume);
      }

      if (audioControls) {
        setIsPlaying(true);
        setIsPaused(false);
        return audioControls;
      } else {
        throw new Error('All TTS methods failed');
      }

    } catch (error) {
      console.error('Audio playback error:', error);
      setError(error instanceof Error ? error.message : 'Failed to play audio');
      setIsLoading(false);
      return {
        play: async () => {},
        stop: () => {},
        pause: () => {},
        resume: () => {},
        isPlaying: false,
        isPaused: false
      };
    }
  }, [settings, tts]);

  const playAudioFromUrl = async (url: string, volume: number): Promise<AudioControls> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.preload = 'auto';

      const controls: AudioControls = {
        play: async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            setIsPaused(false);
          } catch (error) {
            console.error('Audio play error:', error);
            throw error;
          }
        },
        stop: () => {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
          setIsPaused(false);
        },
        pause: () => {
          audio.pause();
          setIsPlaying(false);
          setIsPaused(true);
        },
        resume: () => {
          audio.play();
          setIsPlaying(true);
          setIsPaused(false);
        },
        isPlaying: false,
        isPaused: false
      };

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        controls.isPlaying = true;
        controls.isPaused = false;
      };
      audio.onpause = () => {
        setIsPlaying(false);
        controls.isPlaying = false;
      };
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        controls.isPlaying = false;
        controls.isPaused = false;
        URL.revokeObjectURL(url);
      };
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        reject(new Error('Audio playback failed'));
      };

      currentAudioRef.current = audio;
      resolve(controls);
    });
  };

  const playWithWebSpeechAPI = async (text: string, language: string, volume: number): Promise<AudioControls> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8; // Slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = volume;

      // Try to find the best voice for the language
      const voices = speechSynthesis.getVoices();
      const suitableVoice = voices.find(voice => 
        voice.lang.startsWith(language) && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith(language));

      if (suitableVoice) {
        utterance.voice = suitableVoice;
      }

      const controls: AudioControls = {
        play: async () => {
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
          setIsPaused(false);
        },
        stop: () => {
          speechSynthesis.cancel();
          setIsPlaying(false);
          setIsPaused(false);
        },
        pause: () => {
          speechSynthesis.pause();
          setIsPlaying(false);
          setIsPaused(true);
        },
        resume: () => {
          speechSynthesis.resume();
          setIsPlaying(true);
          setIsPaused(false);
        },
        isPlaying: false,
        isPaused: false
      };

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        controls.isPlaying = true;
        controls.isPaused = false;
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        controls.isPlaying = false;
        controls.isPaused = false;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        controls.isPlaying = false;
        controls.isPaused = false;
      };

      resolve(controls);
    });
  };

  const playWithAudioFile = async (text: string, volume: number): Promise<AudioControls> => {
    // This is a fallback method - you could implement text-to-speech via API calls
    // For now, we'll return a mock implementation
    return {
      play: async () => {
        console.log('Audio file fallback not implemented');
      },
      stop: () => {},
      pause: () => {},
      resume: () => {},
      isPlaying: false,
      isPaused: false
    };
  };

  const stopAll = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
  }, []);

  const playAIResponse = useCallback(async (text: string, language: string = 'en') => {
    if (!settings?.sound_enabled) {
      return;
    }

    try {
      const controls = await playText(text, language);
      await controls.play();
      return controls;
    } catch (error) {
      console.error('Failed to play AI response:', error);
    }
  }, [playText, settings]);

  return {
    playText,
    playAIResponse,
    stopAll,
    isPlaying,
    isPaused,
    isLoading,
    error,
    soundEnabled: settings?.sound_enabled || false,
    soundVolume: settings?.sound_volume || 70
  };
}
