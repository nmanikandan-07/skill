import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Users, 
  Share2, 
  MessageSquare, 
  Calendar, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onCloseMobile }) => {
  const { unreadMessageCount, showToast } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    showToast('Logged out of SkillSync demo account', 'info');
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore Skills', path: '/explore-skills', icon: Compass },
    { label: 'Find Partners', path: '/find-partners', icon: Users },
    { label: 'Connections', path: '/connections', icon: Share2 },
    { label: 'Messages', path: '/messages', icon: MessageSquare, badge: unreadMessageCount > 0 ? unreadMessageCount : undefined },
    { label: 'Sessions', path: '/sessions', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-[304px] h-screen bg-white border-r border-[#E4E7F2] flex flex-col justify-between select-none shrink-0 sticky top-0 overflow-y-auto z-30">
      <div>
        {/* Brand Header */}
        <div className="h-[76px] px-7 flex items-center gap-3.5 border-b border-[#E4E7F2]/60">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm shadow-[#4F46E5]/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[20px] font-bold text-[#10213A] tracking-tight">SkillSync</span>
            </div>
            <span className="text-[12px] font-medium text-[#8992AA] tracking-wide -mt-0.5">
              Peer Learning Network
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  relative group flex items-center justify-between px-4 py-3 rounded-xl text-[14.5px] font-medium transition-all duration-150
                  ${
                    isActive
                      ? 'bg-[#E5EDFF] text-[#4F46E5] font-semibold'
                      : 'text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Purple left active indicator pill */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#4F46E5] rounded-r-full" />
                    )}
                    <div className="flex items-center gap-3.5">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-[#4F46E5]' : 'text-[#5E6680] group-hover:text-[#10213A]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#4F46E5] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pinned Section */}
      <div className="p-4 border-t border-[#E4E7F2] space-y-1.5 bg-white">
        <a
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            showToast('Help & Academic Peer Guidelines: Available 24/7', 'info');
          }}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] transition-all"
        >
          <HelpCircle className="w-5 h-5 text-[#5E6680]" />
          <span>Help & Support</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-all text-left"
        >
          <LogOut className="w-5 h-5 text-[#DC2626]" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
