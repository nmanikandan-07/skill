const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teachSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  teachSkillName: String,
  learnSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  learnSkillName: String,
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  matchPercentage: {
    type: Number,
    default: 0
  },
  respondedAt: Date,
  exchangeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillExchange'
  }
}, {
  timestamps: true
});

exchangeRequestSchema.index({ fromUser: 1, status: 1 });
exchangeRequestSchema.index({ toUser: 1, status: 1 });

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
