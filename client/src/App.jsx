import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StudyProvider } from './context/StudyContext.jsx';
import { AppRouter } from './routes/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StudyProvider>
            <AppRouter />
          </StudyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
