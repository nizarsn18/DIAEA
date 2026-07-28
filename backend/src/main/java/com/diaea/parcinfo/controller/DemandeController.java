package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.DemandeMateriel;
import com.diaea.parcinfo.model.StatutDemande;
import com.diaea.parcinfo.model.Utilisateur;
import com.diaea.parcinfo.repository.DemandeMaterielRepository;
import com.diaea.parcinfo.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/demandes")
public class DemandeController {

    @Autowired
    private DemandeMaterielRepository demandeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @GetMapping
    public ResponseEntity<List<DemandeMateriel>> getAllDemandes(
            Authentication authentication,
            @RequestParam(required = false) StatutDemande statut) {
        
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        boolean isCelluleOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CELLULE_INFORMATIQUE") || a.getAuthority().contains("ADMINISTRATEUR"));

        if (isCelluleOrAdmin) {
            if (statut != null) {
                return ResponseEntity.ok(demandeRepository.findByStatut(statut));
            }
            return ResponseEntity.ok(demandeRepository.findAll());
        }

        boolean isChefService = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CHEF_SERVICE"));
        if (isChefService) {
            return ResponseEntity.ok(demandeRepository.findByDemandeurServiceAndStatut(user.getService(), StatutDemande.EN_ATTENTE_VALIDATION_CS));
        }

        boolean isChefDivision = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CHEF_DIVISION"));
        if (isChefDivision) {
            return ResponseEntity.ok(demandeRepository.findByDemandeurDivisionAndStatut(user.getDivision(), StatutDemande.EN_ATTENTE_VALIDATION_CD));
        }

        // Par défaut: demandes de l'utilisateur connecté
        return ResponseEntity.ok(demandeRepository.findByDemandeurId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<DemandeMateriel> createDemande(@RequestBody DemandeMateriel demande, Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        demande.setDemandeur(user);
        demande.setNumeroDemande("DEM-" + System.currentTimeMillis() / 1000);
        demande.setStatut(StatutDemande.EN_ATTENTE_VALIDATION_CS);
        return ResponseEntity.ok(demandeRepository.save(demande));
    }

    // Validation Chef de Service
    @PutMapping("/{id}/valider-cs")
    @PreAuthorize("hasAnyRole('CHEF_SERVICE', 'ADMINISTRATEUR')")
    public ResponseEntity<DemandeMateriel> validerChefService(
            @PathVariable Long id,
            @RequestParam Boolean valide,
            @RequestParam(required = false) String avis) {

        return demandeRepository.findById(id).map(demande -> {
            demande.setValidationChefService(valide);
            demande.setAvisChefService(avis);
            demande.setDateValidationCS(LocalDateTime.now());
            if (valide) {
                demande.setStatut(StatutDemande.EN_ATTENTE_VALIDATION_CD);
            } else {
                demande.setStatut(StatutDemande.REJETEE);
            }
            return ResponseEntity.ok(demandeRepository.save(demande));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Validation Chef de Division
    @PutMapping("/{id}/valider-cd")
    @PreAuthorize("hasAnyRole('CHEF_DIVISION', 'ADMINISTRATEUR')")
    public ResponseEntity<DemandeMateriel> validerChefDivision(
            @PathVariable Long id,
            @RequestParam Boolean valide,
            @RequestParam(required = false) String avis) {

        return demandeRepository.findById(id).map(demande -> {
            demande.setValidationChefDivision(valide);
            demande.setAvisChefDivision(avis);
            demande.setDateValidationCD(LocalDateTime.now());
            if (valide) {
                demande.setStatut(StatutDemande.TRANSMISE_CELLULE_INFO);
            } else {
                demande.setStatut(StatutDemande.REJETEE);
            }
            return ResponseEntity.ok(demandeRepository.save(demande));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Décision Cellule Informatique
    @PutMapping("/{id}/decision-cellule")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<DemandeMateriel> decisionCelluleInfo(
            @PathVariable Long id,
            @RequestParam StatutDemande nouveauStatut,
            @RequestParam(required = false) String decision) {

        return demandeRepository.findById(id).map(demande -> {
            demande.setStatut(nouveauStatut);
            demande.setDecisionCelluleInfo(decision);
            demande.setDateDecisionCelluleInfo(LocalDateTime.now());
            return ResponseEntity.ok(demandeRepository.save(demande));
        }).orElse(ResponseEntity.notFound().build());
    }
}
