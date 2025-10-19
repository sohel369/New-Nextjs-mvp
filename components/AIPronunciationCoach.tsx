// AI Pronunciation Coach Component
// Records user voice and compares with target pronunciation

import React, { useState, useRef, useCallback } from 'react';

interface AIPronunciationCoachProps {
  targetWord: string;
  targetLanguage: string;
  onPronunciationComplete?: (score: number) => void;
  onComplete?: (result: any) => void;
  onProgress?: (progress: any) => void;
  className?: string;
}

const AIPronunciationCoach: React.FC<AIPronunciationCoachProps> = ({
  targetWord,
  targetLanguage,
  onPronunciationComplete,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setPronunciationScore(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processRecording(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      
      // Notify progress - recording started
      if (onProgress) {
        onProgress({
          phase: 'recording',
          message: 'Recording started...',
          progress: 0
        });
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - recordingStartTimeRef.current;
        setRecordingTime(Math.floor(elapsed / 1000));
        
        // Update progress during recording
        if (onProgress) {
          onProgress({
            phase: 'recording',
            message: `Recording... ${Math.floor(elapsed / 1000)}s`,
            progress: Math.min((elapsed / 1000) / 5, 1) * 0.5 // 50% for recording phase
          });
        }
      }, 100);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied. Please allow microphone access to use pronunciation coach.');
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  // Process recording and calculate pronunciation score
  const processRecording = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Notify progress - processing started
      if (onProgress) {
        onProgress({
          phase: 'processing',
          message: 'Analyzing pronunciation...',
          progress: 0.5
        });
      }
      
      // Simulate AI processing (in a real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Notify progress - processing complete
      if (onProgress) {
        onProgress({
          phase: 'processing',
          message: 'Analysis complete!',
          progress: 1.0
        });
      }
      
      // Mock pronunciation analysis
      const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
      setPronunciationScore(mockScore);
      
      // Call completion callbacks
      if (onPronunciationComplete) {
        onPronunciationComplete(mockScore);
      }
      
      if (onComplete) {
        onComplete({
          score: mockScore,
          word: targetWord,
          language: targetLanguage,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (err) {
      console.error('Error processing recording:', err);
      setError('Error processing your pronunciation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onPronunciationComplete]);

  // Get pronunciation feedback
  const getPronunciationFeedback = (score: number): { message: string; color: string; emoji: string } => {
    if (score >= 90) {
      return {
        message: 'Excellent pronunciation!',
        color: 'text-green-400',
        emoji: '🎉'
      };
    } else if (score >= 80) {
      return {
        message: 'Great job! Minor improvements possible.',
        color: 'text-blue-400',
        emoji: '👏'
      };
    } else if (score >= 70) {
      return {
        message: 'Good attempt! Keep practicing.',
        color: 'text-yellow-400',
        emoji: '👍'
      };
    } else {
      return {
        message: 'Keep practicing! You\'re getting better.',
        color: 'text-orange-400',
        emoji: '💪'
      };
    }
  };

  // Format recording time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4">🎤 AI Pronunciation Coach</h3>
      
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-white mb-2" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {targetWord}
        </div>
        <div className="text-sm text-blue-200">
          Practice your pronunciation
        </div>
      </div>

      {/* Recording Controls */}
      <div className="text-center mb-6">
        {!isRecording && !isProcessing && (
          <button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <div className="text-2xl">🎤</div>
            <div className="text-sm mt-1">Start Recording</div>
          </button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="text-white font-mono text-lg">
                {formatTime(recordingTime)}
              </div>
            </div>
            
            <button
              onClick={stopRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Stop Recording
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white">Analyzing pronunciation...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
          <div className="text-red-300 text-sm">{error}</div>
        </div>
      )}

      {/* Pronunciation Score */}
      {pronunciationScore !== null && (
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {pronunciationScore}%
          </div>
          
          {(() => {
            const feedback = getPronunciationFeedback(pronunciationScore);
            return (
              <div className={`${feedback.color} font-semibold mb-4`}>
                {feedback.emoji} {feedback.message}
              </div>
            );
          })()}
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${pronunciationScore}%` }}
            />
          </div>
          
          {/* Tips */}
          <div className="text-sm text-blue-200 space-y-1">
            <div>💡 Speak clearly and at a normal pace</div>
            <div>💡 Listen to the target pronunciation first</div>
            <div>💡 Practice makes perfect!</div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !isProcessing && pronunciationScore === null && (
        <div className="text-sm text-blue-200 space-y-2">
          <div className="font-semibold text-white mb-2">How to use:</div>
          <div>1. Click the microphone button</div>
          <div>2. Say the word clearly</div>
          <div>3. Click stop when finished</div>
          <div>4. Get your pronunciation score!</div>
        </div>
      )}
    </div>
  );
};

export default AIPronunciationCoach;