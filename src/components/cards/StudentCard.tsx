import React from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Star, Sparkles, Check, Clock } from 'lucide-react';

interface StudentCardProps {
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const { 
    connections, 
    sentRequests, 
    sendConnectionRequest, 
    setSelectedPreviewStudent 
  } = useApp();

  const isConnected = connections.some(c => c.student.id === student.id);
  const isPending = sentRequests.some(r => r.toStudent?.id === student.id);

  return (
    <div className="ss-card ss-card-hover p-6 flex flex-col justify-between h-full bg-white transition-all">
      <div>
        {/* Top Header: Avatar & Match Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-13 h-13 rounded-full object-cover ring-2 ring-[#E4E7F2]"
              />
              {student.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#087F5B] ring-2 ring-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[16px] text-[#10213A] hover:text-[#4F46E5] cursor-pointer transition-colors"
                  onClick={() => setSelectedPreviewStudent(student)}
                >
                  {student.name}
                </h3>
                {student.verified && (
                  <span title="SSO Verified Student">
                    <ShieldCheck className="w-4 h-4 text-[#4F46E5] shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-[12.5px] text-[#5E6680] font-medium leading-tight mt-0.5">
                {student.major} • {(student.year || '').split(' ')[0]}
              </p>
              <p className="text-[12px] text-[#8992AA] leading-tight mt-0.5">
                {student.university}
              </p>
            </div>
          </div>

          {student.matchScore && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] shrink-0">
              <Sparkles className="w-3 h-3 text-[#4F46E5]" />
              {student.matchScore}% Match
            </span>
          )}
        </div>

        {/* Rating & Availability */}
        <div className="flex items-center gap-3 text-[12.5px] pb-3 mb-3 border-b border-[#F1F4F9]">
          <div className="flex items-center gap-1 text-[#F59E0B] font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
            <span>{student.rating.toFixed(1)}</span>
            <span className="text-[#8992AA] font-normal">({student.reviewCount})</span>
          </div>
          <span className="text-[#E4E7F2]">•</span>
          <div className="flex items-center gap-1 text-[#5E6680]">
            <Clock className="w-3.5 h-3.5 text-[#8992AA]" />
            <span>~{student.weeklyHours || 3}h / week</span>
          </div>
        </div>

        {/* Student Bio */}
        <p className="text-[13px] text-[#5E6680] line-clamp-2 leading-relaxed mb-4">
          {student.bio}
        </p>

        {/* Skills Offered & Wanted */}
        <div className="space-y-2.5 mb-5">
          {/* Can Teach */}
          <div>
            <span className="text-[11px] font-bold text-[#087F5B] uppercase tracking-wider block mb-1">
              Can Teach
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.canTeach.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-[#D9F4E9] text-[#087F5B] border border-[#A7F3D0]/60"
                >
                  {skill.skillName}
                </span>
              ))}
              {student.canTeach.length > 2 && (
                <span className="px-1.5 py-1 text-[11px] text-[#8992AA]">
                  +{student.canTeach.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Wants to Learn */}
          <div>
            <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider block mb-1">
              Wants to Learn
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.wantsToLearn.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/60"
                >
                  {skill.skillName}
                </span>
              ))}
              {student.wantsToLearn.length > 2 && (
                <span className="px-1.5 py-1 text-[11px] text-[#8992AA]">
                  +{student.wantsToLearn.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#F1F4F9] grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setSelectedPreviewStudent(student)}
          className="w-full py-2 px-3 text-center text-[13px] font-medium text-[#5E6680] hover:text-[#10213A] bg-white hover:bg-[#F8F9FF] border border-[#E4E7F2] rounded-xl transition-all"
        >
          View Profile
        </button>

        {isConnected ? (
          <button
            disabled
            className="w-full py-2 px-3 text-center text-[13px] font-medium text-[#087F5B] bg-[#D9F4E9] rounded-xl flex items-center justify-center gap-1 cursor-default"
          >
            <Check className="w-3.5 h-3.5" />
            Connected
          </button>
        ) : isPending ? (
          <button
            disabled
            className="w-full py-2 px-3 text-center text-[13px] font-medium text-[#D97706] bg-[#FEF3C7] rounded-xl flex items-center justify-center gap-1 cursor-default"
          >
            Pending
          </button>
        ) : (
          <button
            onClick={() => sendConnectionRequest(student.id)}
            className="w-full py-2 px-3 text-center text-[13px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] rounded-xl shadow-xs transition-all"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};
