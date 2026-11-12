import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Check, 
  ArrowRightLeft, 
  Info, 
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CalendarGrid } from '../components/sessions/CalendarGrid';
import { SessionCard } from '../components/cards/SessionCard';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const SessionsPage: React.FC = () => {
  const { students, sessions, bookSession, currentUser, showToast } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPartnerId = searchParams.get('partner') || '';

  // Selected partner for booking
  const [selectedPartnerId, setSelectedPartnerId] = useState(initialPartnerId);
  const selectedPartner = students.find(s => s.id === selectedPartnerId) || students[0];

  // Right column tab
  const [sessionsTab, setSessionsTab] = useState<'upcoming' | 'pending' | 'completed'>('upcoming');

  // Scheduling Form State
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<30 | 45 | 60 | 90>(45);
  const [format, setFormat] = useState<'virtual' | 'in-person'>('virtual');
  const [locationDetails, setLocationDetails] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-28');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [agenda, setAgenda] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // Oct 2026

  const availableSlots = [
    '09:30 AM',
    '11:00 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) {
      showToast('Please select a student partner to schedule a session with', 'error');
      return;
    }
    if (!topic.trim()) {
      showToast('Please enter a session topic or challenge', 'error');
      return;
    }

    bookSession({
      partnerId: selectedPartner.id,
      partnerName: selectedPartner.name,
      partnerAvatar: selectedPartner.avatar,
      partnerMajor: selectedPartner.major,
      partnerUniversity: selectedPartner.university,
      role: 'exchange',
      topic: topic.trim(),
      date: selectedDate,
      time: selectedTime,
      duration,
      format,
      locationDetails: format === 'virtual' ? 'Google Meet (Link will generate)' : (locationDetails || 'Main Campus Library, Study Room B'),
      status: 'upcoming',
      notes: agenda.trim() || undefined,
      meetingLink: format === 'virtual' ? 'https://meet.google.com/xyz-skillsync' : undefined
    });

    setTopic('');
    setAgenda('');
    showToast(`Session successfully scheduled with ${selectedPartner.name}!`, 'success');
  };

  const filteredSessions = sessions.filter(s => {
    if (sessionsTab === 'upcoming') return s.status === 'upcoming';
    if (sessionsTab === 'pending') return s.status === 'pending';
    return s.status === 'completed' || s.status === 'cancelled';
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[13px] text-[#5E6680]">
        <span className="hover:text-[#10213A] cursor-pointer">Sessions</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#8992AA]" />
        <span className="text-[#10213A] font-semibold">
          Schedule Session{selectedPartner ? ` with ${selectedPartner.name}` : ''}
        </span>
      </div>

      {/* Two Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Selected Student Profile & Scheduling Form */}
        <div className="lg:col-span-7 space-y-6">
          {!selectedPartner ? (
            <div className="ss-card p-12 text-center bg-white">
              <CalendarIcon className="w-12 h-12 text-[#8992AA] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#10213A]">No Partner Selected</h3>
              <p className="text-[14px] text-[#5E6680] mt-1 max-w-sm mx-auto">
                Connect with peer learners or explore students across campuses to schedule a 1-on-1 skill exchange session.
              </p>
              <button
                type="button"
                onClick={() => navigate('/find-partners')}
                className="mt-4 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-xs"
              >
                Find Skill Partners
              </button>
            </div>
          ) : (
            <>
              {/* Selected Student Profile Summary Card */}
              <div className="ss-card p-6 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedPartner.avatar}
                    alt={selectedPartner.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#E4E7F2]"
                  />
                  {selectedPartner.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#087F5B] ring-2 ring-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-[18px] text-[#10213A]">{selectedPartner.name}</h3>
                    {selectedPartner.verified && (
                      <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                    )}
                  </div>
                  <p className="text-[13px] text-[#5E6680]">
                    {selectedPartner.major} • {selectedPartner.university}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[12px] text-[#F59E0B] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    <span>{selectedPartner.rating.toFixed(1)}</span>
                    <span className="text-[#8992AA] font-normal">({selectedPartner.reviewCount} peer reviews)</span>
                  </div>
                </div>
              </div>

              {/* Partner Switcher Dropdown */}
              <div className="self-start sm:self-center">
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E4E7F2] text-[12.5px] font-medium text-[#10213A] bg-[#F8F9FF] focus:outline-none"
                >
                  {students.filter(s => s.id !== currentUser.id).map(s => (
                    <option key={s.id} value={s.id}>
                      Switch: {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mutual Trade Balance Indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE]/70 text-[12.5px]">
              <div className="flex items-center gap-2 text-[#4F46E5] font-semibold">
                <ArrowRightLeft className="w-4 h-4" />
                <span>1:1 Balanced Mutual Skill Exchange</span>
              </div>
              <span className="text-[#5E6680] font-medium">Zero Credits or Fees</span>
            </div>

            {/* What you learn / what you teach */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
              <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]">
                <span className="font-bold text-[#087F5B] uppercase block mb-1">You Learn From {selectedPartner.name.split(' ')[0]}</span>
                <span className="font-semibold text-[#10213A]">{selectedPartner.canTeach?.[0]?.skillName || 'Skill Exchange'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]">
                <span className="font-bold text-[#4F46E5] uppercase block mb-1">You Teach {(selectedPartner.name || 'Partner').split(' ')[0]}</span>
                <span className="font-semibold text-[#10213A]">{currentUser.canTeach?.[0]?.skillName || 'Skill Exchange'}</span>
              </div>
            </div>
          </div>

          {/* Scheduling Form */}
          <form onSubmit={handleBookingSubmit} className="ss-card p-6 sm:p-7 bg-white space-y-6">
            <h3 className="font-bold text-[18px] text-[#10213A]">Session Configuration</h3>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="block text-[13.5px] font-bold text-[#10213A]">
                Topic or Specific Challenge *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Figma Auto-Layout 5.0 and Component Tokens Walkthrough"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-[14px] px-4 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="block text-[13.5px] font-bold text-[#10213A]">
                Session Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[30, 45, 60, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur as any)}
                    className={`py-3 px-2 rounded-xl text-center border transition-all relative ${
                      duration === dur
                        ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] font-bold shadow-xs'
                        : 'border-[#E4E7F2] bg-white text-[#5E6680] hover:bg-[#F8F9FF]'
                    }`}
                  >
                    {dur === 45 && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-[#4F46E5] text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <span className="text-[15px] font-bold block">{dur} min</span>
                    <span className="text-[11px] opacity-80">Ideal swap</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting Format Cards */}
            <div className="space-y-2">
              <label className="block text-[13.5px] font-bold text-[#10213A]">
                Meeting Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('virtual')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    format === 'virtual'
                      ? 'border-[#4F46E5] bg-[#EEF2FF]'
                      : 'border-[#E4E7F2] bg-white hover:bg-[#F8F9FF]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${format === 'virtual' ? 'bg-[#4F46E5] text-white' : 'bg-[#F1F4F9] text-[#5E6680]'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[14px] text-[#10213A]">Virtual Video Call</h5>
                    <p className="text-[12px] text-[#5E6680] mt-0.5">Automated Google Meet link generated upon booking</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('in-person')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    format === 'in-person'
                      ? 'border-[#4F46E5] bg-[#EEF2FF]'
                      : 'border-[#E4E7F2] bg-white hover:bg-[#F8F9FF]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${format === 'in-person' ? 'bg-[#4F46E5] text-white' : 'bg-[#F1F4F9] text-[#5E6680]'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[14px] text-[#10213A]">Campus In-Person</h5>
                    <p className="text-[12px] text-[#5E6680] mt-0.5">Meet at student union, department lab, or campus library</p>
                  </div>
                </button>
              </div>

              {format === 'in-person' && (
                <input
                  type="text"
                  placeholder="Specify campus location (e.g. Green Library Room 310)"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  className="w-full mt-2 text-[13.5px] px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              )}
            </div>

            {/* Interactive Calendar Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[13.5px] font-bold text-[#10213A]">
                  Select Date
                </label>
                <span className="text-[12px] text-[#8992AA]">
                  Selected: <strong>{selectedDate}</strong>
                </span>
              </div>
              <CalendarGrid
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentMonth={currentMonth}
                onChangeMonth={setCurrentMonth}
              />
            </div>

            {/* Available Time Slots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[13.5px] font-bold text-[#10213A]">
                  Available Time Slots
                </label>
                <span className="text-[11.5px] text-[#8992AA]">
                  Timezone: Eastern Time (ET) • Automatically synced
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 rounded-xl text-[13px] font-semibold border transition-all ${
                      selectedTime === slot
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                        : 'bg-white border-[#E4E7F2] text-[#10213A] hover:bg-[#EEF2FF] hover:border-[#C7D2FE]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Agenda & Notes */}
            <div className="space-y-1.5">
              <label className="block text-[13.5px] font-bold text-[#10213A]">
                Agenda & Learning Notes
              </label>
              <textarea
                rows={3}
                placeholder="Share any GitHub repos, Figma links, or questions beforehand..."
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full text-[13.5px] px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>

            {/* Submit and Cancel Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F1F4F9]">
              <button
                type="button"
                onClick={() => {
                  setTopic('');
                  setAgenda('');
                }}
                className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-card transition-all"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Confirm & Send Booking Request</span>
              </button>
            </div>
          </form>
            </>
          )}
        </div>

        {/* Right Column (5 cols): Your Sessions & Honor Code Policy */}
        <div className="lg:col-span-5 space-y-6">
          {/* Your Sessions Panel */}
          <div className="ss-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[18px] text-[#10213A]">Your Sessions</h3>
              <button
                onClick={() => showToast('Calendar view opened', 'info')}
                className="text-[12.5px] font-semibold text-[#4F46E5] hover:underline"
              >
                View Calendar →
              </button>
            </div>

            {/* Session Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F4F9] rounded-xl text-[12.5px] font-medium text-center">
              <button
                onClick={() => setSessionsTab('upcoming')}
                className={`py-1.5 rounded-lg transition-all ${
                  sessionsTab === 'upcoming'
                    ? 'bg-white text-[#4F46E5] font-bold shadow-xs'
                    : 'text-[#5E6680]'
                }`}
              >
                Upcoming ({sessions.filter(s => s.status === 'upcoming').length})
              </button>
              <button
                onClick={() => setSessionsTab('pending')}
                className={`py-1.5 rounded-lg transition-all ${
                  sessionsTab === 'pending'
                    ? 'bg-white text-[#4F46E5] font-bold shadow-xs'
                    : 'text-[#5E6680]'
                }`}
              >
                Pending ({sessions.filter(s => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setSessionsTab('completed')}
                className={`py-1.5 rounded-lg transition-all ${
                  sessionsTab === 'completed'
                    ? 'bg-white text-[#4F46E5] font-bold shadow-xs'
                    : 'text-[#5E6680]'
                }`}
              >
                History
              </button>
            </div>

            {/* Sessions List */}
            <div className="space-y-3 pt-1">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))
              ) : (
                <div className="text-center py-8 text-[#8992AA]">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-[13px]">No {sessionsTab} sessions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Honor Code & Policy Information Card */}
          <div className="ss-card p-6 bg-white space-y-3 border border-[#E4E7F2]">
            <div className="flex items-center gap-2 text-[#087F5B]">
              <ShieldCheck className="w-5 h-5 text-[#087F5B]" />
              <h4 className="font-bold text-[15px] text-[#10213A]">Academic Honor Code & Policy</h4>
            </div>
            <p className="text-[13px] text-[#5E6680] leading-relaxed">
              SkillSync operates on mutual peer respect and zero tuition fees. Students agree to arrive on time, respect privacy, and never exchange monetary compensation for peer coaching.
            </p>
            <ul className="space-y-1.5 text-[12px] text-[#5E6680] pt-1">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>100% Free peer learning exchanges</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>Mutual review and endorsement credit</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>24hr advance notice for reschedules</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
