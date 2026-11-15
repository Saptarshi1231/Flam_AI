import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Bookmark,
  CheckCircle,
  Clock,
  Type,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { materialService } from '../services/materialService.js';

export const StudyGuidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useStudy();

  const [guide, setGuide] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [bookmarkedSections, setBookmarkedSections] = useState(new Set());
  const [fontSize, setFontSize] = useState('base'); // 'sm' | 'base' | 'lg'
  const [activeSectionId, setActiveSectionId] = useState(null);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        const data = await materialService.getById(id);
        setGuide(data);
        if (data.content?.sections && data.content.sections.length > 0) {
          setActiveSectionId(data.content.sections[0].id);
        }
      } catch (err) {
        addToast('Error', 'Failed to load study guide.', 'error');
        navigate('/library');
      }
    };
    loadGuide();
  }, [id]);

  if (!guide) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const content = guide.content || {};
  const sections = content.sections || [];
  const keyConcepts = content.keyConcepts || [];

  const toggleSectionComplete = (secId) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      if (next.has(secId)) {
        next.delete(secId);
      } else {
        next.add(secId);
      }
      return next;
    });
  };

  const toggleSectionBookmark = (secId) => {
    setBookmarkedSections((prev) => {
      const next = new Set(prev);
      if (next.has(secId)) {
        next.delete(secId);
        addToast('Bookmark Removed', 'Section removed from saved bookmarks.', 'info');
      } else {
        next.add(secId);
        addToast('Section Bookmarked', 'Section saved for quick reference.', 'success');
      }
      return next;
    });
  };

  const readingProgress = sections.length > 0
    ? Math.round((completedSections.size / sections.length) * 100)
    : 100;

  const fontClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate('/library')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        {/* Text Size & Progress Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="px-2 text-slate-400">Size:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded-lg ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : ''}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-0.5 rounded-lg ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : ''}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded-lg ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : ''}`}
            >
              A+
            </button>
          </div>

          <Badge variant="blue" size="sm">
            {readingProgress}% Read
          </Badge>
        </div>
      </div>

      {/* Guide Title Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="xs">
            {guide.subject}
          </Badge>
          <Badge variant="default" size="xs">
            {guide.difficulty}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {content.readingTime || '5 min read'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {guide.title}
        </h1>

        {content.summary && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {content.summary}
          </p>
        )}

        {/* Key Concepts Pills */}
        {keyConcepts.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Key Concepts in this Guide:
            </h4>
            <div className="flex flex-wrap gap-2">
              {keyConcepts.map((concept, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-medium border border-brand-200 dark:border-brand-800"
                >
                  • {concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Layout: Table of Contents + Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of Contents Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Table of Contents
            </h3>

            <div className="space-y-1">
              {sections.map((sec, idx) => {
                const isComplete = completedSections.has(sec.id);
                return (
                  <a
                    key={sec.id || idx}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      activeSectionId === sec.id
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{sec.title}</span>
                      {isComplete && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 ml-1.5" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <ProgressBar progress={readingProgress} size="sm" showLabel />
            </div>
          </div>
        </div>

        {/* Section Readings (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {sections.map((sec, idx) => {
            const isComplete = completedSections.has(sec.id);
            const isBookmarked = bookmarkedSections.has(sec.id);

            return (
              <section
                key={sec.id || idx}
                id={sec.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    {sec.title}
                  </h3>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSectionBookmark(sec.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Bookmark section"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleSectionComplete(sec.id)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                        isComplete
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${isComplete ? 'text-emerald-500' : ''}`} />
                      <span>{isComplete ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                <p className={`text-slate-700 dark:text-slate-300 ${fontClasses[fontSize]}`}>
                  {sec.content}
                </p>

                {/* Key Points */}
                {sec.keyPoints && sec.keyPoints.length > 0 && (
                  <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50 space-y-2">
                    <h5 className="text-xs font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider">
                      Key Takeaways:
                    </h5>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {sec.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-brand-500 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Example */}
                {sec.example && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Illustrative Example:
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic font-mono leading-relaxed">
                      {sec.example}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
