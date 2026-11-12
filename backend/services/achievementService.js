const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const Session = require('../models/Session');
const SkillExchange = require('../models/SkillExchange');
const Review = require('../models/Review');
const UserSkill = require('../models/UserSkill');
const { notifyAchievement } = require('./notificationService');

const checkAndUnlockAchievements = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];
  
  const achievements = await Achievement.find();
  const existingAchievements = await UserAchievement.find({ userId }).select('achievementId');
  const existingIds = existingAchievements.map(a => a.achievementId.toString());
  
  const newlyUnlocked = [];
  
  for (const achievement of achievements) {
    // Skip if already unlocked
    if (existingIds.includes(achievement._id.toString())) continue;
    
    let conditionMet = false;
    const condType = achievement.condition?.type;
    const condValue = achievement.condition?.value || 1;
    
    switch (condType) {
      case 'sessions_completed': {
        const count = await Session.countDocuments({
          participants: userId,
          status: 'completed'
        });
        conditionMet = count >= condValue;
        break;
      }
      case 'exchanges_completed': {
        conditionMet = (user.completedExchanges || 0) >= condValue;
        break;
      }
      case 'skills_taught': {
        const count = await UserSkill.countDocuments({ userId, type: 'teach' });
        conditionMet = count >= condValue;
        break;
      }
      case 'skills_learned': {
        const count = await UserSkill.countDocuments({ userId, type: 'learn' });
        conditionMet = count >= condValue;
        break;
      }
      case 'reviews_given': {
        const count = await Review.countDocuments({ reviewer: userId });
        conditionMet = count >= condValue;
        break;
      }
      case 'rating_achieved': {
        conditionMet = (user.rating || 0) >= condValue;
        break;
      }
      case 'profile_completed': {
        conditionMet = (user.profileCompletion || 0) >= condValue;
        break;
      }
      case 'first_exchange': {
        conditionMet = (user.completedExchanges || 0) >= 1;
        break;
      }
    }
    
    if (conditionMet) {
      await UserAchievement.create({ userId, achievementId: achievement._id });
      newlyUnlocked.push(achievement);
      await notifyAchievement(userId, achievement);
    }
  }
  
  return newlyUnlocked;
};

module.exports = { checkAndUnlockAchievements };
