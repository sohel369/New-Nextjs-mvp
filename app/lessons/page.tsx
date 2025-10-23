'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LessonList from '../../components/LessonList';
import LessonDetail from '../../components/LessonDetail';
import { Lesson } from '../../data/lessonsData';

export default function LessonsPage() {
  const { currentLanguage } = useLanguage();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isRTL, setIsRTL] = useState(currentLanguage === 'ar');

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    return (
      <LessonDetail
        lesson={selectedLesson}
        isRTL={isRTL}
        onBack={handleBackToLessons}
      />
    );
  }

  return (
    <LessonList onSelectLesson={handleSelectLesson} />
  );
}