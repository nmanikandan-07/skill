const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'register', 'profile_update', 'password_reset', 'skill_added', 'skill_removed', 'request_sent', 'request_received', 'request_accepted', 'request_rejected', 'session_booked', 'session_accepted', 'session_declined', 'session_completed', 'message_sent', 'review_given', 'achievement_unlocked']
  },
  details: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

activityLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
