'use client';

import { useState } from 'react';
import LessonCompletionModal from '../../components/LessonCompletionModal';

export default function TestLessonCompletionPage() {
  const [showModal, setShowModal] = useState(false);

  // Sample lesson data
  const sampleLesson = {
    title: "Basic Greetings",
    description: "Learn essential English greetings and polite expressions",
    language: "en",
    xp: 50,
    exercises: [
      { id: 1, text: "How do you say hello in English?", type: "translation" },
      { id: 2, text: "What's a polite way to greet someone in the morning?", type: "practice_speech" },
      { id: 3, text: "Complete: Good _____, how are you?", type: "fill_blank" }
    ]
  };

  // Sample user answers with some correct and incorrect
  const sampleUserAnswers = [
    {
      exerciseId: 1,
      answer: "Hello",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isCorrect: true,
      correctAnswer: "Hello"
    },
    {
      exerciseId: 2,
      answer: "Good evening", // Wrong answer
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      isCorrect: false,
      correctAnswer: "Good morning"
    },
    {
      exerciseId: 3,
      answer: "morning",
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      isCorrect: true,
      correctAnswer: "morning"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Lesson Completion Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test the Lesson Completion Modal</h2>
          <p className="text-gray-600 mb-6">
            This page demonstrates the lesson completion modal with congratulations, 
            accuracy statistics, and review of incorrect answers.
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Completion Modal
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Sample Data:</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">Lesson: {sampleLesson.title}</h4>
              <p className="text-gray-600">{sampleLesson.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800">User Performance:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 2 out of 3 questions correct (67% accuracy)</li>
                <li>• 1 incorrect answer: "Good evening" instead of "Good morning"</li>
                <li>• Time spent: ~5 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <LessonCompletionModal
          lesson={sampleLesson}
          userAnswers={sampleUserAnswers}
          onRetake={() => setShowModal(false)}
          onBack={() => setShowModal(false)}
          isRTL={false}
        />
      )}
    </div>
  );
}
