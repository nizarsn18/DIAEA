import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MaterielPage } from './pages/MaterielPage';
import { DemandePage } from './pages/DemandePage';
import { SuiviDSIPage } from './pages/SuiviDSIPage';
import { AcquisitionPage } from './pages/AcquisitionPage';
import { IncidentPage } from './pages/IncidentPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedLayout = ({ children, title }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <Navbar title={title} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedLayout title="Tableau de Bord DIAEA">
              <DashboardPage />
            </ProtectedLayout>
          } />

          <Route path="/materiels" element={
            <ProtectedLayout title="Inventaire du Parc Informatique">
              <MaterielPage />
            </ProtectedLayout>
          } />

          <Route path="/demandes" element={
            <ProtectedLayout title="Gestion des Demandes">
              <DemandePage />
            </ProtectedLayout>
          } />

          <Route path="/suivi-dsi" element={
            <ProtectedLayout title="Suivi des Demandes DSI">
              <SuiviDSIPage />
            </ProtectedLayout>
          } />

          <Route path="/acquisitions" element={
            <ProtectedLayout title="Suivi des Acquisitions (BDC / Marchés)">
              <AcquisitionPage />
            </ProtectedLayout>
          } />

          <Route path="/incidents" element={
            <ProtectedLayout title="Incidents & Support IT">
              <IncidentPage />
            </ProtectedLayout>
          } />

          <Route path="/admin" element={
            <ProtectedLayout title="Administration du Système">
              <AdminPage />
            </ProtectedLayout>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};
