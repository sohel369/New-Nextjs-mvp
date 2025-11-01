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
  
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentTTSRef = useRef<any>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);

  // Initialize TTS with Google TTS API key if available (client-side env var)
  const googleTTSApiKey = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY || '') 
    : '';
  const tts = createTTS(googleTTSApiKey || undefined);

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
      if ('synthesizeSpeech' in tts && typeof tts.synthesizeSpeech === 'function') {
        try {
          const audioBuffer = await (tts as any).synthesizeSpeech({
            language: ttsLanguage,
            text: text,
            speed: 0.9, // Slightly slower for better comprehension
            pitch: 0.0
          });

          if (audioBuffer) {
            // Google TTS returns ArrayBuffer - convert to Blob for playback
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            audioControls = await playAudioFromUrl(audioUrl, volume);
            if (audioControls) {
              console.log('[TTS] Using Google TTS API');
            }
          }
        } catch (error) {
          console.log('[TTS] Google TTS failed, trying fallback:', error);
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
      
      // Android: Set crossOrigin for better compatibility
      audio.crossOrigin = 'anonymous';

      const controls: AudioControls = {
        play: async () => {
          try {
            // Android: Resume AudioContext if suspended (required for mobile)
            if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
              const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
              const audioContext = new AudioContextClass();
              if (audioContext.state === 'suspended') {
                await audioContext.resume();
              }
            }
            
            await audio.play();
            setIsPlaying(true);
            setIsPaused(false);
          } catch (error: any) {
            console.error('Audio play error:', error);
            // Android: Sometimes needs user interaction, provide helpful error
            if (error.name === 'NotAllowedError') {
              setError('Audio playback requires user interaction. Please tap the play button.');
            }
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

  // Helper function to load voices (important for Android)
  const loadVoices = useCallback((): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      // Wait for voices to load (Android sometimes needs this)
      const onVoicesChanged = () => {
        const loadedVoices = speechSynthesis.getVoices();
        if (loadedVoices.length > 0) {
          speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          resolve(loadedVoices);
        }
      };

      speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      
      // Fallback timeout
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(speechSynthesis.getVoices());
      }, 1000);
    });
  }, []);

  const playWithWebSpeechAPI = async (text: string, language: string, volume: number): Promise<AudioControls> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Android: Load voices first
        const voices = await loadVoices();
        console.log('[TTS] Loaded', voices.length, 'voices');
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        
        // Android: Use slightly different settings for better compatibility
        const isAndroid = /Android/i.test(navigator.userAgent);
        utterance.rate = isAndroid ? 0.9 : 0.8; // Slightly faster on Android
        utterance.pitch = 1.0;
        utterance.volume = volume;

        // Try to find the best voice for the language
        let suitableVoice = voices.find(voice => 
          voice.lang.startsWith(language) && (voice.name.includes('Google') || voice.name.includes('Enhanced'))
        );
        
        if (!suitableVoice) {
          suitableVoice = voices.find(voice => 
            voice.lang === language || voice.lang.startsWith(language.split('-')[0])
          );
        }
        
        // Fallback: try any voice with matching language code prefix
        if (!suitableVoice && language.includes('-')) {
          const langPrefix = language.split('-')[0];
          suitableVoice = voices.find(voice => voice.lang.startsWith(langPrefix));
        }

        if (suitableVoice) {
          utterance.voice = suitableVoice;
          console.log('[TTS] Using voice:', suitableVoice.name, 'for language:', language);
        } else {
          console.warn('[TTS] No suitable voice found for', language, 'using default');
        }

        const controls: AudioControls = {
          play: async () => {
            try {
              console.log('[TTS] Web Speech API play() called');
              
              // Android: Cancel any ongoing speech first
              if (isAndroid) {
                speechSynthesis.cancel();
                // Small delay to ensure cancellation is complete
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              
              // Check if speechSynthesis is available
              if (!('speechSynthesis' in window)) {
                throw new Error('Speech synthesis not available');
              }
              
              console.log('[TTS] Calling speechSynthesis.speak()');
              speechSynthesis.speak(utterance);
              setIsPlaying(true);
              setIsPaused(false);
              console.log('[TTS] Speech started');
            } catch (error) {
              console.error('[TTS] Failed to speak:', error);
              setIsPlaying(false);
              setError(error instanceof Error ? error.message : 'Speech synthesis failed');
              throw error;
            }
          },
        stop: () => {
          speechSynthesis.cancel();
          setIsPlaying(false);
          setIsPaused(false);
        },
        pause: () => {
          // Android doesn't support pause well, so we cancel
          if (isAndroid) {
            speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
          } else {
            speechSynthesis.pause();
            setIsPlaying(false);
            setIsPaused(true);
          }
        },
        resume: () => {
          // Android: restart speech instead of resume
          if (isAndroid) {
            speechSynthesis.speak(utterance);
          } else {
            speechSynthesis.resume();
          }
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
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        controls.isPlaying = false;
        controls.isPaused = false;
        setIsLoading(false);
      };

      utterance.onerror = (event) => {
        // "interrupted" and "canceled" are not real errors
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error('[TTS] Speech synthesis error:', event.error);
          setError(`TTS Error: ${event.error}`);
        }
        setIsPlaying(false);
        setIsPaused(false);
        controls.isPlaying = false;
        controls.isPaused = false;
        setIsLoading(false);
      };

        resolve(controls);
      } catch (error) {
        console.error('[TTS] Error setting up Web Speech API:', error);
        reject(error);
      }
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
      console.log('[TTS] Sound is disabled, not playing');
      return;
    }

    try {
      console.log('[TTS] Playing AI response:', text.substring(0, 50) + '...');
      const controls = await playText(text, language);
      
      if (!controls) {
        console.error('[TTS] No controls returned from playText');
        setError('Failed to initialize audio playback');
        return;
      }
      
      console.log('[TTS] Controls received, calling play()');
      await controls.play();
      console.log('[TTS] Play() called successfully');
      return controls;
    } catch (error) {
      console.error('[TTS] Failed to play AI response:', error);
      setError(error instanceof Error ? error.message : 'Failed to play audio');
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
