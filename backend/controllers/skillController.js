const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get all skills
// @route   GET /api/skills
const getSkills = async (req, res, next) => {
  try {
    const { category, subcategory, search, page, limit } = req.query;
    const filter = { isActive: { $ne: false } };
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    if (subcategory && subcategory !== 'All') {
      filter.subcategory = subcategory;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { aliases: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    let query = Skill.find(filter)
      .select('_id name category subcategory description icon iconType iconKey aliases keywords difficulty learnerCount isActive')
      .sort({ name: 1 });
    
    const total = await Skill.countDocuments(filter);
    let currentPage = 1;
    let totalPages = 1;
    
    if (limit) {
      const parsedLimit = parseInt(limit);
      currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * parsedLimit;
      query = query.skip(skip).limit(parsedLimit);
      totalPages = Math.ceil(total / parsedLimit);
    }
    
    const skills = await query;
    
    res.json({
      success: true,
      skills,
      total,
      page: currentPage,
      pages: totalPages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill details
// @route   GET /api/skills/:id
const getSkillDetails = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Get mentors (users who teach this skill)
    const mentors = await UserSkill.find({ skillId: skill._id, type: 'teach' })
      .populate('userId', 'fullName profileImage department rating completedExchanges isVerified')
      .limit(10);
    
    // Get learner count
    const learnerCount = await UserSkill.countDocuments({ skillId: skill._id, type: 'learn' });
    const teacherCount = await UserSkill.countDocuments({ skillId: skill._id, type: 'teach' });
    
    res.json({
      skill,
      mentors: mentors.map(m => ({
        ...m.userId?.toJSON(),
        level: m.level,
        isVerified: m.isVerified
      })).filter(m => m._id),
      learnerCount,
      teacherCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkills, getSkillDetails };
