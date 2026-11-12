const ExchangeRequest = require('../models/ExchangeRequest');
const SkillExchange = require('../models/SkillExchange');
const Conversation = require('../models/Conversation');
const Skill = require('../models/Skill');
const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const Progress = require('../models/Progress');
const ActivityLog = require('../models/ActivityLog');
const { calculateMatchScore } = require('../services/matchingService');
const { notifyNewRequest, notifyRequestAccepted, notifyRequestRejected } = require('../services/notificationService');

// @desc    Send exchange request
// @route   POST /api/exchange-requests
const sendRequest = async (req, res, next) => {
  try {
    const { toUser, message, proposedDuration } = req.body;
    const teachSkill = req.body.teachSkill || req.body.teachSkillId;
    const learnSkill = req.body.learnSkill || req.body.learnSkillId;
    
    if (toUser === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }
    
    // Check for existing pending request
    const existing = await ExchangeRequest.findOne({
      fromUser: req.user._id,
      toUser,
      status: 'pending'
    });
    
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request to this user' });
    }
    
    const teachSkillDoc = await Skill.findById(teachSkill);
    const learnSkillDoc = await Skill.findById(learnSkill);
    
    // Calculate match percentage
    const recipient = await User.findById(toUser);
    const { score } = await calculateMatchScore(req.user, recipient);
    
    const request = await ExchangeRequest.create({
      fromUser: req.user._id,
      toUser,
      teachSkill,
      teachSkillName: teachSkillDoc?.name || '',
      learnSkill,
      learnSkillName: learnSkillDoc?.name || '',
      message,
      matchPercentage: score
    });
    
    await ActivityLog.create({
      userId: req.user._id,
      action: 'request_sent',
      details: `Sent exchange request to ${recipient.fullName}`,
      metadata: { requestId: request._id, toUser }
    });
    
    await notifyNewRequest(toUser, req.user, learnSkillDoc?.name || 'a skill');
    
    res.status(201).json({ message: 'Exchange request sent', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get received requests
// @route   GET /api/exchange-requests/received
const getReceivedRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { toUser: req.user._id };
    if (status) filter.status = status;
    
    const requests = await ExchangeRequest.find(filter)
      .populate('fromUser', 'fullName email department year profileImage rating isVerified')
      .populate('teachSkill', 'name category icon')
      .populate('learnSkill', 'name category icon')
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sent requests
// @route   GET /api/exchange-requests/sent
const getSentRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { fromUser: req.user._id };
    if (status) filter.status = status;
    
    const requests = await ExchangeRequest.find(filter)
      .populate('toUser', 'fullName email department year profileImage rating isVerified')
      .populate('teachSkill', 'name category icon')
      .populate('learnSkill', 'name category icon')
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request
// @route   GET /api/exchange-requests/:id
const getRequestById = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id)
      .populate('fromUser', 'fullName email department year profileImage rating isVerified availability bio completedExchanges')
      .populate('toUser', 'fullName email department year profileImage rating isVerified availability bio completedExchanges')
      .populate('teachSkill', 'name category icon description')
      .populate('learnSkill', 'name category icon description');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Ensure user is participant
    if (request.fromUser._id.toString() !== req.user._id.toString() &&
        request.toUser._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json({ request });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept exchange request
// @route   PUT /api/exchange-requests/:id/accept
const acceptRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }
    
    // Create skill exchange
    const exchange = await SkillExchange.create({
      participants: [request.fromUser, request.toUser],
      skills: [
        {
          skill: request.teachSkill,
          skillName: request.teachSkillName,
          teacher: request.fromUser,
          learner: request.toUser
        },
        {
          skill: request.learnSkill,
          skillName: request.learnSkillName,
          teacher: request.toUser,
          learner: request.fromUser
        }
      ],
      request: request._id
    });
    
    // Create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [request.fromUser, request.toUser] }
    });
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [request.fromUser, request.toUser]
      });
    }
    
    // Create progress entries
    await Progress.create({
      userId: request.toUser,
      skillId: request.teachSkill,
      skillName: request.teachSkillName,
      exchangeId: exchange._id,
      partner: request.fromUser,
      goal: `Learn ${request.teachSkillName}`
    });
    
    await Progress.create({
      userId: request.fromUser,
      skillId: request.learnSkill,
      skillName: request.learnSkillName,
      exchangeId: exchange._id,
      partner: request.toUser,
      goal: `Learn ${request.learnSkillName}`
    });
    
    request.status = 'accepted';
    request.respondedAt = new Date();
    request.exchangeId = exchange._id;
    await request.save();
    
    await notifyRequestAccepted(request.fromUser, req.user);
    
    await ActivityLog.create({
      userId: req.user._id,
      action: 'request_accepted',
      details: `Accepted exchange request from user`,
      metadata: { requestId: request._id, exchangeId: exchange._id }
    });
    
    res.json({ message: 'Request accepted! You can now start your skill exchange.', exchange, conversationId: conversation._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject exchange request
// @route   PUT /api/exchange-requests/:id/reject
const rejectRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }
    
    request.status = 'rejected';
    request.respondedAt = new Date();
    await request.save();
    
    await notifyRequestRejected(request.fromUser, req.user);
    
    res.json({ message: 'Request rejected' });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel exchange request
// @route   PUT /api/exchange-requests/:id/cancel
const cancelRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }
    
    request.status = 'cancelled';
    await request.save();
    
    res.json({ message: 'Request cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendRequest, getReceivedRequests, getSentRequests, getRequestById, acceptRequest, rejectRequest, cancelRequest };
