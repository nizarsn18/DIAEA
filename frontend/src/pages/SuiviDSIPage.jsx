import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { Badge } from '../components/Badge';
import { AuthContext } from '../context/AuthContext';
import { Plus, Send } from 'lucide-react';

export const SuiviDSIPage = () => {
  const { hasRole } = useContext(AuthContext);
  const [listDsi, setListDsi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    numeroDemandeInterne: '',
    referenceCourrierDSI: '',
    dateTransmission: new Date().toISOString().split('T')[0],
    typeMaterielDemande: 'PC Portable',
    quantiteDemandee: 1,
    statutDSI: 'ENVOYEE',
    observations: ''
  });

  const loadData = () => {
    setLoading(true);
    API.get('/suivi-dsi')
      .then(res => setListDsi(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/suivi-dsi', formData);
      setShowModal(false);
      loadData();
      setFormData({
        numeroDemandeInterne: '',
        referenceCourrierDSI: '',
        dateTransmission: new Date().toISOString().split('T')[0],
        typeMaterielDemande: 'PC Portable',
        quantiteDemandee: 1,
        statutDSI: 'ENVOYEE',
        observations: ''
      });
    } catch (err) {
      alert("Erreur lors de l'enregistrement de la fiche DSI.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Suivi des Demandes Transmises à la DSI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Suivi des besoins en matériel relevant de la dotation centrale</p>
        </div>

        {hasRole('CELLULE_INFORMATIQUE') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Nouvelle Fiche DSI
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Demande Interne</th>
                <th>Réf Courrier DSI</th>
                <th>Date Transmission</th>
                <th>Type Matériel</th>
                <th>Quantité Dem.</th>
                <th>Quantité Accordée</th>
                <th>Statut DSI</th>
                <th>Observations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</td></tr>
              ) : listDsi.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucune transmission DSI répertoriée</td></tr>
              ) : (
                listDsi.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.numeroDemandeInterne}</td>
                    <td>{item.referenceCourrierDSI || '-'}</td>
                    <td>{item.dateTransmission}</td>
                    <td style={{ fontWeight: 600 }}>{item.typeMaterielDemande}</td>
                    <td>{item.quantiteDemandee}</td>
                    <td>{item.quantiteAccordee !== null ? item.quantiteAccordee : '-'}</td>
                    <td><Badge status={item.statutDSI} /></td>
                    <td>{item.observations || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Suivi DSI */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: 'white', fontWeight: 800 }}>Transmission de Besoin à la DSI</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">N° Demande Interne DIAEA *</label>
                  <input type="text" className="form-control" required value={formData.numeroDemandeInterne} onChange={e => setFormData({...formData, numeroDemandeInterne: e.target.value})} placeholder="ex: DEM-2026-0001" />
                </div>
                <div className="form-group">
                  <label className="form-label">Réf Courrier / E-mail DSI</label>
                  <input type="text" className="form-control" value={formData.referenceCourrierDSI} onChange={e => setFormData({...formData, referenceCourrierDSI: e.target.value})} placeholder="ex: N° 124/DSI/2026" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Type Matériel *</label>
                  <input type="text" className="form-control" required value={formData.typeMaterielDemande} onChange={e => setFormData({...formData, typeMaterielDemande: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantité Demandée *</label>
                  <input type="number" min="1" className="form-control" required value={formData.quantiteDemandee} onChange={e => setFormData({...formData, quantiteDemandee: parseInt(e.target.value) || 1})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date Transmission *</label>
                  <input type="date" className="form-control" required value={formData.dateTransmission} onChange={e => setFormData({...formData, dateTransmission: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Observations</label>
                <textarea className="form-control" rows="2" value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer Transmission DSI</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
