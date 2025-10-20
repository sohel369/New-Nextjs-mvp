'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Sparkles, 
  Brain, 
  Wand2, 
  Lightbulb, 
  BookOpen, 
  MessageSquare, 
  Image, 
  Music, 
  Video, 
  Type,
  Send,
  RotateCcw,
  Download,
  Share,
  Heart,
  Star,
  Zap
} from 'lucide-react';

// Define allowed content types
type ContentType = 'story' | 'dialogue' | 'exercise' | 'game' | 'visual' | 'audio';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ContentLength = 'short' | 'medium' | 'long';
type ContentStyle = 'conversational' | 'formal' | 'casual' | 'academic';

interface AICreativeContent {
  id: string;
  type: ContentType;
  title: string;
  content: any; // Flexible content type for different content structures
  difficulty: DifficultyLevel;
  language: string;
  tags: string[];
  aiGenerated: boolean;
  userRating?: number;
  createdAt: Date;
}

interface CustomizationOptions {
  difficulty: DifficultyLevel;
  length: ContentLength;
  style: ContentStyle;
  topic: string;
}

interface AICreativeFeaturesProps {
  language: string;
  onContentGenerated?: (content: AICreativeContent) => void;
}

export default function AICreativeFeatures({ 
  language, 
  onContentGenerated 
}: AICreativeFeaturesProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AICreativeContent[]>([]);
  const [selectedType, setSelectedType] = useState<ContentType>('story');
  const [prompt, setPrompt] = useState<string>('');
  const [customization, setCustomization] = useState<CustomizationOptions & { characters: string; setting: string }>({
    difficulty: 'intermediate',
    length: 'medium',
    style: 'conversational',
    topic: '',
    characters: '',
    setting: ''
  });

  useEffect(() => {
    loadGeneratedContent();
  }, [language]);

  const loadGeneratedContent = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_generated_content')
        .select('*')
        .eq('language', language)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading generated content:', error);
      } else {
        setGeneratedContent(data || []);
      }
    } catch (error) {
      console.error('Error loading generated content:', error);
    }
  };

  // Helper function to get safe type
  const getSafeType = (): ContentType => {
    const allowedTypes: ContentType[] = ['story', 'dialogue', 'exercise', 'game', 'visual', 'audio'];
    return allowedTypes.includes(selectedType) ? selectedType : 'story';
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI content generation
      const content = await simulateAIContentGeneration();
      
      // Save to database
      const safeType = getSafeType();
      const { data, error } = await supabase
        .from('ai_generated_content')
        .insert({
          user_id: user?.id,
          language: language,
          type: safeType,
          title: content.title,
          content: content.content,
          difficulty: customization.difficulty,
          tags: content.tags,
          ai_generated: true,
          prompt: prompt,
          customization: customization,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving generated content:', error);
      } else {
        setGeneratedContent(prev => [data, ...prev]);
        onContentGenerated?.(data);
        setPrompt('');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateAIContentGeneration = async (): Promise<AICreativeContent> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contentTemplates = {
      story: {
        title: `AI-Generated ${language} Story`,
        content: {
          text: generateStoryContent(language, customization),
          characters: customization.characters || ['Character 1', 'Character 2'],
          setting: customization.setting || 'A mysterious place',
          moral: 'Learning is a journey of discovery'
        },
        tags: ['story', 'creative', 'narrative']
      },
      dialogue: {
        title: `AI-Generated ${language} Dialogue`,
        content: {
          dialogue: generateDialogueContent(language, customization),
          characters: customization.characters || ['Person A', 'Person B'],
          context: 'Everyday conversation practice'
        },
        tags: ['dialogue', 'conversation', 'practice']
      },
      exercise: {
        title: `AI-Generated ${language} Exercise`,
        content: {
          instructions: generateExerciseInstructions(language, customization),
          questions: generateExerciseQuestions(language, customization),
          answers: generateExerciseAnswers(language, customization)
        },
        tags: ['exercise', 'practice', 'learning']
      },
      game: {
        title: `AI-Generated ${language} Game`,
        content: {
          gameType: 'word-matching',
          rules: generateGameRules(language, customization),
          words: generateGameWords(language, customization),
          rewards: ['XP', 'Badges', 'Achievements']
        },
        tags: ['game', 'interactive', 'fun']
      },
      visual: {
        title: `AI-Generated ${language} Visual`,
        content: {
          description: generateVisualDescription(language, customization),
          elements: generateVisualElements(language, customization),
          interactions: generateVisualInteractions(language, customization)
        },
        tags: ['visual', 'image', 'interactive']
      },
      audio: {
        title: `AI-Generated ${language} Audio`,
        content: {
          script: generateAudioScript(language, customization),
          pronunciation: generatePronunciationGuide(language, customization),
          exercises: generateAudioExercises(language, customization)
        },
        tags: ['audio', 'pronunciation', 'listening']
      }
    };

    // Define the allowed content types
    const allowedTypes = ['story', 'dialogue', 'exercise', 'game', 'visual', 'audio'] as const;
    type AllowedType = typeof allowedTypes[number];
    
    // Validate selectedType against allowed types and provide default
    const safeType: AllowedType = allowedTypes.includes(selectedType as AllowedType) 
      ? (selectedType as AllowedType) 
      : 'story'; // Default fallback
    
    const template = contentTemplates[safeType as keyof typeof contentTemplates];
    return {
      id: `ai-content-${Date.now()}`,
      type: safeType,
      title: template.title,
      content: template.content,
      difficulty: customization.difficulty,
      language: language,
      tags: template.tags,
      aiGenerated: true,
      createdAt: new Date()
    };
  };

  const generateStoryContent = (language: string, customization: CustomizationOptions): string => {
    const stories = {
      en: [
        "Once upon a time, in a land far away, there lived a curious student who loved to learn new languages...",
        "The magical library contained books that could speak in any language, teaching visitors through stories...",
        "In a small village, the wise teacher used creative methods to help children learn languages..."
      ],
      ar: [
        "في قديم الزمان، كان هناك طالب فضولي يحب تعلم اللغات الجديدة...",
        "المكتبة السحرية تحتوي على كتب تتحدث بأي لغة، تعلم الزوار من خلال القصص...",
        "في قرية صغيرة، استخدم المعلم الحكيم طرقاً إبداعية لمساعدة الأطفال على تعلم اللغات..."
      ]
    };
    
    return stories[language as keyof typeof stories]?.[Math.floor(Math.random() * 3)] || stories.en[0];
  };

  const generateDialogueContent = (language: string, customization: CustomizationOptions): Array<{speaker: string, text: string}> => {
    const dialogues = {
      en: [
        { speaker: "Person A", text: "Hello! How are you today?" },
        { speaker: "Person B", text: "I'm doing well, thank you! How about you?" },
        { speaker: "Person A", text: "I'm great! I'm learning a new language." },
        { speaker: "Person B", text: "That's wonderful! Which language are you learning?" }
      ],
      ar: [
        { speaker: "الشخص الأول", text: "مرحبا! كيف حالك اليوم؟" },
        { speaker: "الشخص الثاني", text: "أنا بخير، شكراً لك! وأنت كيف حالك؟" },
        { speaker: "الشخص الأول", text: "أنا ممتاز! أتعلم لغة جديدة." },
        { speaker: "الشخص الثاني", text: "هذا رائع! أي لغة تتعلمها؟" }
      ]
    };
    
    return dialogues[language as keyof typeof dialogues] || dialogues.en;
  };

  const generateExerciseInstructions = (language: string, customization: CustomizationOptions): string => {
    const instructions = {
      en: "Complete the following exercises to practice your language skills. Read each question carefully and choose the best answer.",
      ar: "أكمل التمارين التالية لممارسة مهاراتك اللغوية. اقرأ كل سؤال بعناية واختر الإجابة الأفضل."
    };
    
    return instructions[language as keyof typeof instructions] || instructions.en;
  };

  const generateExerciseQuestions = (language: string, customization: CustomizationOptions): Array<{question: string, options: string[]}> => {
    const questions = {
      en: [
        { question: "What is the correct way to say 'hello'?", options: ["Hola", "Hello", "Bonjour", "All correct"] },
        { question: "Which word means 'book'?", options: ["Libro", "Book", "Livre", "All correct"] }
      ],
      ar: [
        { question: "ما هي الطريقة الصحيحة لقول 'مرحبا'؟", options: ["مرحبا", "أهلاً", "سلام", "كلها صحيحة"] },
        { question: "أي كلمة تعني 'كتاب'؟", options: ["كتاب", "Book", "Livre", "كلها صحيحة"] }
      ]
    };
    
    return questions[language as keyof typeof questions] || questions.en;
  };

  const generateExerciseAnswers = (language: string, customization: CustomizationOptions): string[] => {
    return ["All correct", "All correct"]; // Simplified for demo
  };

  const generateGameRules = (language: string, customization: CustomizationOptions): string => {
    const rules = {
      en: "Match the words with their correct translations. You have 60 seconds to complete as many matches as possible!",
      ar: "طابق الكلمات مع ترجماتها الصحيحة. لديك 60 ثانية لإكمال أكبر عدد ممكن من المطابقات!"
    };
    
    return rules[language as keyof typeof rules] || rules.en;
  };

  const generateGameWords = (language: string, customization: CustomizationOptions): Array<{word: string, translation: string}> => {
    const words = {
      en: [
        { word: "Hello", translation: "مرحبا" },
        { word: "Book", translation: "كتاب" },
        { word: "Water", translation: "ماء" }
      ],
      ar: [
        { word: "مرحبا", translation: "Hello" },
        { word: "كتاب", translation: "Book" },
        { word: "ماء", translation: "Water" }
      ]
    };
    
    return words[language as keyof typeof words] || words.en;
  };

  const generateVisualDescription = (language: string, customization: CustomizationOptions): string => {
    const descriptions = {
      en: "An interactive visual learning experience with colorful illustrations and engaging animations.",
      ar: "تجربة تعلم بصرية تفاعلية مع رسوم توضيحية ملونة ورسوم متحركة جذابة."
    };
    
    return descriptions[language as keyof typeof descriptions] || descriptions.en;
  };

  const generateVisualElements = (language: string, customization: CustomizationOptions): string[] => {
    return ["Interactive buttons", "Colorful illustrations", "Animated characters", "Progress indicators"];
  };

  const generateVisualInteractions = (language: string, customization: CustomizationOptions): string[] => {
    return ["Click to learn", "Drag and drop", "Hover for hints", "Tap to continue"];
  };

  const generateAudioScript = (language: string, customization: CustomizationOptions): string => {
    const scripts = {
      en: "Welcome to your personalized audio lesson. Today we'll practice pronunciation and listening skills.",
      ar: "مرحباً بك في درسك الصوتي المخصص. اليوم سنمارس مهارات النطق والاستماع."
    };
    
    return scripts[language as keyof typeof scripts] || scripts.en;
  };

  const generatePronunciationGuide = (language: string, customization: CustomizationOptions): string => {
    const guides = {
      en: "Focus on the stressed syllables and practice the vowel sounds clearly.",
      ar: "ركز على المقاطع المشددة ومارس أصوات الحروف المتحركة بوضوح."
    };
    
    return guides[language as keyof typeof guides] || guides.en;
  };

  const generateAudioExercises = (language: string, customization: CustomizationOptions): string[] => {
    return ["Repeat after me", "Listen and choose", "Fill in the blanks", "Conversation practice"];
  };

  const rateContent = async (contentId: string, rating: number) => {
    try {
      await supabase
        .from('ai_generated_content')
        .update({ user_rating: rating })
        .eq('id', contentId);

      setGeneratedContent(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { ...content, userRating: rating }
            : content
        )
      );
    } catch (error) {
      console.error('Error rating content:', error);
    }
  };

  const shareContent = async (contentId: string) => {
    try {
      // In a real implementation, this would generate a shareable link
      const shareUrl = `${window.location.origin}/shared-content/${contentId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Content link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Content Generator */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">AI Creative Content Generator</h3>
        </div>
        
        <div className="space-y-4">
          {/* Content Type Selection */}
          <div>
            <label className="block text-white font-semibold mb-2">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(['story', 'dialogue', 'exercise', 'game', 'visual', 'audio'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-lg transition-colors ${
                    selectedType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <div className="capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Difficulty</label>
              <select
                value={customization.difficulty}
                onChange={(e) => setCustomization(prev => ({ ...prev, difficulty: e.target.value as DifficultyLevel }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Length</label>
              <select
                value={customization.length}
                onChange={(e) => setCustomization(prev => ({ ...prev, length: e.target.value as ContentLength }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Style</label>
              <select
                value={customization.style}
                onChange={(e) => setCustomization(prev => ({ ...prev, style: e.target.value as ContentStyle }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="conversational">Conversational</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Topic</label>
              <input
                type="text"
                value={customization.topic}
                onChange={(e) => setCustomization(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Enter a topic..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
              />
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-white font-semibold mb-2">AI Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the AI to create..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 h-24 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate AI Content'}</span>
          </button>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Your AI-Generated Content</h3>
          </div>
          
          <div className="space-y-4">
            {generatedContent.map((content) => (
              <div key={content.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{content.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-white/70 text-sm capitalize">{content.type}</span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/70 text-sm capitalize">{content.difficulty}</span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/70 text-sm">{content.language}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => rateContent(content.id, 5)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareContent(content.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-white/80 text-sm mb-3">
                  {content.type === 'story' && (content.content as any)?.text}
                  {content.type === 'dialogue' && (content.content as any)?.dialogue?.[0]?.text}
                  {content.type === 'exercise' && (content.content as any)?.instructions}
                  {content.type === 'game' && (content.content as any)?.rules}
                  {content.type === 'visual' && (content.content as any)?.description}
                  {content.type === 'audio' && (content.content as any)?.script}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-white/70 text-sm">AI Generated</span>
                    </div>
                    {content.userRating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70 text-sm">{content.userRating}/5</span>
                      </div>
                    )}
                  </div>
                  
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    Use Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
