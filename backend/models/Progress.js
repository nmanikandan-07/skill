const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  skillName: String,
  exchangeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillExchange'
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  goal: {
    type: String,
    default: ''
  },
  milestones: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    order: Number
  }],
  learningHistory: [{
    date: Date,
    activity: String,
    duration: Number,
    notes: String
  }]
}, {
  timestamps: true
});

progressSchema.index({ userId: 1, skillId: 1 });

module.exports = mongoose.model('Progress', progressSchema);
