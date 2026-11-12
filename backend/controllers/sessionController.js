const Session = require('../models/Session');
const SkillExchange = require('../models/SkillExchange');
const ExchangeRequest = require('../models/ExchangeRequest');
const UserSkill = require('../models/UserSkill');
const User = require('../models/User');
const Progress = require('../models/Progress');
const ActivityLog = require('../models/ActivityLog');
const { checkAndUnlockAchievements } = require('../services/achievementService');
const {
  notifySessionReminder,
  notifySessionRequest,
  notifySessionAccepted,
  notifySessionDeclined
} = require('../services/notificationService');

// @desc    Get connected learning partners for booking sessions
// @route   GET /api/sessions/connections
const getConnections = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get accepted exchange requests involving current user
    const acceptedRequests = await ExchangeRequest.find({
      $or: [
        { fromUser: userId, status: 'accepted' },
        { toUser: userId, status: 'accepted' }
      ]
    })
      .populate('fromUser', 'fullName email department year profileImage isOnline availability')
      .populate('toUser', 'fullName email department year profileImage isOnline availability')
      .populate('teachSkill', 'name icon category')
      .populate('learnSkill', 'name icon category');

    // 2. Get active/completed skill exchanges involving current user
    const activeExchanges = await SkillExchange.find({
      participants: userId,
      status: { $in: ['active', 'completed'] }
    })
      .populate('participants', 'fullName email department year profileImage isOnline availability')
      .populate('skills.skill', 'name icon category');

    const partnerMap = new Map();

    const getPartnerEntry = (partnerUser) => {
      const partnerIdStr = partnerUser._id.toString();
      if (!partnerMap.has(partnerIdStr)) {
        partnerMap.set(partnerIdStr, {
          partner: partnerUser,
          skills: []
        });
      }
      return partnerMap.get(partnerIdStr);
    };

    // Process ExchangeRequests
    for (const reqDoc of acceptedRequests) {
      if (!reqDoc.fromUser || !reqDoc.toUser) continue;
      const isRequester = reqDoc.fromUser._id.toString() === userId.toString();
      const partnerUser = isRequester ? reqDoc.toUser : reqDoc.fromUser;
      if (!partnerUser || partnerUser._id.toString() === userId.toString()) continue;

      const entry = getPartnerEntry(partnerUser);

      if (isRequester) {
        // Logged-in user is fromUser. Partner (toUser) teaches learnSkill -> "Can Teach You"
        const learnName = reqDoc.learnSkillName || reqDoc.learnSkill?.name;
        if (learnName && !entry.skills.some(s => s.skillName === learnName && s.type === 'Can Teach You')) {
          entry.skills.push({
            skillId: reqDoc.learnSkill?._id || reqDoc.learnSkill,
            skillName: learnName,
            type: 'Can Teach You',
            exchangeId: reqDoc.exchangeId
          });
        }
        // Logged-in user teaches teachSkill -> Partner "Wants to Learn"
        const teachName = reqDoc.teachSkillName || reqDoc.teachSkill?.name;
        if (teachName && !entry.skills.some(s => s.skillName === teachName && s.type === 'Wants to Learn')) {
          entry.skills.push({
            skillId: reqDoc.teachSkill?._id || reqDoc.teachSkill,
            skillName: teachName,
            type: 'Wants to Learn',
            exchangeId: reqDoc.exchangeId
          });
        }
      } else {
        // Logged-in user is toUser. Partner (fromUser) teaches teachSkill -> "Can Teach You"
        const teachName = reqDoc.teachSkillName || reqDoc.teachSkill?.name;
        if (teachName && !entry.skills.some(s => s.skillName === teachName && s.type === 'Can Teach You')) {
          entry.skills.push({
            skillId: reqDoc.teachSkill?._id || reqDoc.teachSkill,
            skillName: teachName,
            type: 'Can Teach You',
            exchangeId: reqDoc.exchangeId
          });
        }
        // Logged-in user teaches learnSkill -> Partner "Wants to Learn"
        const learnName = reqDoc.learnSkillName || reqDoc.learnSkill?.name;
        if (learnName && !entry.skills.some(s => s.skillName === learnName && s.type === 'Wants to Learn')) {
          entry.skills.push({
            skillId: reqDoc.learnSkill?._id || reqDoc.learnSkill,
            skillName: learnName,
            type: 'Wants to Learn',
            exchangeId: reqDoc.exchangeId
          });
        }
      }
    }

    // Process SkillExchanges
    for (const exDoc of activeExchanges) {
      for (const part of exDoc.participants) {
        if (!part || part._id.toString() === userId.toString()) continue;
        const entry = getPartnerEntry(part);

        if (exDoc.skills && exDoc.skills.length > 0) {
          for (const sItem of exDoc.skills) {
            const sName = sItem.skillName || sItem.skill?.name;
            if (!sName) continue;
            const isTeacher = sItem.teacher && sItem.teacher.toString() === part._id.toString();
            const typeLabel = isTeacher ? 'Can Teach You' : 'Wants to Learn';

            if (!entry.skills.some(s => s.skillName === sName && s.type === typeLabel)) {
              entry.skills.push({
                skillId: sItem.skill?._id || sItem.skill,
                skillName: sName,
                type: typeLabel,
                exchangeId: exDoc._id
              });
            }
          }
        }
      }
    }

    const connections = Array.from(partnerMap.values());

    // Fallback: Populate skills from UserSkill if connection skills are empty
    for (const conn of connections) {
      if (conn.skills.length === 0) {
        const pTeachSkills = await UserSkill.find({ userId: conn.partner._id, type: 'teach' }).populate('skill');
        const pLearnSkills = await UserSkill.find({ userId: conn.partner._id, type: 'learn' }).populate('skill');

        pTeachSkills.forEach(us => {
          const sName = us.skillName || us.skill?.name;
          if (sName && !conn.skills.some(s => s.skillName === sName)) {
            conn.skills.push({ skillId: us.skill?._id, skillName: sName, type: 'Can Teach You' });
          }
        });

        pLearnSkills.forEach(us => {
          const sName = us.skillName || us.skill?.name;
          if (sName && !conn.skills.some(s => s.skillName === sName)) {
            conn.skills.push({ skillId: us.skill?._id, skillName: sName, type: 'Wants to Learn' });
          }
        });
      }
    }

    res.json({ connections });
  } catch (error) {
    next(error);
  }
};

// Helper: Parse time string ("10:00 AM" or "14:30") to minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Helper: Format minutes from midnight back to 12h time string
const formatMinutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
};

// @desc    Book a session
// @route   POST /api/sessions
const createSession = async (req, res, next) => {
  try {
    const { partner, exchangeId, skillId, skillName, date, startTime, duration = 60, mode = 'online', learningObjective, notes, location, meetingLink } = req.body;
    const userId = req.user._id;

    if (!partner) {
      return res.status(400).json({ message: 'Partner selection is required' });
    }

    if (partner.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot book a session with yourself' });
    }

    // 1. Verify partner exists
    const partnerUser = await User.findById(partner);
    if (!partnerUser) {
      return res.status(404).json({ message: 'Selected partner not found' });
    }

    // 2. Verify current user and partner are connected
    const acceptedRequest = await ExchangeRequest.findOne({
      $or: [
        { fromUser: userId, toUser: partner, status: 'accepted' },
        { fromUser: partner, toUser: userId, status: 'accepted' }
      ]
    });

    const activeExchange = await SkillExchange.findOne({
      participants: { $all: [userId, partner] },
      status: { $in: ['active', 'completed'] }
    });

    if (!acceptedRequest && !activeExchange) {
      return res.status(403).json({ message: 'You can only book sessions with connected learning partners.' });
    }

    // 3. Validate Date & Time
    const sessionDate = new Date(date);
    if (isNaN(sessionDate.getTime())) {
      return res.status(400).json({ message: 'Invalid session date' });
    }

    const startMinutes = parseTimeToMinutes(startTime);
    if (startMinutes === null) {
      return res.status(400).json({ message: 'Invalid start time format' });
    }

    const durationNum = parseInt(duration, 10) || 60;
    const endMinutes = startMinutes + durationNum;
    const calculatedEndTime = req.body.endTime || formatMinutesToTime(endMinutes);

    // Prevent past date/time
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDayStart = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

    if (inputDayStart < todayStart) {
      return res.status(400).json({ message: 'Cannot book a session for a past date' });
    }

    if (inputDayStart.getTime() === todayStart.getTime()) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if (startMinutes <= currentMinutes) {
        return res.status(400).json({ message: 'Cannot book a session for a time slot in the past' });
      }
    }

    // 4. Double Booking / Overlap Prevention
    const dayStart = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
    const dayEnd = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate(), 23, 59, 59, 999);

    const conflictingSessions = await Session.find({
      $or: [
        { organizer: userId },
        { partner: userId },
        { organizer: partner },
        { partner: partner }
      ],
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ['pending', 'accepted', 'scheduled'] }
    });

    for (const existing of conflictingSessions) {
      const exStart = parseTimeToMinutes(existing.startTime);
      const exEnd = parseTimeToMinutes(existing.endTime) || (exStart !== null ? exStart + (existing.duration || 60) : null);
      if (exStart !== null && exEnd !== null) {
        if (startMinutes < exEnd && endMinutes > exStart) {
          return res.status(400).json({
            message: 'This time slot is already booked. Please choose another time.'
          });
        }
      }
    }

    // 5. Create Session with status 'pending'
    const session = await Session.create({
      exchange: exchangeId || acceptedRequest?.exchangeId || activeExchange?._id,
      participants: [userId, partner],
      skill: skillId || undefined,
      skillName: skillName || 'Skill Exchange',
      organizer: userId,
      partner,
      date: sessionDate,
      startTime,
      endTime: calculatedEndTime,
      duration: durationNum,
      mode: mode || 'online',
      status: 'pending',
      learningObjective: learningObjective || '',
      notes: notes || '',
      location: location || '',
      meetingLink: meetingLink || ''
    });

    await ActivityLog.create({
      userId,
      action: 'session_booked',
      details: `Booked a ${mode} session for ${skillName || 'learning'} with ${partnerUser.fullName}`,
      metadata: { sessionId: session._id }
    });

    // 6. Notify Partner
    await notifySessionRequest(partner, req.user, session);

    res.status(201).json({
      message: 'Session requested successfully!',
      session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept session request
// @route   PUT /api/sessions/:id/accept
const acceptSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.partner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the requested partner can accept this session.' });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({ message: `Session cannot be accepted because it is currently ${session.status}.` });
    }

    session.status = 'accepted';
    await session.save();

    await notifySessionAccepted(session.organizer, req.user, session);

    await ActivityLog.create({
      userId: req.user._id,
      action: 'session_accepted',
      details: `Accepted session for ${session.skillName}`,
      metadata: { sessionId: session._id }
    });

    res.json({ message: 'Session accepted successfully!', session });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline session request
// @route   PUT /api/sessions/:id/decline
const declineSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.partner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the requested partner can decline this session.' });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({ message: `Session cannot be declined because it is currently ${session.status}.` });
    }

    session.status = 'declined';
    await session.save();

    await notifySessionDeclined(session.organizer, req.user, session);

    res.json({ message: 'Session declined', session });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sessions
// @route   GET /api/sessions
const getSessions = async (req, res, next) => {
  try {
    const { status, type = 'all' } = req.query;
    const userId = req.user._id;

    const filter = {
      $or: [
        { organizer: userId },
        { partner: userId }
      ]
    };

    if (status) {
      filter.status = status;
    } else if (type === 'upcoming') {
      filter.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
      filter.status = { $in: ['accepted', 'scheduled'] };
    } else if (type === 'pending') {
      filter.status = 'pending';
    } else if (type === 'confirmed') {
      filter.status = { $in: ['accepted', 'scheduled'] };
    } else if (type === 'completed') {
      filter.status = 'completed';
    } else if (type === 'cancelled') {
      filter.status = { $in: ['cancelled', 'declined'] };
    }

    const sessions = await Session.find(filter)
      .populate('organizer', 'fullName profileImage department year email')
      .populate('partner', 'fullName profileImage department year email')
      .populate('skill', 'name icon category')
      .sort({ date: (type === 'upcoming' || type === 'pending' || type === 'confirmed') ? 1 : -1 });

    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('organizer', 'fullName profileImage email department year')
      .populate('partner', 'fullName profileImage email department year')
      .populate('skill', 'name icon category');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session (reschedule / complete)
// @route   PUT /api/sessions/:id
const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isParticipant = session.participants.some(p => p.toString() === req.user._id.toString()) ||
      session.organizer.toString() === req.user._id.toString() ||
      session.partner.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { date, startTime, endTime, mode, status, feedback, notes } = req.body;

    if (date) session.date = new Date(date);
    if (startTime) session.startTime = startTime;
    if (endTime) session.endTime = endTime;
    if (mode) session.mode = mode;
    if (notes) session.notes = notes;
    if (feedback) session.feedback = feedback;

    if (status === 'completed' && session.status !== 'completed') {
      session.status = 'completed';

      if (session.exchange) {
        await SkillExchange.findByIdAndUpdate(session.exchange, { $inc: { sessionsCompleted: 1 } });
      }

      await User.findByIdAndUpdate(session.organizer, { $inc: { completedSessions: 1 } });
      await User.findByIdAndUpdate(session.partner, { $inc: { completedSessions: 1 } });

      if (session.skill) {
        const progressEntries = await Progress.find({
          exchangeId: session.exchange,
          skillId: session.skill
        });
        for (const progress of progressEntries) {
          progress.sessionsCompleted += 1;
          progress.overallProgress = Math.min(progress.overallProgress + 10, 100);
          progress.learningHistory.push({
            date: new Date(),
            activity: 'Session completed',
            duration: session.duration,
            notes: session.feedback || ''
          });
          await progress.save();
        }
      }

      await ActivityLog.create({
        userId: req.user._id,
        action: 'session_completed',
        details: `Completed session for ${session.skillName || 'learning'}`,
        metadata: { sessionId: session._id }
      });

      await checkAndUnlockAchievements(session.organizer);
      await checkAndUnlockAchievements(session.partner);
    } else if (status) {
      session.status = status;
    }

    await session.save();

    res.json({ message: 'Session updated', session });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel session
// @route   DELETE /api/sessions/:id
const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isParticipant = session.participants.some(p => p.toString() === req.user._id.toString()) ||
      session.organizer.toString() === req.user._id.toString() ||
      session.partner.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({ message: 'Session cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConnections,
  createSession,
  acceptSession,
  declineSession,
  getSessions,
  getSessionById,
  updateSession,
  cancelSession
};
