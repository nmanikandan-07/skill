const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  cancelSession,
  getConnections,
  acceptSession,
  declineSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
const { sessionValidation } = require('../middleware/validate');

router.get('/connections', protect, getConnections);
router.post('/', protect, sessionValidation, createSession);
router.get('/', protect, getSessions);
router.get('/:id', protect, getSessionById);
router.put('/:id/accept', protect, acceptSession);
router.put('/:id/decline', protect, declineSession);
router.put('/:id', protect, updateSession);
router.delete('/:id', protect, cancelSession);

module.exports = router;
