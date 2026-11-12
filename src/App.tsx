import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicShell } from './components/layout/PublicShell';
import { DashboardShell } from './components/layout/DashboardShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExploreSkillsPage } from './pages/ExploreSkillsPage';
import { FindPartnersPage } from './pages/FindPartnersPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { SessionsPage } from './pages/SessionsPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Shell */}
          <Route element={<PublicShell />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Standalone Auth Pages */}
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Dashboard Shell */}
          <Route element={<DashboardShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/explore-skills" element={<ExploreSkillsPage />} />
            <Route path="/find-partners" element={<FindPartnersPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/profile" element={<EditProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
