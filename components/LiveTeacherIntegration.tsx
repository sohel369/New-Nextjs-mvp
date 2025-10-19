'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  MessageCircle, 
  Send, 
  User, 
  Bot,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Phone,
  PhoneOff,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface LiveSession {
  id: string;
  teacherId: string;
  studentId: string;
  language: string;
  status: 'waiting' | 'active' | 'ended';
  startTime: Date;
  endTime?: Date;
  corrections: Correction[];
  feedback: string[];
}

interface Correction {
  id: string;
  timestamp: Date;
  originalText: string;
  correctedText: string;
  explanation: string;
  severity: 'minor' | 'major' | 'critical';
  category: 'grammar' | 'pronunciation' | 'vocabulary' | 'style';
}

interface LiveTeacherIntegrationProps {
  language: string;
  onSessionStart?: (session: LiveSession) => void;
  onSessionEnd?: (session: LiveSession) => void;
}

export default function LiveTeacherIntegration({ 
  language, 
  onSessionStart, 
  onSessionEnd 
}: LiveTeacherIntegrationProps) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'teacher', timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [teacherStatus, setTeacherStatus] = useState<'available' | 'busy' | 'offline'>('offline');
  const [waitTime, setWaitTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkTeacherAvailability();
    const interval = setInterval(checkTeacherAvailability, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    if (isConnected && currentSession) {
      const interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected, currentSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkTeacherAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_availability')
        .select('status')
        .eq('language', language)
        .eq('is_online', true)
        .single();

      if (error) {
        setTeacherStatus('offline');
      } else {
        setTeacherStatus(data?.status || 'offline');
      }
    } catch (error) {
      console.error('Error checking teacher availability:', error);
      setTeacherStatus('offline');
    }
  };

  const startLiveSession = async () => {
    if (!user) return;

    try {
      setIsProcessing(true);
      
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create live session
      const session: LiveSession = {
        id: `session-${Date.now()}`,
        teacherId: 'teacher-1', // In real implementation, this would be assigned
        studentId: user.id,
        language: language,
        status: 'waiting',
        startTime: new Date(),
        corrections: [],
        feedback: []
      };

      setCurrentSession(session);
      setIsConnected(true);
      onSessionStart?.(session);

      // Simulate teacher connection
      setTimeout(() => {
        setTeacherStatus('busy');
        if (session) {
          setCurrentSession(prev => prev ? { ...prev, status: 'active' } : null);
        }
      }, 5000);

    } catch (error) {
      console.error('Error starting live session:', error);
      alert('Camera and microphone access is required for live sessions.');
    } finally {
      setIsProcessing(false);
    }
  };

  const endLiveSession = async () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        status: 'ended' as const,
        endTime: new Date()
      };
      
      setCurrentSession(endedSession);
      onSessionEnd?.(endedSession);
    }
    
    setIsConnected(false);
    setCurrentSession(null);
    setMessages([]);
    setCorrections([]);
    setWaitTime(0);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentSession) return;

    const message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate teacher response
    setTimeout(() => {
      const teacherResponse = {
        id: `msg-${Date.now()}`,
        text: generateTeacherResponse(newMessage),
        sender: 'teacher' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, teacherResponse]);
    }, 1000);
  };

  const generateTeacherResponse = (message: string): string => {
    const responses = [
      "That's a great question! Let me explain...",
      "Excellent! You're making good progress.",
      "I notice you're improving in this area.",
      "Let's practice that pronunciation together.",
      "Good effort! Here's a tip to help you...",
      "I can see you're getting more confident!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenShare) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsScreenShare(true);
      } else {
        if (mediaStreamRef.current && videoRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
        }
        setIsScreenShare(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              teacherStatus === 'available' ? 'bg-green-400' : 
              teacherStatus === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <h3 className="text-xl font-bold text-white">Live Teacher</h3>
          </div>
          <div className="text-white/70 text-sm">
            {teacherStatus === 'available' ? 'Available' : 
             teacherStatus === 'busy' ? 'Busy' : 'Offline'}
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center">
            <p className="text-white/70 mb-4">
              Connect with a live teacher for real-time correction and guidance
            </p>
            <button
              onClick={startLiveSession}
              disabled={teacherStatus === 'offline' || isProcessing}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
              <span>{isProcessing ? 'Connecting...' : 'Start Live Session'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Session Info */}
            <div className="flex items-center justify-between">
              <div className="text-white/70">
                Session Time: {formatTime(waitTime)}
              </div>
              <button
                onClick={endLiveSession}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Session</span>
              </button>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-lg transition-colors ${
                  isVideoOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-lg transition-colors ${
                  isAudioOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-lg transition-colors ${
                  isScreenShare ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {isScreenShare ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Interface */}
      {isConnected && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">Live Video</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Video */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-48 bg-gray-800 rounded-lg object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                You
              </div>
            </div>
            
            {/* Teacher Video */}
            <div className="relative">
              <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <User className="w-12 h-12 text-white/50 mx-auto mb-2" />
                  <p className="text-white/70">Teacher Video</p>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Teacher
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isConnected && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">Live Chat</h4>
          
          <div className="h-64 overflow-y-auto mb-4 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/20 text-white'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.sender === 'user' ? 'You' : 'Teacher'}
                    </span>
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-time Corrections */}
      {corrections.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">Live Corrections</h4>
          
          <div className="space-y-3">
            {corrections.map((correction) => (
              <div key={correction.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    correction.severity === 'critical' ? 'bg-red-400' :
                    correction.severity === 'major' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <div className="text-white/80 text-sm mb-1">
                      <span className="line-through">{correction.originalText}</span> → 
                      <span className="text-green-400 ml-2">{correction.correctedText}</span>
                    </div>
                    <p className="text-white/60 text-xs">{correction.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
