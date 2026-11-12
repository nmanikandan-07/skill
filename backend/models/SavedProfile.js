const mongoose = require('mongoose');

const savedProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  savedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

savedProfileSchema.index({ userId: 1, savedUserId: 1 }, { unique: true });

module.exports = mongoose.model('SavedProfile', savedProfileSchema);
