const Review = require('../models/Review');
const User = require('../models/User');
const { checkAndUnlockAchievements } = require('../services/achievementService');

// @desc    Submit a review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { reviewee, exchange, skillId, skillName, rating, comment } = req.body;
    
    if (reviewee === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }
    
    // Check for existing review
    if (exchange) {
      const existing = await Review.findOne({
        reviewer: req.user._id,
        exchange
      });
      if (existing) {
        return res.status(400).json({ message: 'You already reviewed this exchange' });
      }
    }
    
    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      exchange,
      skillId,
      skillName,
      rating,
      comment
    });
    
    // Update reviewee's average rating
    const allReviews = await Review.find({ reviewee });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(reviewee, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: allReviews.length
    });
    
    await checkAndUnlockAchievements(req.user._id);
    await checkAndUnlockAchievements(reviewee);
    
    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'fullName profileImage department')
      .sort({ createdAt: -1 });
    
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getUserReviews };
