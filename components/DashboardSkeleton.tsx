'use client';

import { 
  BookOpen, 
  Trophy, 
  Star, 
  Target, 
  Brain, 
  User, 
  Settings, 
  Bell,
  Flame,
  Globe
} from 'lucide-react';

export default function DashboardSkeleton() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden w-full dashboard-container relative animate-pulse">
      {/* Skeleton Header */}
      <header className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg"></div>
            <div className="h-6 w-24 bg-white/10 rounded"></div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 w-full">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome Section Skeleton */}
          <div className="h-40 sm:h-48 lg:h-56 bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="h-8 w-48 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-64 bg-white/5 rounded mb-8"></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-white/5 rounded-lg"></div>
              <div className="h-16 bg-white/5 rounded-lg"></div>
              <div className="h-16 bg-white/5 rounded-lg"></div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="h-16 sm:h-20 bg-white/5 rounded-xl"></div>
            <div className="h-16 sm:h-20 bg-white/5 rounded-xl"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="h-28 sm:h-32 bg-white/5 rounded-xl"></div>
            <div className="h-28 sm:h-32 bg-white/5 rounded-xl"></div>
            <div className="h-28 sm:h-32 bg-white/5 rounded-xl"></div>
            <div className="h-28 sm:h-32 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </main>

      {/* Bottom Nav Skeleton */}
      <div className="h-16 sm:h-20 bg-white/5 border-t border-white/10"></div>
    </div>
  );
}
