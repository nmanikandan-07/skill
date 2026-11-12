const Progress = require('../models/Progress');
const UserAchievement = require('../models/UserAchievement');

// @desc    Get all progress for current user
// @route   GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .populate('skillId', 'name icon category')
      .populate('partner', 'fullName profileImage')
      .sort({ updatedAt: -1 });
    
    const achievements = await UserAchievement.find({ userId: req.user._id })
      .populate('achievementId');
    
    res.json({ progress, achievements });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress
// @route   PUT /api/progress/:id
const updateProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    const { overallProgress, currentLevel, goal, milestones } = req.body;
    
    if (overallProgress !== undefined) progress.overallProgress = overallProgress;
    if (currentLevel) progress.currentLevel = currentLevel;
    if (goal) progress.goal = goal;
    if (milestones) progress.milestones = milestones;
    
    await progress.save();
    
    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress, updateProgress };
