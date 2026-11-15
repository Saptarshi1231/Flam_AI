import React, { useState } from 'react';
import {
  User,
  Mail,
  Award,
  Target,
  Clock,
  Layers,
  Edit2,
  Check,
  Flame,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useStudy } from '../context/StudyContext.jsx';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useStudy();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex.rivera@example.com');
  const [bio, setBio] = useState(
    user?.bio || 'Computer Science and Cognitive Biology student. Dedicated to active recall.'
  );

  const [dailyCardsGoal, setDailyCardsGoal] = useState(user?.learningGoals?.dailyCards || 30);
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(user?.learningGoals?.weeklyStudyHours || 12);

  const achievements = [
    { title: '7-Day Streak', desc: 'Studied every day for 7 consecutive days', icon: Flame, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
    { title: 'Quiz Master', desc: 'Achieved ≥90% on 5 different quizzes', icon: Award, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60' },
    { title: 'AI Explorer', desc: 'Generated 10+ custom learning materials with AI', icon: Sparkles, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' },
    { title: 'Memory Vault', desc: 'Mastered over 100 individual active recall cards', icon: Layers, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      bio,
      learningGoals: {
        dailyCards: dailyCardsGoal,
        weeklyStudyHours: weeklyHoursGoal,
      },
    });
    setIsEditing(false);
    addToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
          alt={name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                <span>{name}</span>
                <Badge variant="primary" size="xs">
                  {user?.role || 'Pro Scholar'}
                </Badge>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {email}
              </p>
            </div>

            <Button
              size="sm"
              variant="secondary"
              icon={Edit2}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed pt-1">
            {bio}
          </p>
        </div>
      </div>

      {/* Learning Goals Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" />
              <span>Current Learning Goals</span>
            </h3>
            <p className="text-xs text-slate-500">Targets used for daily streak calculations</p>
          </div>
          <Badge variant="blue" size="xs">Active Cycle</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Daily Flashcard Goal</p>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {dailyCardsGoal} Cards / Day
              </h4>
            </div>
            <Layers className="w-6 h-6 text-brand-500" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Weekly Target Hours</p>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {weeklyHoursGoal} Hours / Week
              </h4>
            </div>
            <Clock className="w-6 h-6 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Earned Scholar Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach, i) => {
            const Icon = ach.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ach.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {ach.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Unlocked</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile Details"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bio / Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Daily Cards Goal"
              type="number"
              value={dailyCardsGoal}
              onChange={(e) => setDailyCardsGoal(Number(e.target.value))}
            />
            <Input
              label="Weekly Hours Goal"
              type="number"
              value={weeklyHoursGoal}
              onChange={(e) => setWeeklyHoursGoal(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" icon={Check}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
