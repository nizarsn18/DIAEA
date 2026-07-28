import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { Badge } from '../components/Badge';
import { AuthContext } from '../context/AuthContext';
import { Plus, ShoppingCart } from 'lucide-react';

export const AcquisitionPage = () => {
  const { hasRole } = useContext(AuthContext);
  const [acquisitions, setAcquisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    typeAcquisition: 'BDC',
    reference: '',
    objet: '',
    fournisseur: '',
    montant: '',
    materielConcerne: 'PC Portable',
    quantiteCommandee: 1,
    statut: 'EN_PREPARATION'
  });

  const loadData = () => {
    setLoading(true);
    API.get('/acquisitions')
      .then(res => setAcquisitions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/acquisitions', formData);
      setShowModal(false);
      loadData();
      setFormData({
        typeAcquisition: 'BDC',
        reference: '',
        objet: '',
        fournisseur: '',
        montant: '',
        materielConcerne: 'PC Portable',
        quantiteCommandee: 1,
        statut: 'EN_PREPARATION'
      });
    } catch (err) {
      alert("Erreur lors de la création de la fiche d'acquisition.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Suivi des Acquisitions (BDC & Marchés)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gestion des commandes directes et marchés lancés par la direction DIAEA</p>
        </div>

        {hasRole('CELLULE_INFORMATIQUE') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Nouvelle Acquisition
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Référence</th>
                <th>Objet</th>
                <th>Fournisseur</th>
                <th>Montant (MAD)</th>
                <th>Qté Commandée</th>
                <th>Qté Livrée</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</td></tr>
              ) : acquisitions.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucune acquisition enregistrée</td></tr>
              ) : (
                acquisitions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ 
                        background: item.typeAcquisition === 'MARCHE' ? 'rgba(131, 56, 236, 0.2)' : 'rgba(58, 134, 255, 0.2)', 
                        color: item.typeAcquisition === 'MARCHE' ? '#8338ec' : '#3a86ff',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {item.typeAcquisition}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'white' }}>{item.reference}</td>
                    <td>{item.objet}</td>
                    <td style={{ fontWeight: 600 }}>{item.fournisseur}</td>
                    <td>{item.montant ? `${item.montant} DH` : '-'}</td>
                    <td>{item.quantiteCommandee}</td>
                    <td>{item.quantiteLivree || 0}</td>
                    <td><Badge status={item.statut} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Acquisition */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: 'white', fontWeight: 800 }}>Fiche d'Acquisition BDC / Marché</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Type d'Acquisition *</label>
                  <select className="form-control" value={formData.typeAcquisition} onChange={e => setFormData({...formData, typeAcquisition: e.target.value})}>
                    <option value="BDC">Bon de Commande (BDC)</option>
                    <option value="MARCHE">Marché</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Référence N° *</label>
                  <input type="text" className="form-control" required value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} placeholder="ex: BDC-2026-004 ou N° 05/2026/DIAEA" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Objet de l'Acquisition *</label>
                <input type="text" className="form-control" required value={formData.objet} onChange={e => setFormData({...formData, objet: e.target.value})} placeholder="ex: Acquisition de 10 PC portables pour les cadres de la direction" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Fournisseur / Titulaire *</label>
                  <input type="text" className="form-control" required value={formData.fournisseur} onChange={e => setFormData({...formData, fournisseur: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Montant Total (DH)</label>
                  <input type="number" step="0.01" className="form-control" value={formData.montant} onChange={e => setFormData({...formData, montant: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Matériel Concerné</label>
                  <input type="text" className="form-control" value={formData.materielConcerne} onChange={e => setFormData({...formData, materielConcerne: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantité Commandée *</label>
                  <input type="number" min="1" className="form-control" required value={formData.quantiteCommandee} onChange={e => setFormData({...formData, quantiteCommandee: parseInt(e.target.value) || 1})} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Créer Acquisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
