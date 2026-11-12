const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  icon: {
    type: String,
    default: '📚'
  },
  description: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  learnerCount: {
    type: Number,
    default: 0
  },
  roadmap: [{
    step: Number,
    title: String,
    description: String,
    duration: String
  }],
  prerequisites: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  subcategory: {
    type: String,
    trim: true,
    default: ''
  },
  aliases: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  iconType: {
    type: String,
    enum: ['brand', 'lucide', 'emoji'],
    default: 'lucide'
  },
  iconKey: {
    type: String,
    default: 'sparkles'
  }
}, {
  timestamps: true
});

skillSchema.index({ name: 'text', category: 'text', subcategory: 'text', tags: 'text', aliases: 'text', keywords: 'text' });

module.exports = mongoose.model('Skill', skillSchema);
