import React, { useState, useEffect } from 'react';
import { Layers, Building, Tag, Laptop, Truck, Shield, Plus, Trash2, RefreshCw } from 'lucide-react';
import {
  getDivisions, createDivision, deleteDivision,
  getServices, createService, deleteService,
  getMarques, createMarque, deleteMarque,
  getTypesMateriel, createTypeMateriel, deleteTypeMateriel,
  getFournisseurs, createFournisseur, deleteFournisseur,
  getProfils, createProfil
} from '../api';

export const ReferentielPage = () => {
  const [activeTab, setActiveTab] = useState('divisions');

  const [divisions, setDivisions] = useState([]);
  const [services, setServices] = useState([]);
  const [marques, setMarques] = useState([]);
  const [types, setTypes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [profils, setProfils] = useState([]);

  const [loading, setLoading] = useState(false);

  // Forms
  const [newLibelle, setNewLibelle] = useState('');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [fournisseurForm, setFournisseurForm] = useState({ nom: '', adresse: '', contact: '', telephone: '' });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [divRes, srvRes, mrqRes, typRes, fourRes, prfRes] = await Promise.all([
        getDivisions(), getServices(), getMarques(), getTypesMateriel(), getFournisseurs(), getProfils()
      ]);
      setDivisions(divRes.data || []);
      setServices(srvRes.data || []);
      setMarques(mrqRes.data || []);
      setTypes(typRes.data || []);
      setFournisseurs(fourRes.data || []);
      setProfils(prfRes.data || []);
    } catch (err) {
      console.error("Erreur chargement référentiels", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddSimple = async (e, type) => {
    e.preventDefault();
    if (!newLibelle.trim()) return;

    try {
      if (type === 'division') await createDivision({ libelle: newLibelle });
      if (type === 'service') {
        const div = divisions.find(d => d.id === parseInt(selectedDivisionId));
        await createService({ libelle: newLibelle, division: div });
      }
      if (type === 'marque') await createMarque({ libelle: newLibelle });
      if (type === 'type') await createTypeMateriel({ libelle: newLibelle });
      if (type === 'profil') await createProfil({ libelle: newLibelle, description: 'Profil utilisateur' });

      setNewLibelle('');
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFournisseur = async (e) => {
    e.preventDefault();
    if (!fournisseurForm.nom.trim()) return;
    try {
      await createFournisseur(fournisseurForm);
      setFournisseurForm({ nom: '', adresse: '', contact: '', telephone: '' });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet élément ?")) return;
    try {
      if (type === 'division') await deleteDivision(id);
      if (type === 'service') await deleteService(id);
      if (type === 'marque') await deleteMarque(id);
      if (type === 'type') await deleteTypeMateriel(id);
      if (type === 'fournisseur') await deleteFournisseur(id);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'divisions', label: 'Divisions', icon: Layers },
    { id: 'services', label: 'Services', icon: Building },
    { id: 'marques', label: 'Marques', icon: Tag },
    { id: 'types', label: 'Types Matériel', icon: Laptop },
    { id: 'fournisseurs', label: 'Fournisseurs', icon: Truck },
    { id: 'profils', label: 'Profils', icon: Shield },
  ];

  return (
    <div>
      {/* Header Banner */}
      <div className="ref-header-card">
        <div>
          <h1 className="ref-header-title">
            <Layers size={28} />
            Gestion des Référentiels
          </h1>
          <p className="ref-header-subtitle">
            Gérez la hiérarchie organisationnelle, les marques, types d'équipements et fournisseurs.
          </p>
        </div>
        <button onClick={loadAll} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="ref-tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`ref-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="ref-content-card">
        {/* DIVISIONS */}
        {activeTab === 'divisions' && (
          <div>
            <form onSubmit={(e) => handleAddSimple(e, 'division')} className="ref-form-row">
              <input
                type="text"
                required
                value={newLibelle}
                onChange={(e) => setNewLibelle(e.target.value)}
                placeholder="Nom de la division (ex: Division des Systèmes d'Information)"
                className="form-control"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Plus size={16} /> Ajouter
              </button>
            </form>

            <div className="ref-grid">
              {divisions.map((d) => (
                <div key={d.id} className="ref-item-card">
                  <div>
                    <div className="ref-item-name">{d.libelle}</div>
                    <div className="ref-item-sub">{d.services?.length || 0} services associés</div>
                  </div>
                  <button onClick={() => handleDelete(d.id, 'division')} className="ref-delete-btn" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'services' && (
          <div>
            <form onSubmit={(e) => handleAddSimple(e, 'service')} className="ref-form-row">
              <input
                type="text"
                required
                value={newLibelle}
                onChange={(e) => setNewLibelle(e.target.value)}
                placeholder="Nom du service"
                className="form-control"
                style={{ flex: 1 }}
              />
              <select
                value={selectedDivisionId}
                onChange={(e) => setSelectedDivisionId(e.target.value)}
                className="form-control"
                style={{ flex: 1 }}
              >
                <option value="">-- Rattacher à une Division --</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.libelle}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Plus size={16} /> Ajouter Service
              </button>
            </form>

            <div className="ref-grid">
              {services.map((s) => (
                <div key={s.id} className="ref-item-card">
                  <div>
                    <div className="ref-item-name">{s.libelle}</div>
                    <div className="ref-item-sub">{s.division?.libelle || 'Aucune division'}</div>
                  </div>
                  <button onClick={() => handleDelete(s.id, 'service')} className="ref-delete-btn" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MARQUES */}
        {activeTab === 'marques' && (
          <div>
            <form onSubmit={(e) => handleAddSimple(e, 'marque')} className="ref-form-row">
              <input
                type="text"
                required
                value={newLibelle}
                onChange={(e) => setNewLibelle(e.target.value)}
                placeholder="Nom de la marque (ex: Dell, HP, Lenovo)"
                className="form-control"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Plus size={16} /> Ajouter Marque
              </button>
            </form>

            <div className="ref-grid">
              {marques.map((m) => (
                <div key={m.id} className="ref-item-card">
                  <div className="ref-item-name">{m.libelle}</div>
                  <button onClick={() => handleDelete(m.id, 'marque')} className="ref-delete-btn" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPES MATERIEL */}
        {activeTab === 'types' && (
          <div>
            <form onSubmit={(e) => handleAddSimple(e, 'type')} className="ref-form-row">
              <input
                type="text"
                required
                value={newLibelle}
                onChange={(e) => setNewLibelle(e.target.value)}
                placeholder="Type de matériel (ex: PC Portable, Imprimante, Scanner)"
                className="form-control"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Plus size={16} /> Ajouter Type
              </button>
            </form>

            <div className="ref-grid">
              {types.map((t) => (
                <div key={t.id} className="ref-item-card">
                  <div className="ref-item-name">{t.libelle}</div>
                  <button onClick={() => handleDelete(t.id, 'type')} className="ref-delete-btn" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOURNISSEURS */}
        {activeTab === 'fournisseurs' && (
          <div>
            <form onSubmit={handleAddFournisseur} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nom du fournisseur *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Maroc Bureau IT"
                  value={fournisseurForm.nom}
                  onChange={(e) => setFournisseurForm({ ...fournisseurForm, nom: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  placeholder="ex: 0537000000"
                  value={fournisseurForm.telephone}
                  onChange={(e) => setFournisseurForm({ ...fournisseurForm, telephone: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Personne de contact</label>
                <input
                  type="text"
                  placeholder="ex: M. Alami"
                  value={fournisseurForm.contact}
                  onChange={(e) => setFournisseurForm({ ...fournisseurForm, contact: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  placeholder="ex: Avenue Hassan II, Rabat"
                  value={fournisseurForm.adresse}
                  onChange={(e) => setFournisseurForm({ ...fournisseurForm, adresse: e.target.value })}
                  className="form-control"
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Plus size={16} /> Enregistrer Fournisseur
                </button>
              </div>
            </form>

            <div className="ref-grid">
              {fournisseurs.map((f) => (
                <div key={f.id} className="ref-item-card">
                  <div>
                    <div className="ref-item-name">{f.nom}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.adresse || 'Aucune adresse'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.2rem' }}>
                      Contact: {f.contact || 'N/A'} | Tél: {f.telephone || 'N/A'}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(f.id, 'fournisseur')} className="ref-delete-btn" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILS */}
        {activeTab === 'profils' && (
          <div>
            <form onSubmit={(e) => handleAddSimple(e, 'profil')} className="ref-form-row">
              <input
                type="text"
                required
                value={newLibelle}
                onChange={(e) => setNewLibelle(e.target.value)}
                placeholder="Libellé du profil (ex: Chef de Service, Cadre)"
                className="form-control"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Plus size={16} /> Ajouter Profil
              </button>
            </form>

            <div className="ref-grid">
              {profils.map((p) => (
                <div key={p.id} className="ref-item-card">
                  <div>
                    <div className="ref-item-name">{p.libelle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.description || 'Profil utilisateur'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferentielPage;
