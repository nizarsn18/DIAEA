package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.Incident;
import com.diaea.parcinfo.model.StatutIncident;
import com.diaea.parcinfo.model.Utilisateur;
import com.diaea.parcinfo.repository.IncidentRepository;
import com.diaea.parcinfo.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

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
        return ResponseEntity.ok(incidentRepository.save(incident));
    }

    @PutMapping("/{id}/traiter")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<Incident> traiterIncident(
            @PathVariable Long id,
            @RequestParam StatutIncident statut,
            @RequestParam(required = false) String actionRealisee,
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
            return ResponseEntity.ok(incidentRepository.save(incident));
        }).orElse(ResponseEntity.notFound().build());
    }
}
