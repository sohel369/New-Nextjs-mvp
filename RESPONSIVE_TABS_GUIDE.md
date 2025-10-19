# 📱 Responsive Tabs System Guide

A comprehensive, mobile-first responsive tab system for the Language Learning App.

## 🎯 Features

### ✅ **Mobile-First Design**
- Horizontal scrolling on mobile devices
- Touch-friendly tap targets (44px minimum)
- Smooth scroll behavior with momentum
- Safe area support for notched devices

### ✅ **Multiple Variants**
- **Default**: Standard pill-style tabs
- **Pills**: Rounded background tabs
- **Underline**: Clean underline style
- **Cards**: Card-based layout for feature selection

### ✅ **Responsive Breakpoints**
- **Mobile** (< 640px): Horizontal scroll with indicators
- **Tablet** (640px - 1024px): Optimized spacing and sizing
- **Desktop** (> 1024px): Full layout with scroll buttons

### ✅ **Accessibility Features**
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators
- Reduced motion support

## 🚀 Usage Examples

### Basic Responsive Tabs
```tsx
import ResponsiveTabs, { TabItem } from '../components/ResponsiveTabs';

const tabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    description: 'Main dashboard'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'User settings'
  }
];

<ResponsiveTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
  size="md"
/>
```

### Card-Style Tabs
```tsx
<ResponsiveTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="cards"
  size="lg"
  className="mb-8"
/>
```

### Underline Style
```tsx
<ResponsiveTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
  size="sm"
  sticky={true}
/>
```

## 📱 Responsive Behavior

### Mobile (< 640px)
- **Layout**: Horizontal scroll with hidden scrollbars
- **Navigation**: Touch swipe gestures
- **Indicators**: Dot indicators below tabs
- **Spacing**: Compact padding and margins
- **Text**: Smaller font sizes for better fit

### Tablet (640px - 1024px)
- **Layout**: Optimized grid or flex layouts
- **Navigation**: Touch-friendly with larger tap targets
- **Spacing**: Balanced padding and margins
- **Text**: Medium font sizes

### Desktop (> 1024px)
- **Layout**: Full horizontal layout
- **Navigation**: Scroll buttons for overflow
- **Spacing**: Generous padding and margins
- **Text**: Full-size fonts
- **Hover**: Enhanced hover effects

## 🎨 Variants Explained

### 1. Default Variant
```tsx
variant="default"
```
- Standard tab appearance
- Active state with background color
- Hover effects
- Best for: General navigation

### 2. Pills Variant
```tsx
variant="pills"
```
- Rounded background tabs
- Enhanced shadow effects
- Smooth transitions
- Best for: Primary navigation

### 3. Underline Variant
```tsx
variant="underline"
```
- Clean underline style
- Minimal design
- Border-bottom indicators
- Best for: Secondary navigation

### 4. Cards Variant
```tsx
variant="cards"
```
- Card-based layout
- Grid responsive design
- Icons and descriptions
- Best for: Feature selection

## 📏 Size Options

### Small (sm)
- Compact padding: `px-3 py-2`
- Small icons: `w-4 h-4`
- Small text: `text-sm`
- Best for: Dense layouts

### Medium (md) - Default
- Standard padding: `px-4 py-3`
- Medium icons: `w-5 h-5`
- Standard text: `text-base`
- Best for: General use

### Large (lg)
- Generous padding: `px-6 py-4`
- Large icons: `w-6 h-6`
- Large text: `text-lg`
- Best for: Feature highlights

## 🔧 Advanced Features

### Scroll Buttons
```tsx
showScrollButtons={true} // Default: true
```
- Desktop-only scroll buttons
- Smooth scroll animation
- Auto-hide when not needed

### Sticky Positioning
```tsx
sticky={true}
```
- Sticks to top when scrolling
- Useful for long content
- Maintains navigation access

### Badge Support
```tsx
const tabs = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    badge: 5 // Shows "5" badge
  }
];
```

## 📱 Mobile Optimizations

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between tabs
- Touch-friendly scroll areas

### Scroll Behavior
- Momentum scrolling on iOS
- Smooth scroll animations
- Hidden scrollbars for clean look

### Safe Areas
- Support for device notches
- Safe area padding
- Proper bottom spacing

## 🎯 Implementation Examples

### Profile Page Tabs
```tsx
<ResponsiveTabs
  tabs={[
    {
      id: 'stats',
      label: 'Stats',
      icon: Target,
      description: 'Your learning progress'
    },
    {
      id: 'quiz-history',
      label: 'Quiz History',
      icon: Trophy,
      description: 'Past quiz results'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Account preferences'
    }
  ]}
  activeTab={currentTab}
  onTabChange={setCurrentTab}
  variant="pills"
  size="md"
  className="mb-8"
/>
```

### Language Learning Tabs
```tsx
<ResponsiveTabs
  tabs={tabs.map(tab => ({
    id: tab.id,
    label: tab.name,
    icon: tab.icon,
    description: tab.description
  }))}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="cards"
  size="lg"
  className="mb-8"
/>
```

### Settings Modal Tabs
```tsx
// Mobile: Horizontal scroll
<div className="lg:hidden border-b border-slate-700 p-4">
  <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm"
      >
        <Icon className="w-4 h-4" />
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
</div>

// Desktop: Sidebar
<div className="hidden lg:block w-64 bg-slate-900/50 border-r border-slate-700 p-4">
  <nav className="space-y-2">
    {/* Desktop tab navigation */}
  </nav>
</div>
```

## 🎨 Customization

### CSS Classes
```css
/* Custom tab styling */
.custom-tabs .tab-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-tabs .tab-button.active {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}
```

### Theme Integration
```tsx
// Use with theme context
const { theme } = useTheme();

<ResponsiveTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  className={`${theme === 'dark' ? 'dark-tabs' : 'light-tabs'}`}
/>
```

## 🔍 Testing

### Mobile Testing
- Test on various screen sizes
- Verify touch targets are accessible
- Check scroll behavior
- Test with different orientations

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- High contrast mode
- Reduced motion preferences

### Performance Testing
- Smooth animations
- Efficient re-renders
- Memory usage
- Scroll performance

## 🚀 Best Practices

### 1. Tab Content
- Keep tab labels concise
- Use descriptive icons
- Provide helpful descriptions
- Limit number of tabs (max 5-6)

### 2. Mobile Experience
- Prioritize most important tabs
- Use horizontal scroll for overflow
- Provide visual indicators
- Ensure touch-friendly sizing

### 3. Performance
- Memoize tab components
- Use efficient scroll handling
- Minimize re-renders
- Optimize animations

### 4. Accessibility
- Provide keyboard navigation
- Use semantic HTML
- Include ARIA labels
- Test with screen readers

## 📊 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ iOS Safari 12+
- ✅ Chrome Mobile 60+

## 🎯 Future Enhancements

- [ ] Swipe gestures for mobile
- [ ] Tab reordering
- [ ] Lazy loading for tab content
- [ ] Animation presets
- [ ] Theme customization
- [ ] Tab analytics

---

**Built with ❤️ for responsive, accessible user experiences**
