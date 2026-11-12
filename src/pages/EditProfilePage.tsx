import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Plus, 
  X, 
  Check, 
  Sliders, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';
import { ProficiencyLevel } from '../types';

export const EditProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  // Profile fields state initialized from currentUser
  const [name, setName] = useState(currentUser.name);
  const [pronouns, setPronouns] = useState(currentUser.pronouns || 'He / Him');
  const [handle, setHandle] = useState(currentUser.handle);
  const [email] = useState(currentUser.email);
  const [university, setUniversity] = useState(currentUser.university);
  const [major, setMajor] = useState(currentUser.major);
  const [year, setYear] = useState(currentUser.year);
  const [gpa, setGpa] = useState(currentUser.gpa ? String(currentUser.gpa) : '');
  const [showGpa, setShowGpa] = useState(currentUser.showGpa ?? false);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  // Social Links
  const [github, setGithub] = useState(currentUser.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');
  const [portfolio, setPortfolio] = useState(currentUser.socialLinks?.portfolio || '');

  // Skills
  const [canTeach, setCanTeach] = useState(currentUser.canTeach || []);
  const [wantsToLearn, setWantsToLearn] = useState(currentUser.wantsToLearn || []);

  // New Skill Inputs
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState<ProficiencyLevel>('Intermediate');
  const [newTeachCat, setNewTeachCat] = useState('Programming');

  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [newLearnLevel, setNewLearnLevel] = useState<ProficiencyLevel>('Beginner');
  const [newLearnCat, setNewLearnCat] = useState('UI/UX Design');

  // Availability
  const [weeklyHours, setWeeklyHours] = useState(currentUser.weeklyHours || 0);
  const [preferredDays, setPreferredDays] = useState<string[]>(
    currentUser.preferredDays || []
  );
  const [virtualFormat, setVirtualFormat] = useState(true);
  const [inPersonFormat, setInPersonFormat] = useState(true);

  // Day toggle
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const toggleDay = (day: string) => {
    setPreferredDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Add / Remove skills
  const handleAddTeachSkill = () => {
    if (!newTeachSkill.trim()) return;
    setCanTeach(prev => [
      ...prev,
      { skillName: newTeachSkill.trim(), category: newTeachCat, level: newTeachLevel, endorsements: 0 }
    ]);
    setNewTeachSkill('');
    showToast(`Added teaching skill "${newTeachSkill}"`, 'info');
  };

  const handleRemoveTeachSkill = (idx: number) => {
    setCanTeach(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddLearnSkill = () => {
    if (!newLearnSkill.trim()) return;
    setWantsToLearn(prev => [
      ...prev,
      { skillName: newLearnSkill.trim(), category: newLearnCat, level: newLearnLevel }
    ]);
    setNewLearnSkill('');
    showToast(`Added learning goal "${newLearnSkill}"`, 'info');
  };

  const handleRemoveLearnSkill = (idx: number) => {
    setWantsToLearn(prev => prev.filter((_, i) => i !== idx));
  };

  // Image Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        showToast('Profile photo updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save handler
  const handleSaveChanges = () => {
    const formats: ('virtual' | 'in-person')[] = [];
    if (virtualFormat) formats.push('virtual');
    if (inPersonFormat) formats.push('in-person');

    updateCurrentUser({
      name,
      pronouns,
      handle,
      university,
      major,
      year,
      gpa: parseFloat(gpa) || 3.8,
      showGpa,
      bio,
      avatar,
      socialLinks: { github, linkedin, portfolio },
      canTeach,
      wantsToLearn,
      weeklyHours,
      preferredDays,
      sessionFormats: formats
    });
  };

  const handleDiscard = () => {
    setName(currentUser.name);
    setBio(currentUser.bio);
    setAvatar(currentUser.avatar);
    setCanTeach(currentUser.canTeach);
    setWantsToLearn(currentUser.wantsToLearn);
    showToast('Changes discarded', 'info');
  };

  return (
    <div className="space-y-8 pb-28 animate-in fade-in duration-150">
      {/* Breadcrumb & Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[13px] text-[#5E6680]">
          <span>Profile</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8992AA]" />
          <span className="text-[#10213A] font-semibold">Edit Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
              Edit Student Profile
            </h1>
            <p className="text-[14.5px] text-[#5E6680] mt-1">
              Maintain your verified credentials, active teaching capabilities, and peer exchange preferences.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDiscard}
              className="px-4 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-white"
            >
              Discard
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Photo, Credentials, Bio, Social */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Photo Card */}
          <div className="ss-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-[16px] text-[#10213A]">Profile Photo</h3>
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-[#E4E7F2] shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')}
                    className="p-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl border border-[#FECACA]"
                    title="Reset photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[12px] text-[#8992AA]">
                  JPG, PNG or WEBP under 5MB. Clear face photo recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Credentials & Identity */}
          <div className="ss-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#10213A]">Academic Credentials & Identity</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#087F5B] bg-[#D9F4E9]">
                <ShieldCheck className="w-3.5 h-3.5" />
                SSO Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px]">
              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Preferred Pronouns</label>
                <input
                  type="text"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Public Profile Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Academic Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] bg-[#F1F4F9] text-[#5E6680] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">College / University</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Department / Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Academic Standing</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[#10213A]">Cumulative GPA</label>
                  <label className="flex items-center gap-1 text-[12px] text-[#5E6680] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGpa}
                      onChange={(e) => setShowGpa(e.target.checked)}
                      className="rounded text-[#4F46E5]"
                    />
                    <span>Display public</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bio & Learning Philosophy */}
          <div className="ss-card p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#10213A]">Bio & Learning Philosophy</h3>
              <span className="text-[12px] text-[#8992AA]">{bio.length} / 500</span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-[13.5px] p-3.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
            />
            <p className="text-[12px] text-[#8992AA]">
              Briefly describe your academic background, what you enjoy teaching, and what capability you wish to unlock next.
            </p>
          </div>

          {/* Portfolio & Social Repositories */}
          <div className="ss-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-[16px] text-[#10213A]">Portfolio & Social Repositories</h3>
            <div className="space-y-3 text-[13.5px]">
              <div>
                <label className="block font-semibold text-[#10213A] mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#10213A] mb-1">Personal Portfolio / Website</label>
                <input
                  type="url"
                  placeholder="https://yourdomain.dev"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Skills I Can Teach, Skills I Want to Learn, Availability */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills I Can Teach */}
          <div className="ss-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#10213A]">Skills I Can Teach</h3>
              <span className="text-[12px] font-bold text-[#087F5B] bg-[#D9F4E9] px-2.5 py-0.5 rounded-full">
                {canTeach.length} Active Skills
              </span>
            </div>

            {/* List of active teaching skills */}
            <div className="space-y-2">
              {canTeach.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]"
                >
                  <div>
                    <h5 className="font-semibold text-[13.5px] text-[#10213A]">{skill.skillName}</h5>
                    <span className="text-[11.5px] text-[#087F5B] font-medium">
                      {skill.level} • {skill.endorsements || 0} endorsements
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeachSkill(idx)}
                    className="p-1 text-[#8992AA] hover:text-[#DC2626] rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add teaching skill input */}
            <div className="p-3.5 rounded-xl bg-[#EEF2FF]/50 border border-[#C7D2FE] space-y-2.5 text-[13px]">
              <span className="font-bold text-[#4F46E5] block">Add Teaching Skill</span>
              <input
                type="text"
                placeholder="Skill name (e.g. Docker, Figma, Rust)"
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E7F2] bg-white focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newTeachCat}
                  onChange={(e) => setNewTeachCat(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E4E7F2] bg-white text-[12px]"
                >
                  <option value="Programming">Programming</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Languages">Languages</option>
                  <option value="Business">Business</option>
                </select>

                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E4E7F2] bg-white text-[12px]"
                >
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddTeachSkill}
                className="w-full py-2 rounded-xl bg-[#4F46E5] text-white font-semibold text-[13px] hover:bg-[#4338CA] transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to My Teaching Profile</span>
              </button>
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="ss-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#10213A]">Skills I Want to Learn</h3>
              <span className="text-[12px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                {wantsToLearn.length} Goals
              </span>
            </div>

            {/* List of learning skills */}
            <div className="space-y-2">
              {wantsToLearn.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]"
                >
                  <div>
                    <h5 className="font-semibold text-[13.5px] text-[#10213A]">{skill.skillName}</h5>
                    <span className="text-[11.5px] text-[#4F46E5] font-medium">
                      Target: {skill.level}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLearnSkill(idx)}
                    className="p-1 text-[#8992AA] hover:text-[#DC2626] rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add learning skill input */}
            <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2] space-y-2.5 text-[13px]">
              <span className="font-bold text-[#10213A] block">Add Learning Goal</span>
              <input
                type="text"
                placeholder="Skill you want to learn..."
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E7F2] bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddLearnSkill}
                className="w-full py-2 rounded-xl bg-white border border-[#E4E7F2] hover:bg-[#EEF2FF] hover:border-[#4F46E5] text-[#4F46E5] font-semibold text-[13px] transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal</span>
              </button>
            </div>
          </div>

          {/* Availability & Exchange Preferences */}
          <div className="ss-card p-6 bg-white space-y-5">
            <h3 className="font-bold text-[16px] text-[#10213A]">Availability & Preferences</h3>

            {/* Commitment Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="font-semibold text-[#10213A]">Weekly Commitment</span>
                <span className="font-bold text-[#4F46E5]">{weeklyHours} hours / week</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full accent-[#4F46E5]"
              />
            </div>

            {/* Preferred Days Checkboxes */}
            <div className="space-y-2">
              <span className="block font-semibold text-[13.5px] text-[#10213A]">Preferred Meeting Days</span>
              <div className="flex flex-wrap gap-1.5">
                {allDays.map(day => {
                  const isSelected = preferredDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border transition-all ${
                        isSelected
                          ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                          : 'bg-white text-[#5E6680] border-[#E4E7F2] hover:bg-[#F8F9FF]'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#F1F4F9] text-[13.5px]">
              <span className="block font-semibold text-[#10213A]">Approved Formats</span>
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#5E6680]">Virtual Video Calls (Google Meet)</span>
                  <input
                    type="checkbox"
                    checked={virtualFormat}
                    onChange={(e) => setVirtualFormat(e.target.checked)}
                    className="rounded text-[#4F46E5] w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#5E6680]">Campus In-Person Meetings</span>
                  <input
                    type="checkbox"
                    checked={inPersonFormat}
                    onChange={(e) => setInPersonFormat(e.target.checked)}
                    className="rounded text-[#4F46E5] w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4E7F2] py-4 px-6 lg:px-12 shadow-dropdown">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-36">
              <div className="flex items-center justify-between text-[12px] mb-1">
                <span className="font-semibold text-[#10213A]">Profile Status</span>
                <span className="font-bold text-[#087F5B]">92%</span>
              </div>
              <div className="w-full bg-[#E4E7F2] h-2 rounded-full overflow-hidden">
                <div className="bg-[#087F5B] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <span className="text-[13px] font-medium text-[#087F5B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Ready for Instant Algorithmic Matching</span>
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 text-[13.5px] font-medium text-[#5E6680] hover:text-[#10213A]"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
