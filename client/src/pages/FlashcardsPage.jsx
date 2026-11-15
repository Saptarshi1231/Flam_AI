import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Play,
  RotateCw,
  Heart,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { useStudy } from '../context/StudyContext.jsx';

export const FlashcardsPage = () => {
  const navigate = useNavigate();
  const { materials, toggleFavorite } = useStudy();

  const [activeTab, setActiveTab] = useState('all');

  // Filter flashcard-type materials
  const flashcardDecks = materials.filter((m) => m.type === 'flashcards');

  const filteredDecks = flashcardDecks.filter((deck) => {
    if (activeTab === 'favorites') return deck.favorite;
    if (activeTab === 'mastered') return (deck.progress || 0) >= 80;
    return true;
  });

  const totalCards = flashcardDecks.reduce(
    (sum, d) => sum + (d.content?.cards?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Spaced Repetition & Active Recall</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Flashcard Decks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Study your curated card sets with 3D flip animations and mastery tracking
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => navigate('/create')}
          className="shadow-sm"
        >
          Generate New Deck
        </Button>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Decks</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {flashcardDecks.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Cards</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {totalCards}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Decks Mastered (&gt;80%)</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {flashcardDecks.filter((d) => (d.progress || 0) >= 80).length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-medium">
        {[
          { id: 'all', label: `All Decks (${flashcardDecks.length})` },
          { id: 'favorites', label: `Favorites (${flashcardDecks.filter((d) => d.favorite).length})` },
          { id: 'mastered', label: 'Mastered' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Decks Grid */}
      {filteredDecks.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No flashcard decks found"
          description="Generate your first active recall deck from your notes or syllabus."
          actionLabel="Generate Flashcards"
          onAction={() => navigate('/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => {
            const cardCount = deck.content?.cards?.length || 0;
            return (
              <div
                key={deck._id}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="blue" size="xs">
                      {deck.subject}
                    </Badge>
                    <button
                      onClick={() => toggleFavorite(deck._id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title={deck.favorite ? 'Unfavorite' : 'Favorite'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          deck.favorite ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h3
                    onClick={() => navigate(`/flashcards/${deck._id}`)}
                    className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer line-clamp-2 mb-2"
                  >
                    {deck.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {deck.sourceText || `${cardCount} high-yield memory retrieval flashcards.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{cardCount} cards</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {deck.progress || 0}% Mastered
                    </span>
                  </div>
                  <ProgressBar progress={deck.progress || 0} size="sm" />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(deck.updatedAt || deck.createdAt).toLocaleDateString()}
                    </span>

                    <Button
                      size="sm"
                      icon={Play}
                      onClick={() => navigate(`/flashcards/${deck._id}`)}
                    >
                      Practice Deck
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
