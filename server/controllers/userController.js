let demoUserProfile = {
  _id: 'demo-user-123',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  role: 'Pro Scholar',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Computer Science and Cognitive Biology student. Dedicated to active recall & spaced repetition.',
  learningGoals: {
    dailyCards: 30,
    weeklyStudyHours: 12,
    targetAccuracy: 85,
    streakGoal: 14,
  },
  preferences: {
    theme: 'system',
    defaultDifficulty: 'intermediate',
    dailyGoalMinutes: 30,
    notificationsEnabled: true,
    soundEnabled: true,
    language: 'English (US)',
  },
  createdAt: new Date('2026-09-15T00:00:00Z'),
};

export const getProfile = async (req, res, next) => {
  try {
    return res.json({ success: true, data: demoUserProfile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, learningGoals } = req.body;
    if (name) demoUserProfile.name = name;
    if (bio !== undefined) demoUserProfile.bio = bio;
    if (avatar) demoUserProfile.avatar = avatar;
    if (learningGoals) demoUserProfile.learningGoals = { ...demoUserProfile.learningGoals, ...learningGoals };

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: demoUserProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const newPreferences = req.body;
    demoUserProfile.preferences = { ...demoUserProfile.preferences, ...newPreferences };

    return res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: demoUserProfile.preferences,
    });
  } catch (error) {
    next(error);
  }
};
