import React, { useState, useEffect } from 'react';
import { X, Wrench, Plus, Clock, User, CheckCircle2 } from 'lucide-react';
import { getInterventionsIncident, ajouterInterventionIncident } from '../api';

const InterventionModal = ({ incident, onClose }) => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionRealisee, setActionRealisee] = useState('');
  const [dureeMinutes, setDureeMinutes] = useState(30);
  const [statutIntervention, setStatutIntervention] = useState('TERMINEE');
  const [submitting, setSubmitting] = useState(false);

  const fetchInterventions = async () => {
    try {
      const res = await getInterventionsIncident(incident.id);
      setInterventions(res.data || []);
    } catch (err) {
      console.error("Erreur chargement interventions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incident) fetchInterventions();
  }, [incident]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actionRealisee.trim()) return;

    setSubmitting(true);
    try {
      await ajouterInterventionIncident(incident.id, {
        actionRealisee,
        dureeMinutes: parseInt(dureeMinutes),
        statutIntervention
      });
      setActionRealisee('');
      fetchInterventions();
    } catch (err) {
      console.error("Erreur ajout intervention", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Interventions - Ticket {incident?.numeroTicket}
              </h2>
              <p className="text-xs text-slate-500">{incident?.descriptionProbleme}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire ajout intervention */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" /> Enregistrer une nouvelle intervention
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Actions réalisées *</label>
            <textarea
              required
              rows={3}
              value={actionRealisee}
              onChange={(e) => setActionRealisee(e.target.value)}
              placeholder="Décrivez les manipulations, diagnostics et corrections effectués..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Durée (minutes)</label>
              <input
                type="number"
                min="5"
                step="5"
                value={dureeMinutes}
                onChange={(e) => setDureeMinutes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Statut Intervention</label>
              <select
                value={statutIntervention}
                onChange={(e) => setStatutIntervention(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              >
                <option value="TERMINEE">Terminée</option>
                <option value="EN_COURS">En Cours</option>
                <option value="EN_ATTENTE">En Attente de pièce</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-sm transition-all"
            >
              {submitting ? 'Enregistrement...' : 'Ajouter l\'intervention'}
            </button>
          </div>
        </form>

        {/* Historique des interventions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Historique des interventions</h3>
          {loading ? (
            <div className="text-center py-4 text-xs text-slate-400">Chargement des interventions...</div>
          ) : interventions.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl">
              Aucune intervention enregistrée pour ce ticket.
            </div>
          ) : (
            <div className="space-y-3">
              {interventions.map((inv) => (
                <div key={inv.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                      <User className="w-3.5 h-3.5" />
                      {inv.agentCellule?.prenom} {inv.agentCellule?.nom}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {inv.dureeMinutes} min</span>
                      <span>{new Date(inv.dateIntervention).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                    {inv.actionRealisee}
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {inv.statutIntervention}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterventionModal;
