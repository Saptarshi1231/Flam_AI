import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ToastContainer } from '../common/Toast.jsx';

export const PublicLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight flex items-center gap-1.5">
              StudyFlow
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded">
                AI
              </span>
            </span>
          </Link>

          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                How It Works
              </a>
              <a href="#preview" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Interactive Preview
              </a>
              <a href="#testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Testimonials
              </a>
            </nav>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all hover:shadow"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              StudyFlow AI — Turn Your Notes Into Smarter Learning
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">
              Dashboard Demo
            </Link>
            <Link to="/create" className="hover:text-brand-600 dark:hover:text-brand-400">
              AI Generator
            </Link>
            <Link to="/library" className="hover:text-brand-600 dark:hover:text-brand-400">
              Library
            </Link>
            <span>© 2026 StudyFlow AI. Built with MERN Stack.</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
