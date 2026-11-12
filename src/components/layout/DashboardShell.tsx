import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../navigation/DashboardSidebar';
import { DashboardTopbar } from '../navigation/DashboardTopbar';
import { ToastContainer } from '../feedback/ToastContainer';
import { QuickMatchModal } from '../modals/QuickMatchModal';
import { CreateRequestModal } from '../modals/CreateRequestModal';
import { ProfilePreviewModal } from '../modals/ProfilePreviewModal';

export const DashboardShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#10213A] flex flex-row">
      {/* Desktop Sidebar (persistent fixed on desktop) */}
      <div className="hidden lg:block shrink-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[304px] bg-white h-full shadow-2xl">
            <DashboardSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <QuickMatchModal />
      <CreateRequestModal />
      <ProfilePreviewModal />
      <ToastContainer />
    </div>
  );
};
