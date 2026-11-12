const express = require('express');
const router = express.Router();
const { getSkills, getSkillDetails } = require('../controllers/skillController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getSkills);
router.get('/:id', optionalAuth, getSkillDetails);

module.exports = router;
