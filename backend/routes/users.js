const express = require('express');
const router = express.Router();
const { getMe, updateMe, getUserProfile, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { profileValidation } = require('../middleware/validate');
const upload = require('../middleware/upload');

router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profileImage'), profileValidation, updateMe);
router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserProfile);

module.exports = router;
