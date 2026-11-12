import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, PlusCircle, Check } from 'lucide-react';

export const CreateRequestModal: React.FC = () => {
  const { 
    createRequestOpen, 
    setCreateRequestOpen, 
    currentUser, 
    showToast 
  } = useApp();

  const [desiredSkill, setDesiredSkill] = useState('');
  const [offeredSkill, setOfferedSkill] = useState(currentUser.canTeach[0]?.skillName || '');
  const [format, setFormat] = useState<'virtual' | 'in-person'>('virtual');
  const [urgency, setUrgency] = useState('This week');
  const [notes, setNotes] = useState('');

  if (!createRequestOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desiredSkill.trim()) {
      showToast('Please specify the skill you want to learn', 'error');
      return;
    }

    showToast(`Exchange request published for "${desiredSkill}"! Peers will be notified.`, 'success');
    setCreateRequestOpen(false);
    setDesiredSkill('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[20px] max-w-lg w-full border border-[#E4E7F2] shadow-dropdown overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E4E7F2] flex items-center justify-between bg-[#F8F9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-[#C7D2FE]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[18px] text-[#10213A]">Create Skill Exchange Request</h3>
              <p className="text-[12.5px] text-[#5E6680]">Broadcast what you want to learn and what you offer in return</p>
            </div>
          </div>
          <button
            onClick={() => setCreateRequestOpen(false)}
            className="p-1.5 text-[#8992AA] hover:text-[#10213A] rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
              Skill You Want to Learn *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Figma Auto-Layout, PyTorch Neural Networks..."
              value={desiredSkill}
              onChange={(e) => setDesiredSkill(e.target.value)}
              className="w-full text-[14px] px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
              Skill You Offer in Return
            </label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full text-[14px] px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none bg-white text-[#10213A]"
            >
              {currentUser.canTeach.map((s, idx) => (
                <option key={idx} value={s.skillName}>
                  {s.skillName} ({s.level})
                </option>
              ))}
              <option value="Other / Flexible Mutual Trade">Other / Flexible Mutual Trade</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                Preferred Format
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F4F9] rounded-xl text-[12.5px] font-medium text-center">
                <button
                  type="button"
                  onClick={() => setFormat('virtual')}
                  className={`py-1.5 rounded-lg transition-all ${
                    format === 'virtual' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#5E6680]'
                  }`}
                >
                  Virtual Call
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('in-person')}
                  className={`py-1.5 rounded-lg transition-all ${
                    format === 'in-person' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#5E6680]'
                  }`}
                >
                  On-Campus
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                Timeline
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full text-[13.5px] px-3 py-2 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none bg-white"
              >
                <option value="This week">This week</option>
                <option value="Next 2 weeks">Next 2 weeks</option>
                <option value="Flexible / Ongoing">Flexible / Ongoing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
              Project Challenge or Specific Agenda
            </label>
            <textarea
              rows={3}
              placeholder="Explain what specific challenges you want help debugging or mastering..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-[13.5px] px-3.5 py-2 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>

          {/* Academic zero fee reminder */}
          <p className="text-[11.5px] text-[#087F5B] bg-[#D9F4E9] p-2.5 rounded-xl font-medium flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Guaranteed 100% free under SkillSync Academic Honor Code. No currency or fees.</span>
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateRequestOpen(false)}
              className="px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-[13.5px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm"
            >
              Publish Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
