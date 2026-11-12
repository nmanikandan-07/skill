export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillProficiency {
  skillId?: string;
  skillName: string;
  category: string;
  level: ProficiencyLevel;
  endorsements?: number;
}

export interface Student {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email: string;
  university: string;
  department: string;
  major: string;
  year: string;
  gpa?: number;
  showGpa?: boolean;
  pronouns?: string;
  bio: string;
  verified: boolean;
  online: boolean;
  rating: number;
  reviewCount: number;
  matchScore?: number;
  canTeach: SkillProficiency[];
  wantsToLearn: SkillProficiency[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  weeklyHours?: number;
  preferredDays?: string[];
  sessionFormats?: ('virtual' | 'in-person')[];
}

export interface SkillCategory {
  id: string;
  name: string;
  count: number;
}

export interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  mentorCount: number;
  rating: number;
  sessionCount: number;
  level: ProficiencyLevel;
  icon?: string;
  topMentors: {
    name: string;
    avatar: string;
    university: string;
  }[];
  bookmarked?: boolean;
}

export type SessionFormat = 'virtual' | 'in-person';
export type SessionStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerMajor: string;
  partnerUniversity: string;
  role: 'learner' | 'mentor' | 'exchange';
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  duration: 30 | 45 | 60 | 90;
  format: SessionFormat;
  locationDetails?: string;
  status: SessionStatus;
  notes?: string;
  meetingLink?: string;
}

export interface ConnectionRequest {
  id: string;
  fromStudent: Student;
  offeredSkills: string[];
  desiredSkills: string[];
  message: string;
  timeReceived: string;
  matchPercentage: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ActiveConnection {
  id: string;
  student: Student;
  teachesYou: string[];
  learnsFromYou: string[];
  connectedSince: string;
  lastSessionDate?: string;
  rating: number;
  activeSwap: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  partner: Student;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'session' | 'connection' | 'match' | 'system';
  timestamp: string;
  isRead: boolean;
  link?: string;
}
