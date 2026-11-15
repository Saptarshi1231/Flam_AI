import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'demo-user-123',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['flashcards', 'quiz', 'study-guide', 'summary', 'mixed'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    sourceText: {
      type: String,
      default: '',
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', studyMaterialSchema);
