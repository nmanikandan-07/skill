const UserSkill = require('../models/UserSkill');
const Skill = require('../models/Skill');
const ActivityLog = require('../models/ActivityLog');
const { checkAndUnlockAchievements } = require('../services/achievementService');

// @desc    Add a skill (teach or learn)
// @route   POST /api/user-skills
const addUserSkill = async (req, res, next) => {
  try {
    const { skillId, type, level, description } = req.body;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Check if already added
    const existing = await UserSkill.findOne({
      userId: req.user._id,
      skillId,
      type
    });
    
    if (existing) {
      return res.status(400).json({ message: 'You have already added this skill.' });
    }
    
    const userSkill = await UserSkill.create({
      userId: req.user._id,
      skillId,
      skillName: skill.name,
      type,
      level: level || 'Beginner',
      description
    });
    
    // Update skill learner count
    if (type === 'learn') {
      await Skill.findByIdAndUpdate(skillId, { $inc: { learnerCount: 1 } });
    }
    
    await ActivityLog.create({
      userId: req.user._id,
      action: 'skill_added',
      details: `Added ${skill.name} to ${type} skills`,
      metadata: { skillId, skillName: skill.name, type }
    });
    
    await checkAndUnlockAchievements(req.user._id);
    
    res.status(201).json({ message: 'Skill added successfully', userSkill });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already added this skill.' });
    }
    next(error);
  }
};

// @desc    Update a user skill
// @route   PUT /api/user-skills/:id
const updateUserSkill = async (req, res, next) => {
  try {
    const { level, description } = req.body;
    
    const userSkill = await UserSkill.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!userSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (level) userSkill.level = level;
    if (description !== undefined) userSkill.description = description;
    await userSkill.save();
    
    res.json({ message: 'Skill updated', userSkill });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a user skill
// @route   DELETE /api/user-skills/:id
const removeUserSkill = async (req, res, next) => {
  try {
    const userSkill = await UserSkill.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!userSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (userSkill.type === 'learn') {
      await Skill.findByIdAndUpdate(userSkill.skillId, { $inc: { learnerCount: -1 } });
    }
    
    await ActivityLog.create({
      userId: req.user._id,
      action: 'skill_removed',
      details: `Removed ${userSkill.skillName} from ${userSkill.type} skills`
    });
    
    await UserSkill.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my skills
// @route   GET /api/user-skills
const getMySkills = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    
    const skills = await UserSkill.find(filter).populate('skillId');
    res.json({ skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Add multiple skills with individual proficiency (teach or learn)
// @route   POST /api/user-skills/bulk
const addBulkUserSkills = async (req, res, next) => {
  try {
    const { type, skills } = req.body;

    if (!type || !['teach', 'learn'].includes(type)) {
      return res.status(400).json({ message: 'Skill type must be either teach or learn' });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: 'At least one skill must be selected' });
    }

    const userId = req.user._id;

    // Fetch existing skills for this user and type to detect duplicates
    const existingUserSkills = await UserSkill.find({ userId, type }).select('skillId skillName');
    const existingSkillIdSet = new Set(existingUserSkills.map(s => s.skillId.toString()));
    const existingNameSet = new Set(existingUserSkills.map(s => s.skillName.toLowerCase()));

    const added = [];
    const skipped = [];
    const addedSkills = [];
    const addedSkillIdsToIncrement = [];

    // Deduplicate input skills array
    const seenInputIds = new Set();
    const uniqueInputs = [];
    for (const item of skills) {
      const sId = item.skillId || item._id;
      if (!sId) continue;
      if (!seenInputIds.has(sId.toString())) {
        seenInputIds.add(sId.toString());
        uniqueInputs.push(item);
      }
    }

    for (const item of uniqueInputs) {
      const skillId = item.skillId || item._id;
      const rawLevel = item.level || item.proficiencyLevel || 'Beginner';
      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      const matchedLevel = validLevels.find(l => l.toLowerCase() === String(rawLevel).toLowerCase()) || 'Beginner';

      const skillDoc = await Skill.findById(skillId);
      if (!skillDoc) {
        skipped.push({
          skill: item.skillName || 'Unknown skill',
          reason: 'Skill not found in catalogue'
        });
        continue;
      }

      if (existingSkillIdSet.has(skillDoc._id.toString()) || existingNameSet.has(skillDoc.name.toLowerCase())) {
        skipped.push({
          skill: skillDoc.name,
          reason: `${skillDoc.name} is already in your ${type === 'teach' ? 'teaching' : 'learning'} skills.`
        });
        continue;
      }

      try {
        const userSkill = await UserSkill.create({
          userId,
          skillId: skillDoc._id,
          skillName: skillDoc.name,
          type,
          level: matchedLevel,
          description: item.description || ''
        });

        added.push(skillDoc.name);
        addedSkills.push(userSkill);
        if (type === 'learn') {
          addedSkillIdsToIncrement.push(skillDoc._id);
        }

        existingSkillIdSet.add(skillDoc._id.toString());
        existingNameSet.add(skillDoc.name.toLowerCase());
      } catch (err) {
        if (err.code === 11000) {
          skipped.push({
            skill: skillDoc.name,
            reason: `${skillDoc.name} is already in your ${type === 'teach' ? 'teaching' : 'learning'} skills.`
          });
        } else {
          throw err;
        }
      }
    }

    if (addedSkillIdsToIncrement.length > 0) {
      await Skill.updateMany(
        { _id: { $in: addedSkillIdsToIncrement } },
        { $inc: { learnerCount: 1 } }
      );
    }

    if (added.length > 0) {
      await ActivityLog.create({
        userId,
        action: 'skills_bulk_added',
        details: `Added ${added.length} skill(s) to ${type} skills`,
        metadata: { type, addedCount: added.length, skills: added }
      });

      await checkAndUnlockAchievements(userId);
    }

    return res.status(201).json({
      success: true,
      message: added.length > 0
        ? `Added ${added.length} skill(s) successfully.`
        : 'No new skills were added.',
      added,
      skipped,
      addedSkills
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addUserSkill, addBulkUserSkills, updateUserSkill, removeUserSkill, getMySkills };
