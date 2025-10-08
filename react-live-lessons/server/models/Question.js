const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    required: true,
    default: 1
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 60 // seconds per question
  },
  explanation: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);