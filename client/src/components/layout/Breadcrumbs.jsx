import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  dashboard: 'Dashboard',
  create: 'Create AI Material',
  library: 'Study Library',
  flashcards: 'Flashcards',
  quiz: 'Quizzes',
  results: 'Quiz Results',
  'study-guide': 'Study Guide',
  analytics: 'Learning Analytics',
  history: 'Study History',
  favorites: 'Saved Favorites',
  settings: 'Settings',
  profile: 'User Profile',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="hidden sm:flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 space-x-1.5 overflow-hidden">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[segment] || (segment.length > 15 ? `${segment.slice(0, 12)}...` : segment);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {isLast ? (
              <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[160px]">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors capitalize truncate max-w-[120px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
