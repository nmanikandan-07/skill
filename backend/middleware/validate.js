const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Register validation
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  handleValidation
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidation
];

// Profile update validation
const profileValidation = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('username').optional({ checkFalsy: true }).trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, underscores, dots, and hyphens'),
  body('phone').optional({ checkFalsy: true }).trim()
    .matches(/^[+0-9\s\-()]{7,25}$/).withMessage('Please enter a valid phone number'),
  body('department').optional().trim(),
  body('year').optional().isIn(['', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post Graduate']).withMessage('Invalid year of study'),
  body('college').optional().trim(),
  body('location').optional().trim(),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('learningGoals').optional().trim().isLength({ max: 500 }).withMessage('Learning goals cannot exceed 500 characters'),
  body('linkedin').optional({ checkFalsy: true }).trim().isURL().withMessage('Please enter a valid LinkedIn URL'),
  body('github').optional({ checkFalsy: true }).trim().isURL().withMessage('Please enter a valid GitHub URL'),
  body('portfolio').optional({ checkFalsy: true }).trim().isURL().withMessage('Please enter a valid Portfolio URL'),
  body('availability').optional().isIn(['', 'Morning', 'Afternoon', 'Evening', 'Flexible', 'Weekends Only']),
  handleValidation
];

// Skill validation
const skillValidation = [
  body('skillId').notEmpty().withMessage('Skill is required'),
  body('type').isIn(['teach', 'learn']).withMessage('Type must be teach or learn'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  handleValidation
];

// Exchange request validation
const exchangeRequestValidation = [
  body('toUser').notEmpty().withMessage('Recipient is required'),
  body('teachSkill').custom((val, { req }) => {
    if (!val && !req.body.teachSkillId) {
      throw new Error('Teaching skill is required');
    }
    return true;
  }),
  body('learnSkill').custom((val, { req }) => {
    if (!val && !req.body.learnSkillId) {
      throw new Error('Learning skill is required');
    }
    return true;
  }),
  handleValidation
];

// Session validation
const sessionValidation = [
  body('partner').notEmpty().withMessage('Partner is required'),
  body('date').notEmpty().withMessage('Date is required').isISO8601(),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('mode').optional().isIn(['online', 'in-person', 'offline']).withMessage('Invalid session mode'),
  handleValidation
];

// Message validation
const messageValidation = [
  body('conversationId').optional(),
  body('recipientId').optional(),
  body('content').trim().notEmpty().withMessage('Message content is required'),
  handleValidation
];

// Review validation
const reviewValidation = [
  body('reviewee').notEmpty().withMessage('Reviewee is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim(),
  handleValidation
];

module.exports = {
  handleValidation,
  registerValidation,
  loginValidation,
  profileValidation,
  skillValidation,
  exchangeRequestValidation,
  sessionValidation,
  messageValidation,
  reviewValidation
};
