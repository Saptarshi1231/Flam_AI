import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCw,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { materialService } from '../services/materialService.js';
import { storage } from '../services/storageService.js';

export const FlashcardSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProgress, addToast } = useStudy();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [learningIds, setLearningIds] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  // Load deck data
  useEffect(() => {
    const loadDeck = async () => {
      try {
        const data = await materialService.getById(id);
        setDeck(data);
        if (data.content?.cards && data.content.cards.length > 0) {
          setCards(data.content.cards);
        }
      } catch (err) {
        addToast('Error', 'Failed to load flashcard deck.', 'error');
        navigate('/flashcards');
      }
    };
    loadDeck();
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCompleted) return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1') {
        handleMarkLearning();
      } else if (e.key === '2') {
        handleMarkMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards, isCompleted]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      finishSession();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkMastered = () => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id || currentIndex);
      return next;
    });
    setLearningIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id || currentIndex);
      return next;
    });

    handleNext();
  };

  const handleMarkLearning = () => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    setLearningIds((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id || currentIndex);
      return next;
    });
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id || currentIndex);
      return next;
    });

    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    addToast('Deck Shuffled', 'Cards randomized for optimal spaced recall.', 'info');
  };

  const finishSession = () => {
    setIsCompleted(true);
    const durationSec = Math.round((Date.now() - startTime) / 1000);
    const masteryPercentage = Math.round((masteredIds.size / (cards.length || 1)) * 100);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    // Update material progress
    updateProgress(id, masteryPercentage);

    // Save session in history
    storage.addHistoryItem({
      title: `Studied: ${deck?.title || 'Flashcards'}`,
      category: deck?.subject || 'Flashcards',
      type: 'flashcards',
      duration: `${Math.round(durationSec / 60) || 1} min`,
      score: `${masteryPercentage}% Mastered`,
    });
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setLearningIds(new Set());
    setIsCompleted(false);
  };

  if (!deck || cards.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/flashcards')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="blue" size="xs">
            {deck.subject}
          </Badge>
          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Deck Title */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>{deck.title}</span>
          <span>Card {currentIndex + 1} of {cards.length}</span>
        </div>
        <ProgressBar progress={progressPercent} size="sm" />
      </div>

      {/* Completion Screen Modal */}
      {isCompleted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Session Completed! 🎉
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Great job practicing active recall! Reviewing cards with spaced repetition builds long-term memory.
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Mastered</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {masteredIds.size}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Needs Review</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {learningIds.size}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button size="md" variant="secondary" icon={RotateCw} onClick={handleRestart}>
              Practice Deck Again
            </Button>
            <Button size="md" onClick={() => navigate('/library')}>
              Return to Library
            </Button>
          </div>
        </div>
      ) : (
        /* Interactive 3D Flip Card Container */
        <div className="space-y-6">
          <div
            className="perspective-1000 w-full min-h-[340px] sm:min-h-[380px] cursor-pointer select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] rounded-3xl transition-transform duration-500 transform-style-preserve-3d shadow-xl border border-slate-200/80 dark:border-slate-800 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 sm:p-12 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold tracking-wider uppercase">Question</span>
                  <span className="flex items-center gap-1 font-medium text-brand-600 dark:text-brand-400">
                    <RotateCw className="w-3.5 h-3.5" /> Click or Space to flip
                  </span>
                </div>

                <div className="my-auto text-center py-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {currentCard?.question}
                  </h3>
                </div>

                <div className="text-center text-xs text-slate-400">
                  StudyFlow Active Recall Deck
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-brand-50/90 to-indigo-50/80 dark:from-slate-900 dark:to-brand-950/40 p-8 sm:p-12 flex flex-col justify-between border-2 border-brand-500/30">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                    Answer & Explanation
                  </span>
                  <span className="flex items-center gap-1 font-medium text-brand-600 dark:text-brand-400">
                    <RotateCw className="w-3.5 h-3.5" /> Click or Space to flip
                  </span>
                </div>

                <div className="my-auto text-center py-6">
                  <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                    {currentCard?.answer}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                  Categorized in {deck.subject}
                </div>
              </div>
            </div>
          </div>

          {/* Action and Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                icon={ChevronLeft}
                className="flex-1 sm:flex-initial"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleNext}
                iconRight={ChevronRight}
                className="flex-1 sm:flex-initial"
              >
                Next
              </Button>
            </div>

            {/* Mastery evaluation buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={handleMarkLearning}
                icon={AlertCircle}
                className="flex-1 sm:flex-initial border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                Still Learning (1)
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleMarkMastered}
                icon={CheckCircle2}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700"
              >
                Mastered (2)
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-4">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">Space</kbd> Flip</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">← / →</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">1</kbd> Learning</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">2</kbd> Mastered</span>
          </div>
        </div>
      )}
    </div>
  );
};
