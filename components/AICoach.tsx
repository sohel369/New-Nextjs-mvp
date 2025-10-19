'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Bot, Send, Loader2, Play, Pause, Square } from 'lucide-react';
import { useAICoachAudio } from '../hooks/useAICoachAudio';

interface AICoachProps {
  language: string;
  isRTL?: boolean;
}

export default function AICoach({ language, isRTL = false }: AICoachProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    audioControls?: any;
  }>>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI language coach. I can help you practice ${language}, correct your pronunciation, and provide personalized learning tips. What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const { 
    playAIResponse, 
    stopAll, 
    isPlaying, 
    isPaused, 
    isLoading: audioLoading, 
    error: audioError,
    soundEnabled 
  } = useAICoachAudio();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      stopAll();
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [stopAll]);

  // TTS function to read text aloud
  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) {
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on selected language
    const languageMap: { [key: string]: string } = {
      'ar': 'ar-SA',
      'en': 'en-US',
      'nl': 'nl-NL',
      'id': 'id-ID',
      'ms': 'ms-MY',
      'th': 'th-TH',
      'km': 'km-KH'
    };
    
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
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Enhanced language detection for better Arabic support
    const languageMap: { [key: string]: string } = {
      'ar': 'ar-SA',
      'nl': 'nl-NL', 
      'id': 'id-ID',
      'ms': 'ms-MY',
      'th': 'th-TH',
      'km': 'km-KH',
      'en': 'en-US'
    };
    
    recognition.lang = languageMap[language] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // First, read back the user's text for pronunciation practice
    if (soundEnabled) {
      try {
        await playAIResponse(`Let me read that back to you: "${messageText}"`, language);
        // Small delay before AI response
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Failed to read back user text:', error);
      }
    }

    // Simulate AI response (replace with actual AI API call)
    setTimeout(async () => {
      const aiResponse = generateAIResponse(messageText, language);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      // Automatically read AI response aloud
      if (ttsEnabled) {
        // Small delay to ensure message is displayed first
        setTimeout(() => {
          speakText(aiResponse);
        }, 500);
      }
    }, soundEnabled ? 3000 : 1500); // Longer delay if we're reading back the text
  };

  const generateAIResponse = (userInput: string, lang: string): string => {
    const responses = {
      pronunciation: [
        "Great pronunciation! Your accent is improving. Try to emphasize the 'th' sound more clearly.",
        "Good attempt! The word should be pronounced with more emphasis on the second syllable.",
        "Excellent! Your pronunciation is very clear. Keep practicing to maintain this level.",
        "Nice work! Try to slow down a bit and focus on each syllable clearly.",
        "Good pronunciation! Remember to keep your tongue relaxed for better clarity."
      ],
      grammar: [
        "That's a good sentence structure! Remember to use the correct tense for past events.",
        "Almost perfect! Just remember to add the article 'the' before the noun.",
        "Great grammar! You're using the conditional tense correctly.",
        "Good sentence! Try to practice the pronunciation of the past tense ending.",
        "Excellent grammar! Now let's work on making it sound more natural when you speak."
      ],
      vocabulary: [
        "Excellent word choice! That's a more advanced vocabulary word. Well done!",
        "Good use of vocabulary! You could also use 'magnificent' as a synonym for 'great'.",
        "Perfect! You're expanding your vocabulary nicely. Keep learning new words!",
        "Great word! Practice saying it slowly to get the pronunciation just right.",
        "Nice vocabulary! Try to use this word in different sentences to practice."
      ],
      general: [
        "That's a great question! Let me help you understand this concept better.",
        "I can see you're making good progress! Keep up the excellent work.",
        "Wonderful! You're showing real improvement in your language skills.",
        "Good practice! Try to speak a bit louder and more confidently.",
        "Excellent! Your language learning is progressing well. Keep practicing!"
      ]
    };

    // Add pronunciation-specific responses based on input length
    if (userInput.length < 10) {
      return responses.pronunciation[Math.floor(Math.random() * responses.pronunciation.length)];
    } else if (userInput.length < 30) {
      return responses.vocabulary[Math.floor(Math.random() * responses.vocabulary.length)];
    } else {
      return responses.grammar[Math.floor(Math.random() * responses.grammar.length)];
    }
  };

  const handlePlayMessage = async (messageId: string, content: string) => {
    if (currentlyPlayingId === messageId) {
      // If this message is currently playing, stop it
      stopAll();
      setCurrentlyPlayingId(null);
      return;
    }

    // Stop any currently playing audio
    stopAll();
    setCurrentlyPlayingId(messageId);

    try {
      await playAIResponse(content, language);
    } catch (error) {
      console.error('Failed to play message:', error);
      setCurrentlyPlayingId(null);
    }
  };

  const handleReadBackUserText = async (messageId: string, content: string) => {
    if (currentlyPlayingId === messageId) {
      stopAll();
      setCurrentlyPlayingId(null);
      return;
    }

    stopAll();
    setCurrentlyPlayingId(messageId);

    try {
      // Read back the user's text with proper pronunciation
      await playAIResponse(`Here's how to pronounce that: "${content}"`, language);
    } catch (error) {
      console.error('Failed to read back user text:', error);
      setCurrentlyPlayingId(null);
    }
  };

  const handleStopAll = () => {
    stopAll();
    setCurrentlyPlayingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 lg:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">AI Language Coach</h2>
            <p className="text-xs sm:text-sm text-gray-400">Practice {language} with personalized feedback</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-800/50 rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 h-80 sm:h-96 overflow-y-auto">
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p className="text-xs sm:text-sm break-words">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {soundEnabled && (
                    <div className="flex items-center space-x-1">
                      {message.type === 'user' ? (
                        <button
                          onClick={() => handleReadBackUserText(message.id, message.content)}
                          className={`p-1 rounded transition-colors ${
                            currentlyPlayingId === message.id
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                          title={currentlyPlayingId === message.id ? 'Stop reading' : 'Hear pronunciation'}
                        >
                          {currentlyPlayingId === message.id ? (
                            <Square className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePlayMessage(message.id, message.content)}
                          className={`p-1 rounded transition-colors ${
                            currentlyPlayingId === message.id
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          title={currentlyPlayingId === message.id ? 'Stop audio' : 'Play audio'}
                        >
                          {currentlyPlayingId === message.id ? (
                            <Square className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          {audioLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-700 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Preparing audio...</span>
                </div>
              </div>
            </div>
          )}
          {audioError && (
            <div className="flex justify-start">
              <div className="bg-red-700 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <VolumeX className="w-4 h-4" />
                  <span className="text-sm">Audio error: {audioError}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Type your message in ${language}...`}
              className="w-full bg-gray-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              disabled={isProcessing}
            />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleVoiceInput}
              disabled={isListening || isProcessing}
              className={`p-2 sm:p-3 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            {inputText.trim() && soundEnabled && (
              <button
                onClick={() => handleReadBackUserText('input', inputText)}
                disabled={isProcessing}
                className="p-2 sm:p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                title="Hear pronunciation"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing}
              className="p-2 sm:p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              title="Send message"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 space-y-2 sm:space-y-0">
          <div className="text-xs text-gray-400">
            {isListening ? (
              'Listening...'
            ) : (
              <div>
                <div className="hidden sm:block">Click microphone to speak</div>
                <div className="sm:hidden">Tap mic to speak</div>
                {ttsEnabled && (
                  <div className="text-green-400 mt-1 text-xs">
                    🔊 AI responses read aloud automatically
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* TTS Toggle */}
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                ttsEnabled 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={ttsEnabled ? 'Disable TTS' : 'Enable TTS'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
            </button>
            
            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Stop speaking"
              >
                <Square className="w-4 h-4 text-white" />
              </button>
            )}
            
            <span className="text-xs text-gray-400 hidden sm:inline">
              {ttsEnabled ? 'TTS enabled' : 'TTS disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
