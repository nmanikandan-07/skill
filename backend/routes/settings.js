const express = require('express');
const router = express.Router();
const { changePassword, updatePrivacy, updateNotificationPrefs, deleteAccount } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.put('/password', protect, changePassword);
router.put('/privacy', protect, updatePrivacy);
router.put('/notifications', protect, updateNotificationPrefs);
router.delete('/account', protect, deleteAccount);

module.exports = router;
