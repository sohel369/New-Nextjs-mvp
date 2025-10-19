import React from 'react';

interface QuizLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const QuizLoadingSpinner: React.FC<QuizLoadingSpinnerProps> = ({ 
  message = "Loading quiz...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`${sizeClasses[size]} border-4 border-purple-500 border-t-transparent rounded-full animate-spin`}></div>
      <p className={`text-white ${textSizeClasses[size]} font-medium`}>{message}</p>
    </div>
  );
};

export default QuizLoadingSpinner;
