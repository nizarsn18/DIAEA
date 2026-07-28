package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.dto.DashboardStatsDTO;
import com.diaea.parcinfo.model.EtatMateriel;
import com.diaea.parcinfo.model.StatutDemande;
import com.diaea.parcinfo.model.StatutIncident;
import com.diaea.parcinfo.repository.DemandeMaterielRepository;
import com.diaea.parcinfo.repository.IncidentRepository;
import com.diaea.parcinfo.repository.MaterielRepository;
import com.diaea.parcinfo.repository.SuiviDSIRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private MaterielRepository materielRepository;

    @Autowired
    private DemandeMaterielRepository demandeRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private SuiviDSIRepository suiviDSIRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        long totalEquipements = materielRepository.count();
        long materielsAffectes = materielRepository.countByEtatMateriel(EtatMateriel.AFFECTE);
        long materielsDisponibles = materielRepository.countByEtatMateriel(EtatMateriel.DISPONIBLE);
        long materielsEnPanne = materielRepository.countByEtatMateriel(EtatMateriel.EN_PANNE);

        long demandesEnAttente = demandeRepository.countByStatut(StatutDemande.EN_ATTENTE_VALIDATION_CS) +
                                 demandeRepository.countByStatut(StatutDemande.EN_ATTENTE_VALIDATION_CD) +
                                 demandeRepository.countByStatut(StatutDemande.TRANSMISE_CELLULE_INFO);

        long demandesTransmisesDSI = demandeRepository.countByStatut(StatutDemande.TRANSMISE_DSI);
        long demandesSatisfaites = demandeRepository.countByStatut(StatutDemande.SATISFAITE);

        long incidentsOuverts = incidentRepository.countByStatut(StatutIncident.NOUVEAU) +
                                incidentRepository.countByStatut(StatutIncident.EN_COURS);
        long incidentsClotures = incidentRepository.countByStatut(StatutIncident.CLOTURE) +
                                 incidentRepository.countByStatut(StatutIncident.RESOLU);

        List<Object[]> groupedType = materielRepository.countByGroupedType();
        Map<String, Long> materielParType = new HashMap<>();
        for (Object[] row : groupedType) {
            materielParType.put((String) row[0], (Long) row[1]);
        }

        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalEquipements(totalEquipements)
                .materielsAffectes(materielsAffectes)
                .materielsDisponibles(materielsDisponibles)
                .materielsEnPanne(materielsEnPanne)
                .demandesEnAttente(demandesEnAttente)
                .demandesTransmisesDSI(demandesTransmisesDSI)
                .demandesSatisfaites(demandesSatisfaites)
                .incidentsOuverts(incidentsOuverts)
                .incidentsClotures(incidentsClotures)
                .materielParType(materielParType)
                .build();

        return ResponseEntity.ok(stats);
    }
}
