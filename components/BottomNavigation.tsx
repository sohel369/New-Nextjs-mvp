'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Target, Bot, User } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';

export default function BottomNavigation() {
  const pathname = usePathname();
  const t = useTranslation();
  const { isRTL } = useLanguage();

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/lessons', icon: BookOpen, label: t('lessons') },
    { href: '/quiz', icon: Target, label: t('quiz') },
    { href: '/ai-coach', icon: Bot, label: t('aiCoach') },
    { href: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 z-[100] safe-area-pb" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center justify-around py-1 sm:py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-0.5 sm:space-y-1 p-2 sm:p-3 transition-colors min-w-0 flex-1 touch-target ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className={`text-xs font-medium truncate max-w-full px-1 hidden sm:block ${isRTL ? 'text-right' : 'text-left'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
