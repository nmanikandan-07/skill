import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  TrendingUp,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { StudentCard } from '../components/cards/StudentCard';
import { SessionCard } from '../components/cards/SessionCard';
import { IncomingRequestCard } from '../components/cards/IncomingRequestCard';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    connections, 
    sessions, 
    incomingRequests, 
    students,
    skills,
    setQuickMatchOpen,
    setCreateRequestOpen
  } = useApp();

  const navigate = useNavigate();

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').slice(0, 2);
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const recommendedPeers = students.filter(s => s.id !== currentUser.id && (s.matchScore || 0) >= 90).slice(0, 3);
  const recentSkills = skills.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Greeting and Academic Term Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
              Welcome back, {(currentUser.name || 'Student').split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-[14.5px] text-[#5E6680] mt-1">
            Here's what is moving across your university peer learning network today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E4E7F2] text-[13px] font-medium text-[#5E6680] shadow-2xs">
            <span className="inline-block w-2 h-2 rounded-full bg-[#087F5B] mr-2" />
            Fall 2026 Term • Week 7
          </div>

          <button
            onClick={() => setCreateRequestOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Connections */}
        <div className="ss-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5E6680]">Active Connections</span>
            <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#10213A]">
            {connections.length}
          </div>
          <span className="text-[12px] text-[#087F5B] font-medium block">
            {connections.length > 0 ? `+${connections.length} active partnerships` : '0 active partnerships'}
          </span>
        </div>

        {/* Upcoming Sessions */}
        <div className="ss-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5E6680]">Upcoming Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-[#D9F4E9] text-[#087F5B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#10213A]">
            {upcomingSessions.length}
          </div>
          <span className="text-[12px] text-[#5E6680] font-medium block">
            {upcomingSessions.length > 0 ? `${upcomingSessions[0].date} at ${upcomingSessions[0].time}` : 'No upcoming sessions'}
          </span>
        </div>

        {/* Pending Requests */}
        <div className="ss-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5E6680]">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#10213A]">
            {incomingRequests.length}
          </div>
          <span className="text-[12px] text-[#D97706] font-medium block">
            {incomingRequests.length > 0 ? 'Awaiting your response' : 'No pending requests'}
          </span>
        </div>

        {/* Skills Shared */}
        <div className="ss-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5E6680]">Skills Shared</span>
            <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#10213A]">
            {currentUser.canTeach?.length || 0}
          </div>
          <span className="text-[12px] text-[#7C3AED] font-medium block">
            {currentUser.reviewCount ? `${currentUser.reviewCount} verified peer reviews` : '0 peer reviews'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left 2 columns / Right 1 column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recommended Peer Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[19px] font-bold text-[#10213A]">Recommended Peer Matches</h2>
                <p className="text-[13px] text-[#5E6680]">Students offering skills you want to learn</p>
              </div>
              <Link
                to="/find-partners"
                className="text-[13.5px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recommendedPeers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedPeers.map(student => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            ) : (
              <div className="ss-card p-8 text-center bg-white">
                <Users className="w-10 h-10 text-[#8992AA] mx-auto mb-2 opacity-50" />
                <h3 className="font-semibold text-[#10213A]">No recommended peer matches yet</h3>
                <p className="text-[13px] text-[#5E6680] mt-1">Connect with students across campuses or update your learning goals to find mutual matches.</p>
              </div>
            )}
          </div>

          {/* Upcoming Sessions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[19px] font-bold text-[#10213A]">Upcoming Sessions</h2>
                <p className="text-[13px] text-[#5E6680]">Confirmed 1-on-1 peer exchanges</p>
              </div>
              <Link
                to="/sessions"
                className="text-[13.5px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                <span>Manage Sessions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="ss-card p-8 text-center bg-white">
                <Calendar className="w-10 h-10 text-[#8992AA] mx-auto mb-2" />
                <h3 className="font-semibold text-[#10213A]">No upcoming sessions scheduled</h3>
                <p className="text-[13px] text-[#5E6680] mt-1">Book a 1-on-1 exchange with one of your connected partners.</p>
                <button
                  onClick={() => navigate('/sessions')}
                  className="mt-4 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#4F46E5]"
                >
                  Schedule Session
                </button>
              </div>
            )}
          </div>

          {/* Incoming Requests Section (if any) */}
          {incomingRequests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[19px] font-bold text-[#10213A]">
                    Incoming Exchange Requests ({incomingRequests.length})
                  </h2>
                  <p className="text-[13px] text-[#5E6680]">Review skills offered by other students</p>
                </div>
                <Link
                  to="/connections?tab=requests"
                  className="text-[13.5px] font-semibold text-[#4F46E5] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {incomingRequests.slice(0, 1).map(req => (
                  <IncomingRequestCard key={req.id} request={req} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Profile Strength, Quick Actions, Learning Progress */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="ss-card p-6 bg-white space-y-3">
            <h3 className="font-bold text-[16px] text-[#10213A]">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                onClick={() => setQuickMatchOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] text-[13.5px] font-semibold transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                  <span>Run Mutual Match</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/find-partners')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E4E7F2] bg-white hover:bg-[#F8F9FF] text-[#10213A] text-[13.5px] font-medium transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#5E6680]" />
                  <span>Find Skill Partners</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8992AA]" />
              </button>

              <button
                onClick={() => navigate('/explore-skills')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E4E7F2] bg-white hover:bg-[#F8F9FF] text-[#10213A] text-[13.5px] font-medium transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-[#5E6680]" />
                  <span>Explore Skills Catalogue</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8992AA]" />
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E4E7F2] bg-white hover:bg-[#F8F9FF] text-[#10213A] text-[13.5px] font-medium transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#5E6680]" />
                  <span>Manage My Skills</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8992AA]" />
              </button>
            </div>
          </div>

          {/* Profile Strength & Verification Status */}
          <div className="ss-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#10213A]">Profile Strength</h3>
              <span className="text-[14px] font-bold text-[#087F5B]">92%</span>
            </div>

            <div className="w-full bg-[#E4E7F2] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#087F5B] h-full rounded-full transition-all" style={{ width: '92%' }} />
            </div>

            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center gap-2 text-[#087F5B]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>University SSO email verified</span>
              </div>
              <div className="flex items-center gap-2 text-[#087F5B]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>3 skills offered for exchange</span>
              </div>
              <div className="flex items-center gap-2 text-[#087F5B]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Weekly availability configured</span>
              </div>
              <div className="flex items-center gap-2 text-[#5E6680]">
                <span className="w-4 h-4 rounded-full border border-[#8992AA] flex items-center justify-center text-[10px]">○</span>
                <span>Connect GitHub or portfolio repo</span>
              </div>
            </div>
          </div>

          {/* Recently Explored Skills */}
          <div className="ss-card p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#10213A]">Trending on Campus</h3>
              <Link to="/explore-skills" className="text-[12px] font-semibold text-[#4F46E5] hover:underline">
                Explore →
              </Link>
            </div>

            <div className="divide-y divide-[#F1F4F9]">
              {recentSkills.map(skill => (
                <div
                  key={skill.id}
                  onClick={() => navigate('/explore-skills')}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#F8F9FF] px-1 rounded-lg transition-colors"
                >
                  <div>
                    <h5 className="font-semibold text-[13.5px] text-[#10213A]">{skill.title}</h5>
                    <p className="text-[11.5px] text-[#8992AA]">{skill.category} • {skill.mentorCount} mentors</p>
                  </div>
                  <span className="text-[12px] font-bold text-[#F59E0B]">★ {skill.rating.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
