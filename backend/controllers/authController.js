const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { generateToken } = require('../middleware/auth');
const crypto = require('crypto');
const { sendOtpEmail } = require('../config/mailer');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client();


// ======================================================
// HELPERS
// ======================================================

const normalizeEmail = (email = '') =>
  email.toString().trim().toLowerCase();


// ======================================================
// PASSWORD VALIDATION
//
// ONLY RULE:
// Minimum 8 characters.
//
// Any combination is allowed:
// - lowercase
// - uppercase
// - numbers
// - special characters
//
// None of them are individually compulsory.
// ======================================================

const isValidSkillSyncPassword = (password = '') => {
  return password.length >= 8;
};


// ======================================================
// PASSWORD RESET OTP
// ======================================================

const generatePasswordResetOtp = async (user) => {

  const otp =
    crypto
      .randomInt(100000, 1000000)
      .toString();


  user.passwordResetOtpHash =
    crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');


  user.passwordResetOtpExpiresAt =
    new Date(
      Date.now() +
      10 * 60 * 1000
    );


  user.passwordResetAttempts = 0;


  user.passwordResetToken =
    undefined;


  user.passwordResetTokenExpires =
    undefined;


  await user.save();


  return otp;
};


// ======================================================
// CLEAR PASSWORD RESET OTP
// ======================================================

const clearPasswordResetOtp =
  async (user) => {


    user.passwordResetOtpHash =
      undefined;


    user.passwordResetOtpExpiresAt =
      undefined;


    user.passwordResetAttempts = 0;


    await user.save();

  };


// ======================================================
// REGISTER
// POST /api/auth/register
// ======================================================

const register = async (
  req,
  res,
  next
) => {

  try {

    const {
      fullName,
      email,
      password
    } = req.body;


    const normalizedEmail =
      normalizeEmail(email);


    if (
      !fullName ||
      !normalizedEmail ||
      !password
    ) {

      return res.status(400).json({
        message:
          'Full name, email and password are required'
      });

    }


    // ==================================================
    // PASSWORD:
    // Minimum 8 characters only
    // ==================================================

    if (
      !isValidSkillSyncPassword(password)
    ) {

      return res.status(400).json({
        message:
          'Password must contain at least 8 characters.'
      });

    }


    const existingUser =
      await User.findOne({
        email:
          normalizedEmail
      });


    if (existingUser) {

      return res.status(400).json({
        message:
          'An account with this email already exists'
      });

    }


    let candidateUsername = `${normalizedEmail.split('@')[0].replace(/[^a-z0-9_.-]/g, '').slice(0, 18)}`;
    if (candidateUsername.length < 3) candidateUsername = `student_${candidateUsername}`;
    const usernameTaken = await User.findOne({ username: candidateUsername });
    if (usernameTaken) {
      candidateUsername = `${candidateUsername.slice(0, 16)}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const user =
      await User.create({

        fullName:
          fullName.trim(),

        username:
          candidateUsername,

        email:
          normalizedEmail,

        password,

        passwordSetupRequired:
          false,

        isEmailVerified:
          true,

        emailVerificationToken:
          crypto
            .randomBytes(32)
            .toString('hex')

      });


    if (
      typeof user.calculateProfileCompletion ===
      'function'
    ) {

      user.calculateProfileCompletion();

      await user.save();

    }


    await ActivityLog.create({

      userId:
        user._id,

      action:
        'register',

      details:
        'Account created'

    });


    const token =
      generateToken(user._id);


    return res.status(201).json({

      message:
        'Registration successful',

      token,

      user: {

        _id:
          user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        profileCompletion:
          user.profileCompletion,

        isEmailVerified:
          user.isEmailVerified

      }

    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// LOGIN
// POST /api/auth/login
// ======================================================

const login = async (
  req,
  res,
  next
) => {

  try {

    const {
      email,
      password
    } = req.body;


    const normalizedEmail =
      normalizeEmail(email);


    if (
      !normalizedEmail ||
      !password
    ) {

      return res.status(400).json({
        message:
          'Email and password are required'
      });

    }


    const user =
      await User
        .findOne({
          email:
            normalizedEmail
        })
        .select('+password');


    if (
      !user ||
      !user.password
    ) {

      return res.status(401).json({
        message:
          'Invalid email or password'
      });

    }


    const isMatch =
      await user.comparePassword(
        password
      );


    if (!isMatch) {

      return res.status(401).json({
        message:
          'Invalid email or password'
      });

    }


    user.lastLogin =
      new Date();


    user.isOnline =
      true;


    user.passwordSetupRequired =
      false;


    await user.save();


    await ActivityLog.create({

      userId:
        user._id,

      action:
        'login',

      details:
        'User logged in'

    });


    const token =
      generateToken(user._id);


    return res.json({

      message:
        'Login successful',

      token,

      user: {

        _id:
          user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        profileImage:
          user.profileImage,

        profileCompletion:
          user.profileCompletion,

        department:
          user.department,

        year:
          user.year

      }

    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// LOGOUT
// POST /api/auth/logout
// ======================================================

const logout = async (
  req,
  res,
  next
) => {

  try {

    await User.findByIdAndUpdate(
      req.user._id,
      {
        isOnline:
          false
      }
    );


    return res.json({
      message:
        'Logged out successfully'
    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ======================================================

const forgotPassword = async (
  req,
  res,
  next
) => {

  try {

    const normalizedEmail =
      normalizeEmail(
        req.body.email
      );


    if (!normalizedEmail) {

      return res.status(400).json({

        success:
          false,

        message:
          'Email address is required.'

      });

    }


    const user =
      await User.findOne({
        email:
          normalizedEmail
      });


    if (!user) {

      return res.status(200).json({

        success:
          true,

        message:
          'If an account exists for this email, a verification code has been sent.'

      });

    }


    const otp =
      await generatePasswordResetOtp(
        user
      );


    try {

      await sendOtpEmail({

        to:
          user.email,

        fullName:
          user.fullName ||
          user.name ||
          'Student',

        otp

      });


      console.log(
        `[Password Reset] Verification email accepted for ${user.email}`
      );


      return res.status(200).json({

        success:
          true,

        message:
          'If an account exists for this email, a verification code has been sent.'

      });


    } catch (mailError) {

      console.error(
        '[Password Reset] Email delivery failed:',
        mailError.message
      );


      await clearPasswordResetOtp(
        user
      );


      return res.status(500).json({

        success:
          false,

        message:
          'Unable to send verification email. Please try again.'

      });

    }


  } catch (error) {

    next(error);

  }

};


// ======================================================
// RESEND PASSWORD RESET OTP
// POST /api/auth/resend-reset-code
// ======================================================

const resendResetCode = async (
  req,
  res,
  next
) => {

  try {

    const normalizedEmail =
      normalizeEmail(
        req.body.email
      );


    if (!normalizedEmail) {

      return res.status(400).json({

        success:
          false,

        message:
          'Email address is required.'

      });

    }


    const user =
      await User.findOne({
        email:
          normalizedEmail
      });


    if (!user) {

      return res.status(200).json({

        success:
          true,

        message:
          'If an account exists for this email, a new verification code has been sent.'

      });

    }


    const otp =
      await generatePasswordResetOtp(
        user
      );


    try {

      await sendOtpEmail({

        to:
          user.email,

        fullName:
          user.fullName ||
          user.name ||
          'Student',

        otp

      });


      console.log(
        `[Password Reset] New verification email accepted for ${user.email}`
      );


      return res.status(200).json({

        success:
          true,

        message:
          'New verification code sent to your registered email.'

      });


    } catch (mailError) {

      console.error(
        '[Password Reset] Resend email failed:',
        mailError.message
      );


      await clearPasswordResetOtp(
        user
      );


      return res.status(500).json({

        success:
          false,

        message:
          'Unable to send verification email. Please try again.'

      });

    }


  } catch (error) {

    next(error);

  }

};


// ======================================================
// VERIFY RESET OTP
// POST /api/auth/verify-reset-code
// ======================================================

const verifyResetCode = async (
  req,
  res,
  next
) => {

  try {

    const {
      email,
      otp,
      code
    } = req.body;


    const normalizedEmail =
      normalizeEmail(email);


    const submittedOtp =
      (otp || code || '')
        .toString()
        .trim();


    if (
      !normalizedEmail ||
      !submittedOtp
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          'Email and 6-digit verification code are required.'

      });

    }


    if (
      !/^\d{6}$/.test(
        submittedOtp
      )
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          'Invalid verification code. Please enter exactly 6 digits.'

      });

    }


    const user =
      await User.findOne({
        email:
          normalizedEmail
      });


    if (!user) {

      return res.status(400).json({

        success:
          false,

        message:
          'Invalid or expired verification code.'

      });

    }


    if (
      (user.passwordResetAttempts || 0) >=
      5
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          'Maximum verification attempts exceeded. Please request a new code.'

      });

    }


    if (
      !user.passwordResetOtpHash ||
      !user.passwordResetOtpExpiresAt
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          'No active verification code. Please request a new code.'

      });

    }


    if (
      new Date(
        user.passwordResetOtpExpiresAt
      ).getTime() <= Date.now()
    ) {

      await clearPasswordResetOtp(
        user
      );


      return res.status(400).json({

        success:
          false,

        message:
          'Verification code has expired. Please request a new code.'

      });

    }


    const submittedHash =
      crypto
        .createHash('sha256')
        .update(submittedOtp)
        .digest('hex');


    const storedBuffer =
      Buffer.from(
        user.passwordResetOtpHash,
        'hex'
      );


    const submittedBuffer =
      Buffer.from(
        submittedHash,
        'hex'
      );


    const otpMatches =
      storedBuffer.length ===
      submittedBuffer.length &&
      crypto.timingSafeEqual(
        storedBuffer,
        submittedBuffer
      );


    if (!otpMatches) {

      user.passwordResetAttempts =
        (user.passwordResetAttempts || 0) +
        1;


      await user.save();


      return res.status(400).json({

        success:
          false,

        message:
          'Invalid verification code. Please try again.'

      });

    }


    const resetToken =
      crypto
        .randomBytes(32)
        .toString('hex');


    user.passwordResetToken =
      crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');


    user.passwordResetTokenExpires =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );


    user.passwordResetOtpHash =
      undefined;


    user.passwordResetOtpExpiresAt =
      undefined;


    user.passwordResetAttempts = 0;


    await user.save();


    return res.status(200).json({

      success:
        true,

      message:
        'Verification successful.',

      resetToken

    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ======================================================

const resetPassword = async (
  req,
  res,
  next
) => {

  try {

    const {
      resetToken,
      token,
      newPassword,
      confirmPassword,
      password
    } = req.body;


    const submittedToken =
      resetToken ||
      token;


    const finalPassword =
      newPassword ||
      password;


    const finalConfirm =
      confirmPassword ||
      finalPassword;


    if (!submittedToken) {

      return res.status(400).json({

        success:
          false,

        message:
          'Reset token is required. Please verify your email first.'

      });

    }


    if (!finalPassword) {

      return res.status(400).json({

        success:
          false,

        message:
          'New password is required.'

      });

    }


    if (
      finalPassword !==
      finalConfirm
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          'Passwords do not match.'

      });

    }


    // ==================================================
    // PASSWORD VALIDATION
    // Minimum 8 characters only
    // ==================================================

    if (
      !isValidSkillSyncPassword(
        finalPassword
      )
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          'Password must contain at least 8 characters.'

      });

    }


    const hashedSubmittedToken =
      crypto
        .createHash('sha256')
        .update(submittedToken)
        .digest('hex');


    const user =
      await User.findOne({

        passwordResetToken:
          hashedSubmittedToken,

        passwordResetTokenExpires: {
          $gt:
            new Date()
        }

      });


    if (!user) {

      return res.status(400).json({

        success:
          false,

        message:
          'Invalid or expired reset session. Please request a new verification code.'

      });

    }


    user.password =
      finalPassword;


    user.passwordSetupRequired =
      false;


    user.passwordResetToken =
      undefined;


    user.passwordResetTokenExpires =
      undefined;


    user.passwordResetOtpHash =
      undefined;


    user.passwordResetOtpExpiresAt =
      undefined;


    user.passwordResetAttempts = 0;


    await user.save();


    await ActivityLog.create({

      userId:
        user._id,

      action:
        'password_reset',

      details:
        'Password was updated securely'

    });


    return res.status(200).json({

      success:
        true,

      message:
        'Password updated successfully.'

    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// VERIFY EMAIL
// POST /api/auth/verify-email
// ======================================================

const verifyEmail = async (
  req,
  res,
  next
) => {

  try {

    const {
      token
    } = req.body;


    const user =
      await User.findOne({

        emailVerificationToken:
          token

      });


    if (!user) {

      return res.status(400).json({

        message:
          'Invalid verification token'

      });

    }


    user.isEmailVerified =
      true;


    user.emailVerificationToken =
      undefined;


    await user.save();


    return res.json({

      message:
        'Email verified successfully'

    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// GOOGLE AUTH
// POST /api/auth/google
// ======================================================

const googleAuth = async (
  req,
  res,
  next
) => {

  try {

    const {
      credential
    } = req.body;


    if (!credential) {

      return res.status(400).json({

        message:
          'Google credential is required'

      });

    }


    if (
      !process.env.GOOGLE_CLIENT_ID
    ) {

      console.error(
        'GOOGLE_CLIENT_ID is missing from .env'
      );


      return res.status(500).json({

        message:
          'Google login is not configured on the server'

      });

    }


    let payload;


    try {

      const ticket =
        await googleClient.verifyIdToken({

          idToken:
            credential,

          audience:
            process.env.GOOGLE_CLIENT_ID

        });


      payload =
        ticket.getPayload();


    } catch (verificationError) {

      console.error(
        'Google token verification failed:',
        verificationError.message
      );


      return res.status(401).json({

        message:
          'Invalid or expired Google login'

      });

    }


    const googleId =
      payload &&
      payload.sub;


    const normalizedEmail =
      normalizeEmail(
        payload &&
        payload.email
      );


    const emailVerified =
      payload &&
      payload.email_verified === true;


    if (
      !googleId ||
      !normalizedEmail ||
      !emailVerified
    ) {

      return res.status(401).json({

        message:
          'Google account could not be verified'

      });

    }


    let user =
      await User
        .findOne({
          googleId
        })
        .select('+password');


    let isNewUser =
      false;


    if (
      user &&
      user.email !== normalizedEmail
    ) {

      const emailOwner =
        await User.findOne({

          email:
            normalizedEmail,

          _id: {
            $ne:
              user._id
          }

        });


      if (emailOwner) {

        return res.status(409).json({

          message:
            'This Google email is already linked to another account'

        });

      }


      user.email =
        normalizedEmail;

    }


    if (!user) {

      user =
        await User
          .findOne({
            email:
              normalizedEmail
          })
          .select('+password');


      if (user) {

        const savedGoogleId =
          (user.googleId || '')
            .trim();


        const oldFakeGoogleId =
          savedGoogleId.startsWith(
            'google_'
          );


        if (
          savedGoogleId &&
          savedGoogleId !== googleId &&
          !oldFakeGoogleId
        ) {

          return res.status(409).json({

            message:
              'This email is linked to a different Google account'

          });

        }


        const authoritativeEmail =
          normalizedEmail.endsWith(
            '@gmail.com'
          ) ||
          Boolean(payload.hd);


        if (
          !savedGoogleId &&
          !authoritativeEmail
        ) {

          return res.status(409).json({

            message:
              'An account already exists with this email. Sign in with your password before linking Google.'

          });

        }


        const legacyGoogleAccount =
          await ActivityLog.exists({

            userId:
              user._id,

            action:
              'register',

            details:
              'Account created via Google'

          });


        if (legacyGoogleAccount) {

          user.password =
            undefined;


          user.passwordSetupRequired =
            true;


        } else if (!user.password) {

          user.passwordSetupRequired =
            true;

        }


        user.googleId =
          googleId;


      } else {

        user = new User({

          fullName:
            (payload.name || '').trim() ||
            normalizedEmail.split('@')[0],

          email:
            normalizedEmail,

          googleId,

          profileImage:
            payload.picture || '',

          isEmailVerified:
            true,

          passwordSetupRequired:
            true

        });


        isNewUser =
          true;

      }

    }


    if (!user.password) {

      user.passwordSetupRequired =
        true;

    }


    if (
      !user.fullName &&
      payload.name
    ) {

      user.fullName =
        payload.name.trim();

    }


    if (
      !user.profileImage &&
      payload.picture
    ) {

      user.profileImage =
        payload.picture;

    }


    user.isEmailVerified =
      true;


    user.lastLogin =
      new Date();


    user.isOnline =
      true;


    if (
      typeof user.calculateProfileCompletion ===
      'function'
    ) {

      user.calculateProfileCompletion();

    }


    const needsPasswordSetup =
      Boolean(
        user.passwordSetupRequired ||
        !user.password
      );


    await user.save();


    await ActivityLog.create({

      userId:
        user._id,

      action:
        isNewUser
          ? 'register'
          : 'login',

      details:
        isNewUser
          ? 'Account created via verified Google login'
          : 'User signed in via verified Google login'

    });


    const token =
      generateToken(user._id);


    return res
      .status(
        isNewUser
          ? 201
          : 200
      )
      .json({

        message:
          'Google authentication successful',

        token,

        needsPasswordSetup,

        user: {

          _id:
            user._id,

          fullName:
            user.fullName,

          email:
            user.email,

          profileImage:
            user.profileImage,

          profileCompletion:
            user.profileCompletion,

          department:
            user.department,

          year:
            user.year,

          isEmailVerified:
            user.isEmailVerified

        }

      });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// SET SKILLSYNC PASSWORD AFTER GOOGLE LOGIN
// POST /api/auth/set-password
// ======================================================

const setPassword = async (
  req,
  res,
  next
) => {

  try {

    const {
      password,
      confirmPassword
    } = req.body;


    if (
      !password ||
      !confirmPassword
    ) {

      return res.status(400).json({

        message:
          'Password and confirm password are required'

      });

    }


    if (
      password !==
      confirmPassword
    ) {

      return res.status(400).json({

        message:
          'Passwords do not match'

      });

    }


    // ==================================================
    // PASSWORD VALIDATION
    //
    // ONLY RULE:
    // Minimum 8 characters
    //
    // Example valid:
    // abcdefgh
    // 12345678
    // mani7777
    // mani&7777
    // ABCDEFGH
    // ==================================================

    if (
      !isValidSkillSyncPassword(
        password
      )
    ) {

      return res.status(400).json({

        message:
          'Password must contain at least 8 characters.'

      });

    }


    const user =
      await User
        .findById(
          req.user._id
        )
        .select('+password');


    if (!user) {

      return res.status(404).json({

        message:
          'User account not found'

      });

    }


    if (
      user.password &&
      !user.passwordSetupRequired
    ) {

      return res.status(400).json({

        message:
          'A SkillSync password is already configured for this account'

      });

    }


    user.password =
      password;


    user.passwordSetupRequired =
      false;


    await user.save();


    await ActivityLog.create({

      userId:
        user._id,

      action:
        'password_reset',

      details:
        'SkillSync password created after Google login'

    });


    return res.status(200).json({

      message:
        'SkillSync password created successfully',

      user: {

        _id:
          user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        passwordSetupRequired:
          false

      }

    });


  } catch (error) {

    next(error);

  }

};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
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
};
