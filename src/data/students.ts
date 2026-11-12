import { Student } from '../types';

export const CURRENT_USER: Student = {
  id: 'student_alex',
  name: 'Alex Rivera',
  handle: '@alexr',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  email: 'alex.rivera@stanford.edu',
  university: 'Stanford University',
  department: 'Computer Science',
  major: 'Computer Science & Systems',
  year: '4th Year Senior',
  gpa: 3.92,
  showGpa: true,
  pronouns: 'he/him',
  bio: 'Senior CS student specializing in distributed systems and modern web architecture. TA for CS106B. Passionate about teaching clean React, TypeScript, and algorithm intuition while leveling up my UI design and PyTorch skills.',
  verified: true,
  online: true,
  rating: 4.95,
  reviewCount: 38,
  matchScore: 100,
  canTeach: [
    {
      skillName: 'React & Next.js',
      category: 'Programming',
      level: 'Advanced',
      endorsements: 28
    },
    {
      skillName: 'TypeScript & Node.js',
      category: 'Programming',
      level: 'Advanced',
      endorsements: 22
    },
    {
      skillName: 'Data Structures & Algorithms',
      category: 'Programming',
      level: 'Expert',
      endorsements: 34
    }
  ],
  wantsToLearn: [
    {
      skillName: 'UI/UX & Design Systems',
      category: 'UI/UX Design',
      level: 'Beginner'
    },
    {
      skillName: 'Machine Learning with PyTorch',
      category: 'Data Science',
      level: 'Intermediate'
    },
    {
      skillName: 'Product Pitching & Public Speaking',
      category: 'Business & Public Speaking',
      level: 'Beginner'
    }
  ],
  socialLinks: {
    github: 'https://github.com/alexrivera-demo',
    linkedin: 'https://linkedin.com/in/alexrivera-demo',
    portfolio: 'https://alexrivera.dev'
  },
  weeklyHours: 4,
  preferredDays: ['Mon', 'Wed', 'Fri'],
  sessionFormats: ['virtual', 'in-person']
};

export const MOCK_STUDENTS: Student[] = [
  CURRENT_USER,
  {
    id: 'student_sophia',
    name: 'Sophia Chen',
    handle: '@sophiac',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    email: 'sophia.chen@berkeley.edu',
    university: 'UC Berkeley',
    department: 'Data Science',
    major: 'EECS & Artificial Intelligence',
    year: '3rd Year Junior',
    gpa: 3.88,
    showGpa: true,
    pronouns: 'she/her',
    bio: 'Undergrad researcher at Berkeley AI Research (BAIR). Specializing in computer vision and neural radiance fields. Eager to trade deep learning / PyTorch insights for frontend development coaching.',
    verified: true,
    online: true,
    rating: 4.95,
    reviewCount: 29,
    matchScore: 96,
    canTeach: [
      {
        skillName: 'Machine Learning with PyTorch',
        category: 'Data Science',
        level: 'Advanced',
        endorsements: 31
      },
      {
        skillName: 'Python & Scientific Computing',
        category: 'Data Science',
        level: 'Expert',
        endorsements: 40
      },
      {
        skillName: 'Linear Algebra for AI',
        category: 'Data Science',
        level: 'Intermediate',
        endorsements: 18
      }
    ],
    wantsToLearn: [
      {
        skillName: 'React & Next.js',
        category: 'Programming',
        level: 'Beginner'
      },
      {
        skillName: 'UI/UX & Design Systems',
        category: 'UI/UX Design',
        level: 'Beginner'
      },
      {
        skillName: 'Cloud Infrastructure & Docker',
        category: 'Programming',
        level: 'Intermediate'
      }
    ],
    socialLinks: {
      github: 'https://github.com/sophiachen-ai',
      linkedin: 'https://linkedin.com/in/sophiachen-demo'
    },
    weeklyHours: 5,
    preferredDays: ['Tue', 'Thu', 'Sat'],
    sessionFormats: ['virtual']
  },
  {
    id: 'student_marcus',
    name: 'Marcus Vance',
    handle: '@marcusv',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    email: 'marcus.vance@mit.edu',
    university: 'MIT',
    department: 'Computer Science',
    major: 'Robotics & Embedded Systems',
    year: '4th Year Senior',
    gpa: 3.94,
    showGpa: true,
    pronouns: 'he/him',
    bio: 'Robotics enthusiast working on autonomous drone navigation and ROS 2 middleware. Looking to trade low-level C++ and robotics systems programming for web dashboard UI and TypeScript.',
    verified: true,
    online: false,
    rating: 4.88,
    reviewCount: 22,
    matchScore: 92,
    canTeach: [
      {
        skillName: 'C++ Systems Programming',
        category: 'Programming',
        level: 'Expert',
        endorsements: 27
      },
      {
        skillName: 'ROS & Robotics Simulation',
        category: 'Programming',
        level: 'Advanced',
        endorsements: 19
      },
      {
        skillName: 'Linux & Shell Scripting',
        category: 'Programming',
        level: 'Advanced',
        endorsements: 24
      }
    ],
    wantsToLearn: [
      {
        skillName: 'React & TypeScript',
        category: 'Programming',
        level: 'Intermediate'
      },
      {
        skillName: 'Full Stack Web Development',
        category: 'Programming',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      github: 'https://github.com/marcusvance-mit',
      linkedin: 'https://linkedin.com/in/marcusvance'
    },
    weeklyHours: 3,
    preferredDays: ['Wed', 'Fri', 'Sun'],
    sessionFormats: ['virtual', 'in-person']
  },
  {
    id: 'student_elena',
    name: 'Elena Rostova',
    handle: '@elenar',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    email: 'elena.rostova@harvard.edu',
    university: 'Harvard University',
    department: 'Design',
    major: 'Design & Human Factors',
    year: 'Graduate',
    gpa: 3.96,
    showGpa: true,
    pronouns: 'she/her',
    bio: 'Masters student researching accessibility and design systems at Harvard. Former product design intern at Apple. I love running interactive Figma workshops, critique sessions, and usability tests.',
    verified: true,
    online: true,
    rating: 5.0,
    reviewCount: 45,
    matchScore: 95,
    canTeach: [
      {
        skillName: 'UI/UX & Design Systems',
        category: 'UI/UX Design',
        level: 'Expert',
        endorsements: 48
      },
      {
        skillName: 'Figma Prototyping & Tokens',
        category: 'UI/UX Design',
        level: 'Expert',
        endorsements: 52
      },
      {
        skillName: 'User Research & Usability Testing',
        category: 'UI/UX Design',
        level: 'Advanced',
        endorsements: 26
      }
    ],
    wantsToLearn: [
      {
        skillName: 'TypeScript & Node.js',
        category: 'Programming',
        level: 'Beginner'
      },
      {
        skillName: 'React & Next.js',
        category: 'Programming',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      portfolio: 'https://elenarostova.design',
      linkedin: 'https://linkedin.com/in/elenarostova'
    },
    weeklyHours: 6,
    preferredDays: ['Mon', 'Tue', 'Thu'],
    sessionFormats: ['virtual', 'in-person']
  },
  {
    id: 'student_jordan',
    name: 'Jordan Taylor',
    handle: '@jordant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    email: 'jordan.taylor@cmu.edu',
    university: 'Carnegie Mellon',
    department: 'Computer Science',
    major: 'Software Engineering & Cloud Systems',
    year: '3rd Year Junior',
    gpa: 3.82,
    showGpa: true,
    pronouns: 'they/them',
    bio: 'Cloud architecture geek and open source contributor. Love containerization, microservice patterns, and high-throughput databases. Seeking feedback on tech pitches and slide deck design.',
    verified: true,
    online: true,
    rating: 4.85,
    reviewCount: 19,
    matchScore: 90,
    canTeach: [
      {
        skillName: 'Cloud Infrastructure & Docker',
        category: 'Programming',
        level: 'Advanced',
        endorsements: 21
      },
      {
        skillName: 'Backend Architecture with Node.js',
        category: 'Programming',
        level: 'Expert',
        endorsements: 33
      },
      {
        skillName: 'PostgreSQL & Database Design',
        category: 'Programming',
        level: 'Advanced',
        endorsements: 17
      }
    ],
    wantsToLearn: [
      {
        skillName: 'Product Pitching & Public Speaking',
        category: 'Business & Public Speaking',
        level: 'Beginner'
      },
      {
        skillName: 'UI/UX & Design Systems',
        category: 'UI/UX Design',
        level: 'Intermediate'
      }
    ],
    socialLinks: {
      github: 'https://github.com/jordantaylor-cmu',
      linkedin: 'https://linkedin.com/in/jordantaylor-demo'
    },
    weeklyHours: 4,
    preferredDays: ['Mon', 'Thu', 'Sat'],
    sessionFormats: ['virtual']
  },
  {
    id: 'student_aaliyah',
    name: 'Aaliyah Patel',
    handle: '@aaliyahp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    email: 'aaliyah.patel@columbia.edu',
    university: 'Columbia University',
    department: 'Data Science',
    major: 'Data Science & Applied Statistics',
    year: '2nd Year Sophomore',
    gpa: 3.89,
    showGpa: true,
    pronouns: 'she/her',
    bio: 'Specializing in econometric modeling and exploratory data analysis. I help students grasp SQL queries, data wrangling with pandas, and statistical inference without the headache.',
    verified: true,
    online: false,
    rating: 4.92,
    reviewCount: 16,
    matchScore: 89,
    canTeach: [
      {
        skillName: 'Python & Data Analysis',
        category: 'Data Science',
        level: 'Advanced',
        endorsements: 28
      },
      {
        skillName: 'SQL & Relational Databases',
        category: 'Data Science',
        level: 'Advanced',
        endorsements: 24
      },
      {
        skillName: 'Tableau & Data Storytelling',
        category: 'Data Science',
        level: 'Intermediate',
        endorsements: 14
      }
    ],
    wantsToLearn: [
      {
        skillName: 'React & Next.js',
        category: 'Programming',
        level: 'Beginner'
      },
      {
        skillName: 'UI/UX & Design Systems',
        category: 'UI/UX Design',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      github: 'https://github.com/aaliyahpatel',
      linkedin: 'https://linkedin.com/in/aaliyah-patel-data'
    },
    weeklyHours: 4,
    preferredDays: ['Tue', 'Thu', 'Sun'],
    sessionFormats: ['virtual', 'in-person']
  },
  {
    id: 'student_liam',
    name: 'Liam O\'Connor',
    handle: '@liamo',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    email: 'liam.oconnor@washington.edu',
    university: 'Univ of Washington',
    department: 'Computer Science',
    major: 'Computer Science & Mobile Systems',
    year: '4th Year Senior',
    gpa: 3.79,
    showGpa: true,
    pronouns: 'he/him',
    bio: 'Mobile software developer with 2 apps published on the App Store. Experienced with Flutter, Swift, and cross-platform state management. Let\'s build mobile experiences together!',
    verified: true,
    online: true,
    rating: 4.81,
    reviewCount: 25,
    matchScore: 87,
    canTeach: [
      {
        skillName: 'Mobile App Dev with Flutter',
        category: 'App Dev',
        level: 'Advanced',
        endorsements: 30
      },
      {
        skillName: 'Swift & iOS Fundamentals',
        category: 'App Dev',
        level: 'Intermediate',
        endorsements: 19
      },
      {
        skillName: 'REST API Integration',
        category: 'Programming',
        level: 'Advanced',
        endorsements: 22
      }
    ],
    wantsToLearn: [
      {
        skillName: 'Machine Learning with PyTorch',
        category: 'Data Science',
        level: 'Beginner'
      },
      {
        skillName: 'Cloud Infrastructure & Docker',
        category: 'Programming',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      github: 'https://github.com/liamoconnor',
      linkedin: 'https://linkedin.com/in/liam-oconnor'
    },
    weeklyHours: 3,
    preferredDays: ['Mon', 'Wed', 'Fri'],
    sessionFormats: ['virtual']
  },
  {
    id: 'student_maya',
    name: 'Maya Lin',
    handle: '@mayalin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    email: 'maya.lin@gatech.edu',
    university: 'Georgia Tech',
    department: 'Computer Science',
    major: 'Cybersecurity & Network Defense',
    year: '3rd Year Junior',
    gpa: 3.91,
    showGpa: true,
    pronouns: 'she/her',
    bio: 'Georgia Tech collegiate cyber defense competitor. Passionate about ethical hacking, buffer overflows, Wireshark packet inspection, and hardening web infrastructure against OWASP vulnerabilities.',
    verified: true,
    online: true,
    rating: 4.97,
    reviewCount: 33,
    matchScore: 91,
    canTeach: [
      {
        skillName: 'Cybersecurity & Ethical Hacking',
        category: 'Programming',
        level: 'Advanced',
        endorsements: 36
      },
      {
        skillName: 'Linux & Shell Scripting',
        category: 'Programming',
        level: 'Expert',
        endorsements: 42
      },
      {
        skillName: 'Applied Cryptography',
        category: 'Programming',
        level: 'Intermediate',
        endorsements: 15
      }
    ],
    wantsToLearn: [
      {
        skillName: 'Conversational Japanese & JLPT',
        category: 'Languages',
        level: 'Beginner'
      },
      {
        skillName: 'Mobile App Dev with Flutter',
        category: 'App Dev',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      github: 'https://github.com/mayalin-sec',
      linkedin: 'https://linkedin.com/in/maya-lin-gatech'
    },
    weeklyHours: 5,
    preferredDays: ['Tue', 'Fri', 'Sat'],
    sessionFormats: ['virtual']
  },
  {
    id: 'student_david',
    name: 'David Kim',
    handle: '@davidk',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    email: 'david.kim@columbia.edu',
    university: 'Columbia University',
    department: 'Business',
    major: 'Business & Financial Analytics',
    year: '4th Year Senior',
    gpa: 3.86,
    showGpa: true,
    pronouns: 'he/him',
    bio: 'President of Undergraduate Investment Society. Coaching peers on financial modeling, discounted cash flows, startup valuations, and delivering persuasive executive presentations.',
    verified: true,
    online: false,
    rating: 4.89,
    reviewCount: 27,
    matchScore: 86,
    canTeach: [
      {
        skillName: 'Product Pitching & Public Speaking',
        category: 'Business & Public Speaking',
        level: 'Expert',
        endorsements: 38
      },
      {
        skillName: 'Financial Modeling & Valuation',
        category: 'Business & Public Speaking',
        level: 'Advanced',
        endorsements: 29
      },
      {
        skillName: 'Startup Strategy & Pitch Decks',
        category: 'Business & Public Speaking',
        level: 'Advanced',
        endorsements: 25
      }
    ],
    wantsToLearn: [
      {
        skillName: 'Python & Data Analysis',
        category: 'Data Science',
        level: 'Intermediate'
      },
      {
        skillName: 'SQL & Relational Databases',
        category: 'Data Science',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidkim-finance',
      portfolio: 'https://davidkim.capital'
    },
    weeklyHours: 4,
    preferredDays: ['Mon', 'Thu', 'Sun'],
    sessionFormats: ['virtual', 'in-person']
  },
  {
    id: 'student_zoe',
    name: 'Zoe Martin',
    handle: '@zoem',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    email: 'zoe.martin@mit.edu',
    university: 'MIT',
    department: 'Cognitive',
    major: 'Cognitive Science & Linguistics',
    year: 'Graduate',
    gpa: 3.98,
    showGpa: true,
    pronouns: 'she/her',
    bio: 'Computational linguistics researcher and polyglot. Fluent in Japanese (JLPT N1), French, and English. Experienced in pronunciation drilling, grammar frameworks, and conversational fluency.',
    verified: true,
    online: true,
    rating: 5.0,
    reviewCount: 41,
    matchScore: 93,
    canTeach: [
      {
        skillName: 'Conversational Japanese & JLPT',
        category: 'Languages',
        level: 'Expert',
        endorsements: 45
      },
      {
        skillName: 'French Language Practice',
        category: 'Languages',
        level: 'Advanced',
        endorsements: 19
      },
      {
        skillName: 'Cognitive Linguistics & NLP',
        category: 'Cognitive Science',
        level: 'Advanced',
        endorsements: 22
      }
    ],
    wantsToLearn: [
      {
        skillName: 'Python & Scientific Computing',
        category: 'Data Science',
        level: 'Intermediate'
      },
      {
        skillName: 'Machine Learning with PyTorch',
        category: 'Data Science',
        level: 'Beginner'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/zoemartin-mit'
    },
    weeklyHours: 5,
    preferredDays: ['Wed', 'Thu', 'Sat'],
    sessionFormats: ['virtual']
  }
];
