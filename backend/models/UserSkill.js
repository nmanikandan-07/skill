const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
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
  skillName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['teach', 'learn'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

userSkillSchema.index({ userId: 1, type: 1 });
userSkillSchema.index({ skillId: 1, type: 1 });
userSkillSchema.index({ userId: 1, skillId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('UserSkill', userSkillSchema);
