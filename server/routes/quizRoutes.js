import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getQuizAttempts,
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/attempts', getQuizAttempts);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuizAttempt);

export default router;
