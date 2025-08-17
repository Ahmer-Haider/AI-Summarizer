import express from 'express';
import { createSummary, shareSummary } from '../controllers/summaryController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// ❌ CHANGE THIS LINE:
// router.post('/summarize', upload.single('file'), createSummary);

// ✅ TO THIS LINE (to accept multiple files):
router.post('/summarize', upload.array('file'), createSummary);


// This line remains the same
router.post('/share', shareSummary);

export default router;