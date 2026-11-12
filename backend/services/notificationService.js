const Notification = require('../models/Notification');

const createNotification = async (userId, type, title, message, data = {}, link = '') => {
  try {
    const notification = await Notification.create({
      userId, type, title, message, data, link
    });
    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
  }
};

const notifyNewMatch = async (userId, matchUser) => {
  return createNotification(
    userId,
    'match',
    'New Skill Match!',
    `${matchUser.fullName} is a great match for your skills!`,
    { matchUserId: matchUser._id },
    `/pages/public-profile.html?id=${matchUser._id}`
  );
};

const notifyNewRequest = async (userId, fromUser, skillName) => {
  return createNotification(
    userId,
    'request',
    'New Exchange Request',
    `${fromUser.fullName} wants to exchange ${skillName} with you`,
    { fromUserId: fromUser._id },
    '/pages/requests.html'
  );
};

const notifyRequestAccepted = async (userId, byUser) => {
  return createNotification(
    userId,
    'request_accepted',
    'Request Accepted!',
    `${byUser.fullName} accepted your exchange request`,
    { byUserId: byUser._id },
    '/pages/requests.html'
  );
};

const notifyRequestRejected = async (userId, byUser) => {
  return createNotification(
    userId,
    'request_rejected',
    'Request Declined',
    `${byUser.fullName} declined your exchange request`,
    { byUserId: byUser._id },
    '/pages/requests.html'
  );
};

const notifyNewMessage = async (userId, fromUser) => {
  return createNotification(
    userId,
    'message',
    'New Message',
    `${fromUser.fullName} sent you a message`,
    { fromUserId: fromUser._id },
    '/pages/messages.html'
  );
};

const notifySessionReminder = async (userId, session) => {
  return createNotification(
    userId,
    'session_reminder',
    'Session Reminder',
    `You have a session on ${session.skillName} coming up`,
    { sessionId: session._id },
    `/pages/sessions.html`
  );
};

const notifySessionRequest = async (userId, fromUser, session) => {
  return createNotification(
    userId,
    'session_booked',
    'New Session Request',
    `${fromUser.fullName} requested a ${session.skillName || 'learning'} session with you`,
    { sessionId: session._id },
    '/pages/sessions.html'
  );
};

const notifySessionAccepted = async (userId, byUser, session) => {
  return createNotification(
    userId,
    'session_booked',
    'Session Request Accepted!',
    `${byUser.fullName} accepted your ${session.skillName || 'learning'} session request`,
    { sessionId: session._id },
    '/pages/sessions.html'
  );
};

const notifySessionDeclined = async (userId, byUser, session) => {
  return createNotification(
    userId,
    'request_rejected',
    'Session Request Declined',
    `${byUser.fullName} declined your ${session.skillName || 'learning'} session request`,
    { sessionId: session._id },
    '/pages/sessions.html'
  );
};

const notifyAchievement = async (userId, achievement) => {
  return createNotification(
    userId,
    'achievement',
    'Achievement Unlocked! 🏆',
    `You earned the "${achievement.name}" achievement!`,
    { achievementId: achievement._id },
    '/pages/progress.html'
  );
};

module.exports = {
  createNotification,
  notifyNewMatch,
  notifyNewRequest,
  notifyRequestAccepted,
  notifyRequestRejected,
  notifyNewMessage,
  notifySessionReminder,
  notifySessionRequest,
  notifySessionAccepted,
  notifySessionDeclined,
  notifyAchievement
};
