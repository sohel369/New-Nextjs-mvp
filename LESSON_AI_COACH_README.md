# Lesson & AI Coach Feature

## Overview

The Lesson & AI Coach feature provides an interactive learning experience with AI feedback, speech synthesis, and recognition.

## Features

### 1. Lesson Screen
- **Interactive Questions**: Comprehensive question sets for various languages
- **Progress Tracking**: Visual progress bar and question counter

### 2. AI Coach Integration
- **Chat-style Interface**: Conversational learning experience
- **TTS Responses**: AI Coach responses are read aloud automatically

### 3. Speech Features
- **Text-to-Speech (TTS)**: Reads questions and responses aloud
- **Speech-to-Text (STT)**: Voice input for answers

### 4. Firebase Integration
- **User Progress**: Saves current question index and answers to Firestore
- **Answer History**: Stores responses with timestamps

## Technical Implementation

### Tech Stack
- **Frontend**: Next.js, React
- **Database**: Firebase Firestore
- **AI**: Gemini API / Web Speech API
- **Speech**: Web Speech API (Synthesis + Recognition)
