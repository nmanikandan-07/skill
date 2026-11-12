const express = require('express');
const router = express.Router();
const { sendRequest, getReceivedRequests, getSentRequests, getRequestById, acceptRequest, rejectRequest, cancelRequest } = require('../controllers/exchangeRequestController');
const { protect } = require('../middleware/auth');
const { exchangeRequestValidation } = require('../middleware/validate');

router.post('/', protect, exchangeRequestValidation, sendRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.put('/:id/cancel', protect, cancelRequest);

module.exports = router;
