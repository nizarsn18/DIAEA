import React from 'react';

export const Badge = ({ status }) => {
  let badgeClass = 'badge-info';
  let label = status;

  switch (status) {
    case 'DISPONIBLE':
    case 'SATISFAITE':
    case 'RESOLU':
    case 'CLOTURE':
    case 'ACCEPTEE':
    case 'LIVRE':
      badgeClass = 'badge-success';
      break;
    case 'EN_ATTENTE_VALIDATION_CS':
    case 'EN_ATTENTE_VALIDATION_CD':
    case 'SOUMISE':
    case 'EN_COURS':
    case 'EN_PREPARATION':
      badgeClass = 'badge-warning';
      break;
    case 'EN_PANNE':
    case 'REJETEE':
    case 'PERDU':
      badgeClass = 'badge-danger';
      break;
    case 'AFFECTE':
    case 'TRANSMISE_DSI':
    case 'TRANSMISE_CELLULE_INFO':
    default:
      badgeClass = 'badge-info';
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {label}
    </span>
  );
};
