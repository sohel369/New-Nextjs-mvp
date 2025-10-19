# Multi-Language Lessons Implementation

## Overview
This implementation enhances the Lessons tab to show content based on selected learning languages, with separate tabs for each language and correct audio playback.

## Key Features

### 1. Language-Specific Tabs
- **Separate tabs for each selected language**: When users select multiple languages (e.g., English and Arabic), they get separate tabs for each language
- **Progress tracking per language**: Each tab shows completion progress independently
- **Visual language indicators**: Each tab displays the language flag, name, and completion stats

### 2. Audio Localization
- **Language-specific audio**: Audio plays the correct language version when switching between tabs
- **Audio language indicators**: Clear indicators show which language the audio is in
- **Audio validation**: Ensures audio language matches the selected lesson language

### 3. Enhanced UI Components

#### Language Tabs
```tsx
{userLearningLanguages.length > 1 && (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-white mb-4">Select Language to Learn</h3>
    <div className="flex flex-wrap gap-3">
      {userLearningLanguages.map((lang) => {
        const languageLessons = allLessons[lang] || [];
        const completedCount = languageLessons.filter(l => l.completed).length;
        const totalCount = languageLessons.length;
        
        return (
          <button
            key={lang}
            onClick={() => handleLanguageSwitch(lang)}
            className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
              selectedLanguage === lang
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
            }`}
          >
            <span className="text-2xl">{getLanguageFlag(lang)}</span>
            <div className="text-left">
              <div className="font-semibold">{getLanguageName(lang)}</div>
              <div className="text-sm opacity-75">
                {completedCount}/{totalCount} completed
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
)}
```

#### Audio Player with Language Indicators
```tsx
{lesson.audioUrl && (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-white/70">Audio Preview</span>
      <div className="flex items-center space-x-1 text-xs text-white/60">
        <Headphones className="w-3 h-3" />
        <span>in {getLanguageName(lesson.language)}</span>
      </div>
    </div>
    <button
      onClick={() => 
        isPlaying === lesson.id 
          ? handleStopAudio() 
          : handlePlayAudio(lesson.audioUrl!, lesson.id)
      }
      className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
    >
      {isPlaying === lesson.id ? (
        <Pause className="w-5 h-5" />
      ) : (
        <Play className="w-5 h-5" />
      )}
      <span>
        {isPlaying === lesson.id ? 'Pause Audio' : `Play Audio (${getLanguageName(lesson.language)})`}
      </span>
    </button>
  </div>
)}
```

## Implementation Details

### State Management
- `allLessons`: Stores lessons for all selected languages
- `selectedLanguage`: Currently active language tab
- `lessons`: Lessons for the currently selected language
- `isPlaying`: Currently playing audio lesson ID

### Key Functions

#### `handleLanguageSwitch(lang: string)`
- Stops any currently playing audio
- Switches to the new language
- Updates lessons for the new language

#### `handlePlayAudio(audioUrl: string, lessonId: string)`
- Validates that the lesson language matches the selected language
- Creates and plays audio element
- Handles audio events (end, error)

### Data Structure
Lessons are organized by language:
```typescript
const sampleLessons: Record<string, Lesson[]> = {
  en: [
    {
      id: 'en-basic-greetings',
      title: 'Basic Greetings',
      description: 'Learn essential English greetings and polite expressions',
      language: 'en',
      audioUrl: '/audio/lessons/en/basic-greetings.mp3',
      // ... other properties
    }
  ],
  ar: [
    {
      id: 'ar-basic-greetings',
      title: 'التحيات الأساسية',
      description: 'تعلم التحيات الأساسية والتعبيرات المهذبة باللغة العربية',
      audioUrl: '/audio/lessons/ar/basic-greetings.mp3',
      // ... other properties
    }
  ]
};
```

## Testing

### Test Page
A test page is available at `/test-lessons-multilang` to verify the implementation:

1. **Language Selection**: Choose multiple languages to test
2. **Tab Switching**: Switch between language tabs
3. **Audio Testing**: Test audio playback in different languages
4. **Progress Tracking**: Verify progress is tracked per language

### Test Features
- ✅ Separate tabs for each selected language
- ✅ Language-specific audio playback
- ✅ Audio language indicators
- ✅ Progress tracking per language
- ✅ Visual language indicators

## Usage

### For Users
1. Select multiple languages in language selection
2. Navigate to Lessons tab
3. See separate tabs for each selected language
4. Click on a language tab to view lessons for that language
5. Audio will play in the correct language when clicked

### For Developers
1. The `LanguageLessons` component accepts `userLearningLanguages` prop
2. Component automatically creates tabs for multiple languages
3. Audio validation ensures correct language playback
4. Progress is tracked independently per language

## File Structure
```
components/
  └── LanguageLessons.tsx (enhanced with multi-language support)

app/
  └── test-lessons-multilang/
      └── page.tsx (test page for verification)
```

## Future Enhancements
- Database integration for real lesson data
- User progress persistence
- Advanced audio controls
- Language-specific lesson recommendations
- Offline audio support
