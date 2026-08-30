import API from './axios';

// Referentiels
export const getDivisions = () => API.get('/referentiels/divisions');
export const createDivision = (data) => API.post('/referentiels/divisions', data);
export const deleteDivision = (id) => API.delete(`/referentiels/divisions/${id}`);

export const getServices = () => API.get('/referentiels/services');
export const createService = (data) => API.post('/referentiels/services', data);
export const deleteService = (id) => API.delete(`/referentiels/services/${id}`);

export const getProfils = () => API.get('/referentiels/profils');
export const createProfil = (data) => API.post('/referentiels/profils', data);

export const getMarques = () => API.get('/referentiels/marques');
export const createMarque = (data) => API.post('/referentiels/marques', data);
export const deleteMarque = (id) => API.delete(`/referentiels/marques/${id}`);

export const getTypesMateriel = () => API.get('/referentiels/types-materiel');
export const createTypeMateriel = (data) => API.post('/referentiels/types-materiel', data);
export const deleteTypeMateriel = (id) => API.delete(`/referentiels/types-materiel/${id}`);

export const getFournisseurs = () => API.get('/referentiels/fournisseurs');
export const createFournisseur = (data) => API.post('/referentiels/fournisseurs', data);
export const deleteFournisseur = (id) => API.delete(`/referentiels/fournisseurs/${id}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const marquerNotificationLue = (id) => API.put(`/notifications/${id}/lire`);
export const toutMarquerNotificationLu = () => API.put('/notifications/tout-lire');

// Acquisitions & Alimenter Stock
export const enregistrerReceptionAcquisition = (id, data) => API.post(`/acquisitions/${id}/enregistrer-reception`, data);
export const alimenterStockAcquisition = (id) => API.post(`/acquisitions/${id}/alimenter-stock`);

// Incidents & Interventions
export const getInterventionsIncident = (incidentId) => API.get(`/incidents/${incidentId}/interventions`);
export const ajouterInterventionIncident = (incidentId, data) => API.post(`/incidents/${incidentId}/interventions`, data);
