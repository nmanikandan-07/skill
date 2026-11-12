import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  PlusCircle, 
  Bell, 
  MessageSquare, 
  Settings, 
  Menu, 
  Check, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardTopbarProps {
  onOpenMobileMenu?: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationsAsRead, 
    unreadNotificationCount,
    unreadMessageCount,
    setQuickMatchOpen, 
    setCreateRequestOpen 
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholder based on route
  const getSearchPlaceholder = () => {
    switch (location.pathname) {
      case '/explore-skills':
        return 'Search 500+ skills, topics, or categories...';
      case '/find-partners':
        return 'Search by name, university, or major...';
      case '/connections':
        return 'Search your active learning partners...';
      case '/sessions':
        return 'Search sessions by topic or partner...';
      case '/messages':
        return 'Search conversations or messages...';
      default:
        return 'Search skills, peers, or upcoming sessions...';
    }
  };

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[76px] bg-white border-b border-[#E4E7F2] px-6 lg:px-9 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      {/* Left Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-3.5 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#8992AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            className="w-full bg-[#F8F9FF] hover:bg-[#F1F4F9] focus:bg-white text-[13.5px] text-[#10213A] placeholder-[#8992AA] pl-9 pr-14 py-2 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[#E4E7F2] text-[10px] font-medium text-[#8992AA]">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Match Action */}
        <button
          onClick={() => setQuickMatchOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#4F46E5]" />
          <span>Quick Match</span>
        </button>

        {/* Create Request Primary Action */}
        <button
          onClick={() => setCreateRequestOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13.5px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Create Request</span>
        </button>

        <div className="h-6 w-[1px] bg-[#E4E7F2] hidden sm:block mx-0.5" />

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen && unreadNotificationCount > 0) {
                markNotificationsAsRead();
              }
            }}
            className="relative p-2 rounded-xl text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] border border-transparent hover:border-[#E4E7F2] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F46E5] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-dropdown border border-[#E4E7F2] py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-[#E4E7F2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-[14px] text-[#10213A]">Notifications</h4>
                  <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-[#EEF2FF] text-[#4F46E5] rounded-full">
                    {notifications.length}
                  </span>
                </div>
                <button
                  onClick={markNotificationsAsRead}
                  className="text-[12px] text-[#4F46E5] hover:underline flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F4F9]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.link) navigate(n.link);
                      setNotificationsOpen(false);
                    }}
                    className={`p-3.5 hover:bg-[#F8F9FF] cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-[#F7F8FF]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[#10213A]">{n.title}</p>
                      <span className="text-[11px] text-[#8992AA] shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[12px] text-[#5E6680] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages Shortcut */}
        <button
          onClick={() => navigate('/messages')}
          className="relative p-2 rounded-xl text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] border border-transparent hover:border-[#E4E7F2] transition-all"
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadMessageCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F46E5] ring-2 ring-white" />
          )}
        </button>

        {/* Settings Shortcut */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] border border-transparent hover:border-[#E4E7F2] transition-all hidden sm:block"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar & Identity Card */}
        <div className="relative pl-1" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F8F9FF] transition-all text-left"
          >
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={currentUser.name || 'Student'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E4E7F2]"
              />
              {/* Online Indicator Green Dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#087F5B] ring-2 ring-white" />
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[13.5px] font-semibold text-[#10213A] leading-tight">
                  {currentUser.name || 'Student'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8992AA]" />
              </div>
              <span className="text-[11.5px] text-[#5E6680] font-medium block leading-tight mt-0.5">
                {currentUser.major || 'Peer Network'} • {(currentUser.year || 'Member').split(' ')[0]}
              </span>
            </div>
          </button>

          {/* User Quick Dropdown */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-[#E4E7F2] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#E4E7F2]/60">
                <p className="text-[13.5px] font-semibold text-[#10213A]">{currentUser.name || 'Student'}</p>
                <p className="text-[12px] text-[#8992AA] truncate">{currentUser.email || 'Peer Learner'}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile');
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[13px] text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[13px] text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
              >
                Account Settings
              </button>
              <div className="h-[1px] bg-[#E4E7F2] my-1" />
              <button
                onClick={() => {
                  navigate('/login');
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[13px] text-[#DC2626] hover:bg-[#FEF2F2]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
