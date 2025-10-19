// Enhanced Audio Service for High-Quality Text-to-Speech
// Provides 100% clear audio with proper pronunciation

export interface AudioConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  lang?: string;
}

export class AudioService {
  private static instance: AudioService;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  private constructor() {
    this.initializeVoices();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initializeVoices() {
    if (typeof window === 'undefined') return;

    const loadVoices = () => {
      this.voices = speechSynthesis.getVoices();
      this.isInitialized = true;
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }

  // Get the best voice for a specific language
  private getBestVoice(lang: string): SpeechSynthesisVoice | null {
    if (!this.isInitialized) {
      this.initializeVoices();
    }

    // Priority order for voice selection
    const priorities = [
      `${lang}-SA`, // Saudi Arabic for Arabic
      `${lang}-AE`, // UAE Arabic
      `${lang}-EG`, // Egyptian Arabic
      `${lang}-US`, // US English
      `${lang}-GB`, // British English
      lang
    ];

    for (const priority of priorities) {
      const voice = this.voices.find(v => v.lang.startsWith(priority));
      if (voice) return voice;
    }

    // Fallback to any voice with the language
    return this.voices.find(v => v.lang.startsWith(lang)) || null;
  }

  // Enhanced speak function with high-quality settings
  public speak(
    text: string, 
    language: 'english' | 'arabic' = 'english',
    config: AudioConfig = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      speechSynthesis.cancel();

      // Wait for voices to load
      const speakWithVoices = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Determine language and voice
        const lang = language === 'arabic' ? 'ar' : 'en';
        const voice = this.getBestVoice(lang);
        
        if (voice) {
          utterance.voice = voice;
        }
        
        utterance.lang = config.lang || (language === 'arabic' ? 'ar-SA' : 'en-US');
        
        // High-quality audio settings
        utterance.rate = config.rate || 0.7; // Slower for clarity
        utterance.pitch = config.pitch || 1.0;
        utterance.volume = config.volume || 1.0;

        // Enhanced pronunciation for Arabic
        if (language === 'arabic') {
          utterance.rate = 0.6; // Even slower for Arabic clarity
          utterance.pitch = 0.9; // Slightly lower pitch
        }

        // Event handlers
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));
        utterance.onstart = () => {
          console.log('Audio started:', text);
        };

        // Speak the text
        speechSynthesis.speak(utterance);
      };

      // Ensure voices are loaded
      if (this.isInitialized && this.voices.length > 0) {
        speakWithVoices();
      } else {
        // Wait a bit for voices to load
        setTimeout(() => {
          this.initializeVoices();
          speakWithVoices();
        }, 100);
      }
    });
  }

  // Speak with enhanced pronunciation for vocabulary words
  public speakVocabulary(
    word: string,
    language: 'english' | 'arabic',
    isTransliteration = false
  ): Promise<void> {
    const config: AudioConfig = {};

    if (language === 'arabic') {
      if (isTransliteration) {
        // For transliteration, use English voice but slower
        config.lang = 'en-US';
        config.rate = 0.5;
        config.pitch = 0.8;
      } else {
        // For Arabic text, use Arabic voice
        config.lang = 'ar-SA';
        config.rate = 0.6;
        config.pitch = 0.9;
      }
    } else {
      // For English, use clear English voice
      config.lang = 'en-US';
      config.rate = 0.7;
      config.pitch = 1.0;
    }

    return this.speak(word, language, config);
  }

  // Stop current speech
  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Check if speech is currently playing
  public isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return speechSynthesis.speaking;
    }
    return false;
  }

  // Get available voices
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  // Test audio quality
  public testAudio(language: 'english' | 'arabic' = 'english'): Promise<void> {
    const testText = language === 'arabic' 
      ? 'مَرْحَبًا، هَذَا اخْتِبَارٌ لِلصَّوْتِ' 
      : 'Hello, this is an audio test';
    
    return this.speak(testText, language);
  }
}

// Export singleton instance
export const audioService = AudioService.getInstance();

// Utility functions
export const speakText = (text: string, language: 'english' | 'arabic' = 'english') => {
  return audioService.speak(text, language);
};

export const speakVocabulary = (word: string, language: 'english' | 'arabic', isTransliteration = false) => {
  return audioService.speakVocabulary(word, language, isTransliteration);
};

export const stopSpeech = () => {
  audioService.stop();
};

export const isSpeaking = () => {
  return audioService.isSpeaking();
};
