'use client';

import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function GlobalThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    // Apply theme to document
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'system');
    body.classList.remove('light', 'dark', 'system');

    // Apply current theme
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      root.classList.add('system', systemTheme);
      body.classList.add('system', systemTheme);
    } else {
      root.classList.add(settings.theme);
      body.classList.add(settings.theme);
    }

    // Apply font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xl');
    body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xl');
    root.classList.add(`font-${settings.font_size}`);
    body.classList.add(`font-${settings.font_size}`);

    // Set CSS custom properties
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
    };

    root.style.setProperty('--base-font-size', fontSizeMap[settings.font_size]);
    root.style.setProperty('--font-size', settings.font_size);
    root.style.setProperty('--theme-mode', settings.theme);
    root.style.setProperty('--current-theme', settings.theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      settings.theme
    );

  }, [settings]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (!settings || settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      const body = document.body;
      
      // Remove existing theme classes
      root.classList.remove('light', 'dark');
      body.classList.remove('light', 'dark');
      
      // Apply new system theme
      const newTheme = e.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
      body.classList.add(newTheme);
      
      // Update CSS custom property
      root.style.setProperty('--current-theme', newTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [settings]);

  return <>{children}</>;
}
