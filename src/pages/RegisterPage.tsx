import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ShieldCheck, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, updateCurrentUser } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [university, setUniversity] = useState('Stanford University');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('3rd Year Junior');
  const [teachSkill, setTeachSkill] = useState('');
  const [learnSkill, setLearnSkill] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('Please agree to the Academic Honor Code and Terms', 'error');
      return;
    }

    if (!fullName || !email || !major) {
      showToast('Please fill in all required academic fields', 'error');
      return;
    }

    updateCurrentUser({
      name: fullName,
      email,
      university,
      major,
      year,
      canTeach: teachSkill ? [{ skillName: teachSkill, category: 'Programming', level: 'Intermediate', endorsements: 1 }] : undefined,
      wantsToLearn: learnSkill ? [{ skillName: learnSkill, category: 'UI/UX Design', level: 'Beginner' }] : undefined
    });

    showToast(`Welcome to SkillSync, ${fullName}! Your account is active.`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] py-12 px-6 sm:px-12 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-[#4F46E5]/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-[26px] font-extrabold text-[#10213A] tracking-tight">SkillSync</span>
          </Link>
          <h2 className="text-2xl font-bold text-[#10213A] pt-2">
            Create Your Student Account
          </h2>
          <p className="text-[14px] text-[#5E6680]">
            Join verified peers across top universities exchanging skills without tuition fees
          </p>
        </div>

        {/* Form Card */}
        <div className="ss-card p-8 bg-white border border-[#E4E7F2] shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Academic Email (.edu) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  College / University *
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] bg-white focus:outline-none"
                >
                  <option value="Stanford University">Stanford University</option>
                  <option value="UC Berkeley">UC Berkeley</option>
                  <option value="MIT">MIT</option>
                  <option value="Harvard University">Harvard University</option>
                  <option value="Carnegie Mellon University">Carnegie Mellon</option>
                  <option value="Columbia University">Columbia University</option>
                  <option value="University of Washington">University of Washington</option>
                  <option value="Georgia Institute of Technology">Georgia Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Department / Major *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Academic Standing
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] bg-white focus:outline-none"
                >
                  <option value="1st Year Freshman">1st Year Freshman</option>
                  <option value="2nd Year Sophomore">2nd Year Sophomore</option>
                  <option value="3rd Year Junior">3rd Year Junior</option>
                  <option value="4th Year Senior">4th Year Senior</option>
                  <option value="Graduate / Masters">Graduate / Masters</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8992AA]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F1F4F9] space-y-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Primary Skill You Can Teach
                </label>
                <input
                  type="text"
                  placeholder="e.g. React & TypeScript, Python, Figma, French..."
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#10213A] mb-1.5">
                  Primary Skill You Want to Learn
                </label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, UI/UX, Public Speaking..."
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            {/* Academic Notice */}
            <div className="p-3 rounded-xl bg-[#D9F4E9] border border-[#A7F3D0] flex items-start gap-2.5 text-[12px] text-[#087F5B]">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Your university email will be verified via academic SSO protocol. SkillSync operates under zero-tuition guarantee.
              </span>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 text-[12.5px] text-[#5E6680] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-[#4F46E5] w-4 h-4 mt-0.5"
              />
              <span>
                I agree to the Academic Honor Code, 100% Free Peer Exchange Policy, and Student Terms of Service.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-[14.5px] text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-card transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Verified Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-[14px] text-[#5E6680]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#4F46E5] hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
