import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  HelpCircle,
  BookOpen,
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Play,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import api from '../services/api.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { materials } = useStudy();

  const [analytics, setAnalytics] = useState({
    totalStudyHours: 5.7,
    totalSessions: 18,
    totalCardsMastered: 46,
    avgQuizScore: 84,
    currentStreak: 5,
  });

  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', studyMinutes: 45, cardsReviewed: 28 },
    { day: 'Tue', studyMinutes: 60, cardsReviewed: 40 },
    { day: 'Wed', studyMinutes: 30, cardsReviewed: 15 },
    { day: 'Thu', studyMinutes: 75, cardsReviewed: 55 },
    { day: 'Fri', studyMinutes: 50, cardsReviewed: 35 },
    { day: 'Sat', studyMinutes: 90, cardsReviewed: 65 },
    { day: 'Sun', studyMinutes: 40, cardsReviewed: 25 },
  ]);

  useEffect(() => {
    // Try fetching live analytics from backend
    const loadAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        if (res.data) setAnalytics(res.data);
        const weeklyRes = await api.get('/analytics/weekly');
        if (weeklyRes.data) setWeeklyData(weeklyRes.data);
      } catch (e) {
        // use default state
      }
    };
    loadAnalytics();
  }, []);

  // Format date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const recentMaterials = materials.slice(0, 3);

  const recentActivities = [
    {
      id: 'act-1',
      title: 'JavaScript Event Loop & Concurrency',
      type: 'quiz',
      score: '75%',
      timeAgo: '2 hours ago',
      duration: '4 mins',
    },
    {
      id: 'act-2',
      title: 'Photosynthesis & Plant Biology',
      type: 'flashcards',
      score: '5/6 Mastered',
      timeAgo: 'Yesterday',
      duration: '6 mins',
    },
    {
      id: 'act-3',
      title: 'World War II Turning Points',
      type: 'summary',
      score: 'Completed',
      timeAgo: '2 days ago',
      duration: '3 mins read',
    },
  ];

  const subjects = [
    { name: 'Computer Science', progress: 85, color: 'brand' },
    { name: 'Biology', progress: 75, color: 'emerald' },
    { name: 'Artificial Intelligence', progress: 45, color: 'blue' },
    { name: 'History', progress: 90, color: 'amber' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white/90">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Scholar'}! 👋
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              You are on a <span className="font-bold text-amber-300">{analytics.currentStreak}-day study streak</span>. Turn your latest lecture notes into flashcards and quizzes now!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="md"
              variant="white"
              onClick={() => navigate('/create')}
              icon={Sparkles}
            >
              Generate Material
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={() => navigate('/library')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Library
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Study Sessions</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {analytics.totalSessions}
            </h3>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +4 this week
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cards Mastered</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {analytics.totalCardsMastered}
            </h3>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> 88% retention rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Quiz Accuracy</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {analytics.avgQuizScore}%
            </h3>
            <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1">
              Top 15% tier
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Streak</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
              <span>{analytics.currentStreak} Days</span>
              <span className="text-lg">🔥</span>
            </h3>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
              Target: 14 days
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
          Quick Study Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Generate Flashcards',
              desc: 'Convert text to active recall flipcards',
              icon: Layers,
              color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
              route: '/create',
            },
            {
              title: 'Create Quiz',
              desc: 'Generate interactive multiple-choice test',
              icon: HelpCircle,
              color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
              route: '/create',
            },
            {
              title: 'Generate Study Guide',
              desc: 'Summary & key concept breakdown',
              icon: BookOpen,
              color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/60',
              route: '/create',
            },
            {
              title: 'Start Practice Test',
              desc: 'Take existing timed assessments',
              icon: Play,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
              route: '/quiz',
            },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-md transition-all text-left flex items-start gap-3.5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Content: Weekly Chart & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Weekly Study Minutes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily time invested in active learning & drills
              </p>
            </div>
            <Badge variant="primary" size="xs">This Week</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${val} mins`, 'Study Time']}
                />
                <Bar dataKey="studyMinutes" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Average: 55 mins / day</span>
            <Link to="/analytics" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Detailed Analytics →
            </Link>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Subject Mastery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proficiency calculated from quizzes & cards
            </p>
          </div>

          <div className="space-y-4">
            {subjects.map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="text-slate-500 font-semibold">{s.progress}%</span>
                </div>
                <ProgressBar progress={s.progress} color={s.color} size="sm" />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/library"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-between"
            >
              <span>Explore All Subjects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Continue Learning & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning Materials */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Continue Learning
            </h3>
            <Link to="/library" className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
              View All ({materials.length})
            </Link>
          </div>

          <div className="space-y-3">
            {recentMaterials.map((m) => {
              const targetRoute =
                m.type === 'flashcards'
                  ? `/flashcards/${m._id}`
                  : m.type === 'quiz'
                  ? `/quiz/${m._id}`
                  : `/study-guide/${m._id}`;

              return (
                <div
                  key={m._id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="xs">
                        {m.subject}
                      </Badge>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {m.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {m.title}
                    </h4>
                    <div className="w-32">
                      <ProgressBar progress={m.progress || 0} size="sm" />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Play}
                    onClick={() => navigate(targetRoute)}
                  >
                    Resume
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h3>
            <Link to="/history" className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Full History
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {act.type === 'quiz' ? (
                      <HelpCircle className="w-4 h-4" />
                    ) : act.type === 'flashcards' ? (
                      <Layers className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {act.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{act.timeAgo}</span>
                      <span>•</span>
                      <span>{act.duration}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  {act.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
