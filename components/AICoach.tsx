'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Bot, Send, Loader2, Play, Pause, Square, Settings } from 'lucide-react';
import { useAICoachAudio } from '../hooks/useAICoachAudio';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSettings } from '../contexts/SettingsContext';

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
  const audioControlsRef = useRef<any>(null);
  
  const { settings, updateSettings } = useSettings();
  const { 
    playAIResponse, 
    stopAll, 
    isPlaying, 
    isPaused, 
    isLoading: audioLoading, 
    error: audioError,
    soundEnabled 
  } = useAICoachAudio();

  // Auto-enable sound and TTS on mount if disabled
  useEffect(() => {
    if (settings) {
      if (!settings.sound_enabled) {
        console.log('[AI Coach] Auto-enabling sound');
        updateSettings({ sound_enabled: true });
      }
      // Ensure TTS is enabled when sound is enabled
      if (settings.sound_enabled && !ttsEnabled) {
        console.log('[AI Coach] Auto-enabling TTS');
        setTtsEnabled(true);
      }
    }
  }, [settings, updateSettings, ttsEnabled]); // Run when settings load or change

  // Auto-enable TTS when sound becomes enabled
  useEffect(() => {
    if (soundEnabled && !ttsEnabled) {
      console.log('[AI Coach] Sound enabled, auto-enabling TTS');
      setTtsEnabled(true);
    }
  }, [soundEnabled, ttsEnabled]);

  // Enable sound handler (fallback)
  const handleEnableSound = async () => {
    try {
      await updateSettings({ sound_enabled: true });
    } catch (error) {
      console.error('[AI Coach] Failed to enable sound:', error);
    }
  };

  // Cleanup audio when component unmounts or audio finishes
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  // Update isSpeaking state based on audio playing state
  useEffect(() => {
    setIsSpeaking(isPlaying);
    if (!isPlaying) {
      setCurrentlyPlayingId(null);
    }
  }, [isPlaying]);

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

  // TTS function to read text aloud (Android-safe version)
  const speakText = async (text: string) => {
    if (!ttsEnabled) {
      console.log('[AI Coach] TTS disabled by user');
      return;
    }
    
    // Android: Use the audio hook instead of direct speechSynthesis
    // This ensures proper user interaction handling
    try {
      await playAIResponse(text, language);
    } catch (error) {
      console.error('[AI Coach] Failed to play TTS:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    stopAll(); // Use the audio hook's stopAll for better compatibility
    setIsSpeaking(false);
  };

  const handleVoiceInput = () => {
    if (!speech.isSupported) {
      console.warn('[AI Coach] SpeechRecognition not supported');
      const isAndroid = /Android/i.test(navigator.userAgent);
      const message = isAndroid 
        ? 'Speech recognition may not be fully supported on your Android browser. Please try using Chrome browser for best results.'
        : 'Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.';
      alert(message);
      return;
    }
    
    // Check if we're on HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isSecure) {
      console.warn('[AI Coach] Microphone access requires HTTPS or localhost');
      alert('Microphone access requires HTTPS. Please use https:// or localhost for voice features.');
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
      const isAndroid = /Android/i.test(navigator.userAgent);
      const errorMsg = isAndroid
        ? `Microphone error: ${error.message || 'Please check your microphone permissions in browser settings and ensure you\'re using Chrome browser.'}`
        : `Microphone error: ${error.message || 'Please check your microphone permissions.'}`;
      alert(errorMsg);
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
      console.log('[AI Coach] Calling Gemini API with text:', messageText);
      
      // Import the sendMessage function dynamically to avoid SSR issues
      const { sendMessage } = await import('../lib/gemini');
      const aiResponse = await sendMessage(messageText);
      
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
      
      // Auto-play AI response if sound and TTS are enabled
      // This works because it's triggered by user action (sending message)
      // Ensure both are enabled before auto-playing
      const shouldAutoPlay = (soundEnabled || settings?.sound_enabled) && ttsEnabled;
      
      if (shouldAutoPlay) {
        // Small delay to ensure message is displayed first
        setTimeout(async () => {
          try {
            console.log('[AI Coach] Auto-playing AI response (soundEnabled:', soundEnabled, ', ttsEnabled:', ttsEnabled, ')');
            // Ensure sound is enabled before playing
            if (!soundEnabled && settings) {
              await updateSettings({ sound_enabled: true });
              // Wait a bit for settings to update
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            // Ensure TTS is enabled
            if (!ttsEnabled) {
              setTtsEnabled(true);
              await new Promise(resolve => setTimeout(resolve, 50));
            }
            await playAIResponse(aiResponse, language);
          } catch (error) {
            console.error('[AI Coach] Failed to auto-play AI response:', error);
            // Don't show error to user - they can still click play button manually
          }
        }, 500);
      } else {
        console.log('[AI Coach] Auto-play disabled (soundEnabled:', soundEnabled, ', ttsEnabled:', ttsEnabled, ')');
      }
    } catch (err) {
      console.error('[AI Coach] Gemini API call failed:', err);
      
      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: err instanceof Error ? err.message : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      onNewMessage?.(errorMessage);
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
      console.log('[AI Coach] Playing message:', messageId);
      
      // Ensure sound and TTS are enabled before attempting to play
      if (!soundEnabled) {
        console.log('[AI Coach] Sound is disabled, attempting to enable...');
        await updateSettings({ sound_enabled: true });
        // Wait a moment for settings to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Ensure TTS is enabled
      if (!ttsEnabled) {
        console.log('[AI Coach] TTS is disabled, enabling...');
        setTtsEnabled(true);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const controls = await playAIResponse(content, language);
      
      if (!controls) {
        console.error('[AI Coach] No audio controls returned');
        setCurrentlyPlayingId(null);
        // Check if it's a sound disabled error
        if (audioError && audioError.includes('Sound is disabled')) {
          alert('Sound is disabled. Please enable sound in your settings to hear audio.');
        } else {
          alert(audioError || 'Unable to play audio. Please check your browser settings and ensure sound is enabled.');
        }
        return;
      }
      
      // Store controls for potential stop/pause operations
      audioControlsRef.current = controls;
      console.log('[AI Coach] Audio started successfully');
    } catch (error) {
      console.error('[AI Coach] Failed to play message:', error);
      setCurrentlyPlayingId(null);
      alert(`Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                              disabled={audioLoading && currentlyPlayingId === message.id}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                currentlyPlayingId === message.id
                                  ? audioLoading
                                    ? 'bg-yellow-600 hover:bg-yellow-700 shadow-lg'
                                    : 'bg-red-600 hover:bg-red-700 shadow-lg'
                                  : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/25'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={
                                currentlyPlayingId === message.id 
                                  ? audioLoading 
                                    ? 'Loading audio...' 
                                    : 'Stop reading'
                                  : 'Hear pronunciation'
                              }
                            >
                              {currentlyPlayingId === message.id ? (
                                audioLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Square className="w-3 h-3" />
                                )
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePlayMessage(message.id, message.content)}
                              disabled={audioLoading && currentlyPlayingId === message.id}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                currentlyPlayingId === message.id
                                  ? audioLoading
                                    ? 'bg-yellow-600 hover:bg-yellow-700 shadow-lg'
                                    : 'bg-red-600 hover:bg-red-700 shadow-lg'
                                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={
                                currentlyPlayingId === message.id 
                                  ? audioLoading 
                                    ? 'Loading audio...' 
                                    : 'Stop audio'
                                  : 'Play audio'
                              }
                            >
                              {currentlyPlayingId === message.id ? (
                                audioLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Square className="w-3 h-3" />
                                )
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
          {audioError && (
            <div className="flex justify-start">
              <div className="bg-red-700 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <VolumeX className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Audio Error</span>
                    <span className="text-xs opacity-90">{audioError}</span>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-xs underline mt-1 text-left"
                    >
                      Try reloading the page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg mb-4 sm:mb-6">
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
                {ttsEnabled && soundEnabled && (
                  <div className="text-green-400 mt-1 text-xs">
                    🔊 AI responses read aloud automatically
                  </div>
                )}
                {ttsEnabled && !soundEnabled && (
                  <div className="text-yellow-400 mt-1 text-xs">
                    🔊 Enable sound to hear AI responses automatically
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* TTS Toggle - also enables sound if disabled */}
            <button
              onClick={async () => {
                if (!soundEnabled) {
                  // Enable sound first
                  await handleEnableSound();
                }
                setTtsEnabled(!ttsEnabled);
              }}
              className={`p-2 rounded-lg transition-colors ${
                ttsEnabled && soundEnabled
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={
                !soundEnabled 
                  ? 'Enable sound first to use TTS' 
                  : ttsEnabled 
                    ? 'Disable TTS' 
                    : 'Enable TTS'
              }
            >
              {ttsEnabled && soundEnabled ? (
                <Volume2 className="w-4 h-4 text-white" />
              ) : (
                <VolumeX className="w-4 h-4 text-white" />
              )}
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
              {ttsEnabled && soundEnabled 
                ? 'Auto-read enabled' 
                : ttsEnabled 
                  ? 'Enable sound for auto-read' 
                  : 'Auto-read disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}