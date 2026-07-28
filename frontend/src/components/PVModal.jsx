import React from 'react';
import { Printer, X } from 'lucide-react';

export const PVModal = ({ materiel, onClose }) => {
  if (!materiel) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '800px', background: '#fff', color: '#111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }} className="no-print">
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} /> Imprimer le PV Officiel
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            <X size={18} /> Fermer
          </button>
        </div>

        {/* Document PV Imprimable Officiel */}
        <div className="pv-document">
          <div className="pv-header">
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>ROYAUME DU MAROC</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>MINISTÈRE DE L'AGRICULTURE, DU DÉVELOPPEMENT RURAL ET DES EAUX ET FORÊTS</div>
            <div style={{ fontSize: '0.85rem', color: '#006233', fontWeight: 'bold' }}>
              DIRECTION DE L'IRRIGATION ET DE L'AMÉNAGEMENT DE L'ESPACE AGRICOLE (DIAEA)
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', fontStyle: 'italic' }}>
              CELLULE DE LA GESTION ET DE LA SÉCURITÉ DES SYSTÈMES D'INFORMATION
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Rabat, le {today}
          </div>

          <div className="pv-title">
            PROCÈS-VERBAL D'AFFECTATION DE MATÉRIEL INFORMATIQUE
          </div>

          <div style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              Le matériel informatique ci-dessous désigné est mis à la disposition de l'agent suivant pour les besoins du service :
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', border: '1px solid #333' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '35%', background: '#f5f5f5' }}>Nom & Prénom de l'affectataire :</td>
                  <td style={{ padding: '0.5rem' }}>
                    {materiel.utilisateurAffectataire ? `${materiel.utilisateurAffectataire.prenom} ${materiel.utilisateurAffectataire.nom}` : 'Agent DIAEA'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5' }}>Fonction :</td>
                  <td style={{ padding: '0.5rem' }}>{materiel.utilisateurAffectataire?.fonction || 'Cadre Technique'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5' }}>Division / Service :</td>
                  <td style={{ padding: '0.5rem' }}>
                    {materiel.utilisateurAffectataire?.division} - {materiel.utilisateurAffectataire?.service || ''}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5' }}>Localisation physique :</td>
                  <td style={{ padding: '0.5rem' }}>{materiel.localisation || 'Bureau affectataire'}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', color: '#006233' }}>
              Désignation de l'équipement informatique :
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', border: '1px solid #333' }}>
              <thead>
                <tr style={{ background: '#006233', color: 'white' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid #333' }}>Code Inventaire DIAEA</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #333' }}>Type</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #333' }}>Marque & Modèle</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #333' }}>N° de Série</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center', fontWeight: 'bold' }}>{materiel.codeInventaire}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center' }}>{materiel.typeMateriel}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center' }}>{materiel.marque} {materiel.modele}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center' }}>{materiel.numeroSerie || '-'}</td>
                </tr>
              </tbody>
            </table>

            {materiel.caracteristiquesTechniques && (
              <div style={{ fontSize: '0.85rem', marginBottom: '1rem', background: '#f9f9f9', padding: '0.75rem', borderLeft: '3px solid #006233' }}>
                <strong>Spécifications techniques :</strong> {materiel.caracteristiquesTechniques}
              </div>
            )}

            <div style={{ fontSize: '0.85rem', marginTop: '1.5rem', fontStyle: 'italic' }}>
              <strong>Engagement de l'agent :</strong> L'affectataire s'engage à veiller au bon entretien du matériel confié, à ne pas le céder ni le déplacer sans autorisation préalable de la Cellule Informatique, et à le restituer obligatoirement en cas de mutation, de départ ou de remplacement.
            </div>
          </div>

          <div className="pv-signatures">
            <div className="pv-signature-box">
              Signature de l'Affectataire<br />
              <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>(Lu et approuvé)</span>
            </div>
            <div className="pv-signature-box">
              Visa du Chef de Service<br />
              <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>(Visa et cachet)</span>
            </div>
            <div className="pv-signature-box">
              Pour la Cellule Informatique<br />
              <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>(Validation DIAEA)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
