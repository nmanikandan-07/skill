import { Skill, SkillCategory } from '../types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  { id: 'all', name: 'All Categories', count: 12 },
  { id: 'programming', name: 'Programming', count: 5 },
  { id: 'ui-ux', name: 'UI/UX Design', count: 1 },
  { id: 'data-science', name: 'Data Science', count: 2 },
  { id: 'languages', name: 'Languages', count: 1 },
  { id: 'business', name: 'Business & Public Speaking', count: 2 },
  { id: 'app-dev', name: 'App Dev', count: 1 },
];

export const MOCK_SKILLS: Skill[] = [
  {
    id: 'skill_react_next',
    title: 'React & Next.js',
    category: 'Programming',
    description: 'Component architecture, custom hooks, Server Components, and client state orchestration.',
    mentorCount: 28,
    rating: 4.92,
    sessionCount: 142,
    level: 'Advanced',
    icon: 'Atom',
    bookmarked: true,
    topMentors: [
      {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        university: 'Stanford University'
      },
      {
        name: 'Liam O\'Connor',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        university: 'Univ of Washington'
      }
    ]
  },
  {
    id: 'skill_uiux_design',
    title: 'UI/UX & Design Systems',
    category: 'UI/UX Design',
    description: 'Figma component auto-layout, design tokens, micro-interactions, responsive typography, and accessibility.',
    mentorCount: 34,
    rating: 4.97,
    sessionCount: 186,
    level: 'Expert',
    icon: 'Layout',
    bookmarked: true,
    topMentors: [
      {
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        university: 'Harvard University'
      }
    ]
  },
  {
    id: 'skill_ml_pytorch',
    title: 'Machine Learning with PyTorch',
    category: 'Data Science',
    description: 'Tensors, autograd, convolution, transformers, and practical GPU model training workflows.',
    mentorCount: 22,
    rating: 4.91,
    sessionCount: 98,
    level: 'Advanced',
    icon: 'Brain',
    bookmarked: false,
    topMentors: [
      {
        name: 'Sophia Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        university: 'UC Berkeley'
      }
    ]
  },
  {
    id: 'skill_python_data',
    title: 'Python & Data Analysis',
    category: 'Data Science',
    description: 'Pandas, NumPy, statistical hypothesis testing, Matplotlib visualization, and clean data wrangling.',
    mentorCount: 45,
    rating: 4.88,
    sessionCount: 230,
    level: 'Intermediate',
    icon: 'FileSpreadsheet',
    bookmarked: false,
    topMentors: [
      {
        name: 'Aaliyah Patel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        university: 'Columbia University'
      },
      {
        name: 'Sophia Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        university: 'UC Berkeley'
      }
    ]
  },
  {
    id: 'skill_backend_node',
    title: 'Backend Architecture with Node.js',
    category: 'Programming',
    description: 'RESTful API contracts, Express middleware chains, JWT authentication, caching, and rate limiting.',
    mentorCount: 29,
    rating: 4.89,
    sessionCount: 115,
    level: 'Advanced',
    icon: 'Server',
    bookmarked: false,
    topMentors: [
      {
        name: 'Jordan Taylor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        university: 'Carnegie Mellon'
      },
      {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        university: 'Stanford University'
      }
    ]
  },
  {
    id: 'skill_public_speaking',
    title: 'Product Pitching & Public Speaking',
    category: 'Business & Public Speaking',
    description: 'Executive story arcs, slide deck pacing, handling tough Q&A, and high-impact speech delivery.',
    mentorCount: 19,
    rating: 4.93,
    sessionCount: 84,
    level: 'Intermediate',
    icon: 'Mic',
    bookmarked: false,
    topMentors: [
      {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        university: 'Columbia University'
      }
    ]
  },
  {
    id: 'skill_flutter_mobile',
    title: 'Mobile App Dev with Flutter',
    category: 'App Dev',
    description: 'Cross-platform declarative UI, state management, animations, and App Store packaging.',
    mentorCount: 16,
    rating: 4.82,
    sessionCount: 72,
    level: 'Intermediate',
    icon: 'Smartphone',
    bookmarked: false,
    topMentors: [
      {
        name: 'Liam O\'Connor',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        university: 'Univ of Washington'
      }
    ]
  },
  {
    id: 'skill_japanese_lang',
    title: 'Conversational Japanese & JLPT',
    category: 'Languages',
    description: 'Practical daily conversation, Kanji retention techniques, JLPT N3-N1 drills, and cultural nuance.',
    mentorCount: 14,
    rating: 5.0,
    sessionCount: 65,
    level: 'Intermediate',
    icon: 'Languages',
    bookmarked: false,
    topMentors: [
      {
        name: 'Zoe Martin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        university: 'MIT'
      }
    ]
  },
  {
    id: 'skill_dsa_code',
    title: 'Data Structures & Algorithms',
    category: 'Programming',
    description: 'Graph traversals, dynamic programming patterns, heap applications, and technical interview whiteboard drills.',
    mentorCount: 38,
    rating: 4.94,
    sessionCount: 210,
    level: 'Expert',
    icon: 'Binary',
    bookmarked: true,
    topMentors: [
      {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        university: 'Stanford University'
      },
      {
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        university: 'MIT'
      }
    ]
  },
  {
    id: 'skill_cloud_docker',
    title: 'Cloud Infrastructure & Docker',
    category: 'Programming',
    description: 'Docker image optimization, multi-container compose stacks, cloud VPC networking, and AWS basics.',
    mentorCount: 21,
    rating: 4.86,
    sessionCount: 94,
    level: 'Advanced',
    icon: 'Cloud',
    bookmarked: false,
    topMentors: [
      {
        name: 'Jordan Taylor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        university: 'Carnegie Mellon'
      }
    ]
  },
  {
    id: 'skill_cyber_sec',
    title: 'Cybersecurity & Ethical Hacking',
    category: 'Programming',
    description: 'Network packet analysis, penetration testing fundamentals, OWASP vulnerabilities, and security auditing.',
    mentorCount: 15,
    rating: 4.96,
    sessionCount: 68,
    level: 'Advanced',
    icon: 'Shield',
    bookmarked: false,
    topMentors: [
      {
        name: 'Maya Lin',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        university: 'Georgia Tech'
      }
    ]
  },
  {
    id: 'skill_financial_model',
    title: 'Financial Modeling & Valuation',
    category: 'Business & Public Speaking',
    description: 'Three-statement financial models, DCF cash flow projection, sensitivity analysis, and pitch valuations.',
    mentorCount: 17,
    rating: 4.87,
    sessionCount: 76,
    level: 'Advanced',
    icon: 'TrendingUp',
    bookmarked: false,
    topMentors: [
      {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        university: 'Columbia University'
      }
    ]
  }
];
