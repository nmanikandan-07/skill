import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../navigation/PublicNavbar';
import { Footer } from '../navigation/Footer';
import { ToastContainer } from '../feedback/ToastContainer';
import { ProfilePreviewModal } from '../modals/ProfilePreviewModal';
import { QuickMatchModal } from '../modals/QuickMatchModal';

export const PublicShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col justify-between text-[#10213A]">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <QuickMatchModal />
      <ProfilePreviewModal />
      <ToastContainer />
    </div>
  );
};
