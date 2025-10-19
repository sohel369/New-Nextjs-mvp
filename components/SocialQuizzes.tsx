'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share, 
  Trophy, 
  Star, 
  Clock, 
  Target,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Award,
  Crown,
  Flame
} from 'lucide-react';

interface SocialQuiz {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'social' | 'conversation' | 'culture' | 'daily_life';
  questions: SocialQuizQuestion[];
  timeLimit: number;
  participants: number;
  likes: number;
  shares: number;
  createdBy: string;
  createdAt: Date;
  tags: string[];
}

interface SocialQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  socialContext: string;
  culturalNote?: string;
}

interface SocialQuizzesProps {
  language: string;
  onQuizComplete?: (quiz: SocialQuiz, score: number) => void;
}

export default function SocialQuizzes({ language, onQuizComplete }: SocialQuizzesProps) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<SocialQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<SocialQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{questionId: string, answer: number, isCorrect: boolean}>>([]);

  const isRTL = language === 'ar';

  useEffect(() => {
    loadSocialQuizzes();
  }, [language]);

  useEffect(() => {
    if (selectedQuiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (selectedQuiz && timeLeft === 0) {
      handleQuizComplete();
    }
  }, [timeLeft, selectedQuiz]);

  const loadSocialQuizzes = async () => {
    try {
      setLoading(true);
      
      // Load social quizzes from database or use sample data
      const { data, error } = await supabase
        .from('social_quizzes')
        .select('*')
        .eq('language', language)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading social quizzes:', error);
        // Use sample data if database fails
        setQuizzes(getSampleSocialQuizzes(language));
      } else {
        setQuizzes(data || getSampleSocialQuizzes(language));
      }
    } catch (error) {
      console.error('Error loading social quizzes:', error);
      setQuizzes(getSampleSocialQuizzes(language));
    } finally {
      setLoading(false);
    }
  };

  const getSampleSocialQuizzes = (lang: string): SocialQuiz[] => {
    const englishQuizzes: SocialQuiz[] = [
      {
        id: 'social-en-1',
        title: 'Daily Conversations',
        description: 'Test your knowledge of everyday English conversations',
        language: 'en',
        difficulty: 'easy',
        category: 'daily_life',
        timeLimit: 300,
        participants: 1250,
        likes: 89,
        shares: 23,
        createdBy: 'AI Teacher',
        createdAt: new Date(),
        tags: ['conversation', 'daily', 'beginner'],
        questions: [
          {
            id: 'q1',
            question: 'What\'s the most common way to greet someone in English?',
            options: ['Hello', 'Hi there', 'Good morning', 'All of the above'],
            correctAnswer: 3,
            explanation: 'All greetings are common in English, depending on the time and context.',
            socialContext: 'Used in casual and formal settings',
            culturalNote: 'English speakers often use multiple greetings throughout the day'
          },
          {
            id: 'q2',
            question: 'How do you politely ask for help in English?',
            options: ['Help me!', 'Could you please help me?', 'I need help', 'Help!'],
            correctAnswer: 1,
            explanation: '"Could you please help me?" is the most polite way to ask for assistance.',
            socialContext: 'Shows respect and politeness in social interactions',
            culturalNote: 'Politeness is highly valued in English-speaking cultures'
          }
        ]
      },
      {
        id: 'social-en-2',
        title: 'Social Media Language',
        description: 'Learn how to communicate effectively on social media',
        language: 'en',
        difficulty: 'medium',
        category: 'social',
        timeLimit: 240,
        participants: 890,
        likes: 156,
        shares: 45,
        createdBy: 'Social Media Expert',
        createdAt: new Date(),
        tags: ['social media', 'online', 'intermediate'],
        questions: [
          {
            id: 'q1',
            question: 'What does "LOL" mean in social media?',
            options: ['Lots of Love', 'Laugh Out Loud', 'Love Online', 'Lots of Luck'],
            correctAnswer: 1,
            explanation: 'LOL stands for "Laugh Out Loud" and is used to show amusement.',
            socialContext: 'Common in text messages and social media posts',
            culturalNote: 'Internet slang is constantly evolving'
          }
        ]
      },
      {
        id: 'social-en-3',
        title: 'Business Networking',
        description: 'Master professional networking conversations',
        language: 'en',
        difficulty: 'hard',
        category: 'social',
        timeLimit: 360,
        participants: 567,
        likes: 234,
        shares: 67,
        createdBy: 'Business Coach',
        createdAt: new Date(),
        tags: ['business', 'professional', 'advanced'],
        questions: [
          {
            id: 'q1',
            question: 'What\'s the best way to introduce yourself at a networking event?',
            options: ['Just say your name', 'Give a 30-second elevator pitch', 'Wait for others to approach you', 'Hand out business cards immediately'],
            correctAnswer: 1,
            explanation: 'A brief, engaging introduction helps make a memorable first impression.',
            socialContext: 'Professional networking requires strategic communication',
            culturalNote: 'Business culture varies by country and industry'
          }
        ]
      },
      {
        id: 'social-en-4',
        title: 'Cultural Etiquette',
        description: 'Understand cultural norms in English-speaking countries',
        language: 'en',
        difficulty: 'medium',
        category: 'culture',
        timeLimit: 300,
        participants: 723,
        likes: 178,
        shares: 34,
        createdBy: 'Cultural Expert',
        createdAt: new Date(),
        tags: ['culture', 'etiquette', 'intermediate'],
        questions: [
          {
            id: 'q1',
            question: 'What\'s considered polite when meeting someone for the first time?',
            options: ['Avoid eye contact', 'Make direct eye contact and smile', 'Look at the ground', 'Stare intensely'],
            correctAnswer: 1,
            explanation: 'Eye contact and a smile show confidence and friendliness.',
            socialContext: 'First impressions are crucial in social interactions',
            culturalNote: 'Cultural norms vary between English-speaking countries'
          }
        ]
      },
      {
        id: 'social-en-5',
        title: 'Friendship Conversations',
        description: 'Learn how to build and maintain friendships',
        language: 'en',
        difficulty: 'easy',
        category: 'social',
        timeLimit: 240,
        participants: 1456,
        likes: 267,
        shares: 89,
        createdBy: 'Social Skills Coach',
        createdAt: new Date(),
        tags: ['friendship', 'relationships', 'beginner'],
        questions: [
          {
            id: 'q1',
            question: 'How do you show interest in someone\'s life?',
            options: ['Ask personal questions', 'Talk only about yourself', 'Avoid asking questions', 'Change the subject quickly'],
            correctAnswer: 0,
            explanation: 'Asking thoughtful questions shows genuine interest in others.',
            socialContext: 'Building relationships requires mutual interest and care',
            culturalNote: 'Different cultures have different levels of personal sharing'
          }
        ]
      }
    ];

    const arabicQuizzes: SocialQuiz[] = [
      {
        id: 'social-ar-1',
        title: 'المحادثات اليومية',
        description: 'اختبر معرفتك بالمحادثات العربية اليومية',
        language: 'ar',
        difficulty: 'easy',
        category: 'daily_life',
        timeLimit: 300,
        participants: 987,
        likes: 145,
        shares: 56,
        createdBy: 'معلم ذكي',
        createdAt: new Date(),
        tags: ['محادثة', 'يومي', 'مبتدئ'],
        questions: [
          {
            id: 'q1',
            question: 'ما هي الطريقة الأكثر شيوعاً لتحية شخص باللغة العربية؟',
            options: ['مرحبا', 'أهلاً وسهلاً', 'السلام عليكم', 'كل ما سبق'],
            correctAnswer: 3,
            explanation: 'جميع التحيات شائعة في العربية، حسب الوقت والسياق.',
            socialContext: 'تستخدم في الأماكن العادية والرسمية',
            culturalNote: 'المتحدثون العرب يستخدمون تحيات متعددة طوال اليوم'
          },
          {
            id: 'q2',
            question: 'كيف تطلب المساعدة بأدب باللغة العربية؟',
            options: ['ساعدني!', 'هل يمكنك مساعدتي من فضلك؟', 'أحتاج مساعدة', 'مساعدة!'],
            correctAnswer: 1,
            explanation: '"هل يمكنك مساعدتي من فضلك؟" هي الطريقة الأكثر أدباً لطلب المساعدة.',
            socialContext: 'يظهر الاحترام والأدب في التفاعلات الاجتماعية',
            culturalNote: 'الأدب له قيمة عالية في الثقافات العربية'
          }
        ]
      },
      {
        id: 'social-ar-2',
        title: 'لغة وسائل التواصل الاجتماعي',
        description: 'تعلم كيفية التواصل بفعالية على وسائل التواصل الاجتماعي',
        language: 'ar',
        difficulty: 'medium',
        category: 'social',
        timeLimit: 240,
        participants: 654,
        likes: 198,
        shares: 67,
        createdBy: 'خبير وسائل التواصل',
        createdAt: new Date(),
        tags: ['وسائل التواصل', 'أونلاين', 'متوسط'],
        questions: [
          {
            id: 'q1',
            question: 'ماذا تعني "هههه" في وسائل التواصل الاجتماعي؟',
            options: ['حب كثير', 'ضحك بصوت عالي', 'حب أونلاين', 'حظ كثير'],
            correctAnswer: 1,
            explanation: 'هههه تعبر عن الضحك وتستخدم لإظهار المرح.',
            socialContext: 'شائعة في الرسائل النصية ومنشورات وسائل التواصل',
            culturalNote: 'لغة الإنترنت تتطور باستمرار'
          }
        ]
      },
      {
        id: 'social-ar-3',
        title: 'الشبكات المهنية',
        description: 'أتقن محادثات الشبكات المهنية',
        language: 'ar',
        difficulty: 'hard',
        category: 'social',
        timeLimit: 360,
        participants: 423,
        likes: 312,
        shares: 89,
        createdBy: 'مدرب أعمال',
        createdAt: new Date(),
        tags: ['أعمال', 'مهني', 'متقدم'],
        questions: [
          {
            id: 'q1',
            question: 'ما هي أفضل طريقة لتقديم نفسك في فعالية شبكات مهنية؟',
            options: ['قل اسمك فقط', 'قدم نفسك في 30 ثانية', 'انتظر الآخرين للاقتراب', 'وزع البطاقات فوراً'],
            correctAnswer: 1,
            explanation: 'مقدمة مختصرة وجذابة تساعد في ترك انطباع أول مميز.',
            socialContext: 'الشبكات المهنية تتطلب تواصلاً استراتيجياً',
            culturalNote: 'ثقافة الأعمال تختلف حسب البلد والصناعة'
          }
        ]
      },
      {
        id: 'social-ar-4',
        title: 'الآداب الثقافية',
        description: 'فهم المعايير الثقافية في البلدان الناطقة بالعربية',
        language: 'ar',
        difficulty: 'medium',
        category: 'culture',
        timeLimit: 300,
        participants: 567,
        likes: 234,
        shares: 45,
        createdBy: 'خبير ثقافي',
        createdAt: new Date(),
        tags: ['ثقافة', 'آداب', 'متوسط'],
        questions: [
          {
            id: 'q1',
            question: 'ما يعتبر مهذباً عند مقابلة شخص للمرة الأولى؟',
            options: ['تجنب التواصل البصري', 'تواصل بصري مباشر وابتسامة', 'انظر للأرض', 'حدق بشدة'],
            correctAnswer: 1,
            explanation: 'التواصل البصري والابتسامة يظهران الثقة والود.',
            socialContext: 'الانطباعات الأولى حاسمة في التفاعلات الاجتماعية',
            culturalNote: 'المعايير الثقافية تختلف بين البلدان الناطقة بالعربية'
          }
        ]
      },
      {
        id: 'social-ar-5',
        title: 'محادثات الصداقة',
        description: 'تعلم كيفية بناء والحفاظ على الصداقات',
        language: 'ar',
        difficulty: 'easy',
        category: 'social',
        timeLimit: 240,
        participants: 1234,
        likes: 345,
        shares: 123,
        createdBy: 'مدرب مهارات اجتماعية',
        createdAt: new Date(),
        tags: ['صداقة', 'علاقات', 'مبتدئ'],
        questions: [
          {
            id: 'q1',
            question: 'كيف تظهر الاهتمام بحياة شخص ما؟',
            options: ['اسأل أسئلة شخصية', 'تحدث عن نفسك فقط', 'تجنب الأسئلة', 'غيّر الموضوع بسرعة'],
            correctAnswer: 0,
            explanation: 'طرح أسئلة مدروسة يظهر اهتماماً حقيقياً بالآخرين.',
            socialContext: 'بناء العلاقات يتطلب اهتماماً ورعاية متبادلة',
            culturalNote: 'ثقافات مختلفة لها مستويات مختلفة من المشاركة الشخصية'
          }
        ]
      }
    ];

    return lang === 'ar' ? arabicQuizzes : englishQuizzes;
  };

  const startQuiz = (quiz: SocialQuiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(quiz.timeLimit);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !selectedQuiz) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      answer: answerIndex,
      isCorrect
    }]);
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    
    if (selectedQuiz && user) {
      // Save quiz attempt
      try {
        await supabase
          .from('user_quiz_attempts')
          .insert({
            user_id: user.id,
            quiz_id: selectedQuiz.id,
            score: score,
            total_questions: selectedQuiz.questions.length,
            correct_answers: score,
            time_taken: selectedQuiz.timeLimit - timeLeft,
            xp_earned: Math.round((score / selectedQuiz.questions.length) * 100)
          });
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
      }
    }
    
    onQuizComplete?.(selectedQuiz!, score);
  };

  const playAudio = async (text: string) => {
    try {
      if (audio) {
        audio.pause();
      }
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (quizCompleted && selectedQuiz) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {language === 'ar' ? 'تم إكمال الاختبار!' : 'Quiz Completed!'}
          </h3>
          <p className="text-white/70">
            {language === 'ar' ? 'أحسنت في إكمال الاختبار' : 'Great job on completing the quiz'}
          </p>
        </div>

        <div className="bg-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-white/70 text-sm">
                {language === 'ar' ? 'إجابات صحيحة' : 'Correct Answers'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{percentage}%</div>
              <div className="text-white/70 text-sm">
                {language === 'ar' ? 'النتيجة' : 'Score'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{formatTime(selectedQuiz.timeLimit - timeLeft)}</div>
              <div className="text-white/70 text-sm">
                {language === 'ar' ? 'الوقت المستغرق' : 'Time Taken'}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setQuizCompleted(false);
                setScore(0);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {language === 'ar' ? 'اختبار آخر' : 'Take Another Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Quiz Header */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{selectedQuiz.title}</h3>
            <div className="flex items-center space-x-2 text-white/70">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>
              {language === 'ar' ? 'سؤال' : 'Question'} {currentQuestionIndex + 1} {language === 'ar' ? 'من' : 'of'} {selectedQuiz.questions.length}
            </span>
            <span className="capitalize">{selectedQuiz.difficulty}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h4>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  showResult
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : selectedAnswer === index
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-gray-600 bg-gray-600/20 text-gray-400'
                    : selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-white/20 bg-white/10 text-white hover:border-white/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {showResult && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Social Context */}
        <div className="bg-white/5 rounded-lg p-4">
          <h5 className="text-white font-semibold mb-2 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>{language === 'ar' ? 'السياق الاجتماعي' : 'Social Context'}</span>
          </h5>
          <p className="text-white/80 text-sm mb-2">{currentQuestion.socialContext}</p>
          {currentQuestion.culturalNote && (
            <div className="bg-white/5 rounded p-3">
              <p className="text-white/70 text-sm">
                <strong>{language === 'ar' ? 'ملاحظة ثقافية:' : 'Cultural Note:'}</strong> {currentQuestion.culturalNote}
              </p>
            </div>
          )}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="bg-white/5 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <span>{language === 'ar' ? 'التفسير' : 'Explanation'}</span>
            </h5>
            <p className="text-white/80 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <div className="text-center">
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {currentQuestionIndex < selectedQuiz.questions.length - 1 
                ? (language === 'ar' ? 'السؤال التالي' : 'Next Question')
                : (language === 'ar' ? 'إنهاء الاختبار' : 'Complete Quiz')
              }
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Users className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'اختبارات اجتماعية' : 'Social Quizzes'}
          </h2>
        </div>
        <p className="text-white/70">
          {language === 'ar' ? 'تعلم اللغة من خلال التفاعلات الاجتماعية' : 'Learn language through social interactions'}
        </p>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
                <p className="text-white/70 text-sm mb-3">{quiz.description}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                quiz.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {quiz.difficulty}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{language === 'ar' ? 'المشاركون:' : 'Participants:'}</span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{quiz.participants.toLocaleString()}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{language === 'ar' ? 'الوقت:' : 'Time:'}</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(quiz.timeLimit / 60)} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{language === 'ar' ? 'الأسئلة:' : 'Questions:'}</span>
                <span>{quiz.questions.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-white/60 text-sm">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{quiz.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="w-4 h-4" />
                  <span>{quiz.shares}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {quiz.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => startQuiz(quiz)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {language === 'ar' ? 'بدء الاختبار' : 'Start Quiz'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
