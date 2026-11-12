/**
 * SkillSync 10 Demo Users & Live Platform Dataset Seed Script
 * 
 * Injects 10 verified university students, skills, teaching/learning proficiencies,
 * scheduled peer sessions, and exchange requests into MongoDB.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../backend/config');

const User = require('../backend/models/User');
const Skill = require('../backend/models/Skill');
const UserSkill = require('../backend/models/UserSkill');
const Session = require('../backend/models/Session');
const ExchangeRequest = require('../backend/models/ExchangeRequest');
const Notification = require('../backend/models/Notification');
const ActivityLog = require('../backend/models/ActivityLog');

const DEMO_STUDENTS = [
  {
    fullName: 'Alex Rivera',
    username: 'alex_rivera',
    email: 'alex.rivera@stanford.edu',
    college: 'Stanford University',
    department: 'Computer Science',
    year: '4th Year',
    location: 'Stanford, CA',
    bio: 'Senior CS student specializing in distributed systems and web architectures. Former TA for CS106B. Love mentoring peers in React, TypeScript, and clean code principles.',
    learningGoals: 'UI/UX Design Systems, PyTorch GPU acceleration, Startup Pitching',
    rating: 4.95,
    totalRatings: 38,
    completedExchanges: 14,
    completedSessions: 22,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'React & Next.js', level: 'Advanced' },
      { name: 'TypeScript & Node.js', level: 'Advanced' },
      { name: 'Data Structures & Algorithms', level: 'Expert' }
    ],
    learnSkills: [
      { name: 'UI/UX & Design Systems', level: 'Beginner' },
      { name: 'Machine Learning with PyTorch', level: 'Intermediate' },
      { name: 'Product Pitching & Public Speaking', level: 'Beginner' }
    ]
  },
  {
    fullName: 'Sophia Chen',
    username: 'sophia_chen',
    email: 'sophia.chen@berkeley.edu',
    college: 'UC Berkeley',
    department: 'Data Science',
    year: '3rd Year',
    location: 'Berkeley, CA',
    bio: 'Undergrad researcher at Berkeley AI Research (BAIR). Specializing in computer vision and neural radiance fields. Eager to trade deep learning / PyTorch insights for frontend development coaching.',
    learningGoals: 'React & Next.js, Cloud Infrastructure, UI/UX Design',
    rating: 4.95,
    totalRatings: 29,
    completedExchanges: 11,
    completedSessions: 18,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Machine Learning with PyTorch', level: 'Advanced' },
      { name: 'Python & Data Analysis', level: 'Expert' }
    ],
    learnSkills: [
      { name: 'React & Next.js', level: 'Beginner' },
      { name: 'UI/UX & Design Systems', level: 'Beginner' }
    ]
  },
  {
    fullName: 'Marcus Vance',
    username: 'marcus_vance',
    email: 'marcus.vance@mit.edu',
    college: 'MIT',
    department: 'Computer Science',
    year: '4th Year',
    location: 'Cambridge, MA',
    bio: 'Robotics engineer passionate about hardware-software interfaces, autonomous navigation, and low-latency C++. Looking to build sleek web dashboards for robotic telemetry.',
    learningGoals: 'React & TypeScript, Full Stack Web Development',
    rating: 4.88,
    totalRatings: 22,
    completedExchanges: 9,
    completedSessions: 15,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Data Structures & Algorithms', level: 'Expert' },
      { name: 'Cybersecurity & Ethical Hacking', level: 'Advanced' }
    ],
    learnSkills: [
      { name: 'React & Next.js', level: 'Intermediate' }
    ]
  },
  {
    fullName: 'Elena Rostova',
    username: 'elena_rostova',
    email: 'elena.rostova@harvard.edu',
    college: 'Harvard University',
    department: 'Design',
    year: 'Graduate',
    location: 'Cambridge, MA',
    bio: 'Masters student researching accessibility and design systems at Harvard. Former product design intern at Apple. Love running interactive Figma workshops, critique sessions, and usability tests.',
    learningGoals: 'TypeScript & Node.js, React Frontend Integration',
    rating: 5.0,
    totalRatings: 45,
    completedExchanges: 19,
    completedSessions: 32,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'UI/UX & Design Systems', level: 'Expert' }
    ],
    learnSkills: [
      { name: 'React & Next.js', level: 'Beginner' },
      { name: 'TypeScript & Node.js', level: 'Beginner' }
    ]
  },
  {
    fullName: 'Jordan Taylor',
    username: 'jordan_taylor',
    email: 'jordan.taylor@cmu.edu',
    college: 'Carnegie Mellon',
    department: 'Computer Science',
    year: '3rd Year',
    location: 'Pittsburgh, PA',
    bio: 'Cloud architecture geek and open source contributor. Love containerization, microservice patterns, and high-throughput databases. Seeking feedback on tech pitches and slide deck design.',
    learningGoals: 'Product Pitching & Public Speaking, UI/UX Design',
    rating: 4.85,
    totalRatings: 19,
    completedExchanges: 8,
    completedSessions: 14,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Cloud Infrastructure & Docker', level: 'Advanced' },
      { name: 'Backend Architecture with Node.js', level: 'Expert' }
    ],
    learnSkills: [
      { name: 'Product Pitching & Public Speaking', level: 'Beginner' },
      { name: 'UI/UX & Design Systems', level: 'Intermediate' }
    ]
  },
  {
    fullName: 'Aaliyah Patel',
    username: 'aaliyah_patel',
    email: 'aaliyah.patel@columbia.edu',
    college: 'Columbia University',
    department: 'Data Science',
    year: '2nd Year',
    location: 'New York, NY',
    bio: 'Specializing in econometric modeling and exploratory data analysis. I help students grasp SQL queries, data wrangling with pandas, and statistical inference without the headache.',
    learningGoals: 'React & Next.js, Frontend Prototyping',
    rating: 4.92,
    totalRatings: 16,
    completedExchanges: 7,
    completedSessions: 12,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Python & Data Analysis', level: 'Advanced' }
    ],
    learnSkills: [
      { name: 'React & Next.js', level: 'Beginner' }
    ]
  },
  {
    fullName: 'Liam O\'Connor',
    username: 'liam_oconnor',
    email: 'liam.oconnor@washington.edu',
    college: 'Univ of Washington',
    department: 'Computer Science',
    year: '4th Year',
    location: 'Seattle, WA',
    bio: 'Mobile software developer with 2 apps published on the App Store. Experienced with Flutter, Swift, and cross-platform state management. Let\'s build mobile experiences together!',
    learningGoals: 'Machine Learning with PyTorch, Cloud Docker Deployments',
    rating: 4.81,
    totalRatings: 25,
    completedExchanges: 10,
    completedSessions: 17,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Mobile App Dev with Flutter', level: 'Advanced' }
    ],
    learnSkills: [
      { name: 'Machine Learning with PyTorch', level: 'Beginner' }
    ]
  },
  {
    fullName: 'Maya Lin',
    username: 'maya_lin',
    email: 'maya.lin@gatech.edu',
    college: 'Georgia Tech',
    department: 'Computer Science',
    year: '3rd Year',
    location: 'Atlanta, GA',
    bio: 'Georgia Tech collegiate cyber defense competitor. Passionate about ethical hacking, buffer overflows, Wireshark packet inspection, and hardening web infrastructure.',
    learningGoals: 'Conversational Japanese, Mobile App Development',
    rating: 4.97,
    totalRatings: 33,
    completedExchanges: 13,
    completedSessions: 20,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Cybersecurity & Ethical Hacking', level: 'Advanced' }
    ],
    learnSkills: [
      { name: 'Conversational Japanese & JLPT', level: 'Beginner' }
    ]
  },
  {
    fullName: 'David Kim',
    username: 'david_kim',
    email: 'david.kim@columbia.edu',
    college: 'Columbia University',
    department: 'Business',
    year: '4th Year',
    location: 'New York, NY',
    bio: 'Undergraduate Investment Society president. Coaching peers on financial modeling, discounted cash flows, startup valuations, and delivering persuasive executive presentations.',
    learningGoals: 'Python for Financial Engineering, SQL Databases',
    rating: 4.89,
    totalRatings: 27,
    completedExchanges: 12,
    completedSessions: 19,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Product Pitching & Public Speaking', level: 'Expert' },
      { name: 'Financial Modeling & Valuation', level: 'Advanced' }
    ],
    learnSkills: [
      { name: 'Python & Data Analysis', level: 'Intermediate' }
    ]
  },
  {
    fullName: 'Zoe Martin',
    username: 'zoe_martin',
    email: 'zoe.martin@mit.edu',
    college: 'MIT',
    department: 'Cognitive',
    year: 'Graduate',
    location: 'Cambridge, MA',
    bio: 'Computational linguistics researcher and polyglot. Fluent in Japanese (JLPT N1), French, and English. Experienced in pronunciation drilling, grammar frameworks, and conversational fluency.',
    learningGoals: 'Python Data Science, Machine Learning with PyTorch',
    rating: 5.0,
    totalRatings: 41,
    completedExchanges: 17,
    completedSessions: 28,
    isVerified: true,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    teachSkills: [
      { name: 'Conversational Japanese & JLPT', level: 'Expert' }
    ],
    learnSkills: [
      { name: 'Machine Learning with PyTorch', level: 'Beginner' }
    ]
  }
];

const DEMO_SKILLS = [
  {
    name: 'React & Next.js',
    category: 'Programming',
    description: 'Component architecture, custom hooks, Server Components, and client state orchestration.',
    difficulty: 'Intermediate',
    iconKey: 'code'
  },
  {
    name: 'UI/UX & Design Systems',
    category: 'UI/UX Design',
    description: 'Figma component auto-layout, design tokens, micro-interactions, responsive typography, and accessibility.',
    difficulty: 'Intermediate',
    iconKey: 'layout'
  },
  {
    name: 'Machine Learning with PyTorch',
    category: 'Data Science',
    description: 'Tensors, autograd, convolution, transformers, and practical GPU model training workflows.',
    difficulty: 'Advanced',
    iconKey: 'brain'
  },
  {
    name: 'Python & Data Analysis',
    category: 'Data Science',
    description: 'Pandas, NumPy, statistical hypothesis testing, Matplotlib visualization, and clean data wrangling.',
    difficulty: 'Beginner',
    iconKey: 'file-spreadsheet'
  },
  {
    name: 'Backend Architecture with Node.js',
    category: 'Programming',
    description: 'RESTful API contracts, Express middleware chains, JWT authentication, caching, and rate limiting.',
    difficulty: 'Advanced',
    iconKey: 'server'
  },
  {
    name: 'Product Pitching & Public Speaking',
    category: 'Business & Public Speaking',
    description: 'Executive story arcs, slide deck pacing, handling tough Q&A, and high-impact speech delivery.',
    difficulty: 'Beginner',
    iconKey: 'mic'
  },
  {
    name: 'Mobile App Dev with Flutter',
    category: 'App Dev',
    description: 'Cross-platform declarative UI, state management, animations, and App Store packaging.',
    difficulty: 'Intermediate',
    iconKey: 'smartphone'
  },
  {
    name: 'Conversational Japanese & JLPT',
    category: 'Languages',
    description: 'Practical daily conversation, Kanji retention techniques, JLPT N3-N1 drills, and cultural nuance.',
    difficulty: 'Beginner',
    iconKey: 'languages'
  },
  {
    name: 'Data Structures & Algorithms',
    category: 'Programming',
    description: 'Graph traversals, dynamic programming patterns, heap applications, and technical interview drills.',
    difficulty: 'Advanced',
    iconKey: 'binary'
  },
  {
    name: 'Cloud Infrastructure & Docker',
    category: 'Programming',
    description: 'Docker image optimization, multi-container compose stacks, cloud VPC networking, and AWS basics.',
    difficulty: 'Intermediate',
    iconKey: 'cloud'
  },
  {
    name: 'Cybersecurity & Ethical Hacking',
    category: 'Programming',
    description: 'Network packet analysis, penetration testing fundamentals, OWASP vulnerabilities, and security auditing.',
    difficulty: 'Advanced',
    iconKey: 'shield'
  },
  {
    name: 'Financial Modeling & Valuation',
    category: 'Business & Public Speaking',
    description: 'Three-statement financial models, DCF cash flow projection, sensitivity analysis, and pitch valuations.',
    difficulty: 'Intermediate',
    iconKey: 'trending-up'
  }
];

async function seedDemoData() {
  console.log('====================================================');
  console.log('       SkillSync 10 Demo Users & Live Data Seed     ');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI || config.mongoUri || 'mongodb://localhost:27017/skillsync';
  console.log(`[Database] Connecting to: ${mongoUri}...`);

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] Connected to database: "${conn.connection.name}"\n`);

    // 1. Seed Skills
    console.log('--- Step 1: Seeding 12 Core Skills ---');
    const skillMap = new Map();
    for (const skillData of DEMO_SKILLS) {
      let skill = await Skill.findOne({ name: skillData.name });
      if (!skill) {
        skill = await Skill.create({
          ...skillData,
          isActive: true
        });
      }
      skillMap.set(skill.name, skill);
      console.log(` • Skill registered: ${skill.name} (${skill.category})`);
    }

    // 2. Seed 10 Demo Students
    console.log('\n--- Step 2: Seeding 10 Verified Demo Students ---');
    const studentUserMap = new Map();
    const commonPasswordHash = await bcrypt.hash('demo123', 12);

    for (const s of DEMO_STUDENTS) {
      let user = await User.findOne({ email: s.email });
      if (!user) {
        user = new User({
          fullName: s.fullName,
          username: s.username,
          email: s.email,
          password: commonPasswordHash,
          college: s.college,
          department: s.department,
          year: s.year,
          location: s.location,
          bio: s.bio,
          learningGoals: s.learningGoals,
          rating: s.rating,
          totalRatings: s.totalRatings,
          completedExchanges: s.completedExchanges,
          completedSessions: s.completedSessions,
          isVerified: s.isVerified,
          isEmailVerified: s.isEmailVerified,
          profileImage: s.profileImage
        });
        user.calculateProfileCompletion();
        // bypass re-hashing by saving directly with already hashed password
        await user.save();
      } else {
        // update password to demo123 for convenience
        user.password = commonPasswordHash;
        user.profileImage = s.profileImage;
        user.isVerified = true;
        await user.save();
      }
      studentUserMap.set(s.fullName, user);
      console.log(` • Student: ${s.fullName.padEnd(16)} | ${s.college.padEnd(20)} | Login: ${s.email} (pw: demo123)`);

      // Seed teaching and learning UserSkills
      for (const t of s.teachSkills) {
        const skillDoc = skillMap.get(t.name);
        if (skillDoc) {
          await UserSkill.findOneAndUpdate(
            { userId: user._id, skillId: skillDoc._id, type: 'teach' },
            {
              userId: user._id,
              skillId: skillDoc._id,
              skillName: skillDoc.name,
              type: 'teach',
              level: t.level,
              isVerified: true
            },
            { upsert: true, new: true }
          );
        }
      }

      for (const l of s.learnSkills) {
        const skillDoc = skillMap.get(l.name);
        if (skillDoc) {
          await UserSkill.findOneAndUpdate(
            { userId: user._id, skillId: skillDoc._id, type: 'learn' },
            {
              userId: user._id,
              skillId: skillDoc._id,
              skillName: skillDoc.name,
              type: 'learn',
              level: l.level,
              isVerified: false
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    // 3. Seed Live Sessions and Requests for Alex Rivera
    console.log('\n--- Step 3: Seeding Live Peer Sessions & Requests ---');
    const alex = studentUserMap.get('Alex Rivera');
    const elena = studentUserMap.get('Elena Rostova');
    const jordan = studentUserMap.get('Jordan Taylor');
    const sophia = studentUserMap.get('Sophia Chen');

    if (alex && elena) {
      const designSkill = skillMap.get('UI/UX & Design Systems');
      await Session.findOneAndUpdate(
        { organizer: alex._id, partner: elena._id, topic: 'Figma Component Tokens & React Prop Mapping' },
        {
          organizer: alex._id,
          partner: elena._id,
          participants: [alex._id, elena._id],
          skill: designSkill?._id,
          skillName: designSkill?.name || 'UI/UX & Design Systems',
          topic: 'Figma Component Tokens & React Prop Mapping',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          mode: 'online',
          status: 'scheduled',
          meetingLink: 'https://meet.google.com/ssy-demo-alex',
          notes: 'Reviewing design system tokens for web buttons and input states.'
        },
        { upsert: true }
      );
      console.log(' • Scheduled Session created: Alex Rivera & Elena Rostova (Figma Tokens)');
    }

    if (alex && sophia) {
      const mlSkill = skillMap.get('Machine Learning with PyTorch');
      const reactSkill = skillMap.get('React & Next.js');
      await ExchangeRequest.findOneAndUpdate(
        { fromUser: sophia._id, toUser: alex._id },
        {
          fromUser: sophia._id,
          toUser: alex._id,
          teachSkill: mlSkill?._id,
          teachSkillName: mlSkill?.name || 'Machine Learning with PyTorch',
          learnSkill: reactSkill?._id,
          learnSkillName: reactSkill?.name || 'React & Next.js',
          message: 'Hey Alex! Would love to trade PyTorch GPU training sessions for your React architecture guidance!',
          status: 'pending',
          matchPercentage: 96
        },
        { upsert: true }
      );
      console.log(' • Incoming Request created: Sophia Chen -> Alex Rivera');
    }

    // 4. Notifications
    if (alex) {
      await Notification.findOneAndUpdate(
        { userId: alex._id, title: 'New Skill Exchange Request' },
        {
          userId: alex._id,
          title: 'New Skill Exchange Request',
          message: 'Sophia Chen (UC Berkeley) sent you a skill exchange request in Machine Learning with PyTorch.',
          type: 'request',
          isRead: false
        },
        { upsert: true }
      );
      console.log(' • Notification created for Alex Rivera');
    }

    console.log('\n====================================================');
    console.log('🎉 10 Demo Users & Live Datasets Seeded Successfully!');
    console.log('Demo Login Credentials:');
    console.log(' • Email   : alex.rivera@stanford.edu (or any of the 10 students)');
    console.log(' • Password: demo123');
    console.log('====================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
}

if (require.main === module) {
  seedDemoData();
}

module.exports = seedDemoData;

