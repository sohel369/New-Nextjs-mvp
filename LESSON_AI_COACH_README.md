# Lesson & AI Coach Feature

## Overview

The Lesson & AI Coach feature provides an interactive learning experience where users can practice with 100 questions per language, receive AI feedback, and use speech synthesis and recognition for a complete audio-visual learning experience.

## Features Implemented

### 1. Lesson Screen
- **100 Questions per Language**: Comprehensive question sets for English and Arabic
- **Difficulty Levels**: Easy (40), Medium (35), Hard (25) questions
- **Categories**: Geography, Science, Math, Language, Animals, Objects, etc.
- **Progress Tracking**: Visual progress bar and question counter
- **Navigation**: Previous/Next question buttons

### 2. Question Card Component
- **Text Display**: Clear question text with optional hints
- **TTS Integration**: 🔊 Play button to read questions aloud using Web Speech Synthesis API
- **Speech Recognition**: 🎙️ Microphone button for voice input using Web Speech API
- **Answer Input**: Text input with voice input support
- **Real-time Feedback**: Instant submission and processing

### 3. AI Coach Integration
- **Chat-style Interface**: User answers and AI responses in conversation format
- **TTS Responses**: AI Coach responses are read aloud automatically
- **Context Memory**: Maintains conversation history
- **Encouraging Feedback**: Positive reinforcement and learning tips
- **Multi-language Support**: Works in both English and Arabic (RTL)

### 4. Speech Features
- **Text-to-Speech (TTS)**: 
  - Reads questions aloud in the selected language
  - AI Coach responses are spoken automatically
  - Language-specific voice selection
  - Rate and pitch control for better comprehension

- **Speech-to-Text (STT)**:
  - Voice input for answers
  - Language-specific recognition
  - Real-time transcription
  - Error handling and retry functionality

### 5. Supabase Integration
- **User Progress**: Saves current question index and answers
- **Answer History**: Stores all user responses with timestamps
- **Resume Functionality**: Users can continue where they left off
- **Progress Analytics**: Tracks completion rates and learning patterns

### 6. Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **RTL Support**: Full right-to-left support for Arabic
- **Adaptive Layout**: Works on all screen sizes
- **Touch-friendly**: Large buttons and touch targets

## Technical Implementation

### Components Created

1. **QuestionCard.tsx**
   - Individual question display
   - TTS and STT integration
   - Answer input and submission
   - Hint display

2. **LessonList.tsx**
   - Main lesson container
   - Question navigation
   - Progress tracking
   - AI Coach integration

3. **SpeechControls.tsx**
   - Reusable speech functionality
   - TTS and STT controls
   - Language-specific settings

4. **Updated AICoach.tsx**
   - Enhanced with lesson integration
   - Message history support
   - TTS response playback

### Database Schema

```sql
-- User lesson progress table
CREATE TABLE user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(5) NOT NULL,
  current_question_index INTEGER DEFAULT 0,
  user_answers JSONB DEFAULT '[]',
  total_questions INTEGER DEFAULT 0,
  completed_questions INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, language)
);
```

### Question Data Structure

```typescript
interface LessonQuestion {
  id: string;
  text: string;
  hint?: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}
```

## Usage

### Accessing the Feature

1. **From Homepage**: Navigate to "Lesson & AI Coach" in the product menu
2. **From Dashboard**: Click the "Lesson & AI Coach" button
3. **Direct URL**: `/lesson-ai-coach`

### User Flow

1. **Language Selection**: Choose learning language (English/Arabic)
2. **Question Display**: View current question with hint
3. **Audio Playback**: Click 🔊 to hear question read aloud
4. **Answer Input**: Type or speak your answer
5. **AI Feedback**: Receive instant AI Coach response
6. **Progress**: Continue to next question
7. **Resume**: Return later to continue where you left off

### Speech Features Usage

- **Hear Question**: Click the 🔊 Play button to hear the question
- **Voice Answer**: Click the 🎙️ microphone button and speak your answer
- **AI Response**: AI Coach responses are automatically read aloud
- **Language Support**: TTS and STT work in both English and Arabic

## Configuration

### Environment Variables

```env
# OpenAI API Key for enhanced AI feedback
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Browser Support

- **TTS**: Supported in all modern browsers
- **STT**: Supported in Chrome, Edge, Safari (with HTTPS)
- **Mobile**: Full support on iOS and Android

## Customization

### Adding New Questions

1. Edit `data/lessonQuestions.ts`
2. Add questions to the appropriate language array
3. Follow the `LessonQuestion` interface structure
4. Include hints and categorize by difficulty

### Modifying AI Feedback

1. Edit the `generateAIFeedback` function in `LessonList.tsx`
2. Add custom feedback logic
3. Integrate with OpenAI API for advanced responses

### Styling

- Uses Tailwind CSS for responsive design
- RTL support via `dir` attribute
- Customizable colors and themes
- Mobile-first approach

## Performance Considerations

- **Lazy Loading**: Questions loaded on demand
- **Audio Caching**: TTS responses cached for better performance
- **Progress Saving**: Debounced saves to prevent excessive API calls
- **Memory Management**: Proper cleanup of audio resources

## Future Enhancements

1. **More Languages**: Add questions for Dutch, Indonesian, Malay, Thai, Khmer
2. **Advanced AI**: Integration with GPT-4 for more sophisticated feedback
3. **Analytics**: Detailed learning progress and performance metrics
4. **Gamification**: Points, badges, and achievements
5. **Offline Support**: Download questions for offline learning
6. **Voice Training**: Pronunciation practice and feedback

## Troubleshooting

### Common Issues

1. **Speech Not Working**: Ensure HTTPS and microphone permissions
2. **Audio Playback Issues**: Check browser audio settings
3. **Progress Not Saving**: Verify Supabase connection and user authentication
4. **RTL Layout Issues**: Ensure proper `dir` attribute is set

### Browser Compatibility

- **Chrome**: Full support for all features
- **Firefox**: TTS supported, STT limited
- **Safari**: TTS supported, STT requires user interaction
- **Edge**: Full support for all features

## Support

For technical support or feature requests, please refer to the main project documentation or create an issue in the repository.
