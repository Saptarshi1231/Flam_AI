import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  Clock,
  RotateCw,
  Star,
  Quote,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const LandingPage = () => {
  const navigate = useNavigate();

  // Interactive teaser state for flashcard
  const [isFlipped, setIsFlipped] = useState(false);

  // Interactive teaser state for quiz
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);

  const testimonials = [
    {
      name: 'Maya Lin',
      role: 'Biomedical Science Student, Johns Hopkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      text: 'StudyFlow transformed my biochemistry prep. Uploading lecture transcripts turns them into active-recall cards in 10 seconds. My exam scores jumped from 78 to 94.',
      rating: 5,
    },
    {
      name: 'Julian Vance',
      role: 'Software Engineering Major, UC Berkeley',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      text: 'The interactive quizzes with instant explanations help me identify edge cases in data structures that traditional notes never revealed. Essential for my exams.',
      rating: 5,
    },
    {
      name: 'Dr. Sarah K.',
      role: 'Cognitive Science Lecturer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      text: 'StudyFlow embeds true cognitive science principles—active recall and spaced intervals—into an astonishingly frictionless SaaS dashboard.',
      rating: 5,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 to-accent-500/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Gemini & Advanced Cognitive Retrieval</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-[1.1] mb-6">
          Learn Anything.{' '}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-accent-500 bg-clip-text text-transparent">
            Remember Everything.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          StudyFlow AI converts raw lectures, textbooks, and notes into interactive flashcards, practice quizzes, and structured study guides in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            iconRight={ArrowRight}
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto shadow-lg shadow-brand-500/25"
          >
            Start Learning Free
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            Explore Interactive Demo
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div id="preview" className="relative mx-auto max-w-5xl rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/60 to-slate-100/40 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden text-left p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-slate-400">studyflow.ai/dashboard</span>
              </div>
              <Badge variant="primary" size="xs">Live Interactive Preview</Badge>
            </div>

            {/* Teaser Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Interactive Flashcard Teaser */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="blue" size="xs">Interactive Flashcard</Badge>
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline"
                    >
                      <RotateCw className="w-3 h-3" /> Click to Flip
                    </button>
                  </div>
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="min-h-[140px] flex items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    {!isFlipped ? (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Question (Front)</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          What is the primary organelle where photosynthesis takes place in plant cells?
                        </p>
                      </div>
                    ) : (
                      <div className="animate-fade-in">
                        <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2">Answer (Back)</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          The Chloroplast, specifically within the thylakoid membranes and the stroma.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Card 1 of 6</span>
                  <Link to="/flashcards/mat-101" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                    Study Full Deck →
                  </Link>
                </div>
              </div>

              {/* Interactive Quiz Teaser */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="purple" size="xs">Practice Quiz Question</Badge>
                    <span className="text-xs text-slate-400">Multiple Choice</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Which queue has higher execution priority after the call stack clears in JavaScript?
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'opt1', text: 'Microtask Queue', isCorrect: true },
                      { id: 'opt2', text: 'Macrotask Queue', isCorrect: false },
                      { id: 'opt3', text: 'Animation Frame Queue', isCorrect: false },
                    ].map((opt) => {
                      const isSelected = selectedQuizOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedQuizOption(opt.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500/50'
                          }`}
                        >
                          <span>{opt.text}</span>
                          {isSelected && (
                            <span className="text-[11px] font-bold">
                              {opt.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Instant Validation</span>
                  <Link to="/quiz/mat-102" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                    Take Full Quiz →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="sm" className="mb-3">
              Engineered for Deep Learning
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
              Everything You Need to Master Any Subject
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Transform unstructured information into an intelligent cognitive suite with automated spaced-repetition metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
                title: '3D AI Flashcards',
                desc: 'Generate interactive double-sided cards with keyboard shortcuts, flip animations, and mastery tracking.',
              },
              {
                icon: HelpCircle,
                color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50',
                title: 'Adaptive Quizzes',
                desc: 'Multiple-choice and true/false testing with live countdown timers, question flagging, and detailed breakdowns.',
              },
              {
                icon: BookOpen,
                color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50',
                title: 'Structured Guides',
                desc: 'Clean, distraction-free reading guides with table of contents navigation, bookmarking, and key takeaways.',
              },
              {
                icon: BarChart3,
                color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
                title: 'Visual Analytics',
                desc: 'Interactive Recharts visualizations monitoring weekly study hours, accuracy trends, and subject mastery.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" size="sm" className="mb-3">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            From Raw Notes to Exam Mastery
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            StudyFlow automates content breakdown so you spend 100% of your time retaining knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              icon: Brain,
              title: '1. Paste Your Material',
              desc: 'Enter lecture notes, textbook chapters, or just a topic name like "Cellular Respiration" or "Binary Trees".',
            },
            {
              step: '02',
              icon: Zap,
              title: '2. Structured AI Engine',
              desc: 'Our backend processes inputs through Gemini LLM, validating schema integrity and pedagogic clarity.',
            },
            {
              step: '03',
              icon: Target,
              title: '3. Interactive Practice',
              desc: 'Review decks with 3D card flips, test yourself with timed quizzes, and track mastery curves in real time.',
            },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute top-4 right-6 pointer-events-none select-none">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits / Cognitive Science Section */}
      <section className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <Badge variant="primary" size="sm" className="bg-brand-900/60 text-brand-300 border-brand-700">
              Backed by Cognitive Science
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Active Recall + Spaced Intervals = <span className="text-brand-400">3x Higher Retention</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Passive re-reading is proven to provide the illusion of competence. StudyFlow forces active memory retrieval at optimal intervals, cementing information into long-term synaptic recall.
            </p>
            <div className="space-y-3.5 pt-2">
              {[
                'Eliminate passive reading burnout with interactive drills',
                'Immediate feedback on wrong answers with targeted explanations',
                'Track cognitive streaks and daily time investments automatically',
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-slate-200 font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full max-w-md bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
              <span className="text-xs font-semibold text-slate-300">Retention Rate Comparison</span>
              <span className="text-xs text-brand-400 font-bold">+190% Efficacy</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Traditional Re-reading</span>
                  <span>28% Recall after 7 days</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-rose-500 w-[28%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-200 mb-1">
                  <span className="font-semibold text-brand-300">StudyFlow AI Active Retrieval</span>
                  <span className="font-semibold text-emerald-400">88% Recall after 7 days</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 w-[88%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" size="sm" className="mb-3">Loved by Students & Educators</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Hear from Scholars Excelling with StudyFlow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-brand-900 via-indigo-950 to-slate-950 text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Accelerate Your Learning Potential?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Join thousands of students studying faster and scoring higher with interactive AI flashcards and quizzes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="white"
              onClick={() => navigate('/create')}
              className="text-slate-900 shadow-xl"
              iconRight={ArrowRight}
            >
              Get Started Free Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Live Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
