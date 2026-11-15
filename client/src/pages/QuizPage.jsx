import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Play,
  Clock,
  Trophy,
  CheckCircle2,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { useStudy } from '../context/StudyContext.jsx';

export const QuizPage = () => {
  const navigate = useNavigate();
  const { materials } = useStudy();

  const [activeSubject, setActiveSubject] = useState('all');

  const quizzes = materials.filter((m) => m.type === 'quiz' || m.type === 'mixed');

  const subjects = ['all', ...new Set(quizzes.map((q) => q.subject))];

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeSubject !== 'all' && q.subject !== activeSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Self-Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Practice Quizzes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Test your knowledge under timed conditions with comprehensive question-by-question explanations
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => navigate('/create')}
          className="shadow-sm"
        >
          Create New Quiz
        </Button>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium border-b border-slate-200 dark:border-slate-800">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
              activeSubject === sub
                ? 'bg-brand-600 text-white font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {sub === 'all' ? 'All Subjects' : sub}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No quizzes available"
          description="Generate a practice quiz on any topic using our AI content generator."
          actionLabel="Generate Quiz"
          onAction={() => navigate('/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const questionCount = quiz.content?.questions?.length || 0;
            const estimatedMins = Math.max(2, Math.round(questionCount * 1.5));

            return (
              <div
                key={quiz._id}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="blue" size="xs">
                      {quiz.subject}
                    </Badge>
                    <Badge variant="default" size="xs">
                      {quiz.difficulty}
                    </Badge>
                  </div>

                  <h3
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer line-clamp-2 mb-2"
                  >
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {quiz.sourceText || `${questionCount} multiple-choice testing items with explanations.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {questionCount} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      ~{estimatedMins} Mins
                    </span>
                  </div>

                  {quiz.progress > 0 ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Previous Score</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {quiz.progress}%
                        </span>
                      </div>
                      <ProgressBar progress={quiz.progress} size="sm" color="emerald" />
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      Not attempted yet
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      icon={Play}
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="w-full justify-center"
                    >
                      {quiz.progress > 0 ? 'Retake Quiz' : 'Start Quiz'}
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
