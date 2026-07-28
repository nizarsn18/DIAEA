import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export const WorkflowSteps = ({ currentStatus }) => {
  const steps = [
    { key: 'SOUMISE', label: 'Cadre Demandeur' },
    { key: 'EN_ATTENTE_VALIDATION_CS', label: 'Chef de Service' },
    { key: 'EN_ATTENTE_VALIDATION_CD', label: 'Chef de Division' },
    { key: 'TRANSMISE_CELLULE_INFO', label: 'Cellule Informatique' },
    { key: 'TRAITEMENT', label: 'Traitement / Décision' },
  ];

  const getStepState = (index, stepKey) => {
    if (currentStatus === 'REJETEE') return 'rejected';

    if (currentStatus === 'SATISFAITE' || currentStatus === 'TRANSMISE_DSI' || currentStatus === 'PROGRAMMEE_ACQUISITION') {
      return 'completed';
    }

    const statusOrder = [
      'SOUMISE',
      'EN_ATTENTE_VALIDATION_CS',
      'EN_ATTENTE_VALIDATION_CD',
      'TRANSMISE_CELLULE_INFO',
      'EN_COURS_TRAITEMENT'
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex > index) return 'completed';
    if (currentIndex === index) return 'active';
    return 'pending';
  };

  return (
    <div className="workflow-stepper">
      {steps.map((step, idx) => {
        const state = getStepState(idx, step.key);
        return (
          <div key={step.key} className={`step-item ${state}`}>
            <div className="step-circle">
              {state === 'completed' && <Check size={18} />}
              {state === 'active' && <Clock size={18} />}
              {state === 'rejected' && <AlertCircle size={18} color="#ef476f" />}
              {state === 'pending' && idx + 1}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
};
