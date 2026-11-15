import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

// Pages
import { LandingPage } from '../pages/LandingPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { SignupPage } from '../pages/SignupPage.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { CreateMaterialPage } from '../pages/CreateMaterialPage.jsx';
import { LibraryPage } from '../pages/LibraryPage.jsx';
import { FlashcardsPage } from '../pages/FlashcardsPage.jsx';
import { FlashcardSessionPage } from '../pages/FlashcardSessionPage.jsx';
import { QuizPage } from '../pages/QuizPage.jsx';
import { QuizSessionPage } from '../pages/QuizSessionPage.jsx';
import { ResultsPage } from '../pages/ResultsPage.jsx';
import { StudyGuidePage } from '../pages/StudyGuidePage.jsx';
import { AnalyticsPage } from '../pages/AnalyticsPage.jsx';
import { HistoryPage } from '../pages/HistoryPage.jsx';
import { FavoritesPage } from '../pages/FavoritesPage.jsx';
import { SettingsPage } from '../pages/SettingsPage.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Main Authenticated Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create" element={<CreateMaterialPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/flashcards/:id" element={<FlashcardSessionPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:id" element={<QuizSessionPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/study-guide/:id" element={<StudyGuidePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
