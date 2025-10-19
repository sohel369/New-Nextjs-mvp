'use client';

import { useState } from 'react';
import { 
  Settings, 
  Type, 
  Volume2, 
  Eye, 
  EyeOff, 
  Contrast, 
  ZoomIn, 
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Accessibility Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  <Type className="w-4 h-4 inline mr-2" />
                  Font Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('fontSize', size)}
                      className={`p-3 rounded-lg border transition-colors ${
                        settings.fontSize === size
                          ? 'border-purple-500 bg-purple-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Contrast className="w-4 h-4 text-white" />
                  <span className="text-white">High Contrast</span>
                </div>
                <button
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.highContrast ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Screen Reader */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-white" />
                  <span className="text-white">Screen Reader Support</span>
                </div>
                <button
                  onClick={() => updateSetting('screenReader', !settings.screenReader)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.screenReader ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Captions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-white" />
                  <span className="text-white">Audio Captions</span>
                </div>
                <button
                  onClick={() => updateSetting('captions', !settings.captions)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.captions ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.captions ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-white" />
                  <span className="text-white">Reduce Motion</span>
                </div>
                <button
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.reducedMotion ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Color Blind Support */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Color Blind Support
                </label>
                <select
                  value={settings.colorBlind}
                  onChange={(e) => updateSetting('colorBlind', e.target.value as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia')}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia (Red-blind)</option>
                  <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                  <option value="tritanopia">Tritanopia (Blue-blind)</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
