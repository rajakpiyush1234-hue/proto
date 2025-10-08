const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  quizStartTime: {
    type: Date,
    required: true
  },
  quizEndTime: {
    type: Date,
    required: true
  },
  totalTimeTaken: {
    type: Number,
    required: true // in seconds
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  attemptedQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  skippedQuestions: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true // percentage
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: Number,
      required: false // null if skipped
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeTaken: {
      type: Number,
      required: true // seconds spent on this question
    },
    points: {
      type: Number,
      required: true // points earned for this question
    }
  }],
  feedback: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for calculating percentage score
resultSchema.virtual('percentageScore').get(function() {
  return (this.score / (this.totalQuestions * 1)) * 100;
});

// Index for leaderboard queries
resultSchema.index({ subject: 1, score: -1, totalTimeTaken: 1 });
// Index for user history
resultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Result', resultSchema);