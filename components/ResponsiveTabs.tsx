// Responsive Tabs Component
// Mobile-first design with horizontal scroll on mobile, grid layout on desktop

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string | number;
}

interface ResponsiveTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  showScrollButtons?: boolean;
  sticky?: boolean;
}

const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default',
  size = 'md',
  showScrollButtons = true,
  sticky = false
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Update scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [tabs]);

  // Scroll to active tab
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      ) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab]);

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'p-1',
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      container: 'p-2',
      button: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    lg: {
      container: 'p-3',
      button: 'px-6 py-4 text-lg',
      icon: 'w-6 h-6',
      text: 'text-lg'
    }
  };

  // Variant classes
  const getVariantClasses = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white';
      case 'underline':
        return isActive
          ? 'text-white border-b-2 border-purple-500'
          : 'text-white/70 hover:text-white border-b-2 border-transparent hover:border-white/30';
      case 'cards':
        return isActive
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white';
      default:
        return isActive
          ? 'bg-purple-600 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10';
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`relative ${sticky ? 'sticky top-0 z-40' : ''} ${className}`}>
      {/* Scroll Buttons - Desktop Only */}
      {showScrollButtons && (
        <>
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full items-center justify-center transition-all ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full items-center justify-center transition-all ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Tab Container */}
      <div
        ref={scrollContainerRef}
        className={`
          ${currentSize.container}
          ${variant === 'underline' ? 'border-b border-white/20' : 'bg-white/10 backdrop-blur-lg rounded-xl border border-white/20'}
          ${variant === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : ''}
          ${variant !== 'cards' ? 'flex overflow-x-auto scrollbar-hide space-x-1' : ''}
          ${variant === 'underline' ? 'flex' : ''}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (variant === 'cards') {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                data-tab-id={tab.id}
                className={`
                  ${currentSize.button}
                  ${getVariantClasses(isActive)}
                  rounded-lg transition-all duration-200 flex flex-col items-center space-y-3 min-h-[120px] justify-center
                `}
              >
                {Icon && <Icon className={currentSize.icon} />}
                <div className="text-center">
                  <div className={`font-semibold ${currentSize.text}`}>
                    {tab.label}
                  </div>
                  {tab.description && (
                    <div className="text-xs opacity-75 mt-1">
                      {tab.description}
                    </div>
                  )}
                </div>
                {tab.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </div>
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              data-tab-id={tab.id}
              className={`
                ${currentSize.button}
                ${getVariantClasses(isActive)}
                ${variant === 'underline' ? 'border-b-2 border-transparent' : 'rounded-lg'}
                transition-all duration-200 flex items-center space-x-2 whitespace-nowrap flex-shrink-0
                ${variant === 'underline' ? 'pb-2' : ''}
              `}
            >
              {Icon && <Icon className={currentSize.icon} />}
              <span className={currentSize.text}>{tab.label}</span>
              {tab.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Scroll Indicator */}
      {variant !== 'cards' && (
        <div className="lg:hidden flex justify-center mt-2">
          <div className="flex space-x-1">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all ${
                  index === tabs.findIndex(tab => tab.id === activeTab)
                    ? 'bg-purple-500 w-3'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTabs;
