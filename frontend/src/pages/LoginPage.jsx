import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { HardDrive, Lock, User, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Nom d’utilisateur ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, rgba(58, 134, 255, 0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(6, 214, 160, 0.15), transparent 60%), #070d1e',
      padding: '1.5rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textCenter: 'center', marginBottom: '2rem', textAlign: 'center' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '56px', height: '56px' }}>
            <HardDrive size={32} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>DIAEA IT MANAGER</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Application de Gestion du Parc Informatique
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 71, 111, 0.15)',
            border: '1px solid rgba(239, 71, 111, 0.4)',
            color: '#ef476f',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Identifiant / Nom d'utilisateur</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="ex: admin ou cadre1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          Direction de l'Irrigation et de l'Aménagement de l'Espace Agricole © 2026
        </div>
      </div>
    </div>
  );
};
