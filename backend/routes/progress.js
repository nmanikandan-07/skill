const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProgress);
router.put('/:id', protect, updateProgress);

module.exports = router;
