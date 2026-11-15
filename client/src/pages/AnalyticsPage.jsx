import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  Trophy,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import api from '../services/api.js';

export const AnalyticsPage = () => {
  const [overview, setOverview] = useState({
    totalStudyHours: 18.5,
    totalSessions: 32,
    totalCardsMastered: 128,
    avgQuizScore: 84,
    currentStreak: 5,
    retentionRate: 88,
  });

  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: 'Mon', studyMinutes: 45, cardsReviewed: 28, quizScore: 85 },
    { day: 'Tue', studyMinutes: 60, cardsReviewed: 40, quizScore: 78 },
    { day: 'Wed', studyMinutes: 30, cardsReviewed: 15, quizScore: 90 },
    { day: 'Thu', studyMinutes: 75, cardsReviewed: 55, quizScore: 88 },
    { day: 'Fri', studyMinutes: 50, cardsReviewed: 35, quizScore: 82 },
    { day: 'Sat', studyMinutes: 90, cardsReviewed: 65, quizScore: 92 },
    { day: 'Sun', studyMinutes: 40, cardsReviewed: 25, quizScore: 80 },
  ]);

  const [subjectData, setSubjectData] = useState([
    { name: 'Computer Science', value: 35, color: '#6366F1' },
    { name: 'Biology', value: 25, color: '#10B981' },
    { name: 'AI & Machine Learning', value: 20, color: '#8B5CF6' },
    { name: 'History', value: 12, color: '#F59E0B' },
    { name: 'Mathematics', value: 8, color: '#3B82F6' },
  ]);

  const strongestTopics = [
    { topic: 'JavaScript Event Loop & Microtasks', subject: 'Computer Science', accuracy: 95 },
    { topic: 'Photosynthesis Fundamentals', subject: 'Biology', accuracy: 92 },
    { topic: 'World War II Turning Points', subject: 'History', accuracy: 88 },
  ];

  const weakTopics = [
    { topic: 'Backpropagation Calculus', subject: 'Artificial Intelligence', accuracy: 62 },
    { topic: 'Calvin Cycle RuBisCO Kinetics', subject: 'Biology', accuracy: 68 },
    { topic: 'Binary Search Tree Balancing', subject: 'Computer Science', accuracy: 70 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        if (res.data) setOverview(res.data);
        const weekly = await api.get('/analytics/weekly');
        if (weekly.data) setWeeklyActivity(weekly.data);
      } catch (e) {}
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Real-Time Learning Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Learning Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track retention trajectories, quiz scoring trends, and cognitive strengths
        </p>
      </div>

      {/* 5 High-Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Study Hours</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {overview.totalStudyHours}h
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +3.2h this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Study Sessions</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {overview.totalSessions}
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            18 active days
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Cards Mastered</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {overview.totalCardsMastered}
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            88% retention
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Avg Quiz Score</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {overview.avgQuizScore}%
          </h3>
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
            Top 15% tier
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Study Streak</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1">
            <span>{overview.currentStreak} Days</span>
            <span>🔥</span>
          </h3>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Personal best
          </span>
        </div>
      </div>

      {/* Visual Chart Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Minutes BarChart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Daily Study Investment (Minutes)
            </h3>
            <Badge variant="primary" size="xs">Weekly</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val} mins`, 'Study Time']}
                />
                <Bar dataKey="studyMinutes" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Accuracy Trend LineChart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quiz Accuracy Trends (%)
            </h3>
            <Badge variant="blue" size="xs">Accuracy</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQuiz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                <YAxis domain={[60, 100]} stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Quiz Score']}
                />
                <Area type="monotone" dataKey="quizScore" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorQuiz)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Distribution & Strengths/Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Share PieChart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Subject Distribution
            </h3>
            <p className="text-xs text-slate-500">Time spent by academic domain</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Study Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {subjectData.map((sub, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{sub.name}</span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{sub.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strongest Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Highest Mastery Topics
            </h3>
          </div>
          <p className="text-xs text-slate-500">Concepts with consistent ≥88% accuracy</p>

          <div className="space-y-3 pt-2">
            {strongestTopics.map((top, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {top.topic}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {top.accuracy}%
                  </span>
                </div>
                <Badge variant="blue" size="xs">
                  {top.subject}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Needs Immediate Review
            </h3>
          </div>
          <p className="text-xs text-slate-500">Topics flagged for additional active recall</p>

          <div className="space-y-3 pt-2">
            {weakTopics.map((top, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {top.topic}
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {top.accuracy}%
                  </span>
                </div>
                <Badge variant="warning" size="xs">
                  {top.subject}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
