import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    avatar: {
      type: String,
      default: '',
    },
    preferences: {
      theme: { type: String, default: 'system' },
      defaultDifficulty: { type: String, default: 'intermediate' },
      dailyGoalMinutes: { type: Number, default: 30 },
      notificationsEnabled: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
