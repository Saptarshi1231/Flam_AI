import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Flag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { materialService } from '../services/materialService.js';
import api from '../services/api.js';

export const QuizSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useStudy();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionString }
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await materialService.getById(id);
        setQuiz(data);
        const qList = data.content?.questions || [];
        setQuestions(qList);
        setTimeLeft(Math.max(120, qList.length * 60)); // 60s per question
      } catch (err) {
        addToast('Error', 'Quiz could not be loaded.', 'error');
        navigate('/quiz');
      }
    };
    loadQuiz();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = questions[currentIndex];
  const currentQId = currentQ?.id || `q-${currentIndex}`;

  const handleSelectOption = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQId]: option,
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQId)) {
        next.delete(currentQId);
      } else {
        next.add(currentQId);
      }
      return next;
    });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);

    const answersPayload = questions.map((q, idx) => ({
      questionId: q.id || `q-${idx}`,
      selectedOption: selectedAnswers[q.id || `q-${idx}`] || '',
    }));

    const totalSeconds = Math.max(120, questions.length * 60) - timeLeft;

    try {
      // Submit to backend
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: answersPayload,
        timeTaken: totalSeconds,
      });

      const attempt = res.data;
      // Stash attempt in sessionStorage so Results page can render it immediately
      sessionStorage.setItem(`attempt_${id}`, JSON.stringify(attempt));
      navigate(`/results/${id}`);
    } catch (err) {
      // Local evaluation fallback
      let correctCount = 0;
      const evaluatedAnswers = questions.map((q, idx) => {
        const userChoice = selectedAnswers[q.id || `q-${idx}`] || '';
        const isCorrect = userChoice.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
        if (isCorrect) correctCount++;
        return {
          questionId: q.id || `q-${idx}`,
          question: q.question,
          selectedOption: userChoice,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation || 'Review key lecture notes to reinforce this concept.',
        };
      });

      const totalQ = questions.length || 1;
      const score = Math.round((correctCount / totalQ) * 100);

      const localAttempt = {
        _id: `att-${Date.now()}`,
        quizId: id,
        title: quiz?.title || 'Quiz Assessment',
        score,
        totalQuestions: totalQ,
        correctAnswers: correctCount,
        incorrectAnswers: totalQ - correctCount,
        timeTaken: totalSeconds,
        answers: evaluatedAnswers,
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem(`attempt_${id}`, JSON.stringify(localAttempt));
      navigate(`/results/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[k] && selectedAnswers[k] !== ''
  ).length;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header: Exit, Timer, Submit */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate('/quiz')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </button>

        {/* Live Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
            timeLeft < 60
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTimer(timeLeft)}</span>
        </div>

        <Button
          size="sm"
          icon={Send}
          onClick={() => setShowSubmitModal(true)}
          className="bg-brand-600"
        >
          Submit Quiz
        </Button>
      </div>

      {/* Main Layout: Question Content + Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Question Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <button
                onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  flaggedIds.has(currentQId)
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedIds.has(currentQId) ? 'Flagged' : 'Flag for review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswers[currentQId] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span>{opt}</span>
                    </div>

                    {isSelected && <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="md"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((p) => p - 1)}
                icon={ChevronLeft}
              >
                Previous
              </Button>

              <div className="text-xs text-slate-400 font-medium">
                {selectedAnswers[currentQId] ? 'Answer recorded' : 'Unanswered'}
              </div>

              {currentIndex < questions.length - 1 ? (
                <Button
                  size="md"
                  onClick={() => setCurrentIndex((p) => p + 1)}
                  iconRight={ChevronRight}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="md"
                  onClick={() => setShowSubmitModal(true)}
                  icon={Send}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Finish
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation Palette (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question Palette
            </h4>

            {/* Grid of question numbers */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const qId = q.id || `q-${idx}`;
                const isCurrent = currentIndex === idx;
                const isAnswered = !!selectedAnswers[qId];
                const isFlagged = flaggedIds.has(qId);

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? 'ring-2 ring-brand-500 bg-brand-600 text-white'
                        : isFlagged
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                        : isAnswered
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Flagged for review ({flaggedIds.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Quiz Assessment?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to finalize your submission? Here is your session summary:
          </p>

          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center text-xs">
            <div>
              <p className="text-slate-400">Answered</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {answeredCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Unanswered</p>
              <p className="text-lg font-bold text-rose-500 mt-0.5">
                {questions.length - answeredCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Flagged</p>
              <p className="text-lg font-bold text-amber-500 mt-0.5">
                {flaggedIds.size}
              </p>
            </div>
          </div>

          {questions.length - answeredCount > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>You have unanswered questions. Any left blank will be scored as incorrect.</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShowSubmitModal(false)}>
            Back to Review
          </Button>
          <Button
            size="sm"
            isLoading={isSubmitting}
            onClick={handleFinalSubmit}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Confirm & Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};
