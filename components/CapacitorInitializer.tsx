'use client';

import { useEffect } from 'react';

export default function CapacitorInitializer() {
  useEffect(() => {
    // Initialize Capacitor plugins only when running in native app
    if (typeof window !== 'undefined') {
      const initCapacitor = async () => {
        try {
          // Check if running in Capacitor
          const isCapacitor = !!(window as any).Capacitor;
          
          if (isCapacitor) {
            const { App } = await import('@capacitor/app');
            const { StatusBar, Style } = await import('@capacitor/status-bar');
            const { SplashScreen } = await import('@capacitor/splash-screen');
            const { Keyboard } = await import('@capacitor/keyboard');

            // Configure StatusBar
            try {
              await StatusBar.setStyle({ style: Style.Dark });
              await StatusBar.setBackgroundColor({ color: '#1e1b4b' });
            } catch (e) {
              console.log('StatusBar not available:', e);
            }

            // Hide splash screen after a short delay
            try {
              setTimeout(async () => {
                await SplashScreen.hide();
              }, 2000);
            } catch (e) {
              console.log('SplashScreen not available:', e);
            }

            // Configure Keyboard
            try {
              Keyboard.setAccessoryBarVisible({ isVisible: false });
              
              // Handle keyboard events
              Keyboard.addListener('keyboardWillShow', () => {
                document.body.classList.add('keyboard-open');
              });
              
              Keyboard.addListener('keyboardWillHide', () => {
                document.body.classList.remove('keyboard-open');
              });
            } catch (e) {
              console.log('Keyboard plugin not available:', e);
            }

            // Handle app state changes
            try {
              App.addListener('appStateChange', ({ isActive }) => {
                if (isActive) {
                  console.log('App is now active');
                } else {
                  console.log('App is now in background');
                }
              });

              // Handle back button (Android)
              App.addListener('backButton', ({ canGoBack }) => {
                if (!canGoBack) {
                  App.exitApp();
                } else {
                  window.history.back();
                }
              });
            } catch (e) {
              console.log('App plugin not available:', e);
            }

            console.log('✅ Capacitor plugins initialized');
          }
        } catch (error) {
          console.warn('Capacitor initialization failed:', error);
        }
      };

      initCapacitor();
    }
  }, []);

  return null; // This component doesn't render anything
}

