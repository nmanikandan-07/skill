const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillExchange'
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  skillName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ reviewer: 1, exchange: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
