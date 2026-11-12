const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const ExchangeRequest = require('../models/ExchangeRequest');
const SkillExchange = require('../models/SkillExchange');
const { notifyNewMessage } = require('../services/notificationService');

// @desc    Get conversations
// @route   GET /api/messages/conversations
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'fullName profileImage isOnline department year email availability bio rating')
      .populate('lastMessageSender', 'fullName')
      .sort({ lastMessageAt: -1 });
    
    // Enrich each conversation with unread count and matched skill info
    const convosWithDetails = await Promise.all(conversations.map(async (conv) => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== req.user._id.toString()) || conv.participants[0];
      
      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        sender: { $ne: req.user._id },
        isRead: false
      });
      
      // Look up accepted exchange request or active skill exchange for skill context
      let skillInfo = '';
      if (otherParticipant) {
        const exReq = await ExchangeRequest.findOne({
          $or: [
            { fromUser: req.user._id, toUser: otherParticipant._id },
            { fromUser: otherParticipant._id, toUser: req.user._id }
          ],
          status: 'accepted'
        }).select('teachSkillName learnSkillName fromUser');

        if (exReq) {
          if (exReq.fromUser.toString() === req.user._id.toString()) {
            skillInfo = `${exReq.teachSkillName || 'Skill'} ↔ ${exReq.learnSkillName || 'Skill'}`;
          } else {
            skillInfo = `${exReq.learnSkillName || 'Skill'} ↔ ${exReq.teachSkillName || 'Skill'}`;
          }
        }
      }
      
      return {
        ...conv.toJSON(),
        unreadCount,
        skillInfo
      };
    }));
    
    res.json({ conversations: convosWithDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:id/messages
const getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const isParticipant = conversation.participants.some(
      p => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to access this conversation' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user._id },
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, recipientId, content } = req.body;
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }
    
    const trimmedContent = content.trim();
    let conversation;
    
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      const isParticipant = conversation.participants.some(
        p => p.toString() === req.user._id.toString()
      );
      if (!isParticipant) {
        return res.status(403).json({ message: 'Not authorized to post in this conversation' });
      }
    } else if (recipientId) {
      if (recipientId.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot message yourself' });
      }
      
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient user not found' });
      }
      
      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId], $size: 2 }
      });
      
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, recipientId]
        });
      }
    } else {
      return res.status(400).json({ message: 'Conversation ID or recipient ID required' });
    }
    
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content: trimmedContent
    });
    
    // Update conversation
    conversation.lastMessage = trimmedContent.substring(0, 100);
    conversation.lastMessageAt = new Date();
    conversation.lastMessageSender = req.user._id;
    await conversation.save();
    
    // Populate sender for response
    await message.populate('sender', 'fullName profileImage');
    
    // Real-time broadcast via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${conversation._id}`).emit('newMessage', message);
      
      const recipientIds = conversation.participants.filter(
        p => p.toString() !== req.user._id.toString()
      );
      for (const rid of recipientIds) {
        io.to(`user_${rid}`).emit('unreadCountUpdate');
      }
    }
    
    // Notify recipient
    const recipientIds = conversation.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );
    for (const rid of recipientIds) {
      await notifyNewMessage(rid, req.user);
    }
    
    res.status(201).json({ message: message, conversationId: conversation._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Start or find conversation with matched user
// @route   POST /api/messages/start/:matchedUserId
const startConversation = async (req, res, next) => {
  try {
    const { matchedUserId } = req.params;
    
    if (matchedUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot start conversation with yourself' });
    }
    
    const targetUser = await User.findById(matchedUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, matchedUserId], $size: 2 }
    });
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, matchedUserId]
      });
    }
    
    res.json({ conversationId: conversation._id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessages, sendMessage, startConversation };
