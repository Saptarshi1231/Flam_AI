import express from 'express';
import { getProfile, updateProfile, updatePreferences } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);

export default router;
