import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'demo-user-123',
      index: true,
    },
    quizId: {
      type: String,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
    answers: [
      {
        questionId: String,
        question: String,
        selectedOption: String,
        correctAnswer: String,
        isCorrect: Boolean,
        explanation: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
