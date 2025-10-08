const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Start a new quiz session
router.get('/start', auth, quizController.startQuiz);

// Submit quiz answers
router.post('/submit', auth, quizController.submitQuiz);

// Get leaderboard
router.get('/leaderboard', auth, quizController.getLeaderboard);

// Get user's quiz statistics
router.get('/stats', auth, quizController.getUserStats);

module.exports = router;