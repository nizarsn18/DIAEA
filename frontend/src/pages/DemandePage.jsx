import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { Badge } from '../components/Badge';
import { WorkflowSteps } from '../components/WorkflowSteps';
import { AuthContext } from '../context/AuthContext';
import { Plus, Check, X, FileText, Send } from 'lucide-react';

export const DemandePage = () => {
  const { hasRole, user } = useContext(AuthContext);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    typeMaterielDemande: 'PC Portable',
    quantiteDemande: 1,
    justificationBesoin: '',
    urgence: 'NORMALE'
  });

  const loadDemandes = () => {
    setLoading(true);
    API.get('/demandes')
      .then(res => setDemandes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/demandes', formData);
      setShowModal(false);
      loadDemandes();
      setFormData({ typeMaterielDemande: 'PC Portable', quantiteDemande: 1, justificationBesoin: '', urgence: 'NORMALE' });
    } catch (err) {
      alert('Erreur lors de la soumission de la demande.');
    }
  };

  const handleValiderCS = async (id, valide) => {
    const avis = prompt(valide ? 'Avis du Chef de Service (optionnel):' : 'Motif du rejet (optionnel):');
    try {
      await API.put(`/demandes/${id}/valider-cs?valide=${valide}&avis=${encodeURIComponent(avis || '')}`);
      loadDemandes();
    } catch (err) {
      alert('Erreur lors de la validation.');
    }
  };

  const handleValiderCD = async (id, valide) => {
    const avis = prompt(valide ? 'Avis du Chef de Division (optionnel):' : 'Motif du rejet (optionnel):');
    try {
      await API.put(`/demandes/${id}/valider-cd?valide=${valide}&avis=${encodeURIComponent(avis || '')}`);
      loadDemandes();
    } catch (err) {
      alert('Erreur lors de la validation.');
    }
  };

  const handleDecisionCellule = async (id, statut) => {
    const decision = prompt('Décision / Observation de la cellule informatique :');
    try {
      await API.put(`/demandes/${id}/decision-cellule?nouveauStatut=${statut}&decision=${encodeURIComponent(decision || '')}`);
      loadDemandes();
    } catch (err) {
      alert('Erreur lors de la décision.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Gestion des Demandes de Matériel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Circuit hiérarchique de validation et traitement</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nouvelle Demande
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>Chargement des demandes...</div>
        ) : demandes.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucune demande de matériel trouvée.
          </div>
        ) : (
          demandes.map((item) => (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.numeroDemande}
                  </span>
                  <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    {item.quantiteDemande}x {item.typeMaterielDemande}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Demandé par <strong>{item.demandeur?.prenom} {item.demandeur?.nom}</strong> ({item.demandeur?.service || item.demandeur?.division})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: item.urgence === 'URGENTE' ? '#ef476f' : 'var(--text-muted)', fontWeight: 700 }}>
                    Priorité: {item.urgence}
                  </span>
                  <Badge status={item.statut} />
                </div>
              </div>

              {/* Justification du besoin */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>JUSTIFICATION DU BESOIN:</strong>
                {item.justificationBesoin}
              </div>

              {/* Visualisateur de Workflow */}
              <WorkflowSteps currentStatus={item.statut} />

              {/* Actions de validation basées sur le rôle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                {/* Actions Chef de Service */}
                {hasRole('CHEF_SERVICE') && item.statut === 'EN_ATTENTE_VALIDATION_CS' && (
                  <>
                    <button className="btn btn-danger" onClick={() => handleValiderCS(item.id, false)}>
                      <X size={16} /> Rejeter (CS)
                    </button>
                    <button className="btn btn-success" onClick={() => handleValiderCS(item.id, true)}>
                      <Check size={16} /> Valider (CS)
                    </button>
                  </>
                )}

                {/* Actions Chef de Division */}
                {hasRole('CHEF_DIVISION') && item.statut === 'EN_ATTENTE_VALIDATION_CD' && (
                  <>
                    <button className="btn btn-danger" onClick={() => handleValiderCD(item.id, false)}>
                      <X size={16} /> Rejeter (CD)
                    </button>
                    <button className="btn btn-success" onClick={() => handleValiderCD(item.id, true)}>
                      <Check size={16} /> Valider (CD)
                    </button>
                  </>
                )}

                {/* Actions Cellule Informatique */}
                {hasRole('CELLULE_INFORMATIQUE') && item.statut === 'TRANSMISE_CELLULE_INFO' && (
                  <>
                    <button className="btn btn-secondary" onClick={() => handleDecisionCellule(item.id, 'TRANSMISE_DSI')}>
                      <Send size={16} /> Transmettre à la DSI
                    </button>
                    <button className="btn btn-primary" onClick={() => handleDecisionCellule(item.id, 'SATISFAITE')}>
                      <Check size={16} /> Affecter du Stock (Satisfaire)
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Création Demande */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: 'white', fontWeight: 800 }}>Exprimer une Demande de Matériel</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type de Matériel Demandé *</label>
                <select 
                  className="form-control" 
                  value={formData.typeMaterielDemande} 
                  onChange={e => setFormData({...formData, typeMaterielDemande: e.target.value})}
                >
                  <option value="PC Portable">💻 PC Portable</option>
                  <option value="Ordinateur de bureau">🖥️ Ordinateur de bureau</option>
                  <option value="Imprimante">🖨️ Imprimante Multifonction</option>
                  <option value="Scanner">📟 Scanner Documentaire</option>
                  <option value="Vidéoprojecteur">📹 Vidéoprojecteur</option>
                  <option value="Écran">🖥️ Écran supplémentaire (Moniteur)</option>
                  <option value="Équipement Réseau">🌐 Équipement Réseau (Switch / Routeur)</option>
                  <option value="Onduleur">🔋 Onduleur UPS</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Quantité *</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control" 
                    value={formData.quantiteDemande} 
                    onChange={e => setFormData({...formData, quantiteDemande: parseInt(e.target.value) || 1})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgence *</label>
                  <select 
                    className="form-control" 
                    value={formData.urgence} 
                    onChange={e => setFormData({...formData, urgence: e.target.value})}
                  >
                    <option value="NORMALE">Normale</option>
                    <option value="URGENTE">Urgente</option>
                    <option value="TRES_URGENTE">Très Urgente</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Justification du besoin *</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  required 
                  value={formData.justificationBesoin} 
                  onChange={e => setFormData({...formData, justificationBesoin: e.target.value})}
                  placeholder="Décrivez les motifs de la demande..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Soumettre la Demande</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
