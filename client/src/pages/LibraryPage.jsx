import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Grid,
  List,
  Sparkles,
  Heart,
  Trash2,
  Play,
  Layers,
  HelpCircle,
  BookOpen,
  FileText,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { Dropdown } from '../components/common/Dropdown.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { useStudy } from '../context/StudyContext.jsx';

export const LibraryPage = () => {
  const navigate = useNavigate();
  const { materials, toggleFavorite, deleteMaterial, searchQuery, setSearchQuery } = useStudy();

  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      const matchesDifficulty = difficultyFilter === 'all' || m.difficulty === difficultyFilter;

      return matchesSearch && matchesType && matchesDifficulty;
    }).sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      if (sortOption === 'progress') return (b.progress || 0) - (a.progress || 0);
      return 0;
    });
  }, [materials, searchQuery, typeFilter, difficultyFilter, sortOption]);

  const getItemCount = (item) => {
    if (item.type === 'flashcards') return `${item.content?.cards?.length || 0} cards`;
    if (item.type === 'quiz') return `${item.content?.questions?.length || 0} questions`;
    if (item.type === 'study-guide') return `${item.content?.sections?.length || 0} sections`;
    return 'Summary';
  };

  const getDestination = (item) => {
    if (item.type === 'flashcards') return `/flashcards/${item._id}`;
    if (item.type === 'quiz') return `/quiz/${item._id}`;
    return `/study-guide/${item._id}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Study Material Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage, review, and practice your personalized learning assets
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/create')}
          className="shadow-sm"
        >
          Generate New Material
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search library by title, subject, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            {/* Difficulty Filter */}
            <Dropdown
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              className="w-full sm:w-44"
            />

            {/* Sort */}
            <Dropdown
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'title', label: 'Title (A-Z)' },
                { value: 'progress', label: 'Highest Progress' },
              ]}
              value={sortOption}
              onChange={setSortOption}
              className="w-full sm:w-44"
            />

            {/* Grid / List toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          <span className="text-slate-400 text-[11px] mr-1">Type:</span>
          {[
            { id: 'all', label: 'All Types' },
            { id: 'flashcards', label: 'Flashcards', icon: Layers },
            { id: 'quiz', label: 'Quizzes', icon: HelpCircle },
            { id: 'study-guide', label: 'Study Guides', icon: BookOpen },
            { id: 'summary', label: 'Summaries', icon: FileText },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = typeFilter === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setTypeFilter(type.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <EmptyState
          title="No study materials match your criteria"
          description="Try clearing search filters or create a new set using the AI generation engine."
          actionLabel="Create with AI"
          onAction={() => navigate('/create')}
        />
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredMaterials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
            <div
              key={item._id}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badges & Favorite */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="blue" size="xs">
                      {item.subject}
                    </Badge>
                    <Badge variant="default" size="xs">
                      {item.difficulty}
                    </Badge>
                  </div>

                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        item.favorite ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Title */}
                <h3
                  onClick={() => navigate(getDestination(item))}
                  className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer line-clamp-2 mb-2"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {item.sourceText || 'AI synthesized active recall study set.'}
                </p>
              </div>

              {/* Footer Progress & Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{getItemCount(item)}</span>
                  <span>{item.progress || 0}% Mastered</span>
                </div>
                <ProgressBar progress={item.progress || 0} size="sm" />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMaterialToDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Button
                      size="sm"
                      icon={Play}
                      onClick={() => navigate(getDestination(item))}
                    >
                      Study
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredMaterials.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {filteredMaterials.map((item) => (
            <div
              key={item._id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="xs">
                    {item.subject}
                  </Badge>
                  <span className="text-xs text-slate-400 capitalize">
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400 capitalize">
                    {item.difficulty}
                  </span>
                </div>
                <h3
                  onClick={() => navigate(getDestination(item))}
                  className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer truncate"
                >
                  {item.title}
                </h3>
                <div className="w-48 pt-1">
                  <ProgressBar progress={item.progress || 0} size="sm" />
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right text-xs text-slate-500 hidden md:block">
                  <p>{getItemCount(item)}</p>
                  <p>{item.progress || 0}% progress</p>
                </div>

                <button
                  onClick={() => toggleFavorite(item._id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      item.favorite ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => setMaterialToDelete(item)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Button
                  size="sm"
                  icon={Play}
                  onClick={() => navigate(getDestination(item))}
                >
                  Study Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {materialToDelete && (
        <ConfirmDialog
          isOpen={!!materialToDelete}
          onClose={() => setMaterialToDelete(null)}
          onConfirm={() => deleteMaterial(materialToDelete._id)}
          title="Delete Study Material?"
          message={`Are you sure you want to permanently delete "${materialToDelete.title}"? This cannot be undone.`}
        />
      )}
    </div>
  );
};
