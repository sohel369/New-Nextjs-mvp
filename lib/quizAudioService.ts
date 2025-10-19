// Enhanced Audio Service for Language Learning Quiz System
// Supports multiple languages with proper pronunciation and TTS

export interface AudioConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  lang?: string;
}

export class QuizAudioService {
  private static instance: QuizAudioService;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    this.initializeVoices();
  }

  public static getInstance(): QuizAudioService {
    if (!QuizAudioService.instance) {
      QuizAudioService.instance = new QuizAudioService();
    }
    return QuizAudioService.instance;
  }

  private initializeVoices() {
    if (typeof window === 'undefined') return;

    const loadVoices = () => {
      this.voices = speechSynthesis.getVoices();
      this.isInitialized = true;
      console.log('Available voices:', this.voices.length);
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
      `${lang}-SA`, // Saudi Arabic
      `${lang}-AE`, // UAE Arabic
      `${lang}-EG`, // Egyptian Arabic
      `${lang}-US`, // US English
      `${lang}-GB`, // British English
      `${lang}-NL`, // Netherlands Dutch
      `${lang}-ID`, // Indonesian
      `${lang}-MY`, // Malaysian
      `${lang}-TH`, // Thai
      `${lang}-KH`, // Khmer
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
    language: string,
    config: AudioConfig = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      this.stop();

      // Wait for voices to load
      const speakWithVoices = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language and voice
        const voice = this.getBestVoice(language);
        
        if (voice) {
          utterance.voice = voice;
        }
        
        utterance.lang = config.lang || language;
        
        // High-quality audio settings based on language
        if (language.startsWith('ar')) {
          // Arabic settings
          utterance.rate = config.rate || 0.6;
          utterance.pitch = config.pitch || 0.9;
          utterance.volume = config.volume || 1.0;
        } else if (language.startsWith('th') || language.startsWith('km')) {
          // Thai and Khmer settings
          utterance.rate = config.rate || 0.5;
          utterance.pitch = config.pitch || 0.8;
          utterance.volume = config.volume || 1.0;
        } else {
          // Default settings for other languages
          utterance.rate = config.rate || 0.7;
          utterance.pitch = config.pitch || 1.0;
          utterance.volume = config.volume || 1.0;
        }

        // Event handlers
        utterance.onend = () => {
          this.currentUtterance = null;
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.currentUtterance = null;
          reject(new Error(`Speech error: ${event.error}`));
        };
        
        utterance.onstart = () => {
          console.log('Audio started:', text, 'Language:', language);
        };

        // Store current utterance for stopping
        this.currentUtterance = utterance;

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

  // Speak quiz word with enhanced pronunciation
  public speakQuizWord(
    word: string,
    language: string,
    isTranslation = false
  ): Promise<void> {
    const config: AudioConfig = {};

    if (language === 'ar') {
      // Arabic word pronunciation
      config.lang = 'ar-SA';
      config.rate = 0.6;
      config.pitch = 0.9;
    } else if (language === 'th') {
      // Thai word pronunciation
      config.lang = 'th-TH';
      config.rate = 0.5;
      config.pitch = 0.8;
    } else if (language === 'km') {
      // Khmer word pronunciation
      config.lang = 'km-KH';
      config.rate = 0.5;
      config.pitch = 0.8;
    } else if (language === 'nl') {
      // Dutch word pronunciation
      config.lang = 'nl-NL';
      config.rate = 0.7;
      config.pitch = 1.0;
    } else if (language === 'id') {
      // Indonesian word pronunciation
      config.lang = 'id-ID';
      config.rate = 0.7;
      config.pitch = 1.0;
    } else if (language === 'ms') {
      // Malay word pronunciation
      config.lang = 'ms-MY';
      config.rate = 0.7;
      config.pitch = 1.0;
    } else {
      // English word pronunciation
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
      this.currentUtterance = null;
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

  // Test audio quality for a language
  public testAudio(language: string): Promise<void> {
    const testWords = {
      'en': 'Hello, this is a test',
      'ar': 'مرحبا، هذا اختبار',
      'nl': 'Hallo, dit is een test',
      'id': 'Halo, ini adalah tes',
      'ms': 'Halo, ini adalah ujian',
      'th': 'สวัสดี นี่คือการทดสอบ',
      'km': 'ជំរាបសួរ នេះគឺជាការធ្វើតេស្ត'
    };
    
    const testText = testWords[language as keyof typeof testWords] || testWords.en;
    return this.speak(testText, language);
  }

  // Get language-specific TTS configuration
  public getLanguageConfig(language: string): AudioConfig {
    const configs: Record<string, AudioConfig> = {
      'en': { lang: 'en-US', rate: 0.7, pitch: 1.0, volume: 1.0 },
      'ar': { lang: 'ar-SA', rate: 0.6, pitch: 0.9, volume: 1.0 },
      'nl': { lang: 'nl-NL', rate: 0.7, pitch: 1.0, volume: 1.0 },
      'id': { lang: 'id-ID', rate: 0.7, pitch: 1.0, volume: 1.0 },
      'ms': { lang: 'ms-MY', rate: 0.7, pitch: 1.0, volume: 1.0 },
      'th': { lang: 'th-TH', rate: 0.5, pitch: 0.8, volume: 1.0 },
      'km': { lang: 'km-KH', rate: 0.5, pitch: 0.8, volume: 1.0 }
    };

    return configs[language] || configs.en;
  }
}

// Export singleton instance
export const quizAudioService = QuizAudioService.getInstance();

// Utility functions
export const speakQuizWord = (word: string, language: string, isTranslation = false) => {
  return quizAudioService.speakQuizWord(word, language, isTranslation);
};

export const stopQuizAudio = () => {
  quizAudioService.stop();
};

export const isQuizAudioPlaying = () => {
  return quizAudioService.isSpeaking();
};

export const testQuizAudio = (language: string) => {
  return quizAudioService.testAudio(language);
};
