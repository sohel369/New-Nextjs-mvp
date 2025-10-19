# LinguaAI - Smart Language Learning App

A comprehensive language learning MVP built with Next.js, Supabase, and Tailwind CSS. Features multi-language support, interactive quizzes, AI coaching, and PWA capabilities.

## Features

### 🌍 Multi-Language Support
- **English, Arabic (RTL + diacritics), Dutch, Indonesian, Malay, Thai, Khmer**
- RTL (Right-to-Left) support for Arabic
- Native language detection and display

### 📱 Mobile-First Responsive Design
- Optimized for mobile devices
- Progressive Web App (PWA) ready
- Offline capability with service worker
- Touch-friendly interface

### 📚 Vocabulary System
- ~1000 words with categories
- Audio integration via Google TTS
- Image support for visual learning
- Difficulty levels (Beginner, Intermediate, Advanced)

### 🎯 Interactive Quizzes
- 3 difficulty levels
- Real-time feedback
- Confetti animations for correct answers
- Progress tracking

### 🏆 Progress Tracking
- XP (Experience Points) system
- Daily streaks
- Badges and achievements
- Leaderboard
- Level progression

### 🧠 AI Features
- AI pronunciation coach
- Adaptive learning algorithms
- Personalized feedback
- Voice recognition support

### ♿ Accessibility
- Screen reader compatibility
- Font size adjustment
- High contrast mode
- Caption support
- Reduced motion options
- Color blind support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **Icons**: Lucide React
- **Animations**: Framer Motion, Canvas Confetti
- **PWA**: Service Worker, Web App Manifest

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd language-learning-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google TTS API Key (optional)
GOOGLE_TTS_API_KEY=your_google_tts_api_key_here

# OpenAI API Key for AI features
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. Update the environment variables with your Supabase credentials

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── quiz/              # Quiz pages
│   ├── ai-coach/          # AI coach pages
│   └── placement-test/    # Placement test pages
├── components/            # React components
│   ├── VocabularyCard.tsx
│   ├── QuizComponent.tsx
│   ├── ProgressTracker.tsx
│   ├── AICoach.tsx
│   ├── PlacementTest.tsx
│   └── AccessibilitySettings.tsx
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── pwa.ts            # PWA utilities
├── database/              # Database schema
│   └── schema.sql
├── public/                # Static assets
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── README.md
```

## Key Components

### Homepage (`app/page.tsx`)
- Language selection with RTL support
- Progress tracking display
- PWA installation banner
- Bottom navigation

### Quiz System (`components/QuizComponent.tsx`)
- Interactive multiple choice questions
- Real-time feedback
- Confetti animations
- Progress tracking

### AI Coach (`components/AICoach.tsx`)
- Voice recognition
- Text-to-speech
- Conversational AI
- Pronunciation feedback

### Accessibility (`components/AccessibilitySettings.tsx`)
- Font size adjustment
- High contrast mode
- Screen reader support
- Color blind assistance

## PWA Features

- **Offline Support**: Service worker caches essential resources
- **Install Prompt**: Native app-like installation
- **Manifest**: App metadata and icons
- **Responsive**: Works on all device sizes

## Database Schema

The app uses Supabase with the following main tables:
- `users` - User profiles and progress
- `languages` - Supported languages
- `vocabulary` - Word database
- `quizzes` - Quiz questions and answers
- `user_progress` - Learning progress tracking
- `badges` - Achievement system

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@linguaai.com or create an issue in the repository.
