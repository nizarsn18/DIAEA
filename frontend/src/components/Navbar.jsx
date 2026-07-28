import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Shield } from 'lucide-react';

export const Navbar = ({ title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="ministry-badge">
          <span className="ministry-title-ar">المملكة المغربية - وزارة الفلاحة والصيد البحري والتنمية القروية والمياه والغابات</span>
          <span className="ministry-title-fr">Royaume du Maroc - Ministère de l'Agriculture</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
            DIAEA - Direction de l'Irrigation et de l'Aménagement de l'Espace Agricole
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <h2 className="navbar-page-title" style={{ marginRight: '1rem' }}>{title}</h2>

        {user && (
          <div className="user-badge">
            <div className="user-avatar">
              {user.prenom ? user.prenom[0] : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {user.prenom} {user.nom}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold-accent)', fontWeight: 600 }}>
                {user.fonction || user.service || user.division || 'DIAEA'}
              </div>
            </div>
            <button 
              onClick={logout} 
              className="btn btn-secondary" 
              style={{ padding: '0.4rem 0.6rem', marginLeft: '0.5rem' }}
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
