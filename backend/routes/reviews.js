const express = require('express');
const router = express.Router();
const { createReview, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { reviewValidation } = require('../middleware/validate');

router.post('/', protect, reviewValidation, createReview);
router.get('/:userId', protect, getUserReviews);

module.exports = router;
