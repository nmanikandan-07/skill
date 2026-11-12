require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// ======================================================
// CONFIG IMPORTS
// ======================================================

const connectDB = require('./backend/config/db');

const {
  verifyMailer,
  getTransporter
} = require('./backend/config/mailer');

const config = require('./backend/config');
const errorHandler = require('./backend/middleware/errorHandler');

const app = express();


// ======================================================
// DATABASE CONNECTION
// ======================================================

connectDB();


// ======================================================
// VERIFY GMAIL OAUTH2
// ======================================================

verifyMailer();


// ======================================================
// CREATE UPLOAD DIRECTORY
// ======================================================

const uploadsDir = path.join(
  __dirname,
  config.uploadDir || 'uploads'
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true
  });
}


// ======================================================
// SECURITY MIDDLEWARE
// ======================================================

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

app.use(cors());


// ======================================================
// RATE LIMITING
// ======================================================

const limiter = rateLimit({
  windowMs:
    Number(process.env.RATE_LIMIT_WINDOW) ||
    config.rateLimitWindow ||
    900000,

  max:
    Number(process.env.RATE_LIMIT_MAX) ||
    config.rateLimitMax ||
    100,

  message: {
    message:
      'Too many requests, please try again later'
  }
});

app.use('/api/', limiter);


// ======================================================
// BODY PARSING
// ======================================================

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);


// ======================================================
// STATIC FILES
// ======================================================

app.use(
  express.static(
    path.join(__dirname, 'frontend')
  )
);

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);


// ======================================================
// GMAIL OAUTH2 TEST ROUTE
// TEMPORARY ROUTE
// ======================================================

app.get('/api/test-email', async (req, res) => {
  try {
    const transporter = getTransporter();

    if (!transporter) {
      return res.status(500).json({
        success: false,
        message:
          'Gmail OAuth2 configuration is missing. Check your .env file.'
      });
    }

    if (!process.env.EMAIL_USER) {
      return res.status(500).json({
        success: false,
        message:
          'EMAIL_USER is missing in .env'
      });
    }

    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `SkillSync <${process.env.EMAIL_USER}>`,

      // Test email goes to sender Gmail itself
      to: process.env.EMAIL_USER,

      subject:
        'SkillSync Gmail OAuth2 Test',

      html: `
        <div
          style="
            max-width: 520px;
            margin: 30px auto;
            font-family: Arial, sans-serif;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
          "
        >

          <div
            style="
              background: #0f172a;
              padding: 28px;
              text-align: center;
            "
          >

            <h1
              style="
                color: #ffffff;
                margin: 0;
                font-size: 24px;
              "
            >
              SkillSync
            </h1>

            <p
              style="
                color: #94a3b8;
                font-size: 13px;
                margin: 6px 0 0;
              "
            >
              Student Skill Exchange Platform
            </p>

          </div>


          <div
            style="
              padding: 32px;
            "
          >

            <h2
              style="
                color: #4f46e5;
                margin-top: 0;
              "
            >
              Gmail Test Successful
            </h2>

            <p
              style="
                color: #475569;
                line-height: 1.6;
              "
            >
              Your SkillSync Gmail OAuth2
              configuration is working correctly.
            </p>

            <p
              style="
                color: #475569;
                line-height: 1.6;
              "
            >
              SkillSync can now send password-reset
              verification codes through Gmail.
            </p>

          </div>


          <div
            style="
              background: #f8fafc;
              padding: 16px;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
            "
          >
            SkillSync • Student Skill Exchange Platform
          </div>

        </div>
      `
    });

    console.log(
      '[Mailer Test] ✅ Test email sent successfully'
    );

    console.log(
      '[Mailer Test] Message ID:',
      info.messageId
    );

    if (info.accepted) {
      console.log(
        '[Mailer Test] Accepted:',
        info.accepted
      );
    }

    return res.status(200).json({
      success: true,
      message:
        'SkillSync test email sent successfully. Check your Gmail inbox.'
    });

  } catch (error) {
    console.error(
      '[Mailer Test] ❌ Email failed:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        'SkillSync test email could not be sent.',
      error: error.message
    });
  }
});


// ======================================================
// API ROUTES
// ======================================================

app.use(
  '/api/auth',
  require('./backend/routes/auth')
);

app.use(
  '/api/users',
  require('./backend/routes/users')
);

app.use(
  '/api/skills',
  require('./backend/routes/skills')
);

app.use(
  '/api/user-skills',
  require('./backend/routes/userSkills')
);

app.use(
  '/api/matches',
  require('./backend/routes/matches')
);

app.use(
  '/api/exchange-requests',
  require('./backend/routes/exchangeRequests')
);

app.use(
  '/api/sessions',
  require('./backend/routes/sessions')
);

app.use(
  '/api/messages',
  require('./backend/routes/messages')
);

app.use(
  '/api/reviews',
  require('./backend/routes/reviews')
);

app.use(
  '/api/progress',
  require('./backend/routes/progress')
);

app.use(
  '/api/notifications',
  require('./backend/routes/notifications')
);

app.use(
  '/api/settings',
  require('./backend/routes/settings')
);


// ======================================================
// DASHBOARD IMPORTS
// ======================================================

const {
  protect
} = require('./backend/middleware/auth');

const UserSkill =
  require('./backend/models/UserSkill');

const SkillExchange =
  require('./backend/models/SkillExchange');

const Session =
  require('./backend/models/Session');

const ActivityLog =
  require('./backend/models/ActivityLog');

const Notification =
  require('./backend/models/Notification');


// ======================================================
// DASHBOARD API
// ======================================================

app.get(
  '/api/dashboard',
  protect,

  async (req, res) => {
    try {
      const userId = req.user._id;

      const teachingCount =
        await UserSkill.countDocuments({
          userId,
          type: 'teach'
        });

      const learningCount =
        await UserSkill.countDocuments({
          userId,
          type: 'learn'
        });

      const activeExchanges =
        await SkillExchange.countDocuments({
          participants: userId,
          status: 'active'
        });

      const completedSessions =
        await Session.countDocuments({
          participants: userId,
          status: 'completed'
        });

      const upcomingSessions =
        await Session.find({
          participants: userId,
          status: 'scheduled',

          date: {
            $gte: new Date()
          }
        })

          .populate(
            'organizer',
            'fullName profileImage'
          )

          .populate(
            'partner',
            'fullName profileImage'
          )

          .sort({
            date: 1
          })

          .limit(5);

      const recentActivity =
        await ActivityLog.find({
          userId
        })

          .sort({
            createdAt: -1
          })

          .limit(10);

      const unreadNotifications =
        await Notification.countDocuments({
          userId,
          isRead: false
        });

      return res.json({
        stats: {
          teachingCount,
          learningCount,
          activeExchanges,
          completedSessions
        },

        upcomingSessions,
        recentActivity,
        unreadNotifications,

        profileCompletion:
          req.user.profileCompletion
      });

    } catch (error) {
      console.error(
        '[Dashboard] Error:',
        error.message
      );

      return res.status(500).json({
        message: 'Server error'
      });
    }
  }
);


// ======================================================
// FRONTEND HOME PAGE
// ======================================================

app.get('/', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      'frontend',
      'index.html'
    )
  );
});


// ======================================================
// FRONTEND PAGE ROUTES
// ======================================================

app.get('/pages/:page', (req, res) => {
  const filePath = path.join(
    __dirname,
    'frontend',
    'pages',
    req.params.page
  );

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  return res.status(404).sendFile(
    path.join(
      __dirname,
      'frontend',
      'index.html'
    )
  );
});


// ======================================================
// ERROR HANDLER
// MUST REMAIN AFTER ALL ROUTES
// ======================================================

app.use(errorHandler);


// ======================================================
// START SERVER WITH SOCKET.IO
// ======================================================

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('joinUser', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  socket.on('joinConversation', (conversationId) => {
    if (conversationId) {
      socket.join(`conversation_${conversationId}`);
    }
  });

  socket.on('leaveConversation', (conversationId) => {
    if (conversationId) {
      socket.leave(`conversation_${conversationId}`);
    }
  });
});

const PORT =
  Number(process.env.PORT) ||
  config.port ||
  3000;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║          SkillSync Server Running        ║
║                                          ║
║  Port: ${PORT}                             
║  URL : http://localhost:${PORT}             
╚══════════════════════════════════════════╝
  `);
});