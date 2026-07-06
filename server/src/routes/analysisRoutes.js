const express = require('express');
const {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All analysis routes require authentication
router.use(protect);

router.post('/analyze', analyzeResume);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

module.exports = router;