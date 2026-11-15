import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  BarChart3,
  Clock,
  Heart,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useStudy } from '../../context/StudyContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Material', path: '/create', icon: Sparkles, badge: 'AI' },
  { name: 'Library', path: '/library', icon: BookOpen },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Quizzes', path: '/quiz', icon: HelpCircle },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'History', path: '/history', icon: Clock },
  { name: 'Favorites', path: '/favorites', icon: Heart },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Profile', path: '/profile', icon: User },
];

export const Sidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user } = useAuth();
  const { materials } = useStudy();
  const navigate = useNavigate();

  const favoriteCount = materials?.filter((m) => m.favorite)?.length || 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight flex items-center gap-1.5">
                  StudyFlow
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  Smart Study Assistant
                </span>
              </div>
            )}
          </NavLink>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
                title={isCollapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                        isActive
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
                        {item.badge}
                      </span>
                    )}
                    {!isCollapsed && item.name === 'Favorites' && favoriteCount > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {favoriteCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User preview / Quick summary */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 dark:from-slate-850 dark:to-brand-950/20 border border-brand-100 dark:border-brand-900/40">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'Alex Rivera'}
                </p>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                  {user?.role || 'Pro Scholar'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-100 dark:border-slate-800 text-slate-400">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors gap-2"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
