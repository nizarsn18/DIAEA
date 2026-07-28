import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { StatCard } from '../components/StatCard';
import { Monitor, CheckCircle, Clock, AlertTriangle, Send, ShieldAlert, Cpu } from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Chargement du tableau de bord DIAEA...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
          Vue d'ensemble du Parc Informatique
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Suivi en temps réel des équipements, demandes, acquisitions et incidents de la DIAEA.
        </p>
      </div>

      {/* Grid des KPIs principaux */}
      <div className="stats-grid">
        <StatCard 
          icon={Monitor} 
          value={stats?.totalEquipements || 0} 
          label="Total Équipements" 
          color="#3a86ff" 
        />
        <StatCard 
          icon={CheckCircle} 
          value={stats?.materielsAffectes || 0} 
          label="Matériels Affectés" 
          color="#06d6a0" 
        />
        <StatCard 
          icon={Cpu} 
          value={stats?.materielsDisponibles || 0} 
          label="Stock Disponible" 
          color="#00b4d8" 
        />
        <StatCard 
          icon={AlertTriangle} 
          value={stats?.materielsEnPanne || 0} 
          label="Matériels en Panne" 
          color="#ef476f" 
        />
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={Clock} 
          value={stats?.demandesEnAttente || 0} 
          label="Demandes en Attente" 
          color="#ffbe0b" 
        />
        <StatCard 
          icon={Send} 
          value={stats?.demandesTransmisesDSI || 0} 
          label="Transmises à la DSI" 
          color="#8338ec" 
        />
        <StatCard 
          icon={ShieldAlert} 
          value={stats?.incidentsOuverts || 0} 
          label="Incidents Ouverts" 
          color="#ff006e" 
        />
      </div>

      {/* Distribution des équipements par type */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'white' }}>
          Répartition des Équipements par Catégorie
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {stats?.materielParType && Object.entries(stats.materielParType).map(([type, count]) => (
            <div 
              key={type} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{type}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
