'use client';

import { useState, useEffect } from 'react';
import { useAccessibility, AccessibilitySettings } from '../contexts/AccessibilityContext';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Settings,
  TestTube,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';

interface EnhancedAccessibilityProps {
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

export default function EnhancedAccessibility({ onSettingsChange }: EnhancedAccessibilityProps) {
  const { 
    settings,
    updateSetting
  } = useAccessibility();
  
  const [localSettings, setLocalSettings] = useState<AccessibilitySettings>({
    ...settings
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Array<{test: string, passed: boolean, message: string}>>([]);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setLocalSettings(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // Apply high contrast
    if (localSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply large text
    if (localSettings.fontSize === 'large' || localSettings.fontSize === 'xl') {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Apply reduced motion
    if (localSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(localSettings));
    onSettingsChange?.(localSettings);
  };

  const runAccessibilityTests = async () => {
    setIsTesting(true);
    const results: Array<{test: string, passed: boolean, message: string}> = [];
    
    // Test 1: High contrast
    results.push({
      test: 'High Contrast',
      passed: localSettings.highContrast,
      message: localSettings.highContrast ? 'High contrast enabled' : 'High contrast disabled'
    });
    
    // Test 2: Font size
    const isLargeText = localSettings.fontSize === 'large' || localSettings.fontSize === 'xl';
    results.push({
      test: 'Large Text',
      passed: isLargeText,
      message: isLargeText ? 'Large text enabled' : 'Standard text size'
    });
    
    // Test 3: Reduced motion
    results.push({
      test: 'Reduced Motion',
      passed: localSettings.reducedMotion,
      message: localSettings.reducedMotion ? 'Reduced motion enabled' : 'Full motion enabled'
    });
    
    setTestResults(results);
    setIsTesting(false);
  };

  const resetToDefaults = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 'medium',
      highContrast: false,
      screenReader: false,
      captions: false,
      reducedMotion: false,
      colorBlind: 'none',
      theme: 'system',
      soundEnabled: true,
      soundEffects: true,
      voiceGuidance: false,
      soundVolume: 0.5,
      notificationsEnabled: true,
      learningReminders: true,
      achievementNotifications: true,
      liveSessionAlerts: true,
      securityAlerts: true,
      emailNotifications: true,
      pushNotifications: true
    };
    
    setLocalSettings(defaultSettings);
  };

  return (
    <div className="space-y-6">
      {/* Visual Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Eye className="w-6 h-6 mr-2" />
          Visual Accessibility
        </h3>
        
        <div className="space-y-6">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">High Contrast</div>
              <div className="text-white/70 text-sm">Increase contrast for better visibility</div>
            </div>
            <button
              onClick={() => updateSetting('highContrast', !localSettings.highContrast)}
              className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.highContrast ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                localSettings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Large Text</div>
              <div className="text-white/70 text-sm">Increase text size for better readability</div>
            </div>
            <button
              onClick={() => updateSetting('fontSize', localSettings.fontSize === 'large' ? 'medium' : 'large')}
              className={`w-12 h-6 rounded-full transition-colors ${
                (localSettings.fontSize === 'large' || localSettings.fontSize === 'xl') ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                (localSettings.fontSize === 'large' || localSettings.fontSize === 'xl') ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Reduced Motion</div>
              <div className="text-white/70 text-sm">Reduce animations and transitions</div>
            </div>
            <button
              onClick={() => updateSetting('reducedMotion', !localSettings.reducedMotion)}
              className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.reducedMotion ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                localSettings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TestTube className="w-6 h-6 mr-2" />
          Accessibility Tests
        </h3>
        
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                {result.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="text-white font-medium">{result.test}</span>
              </div>
              <div className="text-white/70 text-sm">{result.message}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button
            onClick={runAccessibilityTests}
            disabled={isTesting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <TestTube className="w-4 h-4" />
            <span>{isTesting ? 'Testing...' : 'Run Tests'}</span>
          </button>
          
          <button
            onClick={resetToDefaults}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
}