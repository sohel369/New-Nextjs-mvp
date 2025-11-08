'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'pwa-install-prompt';
const PROMPT_STATES = {
  NOT_SHOWN: 'not_shown',
  DISMISSED: 'dismissed',
  INSTALLED: 'installed',
} as const;

type PromptState = typeof PROMPT_STATES[keyof typeof PROMPT_STATES];

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const installButtonRef = useRef<HTMLButtonElement>(null);

  // 🧩 Hydration-safe: Only run on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🎯 Handle PWA install prompt event
  useEffect(() => {
    if (!mounted) return;

    // Check if user has already seen/dismissed/installed the prompt
    const savedState = localStorage.getItem(STORAGE_KEY) as PromptState;
    if (savedState === PROMPT_STATES.DISMISSED || savedState === PROMPT_STATES.INSTALLED) {
      return;
    }

    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');

    if (isStandalone) {
      localStorage.setItem(STORAGE_KEY, PROMPT_STATES.INSTALLED);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Store the event so it can be triggered later
      deferredPromptRef.current = e as BeforeInstallPromptEvent;

      // Show our custom install prompt
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      deferredPromptRef.current = null;
      localStorage.setItem(STORAGE_KEY, PROMPT_STATES.INSTALLED);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 🧹 Cleanup event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [mounted]);

  // 📲 Handle install button click
  const handleInstallClick = async () => {
    if (!deferredPromptRef.current) {
      setShowPrompt(false);
      return;
    }

    try {
      // Show the install prompt
      await deferredPromptRef.current.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === 'accepted') {
        localStorage.setItem(STORAGE_KEY, PROMPT_STATES.INSTALLED);
      } else {
        localStorage.setItem(STORAGE_KEY, PROMPT_STATES.DISMISSED);
      }

      // Clear the deferred prompt
      deferredPromptRef.current = null;
      setShowPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
      setShowPrompt(false);
    }
  };

  // ❌ Handle dismiss button click
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(STORAGE_KEY, PROMPT_STATES.DISMISSED);
    deferredPromptRef.current = null;
  };

  // Don't render until mounted (hydration-safe)
  if (!mounted || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300 sm:slide-in-from-bottom-0">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label="Dismiss install prompt"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            Install Language Learning MVP
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Install our app for a better experience. Get quick access, offline support, and a native app feel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            ref={installButtonRef}
            onClick={handleInstallClick}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            <span>Install App</span>
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 sm:flex-none px-6 py-3 text-slate-400 hover:text-white font-medium rounded-xl transition-colors hover:bg-white/10"
          >
            Not Now
          </button>
        </div>

        {/* Features List (Optional) */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <ul className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Offline Access</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Faster Loading</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Home Screen Icon</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>App-like Experience</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

