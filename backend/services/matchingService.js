const UserSkill = require('../models/UserSkill');
const User = require('../models/User');
const Review = require('../models/Review');
const SkillExchange = require('../models/SkillExchange');

/**
 * Smart Matching Algorithm
 * 
 * Weighted factors:
 * - Teach/Learn Compatibility: 40%
 * - Skill Level: 15%
 * - Availability: 15%
 * - Rating: 10%
 * - Department/Interests: 5%
 * - Completed Exchanges: 5%
 * - Profile Completion: 5%
 * - Verification: 5%
 */

const calculateMatchScore = async (currentUser, candidateUser) => {
  let score = 0;
  
  // Get skills for both users
  const currentTeachSkills = await UserSkill.find({ userId: currentUser._id, type: 'teach' });
  const currentLearnSkills = await UserSkill.find({ userId: currentUser._id, type: 'learn' });
  const candidateTeachSkills = await UserSkill.find({ userId: candidateUser._id, type: 'teach' });
  const candidateLearnSkills = await UserSkill.find({ userId: candidateUser._id, type: 'learn' });
  
  // 1. Teach/Learn Compatibility (40%)
  let compatibilityScore = 0;
  let matchedSkills = { canTeach: [], canLearn: [] };
  
  // Check if candidate teaches what current wants to learn
  for (const learn of currentLearnSkills) {
    const match = candidateTeachSkills.find(t => 
      t.skillId.toString() === learn.skillId.toString()
    );
    if (match) {
      compatibilityScore += 20;
      matchedSkills.canTeach.push(match.skillName);
    }
  }
  
  // Check if current teaches what candidate wants to learn (mutual exchange)
  for (const teach of currentTeachSkills) {
    const match = candidateLearnSkills.find(l => 
      l.skillId.toString() === teach.skillId.toString()
    );
    if (match) {
      compatibilityScore += 20;
      matchedSkills.canLearn.push(teach.skillName);
    }
  }
  
  score += Math.min(compatibilityScore, 40);
  
  // 2. Skill Level Complementarity (15%)
  let levelScore = 0;
  const levelValues = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
  
  for (const teach of candidateTeachSkills) {
    const matchingLearn = currentLearnSkills.find(l => 
      l.skillId.toString() === teach.skillId.toString()
    );
    if (matchingLearn) {
      const teachLevel = levelValues[teach.level] || 1;
      const learnLevel = levelValues[matchingLearn.level] || 1;
      if (teachLevel > learnLevel) {
        levelScore += 7.5;
      } else if (teachLevel === learnLevel) {
        levelScore += 3;
      }
    }
  }
  score += Math.min(levelScore, 15);
  
  // 3. Availability Match (15%)
  if (currentUser.availability && candidateUser.availability) {
    if (currentUser.availability === candidateUser.availability) {
      score += 15;
    } else if (currentUser.availability === 'Flexible' || candidateUser.availability === 'Flexible') {
      score += 12;
    } else {
      score += 5;
    }
  } else if (currentUser.availability || candidateUser.availability) {
    score += 7;
  }
  
  // 4. Rating (10%)
  if (candidateUser.rating > 0) {
    score += (candidateUser.rating / 5) * 10;
  } else {
    score += 5; // Neutral for unrated
  }
  
  // 5. Department/Interests (5%)
  let interestScore = 0;
  if (currentUser.department && candidateUser.department && 
      currentUser.department === candidateUser.department) {
    interestScore += 2.5;
  }
  if (currentUser.interests && candidateUser.interests) {
    const commonInterests = currentUser.interests.filter(i => 
      candidateUser.interests.includes(i)
    );
    interestScore += Math.min(commonInterests.length * 1, 2.5);
  }
  score += Math.min(interestScore, 5);
  
  // 6. Completed Exchanges (5%)
  score += Math.min((candidateUser.completedExchanges || 0) * 0.5, 5);
  
  // 7. Profile Completion (5%)
  score += ((candidateUser.profileCompletion || 0) / 100) * 5;
  
  // 8. Verification (5%)
  if (candidateUser.isVerified) {
    score += 3;
  }
  const verifiedSkills = candidateTeachSkills.filter(s => s.isVerified).length;
  score += Math.min(verifiedSkills * 1, 2);
  
  return {
    score: Math.round(Math.min(score, 100)),
    matchedSkills
  };
};

const getRecommendedMatches = async (userId, limit = 20) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) return [];
  
  const currentTeachSkills = await UserSkill.find({ userId, type: 'teach' });
  const currentLearnSkills = await UserSkill.find({ userId, type: 'learn' });
  
  if (currentTeachSkills.length === 0 && currentLearnSkills.length === 0) {
    return [];
  }
  
  // Find potential matches: users who teach what current wants to learn
  // or want to learn what current can teach
  const teachSkillIds = currentTeachSkills.map(s => s.skillId);
  const learnSkillIds = currentLearnSkills.map(s => s.skillId);
  
  const potentialMatchSkills = await UserSkill.find({
    userId: { $ne: userId },
    $or: [
      { skillId: { $in: learnSkillIds }, type: 'teach' },
      { skillId: { $in: teachSkillIds }, type: 'learn' }
    ]
  }).distinct('userId');
  
  const candidates = await User.find({
    _id: { $in: potentialMatchSkills },
    isEmailVerified: true
  });
  
  // Calculate match scores
  const matches = [];
  for (const candidate of candidates) {
    const { score, matchedSkills } = await calculateMatchScore(currentUser, candidate);
    if (score > 0) {
      matches.push({
        user: candidate,
        matchPercentage: score,
        matchedSkills
      });
    }
  }
  
  // Sort by match percentage descending
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
  return matches.slice(0, limit);
};

module.exports = { calculateMatchScore, getRecommendedMatches };
