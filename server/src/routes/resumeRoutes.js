const express = require('express');
const {
  uploadResume,
  getResumeHistory,
  getResumeById,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All resume routes require authentication
router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;