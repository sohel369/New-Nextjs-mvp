'use client';

import { ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isRTL } = useLanguage();
  
  return (
    <div dir="ltr" className="min-h-screen flex flex-col">
      <main dir={isRTL ? 'rtl' : 'ltr'} className="flex-1">
        {children}
      </main>
    </div>
  );
}
