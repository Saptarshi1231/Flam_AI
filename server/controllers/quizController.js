import QuizAttempt from '../models/QuizAttempt.js';
import StudyMaterial from '../models/StudyMaterial.js';
import { initialMaterials, initialAttempts } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';

let inMemoryAttempts = [...initialAttempts];

export const getQuizzes = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const quizzes = await StudyMaterial.find({ type: { $in: ['quiz', 'mixed'] } }).sort({ createdAt: -1 });
      return res.json({ success: true, count: quizzes.length, data: quizzes });
    } else {
      const quizzes = initialMaterials.filter(m => m.type === 'quiz' || m.type === 'mixed');
      return res.json({ success: true, count: quizzes.length, data: quizzes });
    }
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = null;

    if (getDBStatus()) {
      try {
        quiz = await StudyMaterial.findById(id);
      } catch (e) {
        quiz = null;
      }
    }

    if (!quiz) {
      quiz = initialMaterials.find(m => m._id === id);
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    return res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { id: quizId } = req.params;
    const { answers, timeTaken = 0 } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    // Find the quiz to verify answers
    let quiz = null;
    if (getDBStatus()) {
      try {
        quiz = await StudyMaterial.findById(quizId);
      } catch (e) {
        quiz = null;
      }
    }
    if (!quiz) {
      quiz = initialMaterials.find(m => m._id === quizId);
    }

    const questions = quiz?.content?.questions || [];
    let correctCount = 0;

    const evaluatedAnswers = answers.map((ans, idx) => {
      const questionData = questions.find(q => q.id === ans.questionId) || questions[idx];
      const isCorrect = questionData
        ? String(ans.selectedOption).trim().toLowerCase() === String(questionData.correctAnswer).trim().toLowerCase()
        : false;

      if (isCorrect) correctCount++;

      return {
        questionId: ans.questionId || `q-${idx}`,
        question: questionData?.question || 'Question',
        selectedOption: ans.selectedOption || '',
        correctAnswer: questionData?.correctAnswer || '',
        isCorrect,
        explanation: questionData?.explanation || '',
      };
    });

    const totalQuestions = questions.length || answers.length || 1;
    const incorrectCount = totalQuestions - correctCount;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const attemptData = {
      userId: req.user?.id || 'demo-user-123',
      quizId,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      timeTaken,
      answers: evaluatedAnswers,
    };

    let savedAttempt;
    if (getDBStatus()) {
      savedAttempt = await QuizAttempt.create(attemptData);
      // Update progress on material
      try {
        await StudyMaterial.findByIdAndUpdate(quizId, { progress: score });
      } catch (e) {}
    } else {
      savedAttempt = {
        _id: `att-${Date.now()}`,
        ...attemptData,
        createdAt: new Date(),
      };
      inMemoryAttempts.unshift(savedAttempt);
    }

    return res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: savedAttempt,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.query;
    if (getDBStatus()) {
      const query = quizId ? { quizId } : {};
      const attempts = await QuizAttempt.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: attempts.length, data: attempts });
    } else {
      let attempts = [...inMemoryAttempts];
      if (quizId) attempts = attempts.filter(a => a.quizId === quizId);
      return res.json({ success: true, count: attempts.length, data: attempts });
    }
  } catch (error) {
    next(error);
  }
};
