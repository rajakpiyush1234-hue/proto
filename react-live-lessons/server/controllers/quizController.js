const Question = require('../models/Question');
const Result = require('../models/Result');
const mongoose = require('mongoose');

// Helper function to calculate quiz statistics
const calculateQuizStats = (answers, totalQuestions) => {
  const stats = {
    attemptedQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedQuestions: 0,
    totalScore: 0
  };

  answers.forEach(answer => {
    if (answer.selectedOption === null) {
      stats.skippedQuestions++;
    } else {
      stats.attemptedQuestions++;
      if (answer.isCorrect) {
        stats.correctAnswers++;
        stats.totalScore += answer.points;
      } else {
        stats.wrongAnswers++;
      }
    }
  });

  stats.accuracy = (stats.correctAnswers / totalQuestions) * 100;
  return stats;
};

exports.startQuiz = async (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    const query = { isActive: true };
    
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: 10 } }, // Randomly select 10 questions
      { $project: {
        questionText: 1,
        options: {
          $map: {
            input: '$options',
            as: 'option',
            in: { text: '$$option.text' } // Exclude isCorrect field
          }
        },
        timeLimit: 1,
        points: 1,
        category: 1,
        difficulty: 1
      }}
    ]);

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: 'No questions available for the selected criteria'
      });
    }

    const totalTime = questions.reduce((sum, q) => sum + q.timeLimit, 0);

    res.json({
      success: true,
      data: {
        questions,
        totalQuestions: questions.length,
        totalTime,
        startTime: new Date()
      }
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting quiz',
      error: error.message
    });
  }
};

exports.submitQuiz = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      subject,
      answers,
      quizStartTime,
      quizEndTime,
      difficulty
    } = req.body;

    const userId = req.user.id;
    const totalTimeTaken = Math.round((new Date(quizEndTime) - new Date(quizStartTime)) / 1000);

    // Get all questions to verify answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({
      _id: { $in: questionIds }
    }).session(session);

    // Process answers and calculate statistics
    const processedAnswers = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeTaken: answer.timeTaken,
        points: isCorrect ? question.points : 0
      };
    });

    const stats = calculateQuizStats(processedAnswers, questions.length);

    // Create new result
    const result = await Result.create([{
      userId,
      subject,
      difficulty,
      quizStartTime,
      quizEndTime,
      totalTimeTaken,
      totalQuestions: questions.length,
      attemptedQuestions: stats.attemptedQuestions,
      correctAnswers: stats.correctAnswers,
      wrongAnswers: stats.wrongAnswers,
      skippedQuestions: stats.skippedQuestions,
      score: stats.totalScore,
      accuracy: stats.accuracy,
      answers: processedAnswers
    }], { session });

    // Get user's rank
    const rank = await Result.countDocuments({
      subject,
      score: { $gt: stats.totalScore }
    }).session(session);

    await session.commitTransaction();

    res.json({
      success: true,
      data: {
        result: result[0],
        rank: rank + 1,
        stats
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { subject, difficulty, timeRange } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {};
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;

    if (timeRange) {
      const now = new Date();
      const ranges = {
        day: new Date(now - 24 * 60 * 60 * 1000),
        week: new Date(now - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now - 30 * 24 * 60 * 60 * 1000),
        year: new Date(now - 365 * 24 * 60 * 60 * 1000)
      };
      if (ranges[timeRange]) {
        query.createdAt = { $gte: ranges[timeRange] };
      }
    }

    const [leaderboard, total] = await Promise.all([
      Result.find(query)
        .sort({ score: -1, totalTimeTaken: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email')
        .select('-answers'),
      Result.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalResults: total,
          hasMore: page * limit < total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Result.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalCorrectAnswers: { $sum: '$correctAnswers' },
        totalWrongAnswers: { $sum: '$wrongAnswers' },
        totalSkippedQuestions: { $sum: '$skippedQuestions' },
        averageTimeTaken: { $avg: '$totalTimeTaken' },
        subjectsAttempted: { $addToSet: '$subject' }
      }},
      { $project: {
        _id: 0,
        totalQuizzes: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averageAccuracy: { $round: ['$averageAccuracy', 2] },
        totalCorrectAnswers: 1,
        totalWrongAnswers: 1,
        totalSkippedQuestions: 1,
        averageTimeTaken: { $round: ['$averageTimeTaken', 2] },
        subjectsAttempted: 1
      }}
    ]);

    // Get recent quiz history
    const recentQuizzes = await Result.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-answers');

    // Get best scores by subject
    const bestScores = await Result.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: '$subject',
        bestScore: { $max: '$score' },
        bestAccuracy: { $max: '$accuracy' },
        attempts: { $sum: 1 }
      }},
      { $project: {
        subject: '$_id',
        bestScore: 1,
        bestAccuracy: { $round: ['$bestAccuracy', 2] },
        attempts: 1,
        _id: 0
      }}
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalQuizzes: 0,
          averageScore: 0,
          averageAccuracy: 0,
          totalCorrectAnswers: 0,
          totalWrongAnswers: 0,
          totalSkippedQuestions: 0,
          averageTimeTaken: 0,
          subjectsAttempted: []
        },
        recentQuizzes,
        bestScores
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};