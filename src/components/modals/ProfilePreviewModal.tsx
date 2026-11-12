import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Calendar, 
  MessageSquare, 
  Github, 
  Linkedin, 
  Globe,
  GraduationCap,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePreviewModal: React.FC = () => {
  const { 
    selectedPreviewStudent, 
    setSelectedPreviewStudent, 
    sendConnectionRequest,
    showToast 
  } = useApp();

  const navigate = useNavigate();

  if (!selectedPreviewStudent) return null;
  const s = selectedPreviewStudent;

  const handleSchedule = () => {
    setSelectedPreviewStudent(null);
    navigate(`/sessions?partner=${s.id}`);
    showToast(`Scheduling session with ${s.name}`, 'info');
  };

  const handleMessage = () => {
    setSelectedPreviewStudent(null);
    navigate(`/messages?partner=${s.id}`);
  };

  const handleConnect = () => {
    sendConnectionRequest(s.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[22px] max-w-2xl w-full border border-[#E4E7F2] shadow-dropdown overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner with Avatar */}
        <div className="relative bg-gradient-to-r from-[#EEF2FF] via-[#F7F8FF] to-[#E5EDFF] px-7 pt-8 pb-6 border-b border-[#E4E7F2]">
          <button
            onClick={() => setSelectedPreviewStudent(null)}
            className="absolute top-4 right-4 p-2 text-[#5E6680] hover:text-[#10213A] bg-white/80 hover:bg-white rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={s.avatar}
                alt={s.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              {s.online && (
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#087F5B] ring-2 ring-white" title="Online now" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-[22px] font-bold text-[#10213A]">{s.name}</h2>
                {s.verified && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#087F5B] bg-[#D9F4E9] px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SSO Verified
                  </span>
                )}
                {s.matchScore && (
                  <span className="text-[12px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#C7D2FE]">
                    {s.matchScore}% Match
                  </span>
                )}
              </div>

              <p className="text-[14px] text-[#5E6680] mt-0.5">
                {s.major} • {s.year}
              </p>
              <p className="text-[13px] text-[#8992AA] font-medium flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-4 h-4 text-[#4F46E5]" />
                {s.university}
              </p>

              <div className="flex items-center gap-4 mt-2.5 text-[13px]">
                <div className="flex items-center gap-1 text-[#F59E0B] font-semibold">
                  <Star className="w-4 h-4 fill-[#F59E0B]" />
                  <span>{s.rating.toFixed(1)}</span>
                  <span className="text-[#8992AA] font-normal">({s.reviewCount} peer reviews)</span>
                </div>
                {s.showGpa && s.gpa && (
                  <span className="text-[#5E6680] font-medium">
                    GPA: <strong className="text-[#10213A]">{s.gpa.toFixed(2)}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Details */}
        <div className="p-7 overflow-y-auto space-y-6">
          {/* Bio */}
          <div>
            <h4 className="text-[14px] font-bold text-[#10213A] uppercase tracking-wider text-[11px] text-[#8992AA] mb-2">
              About & Learning Philosophy
            </h4>
            <p className="text-[14.5px] text-[#5E6680] leading-relaxed">
              {s.bio}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Can Teach */}
            <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold text-[#087F5B] uppercase tracking-wider">
                  Can Teach ({s.canTeach.length})
                </span>
                <span className="text-[11px] text-[#8992AA]">Verified Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.canTeach.map((st, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#A7F3D0] text-[12.5px] text-[#087F5B] font-medium shadow-2xs">
                    <span>{st.skillName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D9F4E9] text-[#087F5B] font-bold">
                      {st.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wants to Learn */}
            <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold text-[#4F46E5] uppercase tracking-wider">
                  Wants to Learn ({s.wantsToLearn.length})
                </span>
                <span className="text-[11px] text-[#8992AA]">Looking For</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.wantsToLearn.map((st, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#C7D2FE] text-[12.5px] text-[#4F46E5] font-medium shadow-2xs">
                    <span>{st.skillName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] font-bold">
                      {st.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Availability & Social Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E4E7F2]">
            <div className="flex items-center gap-2 text-[13px] text-[#5E6680]">
              <Clock className="w-4 h-4 text-[#8992AA]" />
              <span>Available ~{s.weeklyHours || 4} hrs/week • Virtual & In-Person</span>
            </div>

            <div className="flex items-center gap-2">
              {s.socialLinks?.github && (
                <a
                  href={s.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl text-[#5E6680] hover:text-[#10213A] hover:bg-[#F1F4F9] border border-[#E4E7F2]"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {s.socialLinks?.linkedin && (
                <a
                  href={s.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl text-[#5E6680] hover:text-[#10213A] hover:bg-[#F1F4F9] border border-[#E4E7F2]"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {s.socialLinks?.portfolio && (
                <a
                  href={s.socialLinks.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl text-[#5E6680] hover:text-[#10213A] hover:bg-[#F1F4F9] border border-[#E4E7F2]"
                  title="Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 px-7 border-t border-[#E4E7F2] bg-[#F8F9FF] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleConnect}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#4F46E5] bg-white border border-[#E4E7F2] hover:bg-[#EEF2FF] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Connect</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleMessage}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#5E6680] bg-white border border-[#E4E7F2] hover:text-[#10213A] hover:bg-[#F8F9FF] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>

            <button
              onClick={handleSchedule}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
