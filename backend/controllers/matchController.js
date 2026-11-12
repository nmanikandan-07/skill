const { getRecommendedMatches } = require('../services/matchingService');
const SavedProfile = require('../models/SavedProfile');
const UserSkill = require('../models/UserSkill');

// @desc    Get recommended matches
// @route   GET /api/matches
const getMatches = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const matches = await getRecommendedMatches(req.user._id, parseInt(limit));
    
    // Check which are saved
    const savedIds = await SavedProfile.find({ userId: req.user._id }).distinct('savedUserId');
    const savedSet = new Set(savedIds.map(id => id.toString()));
    
    const matchesWithSaved = matches.map(m => ({
      ...m,
      user: m.user.toJSON(),
      isSaved: savedSet.has(m.user._id.toString())
    }));
    
    res.json({ matches: matchesWithSaved });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a match
// @route   POST /api/matches/save/:id
const saveMatch = async (req, res, next) => {
  try {
    const existing = await SavedProfile.findOne({
      userId: req.user._id,
      savedUserId: req.params.id
    });
    
    if (existing) {
      await SavedProfile.findByIdAndDelete(existing._id);
      return res.json({ message: 'Match unsaved', saved: false });
    }
    
    await SavedProfile.create({
      userId: req.user._id,
      savedUserId: req.params.id
    });
    
    res.json({ message: 'Match saved', saved: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved matches
// @route   GET /api/matches/saved
const getSavedMatches = async (req, res, next) => {
  try {
    const saved = await SavedProfile.find({ userId: req.user._id })
      .populate('savedUserId', 'fullName email department year profileImage rating availability isVerified completedExchanges');
    
    const matchesWithSkills = await Promise.all(saved.map(async (s) => {
      const teachSkills = await UserSkill.find({ userId: s.savedUserId._id, type: 'teach' }).select('skillName level');
      const learnSkills = await UserSkill.find({ userId: s.savedUserId._id, type: 'learn' }).select('skillName level');
      return {
        user: { ...s.savedUserId.toJSON(), teachSkills, learnSkills },
        isSaved: true
      };
    }));
    
    res.json({ matches: matchesWithSkills });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMatches, saveMatch, getSavedMatches };
