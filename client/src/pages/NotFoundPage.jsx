import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home, BookOpen } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-sm">
        <GraduationCap className="w-8 h-8" />
      </div>

      <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">
        Page Not Found
      </h1>

      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The study deck, quiz session, or route you are looking for does not exist or has been relocated.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          size="md"
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          size="md"
          icon={Home}
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
        <Button
          size="md"
          variant="outline"
          icon={BookOpen}
          onClick={() => navigate('/library')}
        >
          Browse Library
        </Button>
      </div>
    </div>
  );
};
