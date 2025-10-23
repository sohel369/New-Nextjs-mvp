export interface Exercise {
  id: number;
  type: 'listen_repeat' | 'practice_speech' | 'translation' | 'fill_blank' | 'multiple_choice';
  text: string;
  hint?: string;
  language: string;
  options?: string[];
  correctAnswer?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  exercises: Exercise[];
  language: string;
}

export const LESSONS_DATA: { [key: string]: Lesson[] } = {
  'en': [
    {
      id: 1,
      title: "Basic Greetings",
      description: "Learn essential English greetings and polite expressions",
      level: "beginner",
      duration: "15 min",
      xp: 50,
      difficulty: "Easy",
      language: "en",
      exercises: [
        {
          id: 1,
          type: "listen_repeat",
          text: "Hello! How are you?",
          hint: "Say 'Hello' politely.",
          language: "en-US"
        },
        {
          id: 2,
          type: "practice_speech",
          text: "Good morning",
          hint: "Try different greetings",
          language: "en-US"
        },
        {
          id: 3,
          type: "translation",
          text: "Nice to meet you",
          hint: "Express politeness",
          language: "en-US"
        },
        {
          id: 4,
          type: "fill_blank",
          text: "Good _____, how are you?",
          hint: "Complete the greeting",
          language: "en-US",
          correctAnswer: "morning"
        },
        {
          id: 5,
          type: "multiple_choice",
          text: "What do you say when meeting someone for the first time?",
          hint: "Choose the most polite option",
          language: "en-US",
          options: ["Hi there", "Nice to meet you", "What's up", "Hey"],
          correctAnswer: "Nice to meet you"
        }
      ]
    },
    {
      id: 2,
      title: "Numbers 1-20",
      description: "Master counting from one to twenty in English",
      level: "beginner",
      duration: "20 min",
      xp: 75,
      difficulty: "Easy",
      language: "en",
      exercises: [
        {
          id: 6,
          type: "listen_repeat",
          text: "One, two, three",
          hint: "Count slowly",
          language: "en-US"
        },
        {
          id: 7,
          type: "practice_speech",
          text: "Ten, eleven, twelve",
          hint: "Practice teen numbers",
          language: "en-US"
        },
        {
          id: 8,
          type: "translation",
          text: "Fifteen",
          hint: "Say the number clearly",
          language: "en-US"
        }
      ]
    },
    {
      id: 3,
      title: "Daily Activities",
      description: "Learn common daily routine vocabulary",
      level: "intermediate",
      duration: "25 min",
      xp: 100,
      difficulty: "Medium",
      language: "en",
      exercises: [
        {
          id: 9,
          type: "listen_repeat",
          text: "I wake up at seven o'clock",
          hint: "Describe your morning routine",
          language: "en-US"
        },
        {
          id: 10,
          type: "practice_speech",
          text: "I have breakfast every morning",
          hint: "Talk about your daily habits",
          language: "en-US"
        },
        {
          id: 11,
          type: "fill_blank",
          text: "I go to ____ every day",
          hint: "Complete with a place",
          language: "en-US",
          correctAnswer: "work"
        }
      ]
    }
  ],
  'ar': [
    {
      id: 1,
      title: "التحيات الأساسية",
      description: "تعلم التحيات الأساسية والتعبيرات المهذبة",
      level: "beginner",
      duration: "15 دقيقة",
      xp: 50,
      difficulty: "Easy",
      language: "ar",
      exercises: [
        {
          id: 1,
          type: "listen_repeat",
          text: "مرحبا! كيف حالك؟",
          hint: "قل 'مرحبا' بأدب",
          language: "ar-SA"
        },
        {
          id: 2,
          type: "practice_speech",
          text: "صباح الخير",
          hint: "جرب تحيات مختلفة",
          language: "ar-SA"
        },
        {
          id: 3,
          type: "translation",
          text: "تشرفنا بمعرفتك",
          hint: "عبّر عن الأدب",
          language: "ar-SA"
        }
      ]
    },
    {
      id: 2,
      title: "الأرقام 1-20",
      description: "أتقن العد من واحد إلى عشرين بالعربية",
      level: "beginner",
      duration: "20 دقيقة",
      xp: 75,
      difficulty: "Easy",
      language: "ar",
      exercises: [
        {
          id: 4,
          type: "listen_repeat",
          text: "واحد، اثنان، ثلاثة",
          hint: "عد ببطء",
          language: "ar-SA"
        },
        {
          id: 5,
          type: "practice_speech",
          text: "عشرة، أحد عشر، اثنا عشر",
          hint: "مارس الأرقام المركبة",
          language: "ar-SA"
        }
      ]
    }
  ]
};
