const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const Skill = require('../models/Skill');
const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');
const { checkAndUnlockAchievements } = require('../services/achievementService');

// Generate unique username helper
const generateUniqueUsername = async (userId, baseSeed) => {
  let cleanSeed = (baseSeed || 'student')
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '')
    .slice(0, 18);
  if (cleanSeed.length < 3) cleanSeed = `student_${cleanSeed}`;
  
  let candidate = cleanSeed;
  let exists = await User.findOne({ username: candidate, _id: { $ne: userId } });
  let counter = 1;

  while (exists) {
    const suffix = `${Math.floor(100 + Math.random() * 900)}`;
    candidate = `${cleanSeed.slice(0, 20)}_${suffix}`;
    exists = await User.findOne({ username: candidate, _id: { $ne: userId } });
    counter++;
    if (counter > 10) {
      candidate = `user_${Date.now().toString().slice(-6)}`;
      break;
    }
  }
  return candidate;
};

// @desc    Get current user profile
// @route   GET /api/users/me
const getMe = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure username is populated for existing accounts that don't have one
    if (!user.username) {
      const seed = user.email ? user.email.split('@')[0] : user.fullName;
      user.username = await generateUniqueUsername(user._id, seed);
      user.calculateProfileCompletion();
      await user.save();
    }

    const teachSkills = await UserSkill.find({ userId: req.user._id, type: 'teach' }).populate('skillId');
    const learnSkills = await UserSkill.find({ userId: req.user._id, type: 'learn' }).populate('skillId');
    const reviews = await Review.find({ reviewee: req.user._id })
      .populate('reviewer', 'fullName profileImage department')
      .sort({ createdAt: -1 });
    
    res.json({
      user,
      teachSkills,
      learnSkills,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Username update and uniqueness validation
    if (req.body.username !== undefined) {
      const rawUsername = String(req.body.username).trim().toLowerCase().replace(/^@/, '');
      if (rawUsername && rawUsername !== user.username) {
        const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
        if (!usernameRegex.test(rawUsername)) {
          return res.status(400).json({
            message: 'Username must be 3-30 characters and can only contain letters, numbers, underscores, dots, and hyphens.'
          });
        }

        const existing = await User.findOne({
          username: rawUsername,
          _id: { $ne: user._id }
        });

        if (existing) {
          return res.status(400).json({
            message: 'This username is already taken. Please choose another username.'
          });
        }

        user.username = rawUsername;
      }
    }

    // 2. Allowed scalar fields
    const allowedFields = [
      'fullName',
      'phone',
      'department',
      'year',
      'college',
      'location',
      'bio',
      'learningGoals',
      'availability',
      'linkedin',
      'github',
      'portfolio'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    // 3. Social links sync
    if (req.body.socialLinks && typeof req.body.socialLinks === 'object') {
      if (req.body.socialLinks.linkedin !== undefined) user.linkedin = req.body.socialLinks.linkedin;
      if (req.body.socialLinks.github !== undefined) user.github = req.body.socialLinks.github;
      if (req.body.socialLinks.portfolio !== undefined) user.portfolio = req.body.socialLinks.portfolio;
    }

    user.socialLinks = {
      linkedin: user.linkedin || '',
      github: user.github || '',
      portfolio: user.portfolio || ''
    };

    // 4. Interests (array or comma-separated string)
    if (req.body.interests !== undefined) {
      if (Array.isArray(req.body.interests)) {
        user.interests = req.body.interests.map(i => String(i).trim()).filter(Boolean);
      } else if (typeof req.body.interests === 'string') {
        user.interests = req.body.interests.split(',').map(i => i.trim()).filter(Boolean);
      }
    }

    // 5. Profile image upload
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    // 6. Recalculate genuine profile completion
    user.calculateProfileCompletion();
    await user.save();

    // 7. Activity Log & Achievements
    await ActivityLog.create({
      userId: user._id,
      action: 'profile_update',
      details: 'Profile updated'
    });

    await checkAndUnlockAchievements(user._id);

    // 8. Fetch updated skills to return complete payload
    const teachSkills = await UserSkill.find({ userId: user._id, type: 'teach' }).populate('skillId');
    const learnSkills = await UserSkill.find({ userId: user._id, type: 'learn' }).populate('skillId');

    res.json({
      message: 'Profile updated successfully',
      user,
      teachSkills,
      learnSkills
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username is already taken. Please choose another.' });
    }
    next(error);
  }
};

// @desc    Get user public profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const teachSkills = await UserSkill.find({ userId: user._id, type: 'teach' }).populate('skillId');
    const learnSkills = await UserSkill.find({ userId: user._id, type: 'learn' }).populate('skillId');
    const reviews = await Review.find({ reviewee: user._id })
      .populate('reviewer', 'fullName profileImage department')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const userObj = user.toJSON();

    // Respect student privacy settings by default
    if (!isOwner) {
      if (!user.privacySettings?.showEmail) {
        delete userObj.email;
      }
      if (!user.privacySettings?.showPhone) {
        delete userObj.phone;
      }
      if (!user.privacySettings?.showLocation) {
        delete userObj.location;
      }
      delete userObj.privacySettings;
      delete userObj.notificationPreferences;
    }

    res.json({ user: userObj, teachSkills, learnSkills, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search
const searchUsers = async (req, res, next) => {
  try {
    const { q, skill, department, availability, page = 1, limit = 12 } = req.query;
    const filter = { _id: { $ne: req.user._id }, isEmailVerified: true };
    
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { college: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }
    
    if (availability) {
      filter.availability = availability;
    }
    
    if (skill) {
      const skillUsers = await UserSkill.find({
        skillName: { $regex: skill, $options: 'i' }
      }).distinct('userId');
      filter._id = { $ne: req.user._id, $in: skillUsers };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(filter)
      .select('fullName username email phone department year college location bio profileImage rating completedExchanges availability isVerified privacySettings socialLinks linkedin github portfolio')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1 });
    
    const total = await User.countDocuments(filter);
    
    // Get skills for each user and apply privacy masking
    const usersWithSkills = await Promise.all(users.map(async (user) => {
      const teachSkills = await UserSkill.find({ userId: user._id, type: 'teach' }).select('skillName level');
      const learnSkills = await UserSkill.find({ userId: user._id, type: 'learn' }).select('skillName level');
      const userJson = user.toJSON();

      if (!user.privacySettings?.showEmail) {
        delete userJson.email;
      }
      if (!user.privacySettings?.showPhone) {
        delete userJson.phone;
      }
      if (!user.privacySettings?.showLocation) {
        delete userJson.location;
      }
      delete userJson.privacySettings;
      delete userJson.notificationPreferences;

      return {
        ...userJson,
        teachSkills,
        learnSkills
      };
    }));
    
    res.json({
      users: usersWithSkills,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, getUserProfile, searchUsers };
