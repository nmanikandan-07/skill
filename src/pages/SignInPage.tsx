import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Layers, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  KeyRound,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, loginAsDemo, resetToDemoData, students } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick 1-click Demo Login as primary student (Alex Rivera)
  const handleQuickDemoLogin = (studentId: string = 'student_alex') => {
    loginAsDemo(studentId);
    navigate('/dashboard');
  };

  const handleAutofillCredentials = (targetEmail: string = 'alex.rivera@stanford.edu') => {
    setEmail(targetEmail);
    setPassword('demo123');
    showToast(`Autofilled demo credentials for ${targetEmail}`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both academic email and password', 'error');
      return;
    }

    // Try finding matching student by email, otherwise default to primary demo student
    const matched = students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      loginAsDemo(matched.id);
    } else {
      loginAsDemo('student_alex');
    }

    navigate('/dashboard');
  };

  const quickPersonas = [
    {
      id: 'student_alex',
      name: 'Alex Rivera',
      school: 'Stanford CS',
      email: 'alex.rivera@stanford.edu',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      badge: 'Primary Demo'
    },
    {
      id: 'student_sophia',
      name: 'Sophia Chen',
      school: 'UC Berkeley AI',
      email: 'sophia.chen@berkeley.edu',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      badge: 'Data Science'
    },
    {
      id: 'student_elena',
      name: 'Elena Rostova',
      school: 'Harvard Design',
      email: 'elena.rostova@harvard.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      badge: 'UI/UX Mentor'
    },
    {
      id: 'student_marcus',
      name: 'Marcus Vance',
      school: 'MIT Robotics',
      email: 'marcus.vance@mit.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      badge: 'C++ & ROS'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col justify-center py-12 px-6 sm:px-12">
      <div className="max-w-lg w-full mx-auto space-y-7">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-[#4F46E5]/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-[26px] font-extrabold text-[#10213A] tracking-tight">SkillSync</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] pt-3 tracking-tight">
            Sign In to Peer Network
          </h2>
          <p className="text-[14px] text-[#5E6680]">
            Verified academic skill exchange platform across top universities
          </p>
        </div>

        {/* 1-Click Fast Demo Login Callout */}
        <div className="bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#3730D3] rounded-2xl p-5 text-white shadow-elevated">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#A5B4FC]">
              <Zap className="w-4 h-4 text-[#FDE047]" />
              <span>Instant Evaluation Mode</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white">
              10 Demo Profiles Ready
            </span>
          </div>

          <p className="text-[13.5px] text-white/90 mb-3.5 leading-snug">
            Explore 10 student profiles, 12 skills, scheduled sessions, and exchange requests instantly.
          </p>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('student_alex')}
            className="w-full py-3 px-4 rounded-xl font-bold text-[14.5px] text-[#4F46E5] bg-white hover:bg-[#F8F9FF] active:bg-[#EEF2FF] shadow-sm transition-all flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-[#4F46E5] group-hover:scale-110 transition-transform" />
            <span>One-Click Demo Login (Alex Rivera • Stanford)</span>
            <ArrowRight className="w-4 h-4 text-[#4F46E5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Sign In Card */}
        <div className="ss-card p-7 sm:p-8 bg-white border border-[#E4E7F2] shadow-elevated space-y-6">
          <div className="flex items-center justify-between border-b border-[#F1F4F9] pb-3">
            <span className="text-[13px] font-semibold text-[#8992AA] uppercase tracking-wider">
              Or Sign In With Academic Credentials
            </span>
            <button
              type="button"
              onClick={() => handleAutofillCredentials('alex.rivera@stanford.edu')}
              className="text-[12px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Auto-fill Demo</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                Academic Email Address (.edu)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@stanford.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E7F2] text-[14px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-[#10213A]">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Demo mode: Password reset simulated. Use demo123 to log in.', 'info');
                  }}
                  className="text-[12px] font-medium text-[#4F46E5] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4E7F2] text-[14px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8992AA] hover:text-[#10213A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#5E6680]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#4F46E5] w-4 h-4"
                />
                <span>Remember me on this campus device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-[14px] text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-card transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to SkillSync</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Persona Switcher */}
          <div className="pt-4 border-t border-[#F1F4F9] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#5E6680] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Switch Demo Persona</span>
              </span>
              <span className="text-[11px] text-[#8992AA]">Click to sign in</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {quickPersonas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(persona.id)}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-[#E4E7F2] hover:border-[#4F46E5] hover:bg-[#EEF2FF]/40 text-left transition-all group"
                >
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E4E7F2]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#10213A] truncate group-hover:text-[#4F46E5]">
                      {persona.name}
                    </p>
                    <p className="text-[10.5px] text-[#8992AA] truncate">
                      {persona.school}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Demo Data & SSO Status */}
          <div className="pt-3 border-t border-[#F1F4F9] flex items-center justify-between text-[11.5px] text-[#5E6680]">
            <div className="flex items-center gap-1.5 text-[#087F5B] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
              <span>Stanford University SSO Connected</span>
            </div>
            <button
              type="button"
              onClick={resetToDemoData}
              className="text-[#8992AA] hover:text-[#DC2626] flex items-center gap-1 transition-colors"
              title="Reset all 10 students, skills, and mock sessions to original demo state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-[13.5px] text-[#5E6680]">
          Need to create a new peer account?{' '}
          <Link to="/register" className="font-semibold text-[#4F46E5] hover:underline">
            Register academic profile
          </Link>
        </p>
      </div>
    </div>
  );
};
