import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'demo-user-123',
      index: true,
    },
    materialId: {
      type: String,
      required: true,
    },
    materialTitle: {
      type: String,
      default: 'Study Session',
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    cardsStudied: {
      type: Number,
      default: 0,
    },
    cardsMastered: {
      type: Number,
      default: 0,
    },
    sessionType: {
      type: String,
      enum: ['flashcards', 'quiz', 'study-guide', 'summary'],
      default: 'flashcards',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema);
