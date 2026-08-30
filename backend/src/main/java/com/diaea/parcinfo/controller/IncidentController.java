package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.Incident;
import com.diaea.parcinfo.model.Intervention;
import com.diaea.parcinfo.model.StatutIncident;
import com.diaea.parcinfo.model.Utilisateur;
import com.diaea.parcinfo.repository.IncidentRepository;
import com.diaea.parcinfo.repository.InterventionRepository;
import com.diaea.parcinfo.repository.UtilisateurRepository;
import com.diaea.parcinfo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private InterventionRepository interventionRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents(
            Authentication authentication,
            @RequestParam(required = false) StatutIncident statut) {

        boolean isCelluleOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CELLULE_INFORMATIQUE") || a.getAuthority().contains("ADMINISTRATEUR"));

        if (isCelluleOrAdmin) {
            if (statut != null) {
                return ResponseEntity.ok(incidentRepository.findByStatut(statut));
            }
            return ResponseEntity.ok(incidentRepository.findAll());
        }

        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(incidentRepository.findByDeclarantId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident, Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        incident.setDeclarant(user);
        incident.setNumeroTicket("TICK-" + System.currentTimeMillis() / 1000);
        incident.setStatut(StatutIncident.NOUVEAU);
        Incident saved = incidentRepository.save(incident);

        notificationService.envoyer(user, "INCIDENT", "Votre ticket d'incident N° " + saved.getNumeroTicket() + " a été ouvert.");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/traiter")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    @Transactional
    public ResponseEntity<Incident> traiterIncident(
            @PathVariable Long id,
            @RequestParam StatutIncident statut,
            @RequestParam(required = false) String actionRealisee,
            @RequestParam(required = false) Integer dureeMinutes,
            Authentication authentication) {

        Utilisateur agent = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();

        return incidentRepository.findById(id).map(incident -> {
            incident.setAgentTraitement(agent);
            incident.setStatut(statut);
            if (actionRealisee != null) {
                incident.setActionRealisee(actionRealisee);
            }
            if (statut == StatutIncident.RESOLU || statut == StatutIncident.CLOTURE) {
                incident.setDateCloture(LocalDateTime.now());
            }

            // Enregistrer l'Intervention
            if (actionRealisee != null && !actionRealisee.isBlank()) {
                Intervention intervention = Intervention.builder()
                        .incident(incident)
                        .agentCellule(agent)
                        .dateIntervention(LocalDateTime.now())
                        .actionRealisee(actionRealisee)
                        .dureeMinutes(dureeMinutes != null ? dureeMinutes : 30)
                        .statutIntervention(statut.name())
                        .build();
                interventionRepository.save(intervention);
            }

            Incident saved = incidentRepository.save(incident);

            notificationService.envoyer(
                    incident.getDeclarant(),
                    "INCIDENT",
                    "Le statut de votre ticket N° " + incident.getNumeroTicket() + " est désormais : " + statut
            );

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/interventions")
    public ResponseEntity<List<Intervention>> getInterventionsByIncident(@PathVariable Long id) {
        return ResponseEntity.ok(interventionRepository.findByIncidentIdOrderByDateInterventionDesc(id));
    }

    @PostMapping("/{id}/interventions")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<Intervention> ajouterIntervention(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {

        Utilisateur agent = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();

        return incidentRepository.findById(id).map(incident -> {
            String action = (String) body.get("actionRealisee");
            Integer duree = body.get("dureeMinutes") != null ? Integer.parseInt(body.get("dureeMinutes").toString()) : 30;
            String statutIntervention = (String) body.getOrDefault("statutIntervention", "TERMINEE");

            Intervention intervention = Intervention.builder()
                    .incident(incident)
                    .agentCellule(agent)
                    .dateIntervention(LocalDateTime.now())
                    .actionRealisee(action)
                    .dureeMinutes(duree)
                    .statutIntervention(statutIntervention)
                    .build();

            Intervention saved = interventionRepository.save(intervention);
            incident.setActionRealisee(action);
            incidentRepository.save(incident);

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
