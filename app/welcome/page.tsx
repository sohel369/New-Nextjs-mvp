'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  ArrowRight, 
  Save,
  Globe,
  User,
  Settings,
  Sparkles,
  Heart,
  Star
} from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    baseLanguage: 'en',
    learningLanguages: ['en'],
    interests: [] as string[],
    goals: 'conversation'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾', native: 'Bahasa Melayu' },
    { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭', native: 'ខ្មែរ' }
  ];

  const interests = [
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'culture', label: 'Culture', icon: '🎭' },
    { id: 'academic', label: 'Academic', icon: '📚' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' }
  ];

  const goals = [
    { id: 'conversation', label: 'Daily Conversation', description: 'Speak confidently in everyday situations' },
    { id: 'business', label: 'Business Communication', description: 'Professional language skills for work' },
    { id: 'academic', label: 'Academic Study', description: 'Language skills for education and research' },
    { id: 'travel', label: 'Travel & Tourism', description: 'Navigate and communicate while traveling' }
  ];

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleLanguageToggle = (langCode: string, type: 'base' | 'learning') => {
    if (type === 'base') {
      setFormData(prev => ({ ...prev, baseLanguage: langCode }));
    } else {
      setFormData(prev => ({
        ...prev,
        learningLanguages: prev.learningLanguages.includes(langCode)
          ? prev.learningLanguages.filter(lang => lang !== langCode)
          : [...prev.learningLanguages, langCode]
      }));
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          base_language: formData.baseLanguage,
          learning_languages: formData.learningLanguages,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        throw new Error('Failed to update profile');
      }

      // Create user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          dark_mode: true,
          notifications_enabled: true,
          sound_enabled: true,
          auto_play_audio: true,
          high_contrast: false,
          large_text: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (settingsError) {
        console.error('Error creating user settings:', settingsError);
      }

      // Redirect to profile page
      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    stepNum <= step
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/20 text-white/50'
                  }`}
                >
                  {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Welcome to LinguaAI! 🎉
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Let's personalize your learning experience. We'll help you set up your profile 
                and choose your preferred languages.
              </p>
              <button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Language Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Choose Your Languages
              </h2>
              
              <div className="space-y-8">
                {/* Base Language */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Interface Language
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageToggle(lang.code, 'base')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.baseLanguage === lang.code
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{lang.flag}</div>
                          <div className="text-white font-medium text-sm">{lang.name}</div>
                          <div className="text-white/70 text-xs">{lang.native}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Languages */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Languages to Learn
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageToggle(lang.code, 'learning')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.learningLanguages.includes(lang.code)
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{lang.flag}</div>
                          <div className="text-white font-medium text-sm">{lang.name}</div>
                          <div className="text-white/70 text-xs">{lang.native}</div>
                          {formData.learningLanguages.includes(lang.code) && (
                            <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Goals and Interests */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Tell us about your goals
              </h2>
              
              <div className="space-y-8">
                {/* Learning Goals */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    What's your main goal?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setFormData(prev => ({ ...prev, goals: goal.id }))}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.goals === goal.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="text-white font-medium mb-2">{goal.label}</div>
                        <div className="text-white/70 text-sm">{goal.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    What interests you? (Optional)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => handleInterestToggle(interest.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.interests.includes(interest.id)
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{interest.icon}</div>
                          <div className="text-white font-medium text-sm">{interest.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Complete Setup'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
