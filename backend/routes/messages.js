const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage, startConversation } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { messageValidation } = require('../middleware/validate');

router.get('/conversations', protect, getConversations);
router.get('/conversations/:id/messages', protect, getMessages);
router.post('/start/:matchedUserId', protect, startConversation);
router.post('/', protect, messageValidation, sendMessage);

module.exports = router;
