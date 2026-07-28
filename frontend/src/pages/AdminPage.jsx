import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { exportToExcel } from '../utils/exportUtils';
import { Shield, Users, ListFilter, History, Download } from 'lucide-react';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [referentiels, setReferentiels] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'users') {
      API.get('/admin/users')
        .then(res => setUsers(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else if (activeTab === 'referentiels') {
      API.get('/admin/referentiels')
        .then(res => setReferentiels(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else if (activeTab === 'audit') {
      API.get('/admin/audit-logs')
        .then(res => setAuditLogs(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleExportExcel = () => {
    if (activeTab === 'users') {
      exportToExcel(users.map(u => ({ 'Username': u.username, 'Nom': u.nom, 'Prénom': u.prenom, 'Email': u.email, 'Division': u.division, 'Service': u.service, 'Actif': u.actif })), 'utilisateurs_diaea.xlsx');
    } else if (activeTab === 'audit') {
      exportToExcel(auditLogs.map(a => ({ 'Horodatage': a.timestamp, 'Utilisateur': a.username, 'Action': a.action, 'Entité': a.entiteConcernee, 'Référence': a.referenceEntite, 'Détails': a.details })), 'journal_audit_diaea.xlsx');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Module d'Administration & Audit Institutionnel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gestion des comptes, privilèges d'accès, référentiels et traçabilité des opérations</p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportExcel}>
          <Download size={18} /> Exporter Excel
        </button>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Comptes Utilisateurs ({users.length})
        </button>
        <button 
          className={`btn ${activeTab === 'referentiels' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('referentiels')}
        >
          <ListFilter size={18} /> Listes de Référence ({referentiels.length})
        </button>
        <button 
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('audit')}
        >
          <History size={18} /> Journal d'Audit & Sécurité ({auditLogs.length})
        </button>
      </div>

      {/* Affichage des Utilisateurs */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Nom & Prénom</th>
                  <th>E-mail</th>
                  <th>Division / Service</th>
                  <th>Fonction</th>
                  <th>Rôles DIAEA</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Chargement des utilisateurs...</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{u.username}</td>
                      <td style={{ fontWeight: 600 }}>{u.prenom} {u.nom}</td>
                      <td>{u.email}</td>
                      <td>{u.division} {u.service ? `/ ${u.service}` : ''}</td>
                      <td>{u.fonction || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {u.roles?.map(r => (
                            <span key={r.id} style={{ background: 'rgba(0, 98, 51, 0.2)', color: '#06d6a0', border: '1px solid rgba(6, 214, 160, 0.3)', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                              {r.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${u.actif ? 'badge-success' : 'badge-danger'}`}>
                          {u.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Affichage des Référentiels */}
      {activeTab === 'referentiels' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Catégorie</th>
                  <th>Code</th>
                  <th>Libellé</th>
                  <th>Actif</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Chargement des référentiels...</td></tr>
                ) : (
                  referentiels.map((ref) => (
                    <tr key={ref.id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>{ref.categorie}</td>
                      <td style={{ fontFamily: 'monospace' }}>{ref.code}</td>
                      <td style={{ fontWeight: 600 }}>{ref.libelle}</td>
                      <td>
                        <span className={`badge ${ref.actif ? 'badge-success' : 'badge-danger'}`}>
                          {ref.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Affichage du Journal d'Audit */}
      {activeTab === 'audit' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Entité</th>
                  <th>Référence</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Chargement du journal d'audit...</td></tr>
                ) : auditLogs.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucun événement d'audit enregistré.</td></tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{log.username}</td>
                      <td style={{ fontWeight: 600 }}>{log.action}</td>
                      <td>{log.entiteConcernee}</td>
                      <td style={{ fontFamily: 'monospace' }}>{log.referenceEntite || '-'}</td>
                      <td>{log.details || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
