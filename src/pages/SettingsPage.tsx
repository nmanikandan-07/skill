import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Bell, 
  Lock, 
  Eye, 
  Globe, 
  Check, 
  LogOut,
  Save,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const navigate = useNavigate();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [visibility, setVisibility] = useState<'all' | 'campus' | 'private'>('all');
  const [showGPA, setShowGPA] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  const handleLogout = () => {
    showToast('Logged out of demo account', 'info');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-150 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
          Account & Network Settings
        </h1>
        <p className="text-[14.5px] text-[#5E6680] mt-1">
          Manage your notifications, university privacy settings, and academic verification status.
        </p>
      </div>

      {/* Academic Verification Status Card */}
      <div className="ss-card p-6 bg-white border border-[#A7F3D0] bg-gradient-to-r from-white via-white to-[#F0FDF4] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9F4E9] text-[#087F5B] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#10213A]">Academic SSO Verified</h3>
              <p className="text-[13px] text-[#5E6680]">{currentUser.email} • {currentUser.university}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[12px] font-bold text-[#087F5B] bg-[#D9F4E9] border border-[#A7F3D0]">
            ACTIVE FOR 2026–2027
          </span>
        </div>
      </div>

      {/* Profile Visibility & Privacy */}
      <div className="ss-card p-6 bg-white space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F4F9]">
          <Eye className="w-5 h-5 text-[#4F46E5]" />
          <h3 className="font-bold text-[16px] text-[#10213A]">Profile Visibility & Discoverability</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E4E7F2] hover:bg-[#F8F9FF] cursor-pointer transition-colors">
            <input
              type="radio"
              name="visibility"
              checked={visibility === 'all'}
              onChange={() => setVisibility('all')}
              className="mt-1 text-[#4F46E5]"
            />
            <div>
              <h4 className="font-semibold text-[14px] text-[#10213A]">Public to All Partner Universities (Recommended)</h4>
              <p className="text-[12.5px] text-[#5E6680]">Verified students from Stanford, UC Berkeley, MIT, Harvard, etc. can discover and propose exchanges with you.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E4E7F2] hover:bg-[#F8F9FF] cursor-pointer transition-colors">
            <input
              type="radio"
              name="visibility"
              checked={visibility === 'campus'}
              onChange={() => setVisibility('campus')}
              className="mt-1 text-[#4F46E5]"
            />
            <div>
              <h4 className="font-semibold text-[14px] text-[#10213A]">Only My Campus ({currentUser.university})</h4>
              <p className="text-[12.5px] text-[#5E6680]">Restrict visibility strictly to students with matching institutional domain email.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E4E7F2] hover:bg-[#F8F9FF] cursor-pointer transition-colors">
            <input
              type="radio"
              name="visibility"
              checked={visibility === 'private'}
              onChange={() => setVisibility('private')}
              className="mt-1 text-[#4F46E5]"
            />
            <div>
              <h4 className="font-semibold text-[14px] text-[#10213A]">Private / Do Not Distribute</h4>
              <p className="text-[12.5px] text-[#5E6680]">You can invite specific peers directly via link, but your profile is hidden from search catalogues.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="ss-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F4F9]">
          <Bell className="w-5 h-5 text-[#4F46E5]" />
          <h3 className="font-bold text-[16px] text-[#10213A]">Notification Preferences</h3>
        </div>

        <div className="space-y-4 text-[14px]">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-[#10213A] block">Email Exchange Proposals</span>
              <span className="text-[12.5px] text-[#5E6680]">Receive instant email when another student proposes a mutual skill swap</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="rounded text-[#4F46E5] w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-[#10213A] block">Session 24hr Reminders</span>
              <span className="text-[12.5px] text-[#5E6680]">Automated Google Meet / In-person reminders with calendar invite</span>
            </div>
            <input
              type="checkbox"
              checked={sessionReminders}
              onChange={(e) => setSessionReminders(e.target.checked)}
              className="rounded text-[#4F46E5] w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-[#10213A] block">AI Complementary Match Alerts</span>
              <span className="text-[12.5px] text-[#5E6680]">Weekly digest of students who joined teaching skills you want to learn</span>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="rounded text-[#4F46E5] w-5 h-5"
            />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2] border border-[#FECACA] transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
