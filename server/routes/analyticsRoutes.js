import express from 'express';
import {
  getOverview,
  getWeeklyActivity,
  getSubjectDistribution,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/weekly', getWeeklyActivity);
router.get('/subjects', getSubjectDistribution);

export default router;
