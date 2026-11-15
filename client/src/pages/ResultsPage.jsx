import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Layers,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { materialService } from '../services/materialService.js';

export const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProgress } = useStudy();

  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    // Load from sessionStorage
    const stored = sessionStorage.getItem(`attempt_${id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAttempt(parsed);

        // Update progress on material
        if (parsed.score !== undefined) {
          updateProgress(id, parsed.score);
        }

        // Confetti if score is solid
        if (parsed.score >= 70) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      } catch (e) {}
    } else {
      // Fallback: mock attempt
      const defaultAttempt = {
        score: 75,
        totalQuestions: 4,
        correctAnswers: 3,
        incorrectAnswers: 1,
        timeTaken: 145,
        answers: [
          {
            question: 'Which queue has higher execution priority after the current call stack clears?',
            selectedOption: 'Microtask Queue',
            correctAnswer: 'Microtask Queue',
            isCorrect: true,
            explanation: 'Microtasks always run immediately after the call stack empties and before macrotasks.',
          },
          {
            question: 'Which creates a task in the Microtask Queue?',
            selectedOption: 'Promise.resolve().then()',
            correctAnswer: 'Promise.resolve().then()',
            isCorrect: true,
            explanation: 'Promise resolution callbacks are dispatched to the microtask queue.',
          },
          {
            question: 'What will be printed first: console.log("A"), Promise.resolve().then(() => console.log("B")), or setTimeout(() => console.log("C"), 0)?',
            selectedOption: '"B"',
            correctAnswer: '"A"',
            isCorrect: false,
            explanation: '"A" runs synchronously on the call stack first.',
          },
          {
            question: 'Is JavaScript executing multithreaded JavaScript code on its main thread by default?',
            selectedOption: 'No, JavaScript has a single-threaded call stack',
            correctAnswer: 'No, JavaScript has a single-threaded call stack',
            isCorrect: true,
            explanation: 'JavaScript engines use a single call stack and event loop.',
          },
        ],
      };
      setAttempt(defaultAttempt);
    }
  }, [id]);

  if (!attempt) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const score = attempt.score || 0;
  const isPassing = score >= 70;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Score Summary Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
        {/* Animated Circular Score Display */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              className={isPassing ? 'text-emerald-500' : 'text-amber-500'}
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * score) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {score}%
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {attempt.correctAnswers} / {attempt.totalQuestions}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {isPassing ? 'Outstanding Performance! 🌟' : 'Good Effort! Keep Reviewing 💪'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            {isPassing
              ? 'You have demonstrated strong grasp of the material. Review missed questions below to achieve 100% mastery.'
              : 'Consistent spaced practice will reinforce these concepts. Check the explanations below to correct misunderstandings.'}
          </p>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Correct</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {attempt.correctAnswers}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-center">
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Incorrect</p>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {attempt.incorrectAnswers}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-500 font-medium">Time</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200 mt-0.5">
              {formatTime(attempt.timeTaken || 120)}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            size="md"
            variant="secondary"
            icon={RotateCw}
            onClick={() => navigate(`/quiz/${id}`)}
          >
            Retake Quiz
          </Button>
          <Button
            size="md"
            icon={Layers}
            onClick={() => navigate('/flashcards')}
          >
            Review Flashcards
          </Button>
          <Button
            size="md"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </div>

      {/* Detailed Question Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Detailed Question-by-Question Analysis
        </h3>

        <div className="space-y-4">
          {attempt.answers?.map((ans, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 transition-all ${
                ans.isCorrect
                  ? 'border-emerald-200 dark:border-emerald-900/60 shadow-sm'
                  : 'border-rose-200 dark:border-rose-900/60 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="text-xs font-bold text-slate-400">
                  Question {idx + 1}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    ans.isCorrect
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {ans.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Correct
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-500" /> Incorrect
                    </>
                  )}
                </span>
              </div>

              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {ans.question}
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850">
                  <span className="font-semibold text-slate-500 w-28 flex-shrink-0">
                    Your Answer:
                  </span>
                  <span
                    className={`font-bold ${
                      ans.isCorrect
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {ans.selectedOption || '(Left blank)'}
                  </span>
                </div>

                {!ans.isCorrect && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 w-28 flex-shrink-0">
                      Correct Answer:
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {ans.correctAnswer}
                    </span>
                  </div>
                )}
              </div>

              {ans.explanation && (
                <div className="mt-4 p-3 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/30 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-brand-700 dark:text-brand-300">
                    Explanation:{' '}
                  </span>
                  {ans.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
