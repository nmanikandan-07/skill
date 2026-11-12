import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, CheckCircle2, ArrowRightLeft, ShieldCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickMatchModal: React.FC = () => {
  const { 
    quickMatchOpen, 
    setQuickMatchOpen, 
    currentUser, 
    students, 
    sendConnectionRequest,
    showToast 
  } = useApp();

  const navigate = useNavigate();
  const [matchIndex, setMatchIndex] = useState(0);
  const [note, setNote] = useState('');

  if (!quickMatchOpen) return null;

  // Find top matching students
  const matches = students.filter(s => s.id !== currentUser.id && (s.matchScore || 0) >= 88);
  const matchedStudent = matches[matchIndex % matches.length] || students[0];

  const handleSendMatchRequest = () => {
    sendConnectionRequest(matchedStudent.id, note);
    setQuickMatchOpen(false);
    setNote('');
  };

  const handleBookDirect = () => {
    setQuickMatchOpen(false);
    navigate(`/sessions?partner=${matchedStudent.id}`);
    showToast(`Opening schedule with ${matchedStudent.name}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[20px] max-w-lg w-full border border-[#E4E7F2] shadow-dropdown overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E4E7F2] flex items-center justify-between bg-[#F8F9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-[#C7D2FE]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[18px] text-[#10213A]">AI Mutual Match Finder</h3>
              <p className="text-[12.5px] text-[#5E6680]">Complementary skills detected based on your learning goals</p>
            </div>
          </div>
          <button
            onClick={() => setQuickMatchOpen(false)}
            className="p-1.5 text-[#8992AA] hover:text-[#10213A] rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Match Score Badge */}
          <div className="flex items-center justify-between bg-[#D9F4E9] border border-[#A7F3D0] px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2 text-[#087F5B] text-[13.5px] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{matchedStudent.matchScore}% Perfect Skill Complement</span>
            </div>
            <button
              onClick={() => setMatchIndex(prev => prev + 1)}
              className="text-[12px] font-medium text-[#087F5B] hover:underline"
            >
              Next match →
            </button>
          </div>

          {/* Student Profile Card */}
          <div className="p-4 rounded-xl border border-[#E4E7F2] bg-[#F7F8FF] space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={matchedStudent.avatar}
                  alt={matchedStudent.name}
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-[#4F46E5]/20"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#087F5B] ring-2 ring-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-[16px] text-[#10213A] truncate">{matchedStudent.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-[#4F46E5] shrink-0" />
                </div>
                <p className="text-[12.5px] text-[#5E6680] truncate">{matchedStudent.major} • {matchedStudent.university}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#F59E0B] font-medium">
                  <span>★ {matchedStudent.rating.toFixed(1)}</span>
                  <span className="text-[#8992AA]">({matchedStudent.reviewCount} peer sessions)</span>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-[#5E6680] line-clamp-2 italic">
              "{matchedStudent.bio}"
            </p>
          </div>

          {/* Mutual Exchange Diagram */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white border border-[#E4E7F2]">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#087F5B] uppercase tracking-wider block">
                They Teach You
              </span>
              <p className="text-[13px] font-semibold text-[#10213A] line-clamp-1">
                {matchedStudent.canTeach[0]?.skillName || 'Design'}
              </p>
              <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-[#D9F4E9] text-[#087F5B]">
                {matchedStudent.canTeach[0]?.level || 'Expert'}
              </span>
            </div>

            <div className="space-y-1 border-l border-[#E4E7F2] pl-3">
              <span className="text-[11px] font-semibold text-[#4F46E5] uppercase tracking-wider block">
                You Teach Them
              </span>
              <p className="text-[13px] font-semibold text-[#10213A] line-clamp-1">
                {currentUser.canTeach[0]?.skillName || 'React & Node'}
              </p>
              <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#4F46E5]">
                {currentUser.canTeach[0]?.level || 'Advanced'}
              </span>
            </div>
          </div>

          {/* Quick Note Input */}
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-[#5E6680]">Optional Intro Note</label>
            <input
              type="text"
              placeholder={`Hi ${matchedStudent.name}, let's swap skills this week!`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-[13.5px] px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-[#E4E7F2] bg-[#F8F9FF] flex items-center justify-between gap-3">
          <button
            onClick={handleBookDirect}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#4F46E5] bg-white border border-[#E4E7F2] hover:bg-[#EEF2FF] transition-all"
          >
            <Calendar className="w-4 h-4 text-[#4F46E5]" />
            <span>Book Directly</span>
          </button>

          <button
            onClick={handleSendMatchRequest}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Connect & Propose Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
