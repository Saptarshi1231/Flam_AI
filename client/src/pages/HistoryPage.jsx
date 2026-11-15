import React, { useState, useEffect } from 'react';
import {
  Clock,
  Layers,
  HelpCircle,
  BookOpen,
  Search,
  Calendar,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { storage } from '../services/storageService.js';
import { useStudy } from '../context/StudyContext.jsx';

export const HistoryPage = () => {
  const { addToast } = useStudy();
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const defaultHistory = [
      {
        id: 'hist-1',
        title: 'JavaScript Event Loop & Concurrency',
        category: 'Computer Science',
        type: 'quiz',
        duration: '4 mins',
        score: '75%',
        date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'hist-2',
        title: 'Photosynthesis & Plant Biology',
        category: 'Biology',
        type: 'flashcards',
        duration: '6 mins',
        score: '5/6 Mastered',
        date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'hist-3',
        title: 'Neural Networks Architecture & Activations',
        category: 'Artificial Intelligence',
        type: 'study-guide',
        duration: '8 mins read',
        score: 'Sections Read',
        date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        id: 'hist-4',
        title: 'World War II Turning Points',
        category: 'History',
        type: 'summary',
        duration: '3 mins read',
        score: 'Completed',
        date: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      },
    ];

    const stored = storage.getHistory();
    if (stored && stored.length > 0) {
      setHistoryItems(stored);
    } else {
      setHistoryItems(defaultHistory);
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('studyflow_history');
    setHistoryItems([]);
    addToast('History Cleared', 'All study session logs cleared.', 'info');
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Study History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Timeline of completed flashcard drills, quizzes, and reading sessions
          </p>
        </div>

        {historyItems.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={Trash2}
            onClick={handleClearHistory}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50"
          >
            Clear History
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'quiz', 'flashcards', 'study-guide'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                typeFilter === t
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All' : t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No history items found"
          description="Complete flashcards or practice tests to populate your activity timeline."
        />
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-200 dark:border-slate-800 space-y-6">
          {filteredItems.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
              </div>

              {/* Item Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-brand-500/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="blue" size="xs">
                      {item.category || 'General'}
                    </Badge>
                    <span className="text-xs text-slate-400 capitalize">
                      {item.type || 'Session'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.date).toLocaleDateString()} at{' '}
                      {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.duration && (
                      <>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </>
                    )}
                  </div>
                </div>

                {item.score && (
                  <div className="self-end sm:self-center">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {item.score}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
