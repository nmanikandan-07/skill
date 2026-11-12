const express = require('express');

const router = express.Router();


const {
  register,
  login,
  logout,
  forgotPassword,
  resendResetCode,
  verifyResetCode,
  resetPassword,
  verifyEmail,
  googleAuth,
  setPassword
} = require(
  '../controllers/authController'
);


const {
  registerValidation,
  loginValidation
} = require(
  '../middleware/validate'
);


const {
  protect
} = require(
  '../middleware/auth'
);


// Normal email registration
router.post(
  '/register',
  registerValidation,
  register
);


// Normal email/password login
router.post(
  '/login',
  loginValidation,
  login
);


// Verified Google login
router.post(
  '/google',
  googleAuth
);


// Create SkillSync password after Google login
router.post(
  '/set-password',
  protect,
  setPassword
);


// Logout
router.post(
  '/logout',
  protect,
  logout
);


// Forgot password routes
router.post(
  '/forgot-password',
  forgotPassword
);

router.post(
  '/resend-reset-code',
  resendResetCode
);

router.post(
  '/verify-reset-code',
  verifyResetCode
);

router.post(
  '/reset-password',
  resetPassword
);


// Email verification
router.post(
  '/verify-email',
  verifyEmail
);


module.exports = router;