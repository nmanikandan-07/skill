const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [
        true,
        'Full name is required'
      ],
      trim: true,
      minlength: 2,
      maxlength: 100
    },


    email: {
      type: String,
      required: [
        true,
        'Email is required'
      ],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email'
      ]
    },


    /*
      Local SkillSync password.

      Google-only users initially will not
      have this field.
    */
    password: {
      type: String,
      required: false,
      select: false
    },


    /*
      True means a Google user must create
      a separate SkillSync password.
    */
    passwordSetupRequired: {
      type: Boolean,
      default: false
    },


    /*
      Real Google Account ID from the verified
      Google ID token "sub" field.
    */
    googleId: {
      type: String,
      trim: true,
      default: undefined
    },


    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_.-]+$/,
        'Username can only contain letters, numbers, underscores, dots, and hyphens'
      ]
    },


    phone: {
      type: String,
      trim: true,
      default: ''
    },


    department: {
      type: String,
      trim: true,
      default: ''
    },


    year: {
      type: String,
      enum: [
        '',
        '1st Year',
        '2nd Year',
        '3rd Year',
        '4th Year',
        'Graduate',
        'Post Graduate'
      ],
      default: ''
    },


    college: {
      type: String,
      trim: true,
      default: ''
    },


    location: {
      type: String,
      trim: true,
      default: ''
    },


    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },


    learningGoals: {
      type: String,
      maxlength: 500,
      default: ''
    },


    linkedin: {
      type: String,
      trim: true,
      default: ''
    },


    github: {
      type: String,
      trim: true,
      default: ''
    },


    portfolio: {
      type: String,
      trim: true,
      default: ''
    },


    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
        default: ''
      },
      github: {
        type: String,
        trim: true,
        default: ''
      },
      portfolio: {
        type: String,
        trim: true,
        default: ''
      }
    },


    interests: [
      {
        type: String,
        trim: true
      }
    ],


    availability: {
      type: String,
      enum: [
        '',
        'Morning',
        'Afternoon',
        'Evening',
        'Flexible',
        'Weekends Only'
      ],
      default: ''
    },


    profileImage: {
      type: String,
      default: ''
    },


    isVerified: {
      type: Boolean,
      default: false
    },


    isEmailVerified: {
      type: Boolean,
      default: false
    },


    emailVerificationToken: {
      type: String
    },


    passwordResetToken: {
      type: String
    },


    passwordResetTokenExpires: {
      type: Date
    },


    passwordResetOtpHash: {
      type: String
    },


    passwordResetOtpExpiresAt: {
      type: Date
    },


    passwordResetAttempts: {
      type: Number,
      default: 0
    },


    profileCompletion: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    },


    role: {
      type: String,
      enum: [
        'student',
        'admin'
      ],
      default: 'student'
    },


    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },


    totalRatings: {
      type: Number,
      default: 0
    },


    completedExchanges: {
      type: Number,
      default: 0
    },


    completedSessions: {
      type: Number,
      default: 0
    },


    privacySettings: {
      profileVisibility: {
        type: String,
        enum: [
          'public',
          'students-only',
          'private'
        ],
        default: 'public'
      },

      showEmail: {
        type: Boolean,
        default: false
      },

      showPhone: {
        type: Boolean,
        default: false
      },

      showLocation: {
        type: Boolean,
        default: true
      }
    },


    notificationPreferences: {
      newMatch: {
        type: Boolean,
        default: true
      },

      newRequest: {
        type: Boolean,
        default: true
      },

      requestUpdate: {
        type: Boolean,
        default: true
      },

      newMessage: {
        type: Boolean,
        default: true
      },

      sessionReminder: {
        type: Boolean,
        default: true
      },

      achievements: {
        type: Boolean,
        default: true
      }
    },


    lastLogin: {
      type: Date
    },


    isOnline: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


// ======================================================
// HASH PASSWORD BEFORE SAVE
// ======================================================

userSchema.pre(
  'save',
  async function (next) {
    try {
      /*
        Do not hash when the password was
        not changed or is not present.
      */
      if (
        !this.isModified('password') ||
        !this.password
      ) {
        return next();
      }

      const salt =
        await bcrypt.genSalt(12);

      this.password =
        await bcrypt.hash(
          this.password,
          salt
        );

      return next();

    } catch (error) {
      return next(error);
    }
  }
);


// ======================================================
// COMPARE PASSWORD
// ======================================================

userSchema.methods.comparePassword =
  async function (candidatePassword) {
    if (
      !candidatePassword ||
      !this.password
    ) {
      return false;
    }

    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };


// ======================================================
// CALCULATE PROFILE COMPLETION
// ======================================================

userSchema.methods.calculateProfileCompletion =
  function () {
    let score = 0;

    const fields = {
      fullName: 10,
      username: 10,
      email: 10,
      department: 10,
      year: 10,
      college: 10,
      location: 5,
      bio: 10,
      profileImage: 10,
      learningGoals: 5,
      availability: 5
    };

    for (
      const [field, points]
      of Object.entries(fields)
    ) {
      if (
        this[field] &&
        String(this[field]).trim() !== ''
      ) {
        score += points;
      }
    }

    // Social links contribution
    if (
      (this.linkedin && this.linkedin.trim() !== '') ||
      (this.github && this.github.trim() !== '') ||
      (this.portfolio && this.portfolio.trim() !== '') ||
      (this.socialLinks && (
        (this.socialLinks.linkedin && this.socialLinks.linkedin.trim() !== '') ||
        (this.socialLinks.github && this.socialLinks.github.trim() !== '') ||
        (this.socialLinks.portfolio && this.socialLinks.portfolio.trim() !== '')
      ))
    ) {
      score += 5;
    }

    // Interests or phone contribution if needed
    if (this.interests && this.interests.length > 0) {
      score += 5;
    }

    score = Math.min(100, Math.max(0, score));
    this.profileCompletion = score;

    return score;
  };


// ======================================================
// REMOVE PRIVATE FIELDS FROM JSON
// ======================================================

userSchema.set(
  'toJSON',
  {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.googleId;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetTokenExpires;
      delete ret.passwordResetOtpHash;
      delete ret.passwordResetOtpExpiresAt;
      delete ret.passwordResetAttempts;
      delete ret.__v;

      return ret;
    }
  }
);


module.exports =
  mongoose.model(
    'User',
    userSchema
  );