import React from 'react';
import { ConnectionRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, Check, X, ArrowLeftRight, Clock } from 'lucide-react';

interface IncomingRequestCardProps {
  request: ConnectionRequest;
}

export const IncomingRequestCard: React.FC<IncomingRequestCardProps> = ({ request }) => {
  const { fromStudent, offeredSkills, desiredSkills, message, timeReceived, matchPercentage } = request;
  const { acceptIncomingRequest, declineIncomingRequest, setSelectedPreviewStudent } = useApp();

  return (
    <div className="ss-card p-6 bg-white border border-[#E4E7F2] hover:border-[#D0D7E8] transition-all">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        {/* Left: Student Info & Message */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={fromStudent.avatar}
                alt={fromStudent.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E4E7F2]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4
                    className="font-bold text-[16px] text-[#10213A] hover:text-[#4F46E5] cursor-pointer"
                    onClick={() => setSelectedPreviewStudent(fromStudent)}
                  >
                    {fromStudent.name}
                  </h4>
                  {fromStudent.verified && (
                    <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                  )}
                </div>
                <p className="text-[12.5px] text-[#5E6680]">
                  {fromStudent.major} • {fromStudent.university}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE]">
                <Sparkles className="w-3.5 h-3.5" />
                {matchPercentage}% Match
              </span>
              <span className="text-[12px] text-[#8992AA] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeReceived}
              </span>
            </div>
          </div>

          {/* Proposal Message Preview */}
          <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]/80 text-[13.5px] text-[#5E6680] leading-relaxed">
            "{message}"
          </div>

          {/* Skill Proposal Exchange Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-bold text-[#087F5B] uppercase">Offers:</span>
              {offeredSkills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#D9F4E9] text-[#087F5B]">
                  {s}
                </span>
              ))}
            </div>

            <ArrowLeftRight className="w-3.5 h-3.5 text-[#8992AA]" />

            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-bold text-[#4F46E5] uppercase">Wants:</span>
              {desiredSkills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EEF2FF] text-[#4F46E5]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex md:flex-col items-center justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1F4F9]">
          <button
            onClick={() => acceptIncomingRequest(request.id)}
            className="flex-1 md:w-36 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-white bg-[#087F5B] hover:bg-[#076a4c] shadow-xs transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Accept Exchange</span>
          </button>

          <button
            onClick={() => declineIncomingRequest(request.id)}
            className="flex-1 md:w-36 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#DC2626] bg-white border border-[#FECACA] hover:bg-[#FEF2F2] transition-all"
          >
            <X className="w-4 h-4" />
            <span>Decline</span>
          </button>

          <button
            onClick={() => setSelectedPreviewStudent(fromStudent)}
            className="w-full text-center text-[12px] font-medium text-[#5E6680] hover:text-[#10213A] py-1"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};
