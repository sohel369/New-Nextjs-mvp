'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Bot, Send, Loader2, Play, Pause, Square } from 'lucide-react';
import { useAICoachAudio } from '../hooks/useAICoachAudio';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface AICoachProps {
  language: string;
  isRTL?: boolean;
  initialMessages?: Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>;
  onNewMessage?: (message: {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }) => void;
}

export default function AICoach({ language, isRTL = false, initialMessages, onNewMessage }: AICoachProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    audioControls?: any;
  }>>(initialMessages || [
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI language coach. I can help you practice ${language}, correct your pronunciation, and provide personalized learning tips. What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);

  // Keep only last 3 messages for conversation memory
  const maintainConversationMemory = (newMessages: any[]) => {
    if (newMessages.length > 3) {
      return newMessages.slice(-3);
    }
    return newMessages;
  };
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

  const languageMap: { [key: string]: string } = {
    'ar': 'ar-SA',
    'en': 'en-US',
    'nl': 'nl-NL',
    'id': 'id-ID',
    'ms': 'ms-MY',
    'th': 'th-TH',
    'km': 'km-KH'
  };

  const speech = useSpeechRecognition({ 
    language: languageMap[language] || 'en-US', 
    continuous: false, 
    interimResults: false 
  });

  // Clear speech error when user tries again
  useEffect(() => {
    if (speech.error) {
      console.log('[AI Coach] Speech error detected:', speech.error);
    }
  }, [speech.error]);

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
    if (!speech.isSupported) {
      console.warn('[AI Coach] SpeechRecognition not supported');
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    // Clear any previous errors
    speech.clearError();
    
    speech.start().then(() => {
      setIsListening(true);
      speech.attachResultHandler((res) => {
        if (res.transcript) {
          console.log('[AI Coach] Recognized:', res.transcript);
          setInputText(res.transcript);
          handleSendMessage(res.transcript);
          setIsListening(false);
          speech.stop();
        }
      });
    }).catch((error) => {
      console.error('[AI Coach] Speech recognition failed:', error);
      setIsListening(false);
    });
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    onNewMessage?.(userMessage);
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

    try {
      console.log('[AI Coach] Calling AI API with text:', messageText);
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText, language })
      });
      const data = await res.json();
      const aiResponse = data?.reply || 'Sorry, I could not generate a response.';
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      const finalMessages = [...updatedMessages, aiMessage];
      const memoryMessages = maintainConversationMemory(finalMessages);
      setMessages(memoryMessages);
      onNewMessage?.(aiMessage);
      setIsProcessing(false);
      if (ttsEnabled) {
        setTimeout(() => {
          speakText(aiResponse);
        }, 300);
      }
    } catch (err) {
      console.error('[AI Coach] API call failed:', err);
      setIsProcessing(false);
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
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-purple-500/20 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">AI Language Coach</h2>
            <p className="text-xs sm:text-sm text-purple-200">Practice {language} with personalized feedback</p>
          </div>
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 h-80 sm:h-96 overflow-y-auto border border-gray-700/50 shadow-lg">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-600/50'
                }`}
              >
                <p className="text-sm break-words leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {soundEnabled && (
                    <div className="flex items-center space-x-1">
                      {message.type === 'user' ? (
                        <button
                          onClick={() => handleReadBackUserText(message.id, message.content)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            currentlyPlayingId === message.id
                              ? 'bg-red-600 hover:bg-red-700 shadow-lg'
                              : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/25'
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
                          className={`p-2 rounded-full transition-all duration-200 ${
                            currentlyPlayingId === message.id
                              ? 'bg-red-600 hover:bg-red-700 shadow-lg'
                              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
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

      {/* Enhanced Input */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Type your message in ${language}...`}
              className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-sm sm:text-base transition-all duration-200 focus:bg-gray-700 focus:shadow-lg"
              disabled={isProcessing}
            />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleVoiceInput}
              disabled={isListening || isProcessing}
              className={`p-3 rounded-lg transition-all duration-200 shadow-lg ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25'
              } text-white`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            {inputText.trim() && soundEnabled && (
              <button
                onClick={() => handleReadBackUserText('input', inputText)}
                disabled={isProcessing}
                className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                title="Hear pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 space-y-2 sm:space-y-0">
          <div className="text-xs text-gray-400">
            {isListening ? (
              'Listening...'
            ) : speech.error ? (
              <div className="text-red-400">
                <div className="font-medium">{speech.error}</div>
                <div className="text-xs mt-1">Click microphone to try again</div>
              </div>
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