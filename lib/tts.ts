// Google TTS Integration with Arabic Vowel Support

interface TTSOptions {
  language: string;
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export class GoogleTTS {
  private apiKey: string;
  private baseUrl = 'https://texttospeech.googleapis.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Arabic vowel mapping for better pronunciation
  private arabicVowelMap: { [key: string]: string } = {
    'ا': 'ā', 'أ': 'a', 'إ': 'i', 'آ': 'ā',
    'و': 'ū', 'ي': 'ī', 'ة': 'ah',
    'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
    'َ': 'a', 'ُ': 'u', 'ِ': 'i',
    'ّ': '', 'ْ': '', 'ـ': ''
  };

  // Enhanced Arabic text processing with vowel support
  private processArabicText(text: string): string {
    // Add diacritics for better pronunciation
    let processedText = text;
    
    // Common Arabic words with proper diacritics
    const commonWords: { [key: string]: string } = {
      'مرحبا': 'مَرْحَبًا',
      'وداعا': 'وَدَاعًا',
      'ماء': 'مَاءٌ',
      'طعام': 'طَعَامٌ',
      'جميل': 'جَمِيلٌ',
      'صعب': 'صَعْبٌ',
      'معقد': 'مُعَقَّدٌ',
      'رائع': 'رَائِعٌ'
    };

    // Replace common words with diacritized versions
    Object.entries(commonWords).forEach(([original, diacritized]) => {
      processedText = processedText.replace(new RegExp(original, 'g'), diacritized);
    });

    return processedText;
  }

  // Get available voices for a language
  async getVoices(languageCode: string) {
    try {
      const response = await fetch(`${this.baseUrl}/voices?key=${this.apiKey}`);
      const data = await response.json();
      
      return data.voices.filter((voice: { languageCodes: string[] }) => 
        voice.languageCodes.includes(languageCode)
      );
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  // Generate speech with enhanced Arabic support
  async synthesizeSpeech(options: TTSOptions): Promise<AudioBuffer | null> {
    try {
      let processedText = options.text;
      
      // Process Arabic text with vowels
      if (options.language.startsWith('ar')) {
        processedText = this.processArabicText(options.text);
      }

      const requestBody = {
        input: { text: processedText },
        voice: {
          languageCode: options.language,
          name: options.voice || this.getDefaultVoice(options.language),
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: options.speed || 1.0,
          pitch: options.pitch || 0.0
        }
      };

      const response = await fetch(`${this.baseUrl}/text:synthesize?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (data.audioContent) {
        // Convert base64 to audio buffer
        const audioData = atob(data.audioContent);
        const audioBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(audioBuffer);
        
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }
        
        return audioBuffer as AudioBuffer;
      }
      
      return null;
    } catch (error) {
      console.error('TTS Error:', error);
      return null;
    }
  }

  // Get default voice for language
  private getDefaultVoice(languageCode: string): string {
    const defaultVoices: { [key: string]: string } = {
      'ar-SA': 'ar-SA-Wavenet-A', // Arabic (Saudi Arabia) - Male
      'ar-XA': 'ar-XA-Wavenet-A', // Arabic (Gulf) - Male
      'en-US': 'en-US-Wavenet-D', // English (US) - Male
      'en-GB': 'en-GB-Wavenet-A', // English (UK) - Male
      'nl-NL': 'nl-NL-Wavenet-A', // Dutch - Male
      'id-ID': 'id-ID-Wavenet-A', // Indonesian - Male
      'ms-MY': 'ms-MY-Wavenet-A', // Malay - Male
      'th-TH': 'th-TH-Standard-A', // Thai - Male
      'km-KH': 'km-KH-Standard-A' // Khmer - Male
    };

    return defaultVoices[languageCode] || 'en-US-Wavenet-D';
  }

  // Simple speak method for compatibility
  async speak(text: string, language: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) {
    try {
      const audioBuffer = await this.synthesizeSpeech({
        language,
        text,
        speed: options?.rate || 1.0,
        pitch: options?.pitch || 0.0
      });
      
      if (audioBuffer) {
        return await this.playAudio(audioBuffer, {
          volume: options?.volume || 1.0
        });
      }
    } catch (error) {
      console.error('TTS speak error:', error);
    }
  }

  // Play audio with enhanced controls
  async playAudio(audioBuffer: AudioBuffer, options?: {
    volume?: number;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  }) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      source.buffer = audioBuffer;
      gainNode.gain.value = options?.volume || 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (options?.onEnd) {
        source.onended = options.onEnd;
      }
      
      source.start();
      
      return {
        stop: () => source.stop(),
        pause: () => source.stop(),
        resume: () => source.start()
      };
    } catch (error) {
      console.error('Audio playback error:', error);
      options?.onError?.(error as Error);
      return null;
    }
  }
}

// Fallback to Web Speech API if Google TTS is not available
export class FallbackTTS {
  async speak(text: string, language: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced language mapping
      const languageMap: { [key: string]: string } = {
        'ar': 'ar-SA',
        'nl': 'nl-NL',
        'id': 'id-ID', 
        'ms': 'ms-MY',
        'th': 'th-TH',
        'km': 'km-KH',
        'en': 'en-US'
      };
      
      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = options?.rate || 0.8;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;
      
      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices();
      const suitableVoice = voices.find(voice => 
        voice.lang.startsWith(languageMap[language] || 'en-US')
      );
      
      if (suitableVoice) {
        utterance.voice = suitableVoice;
      }
      
      speechSynthesis.speak(utterance);
      
      return {
        stop: () => speechSynthesis.cancel(),
        pause: () => speechSynthesis.pause(),
        resume: () => speechSynthesis.resume()
      };
    }
    
    return null;
  }
}

// TTS Factory
export function createTTS(apiKey?: string) {
  if (apiKey) {
    return new GoogleTTS(apiKey);
  }
  return new FallbackTTS();
}
