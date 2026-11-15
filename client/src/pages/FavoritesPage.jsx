import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Play,
  Search,
  Layers,
  HelpCircle,
  BookOpen,
  FileText,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { useStudy } from '../context/StudyContext.jsx';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { materials, toggleFavorite } = useStudy();

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const favoritedMaterials = materials.filter((m) => m.favorite);

  const filtered = favoritedMaterials.filter((m) => {
    const matchesSearch =
      search === '' ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === 'all' || m.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getDestination = (item) => {
    if (item.type === 'flashcards') return `/flashcards/${item._id}`;
    if (item.type === 'quiz') return `/quiz/${item._id}`;
    return `/study-guide/${item._id}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Saved for Quick Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Favorite Study Materials
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quickly jump back into your most important study decks, guides, and quizzes
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Favorites' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'quiz', label: 'Quizzes' },
            { id: 'study-guide', label: 'Study Guides' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved"
          description="Click the heart icon on any study material in your library to bookmark it here."
          actionLabel="Explore Library"
          onAction={() => navigate('/library')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-brand-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="blue" size="xs">
                    {item.subject}
                  </Badge>
                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="p-1 text-rose-500 hover:scale-110 transition-transform"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>

                <h3
                  onClick={() => navigate(getDestination(item))}
                  className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 transition-colors cursor-pointer line-clamp-2 mb-2"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {item.sourceText || 'AI synthesized study resource.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <ProgressBar progress={item.progress || 0} size="sm" showLabel />

                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    icon={Play}
                    onClick={() => navigate(getDestination(item))}
                  >
                    Study Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
