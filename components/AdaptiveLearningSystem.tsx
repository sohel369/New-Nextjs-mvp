'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Zap, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface LearningProfile {
  userId: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: 'easy' | 'medium' | 'hard';
  pacePreference: 'slow' | 'medium' | 'fast';
  interests: string[];
  currentLevel: string;
  progressRate: number;
  retentionRate: number;
  engagementScore: number;
}

interface AdaptiveContent {
  id: string;
  type: 'lesson' | 'quiz' | 'exercise' | 'game';
  difficulty: number;
  content: any;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  adaptiveFactors: {
    difficultyAdjustment: number;
    paceAdjustment: number;
    styleAdjustment: string[];
  };
}

interface AdaptiveLearningSystemProps {
  language: string;
  onContentUpdate?: (content: AdaptiveContent[]) => void;
}

export default function AdaptiveLearningSystem({ 
  language, 
  onContentUpdate 
}: AdaptiveLearningSystemProps) {
  const { user } = useAuth();
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [adaptiveContent, setAdaptiveContent] = useState<AdaptiveContent[]>([]);
  const [recommendations, setRecommendations] = useState<AdaptiveContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadLearningProfile();
    }
  }, [user, language]);

  const loadLearningProfile = async () => {
    try {
      setLoading(true);
      
      // Load user's learning profile
      const { data: profile, error: profileError } = await supabase
        .from('learning_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .eq('language', language)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading learning profile:', profileError);
      }

      if (profile) {
        setLearningProfile(profile);
      } else {
        // Create initial learning profile
        await createInitialProfile();
      }

      // Generate adaptive content
      await generateAdaptiveContent();
      
    } catch (error) {
      console.error('Error loading learning profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    if (!user) return;

    const initialProfile: LearningProfile = {
      userId: user.id,
      strengths: [],
      weaknesses: [],
      learningStyle: 'mixed',
      difficultyPreference: 'medium',
      pacePreference: 'medium',
      interests: [],
      currentLevel: 'beginner',
      progressRate: 0.5,
      retentionRate: 0.7,
      engagementScore: 0.5
    };

    try {
      const { error } = await supabase
        .from('learning_profiles')
        .insert({
          user_id: user.id,
          language: language,
          ...initialProfile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating learning profile:', error);
      } else {
        setLearningProfile(initialProfile);
      }
    } catch (error) {
      console.error('Error creating learning profile:', error);
    }
  };

  const generateAdaptiveContent = async () => {
    if (!learningProfile) return;

    try {
      // Analyze user performance data
      const { data: performanceData } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', user?.id)
        .eq('language', language)
        .order('created_at', { ascending: false })
        .limit(50);

      // Generate adaptive content based on profile and performance
      const content = await generateContentRecommendations(performanceData || []);
      setAdaptiveContent(content);
      setRecommendations(content.slice(0, 5));
      
      // Generate learning insights
      const insights = generateInsights(performanceData || []);
      setInsights(insights);

      onContentUpdate?.(content);
      
    } catch (error) {
      console.error('Error generating adaptive content:', error);
    }
  };

  const generateContentRecommendations = async (performanceData: any[]): Promise<AdaptiveContent[]> => {
    // AI-powered content generation based on user profile and performance
    const recommendations: AdaptiveContent[] = [];

    // Analyze performance patterns
    const avgScore = performanceData.reduce((sum, p) => sum + (p.score || 0), 0) / Math.max(performanceData.length, 1);
    const avgTime = performanceData.reduce((sum, p) => sum + (p.time_taken || 0), 0) / Math.max(performanceData.length, 1);
    
    // Determine difficulty adjustment
    let difficultyAdjustment = 0;
    if (avgScore > 0.8) difficultyAdjustment = 0.2; // Increase difficulty
    else if (avgScore < 0.5) difficultyAdjustment = -0.2; // Decrease difficulty

    // Generate content based on learning style
    const contentTypes = learningProfile?.learningStyle === 'visual' 
      ? ['lesson', 'exercise'] 
      : learningProfile?.learningStyle === 'auditory' 
      ? ['lesson', 'quiz'] 
      : ['exercise', 'game'];

    contentTypes.forEach((type, index) => {
      recommendations.push({
        id: `adaptive-${type}-${index}`,
        type: type as string,
        difficulty: Math.max(0.1, Math.min(1.0, 0.5 + difficultyAdjustment + (index * 0.1))),
        content: generateContentByType(type, language),
        estimatedTime: learningProfile?.pacePreference === 'fast' ? 5 : learningProfile?.pacePreference === 'slow' ? 15 : 10,
        prerequisites: [],
        learningObjectives: generateLearningObjectives(type, language),
        adaptiveFactors: {
          difficultyAdjustment,
          paceAdjustment: learningProfile?.pacePreference === 'fast' ? 0.2 : learningProfile?.pacePreference === 'slow' ? -0.2 : 0,
          styleAdjustment: [learningProfile?.learningStyle || 'mixed']
        }
      });
    });

    return recommendations;
  };

  const generateContentByType = (type: string, language: string) => {
    const contentTemplates = {
      lesson: {
        title: `Adaptive ${language} Lesson`,
        description: `Personalized lesson based on your learning style`,
        content: `This lesson is tailored to your learning preferences...`,
        exercises: []
      },
      quiz: {
        title: `Adaptive ${language} Quiz`,
        description: `Quiz designed for your current level`,
        questions: [],
        timeLimit: 300
      },
      exercise: {
        title: `Adaptive ${language} Exercise`,
        description: `Practice exercise matching your pace`,
        tasks: [],
        interactive: true
      },
      game: {
        title: `Adaptive ${language} Game`,
        description: `Learning game for engagement`,
        gameType: 'matching',
        rewards: []
      }
    };

    return contentTemplates[type as keyof typeof contentTemplates] || contentTemplates.lesson;
  };

  const generateLearningObjectives = (type: string, language: string): string[] => {
    const objectives = {
      lesson: [
        `Improve ${language} vocabulary`,
        `Enhance grammar understanding`,
        `Practice pronunciation`
      ],
      quiz: [
        `Test ${language} knowledge`,
        `Identify learning gaps`,
        `Track progress`
      ],
      exercise: [
        `Practice ${language} skills`,
        `Apply learned concepts`,
        `Build confidence`
      ],
      game: [
        `Engage with ${language} content`,
        `Learn through play`,
        `Maintain motivation`
      ]
    };

    return objectives[type as keyof typeof objectives] || objectives.lesson;
  };

  const generateInsights = (performanceData: any[]): string[] => {
    const insights: string[] = [];
    
    if (performanceData.length === 0) {
      insights.push("Start your learning journey with our adaptive content!");
      return insights;
    }

    const avgScore = performanceData.reduce((sum, p) => sum + (p.score || 0), 0) / performanceData.length;
    const recentTrend = performanceData.slice(0, 5).reduce((sum, p) => sum + (p.score || 0), 0) / 5;
    
    if (avgScore > 0.8) {
      insights.push("Excellent progress! You're ready for more challenging content.");
    } else if (avgScore < 0.5) {
      insights.push("Let's focus on strengthening your foundation with easier content.");
    }

    if (recentTrend > avgScore) {
      insights.push("Your recent performance is improving! Keep up the great work.");
    }

    if (learningProfile?.learningStyle === 'visual') {
      insights.push("Your visual learning style is being optimized with image-based content.");
    } else if (learningProfile?.learningStyle === 'auditory') {
      insights.push("Audio-focused content is being prioritized for your learning style.");
    }

    return insights;
  };

  const updateLearningProfile = async (updates: Partial<LearningProfile>) => {
    if (!user || !learningProfile) return;

    try {
      const { error } = await supabase
        .from('learning_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('language', language);

      if (error) {
        console.error('Error updating learning profile:', error);
      } else {
        setLearningProfile(prev => prev ? { ...prev, ...updates } : null);
        await generateAdaptiveContent();
      }
    } catch (error) {
      console.error('Error updating learning profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Learning Profile Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Adaptive Learning Profile</h3>
        </div>
        
        {learningProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Learning Style</span>
              </div>
              <p className="text-white/70 capitalize">{learningProfile.learningStyle}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Progress Rate</span>
              </div>
              <p className="text-white/70">{Math.round(learningProfile.progressRate * 100)}%</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Engagement</span>
              </div>
              <p className="text-white/70">{Math.round(learningProfile.engagementScore * 100)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">AI Learning Insights</h3>
        </div>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-white/80">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Content */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Adaptive Content Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((content, index) => (
            <div key={content.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">{content.content.title}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    content.difficulty > 0.7 ? 'bg-red-400' : 
                    content.difficulty > 0.4 ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <span className="text-white/70 text-sm">
                    {content.difficulty > 0.7 ? 'Hard' : content.difficulty > 0.4 ? 'Medium' : 'Easy'}
                  </span>
                </div>
              </div>
              
              <p className="text-white/70 text-sm mb-3">{content.content.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-white/60 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{content.estimatedTime}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{content.type}</span>
                  </div>
                </div>
                
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
