'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VocabularyCardProps {
  word: string;
  translation: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  imageUrl?: string;
  isRTL?: boolean;
}

export default function VocabularyCard({
  word,
  translation,
  category,
  difficulty,
  audioUrl,
  imageUrl,
  isRTL = false
}: VocabularyCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAudioPlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div 
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-white">{word}</span>
            {audioUrl && (
              <button
                onClick={handleAudioPlay}
                className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">{category}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>
        {imageUrl && (
          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={word}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
        >
          {showTranslation ? 'Hide Translation' : 'Show Translation'}
        </button>
        
        {showTranslation && (
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-white text-lg font-medium">{translation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
