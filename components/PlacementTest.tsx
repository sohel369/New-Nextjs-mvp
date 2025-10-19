'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlacementQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface PlacementTestProps {
  language: string;
  onComplete: (level: number, score: number) => void;
  isRTL?: boolean;
}

export default function PlacementTest({ language, onComplete, isRTL = false }: PlacementTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: number; isCorrect: boolean }>>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  // Sample questions for different languages
  const questions: PlacementQuestion[] = [
    {
      id: '1',
      question: language === 'ar' ? 'ما هو معنى كلمة "مرحبا"؟' : 
               language === 'nl' ? 'Wat betekent "hallo"?' :
               language === 'id' ? 'Apa arti kata "halo"?' :
               language === 'ms' ? 'Apakah maksud perkataan "halo"?' :
               language === 'th' ? 'คำว่า "สวัสดี" หมายถึงอะไร?' :
               language === 'km' ? 'ពាក្យ "ជំរាបសួរ" មានន័យថាម៉េច?' :
               'What does "hello" mean?',
      options: language === 'ar' ? ['Goodbye', 'Hello', 'Thank you', 'Please'] :
               language === 'nl' ? ['Tot ziens', 'Hallo', 'Dank je', 'Alsjeblieft'] :
               language === 'id' ? ['Selamat tinggal', 'Halo', 'Terima kasih', 'Tolong'] :
               language === 'ms' ? ['Selamat tinggal', 'Halo', 'Terima kasih', 'Tolong'] :
               language === 'th' ? ['ลาก่อน', 'สวัสดี', 'ขอบคุณ', 'กรุณา'] :
               language === 'km' ? ['លាសិន', 'ជំរាបសួរ', 'អរគុណ', 'សូម'] :
               ['Goodbye', 'Hello', 'Thank you', 'Please'],
      correct_answer: 1,
      difficulty: 'beginner',
      category: 'greetings'
    },
    {
      id: '2',
      question: language === 'ar' ? 'كيف تقول "أنا جائع"؟' :
               language === 'nl' ? 'Hoe zeg je "Ik heb honger"?' :
               language === 'id' ? 'Bagaimana cara mengatakan "Saya lapar"?' :
               language === 'ms' ? 'Bagaimana untuk mengatakan "Saya lapar"?' :
               language === 'th' ? 'จะพูดว่า "ฉันหิว" ยังไง?' :
               language === 'km' ? 'តើធ្វើដូចម្តេចដើម្បីនិយាយ "ខ្ញុំឃ្លាន"?' :
               'How do you say "I am hungry"?',
      options: language === 'ar' ? ['أنا عطشان', 'أنا جائع', 'أنا متعب', 'أنا سعيد'] :
               language === 'nl' ? ['Ik heb dorst', 'Ik heb honger', 'Ik ben moe', 'Ik ben blij'] :
               language === 'id' ? ['Saya haus', 'Saya lapar', 'Saya lelah', 'Saya senang'] :
               language === 'ms' ? ['Saya dahaga', 'Saya lapar', 'Saya penat', 'Saya gembira'] :
               language === 'th' ? ['ฉันกระหาย', 'ฉันหิว', 'ฉันเหนื่อย', 'ฉันมีความสุข'] :
               language === 'km' ? ['ខ្ញុំស្រេក', 'ខ្ញុំឃ្លាន', 'ខ្ញុំអស់កម្លាំង', 'ខ្ញុំសប្បាយ'] :
               ['I am thirsty', 'I am hungry', 'I am tired', 'I am happy'],
      correct_answer: 1,
      difficulty: 'intermediate',
      category: 'feelings'
    },
    {
      id: '3',
      question: language === 'ar' ? 'ما هو الفرق بين "أنا" و "أنت"؟' :
               language === 'nl' ? 'Wat is het verschil tussen "ik" en "jij"?' :
               language === 'id' ? 'Apa perbedaan antara "saya" dan "kamu"?' :
               language === 'ms' ? 'Apakah perbezaan antara "saya" dan "awak"?' :
               language === 'th' ? 'ความแตกต่างระหว่าง "ฉัน" และ "คุณ" คืออะไร?' :
               language === 'km' ? 'អ្វីជាភាពខុសគ្នារវាង "ខ្ញុំ" និង "អ្នក"?' :
               'What is the difference between "I" and "you"?',
      options: language === 'ar' ? ['لا يوجد فرق', 'أنا = أنت', 'أنا = أنا، أنت = أنت', 'لا أعرف'] :
               language === 'nl' ? ['Geen verschil', 'ik = jij', 'ik = ik, jij = jij', 'Ik weet het niet'] :
               language === 'id' ? ['Tidak ada perbedaan', 'saya = kamu', 'saya = saya, kamu = kamu', 'Saya tidak tahu'] :
               language === 'ms' ? ['Tiada perbezaan', 'saya = awak', 'saya = saya, awak = awak', 'Saya tidak tahu'] :
               language === 'th' ? ['ไม่มีความแตกต่าง', 'ฉัน = คุณ', 'ฉัน = ฉัน, คุณ = คุณ', 'ฉันไม่รู้'] :
               language === 'km' ? ['មិនមានភាពខុសគ្នា', 'ខ្ញុំ = អ្នក', 'ខ្ញុំ = ខ្ញុំ, អ្នក = អ្នក', 'ខ្ញុំមិនដឹង'] :
               ['No difference', 'I = you', 'I = I, you = you', 'I don\'t know'],
      correct_answer: 2,
      difficulty: 'advanced',
      category: 'grammar'
    }
  ];

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === question.correct_answer;
    setAnswers(prev => [...prev, {
      questionId: question.id,
      answer: answerIndex,
      isCorrect
    }]);

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateLevel();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const calculateLevel = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const score = (correctAnswers / totalQuestions) * 100;
    
    let level = 1;
    if (score >= 80) level = 3; // Advanced
    else if (score >= 60) level = 2; // Intermediate
    else level = 1; // Beginner
    
    setIsCompleted(true);
    onComplete(level, score);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? 'bg-purple-600 border-purple-500'
        : 'bg-gray-700 border-gray-600 hover:border-gray-500';
    }

    if (index === question.correct_answer) {
      return 'bg-green-600 border-green-500';
    }
    if (index === selectedAnswer && index !== question.correct_answer) {
      return 'bg-red-600 border-red-500';
    }
    return 'bg-gray-700 border-gray-600';
  };

  if (isCompleted) {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = (correctAnswers / questions.length) * 100;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    return (
      <div className="max-w-2xl mx-auto p-6 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gray-800/50 rounded-xl p-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Placement Test Complete!</h2>
            <p className="text-gray-400">Your language level has been determined</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{Math.round(score)}%</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{correctAnswers}/{questions.length}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{Math.floor(timeSpent / 60)}m</div>
              <div className="text-sm text-gray-400">Time</div>
            </div>
          </div>

          <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-white mb-2">Recommended Level</h3>
            <div className="text-3xl font-bold text-purple-400">
              {score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner'}
            </div>
            <p className="text-sm text-purple-200 mt-2">
              Based on your performance, we recommend starting with {score >= 80 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner'} level lessons.
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
            {question.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white">{question.question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${getOptionClass(index)}`}
            disabled={showResult}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{option}</span>
              {showResult && index === question.correct_answer && (
                <CheckCircle className="w-5 h-5 text-white" />
              )}
              {showResult && index === selectedAnswer && index !== question.correct_answer && (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>{isLastQuestion ? 'Complete Test' : 'Next Question'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
