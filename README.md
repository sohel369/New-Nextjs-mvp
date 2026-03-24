# LinguaAI - Smart Language Learning App

A comprehensive language learning MVP built with Next.js, Firebase, and Tailwind CSS. Features multi-language support, interactive quizzes, AI coaching, and PWA capabilities.

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

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database & Auth**: Firebase (Authentication + Firestore)
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
Create a `.env.local` file with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
...
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## License
MIT License
