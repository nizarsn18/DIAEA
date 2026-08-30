import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { Badge } from '../components/Badge';
import { AuthContext } from '../context/AuthContext';
import { AlertTriangle, Plus, CheckCircle, Wrench, History } from 'lucide-react';
import InterventionModal from '../components/InterventionModal';

export const IncidentPage = () => {
  const { hasRole, user } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedIncidentIntervention, setSelectedIncidentIntervention] = useState(null);

  const [formData, setFormData] = useState({
    typeIncident: 'PANNE_ORDINATEUR',
    descriptionProbleme: '',
    priorite: 'NORMALE'
  });

  const loadIncidents = () => {
    setLoading(true);
    API.get('/incidents')
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/incidents', formData);
      setShowModal(false);
      loadIncidents();
      setFormData({ typeIncident: 'PANNE_ORDINATEUR', descriptionProbleme: '', priorite: 'NORMALE' });
    } catch (err) {
      alert("Erreur lors de la déclaration de l'incident.");
    }
  };

  const handleTraiter = async (id, statut) => {
    const action = prompt("Action réalisée ou note d'intervention :");
    try {
      await API.put(`/incidents/${id}/traiter?statut=${statut}&actionRealisee=${encodeURIComponent(action || '')}`);
      loadIncidents();
    } catch (err) {
      alert("Erreur lors du traitement du ticket.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Gestion des Incidents et Support IT</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Signalement des pannes, réclamations et suivi des interventions</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Signaler un Incident
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>Chargement des tickets...</div>
        ) : incidents.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucun incident répertorié.
          </div>
        ) : (
          incidents.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                    {item.numeroTicket}
                  </span>
                  <Badge status={item.statut} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>
                  {item.typeIncident.replace('_', ' ')}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {item.descriptionProbleme}
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  Déclaré par : <strong>{item.declarant?.prenom} {item.declarant?.nom}</strong>
                </div>

                {item.actionRealisee && (
                  <div style={{ background: 'rgba(6, 214, 160, 0.08)', border: '1px solid rgba(6, 214, 160, 0.2)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#06d6a0', marginTop: '0.5rem' }}>
                    <strong>Dernière Action:</strong> {item.actionRealisee}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedIncidentIntervention(item)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <History size={14} /> Voir Interventions
                </button>

                {hasRole('CELLULE_INFORMATIQUE') && item.statut !== 'CLOTURE' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {item.statut === 'NOUVEAU' && (
                      <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => handleTraiter(item.id, 'EN_COURS')}>
                        <Wrench size={14} /> Prendre en Charge
                      </button>
                    )}
                    {item.statut === 'EN_COURS' && (
                      <button className="btn btn-success" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => handleTraiter(item.id, 'CLOTURE')}>
                        <CheckCircle size={14} /> Clôturer Ticket
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Interventions */}
      {selectedIncidentIntervention && (
        <InterventionModal
          incident={selectedIncidentIntervention}
          onClose={() => { setSelectedIncidentIntervention(null); loadIncidents(); }}
        />
      )}

      {/* Modal Création Ticket Incident */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: 'white', fontWeight: 800 }}>Signaler un Problème / Incident</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type d'Incident *</label>
                <select className="form-control" value={formData.typeIncident} onChange={e => setFormData({...formData, typeIncident: e.target.value})}>
                  <option value="PANNE_ORDINATEUR">Panne ordinateur</option>
                  <option value="PROBLEME_IMPRIMANTE">Problème imprimante / MFP</option>
                  <option value="PROBLEME_SCANNER">Problème scanner</option>
                  <option value="PROBLEME_RESEAU">Problème réseau / LAN / Wi-Fi</option>
                  <option value="PROBLEME_MESSAGERIE">Problème messagerie / E-mail</option>
                  <option value="PROBLEME_LOGICIEL">Problème logiciel / système</option>
                  <option value="PROBLEME_ACCES">Problème d'accès / compte</option>
                  <option value="PERTE_DEGRADATION_ACCESSOIRE">Perte / détérioration accessoire</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priorité *</label>
                <select className="form-control" value={formData.priorite} onChange={e => setFormData({...formData, priorite: e.target.value})}>
                  <option value="FAIBLE">Faible</option>
                  <option value="NORMALE">Normale</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description du problème *</label>
                <textarea className="form-control" rows="3" required value={formData.descriptionProbleme} onChange={e => setFormData({...formData, descriptionProbleme: e.target.value})} placeholder="Décrivez en détail le dysfonctionnement constaté..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Soumettre le Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
