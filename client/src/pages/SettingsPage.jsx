import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Bell,
  Clock,
  Shield,
  Download,
  RotateCcw,
  Check,
  Volume2,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Dropdown } from '../components/common/Dropdown.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { initialMockMaterials } from '../data/mockData.js';

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useStudy();

  const [difficulty, setDifficulty] = useState('intermediate');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);
  const [timerDuration, setTimerDuration] = useState('60');
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleSavePreferences = () => {
    localStorage.setItem(
      'studyflow_settings',
      JSON.stringify({
        difficulty,
        dailyGoalMinutes,
        timerDuration,
        notifications,
        soundEffects,
        language,
      })
    );
    addToast('Settings Saved', 'Your study preferences have been updated.', 'success');
  };

  const handleResetData = () => {
    localStorage.setItem('studyflow_local_materials', JSON.stringify(initialMockMaterials));
    localStorage.removeItem('studyflow_history');
    addToast('Data Reset', 'Restored pristine sample decks and quizzes.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      materials: JSON.parse(localStorage.getItem('studyflow_local_materials') || '[]'),
      history: JSON.parse(localStorage.getItem('studyflow_history') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data Exported', 'Downloaded study materials backup JSON.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>App Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize your theme, study parameters, notifications, and local storage data
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Appearance & Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred interface appearance for focused day or night study
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md pt-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Study Preferences Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Study Session Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Dropdown
              label="Default AI Difficulty"
              options={[
                { value: 'beginner', label: 'Beginner (Foundations)' },
                { value: 'intermediate', label: 'Intermediate (Standard)' },
                { value: 'advanced', label: 'Advanced (Deep Mastery)' },
              ]}
              value={difficulty}
              onChange={setDifficulty}
            />

            <Dropdown
              label="Quiz Timer per Question"
              options={[
                { value: '45', label: '45 Seconds (Blitz)' },
                { value: '60', label: '60 Seconds (Standard)' },
                { value: '90', label: '90 Seconds (Relaxed)' },
              ]}
              value={timerDuration}
              onChange={setTimerDuration}
            />

            <Dropdown
              label="Daily Study Goal"
              options={[
                { value: 15, label: '15 Minutes / Day' },
                { value: 30, label: '30 Minutes / Day (Recommended)' },
                { value: 45, label: '45 Minutes / Day' },
                { value: 60, label: '60 Minutes / Day' },
              ]}
              value={dailyGoalMinutes}
              onChange={(val) => setDailyGoalMinutes(Number(val))}
            />

            <Dropdown
              label="Application Language"
              options={[
                { value: 'en', label: 'English (US)' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
              ]}
              value={language}
              onChange={setLanguage}
            />
          </div>
        </div>

        {/* Notifications & Audio */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Notifications & Sound
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Daily Study Reminders
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Receive gentle nudge notifications to protect your active study streak
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850 cursor-pointer">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Interactive Feedback Sounds
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Audio cues when flipping cards and answering quiz questions
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Data Management
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your decks or restore pre-populated demonstration data
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportData}
            >
              Export JSON Backup
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetData}
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-50"
            >
              Restore Pristine Demo Data
            </Button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button size="lg" icon={Check} onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
