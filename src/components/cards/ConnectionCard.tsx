import React, { useState } from 'react';
import { ActiveConnection } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Calendar, 
  MoreVertical, 
  ArrowLeftRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConnectionCardProps {
  connection: ActiveConnection;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const { student, teachesYou, learnsFromYou, connectedSince, lastSessionDate, rating } = connection;
  const { setSelectedPreviewStudent, showToast } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ss-card ss-card-hover p-6 flex flex-col justify-between bg-white transition-all relative">
      <div>
        {/* Header: Avatar, Name, Badge */}
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
                <h3
                  className="font-bold text-[16px] text-[#10213A] hover:text-[#4F46E5] cursor-pointer transition-colors"
                  onClick={() => setSelectedPreviewStudent(student)}
                >
                  {student.name}
                </h3>
                {student.verified && (
                  <ShieldCheck className="w-4 h-4 text-[#4F46E5] shrink-0" />
                )}
              </div>
              <p className="text-[12.5px] text-[#5E6680] leading-tight mt-0.5">
                {student.university}
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#087F5B] bg-[#D9F4E9] border border-[#A7F3D0]">
              <ArrowLeftRight className="w-3 h-3" />
              Active Swap
            </span>
          </div>
        </div>

        {/* Rating and Connection Time */}
        <div className="flex items-center justify-between text-[12.5px] pb-3 mb-3 border-b border-[#F1F4F9]">
          <div className="flex items-center gap-1 text-[#F59E0B] font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-[#8992AA] font-normal">• Active Partner</span>
          </div>
          <span className="text-[11.5px] text-[#8992AA]">Since {connectedSince}</span>
        </div>

        {/* Mutual Exchange Skill Tags */}
        <div className="space-y-2.5 mb-5">
          {/* Teaches You */}
          <div>
            <span className="text-[11px] font-bold text-[#087F5B] uppercase tracking-wider block mb-1">
              Teaches You
            </span>
            <div className="flex flex-wrap gap-1.5">
              {teachesYou.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-[#D9F4E9] text-[#087F5B] border border-[#A7F3D0]/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Learns From You */}
          <div>
            <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider block mb-1">
              Learns From You
            </span>
            <div className="flex flex-wrap gap-1.5">
              {learnsFromYou.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {lastSessionDate && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#8992AA] mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Last session: {lastSessionDate}</span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-[#F1F4F9] grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate(`/messages?partner=${student.id}`)}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[13px] font-medium text-[#5E6680] hover:text-[#10213A] bg-white hover:bg-[#F8F9FF] border border-[#E4E7F2] rounded-xl transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Message</span>
        </button>

        <button
          onClick={() => navigate(`/sessions?partner=${student.id}`)}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[13px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] rounded-xl shadow-xs transition-all"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule</span>
        </button>
      </div>
    </div>
  );
};
