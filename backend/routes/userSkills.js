const express = require('express');
const router = express.Router();
const { addUserSkill, addBulkUserSkills, updateUserSkill, removeUserSkill, getMySkills } = require('../controllers/userSkillController');
const { protect } = require('../middleware/auth');
const { skillValidation } = require('../middleware/validate');

router.get('/', protect, getMySkills);
router.post('/bulk', protect, addBulkUserSkills);
router.post('/', protect, skillValidation, addUserSkill);
router.put('/:id', protect, updateUserSkill);
router.delete('/:id', protect, removeUserSkill);

module.exports = router;
