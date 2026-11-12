const mongoose = require('mongoose');

const skillExchangeSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  skills: [{
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    skillName: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExchangeRequest'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  sessionsCompleted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillExchange', skillExchangeSchema);
