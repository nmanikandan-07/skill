const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['teaching', 'learning', 'social', 'milestone', 'special'],
    default: 'milestone'
  },
  condition: {
    type: {
      type: String,
      enum: ['sessions_completed', 'exchanges_completed', 'skills_taught', 'skills_learned', 'reviews_given', 'rating_achieved', 'profile_completed', 'first_exchange']
    },
    value: Number
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
