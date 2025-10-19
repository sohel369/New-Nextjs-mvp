# 🌍 Language Learning Quiz System

A comprehensive, responsive, mobile-first language learning quiz system built with Next.js, TypeScript, and modern web technologies.

## 🎯 Features

### Core Features
- ✅ **Three Difficulty Levels**: Easy, Medium, Hard
- ✅ **Multi-language Support**: English, Arabic (RTL + diacritics), Dutch, Indonesian, Malay, Thai, Khmer
- ✅ **Multiple Choice Questions**: 4 options with 1 correct answer
- ✅ **Audio Pronunciation**: High-quality TTS using Web Speech API
- ✅ **Feedback System**: Visual feedback with confetti animations
- ✅ **XP & Streak Tracking**: Gamified learning experience
- ✅ **Leaderboard**: Global rankings with dummy data
- ✅ **Progress Saving**: localStorage integration
- ✅ **PWA Support**: Offline-ready with service worker
- ✅ **Responsive Design**: Mobile-first, works on all devices

### Bonus Features
- 🎤 **AI Pronunciation Coach**: Voice recording and analysis
- 🧠 **Adaptive Difficulty**: AI-powered difficulty adjustment
- 🎊 **Confetti Animations**: Multiple types for different achievements
- 📱 **PWA Installation**: Install as native app
- 🌐 **Offline Support**: Works without internet connection
- 🏆 **Achievement System**: Unlock badges and rewards

## 🚀 Quick Start

### 1. Navigate to Quiz System
```
http://localhost:3000/quiz-system
```

### 2. Choose Your Language
Select from 7 supported languages:
- 🇺🇸 English
- 🇸🇦 Arabic (with RTL support)
- 🇳🇱 Dutch
- 🇮🇩 Indonesian
- 🇲🇾 Malay
- 🇹🇭 Thai
- 🇰🇭 Khmer

### 3. Select Difficulty
- 🟢 **Easy**: Basic vocabulary and simple phrases
- 🟡 **Medium**: Intermediate concepts and grammar
- 🔴 **Hard**: Advanced vocabulary and complex expressions

### 4. Start Learning!
- Answer 10 questions per quiz
- Get instant feedback with confetti
- Earn XP and build streaks
- Track your progress

## 📁 File Structure

```
├── app/quiz-system/
│   └── page.tsx                 # Main quiz system page
├── components/
│   ├── LanguageLearningQuiz.tsx # Main quiz component
│   ├── QuizConfetti.tsx         # Confetti animations
│   └── AIPronunciationCoach.tsx # Voice recording feature
├── data/
│   └── quizSystemData.ts        # Quiz questions and data
├── lib/
│   ├── quizAudioService.ts      # TTS audio service
│   ├── quizProgressManager.ts   # Progress tracking
│   └── adaptiveDifficulty.ts    # AI difficulty adjustment
└── public/
    ├── manifest.json            # PWA manifest
    ├── sw.js                    # Service worker
    └── offline.html             # Offline page
```

## 🎮 How to Use

### Basic Quiz Flow
1. **Setup Screen**: Choose language and difficulty
2. **Quiz Screen**: Answer 10 questions with audio support
3. **Results Screen**: View score, XP gained, and achievements
4. **Leaderboard**: Compare with other learners

### Audio Features
- 🔊 **Pronunciation**: Click audio button to hear words
- 🎤 **Recording**: Use AI coach to practice pronunciation
- 🌍 **Multi-language**: Optimized TTS for each language

### Progress Tracking
- 📊 **XP System**: Earn 10 XP per correct answer
- 🔥 **Streaks**: Build consecutive correct answers
- 📈 **Levels**: Level up every 100 XP
- 🏆 **Achievements**: Unlock special badges

## 🛠️ Technical Details

### Technologies Used
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Web Speech API**: Text-to-speech functionality
- **Service Worker**: Offline support and caching
- **localStorage**: Progress persistence

### Audio System
```typescript
// High-quality TTS with language-specific settings
const audioService = QuizAudioService.getInstance();
await audioService.speakQuizWord(word, language);
```

### Progress Management
```typescript
// Automatic progress tracking
const progressUpdate = quizProgressManager.updateProgress(
  isCorrect, 
  selectedLanguage
);
```

### Adaptive Difficulty
```typescript
// AI-powered difficulty adjustment
const adjustment = adaptiveDifficultyManager.getDifficultyAdjustment(
  userId, 
  currentDifficulty
);
```

## 🎨 Customization

### Adding New Languages
1. Update `LANGUAGE_CONFIG` in `quizSystemData.ts`
2. Add questions to `QUIZ_QUESTIONS`
3. Configure TTS settings in `quizAudioService.ts`

### Adding New Question Types
1. Extend `QuizQuestion` interface
2. Update question rendering logic
3. Add validation in answer handling

### Styling Customization
- Modify Tailwind classes in components
- Update color schemes in gradient backgrounds
- Customize confetti animations

## 📱 PWA Features

### Installation
- **Automatic Prompt**: Browser shows install banner
- **Manual Install**: Add to home screen option
- **Offline Support**: Works without internet

### Offline Capabilities
- Cached quiz questions
- Local progress storage
- Audio pronunciation (cached)
- Service worker caching

## 🧪 Testing

### Manual Testing
1. Test all 7 languages
2. Verify audio playback
3. Check offline functionality
4. Test PWA installation
5. Validate progress saving

### Performance Testing
- Mobile responsiveness
- Audio loading times
- Confetti animations
- Service worker caching

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### PWA Deployment
- Ensure HTTPS for service worker
- Configure manifest.json
- Test offline functionality
- Verify install prompts

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_PWA_ENABLED=true
```

### Service Worker
- Automatic caching of static assets
- Background sync for progress
- Push notification support
- Offline page fallback

## 📊 Analytics

### Tracked Metrics
- Quiz completion rates
- Language preferences
- Difficulty progression
- Audio usage
- PWA installations

### User Insights
- Performance patterns
- Learning preferences
- Engagement metrics
- Achievement unlocks

## 🎯 Future Enhancements

### Planned Features
- [ ] Real AI pronunciation analysis
- [ ] Social features and challenges
- [ ] More question types
- [ ] Advanced analytics
- [ ] Multiplayer modes
- [ ] Custom quiz creation

### Technical Improvements
- [ ] Database integration
- [ ] Real-time leaderboards
- [ ] Advanced caching
- [ ] Performance optimization
- [ ] Accessibility improvements

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Navigate to `/quiz-system`

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement responsive design
- Add proper error handling
- Include accessibility features

## 📄 License

This project is part of the Language Learning App MVP. All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the console for errors
2. Verify browser compatibility
3. Test with different devices
4. Check network connectivity
5. Review PWA installation

---

**Built with ❤️ for language learners worldwide**
