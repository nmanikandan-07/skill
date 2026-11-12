import { ActiveConnection, ConnectionRequest } from '../types';
import { MOCK_STUDENTS } from './students';

const studentSophia = MOCK_STUDENTS.find(s => s.id === 'student_sophia')!;
const studentMarcus = MOCK_STUDENTS.find(s => s.id === 'student_marcus')!;
const studentElena = MOCK_STUDENTS.find(s => s.id === 'student_elena')!;
const studentJordan = MOCK_STUDENTS.find(s => s.id === 'student_jordan')!;
const studentZoe = MOCK_STUDENTS.find(s => s.id === 'student_zoe')!;
const studentMaya = MOCK_STUDENTS.find(s => s.id === 'student_maya')!;

export const MOCK_INCOMING_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req_sophia',
    fromStudent: studentSophia,
    offeredSkills: ['Machine Learning with PyTorch', 'Python & Scientific Computing'],
    desiredSkills: ['React & Next.js', 'UI/UX & Design Systems'],
    message: "Hey Alex! I saw your experience in frontend engineering and React. I'm training multi-modal computer vision models at Berkeley and would love to swap PyTorch hands-on sessions for React architecture coaching!",
    timeReceived: '2 hours ago',
    matchPercentage: 96,
    status: 'pending'
  },
  {
    id: 'req_marcus',
    fromStudent: studentMarcus,
    offeredSkills: ['C++ Systems Programming', 'ROS & Robotics Simulation'],
    desiredSkills: ['TypeScript & Node.js', 'React & Next.js'],
    message: "Hi Alex! Building a telemetry web dashboard for our MIT robotics lab rover. Would be awesome to trade low-level C++ systems guidance for your TypeScript/React expertise.",
    timeReceived: 'Yesterday',
    matchPercentage: 92,
    status: 'pending'
  }
];

export const MOCK_ACTIVE_CONNECTIONS: ActiveConnection[] = [
  {
    id: 'conn_elena',
    student: studentElena,
    teachesYou: ['UI/UX & Design Systems', 'Figma Prototyping & Tokens'],
    learnsFromYou: ['TypeScript & Node.js', 'React & Next.js'],
    connectedSince: '3 weeks ago',
    lastSessionDate: 'Yesterday',
    rating: 5.0,
    activeSwap: true
  },
  {
    id: 'conn_jordan',
    student: studentJordan,
    teachesYou: ['Backend Architecture with Node.js', 'Cloud Infrastructure & Docker'],
    learnsFromYou: ['React & Next.js', 'Data Structures & Algorithms'],
    connectedSince: '1 month ago',
    lastSessionDate: '4 days ago',
    rating: 4.9,
    activeSwap: true
  },
  {
    id: 'conn_zoe',
    student: studentZoe,
    teachesYou: ['Conversational Japanese & JLPT'],
    learnsFromYou: ['Data Structures & Algorithms'],
    connectedSince: '2 weeks ago',
    lastSessionDate: 'Last week',
    rating: 5.0,
    activeSwap: true
  }
];

export const MOCK_SENT_REQUESTS: any[] = [
  {
    id: 'sent_maya',
    toStudent: studentMaya,
    offeredSkills: ['React & Next.js', 'TypeScript & Node.js'],
    desiredSkills: ['Cybersecurity & Ethical Hacking'],
    message: "Hi Maya! I'm really curious to learn practical network defense and secure coding practices. Let me know if you'd like to collaborate!",
    sentDate: '2 days ago',
    status: 'pending'
  }
];
