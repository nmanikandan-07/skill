import React from 'react';
import { Session } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  FileText
} from 'lucide-react';

interface SessionCardProps {
  session: Session;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { cancelSession, showToast, setSelectedPreviewStudent, students } = useApp();

  const partnerStudent = students.find(s => s.id === session.partnerId);

  const getStatusBadge = () => {
    switch (session.status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold text-[#087F5B] bg-[#D9F4E9] border border-[#A7F3D0]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            CONFIRMED
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A]">
            <AlertCircle className="w-3.5 h-3.5" />
            PENDING APPROVAL
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold text-[#5E6680] bg-[#F1F4F9] border border-[#E4E7F2]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            COMPLETED
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]">
            <XCircle className="w-3.5 h-3.5" />
            CANCELLED
          </span>
        );
    }
  };

  const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="ss-card ss-card-hover p-6 bg-white transition-all space-y-4">
      {/* Top Header: Partner info + Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={session.partnerAvatar}
            alt={session.partnerName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E4E7F2] cursor-pointer"
            onClick={() => partnerStudent && setSelectedPreviewStudent(partnerStudent)}
          />
          <div>
            <h4
              className="font-bold text-[15.5px] text-[#10213A] hover:text-[#4F46E5] cursor-pointer"
              onClick={() => partnerStudent && setSelectedPreviewStudent(partnerStudent)}
            >
              {session.partnerName}
            </h4>
            <p className="text-[12px] text-[#5E6680]">
              {session.role === 'mentor' ? 'Mentoring' : session.role === 'learner' ? 'Learning from' : 'Skill Swap with'}{' '}
              {session.partnerMajor}
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* Topic Title */}
      <div>
        <h3 className="font-bold text-[16px] text-[#10213A] leading-snug">
          {session.topic}
        </h3>
        {session.notes && (
          <p className="text-[13px] text-[#5E6680] mt-1 line-clamp-2">
            {session.notes}
          </p>
        )}
      </div>

      {/* Date, Time, Duration & Format Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2] text-[13px]">
        <div className="flex items-center gap-2 text-[#10213A] font-medium">
          <CalendarIcon className="w-4 h-4 text-[#4F46E5] shrink-0" />
          <span>{formattedDate} • {session.time}</span>
        </div>

        <div className="flex items-center gap-2 text-[#5E6680]">
          <Clock className="w-4 h-4 text-[#8992AA] shrink-0" />
          <span>{session.duration} minutes scheduled</span>
        </div>

        <div className="sm:col-span-2 flex items-center gap-2 text-[12.5px] text-[#5E6680]">
          {session.format === 'virtual' ? (
            <Video className="w-4 h-4 text-[#4F46E5] shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-[#087F5B] shrink-0" />
          )}
          <span className="truncate">{session.locationDetails || (session.format === 'virtual' ? 'Virtual Google Meet' : 'Campus Main Library')}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {session.status === 'upcoming' && (
            <a
              href={session.meetingLink || '#'}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (!session.meetingLink) {
                  e.preventDefault();
                  showToast('Meeting link will activate 10 minutes prior to session', 'info');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-xs transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Join Call</span>
            </a>
          )}

          <button
            onClick={() => showToast('Calendar invitation (.ics) downloaded', 'info')}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[12.5px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] border border-[#E4E7F2] transition-all"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Invite</span>
          </button>
        </div>

        {session.status !== 'completed' && session.status !== 'cancelled' && (
          <button
            onClick={() => cancelSession(session.id)}
            className="text-[12.5px] text-[#DC2626] hover:underline px-2 py-1"
          >
            Cancel Session
          </button>
        )}
      </div>
    </div>
  );
};
