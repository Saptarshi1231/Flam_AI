import express from 'express';
import { generateAIContent, refineAIContent } from '../controllers/materialController.js';

const router = express.Router();

router.post('/generate', generateAIContent);
router.post('/refine', refineAIContent);

export default router;
