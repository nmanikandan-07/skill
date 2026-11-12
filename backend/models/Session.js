const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  exchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillExchange'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  skillName: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'in-person'],
    default: 'online'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'scheduled', 'completed', 'declined', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  learningObjective: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  meetingLink: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

sessionSchema.index({ organizer: 1, date: 1 });
sessionSchema.index({ partner: 1, date: 1 });
sessionSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Session', sessionSchema);
