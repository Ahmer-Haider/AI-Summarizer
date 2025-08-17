import express from 'express';
import { createSummary, shareSummary } from '../controllers/summaryController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/summarize', upload.array('file'), createSummary);
router.post('/share', shareSummary);

export default router;