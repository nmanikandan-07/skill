const express = require('express');
const router = express.Router();
const { getMatches, saveMatch, getSavedMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMatches);
router.get('/saved', protect, getSavedMatches);
router.post('/save/:id', protect, saveMatch);

module.exports = router;
