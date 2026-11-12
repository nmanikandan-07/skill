import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  Skill, 
  Session, 
  ActiveConnection, 
  ConnectionRequest, 
  Conversation, 
  ChatMessage, 
  AppNotification 
} from '../types';
import { CURRENT_USER, MOCK_STUDENTS } from '../data/students';
import { MOCK_SKILLS } from '../data/skills';
import { MOCK_SESSIONS } from '../data/sessions';
import { 
  MOCK_ACTIVE_CONNECTIONS, 
  MOCK_INCOMING_REQUESTS, 
  MOCK_SENT_REQUESTS 
} from '../data/connections';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'New Skill Exchange Request',
    message: 'Sophia Chen (UC Berkeley) requested an exchange: PyTorch ML for React & Next.js.',
    type: 'connection',
    timestamp: '2 hours ago',
    isRead: false,
    link: '/connections?tab=requests'
  },
  {
    id: 'notif_2',
    title: 'Upcoming Session Reminder',
    message: 'Your peer session with Elena Rostova on Figma Tokens is scheduled for tomorrow at 2:00 PM.',
    type: 'session',
    timestamp: 'Yesterday',
    isRead: false,
    link: '/sessions'
  },
  {
    id: 'notif_3',
    title: 'Top Algorithm Match',
    message: 'Marcus Vance (MIT) matches 92% of your skill trade interests in robotics & C++.',
    type: 'match',
    timestamp: '2 days ago',
    isRead: true,
    link: '/find-partners'
  }
];

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_elena',
    partner: MOCK_STUDENTS.find(s => s.id === 'student_elena') || MOCK_STUDENTS[3],
    messages: [
      {
        id: 'msg_1',
        senderId: 'student_elena',
        text: 'Hey Alex! Excited for our session tomorrow on design system tokens.',
        timestamp: '11:30 AM',
        isRead: true
      },
      {
        id: 'msg_2',
        senderId: 'student_alex',
        text: 'Same here Elena! I set up the React component library repo so we can map Figma tokens directly to Tailwind config.',
        timestamp: '11:38 AM',
        isRead: true
      },
      {
        id: 'msg_3',
        senderId: 'student_elena',
        text: 'Awesome! I will have the Figma file open with our latest variant definitions and auto-layout frames.',
        timestamp: '11:42 AM',
        isRead: true
      }
    ],
    lastMessage: 'Awesome! I will have the Figma file open with our latest variant definitions and auto-layout frames.',
    lastMessageTime: '11:42 AM',
    unreadCount: 1
  },
  {
    id: 'conv_jordan',
    partner: MOCK_STUDENTS.find(s => s.id === 'student_jordan') || MOCK_STUDENTS[4],
    messages: [
      {
        id: 'msg_4',
        senderId: 'student_jordan',
        text: 'Hey Alex, got the Docker compose file and PostgreSQL service running smoothly for the microservices demo.',
        timestamp: 'Yesterday',
        isRead: true
      },
      {
        id: 'msg_5',
        senderId: 'student_alex',
        text: 'Great work! Let us review the environment variable setup and CI testing next Tuesday.',
        timestamp: 'Yesterday',
        isRead: true
      }
    ],
    lastMessage: 'Great work! Let us review the environment variable setup and CI testing next Tuesday.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  }
];

interface AppContextType {
  currentUser: Student;
  updateCurrentUser: (updated: Partial<Student>) => void;
  loginAsDemo: (studentId?: string) => void;
  resetToDemoData: () => void;
  students: Student[];
  skills: Skill[];
  toggleBookmarkSkill: (skillId: string) => void;
  sessions: Session[];
  bookSession: (newSession: Omit<Session, 'id'>) => void;
  cancelSession: (sessionId: string) => void;
  connections: ActiveConnection[];
  incomingRequests: ConnectionRequest[];
  sentRequests: any[];
  acceptIncomingRequest: (requestId: string) => void;
  declineIncomingRequest: (requestId: string) => void;
  sendConnectionRequest: (studentId: string, note?: string) => void;
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
  unreadNotificationCount: number;
  unreadMessageCount: number;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  quickMatchOpen: boolean;
  setQuickMatchOpen: (open: boolean) => void;
  createRequestOpen: boolean;
  setCreateRequestOpen: (open: boolean) => void;
  selectedPreviewStudent: Student | null;
  setSelectedPreviewStudent: (student: Student | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<Student>(() => {
    const saved = localStorage.getItem('skillsync_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id.trim() !== '') return parsed;
      } catch (_) {}
    }
    return CURRENT_USER;
  });

  // Students list (10 demo peer profiles)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('skillsync_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      } catch (_) {}
    }
    return MOCK_STUDENTS;
  });

  // Skills
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('skillsync_skills');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      } catch (_) {}
    }
    return MOCK_SKILLS;
  });

  // Sessions
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('skillsync_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (_) {}
    }
    return MOCK_SESSIONS;
  });

  // Connections
  const [connections, setConnections] = useState<ActiveConnection[]>(() => {
    const saved = localStorage.getItem('skillsync_connections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (_) {}
    }
    return MOCK_ACTIVE_CONNECTIONS;
  });

  // Incoming Requests
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('skillsync_incoming_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (_) {}
    }
    return MOCK_INCOMING_REQUESTS;
  });

  // Sent Requests
  const [sentRequests, setSentRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('skillsync_sent_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (_) {}
    }
    return MOCK_SENT_REQUESTS;
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('skillsync_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('conv_elena');

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS);

  // Modal states
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [createRequestOpen, setCreateRequestOpen] = useState(false);
  const [selectedPreviewStudent, setSelectedPreviewStudent] = useState<Student | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('skillsync_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillsync_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('skillsync_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('skillsync_incoming_requests', JSON.stringify(incomingRequests));
  }, [incomingRequests]);

  useEffect(() => {
    localStorage.setItem('skillsync_sent_requests', JSON.stringify(sentRequests));
  }, [sentRequests]);

  useEffect(() => {
    localStorage.setItem('skillsync_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('skillsync_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('skillsync_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Actions
  const updateCurrentUser = (updated: Partial<Student>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    showToast('Profile updated successfully!', 'success');
  };

  const loginAsDemo = (studentId: string = 'student_alex') => {
    const targetStudent = students.find(s => s.id === studentId) || MOCK_STUDENTS.find(s => s.id === studentId) || CURRENT_USER;
    setCurrentUser(targetStudent);
    localStorage.setItem('skillsync_current_user', JSON.stringify(targetStudent));
    showToast(`Welcome back, ${targetStudent.name.split(' ')[0]}! Logged in as verified demo user (${targetStudent.university}).`, 'success');
  };

  const resetToDemoData = () => {
    localStorage.removeItem('skillsync_current_user');
    localStorage.removeItem('skillsync_students');
    localStorage.removeItem('skillsync_skills');
    localStorage.removeItem('skillsync_sessions');
    localStorage.removeItem('skillsync_connections');
    localStorage.removeItem('skillsync_incoming_requests');
    localStorage.removeItem('skillsync_sent_requests');
    localStorage.removeItem('skillsync_conversations');

    setCurrentUser(CURRENT_USER);
    setStudents(MOCK_STUDENTS);
    setSkills(MOCK_SKILLS);
    setSessions(MOCK_SESSIONS);
    setConnections(MOCK_ACTIVE_CONNECTIONS);
    setIncomingRequests(MOCK_INCOMING_REQUESTS);
    setSentRequests(MOCK_SENT_REQUESTS);
    setConversations(DEFAULT_CONVERSATIONS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    showToast('Platform reset to fresh 10-student demo dataset!', 'info');
  };

  const toggleBookmarkSkill = (skillId: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        const bookmarked = !s.bookmarked;
        showToast(bookmarked ? `Bookmarked "${s.title}"` : `Removed "${s.title}" from bookmarks`, 'info');
        return { ...s, bookmarked };
      }
      return s;
    }));
  };

  const bookSession = (newSessionData: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...newSessionData,
      id: 'session_' + Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    showToast(`Session scheduled with ${newSession.partnerName}!`, 'success');
  };

  const cancelSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'cancelled' } : s));
    showToast('Session cancelled', 'info');
  };

  const acceptIncomingRequest = (requestId: string) => {
    const req = incomingRequests.find(r => r.id === requestId);
    if (!req) return;

    // Remove from incoming requests
    setIncomingRequests(prev => prev.filter(r => r.id !== requestId));

    // Add to active connections
    const newConn: ActiveConnection = {
      id: 'conn_' + Date.now(),
      student: req.fromStudent,
      teachesYou: req.offeredSkills,
      learnsFromYou: req.desiredSkills,
      connectedSince: 'Today',
      rating: req.fromStudent.rating,
      activeSwap: true
    };

    setConnections(prev => [newConn, ...prev]);
    showToast(`Accepted exchange request from ${req.fromStudent.name}! You are now connected.`, 'success');
  };

  const declineIncomingRequest = (requestId: string) => {
    const req = incomingRequests.find(r => r.id === requestId);
    setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
    if (req) {
      showToast(`Declined request from ${req.fromStudent.name}`, 'info');
    }
  };

  const sendConnectionRequest = (studentId: string, note?: string) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    // Check if already connected or requested
    const alreadyConnected = connections.some(c => c.student.id === studentId);
    if (alreadyConnected) {
      showToast(`You are already connected with ${targetStudent.name}!`, 'info');
      return;
    }

    const alreadySent = sentRequests.some(r => r.toStudent?.id === studentId);
    if (alreadySent) {
      showToast(`A connection request has already been sent to ${targetStudent.name}`, 'info');
      return;
    }

    const newSentReq = {
      id: 'sent_' + Date.now(),
      toStudent: targetStudent,
      offeredSkills: currentUser.canTeach.map(s => s.skillName),
      desiredSkills: targetStudent.canTeach.map(s => s.skillName),
      message: note || `Hi ${targetStudent.name}, I'd love to connect and exchange peer learning sessions on SkillSync!`,
      sentDate: 'Just now',
      status: 'pending'
    };

    setSentRequests(prev => [newSentReq, ...prev]);
    showToast(`Exchange request sent to ${targetStudent.name}!`, 'success');
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text.trim(),
          lastMessageTime: newMessage.timestamp,
        };
      }
      return conv;
    }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;
  const unreadMessageCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        loginAsDemo,
        resetToDemoData,
        students,
        skills,
        toggleBookmarkSkill,
        sessions,
        bookSession,
        cancelSession,
        connections,
        incomingRequests,
        sentRequests,
        acceptIncomingRequest,
        declineIncomingRequest,
        sendConnectionRequest,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        notifications,
        markNotificationsAsRead,
        unreadNotificationCount,
        unreadMessageCount,
        toasts,
        showToast,
        dismissToast,
        quickMatchOpen,
        setQuickMatchOpen,
        createRequestOpen,
        setCreateRequestOpen,
        selectedPreviewStudent,
        setSelectedPreviewStudent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
