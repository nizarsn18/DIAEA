import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { Badge } from '../components/Badge';
import { PVModal } from '../components/PVModal';
import { AuthContext } from '../context/AuthContext';
import { exportToExcel } from '../utils/exportUtils';
import { Plus, Search, Filter, Printer, Download, UserCheck } from 'lucide-react';

export const MaterielPage = () => {
  const { hasRole } = useContext(AuthContext);
  const [materiels, setMateriels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEtat, setFilterEtat] = useState('');
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [selectedPV, setSelectedPV] = useState(null);
  const [affectModal, setAffectModal] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    codeInventaire: '',
    typeMateriel: 'PC Portable',
    marque: '',
    modele: '',
    numeroSerie: '',
    caracteristiquesTechniques: '',
    sourceAcquisition: 'BDC',
    referenceAcquisition: '',
    garantie: '2 Ans',
    etatMateriel: 'DISPONIBLE',
    localisation: ''
  });

  const [affectData, setAffectData] = useState({
    utilisateurId: '',
    motif: 'NOUVELLE_AFFECTATION',
    etatRemise: 'Bon état',
    accessoiresRemis: 'Sacoche, chargeur, câble',
    observations: ''
  });

  const loadData = () => {
    setLoading(true);
    let url = '/materiels';
    if (filterEtat) url += `?etat=${filterEtat}`;
    API.get(url)
      .then(res => setMateriels(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    if (hasRole('CELLULE_INFORMATIQUE') || hasRole('ADMINISTRATEUR')) {
      API.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
    }
  }, [filterEtat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/materiels', formData);
      setShowModal(false);
      loadData();
      setFormData({
        codeInventaire: '',
        typeMateriel: 'PC Portable',
        marque: '',
        modele: '',
        numeroSerie: '',
        caracteristiquesTechniques: '',
        sourceAcquisition: 'BDC',
        referenceAcquisition: '',
        garantie: '2 Ans',
        etatMateriel: 'DISPONIBLE',
        localisation: ''
      });
    } catch (err) {
      alert("Erreur lors de l'enregistrement du matériel.");
    }
  };

  const handleAffecterSubmit = async (e) => {
    e.preventDefault();
    if (!affectModal || !affectData.utilisateurId) return;
    try {
      await API.post('/affectations', {
        materiel: { id: affectModal.id },
        utilisateurAffectataire: { id: affectData.utilisateurId },
        motif: affectData.motif,
        etatRemise: affectData.etatRemise,
        accessoiresRemis: affectData.accessoiresRemis,
        observations: affectData.observations
      });
      setAffectModal(null);
      loadData();
    } catch (err) {
      alert("Erreur lors de l'affectation.");
    }
  };

  const handleExportExcel = () => {
    const formatted = filteredMateriels.map(m => ({
      'Code Inventaire': m.codeInventaire,
      'Type': m.typeMateriel,
      'Marque': m.marque,
      'Modèle': m.modele,
      'Numéro de Série': m.numeroSerie,
      'État': m.etatMateriel,
      'Localisation': m.localisation,
      'Affectataire': m.utilisateurAffectataire ? `${m.utilisateurAffectataire.prenom} ${m.utilisateurAffectataire.nom}` : 'Non affecté',
      'Garantie': m.garantie
    }));
    exportToExcel(formatted, 'parc_informatique_diaea.xlsx', 'Matériels');
  };

  const filteredMateriels = materiels.filter(m => 
    m.codeInventaire?.toLowerCase().includes(search.toLowerCase()) ||
    m.marque?.toLowerCase().includes(search.toLowerCase()) ||
    m.modele?.toLowerCase().includes(search.toLowerCase()) ||
    m.typeMateriel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Gestion du Parc Informatique</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Inventaire officiel et traçabilité des équipements de la DIAEA</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <Download size={18} /> Exporter Excel
          </button>
          {hasRole('CELLULE_INFORMATIQUE') && (
            <button className="btn btn-success" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Nouveau Matériel
            </button>
          )}
        </div>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par code inventaire, marque, modèle..."
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ width: '180px' }}
              value={filterEtat}
              onChange={(e) => setFilterEtat(e.target.value)}
            >
              <option value="">Tous les états</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="AFFECTE">Affecté</option>
              <option value="EN_PANNE">En Panne</option>
              <option value="EN_REPARATION">En Réparation</option>
              <option value="REFORME">Réformé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table du parc */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code Inventaire</th>
                <th>Type</th>
                <th>Marque & Modèle</th>
                <th>N° Série</th>
                <th>État</th>
                <th>Localisation</th>
                <th>Affectataire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Chargement du parc...</td></tr>
              ) : filteredMateriels.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucun matériel trouvé</td></tr>
              ) : (
                filteredMateriels.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.codeInventaire}</td>
                    <td>{item.typeMateriel}</td>
                    <td style={{ fontWeight: 600 }}>{item.marque} {item.modele}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.numeroSerie || '-'}</td>
                    <td><Badge status={item.etatMateriel} /></td>
                    <td>{item.localisation || 'Stock Cellule IT'}</td>
                    <td>
                      {item.utilisateurAffectataire 
                        ? `${item.utilisateurAffectataire.prenom} ${item.utilisateurAffectataire.nom}`
                        : <span style={{ color: 'var(--text-dim)', italic: 'true' }}>Non affecté</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {item.etatMateriel === 'AFFECTE' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => setSelectedPV(item)}
                            title="Générer & Imprimer le PV d'Affectation"
                          >
                            <Printer size={14} /> PV Officiel
                          </button>
                        )}
                        {hasRole('CELLULE_INFORMATIQUE') && item.etatMateriel === 'DISPONIBLE' && (
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => setAffectModal(item)}
                          >
                            <UserCheck size={14} /> Affecter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de matériel */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: 'white', fontWeight: 800 }}>Nouveau Matériel Informatique</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Code Inventaire DIAEA *</label>
                  <input type="text" className="form-control" required value={formData.codeInventaire} onChange={e => setFormData({...formData, codeInventaire: e.target.value})} placeholder="ex: DIAEA-2026-PC-0003" />
                </div>
                <div className="form-group">
                  <label className="form-label">Type de Matériel *</label>
                  <select className="form-control" value={formData.typeMateriel} onChange={e => setFormData({...formData, typeMateriel: e.target.value})}>
                    <option value="PC Portable">PC Portable</option>
                    <option value="Ordinateur de bureau">Ordinateur de bureau</option>
                    <option value="Imprimante">Imprimante</option>
                    <option value="Scanner">Scanner</option>
                    <option value="Vidéoprojecteur">Vidéoprojecteur</option>
                    <option value="Équipement Réseau">Équipement Réseau</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Marque *</label>
                  <input type="text" className="form-control" required value={formData.marque} onChange={e => setFormData({...formData, marque: e.target.value})} placeholder="ex: Dell, HP, Lenovo" />
                </div>
                <div className="form-group">
                  <label className="form-label">Modèle *</label>
                  <input type="text" className="form-control" required value={formData.modele} onChange={e => setFormData({...formData, modele: e.target.value})} placeholder="ex: Latitude 5440" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">N° de Série</label>
                  <input type="text" className="form-control" value={formData.numeroSerie} onChange={e => setFormData({...formData, numeroSerie: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Localisation initiale</label>
                  <input type="text" className="form-control" value={formData.localisation} onChange={e => setFormData({...formData, localisation: e.target.value})} placeholder="ex: Bureau 104" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Caractéristiques Techniques</label>
                <textarea className="form-control" rows="2" value={formData.caracteristiquesTechniques} onChange={e => setFormData({...formData, caracteristiquesTechniques: e.target.value})} placeholder="RAM, CPU, Capacité disque..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-success">Enregistrer Matériel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'affectation rapide */}
      {affectModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: 'white', fontWeight: 800 }}>Affecter le Matériel : {affectModal.codeInventaire}</h3>
              <button onClick={() => setAffectModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleAffecterSubmit}>
              <div className="form-group">
                <label className="form-label">Choisir l'Affectataire *</label>
                <select className="form-control" required value={affectData.utilisateurId} onChange={e => setAffectData({...affectData, utilisateurId: e.target.value})}>
                  <option value="">-- Sélectionner un agent DIAEA --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.prenom} {u.nom} ({u.service || u.division || 'DIAEA'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Motif d'affectation</label>
                  <select className="form-control" value={affectData.motif} onChange={e => setAffectData({...affectData, motif: e.target.value})}>
                    <option value="NOUVELLE_AFFECTATION">Nouvelle Affectation</option>
                    <option value="REMPLACEMENT">Remplacement</option>
                    <option value="RENFORCEMENT">Renforcement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">État du matériel à la remise</label>
                  <input type="text" className="form-control" value={affectData.etatRemise} onChange={e => setAffectData({...affectData, etatRemise: e.target.value})} placeholder="Bon état, Neuf, Utilisé" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Accessoires Remis</label>
                <input type="text" className="form-control" value={affectData.accessoiresRemis} onChange={e => setAffectData({...affectData, accessoiresRemis: e.target.value})} placeholder="Sacoche, chargeur, câble Ethernet..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setAffectModal(null)}>Annuler</button>
                <button type="submit" className="btn btn-success">Valider l'Affectation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal PV Officiel */}
      {selectedPV && (
        <PVModal materiel={selectedPV} onClose={() => setSelectedPV(null)} />
      )}
    </div>
  );
};
