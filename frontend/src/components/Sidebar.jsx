import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Monitor, 
  FileText, 
  Send, 
  ShoppingCart, 
  AlertTriangle, 
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export const Sidebar = () => {
  const { hasRole } = useContext(AuthContext);

  const navs = [
    { label: 'Tableau de bord', path: '/', icon: LayoutDashboard },
    { label: 'Parc Informatique', path: '/materiels', icon: Monitor },
    { label: 'Demandes de Matériel', path: '/demandes', icon: FileText },
    { label: 'Suivi DSI', path: '/suivi-dsi', icon: Send },
    { label: 'Acquisitions (BDC/Marchés)', path: '/acquisitions', icon: ShoppingCart },
    { label: 'Incidents & Support', path: '/incidents', icon: AlertTriangle },
  ];

  if (hasRole('ADMINISTRATEUR')) {
    navs.push({ label: 'Administration', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside className="sidebar">
      <div className="brand-logo">
        <div className="brand-icon">
          <HardDrive size={24} color="#ffffff" />
        </div>
        <div>
          <div className="brand-name">DIAEA PARC</div>
          <div className="brand-sub">Gestion IT Centralisée</div>
        </div>
      </div>

      <nav className="nav-links">
        {navs.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
